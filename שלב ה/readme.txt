שלב 1 - הכנת הפרויקט
mkdir hospital_management
cd hospital_management
python -m venv venv

# הפעלת הסביבה הוירטואלית
venv\Scripts\activate        # Windows
source venv/bin/activate     # Linux/Mac

pip install flask psycopg2-binary python-dotenv


שלב 2 - הגדרת PostgreSQL 
docker run --name hospital-postgres \
  -e POSTGRES_DB=hospital_db \
  -e POSTGRES_USER=hospital_user \
  -e POSTGRES_PASSWORD=hospital_pass \
  -p 5432:5432 -d postgres:13


שלב 3 - יצירת קובץ .env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hospital_db
DB_USER=hospital_user
DB_PASSWORD=hospital_pass


שלב 4 - יצירת מבנה קבצים
hospital_management/
├── app.py
├── db.py
├── .env
├── static/css/style.css
├── static/js/main.js
└── templates/index.html


שלב 5 - יצירת הטבלאות
התחבר לבסיס הנתונים
הרץ את הסקריפט db.sql


שלב 6 - הפעלת האפליקציה
python app.py להריץ
להיכנס לקישור שמופיע: http://localhost:5000
