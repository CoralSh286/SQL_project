--procedure1

CREATE OR REPLACE PROCEDURE assign_volunteer_to_patient_new(p_patient_id INTEGER, p_volunteer_id INTEGER)
LANGUAGE plpgsql AS $$
DECLARE
    existing_count INTEGER;
BEGIN
    -- Check if the patient exists
    IF NOT EXISTS (SELECT 1 FROM patient WHERE p_id = p_patient_id) THEN
        RAISE EXCEPTION 'Patient with ID % does not exist', p_patient_id;
    END IF;

    -- Check if the volunteer exists
    IF NOT EXISTS (SELECT 1 FROM volunteer WHERE volunteerid = p_volunteer_id) THEN
        RAISE EXCEPTION 'Volunteer with ID % does not exist', p_volunteer_id;
    END IF;

    -- Check if the assignment already exists
    SELECT COUNT(*) INTO existing_count
    FROM volunteerfor
    WHERE patientid = p_patient_id AND volunteerid = p_volunteer_id;

    IF existing_count > 0 THEN
        RAISE EXCEPTION 'Volunteer % is already assigned to patient %', p_volunteer_id, p_patient_id;
    END IF;

    -- Attempt to insert a new assignment
    INSERT INTO volunteerfor (patientid, volunteerid)
    VALUES (p_patient_id, p_volunteer_id);

    RAISE NOTICE 'Volunteer % successfully assigned to patient %', p_volunteer_id, p_patient_id;

EXCEPTION
    WHEN unique_violation THEN
        RAISE EXCEPTION 'Assignment failed: volunteer % is already assigned to patient % (unique constraint)', p_volunteer_id, p_patient_id;
    WHEN foreign_key_violation THEN
        RAISE EXCEPTION 'Assignment failed: foreign key violation - invalid patient or volunteer ID';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Unexpected error: %', SQLERRM;
END;
$$;







--procedure2

CREATE OR REPLACE PROCEDURE update_nurse_shift_new(p_phone VARCHAR)
LANGUAGE plpgsql AS $$
DECLARE
    v_shift VARCHAR(50);
    v_new_shift VARCHAR(50);
BEGIN

    SELECT shift_schedule INTO v_shift
    FROM nurse WHERE phone_number = p_phone;
    
    IF UPPER(v_shift) = 'MORNING' THEN
        v_new_shift := 'afternoon';
    ELSIF UPPER(v_shift) = 'AFTERNOON' THEN
        v_new_shift := 'night';
    ELSE
        v_new_shift := 'Morning';
    END IF;
    
    UPDATE nurse SET shift_schedule = v_new_shift
    WHERE phone_number = p_phone;
    
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE NOTICE 'אחות לא קיימת';
        ROLLBACK;
    WHEN OTHERS THEN
        RAISE NOTICE 'שגיאה: %', SQLERRM;
        ROLLBACK;
END;
$$;
