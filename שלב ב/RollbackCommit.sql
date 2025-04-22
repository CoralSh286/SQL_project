BEGIN;
UPDATE nurse 
SET shift_schedule = 'morning' 
WHERE n_id = 1;
SELECT * FROM nurse WHERE n_id = 1;
ROLLBACK;
SELECT * FROM nurse WHERE n_id = 1;


BEGIN;
UPDATE nurse 
SET shift_schedule = 'night' 
WHERE n_id = 1;
SELECT * FROM nurse WHERE n_id = 1;
COMMIT;
SELECT * FROM nurse WHERE n_id = 1;
