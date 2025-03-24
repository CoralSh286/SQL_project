import csv
import random

# קריאת נתונים מקובץ CSV

def read_csv(file_path):
    with open(file_path, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        return [row for row in reader]

# קריאת נתונים מהקבצים
patients = read_csv('patient.csv')  # כולל עמודת 'p_id'
treatments = read_csv('treatment.csv')  # כולל עמודת 't_id'
doctors = read_csv('doctor.csv')  # כולל עמודת 'd_id'

# יצירת קובץ SQL להכנסת נתונים
with open('insert_treated_by_performs.sql', mode='w', encoding='utf-8') as sql_file:

    # יצירת רשומות לטבלת treated_by
    sql_file.write("-- Inserting data into treated_by\n")
    for patient in patients:
        assigned_treatments = random.sample(treatments, k=random.randint(1, 3))  # כל מטופל יקבל 1-3 טיפולים
        for treatment in assigned_treatments:
            sql_file.write(f"INSERT INTO treated_by (p_id, t_id) VALUES ({patient['p_id']}, {treatment['t_id']});\n")
    sql_file.write("\n")

    # יצירת רשומות לטבלת performs
    sql_file.write("-- Inserting data into performs\n")
    for treatment in treatments:
        assigned_doctors = random.sample(doctors, k=random.randint(1, 3))  # כל טיפול יבוצע ע"י 1-3 רופאים
        for doctor in assigned_doctors:
            sql_file.write(f"INSERT INTO performs (t_id, d_id) VALUES ({treatment['t_id']}, {doctor['d_id']});\n")

print("קובץ SQL נוצר בהצלחה: insert_treated_by_performs.sql")
