DO $$
DECLARE
    vol_cursor REFCURSOR;
    rec_type VARCHAR;
    rec_name VARCHAR;
    rec_date DATE;
BEGIN
    vol_cursor := get_volunteer_info('smees2@illinois.edu', 'date', 'DESC');
    
    LOOP
        FETCH vol_cursor INTO rec_type, rec_name, rec_date;
        EXIT WHEN NOT FOUND;
        RAISE NOTICE '% - %: %', rec_type, rec_name, rec_date;
    END LOOP;
    CLOSE vol_cursor;

  
    CALL assign_volunteer_to_patient_new(301, 128);
END $$;
