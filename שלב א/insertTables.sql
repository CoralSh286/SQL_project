INSERT INTO treatment (t_id,name,wait_after)
VALUES
  (1,'Surgery','3'),
  (2,'Surgery','4'),
  (3,'Surgery','4'),
  (4,'Dialysis','3'),
  (5,'Psychological','1'),
  (6,'Chemotherapy','1'),
  (7,'Dialysis','5'),
  (8,'Surgery','1'),
  (9,'Physiotherapy','4'),
  (10,'Surgery','3');


insert into patient_report (r_id, report_type, report_date, p_id) values (1, 'Hospitalization', '2/15/2012', 1);
insert into patient_report (r_id, report_type, report_date, p_id) values (2, 'observation', '9/30/2003', 2);
insert into patient_report (r_id, report_type, report_date, p_id) values (3, 'Hospitalization', '10/4/2014', 3);
insert into patient_report (r_id, report_type, report_date, p_id) values (4, 'Discharged', '5/30/2012', 4);
insert into patient_report (r_id, report_type, report_date, p_id) values (5, 'Hospitalization', '9/25/2012', 5);
insert into patient_report (r_id, report_type, report_date, p_id) values (6, 'Discharged', '5/6/2002', 6);
insert into patient_report (r_id, report_type, report_date, p_id) values (7, 'Hospitalization', '6/29/2021', 7);
insert into patient_report (r_id, report_type, report_date, p_id) values (8, 'observation', '8/5/2023', 8);
insert into patient_report (r_id, report_type, report_date, p_id) values (9, 'observation', '5/19/2006', 9);
insert into patient_report (r_id, report_type, report_date, p_id) values (10, 'Discharged', '2/21/2016', 10);


insert into patient (p_id, p_first_name, p_last_name, date_of_birth, b_id) values (1, 'Fredek', 'McGriffin', '1/12/1990', 1000);
insert into patient (p_id, p_first_name, p_last_name, date_of_birth, b_id) values (2, 'Lorne', 'Terry', '10/13/2008', 1001);
insert into patient (p_id, p_first_name, p_last_name, date_of_birth, b_id) values (3, 'Trey', 'Ottewill', '1/25/2007', 1002);
insert into patient (p_id, p_first_name, p_last_name, date_of_birth, b_id) values (4, 'Glennie', 'Sapir', '3/6/2015', 1003);
insert into patient (p_id, p_first_name, p_last_name, date_of_birth, b_id) values (5, 'Billy', 'Quan', '11/29/1977', 1004);
insert into patient (p_id, p_first_name, p_last_name, date_of_birth, b_id) values (6, 'Rurik', 'MacIlraith', '11/2/1967', 1005);
insert into patient (p_id, p_first_name, p_last_name, date_of_birth, b_id) values (7, 'Erhart', 'Barts', '1/17/2001', 1006);
insert into patient (p_id, p_first_name, p_last_name, date_of_birth, b_id) values (8, 'Elwyn', 'Rochelle', '11/13/1997', 1007);
insert into patient (p_id, p_first_name, p_last_name, date_of_birth, b_id) values (9, 'Neron', 'Shama', '10/1/2018', 1008);
insert into patient (p_id, p_first_name, p_last_name, date_of_birth, b_id) values (10, 'Javier', 'Swaile', '7/5/1984', 1009);
insert into patient (p_id, p_first_name, p_last_name, date_of_birth, b_id) values (11, 'Annetta', 'Row', '5/3/1964', 1010);


