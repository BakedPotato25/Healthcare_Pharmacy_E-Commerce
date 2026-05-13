FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY manage.py .
COPY product_service ./product_service

EXPOSE 8002

CMD ["python", "manage.py", "runserver", "0.0.0.0:8002"]
