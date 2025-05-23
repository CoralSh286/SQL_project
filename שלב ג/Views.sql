
יצירת מבט ושאילתות עבור בסיס הנתונים של מחלקת מיון

CREATE VIEW patient_treatment_doctor_view AS
SELECT
    tb.p_id,
    p.p_first_name AS patient_first_name,
    p.p_last_name AS patient_last_name,
    tb.t_id,
    t.name AS treatment_name,
    d.d_id,
    d.d_first_name AS doctor_first_name,
    d.d_last_name AS doctor_last_name
FROM
    treated_by tb
JOIN
    patient p ON tb.p_id = p.p_id
JOIN 
    treatment t ON tb.t_id = t.t_id
JOIN
    performs pf ON t.t_id = pf.t_id
JOIN 
    doctor d ON pf.d_id = d.d_id;


SELECT 
    d_id,
    doctor_first_name,
    doctor_last_name,
    COUNT(DISTINCT p_id) AS total_patients
FROM 
    patient_treatment_doctor_view
GROUP BY 
    d_id, doctor_first_name, doctor_last_name
ORDER BY 
    total_patients DESC;


SELECT 
    treatment_name,
    doctor_first_name,
    doctor_last_name,
    COUNT(*) AS times_given
FROM 
    patient_treatment_doctor_view
GROUP BY 
    treatment_name, doctor_first_name, doctor_last_name
ORDER BY 
    times_given DESC;




יצירת מבט ושאילתות עבור בסיס הנתונים של מערך המתנדבים

CREATE VIEW volunteer_project_training_view AS
SELECT
    v.VolunteerID,
    v.firstName AS volunteer_first_name,
    v.lastName AS volunteer_last_name,
    vt.TypeName AS volunteer_type,
    p.ProjectName AS project_name,
    t.TrainingName AS training_name,
    d.d_first_name AS doctor_first_name,
    d.d_last_name AS doctor_last_name
FROM 
    Volunteer v
JOIN
    VolunteerType vt ON v.VolunteerTypeID = vt.VolunteerTypeID
JOIN
    AssignedTo at ON v.VolunteerID = at.VolunteerID
JOIN
    Project p ON at.ProjectID = p.ProjectID
JOIN
    doctor d ON p.doc_ManagerID = d.d_id
JOIN
    Trained tr ON v.VolunteerID = tr.VolunteerID
JOIN 
    Training t ON tr.TrainingID = t.TrainingID;


SELECT 
    training_name, 
    COUNT(DISTINCT VolunteerID) AS volunteer_count
FROM volunteer_project_training_view
GROUP BY training_name;


SELECT 
    volunteer_first_name, 
    volunteer_last_name, 
    COUNT(DISTINCT training_name) AS num_trainings,
    COUNT(DISTINCT project_name) AS num_projects
FROM volunteer_project_training_view
GROUP BY volunteer_first_name, volunteer_last_name
HAVING COUNT(DISTINCT training_name) > 1 AND COUNT(DISTINCT project_name) > 1
ORDER BY num_trainings DESC;