insert into nurse (n_id, n_first_name, n_last_name, shift_schedule, phone_number) values (1, 'Eden', 'Leatherbarrow', 'afternoon', '1234119289');
insert into nurse (n_id, n_first_name, n_last_name, shift_schedule, phone_number) values (2, 'Bryon', 'Filgate', 'night', '1069878694');
insert into nurse (n_id, n_first_name, n_last_name, shift_schedule, phone_number) values (3, 'Leupold', 'Dallewater', 'afternoon', '1645124171');
insert into nurse (n_id, n_first_name, n_last_name, shift_schedule, phone_number) values (4, 'Winslow', 'Veness', 'afternoon', '1148879720');
insert into nurse (n_id, n_first_name, n_last_name, shift_schedule, phone_number) values (5, 'Beulah', 'Copsey', 'afternoon', '4936012565');
insert into nurse (n_id, n_first_name, n_last_name, shift_schedule, phone_number) values (6, 'Ole', 'Marlon', 'afternoon', '5005622413');
insert into nurse (n_id, n_first_name, n_last_name, shift_schedule, phone_number) values (7, 'Frederic', 'Andrei', 'Morning', '8423553222');
insert into nurse (n_id, n_first_name, n_last_name, shift_schedule, phone_number) values (8, 'Nevile', 'Pratton', 'afternoon', '7049766367');
insert into nurse (n_id, n_first_name, n_last_name, shift_schedule, phone_number) values (9, 'Nariko', 'Cruttenden', 'Morning', '5483944557');
insert into nurse (n_id, n_first_name, n_last_name, shift_schedule, phone_number) values (10, 'Dannie', 'Hawkslee', 'afternoon', '2813988355');


insert into examination (p_id, n_id) values (29, '273');
insert into examination (p_id, n_id) values (225, '53');
insert into examination (p_id, n_id) values (285, '269');
insert into examination (p_id, n_id) values (324, '331');
insert into examination (p_id, n_id) values (359, '349');
insert into examination (p_id, n_id) values (86, '201');
insert into examination (p_id, n_id) values (30, '184');
insert into examination (p_id, n_id) values (78, '38');
insert into examination (p_id, n_id) values (248, '78');
insert into examination (p_id, n_id) values (388, '16');
insert into examination (p_id, n_id) values (211, '96');


INSERT INTO doctor (d_id,d_first_name,d_last_name,gender,specialization)
VALUES
  (401,'Madeline','Hinton','female','Orthopedics'),
  (402,'Sebastian','Greene','female','Orthopedics'),
  (403,'Jamal','Stafford','female','Orthopedics'),
  (404,'Wyatt','Orr','male','Orthopedics'),
  (405,'Medge','Wilder','female','Pediatrics'),
  (406,'Marny','Bryant','male','Orthopedics'),
  (407,'Shelby','Sosa','female','Orthopedics'),
  (408,'Zephr','Rasmussen','male','Pediatrics'),
  (409,'Dustin','Donovan','female','Pediatrics'),
  (410,'Jessica','Mccoy','male','Orthopedics');


INSERT INTO bed (b_id,num_room,is_available)
VALUES
  (1000,153,'Yes'),
  (1001,126,'Yes'),
  (1002,196,'Yes'),
  (1003,184,'Yes'),
  (1004,141,'Yes'),
  (1005,150,'No'),
  (1006,163,'Yes'),
  (1007,133,'Yes'),
  (1008,135,'Yes'),
  (1009,118,'Yes');


INSERT INTO treated_by (p_id, t_id) VALUES (1, 167);
INSERT INTO treated_by (p_id, t_id) VALUES (1, 310);
INSERT INTO treated_by (p_id, t_id) VALUES (2, 144);
INSERT INTO treated_by (p_id, t_id) VALUES (2, 75);
INSERT INTO treated_by (p_id, t_id) VALUES (3, 168);
INSERT INTO treated_by (p_id, t_id) VALUES (3, 20);
INSERT INTO treated_by (p_id, t_id) VALUES (3, 166);
INSERT INTO treated_by (p_id, t_id) VALUES (4, 18);
INSERT INTO treated_by (p_id, t_id) VALUES (4, 5);
INSERT INTO treated_by (p_id, t_id) VALUES (4, 343);


INSERT INTO performs (t_id, d_id) VALUES (86, 775);
INSERT INTO performs (t_id, d_id) VALUES (87, 543);
INSERT INTO performs (t_id, d_id) VALUES (87, 434);
INSERT INTO performs (t_id, d_id) VALUES (88, 677);
INSERT INTO performs (t_id, d_id) VALUES (88, 690);
INSERT INTO performs (t_id, d_id) VALUES (88, 410);
INSERT INTO performs (t_id, d_id) VALUES (89, 629);
INSERT INTO performs (t_id, d_id) VALUES (90, 685);
INSERT INTO performs (t_id, d_id) VALUES (91, 413);
INSERT INTO performs (t_id, d_id) VALUES (92, 773);
INSERT INTO performs (t_id, d_id) VALUES (93, 690);
INSERT INTO performs (t_id, d_id) VALUES (94, 781);
