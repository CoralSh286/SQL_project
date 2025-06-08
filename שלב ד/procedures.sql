--procedure1

CREATE OR REPLACE PROCEDURE assign_volunteer_to_patient_new(p_patient_id INTEGER, p_volunteer_id INTEGER)
LANGUAGE plpgsql AS $$
DECLARE
    v_patient_exists INTEGER;
    v_volunteer_exists INTEGER;
    existing_count INTEGER;
BEGIN
    SELECT 1 INTO STRICT v_patient_exists
    FROM patient WHERE p_id = p_patient_id;
    
    SELECT 1 INTO STRICT v_volunteer_exists
    FROM volunteer WHERE volunteerid = p_volunteer_id;
    
    -- Check if the assignment already exists
    SELECT COUNT(*) INTO existing_count
    FROM volunteerfor
    WHERE patientid = p_patient_id AND volunteerid = p_volunteer_id;
    
    IF existing_count > 0 THEN
        RAISE NOTICE 'Volunteer % is already assigned to patient %', p_volunteer_id, p_patient_id;
        RETURN;
    END IF;
    
    -- Attempt to insert a new assignment
    INSERT INTO volunteerfor (patientid, volunteerid)
    VALUES (p_patient_id, p_volunteer_id);
    
    RAISE NOTICE 'Volunteer % successfully assigned to patient %', p_volunteer_id, p_patient_id;
    
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE EXCEPTION 'Patient ID % or Volunteer ID % does not exist', p_patient_id, p_volunteer_id;
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
    -- Get current shift with STRICT
    SELECT shift_schedule INTO STRICT v_shift
    FROM nurse WHERE phone_number = p_phone;
    
    -- Determine new shift
    IF UPPER(v_shift) = 'MORNING' THEN
        v_new_shift := 'afternoon';
    ELSIF UPPER(v_shift) = 'AFTERNOON' THEN
        v_new_shift := 'night';
    ELSE
        v_new_shift := 'Morning';
    END IF;
    
    -- Update shift in database
    UPDATE nurse SET shift_schedule = v_new_shift
    WHERE phone_number = p_phone;
    
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE NOTICE 'Nurse does not exist';
        ROLLBACK;
    WHEN TOO_MANY_ROWS THEN
        RAISE NOTICE 'Multiple nurses found with same phone number';
        ROLLBACK;
    WHEN OTHERS THEN
        RAISE NOTICE 'Error: %', SQLERRM;
        ROLLBACK;
END;
$$;
