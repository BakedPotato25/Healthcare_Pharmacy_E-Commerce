# ML Chatbot Training

This folder contains the self-seeded dataset and TF-IDF + Logistic Regression
baseline used by `chatbot_service`.

The data is synthetic academic demo data. It does not use real patient records,
sensitive health data, or clinically validated medical guidance.

## Files

| Path | Purpose |
|---|---|
| `generate_chatbot_datasets.py` | Rebuilds product, intent, chatbot, and recommendation seed CSVs |
| `train_chatbot.py` | Local training script for the baseline models |
| `datasets/products_seed.csv` | 10 categories and 100 product rows |
| `datasets/chatbot_intents_seed.csv` | Supported intent metadata |
| `datasets/chatbot_training_seed.csv` | Main chatbot training examples |
| `datasets/recommendation_training_seed.csv` | Category recommendation examples |
| `notebooks/kaggle_train_chatbot.ipynb` | Kaggle-ready training notebook |
| `artifacts/` | Exported model/vectorizer/metadata files |
| `reports/chatbot_training_metrics.md` | Human-readable metrics summary |

## Dataset Columns

`chatbot_training_seed.csv` contains:

- `text`
- `intent`
- `target_category`
- `safe_response_template`
- `requires_medical_disclaimer`

Required intent labels:

- `product_search`
- `category_recommendation`
- `digestive_support`
- `vitamin_advice`
- `skincare_support`
- `oral_care_support`
- `baby_care_support`
- `first_aid_support`
- `medical_device_question`
- `order_status_question`
- `shipping_question`
- `payment_question`
- `greeting`
- `fallback`
- `medical_warning`

Required category labels:

- `OTC Medicine`
- `Digestive Health`
- `Vitamins & Minerals`
- `Mother & Baby`
- `Personal Care`
- `Medical Devices`
- `First Aid`
- `Skincare`
- `Oral Care`
- `Nutrition & Health Food`

## Generate Datasets

From the repository root:

```powershell
python ml/generate_chatbot_datasets.py
```

This recreates the CSV files in `ml/datasets/`.

## Train Locally

```powershell
python ml/train_chatbot.py
```

The script trains:

- Intent classifier: TF-IDF vectorizer + Logistic Regression
- Category classifier: TF-IDF vectorizer + Logistic Regression

It exports artifacts into `ml/artifacts/` and writes metrics to
`ml/reports/chatbot_training_metrics.md`.

## Train On Kaggle

1. Upload the repository or the `ml/datasets/` folder to a Kaggle notebook.
2. Open `ml/notebooks/kaggle_train_chatbot.ipynb`.
3. Confirm dataset paths in the notebook match the Kaggle input path.
4. Run all notebook cells.
5. Download the generated `ml/artifacts/` files.

Expected artifact files:

```text
intent_model.pkl
intent_vectorizer.pkl
category_model.pkl
category_vectorizer.pkl
label_encoders.pkl
model_metadata.json
metrics.json
```

## Copy Artifacts Into Chatbot Service

From the repository root:

```powershell
Copy-Item ml\artifacts\* services\chatbot_service\artifacts\ -Force
docker compose up --build -d chatbot_service
```

The chatbot service loads artifacts from:

```text
services/chatbot_service/artifacts/
```

If artifacts are missing or invalid, `chatbot_service` returns a safe fallback
response instead of failing the API request.

## Current Metrics

See `ml/artifacts/metrics.json` and `ml/reports/chatbot_training_metrics.md`.
The current baseline reports approximately:

- Intent accuracy: `0.9955`
- Category accuracy: `0.9203`

These metrics are only for synthetic demo data and should not be interpreted as
medical quality or real-world recommendation safety.
