"""Train baseline chatbot classifiers for the pharmacy e-commerce demo.

This script is the local equivalent of the Kaggle notebook. It trains two
simple, explainable scikit-learn baselines from the self-seeded dataset:

- intent classifier
- target category classifier

The exported artifacts are loaded later by services/chatbot_service.
"""

from __future__ import annotations

import argparse
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    precision_recall_fscore_support,
)
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder


PROJECT_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DATASET_PATH = PROJECT_ROOT / "ml" / "datasets" / "chatbot_training_seed.csv"
DEFAULT_ARTIFACT_DIR = PROJECT_ROOT / "ml" / "artifacts"
DEFAULT_REPORT_DIR = PROJECT_ROOT / "ml" / "reports"

REQUIRED_COLUMNS = {
    "text",
    "intent",
    "target_category",
    "safe_response_template",
    "requires_medical_disclaimer",
}


def clean_text(value: Any) -> str:
    """Normalize text while preserving healthcare/product keywords."""
    text = "" if value is None else str(value)
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text


def validate_dataset(df: pd.DataFrame) -> None:
    missing_columns = REQUIRED_COLUMNS.difference(df.columns)
    if missing_columns:
        missing = ", ".join(sorted(missing_columns))
        raise ValueError(f"Dataset is missing required columns: {missing}")

    if df["text"].isna().any() or df["intent"].isna().any():
        raise ValueError("Dataset contains empty text or intent values.")


def summarize_split(labels: pd.Series) -> dict[str, int]:
    return {str(label): int(count) for label, count in labels.value_counts().sort_index().items()}


def train_classifier(
    texts: pd.Series,
    labels: pd.Series,
    *,
    test_size: float,
    random_state: int,
) -> dict[str, Any]:
    encoder = LabelEncoder()
    encoded_labels = encoder.fit_transform(labels)

    stratify = encoded_labels if labels.value_counts().min() >= 2 else None
    x_train, x_test, y_train, y_test = train_test_split(
        texts,
        encoded_labels,
        test_size=test_size,
        random_state=random_state,
        stratify=stratify,
    )

    vectorizer = TfidfVectorizer(
        lowercase=True,
        strip_accents="unicode",
        ngram_range=(1, 2),
        min_df=1,
        max_features=5000,
    )
    x_train_vectorized = vectorizer.fit_transform(x_train)
    x_test_vectorized = vectorizer.transform(x_test)

    model = LogisticRegression(
        max_iter=1000,
        class_weight="balanced",
        random_state=random_state,
    )
    model.fit(x_train_vectorized, y_train)

    y_pred = model.predict(x_test_vectorized)
    labels_for_report = list(range(len(encoder.classes_)))
    target_names = [str(label) for label in encoder.classes_]
    precision, recall, f1, _ = precision_recall_fscore_support(
        y_test,
        y_pred,
        labels=labels_for_report,
        average="weighted",
        zero_division=0,
    )

    metrics = {
        "accuracy": float(accuracy_score(y_test, y_pred)),
        "precision": float(precision),
        "recall": float(recall),
        "f1-score": float(f1),
        "classification_report": classification_report(
            y_test,
            y_pred,
            labels=labels_for_report,
            target_names=target_names,
            output_dict=True,
            zero_division=0,
        ),
        "confusion_matrix": confusion_matrix(
            y_test,
            y_pred,
            labels=labels_for_report,
        ).tolist(),
        "labels": target_names,
        "train_rows": int(len(x_train)),
        "test_rows": int(len(x_test)),
        "train_label_distribution": summarize_split(pd.Series(encoder.inverse_transform(y_train))),
        "test_label_distribution": summarize_split(pd.Series(encoder.inverse_transform(y_test))),
    }

    return {
        "vectorizer": vectorizer,
        "model": model,
        "encoder": encoder,
        "metrics": metrics,
    }


