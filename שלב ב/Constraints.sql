ALTER TABLE treatment
ADD CONSTRAINT chk_wait_after_non_negative
CHECK (wait_after >= 0);


ALTER TABLE patient
ALTER COLUMN p_first_name SET NOT NULL;


ALTER TABLE nurse
ALTER COLUMN shift_schedule SET DEFAULT 'morning';
