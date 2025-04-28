חדרים וכמות המיטות הפנויות בכל חדר

SELECT 
    b.num_room, 
    COUNT(b.b_id) AS available_beds,
    STRING_AGG(CONCAT(p.p_first_name, ' ', p.p_last_name), ', ') AS assigned_patients
FROM bed b
LEFT JOIN patient p ON b.b_id = p.b_id
WHERE b.is_available = TRUE
GROUP BY b.num_room
ORDER BY available_beds DESC;



חמשת הרופאים שביצעו הכי הרבה טיפולים

SELECT 
    d.d_id,
    d.d_first_name,
    d.d_last_name,
    d.specialization,
    COUNT(p.t_id) AS treatments_count
FROM doctor d
LEFT JOIN performs p ON d.d_id = p.d_id
GROUP BY d.d_id, d.d_first_name, d.d_last_name, d.specialization
ORDER BY treatments_count DESC
LIMIT 5;


מטופלים שנמצאים באשפוז וקיבלו טיפול כירורגי, כולל פרטי המיטה והחדר שלהם

SELECT 
    p.p_id, 
    p.p_first_name || ' ' || p.p_last_name AS patient_name,
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.date_of_birth)) AS age,
    pr.report_type,
    TO_CHAR(pr.report_date, 'DD/MM/YYYY') AS report_date,
    t.name AS treatment_name,
    b.num_room,
    b.b_id
FROM patient p
JOIN patient_report pr ON p.p_id = pr.p_id
JOIN treated_by tb ON p.p_id = tb.p_id
JOIN treatment t ON tb.t_id = t.t_id
JOIN bed b ON p.b_id = b.b_id
WHERE pr.report_type = 'Hospitalization'
  AND t.name = 'Surgery'
  AND pr.report_date = (
    SELECT MAX(report_date) 
    FROM patient_report 
    WHERE p_id = p.p_id
  )
ORDER BY pr.report_date DESC;



החודש עם הכי הרבה דוחות בכל שנה בעשור האחרון

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
WHERE rnk = 1;


  

חמישה המטופלים שקיבלו הכי הרבה טיפולים, אם נולדו אחרי 2020 (עד גיל 5)

SELECT p.p_id, p.p_first_name, p.p_last_name, 
       EXTRACT(DAY FROM p.date_of_birth) AS birth_day,
       EXTRACT(MONTH FROM p.date_of_birth) AS birth_month,
       EXTRACT(YEAR FROM p.date_of_birth) AS birth_year,
       COUNT(t.t_id) AS num_treatments
FROM patient p
JOIN treated_by tb ON p.p_id = tb.p_id
JOIN treatment t ON tb.t_id = t.t_id
WHERE EXTRACT(YEAR FROM p.date_of_birth) >= 2020
GROUP BY p.p_id, p.p_first_name, p.p_last_name, p.date_of_birth
ORDER BY num_treatments DESC
LIMIT 5;



חמישה רופאים שביצעו יותר טיפולים מהממוצע הכללי

SELECT d.d_id, d.d_first_name, d.d_last_name, d.specialization, 
       COUNT(p.t_id) AS num_treatments
FROM doctor d
JOIN performs p ON d.d_id = p.d_id
GROUP BY d.d_id
HAVING COUNT(p.t_id) > (
    SELECT AVG(num_treatments) 
    FROM (SELECT d_id, COUNT(t_id) AS num_treatments 
        FROM performs
        GROUP BY d_id) AS avg_treatments
)
ORDER BY num_treatments DESC
LIMIT 5;



שלושת האחיות (אחת מכל משמרת) שביצעו הכי הרבה טיפולים

WITH ranked_nurses AS (
    SELECT n.shift_schedule, 
           n.n_id AS nurse_id, 
           CONCAT(n.n_first_name, ' ', n.n_last_name) AS nurse_name, 
           COUNT(tb.t_id) AS examination_count, 
           n.phone_number,
           ROW_NUMBER() OVER (PARTITION BY n.shift_schedule ORDER BY COUNT(tb.t_id) DESC) AS rn
    FROM nurse n
    JOIN examination e ON n.n_id = e.n_id
    JOIN treated_by tb ON e.p_id = tb.p_id
    GROUP BY n.shift_schedule, n.n_id, n.n_first_name, n.n_last_name, n.phone_number
)
SELECT shift_schedule, nurse_id, nurse_name, examination_count, phone_number
FROM ranked_nurses
WHERE rn = 1;



