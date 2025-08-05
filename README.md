
---

# 🕵️‍♂️ Fake Job Post Detection

A **full-stack machine learning application** that detects fraudulent job listings using **Kaggle’s dataset**, **XGBoost**, **DeepSeek**, **Playwright scraping**, and a **React + Flask** architecture. The project is **containerized with Docker** for easy deployment.

---

## 📌 Overview

This project is a smart solution that identifies fake job postings, helping job seekers and platforms avoid scams. It uses **machine learning models** and **NLP** to classify job posts as genuine or fraudulent based on multiple features.

---

## 📊 Dataset

* **Source**: [Kaggle Fake Job Postings Dataset](https://www.kaggle.com/datasets/shivamb/real-or-fake-fake-jobposting-prediction)
* **Size**: \~17,800 listings
* **Imbalance**: Only 4.84% labeled as fake
* **Columns**: 18 features (job title, description, salary, department, etc.)

### Missing Value Strategy

| Column             | Missing (%) |
| ------------------ | ----------- |
| Department         | 64.5%       |
| Salary Range       | 84%         |
| Company Profile    | 18.5%       |
| Benefits           | 40%         |
| Required Education | 45%         |

✅ Missing values replaced with `"Not Provided"` or encoded properly.

---

## 🔍 Data Preprocessing

* **Encoding**: Ordinal + One-Hot
* **Feature Engineering**: Description length, salary range difference, binary flags
* **Balancing**: Hybrid sampling
* **Dimensionality Reduction**: PCA (34 components)

---

## 🤖 Model - XGBoost

| Metric    | Value                    |
| --------- | ------------------------ |
| Accuracy  | 88.08%                   |
| Precision | 0.94 (Real), 0.85 (Fake) |
| Recall    | 0.85 (Real), 0.94 (Fake) |
| F1-Score  | 0.89 (Real), 0.90 (Fake) |

✅ **Improvement**: Dropping the *Industry* column boosted validation accuracy.

---

## 🧠 DeepSeek NLP Integration

Enhances predictions by analyzing job descriptions semantically.

---

## 🌐 Web Scraping with Playwright

* **Purpose**: Real-time scraping of job portals for live classification
* **Implementation**: Playwright automates browser-based extraction

---

## ⚙️ Tech Stack

| Layer                | Technology                  |
| -------------------- | --------------------------- |
| **Frontend**         | React.js, Vite, TailwindCSS |
| **Backend**          | Flask (Python)              |
| **Scraping**         | Playwright                  |
| **ML Model**         | XGBoost + PCA               |
| **NLP**              | DeepSeek                    |
| **Containerization** | Docker + Docker Compose     |

---

## 🐳 Dockerized Setup

### ✅ Prerequisites

* [Docker](https://www.docker.com/get-started) installed
* [Docker Compose](https://docs.docker.com/compose/) installed

### 🔥 Run the App in Containers

```bash
docker-compose up --build
```

#### ✅ Services:

* **Frontend** → [http://localhost:5173](http://localhost:5173)
* **Backend** → [http://localhost:5000](http://localhost:5000)

---

## 🐳 Docker Commands

* **Rebuild without cache**:

```bash
docker-compose build --no-cache
```

* **Stop all containers**:

```bash
docker-compose down
```

---

## ✅ How to Run Without Docker

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/fake-job-post-detection.git
cd fake-job-post-detection
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python run.py
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

---

## ✅ Dependencies Summary

* **Python**: Flask, XGBoost, pandas, scikit-learn, Playwright
* **Node.js**: React, Vite, Axios, TailwindCSS

---

## 📦 Environment Variables

Create `.env` in `backend/`:

```
FLASK_ENV=development
SECRET_KEY=your_secret_key
```

---

## 🌍 Deployment Options

* Docker Hub
* AWS ECS / ECR
* Render
* Heroku (with Docker)



⭐ **Star this repo if you like it!**

---