def write_metrics_report(metrics: dict[str, Any], report_path: Path) -> None:
    intent = metrics["intent"]
    category = metrics["category"]
    lines = [
        "# Chatbot Baseline Training Metrics",
        "",
        "The chatbot models are simple TF-IDF + Logistic Regression baselines trained on self-seeded academic demo data.",
        "",
        "| Model | Accuracy | Precision | Recall | F1-score |",
        "|---|---:|---:|---:|---:|",
        (
            f"| Intent classifier | {intent['accuracy']:.4f} | {intent['precision']:.4f} | "
            f"{intent['recall']:.4f} | {intent['f1-score']:.4f} |"
        ),
        (
            f"| Category classifier | {category['accuracy']:.4f} | {category['precision']:.4f} | "
            f"{category['recall']:.4f} | {category['f1-score']:.4f} |"
        ),
        "",
        "Safety note: the dataset is self-seeded and is not clinically validated. The chatbot must only provide general product suggestions.",
        "",
    ]
    report_path.write_text("\n".join(lines), encoding="utf-8")


def train_and_export(
    dataset_path: Path,
    artifact_dir: Path,
    report_dir: Path,
    *,
    test_size: float,
    random_state: int,
) -> dict[str, Any]:
    df = pd.read_csv(dataset_path)
    validate_dataset(df)

    df = df.copy()
    df["text"] = df["text"].astype(str)
    df["intent"] = df["intent"].astype(str)
    df["target_category"] = df["target_category"].fillna("").astype(str).str.strip()

    category_df = df[df["target_category"] != ""].copy()
    if category_df.empty:
        raise ValueError("No target_category rows are available for category model training.")

    intent_result = train_classifier(
        df["text"],
        df["intent"],
        test_size=test_size,
        random_state=random_state,
    )
    category_result = train_classifier(
        category_df["text"],
        category_df["target_category"],
        test_size=test_size,
        random_state=random_state,
    )

    artifact_dir.mkdir(parents=True, exist_ok=True)
    report_dir.mkdir(parents=True, exist_ok=True)

    label_encoders = {
        "intent": intent_result["encoder"],
        "category": category_result["encoder"],
    }
    metrics = {
        "intent": intent_result["metrics"],
        "category": category_result["metrics"],
    }
    metadata = {
        "project": "Healthcare Pharmacy E-Commerce Microservices System",
        "model_family": "TF-IDF + Logistic Regression baseline",
        "trained_at_utc": datetime.now(timezone.utc).isoformat(),
        "dataset_path": str(dataset_path),
        "dataset_rows": int(len(df)),
        "category_training_rows": int(len(category_df)),
        "test_size": test_size,
        "random_state": random_state,
        "intent_labels": intent_result["metrics"]["labels"],
        "category_labels": category_result["metrics"]["labels"],
        "artifact_files": [
            "intent_model.pkl",
            "intent_vectorizer.pkl",
            "category_model.pkl",
            "category_vectorizer.pkl",
            "label_encoders.pkl",
            "model_metadata.json",
            "metrics.json",
        ],
        "safety_note": (
            "Academic demo only. The chatbot must not diagnose disease, claim cures, "
            "replace doctor/pharmacist advice, or recommend prescription treatment."
        ),
    }

    joblib.dump(intent_result["model"], artifact_dir / "intent_model.pkl")
    joblib.dump(intent_result["vectorizer"], artifact_dir / "intent_vectorizer.pkl")
    joblib.dump(category_result["model"], artifact_dir / "category_model.pkl")
    joblib.dump(category_result["vectorizer"], artifact_dir / "category_vectorizer.pkl")
    joblib.dump(label_encoders, artifact_dir / "label_encoders.pkl")

    (artifact_dir / "metrics.json").write_text(
        json.dumps(metrics, indent=2),
        encoding="utf-8",
    )
    (artifact_dir / "model_metadata.json").write_text(
        json.dumps(metadata, indent=2),
        encoding="utf-8",
    )
    write_metrics_report(metrics, report_dir / "chatbot_training_metrics.md")

    return {
        "metrics": metrics,
        "metadata": metadata,
        "artifact_dir": str(artifact_dir),
        "report_dir": str(report_dir),
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Train chatbot intent and category baselines.")
    parser.add_argument("--dataset", type=Path, default=DEFAULT_DATASET_PATH)
    parser.add_argument("--artifact-dir", type=Path, default=DEFAULT_ARTIFACT_DIR)
    parser.add_argument("--report-dir", type=Path, default=DEFAULT_REPORT_DIR)
    parser.add_argument("--test-size", type=float, default=0.2)
    parser.add_argument("--random-state", type=int, default=42)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    result = train_and_export(
        dataset_path=args.dataset,
        artifact_dir=args.artifact_dir,
        report_dir=args.report_dir,
        test_size=args.test_size,
        random_state=args.random_state,
    )
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