סיכום כמות הטיפולים וסוגי הטיפולים לכל מטופל

SELECT 
    p.p_id,
    p.p_first_name,
    p.p_last_name,
    (SELECT COUNT(*) FROM treated_by WHERE p_id = p.p_id) AS treatment_count,
    (SELECT STRING_AGG(t.name, ', ') FROM treated_by tb 
     JOIN treatment t ON tb.t_id = t.t_id 
     WHERE tb.p_id = p.p_id) AS treatments_received
FROM patient p
ORDER BY treatment_count DESC;


מחיקת בדיקות למטופלים בחדרים מסוימים

DELETE FROM examination
WHERE p_id IN (
    SELECT p.p_id
    FROM patient p
    JOIN bed b ON p.b_id = b.b_id
    WHERE b.num_room BETWEEN 110 AND 120
);

SELECT e.p_id, e.n_id, p.p_first_name, p.p_last_name, b.num_room
FROM examination e
JOIN patient p ON e.p_id = p.p_id
JOIN bed b ON p.b_id = b.b_id
ORDER BY b.num_room;


השאילתה מוחקת דוחות עבור חולים שטופלו בפחות משני טיפולים ורק אם סוג הדוח הוא 'observation'.

DELETE FROM patient_report
WHERE p_id IN (
    SELECT p_id 
    FROM treated_by 
    GROUP BY p_id 
    HAVING COUNT(t_id) < 2
)
AND report_type = 'observation';


SELECT pr.* 
FROM patient_report pr
JOIN (
    SELECT p_id 
    FROM treated_by 
    GROUP BY p_id 
    HAVING COUNT(t_id) < 2
) AS few_treatments
ON pr.p_id = few_treatments.p_id;


מחיקת הרופאים מ2 התמחויות מסוימות שאין להם אף טיפול

DELETE FROM doctor 
WHERE d_id NOT IN(
SELECT DISTINCT d_id
FROM performs)
AND doctor.specialization IN ('Oncology', 'Pediatrics');


SELECT d.d_id, d.d_first_name, d.d_last_name, d.specialization, COUNT(p.t_id) AS num_treatments
FROM doctor d
LEFT JOIN performs p ON d.d_id = p.d_id
GROUP BY d.d_id, d.d_first_name, d.d_last_name
ORDER BY num_treatments;



עדכון משמרת מצהרים ללילה לאחיות שמטפלות ב2 מטופלים

UPDATE nurse
SET shift_schedule = 'night'
WHERE n_id IN (
    SELECT n.n_id
    FROM nurse n
    JOIN examination e ON n.n_id = e.n_id
    WHERE n.shift_schedule = 'afternoon'
    GROUP BY n.n_id
    HAVING COUNT(DISTINCT e.p_id) = 2
);

SELECT n.n_id, n.n_first_name, n.n_last_name, n.shift_schedule, COUNT(DISTINCT e.p_id) AS num_patients
FROM nurse n
JOIN examination e ON n.n_id = e.n_id
GROUP BY n.n_id, n.n_first_name, n.n_last_name;



עדכון התמחות של רופא שביצע יותר מ5 טיפולים 

UPDATE doctor
SET specialization = 'Surgery'
WHERE d_id IN (
    SELECT d_id
    FROM performs
    GROUP BY d_id
    HAVING COUNT(t_id) > 5
);

SELECT d.d_id, d.d_first_name, d.d_last_name, d.specialization, COUNT(p.t_id) AS num_treatments
FROM doctor d
LEFT JOIN performs p ON d.d_id = p.d_id
GROUP BY d.d_id, d.d_first_name, d.d_last_name, d.specialization
ORDER BY num_treatments DESC;



עדכון שעות המתנה של טיפולים

UPDATE treatment
SET wait_after = CASE 
    WHEN name = 'Surgery' THEN wait_after * 2 
    ELSE wait_after + 2 
END
WHERE name IN ('Surgery', 'Chemotherapy');

SELECT t_id, name, wait_after
FROM treatment;
