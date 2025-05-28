from flask import Flask, render_template, jsonify, request
import db
import psycopg2.extras

app = Flask(__name__)

@app.route('/')
def home():
    """דף הבית"""
    return render_template('index.html')

# ========= API לניהול רופאים =========
@app.route('/api/doctors', methods=['GET'])
def get_doctors():
    """API לקבלת רשימת הרופאים"""
    try:
        conn = db.get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cur.execute('SELECT * FROM doctor ORDER BY d_last_name, d_first_name')
        doctors = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify([dict(doctor) for doctor in doctors])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/doctors', methods=['POST'])
def add_doctor():
    """API להוספת רופא חדש"""
    try:
        data = request.json
        required_fields = ['d_id', 'd_first_name', 'd_last_name', 'gender', 'specialization']

        # בדיקה שכל השדות הנדרשים קיימים
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'השדה {field} הוא שדה חובה'}), 400

        conn = db.get_db_connection()
        cur = conn.cursor()

        # הוספת רופא חדש
        cur.execute(
            """
            INSERT INTO doctor (d_id, d_first_name, d_last_name, gender, specialization, email, phone_number)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (data['d_id'], data['d_first_name'], data['d_last_name'], data['gender'],
             data['specialization'], data.get('email'), data.get('phone_number'))
        )

        cur.close()
        conn.close()

        return jsonify({'success': True, 'message': 'רופא נוסף בהצלחה'})
    except psycopg2.errors.UniqueViolation:
        return jsonify({'error': 'מזהה או אימייל כבר קיימים במערכת'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/doctors/<int:doctor_id>', methods=['PUT'])
def update_doctor(doctor_id):
    """API לעדכון רופא קיים"""
    try:
        data = request.json
        required_fields = ['d_first_name', 'd_last_name', 'gender', 'specialization']

        # בדיקה שכל השדות הנדרשים קיימים
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'השדה {field} הוא שדה חובה'}), 400

        conn = db.get_db_connection()
        cur = conn.cursor()

        # עדכון רופא קיים
        cur.execute(
            """
            UPDATE doctor 
            SET d_first_name = %s, d_last_name = %s, gender = %s, specialization = %s, 
                email = %s, phone_number = %s
            WHERE d_id = %s
            """,
            (data['d_first_name'], data['d_last_name'], data['gender'], data['specialization'],
             data.get('email'), data.get('phone_number'), doctor_id)
        )

        if cur.rowcount == 0:
            return jsonify({'error': 'רופא לא נמצא'}), 404

        cur.close()
        conn.close()

        return jsonify({'success': True, 'message': 'רופא עודכן בהצלחה'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/doctors/<int:doctor_id>', methods=['DELETE'])
def delete_doctor(doctor_id):
    """API למחיקת רופא"""
    try:
        conn = db.get_db_connection()
        cur = conn.cursor()

        # מחיקת רופא
        cur.execute('DELETE FROM doctor WHERE d_id = %s', (doctor_id,))

        if cur.rowcount == 0:
            return jsonify({'error': 'רופא לא נמצא'}), 404

        cur.close()
        conn.close()

        return jsonify({'success': True, 'message': 'רופא נמחק בהצלחה'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ========= API לניהול מטופלים =========
@app.route('/api/patients', methods=['GET'])
def get_patients():
    """API לקבלת רשימת המטופלים"""
    try:
        conn = db.get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cur.execute('''
            SELECT p.*, b.num_room
            FROM patient p
            JOIN bed b ON p.b_id = b.b_id
            ORDER BY p.p_last_name, p.p_first_name
        ''')
        patients = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify([dict(patient) for patient in patients])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/beds', methods=['GET'])
def get_beds():
    """API לקבלת רשימת המיטות הפנויות"""
    try:
        conn = db.get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cur.execute('SELECT * FROM bed WHERE is_available = true ORDER BY num_room')
        beds = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify([dict(bed) for bed in beds])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/patients', methods=['POST'])
def add_patient():
    """API להוספת מטופל חדש"""
    try:
        data = request.json
        required_fields = ['p_id', 'p_first_name', 'p_last_name', 'date_of_birth', 'b_id']

        # בדיקה שכל השדות הנדרשים קיימים
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'השדה {field} הוא שדה חובה'}), 400

        conn = db.get_db_connection()
        cur = conn.cursor()

        # בדיקה שהמיטה פנויה
        cur.execute('SELECT is_available FROM bed WHERE b_id = %s', (data['b_id'],))
        bed = cur.fetchone()

        if not bed:
            return jsonify({'error': 'מיטה לא קיימת'}), 400

        if not bed[0]:
            return jsonify({'error': 'המיטה כבר תפוסה'}), 400

        # עדכון סטטוס המיטה לתפוסה
        cur.execute('UPDATE bed SET is_available = false WHERE b_id = %s', (data['b_id'],))

        # הוספת מטופל חדש
        cur.execute(
            """
            INSERT INTO patient (p_id, p_first_name, p_last_name, date_of_birth, b_id)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (data['p_id'], data['p_first_name'], data['p_last_name'], data['date_of_birth'], data['b_id'])
        )

        cur.close()
        conn.close()

        return jsonify({'success': True, 'message': 'מטופל נוסף בהצלחה'})
    except psycopg2.errors.UniqueViolation:
        return jsonify({'error': 'מזהה מטופל כבר קיים במערכת'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/patients/<int:patient_id>', methods=['PUT'])
def update_patient(patient_id):
    """API לעדכון מטופל קיים"""
    try:
        data = request.json
        required_fields = ['p_first_name', 'p_last_name', 'date_of_birth', 'b_id']

        # בדיקה שכל השדות הנדרשים קיימים
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'השדה {field} הוא שדה חובה'}), 400

        conn = db.get_db_connection()
        cur = conn.cursor()

        # בדיקת המיטה הנוכחית של המטופל
        cur.execute('SELECT b_id FROM patient WHERE p_id = %s', (patient_id,))
        current_bed = cur.fetchone()

        if not current_bed:
            return jsonify({'error': 'מטופל לא נמצא'}), 404

        # אם המיטה משתנה
        if current_bed[0] != data['b_id']:
            # בדיקה שהמיטה החדשה פנויה
            cur.execute('SELECT is_available FROM bed WHERE b_id = %s', (data['b_id'],))
            new_bed = cur.fetchone()

            if not new_bed:
                return jsonify({'error': 'מיטה לא קיימת'}), 400

            if not new_bed[0]:
                return jsonify({'error': 'המיטה החדשה כבר תפוסה'}), 400

            # שחרור המיטה הישנה
            cur.execute('UPDATE bed SET is_available = true WHERE b_id = %s', (current_bed[0],))

            # עדכון סטטוס המיטה החדשה
            cur.execute('UPDATE bed SET is_available = false WHERE b_id = %s', (data['b_id'],))

        # עדכון מטופל
        cur.execute(
            """
            UPDATE patient 
            SET p_first_name = %s, p_last_name = %s, date_of_birth = %s, b_id = %s
            WHERE p_id = %s
            """,
            (data['p_first_name'], data['p_last_name'], data['date_of_birth'], data['b_id'], patient_id)
        )

        cur.close()
        conn.close()

        return jsonify({'success': True, 'message': 'מטופל עודכן בהצלחה'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/patients/<int:patient_id>', methods=['DELETE'])
def delete_patient(patient_id):
    """API למחיקת מטופל"""
    try:
        conn = db.get_db_connection()
        cur = conn.cursor()

        # שליפת מידע על המיטה של המטופל
        cur.execute('SELECT b_id FROM patient WHERE p_id = %s', (patient_id,))
        patient = cur.fetchone()

        if not patient:
            return jsonify({'error': 'מטופל לא נמצא'}), 404

        # שחרור המיטה
        cur.execute('UPDATE bed SET is_available = true WHERE b_id = %s', (patient[0],))

        # מחיקת המטופל
        cur.execute('DELETE FROM patient WHERE p_id = %s', (patient_id,))

        cur.close()
        conn.close()

        return jsonify({'success': True, 'message': 'מטופל נמחק בהצלחה'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ========= API לניהול מתנדבים =========
@app.route('/api/volunteers', methods=['GET'])
def get_volunteers():
    """API לקבלת רשימת המתנדבים"""
    try:
        conn = db.get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cur.execute('''
            SELECT v.*, vt.typename, d.d_first_name || ' ' || d.d_last_name AS doctor_name
            FROM volunteer v
            JOIN volunteertype vt ON v.volunteertypeid = vt.volunteertypeid
            JOIN doctor d ON v.doc_managerid = d.d_id
            ORDER BY v.lastname, v.firstname
        ''')
        volunteers = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify([dict(volunteer) for volunteer in volunteers])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/volunteertypes', methods=['GET'])
def get_volunteer_types():
    """API לקבלת רשימת סוגי המתנדבים"""
    try:
        conn = db.get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cur.execute('SELECT * FROM volunteertype ORDER BY typename')
        types = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify([dict(type) for type in types])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/volunteers', methods=['POST'])
def add_volunteer():
    """API להוספת מתנדב חדש"""
    try:
        data = request.json
        required_fields = ['volunteerid', 'firstname', 'lastname', 'phonenumber',
                           'email', 'skill', 'doc_managerid', 'volunteertypeid']

        # בדיקה שכל השדות הנדרשים קיימים
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'השדה {field} הוא שדה חובה'}), 400

        conn = db.get_db_connection()
        cur = conn.cursor()

        # הוספת מתנדב חדש
        cur.execute(
            """
            INSERT INTO volunteer (volunteerid, firstname, lastname, phonenumber, email, 
                                   skill, doc_managerid, volunteertypeid, nurseid)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (data['volunteerid'], data['firstname'], data['lastname'], data['phonenumber'],
             data['email'], data['skill'], data['doc_managerid'], data['volunteertypeid'],
             data.get('nurseid'))
        )

        cur.close()
        conn.close()

        return jsonify({'success': True, 'message': 'מתנדב נוסף בהצלחה'})
    except psycopg2.errors.UniqueViolation:
        return jsonify({'error': 'מזהה או אימייל כבר קיימים במערכת'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/volunteers/<int:volunteer_id>', methods=['PUT'])
def update_volunteer(volunteer_id):
    """API לעדכון מתנדב קיים"""
    try:
        data = request.json
        required_fields = ['firstname', 'lastname', 'phonenumber',
                           'email', 'skill', 'doc_managerid', 'volunteertypeid']

        # בדיקה שכל השדות הנדרשים קיימים
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'השדה {field} הוא שדה חובה'}), 400

        conn = db.get_db_connection()
        cur = conn.cursor()

        # עדכון מתנדב
        cur.execute(
            """
            UPDATE volunteer 
            SET firstname = %s, lastname = %s, phonenumber = %s, email = %s, 
                skill = %s, doc_managerid = %s, volunteertypeid = %s, nurseid = %s
            WHERE volunteerid = %s
            """,
            (data['firstname'], data['lastname'], data['phonenumber'], data['email'],
             data['skill'], data['doc_managerid'], data['volunteertypeid'],
             data.get('nurseid'), volunteer_id)
        )

        if cur.rowcount == 0:
            return jsonify({'error': 'מתנדב לא נמצא'}), 404

        cur.close()
        conn.close()

        return jsonify({'success': True, 'message': 'מתנדב עודכן בהצלחה'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/volunteers/<int:volunteer_id>', methods=['DELETE'])
def delete_volunteer(volunteer_id):
    """API למחיקת מתנדב"""
    try:
        conn = db.get_db_connection()
        cur = conn.cursor()

        # מחיקת מתנדב
        cur.execute('DELETE FROM volunteer WHERE volunteerid = %s', (volunteer_id,))

        if cur.rowcount == 0:
            return jsonify({'error': 'מתנדב לא נמצא'}), 404

        cur.close()
        conn.close()

        return jsonify({'success': True, 'message': 'מתנדב נמחק בהצלחה'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ========= API לניהול התנדבויות =========
@app.route('/api/volunteerfor', methods=['GET'])
def get_volunteerfor():
    """API לקבלת רשימת ההתנדבויות"""
    try:
        conn = db.get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cur.execute('''
            SELECT vf.*, 
                   p.p_first_name || ' ' || p.p_last_name AS patient_name,
                   v.firstname || ' ' || v.lastname AS volunteer_name
            FROM volunteerfor vf
            JOIN patient p ON vf.patientid = p.p_id
            JOIN volunteer v ON vf.volunteerid = v.volunteerid
            ORDER BY p.p_last_name, v.lastname
        ''')
        assignments = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify([dict(assignment) for assignment in assignments])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/volunteerfor', methods=['POST'])
def add_volunteerfor():
    """API להוספת התנדבות חדשה"""
    try:
        data = request.json
        required_fields = ['patientid', 'volunteerid']

        # בדיקה שכל השדות הנדרשים קיימים
        for field in required_fields:
            if field not in data or data[field] is None:
                return jsonify({'error': f'השדה {field} הוא שדה חובה'}), 400

        conn = db.get_db_connection()
        cur = conn.cursor()

        # הוספת התנדבות חדשה
        cur.execute(
            """
            INSERT INTO volunteerfor (patientid, volunteerid)
            VALUES (%s, %s)
            """,
            (data['patientid'], data['volunteerid'])
        )

        cur.close()
        conn.close()

        return jsonify({'success': True, 'message': 'התנדבות נוספה בהצלחה'})
    except psycopg2.errors.UniqueViolation:
        return jsonify({'error': 'התנדבות זו כבר קיימת במערכת'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/volunteerfor/<int:patient_id>/<int:volunteer_id>', methods=['DELETE'])
def delete_volunteerfor(patient_id, volunteer_id):
    """API למחיקת התנדבות"""
    try:
        conn = db.get_db_connection()
        cur = conn.cursor()

        # מחיקת התנדבות
        cur.execute('DELETE FROM volunteerfor WHERE patientid = %s AND volunteerid = %s',
                    (patient_id, volunteer_id))

        if cur.rowcount == 0:
            return jsonify({'error': 'התנדבות לא נמצאה'}), 404

        cur.close()
        conn.close()

        return jsonify({'success': True, 'message': 'התנדבות נמחקה בהצלחה'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ========= API לשאילתות ופרוצדורות =========
@app.route('/api/queries/available_beds', methods=['GET'])
def query_available_beds():
    """API להרצת שאילתת מיטות פנויות לפי חדר"""
    try:
        conn = db.get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

        # שאילתת מיטות פנויות לפי חדר
        cur.execute('''
            SELECT 
                b.num_room, 
                COUNT(b.b_id) AS available_beds,
                STRING_AGG(CONCAT(p.p_first_name, ' ', p.p_last_name), ', ') AS assigned_patients
            FROM bed b
            LEFT JOIN patient p ON b.b_id = p.b_id
            WHERE b.is_available = TRUE
            GROUP BY b.num_room
            ORDER BY available_beds DESC
        ''')

        results = cur.fetchall()
        cur.close()
        conn.close()

        return jsonify([dict(row) for row in results])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/queries/max_reports', methods=['GET'])
def query_max_reports():
    """API להרצת שאילתת חודשים עם מספר דוחות מקסימלי"""
    try:
        conn = db.get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

        # שאילתת חודשים עם מספר דוחות מקסימלי
        cur.execute('''
            SELECT report_year, report_month, num_reports AS max_reports
            FROM (
                SELECT EXTRACT(YEAR FROM report_date) AS report_year, 
                       EXTRACT(MONTH FROM report_date) AS report_month, 
                       COUNT(*) AS num_reports,
                       RANK() OVER (PARTITION BY EXTRACT(YEAR FROM report_date) ORDER BY COUNT(*) DESC) AS rnk
                FROM patient_report
                WHERE report_date >= NOW() - INTERVAL '10 years'
                GROUP BY report_year, report_month
            ) ranked_reports
            WHERE rnk = 1
        ''')

        results = cur.fetchall()
        cur.close()
        conn.close()

        return jsonify([dict(row) for row in results])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/procedures/doctor_treatments', methods=['POST'])
def run_doctor_treatments():
    """API להרצת פונקצית בדיקת עומס טיפולים של רופא"""
    try:
        data = request.json
        doctor_id = data.get('doctor_id')

        if not doctor_id:
            return jsonify({'error': 'חובה לספק מזהה רופא'}), 400

        conn = db.get_db_connection()
        cur = conn.cursor()

        # קבלת ההתמחות של הרופא
        cur.execute('SELECT specialization FROM doctor WHERE d_id = %s', (doctor_id,))
        specialization_result = cur.fetchone()

        if not specialization_result:
            return jsonify({'error': 'רופא לא נמצא'}), 404

        specialization = specialization_result[0]

        # קבלת הטיפולים שהרופא מבצע
        cur.execute('''
            SELECT t.name, t.wait_after
            FROM treatment t
            JOIN performs p ON t.t_id = p.t_id
            WHERE p.d_id = %s
        ''', (doctor_id,))

        treatments = []
        total_workload = 0

        for row in cur.fetchall():
            name, wait_after = row

            # חישוב מורכבות הטיפול
            if wait_after <= 2:
                complexity = 'פשוטה'
                complexity_value = 1
            elif wait_after <= 5:
                complexity = 'בינונית'
                complexity_value = 2
            else:
                complexity = 'מורכבת'
                complexity_value = 3

            # חישוב העומס
            treatment_workload = complexity_value * 10
            total_workload += treatment_workload

            treatments.append({
                'name': name,
                'wait_after': wait_after,
                'complexity': complexity,
                'workload': treatment_workload
            })

        treatment_count = len(treatments)
        avg_workload = 0 if treatment_count == 0 else round(total_workload / treatment_count, 1)

        # הערכת העומס הכולל
        if total_workload < 30:
            workload_assessment = 'נמוך'
        elif total_workload < 60:
            workload_assessment = 'בינוני'
        else:
            workload_assessment = 'גבוה'

        cur.close()
        conn.close()

        return jsonify({
            'treatment_count': treatment_count,
            'specialization': specialization,
            'treatments': treatments,
            'total_workload': total_workload,
            'avg_workload': avg_workload,
            'workload_assessment': workload_assessment
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/procedures/update_nurse_shift', methods=['POST'])
def run_update_nurse_shift():
    """API להרצת פרוצדורת עדכון משמרת אחות"""
    try:
        data = request.json
        phone = data.get('phone')

        if not phone:
            return jsonify({'error': 'חובה לספק מספר טלפון של אחות'}), 400

        conn = db.get_db_connection()
        cur = conn.cursor()

        # קבלת פרטי האחות
        cur.execute('''
            SELECT n_id, n_first_name || ' ' || n_last_name AS nurse_name, shift_schedule
            FROM nurse WHERE phone_number = %s
        ''', (phone,))

        nurse_result = cur.fetchone()

        if not nurse_result:
            return jsonify({'error': 'אחות לא נמצאה'}), 404

        nurse_id, nurse_name, old_shift = nurse_result

        # קביעת המשמרת החדשה
        if old_shift.upper() == 'MORNING':
            new_shift = 'afternoon'
        elif old_shift.upper() == 'AFTERNOON':
            new_shift = 'night'
        else:
            new_shift = 'Morning'

        # קבלת רשימת המטופלים של האחות
        cur.execute('''
            SELECT p.p_id, p.p_first_name || ' ' || p.p_last_name AS patient_name
            FROM patient p
            JOIN examination e ON p.p_id = e.p_id
            WHERE e.n_id = %s
        ''', (nurse_id,))

        patients = cur.fetchall()
        patient_count = len(patients)
        reassignments = []

        # מעבר על כל המטופלים ומציאת אחות חלופית
        for patient_id, patient_name in patients:
            # מציאת אחות במשמרת החדשה שאינה האחות הנוכחית
            cur.execute('''
                SELECT n.n_id, n.n_first_name || ' ' || n.n_last_name AS nurse_name
                FROM nurse n
                WHERE n.shift_schedule = %s
                  AND n.n_id != %s
                  AND NOT EXISTS (
                     SELECT 1 FROM examination e2
                     WHERE e2.p_id = %s AND e2.n_id = n.n_id
                  )
                LIMIT 1
            ''', (new_shift, nurse_id, patient_id))

            new_nurse = cur.fetchone()

            if new_nurse:
                new_nurse_id, new_nurse_name = new_nurse

                # בדיקה אם כבר קיים שיבוץ
                cur.execute('''
                    SELECT 1 FROM examination
                    WHERE p_id = %s AND n_id = %s
                ''', (patient_id, new_nurse_id))

                if cur.fetchone() is None:
                    # הוספת שיבוץ חדש
                    cur.execute('''
                        INSERT INTO examination (p_id, n_id)
                        VALUES (%s, %s)
                    ''', (patient_id, new_nurse_id))

                    reassignments.append({
                        'patient_id': patient_id,
                        'patient_name': patient_name,
                        'new_nurse_id': new_nurse_id,
                        'new_nurse_name': new_nurse_name
                    })

        # עדכון המשמרת בבסיס הנתונים
        cur.execute('''
            UPDATE nurse SET shift_schedule = %s
            WHERE phone_number = %s
        ''', (new_shift, phone))

        conn.commit()

        cur.close()
        conn.close()

        return jsonify({
            'nurse_name': nurse_name,
            'old_shift': old_shift,
            'new_shift': new_shift,
            'patient_count': patient_count,
            'reassigned_count': len(reassignments),
            'reassignments': reassignments
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # בדיקת חיבור לבסיס הנתונים
    if db.test_connection():
        print("החיבור לבסיס הנתונים הצליח!")
        app.run(debug=True)
    else:
        print("החיבור לבסיס הנתונים נכשל. בדוק את הגדרות החיבור.")