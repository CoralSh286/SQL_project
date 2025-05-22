DO $$
DECLARE
    treatment_count INTEGER;
BEGIN
    treatment_count := get_doctor_treatments(520);
    RAISE NOTICE 'num treatment: %', treatment_count;
  RAISE NOTICE ' ';
    
    CALL update_nurse_shift_new('1234119289');
END $$;
