--function1

CREATE OR REPLACE FUNCTION get_volunteer_info(
    p_email VARCHAR,
    p_sort_by VARCHAR DEFAULT 'date', -- 'date', 'name', 'type'
    p_order VARCHAR DEFAULT 'ASC'     -- 'ASC', 'DESC'
) 
RETURNS REFCURSOR AS $$
DECLARE
    v_cursor REFCURSOR;
    v_vol_id INTEGER;
    v_sort_clause VARCHAR;
BEGIN
    -- Find volunteer ID by email
    SELECT volunteerid INTO v_vol_id FROM volunteer WHERE email = p_email;
    
    -- Build the sorting clause
    IF p_sort_by = 'date' THEN
        v_sort_clause := ' ORDER BY 3 '  p_order;
    ELSIF p_sort_by = 'name' THEN
        v_sort_clause := ' ORDER BY 2 '  p_order;
    ELSIF p_sort_by = 'type' THEN
        v_sort_clause := ' ORDER BY 1 '  p_order;
    ELSE
        v_sort_clause := ' ORDER BY 3 '  p_order;
    END IF;
    
    -- Open cursor with the requested sorting
    OPEN v_cursor FOR EXECUTE 
        'SELECT ''Training''::VARCHAR AS type, t.trainingname::VARCHAR, t.trainingdate::DATE
         FROM training t JOIN trained tr ON t.trainingid = tr.trainingid
         WHERE tr.volunteerid = '  v_vol_id  '
         UNION ALL
         SELECT ''Project''::VARCHAR AS type, p.projectname::VARCHAR, p.startdate::DATE
         FROM project p JOIN assignedto a ON p.projectid = a.projectid
         WHERE a.volunteerid = '  v_vol_id  
         v_sort_clause;
    
    RETURN v_cursor;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE NOTICE 'Volunteer not found';
        RETURN NULL;
    WHEN OTHERS THEN
        RAISE NOTICE 'Error: %', SQLERRM;
        RETURN NULL;
END;
$$ LANGUAGE plpgsql;







--function2

CREATE OR REPLACE FUNCTION get_doctor_treatments(p_doctor_id INTEGER) 
RETURNS INTEGER AS $$
DECLARE
    v_specialization VARCHAR(100);
    v_count INTEGER := 0;
    treatment_rec RECORD;
    v_workload INTEGER := 0;
    v_complexity INTEGER;
    v_complexity_desc VARCHAR(20);
BEGIN
    -- Get doctor's specialization
    SELECT specialization INTO v_specialization 
    FROM doctor WHERE d_id = p_doctor_id;
    
    RAISE NOTICE 'Specialization: %', v_specialization;
    
    -- Loop through treatments with workload calculation
    FOR treatment_rec IN 
        SELECT t.name, t.wait_after
        FROM treatment t
        JOIN performs p ON t.t_id = p.t_id
        WHERE p.d_id = p_doctor_id
    LOOP
        v_count := v_count + 1;
        
        -- Calculate treatment complexity based on wait time
        v_complexity := CASE 
            WHEN treatment_rec.wait_after <= 2 THEN 1  -- Simple
            WHEN treatment_rec.wait_after <= 5 THEN 2  -- Medium
            ELSE 3  -- Complex
        END;
        
        v_complexity_desc := CASE v_complexity
            WHEN 1 THEN 'Simple'
            WHEN 2 THEN 'Medium'
            WHEN 3 THEN 'Complex'
        END;
        
        -- Calculate total workload (workload = complexity * 10)
        v_workload := v_workload + (v_complexity * 10);
        
        RAISE NOTICE 'Treatment %: % (Complexity: %, Wait time: % days)', 
                   v_count, treatment_rec.name, v_complexity_desc, treatment_rec.wait_after;
    END LOOP;
    
    -- Workload analysis
    RAISE NOTICE '';
    RAISE NOTICE 'Workload Analysis:';
    RAISE NOTICE 'Total workload: %', v_workload;
    RAISE NOTICE 'Average workload per treatment: %', 
               CASE WHEN v_count > 0 THEN ROUND(v_workload::NUMERIC / v_count, 1) ELSE 0 END;
    
    -- Overall workload assessment
    RAISE NOTICE 'Workload assessment: %', 
               CASE 
                   WHEN v_workload < 30 THEN 'Low'
                   WHEN v_workload < 60 THEN 'Medium'
                   ELSE 'High'
               END;
    
    RETURN v_count;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE NOTICE 'Doctor not found';
        RETURN -1;
    WHEN OTHERS THEN
        RAISE NOTICE 'Error: %', SQLERRM;
        RETURN -1;
END;
$$ LANGUAGE plpgsql;
