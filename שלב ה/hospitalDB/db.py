import os
import psycopg2
import psycopg2.extras
from dotenv import load_dotenv

# טעינת משתני הסביבה מקובץ .env
load_dotenv()

# פרטי התחברות לבסיס הנתונים
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': os.getenv('DB_PORT', '5432'),
    'dbname': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD')
}

def get_db_connection():
    """יצירת חיבור לבסיס הנתונים"""
    conn = psycopg2.connect(**DB_CONFIG)
    conn.autocommit = True
    return conn

def test_connection():
    """בדיקת החיבור לבסיס הנתונים"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT 1')
        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"שגיאת חיבור לבסיס הנתונים: {e}")
        return False

# בדיקת חיבור אם מריצים את הקובץ ישירות
if __name__ == "__main__":
    if test_connection():
        print("החיבור לבסיס הנתונים הצליח!")
    else:
        print("החיבור לבסיס הנתונים נכשל. בדקי את הגדרות החיבור.")