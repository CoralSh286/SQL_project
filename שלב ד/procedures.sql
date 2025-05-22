--procedure1

CREATE OR REPLACE PROCEDURE assign_volunteer_to_patient_new(p_patient_id INTEGER, p_volunteer_id INTEGER)
LANGUAGE plpgsql AS $$
DECLARE
    existing_count INTEGER;
BEGIN
    -- Basic check that patient and volunteer exist
    IF NOT EXISTS (SELECT 1 FROM patient WHERE p_id = p_patient_id) THEN
        RAISE NOTICE 'Patient does not exist';
        RETURN;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM volunteer WHERE volunteerid = p_volunteer_id) THEN
        RAISE NOTICE 'Volunteer does not exist';
        RETURN;
    END IF;
    
    -- Check if assignment already exists
    SELECT COUNT(*) INTO existing_count
    FROM volunteerfor
    WHERE patientid = p_patient_id AND volunteerid = p_volunteer_id;
    
    IF existing_count > 0 THEN
        RAISE NOTICE 'Volunteer is already assigned to this patient';
        RETURN;
    END IF;
    
    -- Add new assignment
    INSERT INTO volunteerfor (patientid, volunteerid)
    VALUES (p_patient_id, p_volunteer_id);
    
    RAISE NOTICE 'Volunteer % assigned to patient %', p_volunteer_id, p_patient_id;
    
EXCEPTION
    WHEN unique_violation THEN
        RAISE NOTICE 'Volunteer is already assigned to this patient (unique constraint violation)';
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error - invalid data';
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END;
$$;







--procedure2

CREATE OR REPLACE PROCEDURE update_nurse_shift_new(p_phone VARCHAR)
LANGUAGE plpgsql AS $$
DECLARE
    v_shift VARCHAR(50);
    v_new_shift VARCHAR(50);
    v_nurse_id INTEGER;
    v_nurse_name VARCHAR(101);
    patient_rec RECORD;
    new_nurse_rec RECORD;
    v_patient_count INTEGER := 0;
    v_reassigned_count INTEGER := 0;
BEGIN
    -- Get nurse information
    SELECT n_id, n_first_name  ' '  n_last_name, shift_schedule 
    INTO v_nurse_id, v_nurse_name, v_shift
    FROM nurse WHERE phone_number = p_phone;
    
    -- Determine the new shift
    IF UPPER(v_shift) = 'MORNING' THEN
        v_new_shift := 'afternoon';
    ELSIF UPPER(v_shift) = 'AFTERNOON' THEN
        v_new_shift := 'night';
    ELSE
        v_new_shift := 'Morning';
    END IF;
    
    -- Find patients that the nurse examines
    FOR patient_rec IN 
        SELECT p.p_id, p.p_first_name, p.p_last_name
        FROM patient p
        JOIN examination e ON p.p_id = e.p_id
        WHERE e.n_id = v_nurse_id
    LOOP
        v_patient_count := v_patient_count + 1;
        
        -- Find another nurse in the same new shift to handle the patient
        SELECT n.n_id, n.n_first_name, n.n_last_name 
        INTO new_nurse_rec
        FROM nurse n
        WHERE n.shift_schedule = v_new_shift
          AND n.n_id != v_nurse_id
          AND NOT EXISTS (
             SELECT 1 FROM examination e2
             WHERE e2.p_id = patient_rec.p_id AND e2.n_id = n.n_id
          )
        LIMIT 1;
        
        -- If a suitable nurse is found, try to assign the patient
        IF FOUND THEN
            -- Check if there's already an examination record
            IF NOT EXISTS (
                SELECT 1 FROM examination
                WHERE p_id = patient_rec.p_id AND n_id = new_nurse_rec.n_id
            ) THEN
                -- Add a new examination record
                INSERT INTO examination (p_id, n_id)
                VALUES (patient_rec.p_id, new_nurse_rec.n_id);
                
                v_reassigned_count := v_reassigned_count + 1;
                
                RAISE NOTICE 'Patient % % (ID: %) assigned to nurse % % after shift change',
                          patient_rec.p_first_name,
                          patient_rec.p_last_name,
                          patient_rec.p_id,
                          new_nurse_rec.n_first_name,
                          new_nurse_rec.n_last_name;
            END IF;
        END IF;
    END LOOP;
    
    -- Update the shift in the database
    UPDATE nurse SET shift_schedule = v_new_shift
    WHERE phone_number = p_phone;
    
    RAISE NOTICE '';
    RAISE NOTICE 'Shift for % successfully updated from % to %', v_nurse_name, v_shift, v_new_shift;
    RAISE NOTICE 'Summary: % patients, % reassigned', v_patient_count, v_reassigned_count;
               
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE NOTICE 'Nurse not found';
        ROLLBACK;
    WHEN OTHERS THEN
        RAISE NOTICE 'Error: %', SQLERRM;
        ROLLBACK;
END;
$$;
