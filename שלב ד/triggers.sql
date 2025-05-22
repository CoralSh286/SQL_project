--trigger1

CREATE OR REPLACE FUNCTION update_patient_volunteers_count_func()
RETURNS TRIGGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    IF (TG_OP = 'INSERT') THEN
        v_count := (SELECT COUNT(*) FROM volunteerfor WHERE patientid = NEW.patientid);
        
        RAISE NOTICE 'Patient % now has % volunteers', NEW.patientid, v_count;
        
    ELSIF (TG_OP = 'DELETE') THEN
        v_count := (SELECT COUNT(*) FROM volunteerfor WHERE patientid = OLD.patientid);
        
        RAISE NOTICE 'Patient % now has % volunteers', OLD.patientid, v_count;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- The trigger itself
CREATE TRIGGER update_patient_volunteers_count
AFTER INSERT OR DELETE ON volunteerfor
FOR EACH ROW
EXECUTE FUNCTION update_patient_volunteers_count_func();







--trigger2

CREATE OR REPLACE FUNCTION monitor_nurse_shift_changes_func()
RETURNS TRIGGER AS $$
DECLARE
    v_shift_count INTEGER;
BEGIN
    -- Print message about shift change
    RAISE NOTICE 'Nurse % % changed shift from % to %', 
                NEW.n_first_name, 
                NEW.n_last_name, 
                OLD.shift_schedule, 
                NEW.shift_schedule;
    
    -- Check if there are enough nurses in the new shift
    v_shift_count := (SELECT COUNT(*) FROM nurse WHERE shift_schedule = OLD.shift_schedule);
    
    IF v_shift_count < 119 THEN
        RAISE NOTICE 'Warning: fewer than 120 nurses in shift %', NEW.shift_schedule;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- The trigger itself
CREATE TRIGGER monitor_nurse_shift_changes
AFTER UPDATE OF shift_schedule ON nurse
FOR EACH ROW
EXECUTE FUNCTION monitor_nurse_shift_changes_func();
