FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY manage.py .
COPY payment_service ./payment_service

EXPOSE 8004

CMD ["python", "manage.py", "runserver", "0.0.0.0:8004"]
