 CREATE TABLE doctor (
    d_id INT PRIMARY KEY,
    d_first_name VARCHAR(50),
    d_last_name VARCHAR(50),
    gender VARCHAR(10),
    specialization VARCHAR(100)
);

CREATE TABLE nurse (
    n_id INT PRIMARY KEY,
    n_first_name VARCHAR(50),
    n_last_name VARCHAR(50),
    shift_schedule VARCHAR(100),
    phone_number VARCHAR(15)
);

CREATE TABLE bed (
    b_id INT PRIMARY KEY,
    num_room INT,
    is_available BOOLEAN
);

CREATE TABLE patient (
    p_id INT PRIMARY KEY,
    p_first_name VARCHAR(50),
    p_last_name VARCHAR(50),
    date_of_birth DATE,
    b_id INT,
    FOREIGN KEY (b_id) REFERENCES bed(b_id) ON DELETE SET NULL
);

CREATE TABLE treatment (
    t_id INT PRIMARY KEY,
    name VARCHAR(100),
    wait_after INT
);

CREATE TABLE patient_report (
    r_id INT PRIMARY KEY,
    report_type VARCHAR(100),
    date DATE,
    p_id INT,
    FOREIGN KEY (p_id) REFERENCES patient(p_id) ON DELETE CASCADE
);

CREATE TABLE examination (
    p_id INT,
    n_id INT,
    PRIMARY KEY (p_id, n_id),
    FOREIGN KEY (p_id) REFERENCES patient(p_id) ON DELETE CASCADE,
    FOREIGN KEY (n_id) REFERENCES nurse(n_id) ON DELETE CASCADE
);

CREATE TABLE performs (
    t_id INT,
    d_id INT,
    PRIMARY KEY (t_id, d_id),
    FOREIGN KEY (t_id) REFERENCES treatment(t_id) ON DELETE CASCADE,
    FOREIGN KEY (d_id) REFERENCES doctor(d_id) ON DELETE CASCADE
);

CREATE TABLE treated_by (
    p_id INT,
    t_id INT,
    PRIMARY KEY (p_id, t_id),
    FOREIGN KEY (p_id) REFERENCES patient(p_id) ON DELETE CASCADE,
    FOREIGN KEY (t_id) REFERENCES treatment(t_id) ON DELETE CASCADE
);
