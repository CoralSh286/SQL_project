CREATE TABLE nurse
(
  n_first_name INT NOT NULL,
  n_last_name INT NOT NULL,
  n_id INT NOT NULL,
  shift_schedule INT NOT NULL,
  phone_number INT NOT NULL,
  PRIMARY KEY (n_id)
);

CREATE TABLE threatment
(
  t_id INT NOT NULL,
  name INT NOT NULL,
  wait_after INT NOT NULL,
  PRIMARY KEY (t_id)
);

CREATE TABLE doctor
(
  d_id INT NOT NULL,
  d_first_name INT NOT NULL,
  d_last_name INT NOT NULL,
  gender INT NOT NULL,
  specialization INT NOT NULL,
  PRIMARY KEY (d_id)
);

CREATE TABLE bed
(
  b_id INT NOT NULL,
  num_room INT NOT NULL,
  is_available INT NOT NULL,
  PRIMARY KEY (b_id)
);

CREATE TABLE performs
(
  t_id INT NOT NULL,
  d_id INT NOT NULL,
  PRIMARY KEY (t_id, d_id),
  FOREIGN KEY (t_id) REFERENCES threatment(t_id),
  FOREIGN KEY (d_id) REFERENCES doctor(d_id)
);

CREATE TABLE patient
(
  p_id INT NOT NULL,
  p_first_name INT NOT NULL,
  p_last_name INT NOT NULL,
  date_of_birth INT NOT NULL,
  b_id INT NOT NULL,
  PRIMARY KEY (p_id),
  FOREIGN KEY (b_id) REFERENCES bed(b_id)
);

CREATE TABLE ptient_report
(
  report_type INT NOT NULL,
  date INT NOT NULL,
  r_id INT NOT NULL,
  p_id INT NOT NULL,
  PRIMARY KEY (r_id),
  FOREIGN KEY (p_id) REFERENCES patient(p_id)
);

CREATE TABLE examination
(
  p_id INT NOT NULL,
  n_id INT NOT NULL,
  PRIMARY KEY (p_id, n_id),
  FOREIGN KEY (p_id) REFERENCES patient(p_id),
  FOREIGN KEY (n_id) REFERENCES nurse(n_id)
);

CREATE TABLE treated_by
(
  p_id INT NOT NULL,
  t_id INT NOT NULL,
  PRIMARY KEY (p_id, t_id),
  FOREIGN KEY (p_id) REFERENCES patient(p_id),
  FOREIGN KEY (t_id) REFERENCES threatment(t_id)
);
