CREATE TABLE nurse (
  n_id INT PRIMARY KEY NOT NULL,
  n_first_name VARCHAR(50) NOT NULL,
  n_last_name VARCHAR(50) NOT NULL,
  shift_schedule VARCHAR(50) NOT NULL,
  phone_number VARCHAR(20) NOT NULL
);

CREATE TABLE treatment (
  t_id INT PRIMARY KEY NOT NULL,
  name VARCHAR(100) NOT NULL,
  wait_after INT NOT NULL
);

CREATE TABLE doctor (
  d_id INT PRIMARY KEY NOT NULL,
  d_first_name VARCHAR(50) NOT NULL,
  d_last_name VARCHAR(50) NOT NULL,
  gender VARCHAR(10) NOT NULL,
  specialization VARCHAR(100) NOT NULL
);

CREATE TABLE bed (
  b_id INT PRIMARY KEY NOT NULL,
  num_room INT NOT NULL,
  is_available BOOLEAN NOT NULL
);

CREATE TABLE performs (
  t_id INT NOT NULL,
  d_id INT NOT NULL,
  PRIMARY KEY (t_id, d_id),
  FOREIGN KEY (t_id) REFERENCES treatment(t_id),
  FOREIGN KEY (d_id) REFERENCES doctor(d_id)
);

CREATE TABLE patient (
  p_id INT PRIMARY KEY NOT NULL,
  p_first_name VARCHAR(50) NOT NULL,
  p_last_name VARCHAR(50) NOT NULL,
  date_of_birth DATE NOT NULL,
  b_id INT NOT NULL,
  FOREIGN KEY (b_id) REFERENCES bed(b_id)
);

CREATE TABLE patient_report (
  r_id INT PRIMARY KEY NOT NULL,
  report_type VARCHAR(50) NOT NULL,
  report_date DATE NOT NULL,
  p_id INT NOT NULL,
  FOREIGN KEY (p_id) REFERENCES patient(p_id)
);

CREATE TABLE examination (
  p_id INT NOT NULL,
  n_id INT NOT NULL,
  PRIMARY KEY (p_id, n_id),
  FOREIGN KEY (p_id) REFERENCES patient(p_id),
  FOREIGN KEY (n_id) REFERENCES nurse(n_id)
);

CREATE TABLE treated_by (
  p_id INT NOT NULL,
  t_id INT NOT NULL,
  PRIMARY KEY (p_id, t_id),
  FOREIGN KEY (p_id) REFERENCES patient(p_id),
  FOREIGN KEY (t_id) REFERENCES treatment(t_id)
);
