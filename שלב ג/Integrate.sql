
נוסיף טיפול לטבלה של הפרויקטים - כלומר כל פרויקט לאיזה טיפול הוא משוייך

ALTER TABLE Project ADD TreatmentID INT;
ALTER TABLE Project ADD CONSTRAINT FK_Project_Treatment
FOREIGN KEY (TreatmentID) REFERENCES treatment(t_id);

UPDATE Project
SET TreatmentID = t.t_id
FROM (
  SELECT ProjectID, ROW_NUMBER() OVER (ORDER BY ProjectID) AS rn
  FROM Project
) AS p
JOIN (
  SELECT t_id, ROW_NUMBER() OVER (ORDER BY t_id) AS rn
  FROM treatment
) AS t ON p.rn = t.rn
WHERE Project.ProjectID = p.ProjectID;


נוסיף אחות אחראית לכל מתנדב

ALTER TABLE Volunteer ADD COLUMN NurseID INT;
ALTER TABLE Volunteer
ADD CONSTRAINT FK_Volunteer_Nurse
FOREIGN KEY (NurseID) REFERENCES nurse(n_id);

UPDATE Volunteer
SET NurseID = n.n_id
FROM (
  SELECT VolunteerID, ROW_NUMBER() OVER (ORDER BY VolunteerID) AS rn
  FROM Volunteer
) AS v
JOIN (
  SELECT n_id, ROW_NUMBER() OVER (ORDER BY n_id) AS rn
  FROM nurse
) AS n ON v.rn = n.rn
WHERE Volunteer.VolunteerID = v.VolunteerID;



נוסיף הכשרה לטבלת הטיפולים (לא חייבת להיות הכשרה עבור כל טיפול)

ALTER TABLE treatment ADD COLUMN TrainingID INT;
ALTER TABLE treatment
ADD CONSTRAINT FK_Treatment_Training
FOREIGN KEY (TrainingID) REFERENCES Training(TrainingID);

UPDATE treatment
SET TrainingID = tr.TrainingID
FROM (
  SELECT t_id, ROW_NUMBER() OVER (ORDER BY t_id) AS rn
  FROM treatment
) AS t
JOIN (
  SELECT TrainingID, ROW_NUMBER() OVER (ORDER BY TrainingID) AS rn
  FROM Training
) AS tr ON t.rn = tr.rn
WHERE treatment.t_id = t.t_id;



ניצור טבלה חדשה של חולים ומתנדבים. לכל חולה יכולים להיות כמה מתנדבים ולכל מתנדב יכולים להיות כמה חולים.

CREATE TABLE if not exists VolunteerFor (
  PatientID INT,
  VolunteerID INT,
  PRIMARY KEY (PatientID, VolunteerID),
  FOREIGN KEY (PatientID) REFERENCES patient(p_id),
  FOREIGN KEY (VolunteerID) REFERENCES Volunteer(VolunteerID)
);

INSERT INTO VolunteerFor (PatientID, VolunteerID)
SELECT p.p_id, v.VolunteerID
FROM (
  SELECT p_id, ROW_NUMBER() OVER (ORDER BY p_id) AS rn
  FROM patient
) AS p
JOIN (
  SELECT VolunteerID, ROW_NUMBER() OVER (ORDER BY VolunteerID) AS rn
  FROM Volunteer
) AS v
ON (p.rn - 1) % (SELECT COUNT(*) FROM Volunteer) + 1 = v.rn;




מיזוג הטבלאות של דוקטור ומנהל לטבלה אחת וקישור המפתחות הזרים בהתאם

ALTER TABLE doctor
ADD COLUMN email VARCHAR(255) UNIQUE,
ADD COLUMN phone_number VARCHAR(20);

UPDATE doctor
SET email = CONCAT('doctor', d_id, '@hospital.org'),
    phone_number = CONCAT('050-000', LPAD(d_id::text, 4, '0'));

INSERT INTO doctor (d_id, d_first_name, d_last_name, gender, specialization, email, phone_number)
SELECT 
    ManagerID, 
    FirstName, 
    LastName, 
    'male' AS gender, 
    'General Management' AS specialization, 
    Email, 
    PhoneNumber
FROM manager;

ALTER TABLE volunteer
DROP CONSTRAINT volunteer_managerid_fkey;
ALTER TABLE volunteer
ADD CONSTRAINT volunteer_doctorid_fkey
FOREIGN KEY (ManagerID) REFERENCES doctor(d_id) ON DELETE CASCADE;
ALTER TABLE project
DROP CONSTRAINT project_managerid_fkey;
ALTER TABLE project
ADD CONSTRAINT project_doctorid_fkey
FOREIGN KEY (ManagerID) REFERENCES doctor(d_id) ON DELETE CASCADE;
DROP TABLE Manager;
