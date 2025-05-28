document.addEventListener('DOMContentLoaded', function() {
    // קישורי התפריט
    const doctorsLink = document.getElementById('doctors-link');
    const patientsLink = document.getElementById('patients-link');
    const volunteersLink = document.getElementById('volunteers-link');
    const volunteerforLink = document.getElementById('volunteerfor-link');
    const queriesLink = document.getElementById('queries-link');

    // כרטיסיות בדף הבית
    const cardDoctors = document.getElementById('card-doctors');
    const cardPatients = document.getElementById('card-patients');
    const cardVolunteers = document.getElementById('card-volunteers');
    const cardVolunteerfor = document.getElementById('card-volunteerfor');
    const cardQueries = document.getElementById('card-queries');

    // אזורים בדף
    const welcomeSection = document.getElementById('welcome-section');
    const contentSection = document.getElementById('content-section');

    // הוספת מאזיני אירועים לקישורים
    doctorsLink.addEventListener('click', function(e) {
        e.preventDefault();
        loadDoctorsPage();
    });

    patientsLink.addEventListener('click', function(e) {
        e.preventDefault();
        loadPatientsPage();
    });

    volunteersLink.addEventListener('click', function(e) {
        e.preventDefault();
        loadVolunteersPage();
    });

    volunteerforLink.addEventListener('click', function(e) {
            e.preventDefault();
            loadVolunteerforPage();
        });

        queriesLink.addEventListener('click', function(e) {
            e.preventDefault();
            loadQueriesPage();
        });

        // הוספת מאזיני אירועים לכרטיסיות בדף הבית
        cardDoctors.addEventListener('click', loadDoctorsPage);
        cardPatients.addEventListener('click', loadPatientsPage);
        cardVolunteers.addEventListener('click', loadVolunteersPage);
        cardVolunteerfor.addEventListener('click', loadVolunteerforPage);
        cardQueries.addEventListener('click', loadQueriesPage);

        // פונקציות לטעינת הדפים השונים
         function loadDoctorsPage() {
                welcomeSection.style.display = 'none';
                contentSection.style.display = 'block';

                // טעינת תוכן הדף
                contentSection.innerHTML = `
                    <h2>ניהול רופאים</h2>
                    <p>מסך זה מאפשר לך לנהל את רשימת הרופאים במערכת.</p>

                    <div class="controls">
                        <div class="search-container">
                            <input type="number" id="doctor-search" placeholder="חיפוש לפי מזהה רופא">
                            <button id="doctor-search-btn" class="btn">חפש</button>
                            <button id="doctor-clear-search-btn" class="btn">נקה חיפוש</button>
                        </div>
                        <button id="add-doctor-btn" class="btn btn-success">הוסף רופא חדש</button>
                    </div>

                    <div id="doctors-list" class="list-container">
                        <div class="loading">טוען נתונים...</div>
                    </div>

                    <!-- טופס להוספת רופא חדש -->
                    <div id="add-doctor-form" class="modal">
                        <div class="modal-content">
                            <span class="close-modal">&times;</span>
                            <h3 id="doctor-form-title">הוספת רופא חדש</h3>

                            <form id="doctor-form">
                                <input type="hidden" id="doctor-form-mode" value="add">

                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="d_id" class="field-required">מזהה רופא:</label>
                                        <input type="number" id="d_id" name="d_id" required>
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="d_first_name" class="field-required">שם פרטי:</label>
                                        <input type="text" id="d_first_name" name="d_first_name" required>
                                    </div>

                                    <div class="form-group">
                                        <label for="d_last_name" class="field-required">שם משפחה:</label>
                                        <input type="text" id="d_last_name" name="d_last_name" required>
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="gender" class="field-required">מגדר:</label>
                                        <select id="gender" name="gender" required>
                                            <option value="">בחר</option>
                                            <option value="male">male</option>
                                            <option value="female">female</option>
                                            <option value="other">other</option>
                                        </select>
                                    </div>

                                    <div class="form-group">
                                        <label for="specialization" class="field-required">התמחות:</label>
                                        <input type="text" id="specialization" name="specialization" required>
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="email">אימייל:</label>
                                        <input type="email" id="email" name="email">
                                    </div>

                                    <div class="form-group">
                                        <label for="phone_number">מספר טלפון:</label>
                                        <input type="tel" id="phone_number" name="phone_number">
                                    </div>
                                </div>

                                <div class="form-buttons">
                                    <button type="submit" class="btn btn-success">שמור</button>
                                    <button type="button" id="cancel-doctor-btn" class="btn">ביטול</button>
                                </div>
                            </form>
                        </div>
                    </div>
                `;

                // טעינת רשימת הרופאים
                loadDoctorsList();

                // הוספת מאזיני אירועים
                document.getElementById('add-doctor-btn').addEventListener('click', showAddDoctorForm);
                document.querySelector('.close-modal').addEventListener('click', hideAddDoctorForm);
                document.getElementById('cancel-doctor-btn').addEventListener('click', hideAddDoctorForm);
                document.getElementById('doctor-form').addEventListener('submit', saveDoctorForm);

                // מאזיני אירועים לחיפוש
                document.getElementById('doctor-search-btn').addEventListener('click', searchDoctor);
                document.getElementById('doctor-clear-search-btn').addEventListener('click', () => {
                    document.getElementById('doctor-search').value = '';
                    loadDoctorsList(); // טעינה מחדש של כל הרופאים
                });

                // חיפוש בלחיצה על Enter
                document.getElementById('doctor-search').addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        searchDoctor();
                    }
                });
            }

            function loadPatientsPage() {
                welcomeSection.style.display = 'none';
                contentSection.style.display = 'block';

                // טעינת תוכן הדף
                contentSection.innerHTML = `
                    <h2>ניהול מטופלים</h2>
                    <p>מסך זה מאפשר לך לנהל את רשימת המטופלים במערכת.</p>

                    <div class="controls">
                        <div class="search-container">
                            <input type="number" id="patient-search" placeholder="חיפוש לפי מזהה מטופל">
                            <button id="patient-search-btn" class="btn">חפש</button>
                            <button id="patient-clear-search-btn" class="btn">נקה חיפוש</button>
                        </div>
                        <button id="add-patient-btn" class="btn btn-success">הוסף מטופל חדש</button>
                    </div>

                    <div id="patients-list" class="list-container">
                        <div class="loading">טוען נתונים...</div>
                    </div>

                    <!-- טופס להוספת מטופל חדש -->
                    <div id="add-patient-form" class="modal">
                        <div class="modal-content">
                            <span class="close-modal">&times;</span>
                            <h3 id="patient-form-title">הוספת מטופל חדש</h3>

                            <form id="patient-form">
                                <input type="hidden" id="patient-form-mode" value="add">

                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="p_id" class="field-required">מזהה מטופל:</label>
                                        <input type="number" id="p_id" name="p_id" required>
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="p_first_name" class="field-required">שם פרטי:</label>
                                        <input type="text" id="p_first_name" name="p_first_name" required>
                                    </div>

                                    <div class="form-group">
                                        <label for="p_last_name" class="field-required">שם משפחה:</label>
                                        <input type="text" id="p_last_name" name="p_last_name" required>
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="date_of_birth" class="field-required">תאריך לידה:</label>
                                        <input type="date" id="date_of_birth" name="date_of_birth" required>
                                    </div>

                                    <div class="form-group">
                                        <label for="b_id" class="field-required">מיטה:</label>
                                        <select id="b_id" name="b_id" required>
                                            <option value="">בחר מיטה</option>
                                            <!-- האפשרויות ייטענו דינמית -->
                                        </select>
                                    </div>
                                </div>

                                <div class="form-buttons">
                                    <button type="submit" class="btn btn-success">שמור</button>
                                    <button type="button" id="cancel-patient-btn" class="btn">ביטול</button>
                                </div>
                            </form>
                        </div>
                    </div>
                `;

                // טעינת רשימת המטופלים
                loadPatientsList();

                // הוספת מאזיני אירועים
                document.getElementById('add-patient-btn').addEventListener('click', showAddPatientForm);
                document.querySelector('.close-modal').addEventListener('click', hideAddPatientForm);
                document.getElementById('cancel-patient-btn').addEventListener('click', hideAddPatientForm);
                document.getElementById('patient-form').addEventListener('submit', savePatientForm);

                // מאזיני אירועים לחיפוש
                document.getElementById('patient-search-btn').addEventListener('click', searchPatient);
                document.getElementById('patient-clear-search-btn').addEventListener('click', () => {
                    document.getElementById('patient-search').value = '';
                    loadPatientsList(); // טעינה מחדש של כל המטופלים
                });

                // חיפוש בלחיצה על Enter
                document.getElementById('patient-search').addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        searchPatient();
                    }
                });
            }

            function loadVolunteersPage() {
                welcomeSection.style.display = 'none';
                contentSection.style.display = 'block';

                // טעינת תוכן הדף
                contentSection.innerHTML = `
                    <h2>ניהול מתנדבים</h2>
                    <p>מסך זה מאפשר לך לנהל את רשימת המתנדבים במערכת.</p>

                    <div class="controls">
                        <div class="search-container">
                            <input type="number" id="volunteer-search" placeholder="חיפוש לפי מזהה מתנדב">
                            <button id="volunteer-search-btn" class="btn">חפש</button>
                            <button id="volunteer-clear-search-btn" class="btn">נקה חיפוש</button>
                        </div>
                        <button id="add-volunteer-btn" class="btn btn-success">הוסף מתנדב חדש</button>
                    </div>

                    <div id="volunteers-list" class="list-container">
                        <div class="loading">טוען נתונים...</div>
                    </div>

                    <!-- טופס להוספת מתנדב חדש -->
                    <div id="add-volunteer-form" class="modal">
                        <div class="modal-content">
                            <span class="close-modal">&times;</span>
                            <h3 id="volunteer-form-title">הוספת מתנדב חדש</h3>

                            <form id="volunteer-form">
                                <input type="hidden" id="volunteer-form-mode" value="add">

                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="volunteerid" class="field-required">מזהה מתנדב:</label>
                                        <input type="number" id="volunteerid" name="volunteerid" required>
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="firstname" class="field-required">שם פרטי:</label>
                                        <input type="text" id="firstname" name="firstname" required>
                                    </div>

                                    <div class="form-group">
                                        <label for="lastname" class="field-required">שם משפחה:</label>
                                        <input type="text" id="lastname" name="lastname" required>
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="phonenumber" class="field-required">מספר טלפון:</label>
                                        <input type="tel" id="phonenumber" name="phonenumber" required>
                                    </div>

                                    <div class="form-group">
                                        <label for="email" class="field-required">אימייל:</label>
                                        <input type="email" id="email" name="email" required>
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="skill" class="field-required">כישורים:</label>
                                        <textarea id="skill" name="skill" required></textarea>
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="doc_managerid" class="field-required">רופא מנהל:</label>
                                        <select id="doc_managerid" name="doc_managerid" required>
                                            <option value="">בחר רופא</option>
                                            <!-- האפשרויות ייטענו דינמית -->
                                        </select>
                                    </div>

                                    <div class="form-group">
                                        <label for="volunteertypeid" class="field-required">סוג מתנדב:</label>
                                        <select id="volunteertypeid" name="volunteertypeid" required>
                                            <option value="">בחר סוג</option>
                                            <!-- האפשרויות ייטענו דינמית -->
                                        </select>
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="nurseid">מזהה אחות (אם רלוונטי):</label>
                                        <input type="number" id="nurseid" name="nurseid">
                                    </div>
                                </div>

                                <div class="form-buttons">
                                    <button type="submit" class="btn btn-success">שמור</button>
                                    <button type="button" id="cancel-volunteer-btn" class="btn">ביטול</button>
                                </div>
                            </form>
                        </div>
                    </div>
                `;

                // טעינת רשימת המתנדבים
                loadVolunteersList();

                // הוספת מאזיני אירועים
                document.getElementById('add-volunteer-btn').addEventListener('click', showAddVolunteerForm);
                document.querySelector('.close-modal').addEventListener('click', hideAddVolunteerForm);
                document.getElementById('cancel-volunteer-btn').addEventListener('click', hideAddVolunteerForm);
                document.getElementById('volunteer-form').addEventListener('submit', saveVolunteerForm);

                // מאזיני אירועים לחיפוש
                document.getElementById('volunteer-search-btn').addEventListener('click', searchVolunteer);
                document.getElementById('volunteer-clear-search-btn').addEventListener('click', () => {
                    document.getElementById('volunteer-search').value = '';
                    loadVolunteersList(); // טעינה מחדש של כל המתנדבים
                });

                // חיפוש בלחיצה על Enter
                document.getElementById('volunteer-search').addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        searchVolunteer();
                    }
                });
            }

            function loadVolunteerforPage() {
                welcomeSection.style.display = 'none';
                contentSection.style.display = 'block';

                // טעינת תוכן הדף
                contentSection.innerHTML = `
                    <h2>ניהול שיבוץ מתנדבים למטופלים</h2>
                    <p>מסך זה מאפשר לך לנהל את שיבוץ המתנדבים למטופלים.</p>

                    <div class="controls">
                        <div class="search-container">
                            <input type="number" id="patient-vf-search" placeholder="חיפוש לפי מזהה מטופל">
                            <input type="number" id="volunteer-vf-search" placeholder="חיפוש לפי מזהה מתנדב">
                            <button id="volunteerfor-search-btn" class="btn">חפש</button>
                            <button id="volunteerfor-clear-search-btn" class="btn">נקה חיפוש</button>
                        </div>
                        <button id="add-volunteerfor-btn" class="btn btn-success">הוסף שיבוץ חדש</button>
                    </div>

                    <div id="volunteerfor-list" class="list-container">
                        <div class="loading">טוען נתונים...</div>
                    </div>

                    <!-- טופס להוספת שיבוץ חדש -->
                    <div id="add-volunteerfor-form" class="modal">
                        <div class="modal-content">
                            <span class="close-modal">&times;</span>
                            <h3>הוספת שיבוץ מתנדב למטופל</h3>

                            <form id="volunteerfor-form">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="patientid" class="field-required">מטופל:</label>
                                        <select id="patientid" name="patientid" required>
                                            <option value="">בחר מטופל</option>
                                            <!-- האפשרויות ייטענו דינמית -->
                                        </select>
                                    </div>

                                    <div class="form-group">
                                        <label for="volunteerid" class="field-required">מתנדב:</label>
                                        <select id="volunteerid" name="volunteerid" required>
                                            <option value="">בחר מתנדב</option>
                                            <!-- האפשרויות ייטענו דינמית -->
                                        </select>
                                    </div>
                                </div>

                                <div class="form-buttons">
                                    <button type="submit" class="btn btn-success">שמור</button>
                                    <button type="button" id="cancel-volunteerfor-btn" class="btn">ביטול</button>
                                </div>
                            </form>
                        </div>
                    </div>
                `;

                // טעינת רשימת השיבוצים
                loadVolunteerforList();

                // הוספת מאזיני אירועים
                document.getElementById('add-volunteerfor-btn').addEventListener('click', showAddVolunteerforForm);
                document.querySelector('.close-modal').addEventListener('click', hideAddVolunteerforForm);
                document.getElementById('cancel-volunteerfor-btn').addEventListener('click', hideAddVolunteerforForm);
                document.getElementById('volunteerfor-form').addEventListener('submit', saveVolunteerforForm);

                // מאזיני אירועים לחיפוש
                document.getElementById('volunteerfor-search-btn').addEventListener('click', searchVolunteerfor);
                document.getElementById('volunteerfor-clear-search-btn').addEventListener('click', () => {
                    document.getElementById('patient-vf-search').value = '';
                    document.getElementById('volunteer-vf-search').value = '';
                    loadVolunteerforList(); // טעינה מחדש של כל השיבוצים
                });

                // חיפוש בלחיצה על Enter
                document.getElementById('patient-vf-search').addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        searchVolunteerfor();
                    }
                });
                document.getElementById('volunteer-vf-search').addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        searchVolunteerfor();
                    }
                });
            }


        function loadQueriesPage() {
            welcomeSection.style.display = 'none';
            contentSection.style.display = 'block';

            // טעינת תוכן הדף
            contentSection.innerHTML = `
                <h2>שאילתות ופרוצדורות</h2>
                <p>מסך זה מאפשר לך להפעיל שאילתות ופרוצדורות מיוחדות.</p>

                <div class="queries-container">
                    <div class="query-card">
                        <h3>שאילתה 1</h3>
                        <p>תיאור של השאילתה יופיע כאן</p>
                        <button class="btn run-query" data-query="query1">הפעל</button>
                    </div>

                    <div class="query-card">
                        <h3>שאילתה 2</h3>
                        <p>תיאור של השאילתה יופיע כאן</p>
                        <button class="btn run-query" data-query="query2">הפעל</button>
                    </div>

                    <div class="query-card">
                        <h3>פרוצדורה 1</h3>
                        <p>תיאור של הפרוצדורה יופיע כאן</p>
                        <button class="btn run-procedure" data-procedure="proc1">הפעל</button>
                    </div>

                    <div class="query-card">
                        <h3>פרוצדורה 2</h3>
                        <p>תיאור של הפרוצדורה יופיע כאן</p>
                        <button class="btn run-procedure" data-procedure="proc2">הפעל</button>
                    </div>
                </div>

                <div id="query-results" class="list-container"></div>
            `;
        }

        // פונקציות למסך ניהול רופאים
        function loadDoctorsList() {
            const doctorsList = document.getElementById('doctors-list');
            doctorsList.innerHTML = '<div class="loading">טוען נתונים...</div>';

            fetch('/api/doctors')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('שגיאה בטעינת נתונים');
                    }
                    return response.json();
                })
                .then(doctors => {
                    if (doctors.length === 0) {
                        doctorsList.innerHTML = '<div class="no-data">אין רופאים במערכת</div>';
                        return;
                    }

                    const table = document.createElement('table');
                    table.className = 'data-table';

                    // יצירת כותרות הטבלה
                    const thead = document.createElement('thead');
                    thead.innerHTML = `
                        <tr>
                            <th>מזהה</th>
                            <th>שם פרטי</th>
                            <th>שם משפחה</th>
                            <th>מגדר</th>
                            <th>התמחות</th>
                            <th>אימייל</th>
                            <th>טלפון</th>
                            <th>פעולות</th>
                        </tr>
                    `;
                    table.appendChild(thead);

                    // יצירת גוף הטבלה
                    const tbody = document.createElement('tbody');

                    doctors.forEach(doctor => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${doctor.d_id}</td>
                            <td>${doctor.d_first_name}</td>
                            <td>${doctor.d_last_name}</td>
                            <td>${doctor.gender}</td>
                            <td>${doctor.specialization}</td>
                            <td>${doctor.email || '-'}</td>
                            <td>${doctor.phone_number || '-'}</td>
                            <td>
                                <button class="btn edit-doctor-btn" data-id="${doctor.d_id}">ערוך</button>
                                <button class="btn btn-danger delete-doctor-btn" data-id="${doctor.d_id}">מחק</button>
                            </td>
                        `;
                        tbody.appendChild(row);
                    });

                    table.appendChild(tbody);
                    doctorsList.innerHTML = '';
                    doctorsList.appendChild(table);

                    // הוספת מאזיני אירועים לכפתורים
                    document.querySelectorAll('.edit-doctor-btn').forEach(button => {
                        button.addEventListener('click', function() {
                            const doctorId = this.getAttribute('data-id');
                            editDoctor(doctorId, doctors);
                        });
                    });

                    document.querySelectorAll('.delete-doctor-btn').forEach(button => {
                        button.addEventListener('click', function() {
                            const doctorId = this.getAttribute('data-id');
                            if (confirm('האם אתה בטוח שברצונך למחוק רופא זה?')) {
                                deleteDoctor(doctorId);
                            }
                        });
                    });
                })
                .catch(error => {
                    doctorsList.innerHTML = `<div class="error">שגיאה בטעינת נתונים: ${error.message}</div>`;
                });
        }

        function showAddDoctorForm() {
            // איפוס הטופס
            document.getElementById('doctor-form').reset();
            document.getElementById('doctor-form-mode').value = 'add';
            document.getElementById('doctor-form-title').textContent = 'הוספת רופא חדש';
            document.getElementById('d_id').removeAttribute('disabled');

            // הצגת הטופס
            document.getElementById('add-doctor-form').style.display = 'block';
        }

        function hideAddDoctorForm() {
            document.getElementById('add-doctor-form').style.display = 'none';
        }

        function editDoctor(doctorId, doctors) {
            const doctor = doctors.find(d => d.d_id == doctorId);
            if (!doctor) return;

            // מילוי הטופס בנתונים הקיימים
            document.getElementById('d_id').value = doctor.d_id;
            document.getElementById('d_id').setAttribute('disabled', 'disabled');
            document.getElementById('d_first_name').value = doctor.d_first_name;
            document.getElementById('d_last_name').value = doctor.d_last_name;
            document.getElementById('gender').value = doctor.gender;
            document.getElementById('specialization').value = doctor.specialization;
            document.getElementById('email').value = doctor.email || '';
            document.getElementById('phone_number').value = doctor.phone_number || '';

            // הגדרת מצב הטופס לעריכה
            document.getElementById('doctor-form-mode').value = 'edit';
            document.getElementById('doctor-form-title').textContent = 'עריכת רופא';

            // הצגת הטופס
            document.getElementById('add-doctor-form').style.display = 'block';
        }

        function saveDoctorForm(e) {
            e.preventDefault();

            const formMode = document.getElementById('doctor-form-mode').value;

            // איסוף נתונים מהטופס
            const doctorData = {
                d_id: document.getElementById('d_id').value,
                d_first_name: document.getElementById('d_first_name').value,
                d_last_name: document.getElementById('d_last_name').value,
                gender: document.getElementById('gender').value,
                specialization: document.getElementById('specialization').value,
                email: document.getElementById('email').value || null,
                phone_number: document.getElementById('phone_number').value || null
            };

            let url = '/api/doctors';
            let method = 'POST';

            if (formMode === 'edit') {
                url = `/api/doctors/${doctorData.d_id}`;
                method = 'PUT';
            }

            // שליחת הנתונים לשרת
            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(doctorData)
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(err.error || 'שגיאה בשמירת הנתונים'); });
                }
                return response.json();
            })
            .then(data => {
                alert(data.message);
                hideAddDoctorForm();
                loadDoctorsList();
            })
            .catch(error => {
                alert(error.message);
            });
        }

        function deleteDoctor(doctorId) {
            fetch(`/api/doctors/${doctorId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(err.error || 'שגיאה במחיקת הרופא'); });
                }
                return response.json();
            })
            .then(data => {
                alert(data.message);
                loadDoctorsList();
            })
            .catch(error => {
                alert(error.message);
            });
        }

        // פונקציות למסך ניהול מטופלים
        // יש להוסיף פונקציות דומות לאלו של ניהול הרופאים, עבור ניהול המטופלים

        // פונקציות למסך ניהול מתנדבים
        // יש להוסיף פונקציות דומות לאלו של ניהול הרופאים, עבור ניהול המתנדבים

        // פונקציות למסך ניהול שיבוץ מתנדבים
        // יש להוסיף פונקציות דומות לניהול רשומות שיבוץ מתנדבים למטופלים

        // פונקציות למסך ניהול מטופלים
        function loadPatientsList() {
            const patientsList = document.getElementById('patients-list');
            patientsList.innerHTML = '<div class="loading">טוען נתונים...</div>';

            fetch('/api/patients')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('שגיאה בטעינת נתונים');
                    }
                    return response.json();
                })
                .then(patients => {
                    if (patients.length === 0) {
                        patientsList.innerHTML = '<div class="no-data">אין מטופלים במערכת</div>';
                        return;
                    }

                    const table = document.createElement('table');
                    table.className = 'data-table';

                    // יצירת כותרות הטבלה
                    const thead = document.createElement('thead');
                    thead.innerHTML = `
                        <tr>
                            <th>מזהה</th>
                            <th>שם פרטי</th>
                            <th>שם משפחה</th>
                            <th>תאריך לידה</th>
                            <th>מספר חדר</th>
                            <th>פעולות</th>
                        </tr>
                    `;
                    table.appendChild(thead);

                    // יצירת גוף הטבלה
                    const tbody = document.createElement('tbody');

                    patients.forEach(patient => {
                        // המרת תאריך לפורמט מקומי
                        const birthDate = new Date(patient.date_of_birth).toLocaleDateString();

                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${patient.p_id}</td>
                            <td>${patient.p_first_name}</td>
                            <td>${patient.p_last_name}</td>
                            <td>${birthDate}</td>
                            <td>${patient.num_room}</td>
                            <td>
                                <button class="btn edit-patient-btn" data-id="${patient.p_id}">ערוך</button>
                                <button class="btn btn-danger delete-patient-btn" data-id="${patient.p_id}">מחק</button>
                            </td>
                        `;
                        tbody.appendChild(row);
                    });

                    table.appendChild(tbody);
                    patientsList.innerHTML = '';
                    patientsList.appendChild(table);

                    // הוספת מאזיני אירועים לכפתורים
                    document.querySelectorAll('.edit-patient-btn').forEach(button => {
                        button.addEventListener('click', function() {
                            const patientId = this.getAttribute('data-id');
                            editPatient(patientId, patients);
                        });
                    });

                    document.querySelectorAll('.delete-patient-btn').forEach(button => {
                                    button.addEventListener('click', function() {
                                        const patientId = this.getAttribute('data-id');
                                        if (confirm('האם אתה בטוח שברצונך למחוק מטופל זה?')) {
                                            deletePatient(patientId);
                                        }
                                    });
                                });
                            })
                            .catch(error => {
                                patientsList.innerHTML = `<div class="error">שגיאה בטעינת נתונים: ${error.message}</div>`;
                            });
                    }

                    function showAddPatientForm() {
                        // איפוס הטופס
                        document.getElementById('patient-form').reset();
                        document.getElementById('patient-form-mode').value = 'add';
                        document.getElementById('patient-form-title').textContent = 'הוספת מטופל חדש';
                        document.getElementById('p_id').removeAttribute('disabled');

                        // טעינת רשימת המיטות הפנויות
                        loadAvailableBeds();

                        // הצגת הטופס
                        document.getElementById('add-patient-form').style.display = 'block';
                    }

                    function hideAddPatientForm() {
                        document.getElementById('add-patient-form').style.display = 'none';
                    }

                    function loadAvailableBeds() {
                        const bedSelect = document.getElementById('b_id');

                        // שליפת רשימת המיטות הפנויות
                        fetch('/api/beds')
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('שגיאה בטעינת מיטות');
                                }
                                return response.json();
                            })
                            .then(beds => {
                                // מחיקת האפשרויות הקיימות
                                while (bedSelect.options.length > 1) {
                                    bedSelect.remove(1);
                                }

                                // הוספת המיטות הפנויות
                                beds.forEach(bed => {
                                    const option = document.createElement('option');
                                    option.value = bed.b_id;
                                    option.textContent = `חדר ${bed.num_room} - מיטה ${bed.b_id}`;
                                    bedSelect.appendChild(option);
                                });

                                // במקרה שאין מיטות פנויות
                                if (beds.length === 0) {
                                    const option = document.createElement('option');
                                    option.value = '';
                                    option.textContent = 'אין מיטות פנויות';
                                    option.disabled = true;
                                    bedSelect.appendChild(option);
                                }
                            })
                            .catch(error => {
                                console.error('שגיאה בטעינת מיטות:', error);
                                alert('שגיאה בטעינת מיטות פנויות');
                            });
                    }

                    function editPatient(patientId, patients) {
                        const patient = patients.find(p => p.p_id == patientId);
                        if (!patient) return;

                        // מילוי הטופס בנתונים הקיימים
                        document.getElementById('p_id').value = patient.p_id;
                        document.getElementById('p_id').setAttribute('disabled', 'disabled');
                        document.getElementById('p_first_name').value = patient.p_first_name;
                        document.getElementById('p_last_name').value = patient.p_last_name;
                        document.getElementById('date_of_birth').value = new Date(patient.date_of_birth).toISOString().split('T')[0];

                        // טעינת רשימת המיטות הפנויות
                        fetch('/api/beds')
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('שגיאה בטעינת מיטות');
                                }
                                return response.json();
                            })
                            .then(beds => {
                                const bedSelect = document.getElementById('b_id');

                                // מחיקת האפשרויות הקיימות
                                while (bedSelect.options.length > 1) {
                                    bedSelect.remove(1);
                                }

                                // הוספת המיטה הנוכחית
                                const currentBedOption = document.createElement('option');
                                currentBedOption.value = patient.b_id;
                                currentBedOption.textContent = `חדר ${patient.num_room} - מיטה ${patient.b_id} (נוכחי)`;
                                bedSelect.appendChild(currentBedOption);

                                // הוספת שאר המיטות הפנויות
                                beds.forEach(bed => {
                                    if (bed.b_id != patient.b_id) {
                                        const option = document.createElement('option');
                                        option.value = bed.b_id;
                                        option.textContent = `חדר ${bed.num_room} - מיטה ${bed.b_id}`;
                                        bedSelect.appendChild(option);
                                    }
                                });

                                // בחירת המיטה הנוכחית
                                bedSelect.value = patient.b_id;
                            })
                            .catch(error => {
                                console.error('שגיאה בטעינת מיטות:', error);
                                alert('שגיאה בטעינת מיטות פנויות');
                            });

                        // הגדרת מצב הטופס לעריכה
                        document.getElementById('patient-form-mode').value = 'edit';
                        document.getElementById('patient-form-title').textContent = 'עריכת מטופל';

                        // הצגת הטופס
                        document.getElementById('add-patient-form').style.display = 'block';
                    }

                    function savePatientForm(e) {
                        e.preventDefault();

                        const formMode = document.getElementById('patient-form-mode').value;

                        // איסוף נתונים מהטופס
                        const patientData = {
                            p_id: document.getElementById('p_id').value,
                            p_first_name: document.getElementById('p_first_name').value,
                            p_last_name: document.getElementById('p_last_name').value,
                            date_of_birth: document.getElementById('date_of_birth').value,
                            b_id: document.getElementById('b_id').value
                        };

                        let url = '/api/patients';
                        let method = 'POST';

                        if (formMode === 'edit') {
                            url = `/api/patients/${patientData.p_id}`;
                            method = 'PUT';
                        }

                        // שליחת הנתונים לשרת
                        fetch(url, {
                            method: method,
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(patientData)
                        })
                        .then(response => {
                            if (!response.ok) {
                                return response.json().then(err => { throw new Error(err.error || 'שגיאה בשמירת הנתונים'); });
                            }
                            return response.json();
                        })
                        .then(data => {
                            alert(data.message);
                            hideAddPatientForm();
                            loadPatientsList();
                        })
                        .catch(error => {
                            alert(error.message);
                        });
                    }

                    function deletePatient(patientId) {
                        fetch(`/api/patients/${patientId}`, {
                            method: 'DELETE'
                        })
                        .then(response => {
                            if (!response.ok) {
                                return response.json().then(err => { throw new Error(err.error || 'שגיאה במחיקת המטופל'); });
                            }
                            return response.json();
                        })
                        .then(data => {
                            alert(data.message);
                            loadPatientsList();
                        })
                        .catch(error => {
                            alert(error.message);
                        });
                    }

                    // פונקציות למסך ניהול מתנדבים
                    function loadVolunteersList() {
                        const volunteersList = document.getElementById('volunteers-list');
                        volunteersList.innerHTML = '<div class="loading">טוען נתונים...</div>';

                        fetch('/api/volunteers')
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('שגיאה בטעינת נתונים');
                                }
                                return response.json();
                            })
                            .then(volunteers => {
                                if (volunteers.length === 0) {
                                    volunteersList.innerHTML = '<div class="no-data">אין מתנדבים במערכת</div>';
                                    return;
                                }

                                const table = document.createElement('table');
                                table.className = 'data-table';

                                // יצירת כותרות הטבלה
                                const thead = document.createElement('thead');
                                thead.innerHTML = `
                                    <tr>
                                        <th>מזהה</th>
                                        <th>שם פרטי</th>
                                        <th>שם משפחה</th>
                                        <th>טלפון</th>
                                        <th>אימייל</th>
                                        <th>סוג מתנדב</th>
                                        <th>רופא מנהל</th>
                                        <th>פעולות</th>
                                    </tr>
                                `;
                                table.appendChild(thead);

                                // יצירת גוף הטבלה
                                const tbody = document.createElement('tbody');

                                volunteers.forEach(volunteer => {
                                    const row = document.createElement('tr');
                                    row.innerHTML = `
                                        <td>${volunteer.volunteerid}</td>
                                        <td>${volunteer.firstname}</td>
                                        <td>${volunteer.lastname}</td>
                                        <td>${volunteer.phonenumber}</td>
                                        <td>${volunteer.email}</td>
                                        <td>${volunteer.typename}</td>
                                        <td>${volunteer.doctor_name}</td>
                                        <td>
                                            <button class="btn edit-volunteer-btn" data-id="${volunteer.volunteerid}">ערוך</button>
                                            <button class="btn btn-danger delete-volunteer-btn" data-id="${volunteer.volunteerid}">מחק</button>
                                        </td>
                                    `;
                                    tbody.appendChild(row);
                                });

                                table.appendChild(tbody);
                                volunteersList.innerHTML = '';
                                volunteersList.appendChild(table);

                                // הוספת מאזיני אירועים לכפתורים
                                document.querySelectorAll('.edit-volunteer-btn').forEach(button => {
                                    button.addEventListener('click', function() {
                                        const volunteerId = this.getAttribute('data-id');
                                        editVolunteer(volunteerId, volunteers);
                                    });
                                });

                                document.querySelectorAll('.delete-volunteer-btn').forEach(button => {
                                    button.addEventListener('click', function() {
                                        const volunteerId = this.getAttribute('data-id');
                                        if (confirm('האם אתה בטוח שברצונך למחוק מתנדב זה?')) {
                                            deleteVolunteer(volunteerId);
                                        }
                                    });
                                });
                            })
                            .catch(error => {
                                volunteersList.innerHTML = `<div class="error">שגיאה בטעינת נתונים: ${error.message}</div>`;
                            });
                    }

                    function showAddVolunteerForm() {
                        // איפוס הטופס
                        document.getElementById('volunteer-form').reset();
                        document.getElementById('volunteer-form-mode').value = 'add';
                        document.getElementById('volunteer-form-title').textContent = 'הוספת מתנדב חדש';
                        document.getElementById('volunteerid').removeAttribute('disabled');

                        // טעינת רשימות הרופאים וסוגי המתנדבים
                        loadDoctorsForSelect();
                        loadVolunteerTypes();

                        // הצגת הטופס
                        document.getElementById('add-volunteer-form').style.display = 'block';
                    }

                    function hideAddVolunteerForm() {
                        document.getElementById('add-volunteer-form').style.display = 'none';
                    }

                    function loadDoctorsForSelect() {
                        const doctorSelect = document.getElementById('doc_managerid');

                        // שליפת רשימת הרופאים
                        fetch('/api/doctors')
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('שגיאה בטעינת רופאים');
                                }
                                return response.json();
                            })
                            .then(doctors => {
                                // מחיקת האפשרויות הקיימות
                                while (doctorSelect.options.length > 1) {
                                    doctorSelect.remove(1);
                                }

                                // הוספת הרופאים
                                doctors.forEach(doctor => {
                                    const option = document.createElement('option');
                                    option.value = doctor.d_id;
                                    option.textContent = `${doctor.d_first_name} ${doctor.d_last_name} (${doctor.specialization})`;
                                    doctorSelect.appendChild(option);
                                });
                            })
                            .catch(error => {
                                console.error('שגיאה בטעינת רופאים:', error);
                                alert('שגיאה בטעינת רשימת הרופאים');
                            });
                    }

                    function loadVolunteerTypes() {
                        const typeSelect = document.getElementById('volunteertypeid');

                        // שליפת רשימת סוגי המתנדבים
                        fetch('/api/volunteertypes')
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('שגיאה בטעינת סוגי מתנדבים');
                                }
                                return response.json();
                            })
                            .then(types => {
                                // מחיקת האפשרויות הקיימות
                                while (typeSelect.options.length > 1) {
                                    typeSelect.remove(1);
                                }

                                // הוספת סוגי המתנדבים
                                types.forEach(type => {
                                    const option = document.createElement('option');
                                    option.value = type.volunteertypeid;
                                    option.textContent = type.typename;
                                    typeSelect.appendChild(option);
                                });
                            })
                            .catch(error => {
                                console.error('שגיאה בטעינת סוגי מתנדבים:', error);
                                alert('שגיאה בטעינת רשימת סוגי המתנדבים');
                            });
                    }

                    function editVolunteer(volunteerId, volunteers) {
                        const volunteer = volunteers.find(v => v.volunteerid == volunteerId);
                        if (!volunteer) return;

                        // מילוי הטופס בנתונים הקיימים
                        document.getElementById('volunteerid').value = volunteer.volunteerid;
                        document.getElementById('volunteerid').setAttribute('disabled', 'disabled');
                        document.getElementById('firstname').value = volunteer.firstname;
                        document.getElementById('lastname').value = volunteer.lastname;
                        document.getElementById('phonenumber').value = volunteer.phonenumber;
                        document.getElementById('email').value = volunteer.email;
                        document.getElementById('skill').value = volunteer.skill;

                        // טעינת רשימות הרופאים וסוגי המתנדבים
                        loadDoctorsForSelect();
                        loadVolunteerTypes();

                        // הגדרת ערכים לבחירה
                        setTimeout(() => {
                            document.getElementById('doc_managerid').value = volunteer.doc_managerid;
                            document.getElementById('volunteertypeid').value = volunteer.volunteertypeid;
                            document.getElementById('nurseid').value = volunteer.nurseid || '';
                        }, 500);

                        // הגדרת מצב הטופס לעריכה
                        document.getElementById('volunteer-form-mode').value = 'edit';
                        document.getElementById('volunteer-form-title').textContent = 'עריכת מתנדב';

                        // הצגת הטופס
                        document.getElementById('add-volunteer-form').style.display = 'block';
                    }

                    function saveVolunteerForm(e) {
                        e.preventDefault();

                        const formMode = document.getElementById('volunteer-form-mode').value;

                        // איסוף נתונים מהטופס
                        const volunteerData = {
                            volunteerid: document.getElementById('volunteerid').value,
                            firstname: document.getElementById('firstname').value,
                            lastname: document.getElementById('lastname').value,
                            phonenumber: document.getElementById('phonenumber').value,
                            email: document.getElementById('email').value,
                            skill: document.getElementById('skill').value,
                            doc_managerid: document.getElementById('doc_managerid').value,
                            volunteertypeid: document.getElementById('volunteertypeid').value,
                            nurseid: document.getElementById('nurseid').value || null
                        };

                        let url = '/api/volunteers';
                        let method = 'POST';

                        if (formMode === 'edit') {
                            url = `/api/volunteers/${volunteerData.volunteerid}`;
                            method = 'PUT';
                        }

                        // שליחת הנתונים לשרת
                        fetch(url, {
                            method: method,
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(volunteerData)
                        })
                        .then(response => {
                            if (!response.ok) {
                                return response.json().then(err => { throw new Error(err.error || 'שגיאה בשמירת הנתונים'); });
                            }
                            return response.json();
                        })
                        .then(data => {
                            alert(data.message);
                            hideAddVolunteerForm();
                            loadVolunteersList();
                        })
                        .catch(error => {
                            alert(error.message);
                        });
                    }

                    function deleteVolunteer(volunteerId) {
                        fetch(`/api/volunteers/${volunteerId}`, {
                            method: 'DELETE'
                        })
                        .then(response => {
                            if (!response.ok) {
                                return response.json().then(err => { throw new Error(err.error || 'שגיאה במחיקת המתנדב'); });
                            }
                            return response.json();
                        })
                        .then(data => {
                            alert(data.message);
                            loadVolunteersList();
                        })
                        .catch(error => {
                            alert(error.message);
                        });
                    }

                    // פונקציות למסך ניהול שיבוץ מתנדבים
                    function loadVolunteerforList() {
                        const volunteerforList = document.getElementById('volunteerfor-list');
                        volunteerforList.innerHTML = '<div class="loading">טוען נתונים...</div>';

                        fetch('/api/volunteerfor')
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('שגיאה בטעינת נתונים');
                                }
                                return response.json();
                            })
                            .then(assignments => {
                                if (assignments.length === 0) {
                                    volunteerforList.innerHTML = '<div class="no-data">אין שיבוצי מתנדבים במערכת</div>';
                                    return;
                                }

                                const table = document.createElement('table');
                                table.className = 'data-table';

                                // יצירת כותרות הטבלה
                                const thead = document.createElement('thead');
                                thead.innerHTML = `
                                    <tr>
                                        <th>מטופל</th>
                                        <th>מתנדב</th>
                                        <th>פעולות</th>
                                    </tr>
                                `;
                                table.appendChild(thead);

                                // יצירת גוף הטבלה
                                const tbody = document.createElement('tbody');

                                assignments.forEach(assignment => {
                                    const row = document.createElement('tr');
                                    row.innerHTML = `
                                        <td>${assignment.patient_name} (${assignment.patientid})</td>
                                        <td>${assignment.volunteer_name} (${assignment.volunteerid})</td>
                                        <td>
                                            <button class="btn btn-danger delete-volunteerfor-btn"
                                                data-patient="${assignment.patientid}"
                                                data-volunteer="${assignment.volunteerid}">
                                                מחק
                                            </button>
                                        </td>
                                    `;
                                    tbody.appendChild(row);
                                });

                                table.appendChild(tbody);
                                volunteerforList.innerHTML = '';
                                volunteerforList.appendChild(table);

                                // הוספת מאזיני אירועים לכפתורי מחיקה
                                document.querySelectorAll('.delete-volunteerfor-btn').forEach(button => {
                                    button.addEventListener('click', function() {
                                        const patientId = this.getAttribute('data-patient');
                                        const volunteerId = this.getAttribute('data-volunteer');
                                        if (confirm('האם אתה בטוח שברצונך למחוק שיבוץ זה?')) {
                                            deleteVolunteerfor(patientId, volunteerId);
                                        }
                                    });
                                });
                            })
                            .catch(error => {
                                volunteerforList.innerHTML = `<div class="error">שגיאה בטעינת נתונים: ${error.message}</div>`;
                            });
                    }

                    function showAddVolunteerforForm() {
                        // איפוס הטופס
                        document.getElementById('volunteerfor-form').reset();

                        // טעינת רשימות המטופלים והמתנדבים
                        loadPatientsForSelect();
                        loadVolunteersForSelect();

                        // הצגת הטופס
                        document.getElementById('add-volunteerfor-form').style.display = 'block';
                    }

                    function hideAddVolunteerforForm() {
                        document.getElementById('add-volunteerfor-form').style.display = 'none';
                    }

                    function loadPatientsForSelect() {
                        const patientSelect = document.getElementById('patientid');

                        // שליפת רשימת המטופלים
                        fetch('/api/patients')
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('שגיאה בטעינת מטופלים');
                                }
                                return response.json();
                            })
                            .then(patients => {
                                // מחיקת האפשרויות הקיימות
                                while (patientSelect.options.length > 1) {
                                    patientSelect.remove(1);
                                }

                                // הוספת המטופלים
                                patients.forEach(patient => {
                                    const option = document.createElement('option');
                                    option.value = patient.p_id;
                                    option.textContent = `${patient.p_first_name} ${patient.p_last_name} (חדר ${patient.num_room})`;
                                    patientSelect.appendChild(option);
                                });
                            })
                            .catch(error => {
                                console.error('שגיאה בטעינת מטופלים:', error);
                                alert('שגיאה בטעינת רשימת המטופלים');
                            });
                    }

                    function loadVolunteersForSelect() {
                        const volunteerSelect = document.getElementById('volunteerid');

                        // שליפת רשימת המתנדבים
                        fetch('/api/volunteers')
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('שגיאה בטעינת מתנדבים');
                                }
                                return response.json();
                            })
                            .then(volunteers => {
                                // מחיקת האפשרויות הקיימות
                                while (volunteerSelect.options.length > 1) {
                                    volunteerSelect.remove(1);
                                }

                                // הוספת המתנדבים
                                volunteers.forEach(volunteer => {
                                    const option = document.createElement('option');
                                    option.value = volunteer.volunteerid;
                                    option.textContent = `${volunteer.firstname} ${volunteer.lastname} (${volunteer.typename})`;
                                    volunteerSelect.appendChild(option);
                                });
                            })
                            .catch(error => {
                                console.error('שגיאה בטעינת מתנדבים:', error);
                                alert('שגיאה בטעינת רשימת המתנדבים');
                            });
                    }

                    function saveVolunteerforForm(e) {
                        e.preventDefault();

                        // איסוף נתונים מהטופס
                        const volunteerforData = {
                            patientid: document.getElementById('patientid').value,
                            volunteerid: document.getElementById('volunteerid').value
                        };

                        // שליחת הנתונים לשרת
                        fetch('/api/volunteerfor', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(volunteerforData)
                        })
                        .then(response => {
                            if (!response.ok) {
                                return response.json().then(err => { throw new Error(err.error || 'שגיאה בשמירת הנתונים'); });
                            }
                            return response.json();
                        })
                        .then(data => {
                            alert(data.message);
                            hideAddVolunteerforForm();
                            loadVolunteerforList();
                        })
                        .catch(error => {
                            alert(error.message);
                        });
                    }

                    function deleteVolunteerfor(patientId, volunteerId) {
                        fetch(`/api/volunteerfor/${patientId}/${volunteerId}`, {
                            method: 'DELETE'
                        })
                        .then(response => {
                            if (!response.ok) {
                                return response.json().then(err => { throw new Error(err.error || 'שגיאה במחיקת השיבוץ'); });
                            }
                            return response.json();
                        })
                        .then(data => {
                            alert(data.message);
                            loadVolunteerforList();
                        })
                        .catch(error => {
                            alert(error.message);
                        });
                    }

                    // פונקציית חיפוש רופא לפי מזהה
                    function searchDoctor() {
                        const doctorId = document.getElementById('doctor-search').value;
                        if (!doctorId) {
                            alert('אנא הכנס מזהה רופא לחיפוש');
                            return;
                        }

                        const doctorsList = document.getElementById('doctors-list');
                        doctorsList.innerHTML = '<div class="loading">מחפש...</div>';

                        fetch('/api/doctors')
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('שגיאה בטעינת נתונים');
                                }
                                return response.json();
                            })
                            .then(doctors => {
                                // סינון לפי המזהה שהוזן
                                const filteredDoctors = doctors.filter(doctor => doctor.d_id == doctorId);

                                if (filteredDoctors.length === 0) {
                                    doctorsList.innerHTML = '<div class="no-data">לא נמצא רופא עם המזהה המבוקש</div>';
                                    return;
                                }

                                const table = document.createElement('table');
                                table.className = 'data-table';

                                // יצירת כותרות הטבלה
                                const thead = document.createElement('thead');
                                thead.innerHTML = `
                                    <tr>
                                        <th>מזהה</th>
                                        <th>שם פרטי</th>
                                        <th>שם משפחה</th>
                                        <th>מגדר</th>
                                        <th>התמחות</th>
                                        <th>אימייל</th>
                                        <th>טלפון</th>
                                        <th>פעולות</th>
                                    </tr>
                                `;
                                table.appendChild(thead);

                                // יצירת גוף הטבלה
                                const tbody = document.createElement('tbody');

                                filteredDoctors.forEach(doctor => {
                                    const row = document.createElement('tr');
                                    row.innerHTML = `
                                        <td>${doctor.d_id}</td>
                                        <td>${doctor.d_first_name}</td>
                                        <td>${doctor.d_last_name}</td>
                                        <td>${doctor.gender}</td>
                                        <td>${doctor.specialization}</td>
                                        <td>${doctor.email || '-'}</td>
                                        <td>${doctor.phone_number || '-'}</td>
                                        <td>
                                            <button class="btn edit-doctor-btn" data-id="${doctor.d_id}">ערוך</button>
                                            <button class="btn btn-danger delete-doctor-btn" data-id="${doctor.d_id}">מחק</button>
                                        </td>
                                    `;
                                    tbody.appendChild(row);
                                });

                                table.appendChild(tbody);
                                doctorsList.innerHTML = '';
                                doctorsList.appendChild(table);

                                // הוספת מאזיני אירועים לכפתורים
                                document.querySelectorAll('.edit-doctor-btn').forEach(button => {
                                    button.addEventListener('click', function() {
                                        const doctorId = this.getAttribute('data-id');
                                        editDoctor(doctorId, doctors);
                                    });
                                });

                                document.querySelectorAll('.delete-doctor-btn').forEach(button => {
                                    button.addEventListener('click', function() {
                                        const doctorId = this.getAttribute('data-id');
                                        if (confirm('האם אתה בטוח שברצונך למחוק רופא זה?')) {
                                            deleteDoctor(doctorId);
                                        }
                                    });
                                });
                            })
                            .catch(error => {
                                doctorsList.innerHTML = `<div class="error">שגיאה בטעינת נתונים: ${error.message}</div>`;
                            });
                    }

                    // פונקציית חיפוש מטופל לפי מזהה
                    function searchPatient() {
                        const patientId = document.getElementById('patient-search').value;
                        if (!patientId) {
                            alert('אנא הכנס מזהה מטופל לחיפוש');
                            return;
                        }

                        const patientsList = document.getElementById('patients-list');
                        patientsList.innerHTML = '<div class="loading">מחפש...</div>';

                        fetch('/api/patients')
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('שגיאה בטעינת נתונים');
                                }
                                return response.json();
                            })
                            .then(patients => {
                                // סינון לפי המזהה שהוזן
                                const filteredPatients = patients.filter(patient => patient.p_id == patientId);

                                if (filteredPatients.length === 0) {
                                    patientsList.innerHTML = '<div class="no-data">לא נמצא מטופל עם המזהה המבוקש</div>';
                                    return;
                                }

                                const table = document.createElement('table');
                                table.className = 'data-table';

                                // יצירת כותרות הטבלה
                                const thead = document.createElement('thead');
                                thead.innerHTML = `
                                    <tr>
                                        <th>מזהה</th>
                                        <th>שם פרטי</th>
                                        <th>שם משפחה</th>
                                        <th>תאריך לידה</th>
                                        <th>מספר חדר</th>
                                        <th>פעולות</th>
                                    </tr>
                                `;
                                table.appendChild(thead);

                                // יצירת גוף הטבלה
                                const tbody = document.createElement('tbody');

                                filteredPatients.forEach(patient => {
                                    // המרת תאריך לפורמט מקומי
                                    const birthDate = new Date(patient.date_of_birth).toLocaleDateString();

                                    const row = document.createElement('tr');
                                    row.innerHTML = `
                                        <td>${patient.p_id}</td>
                                        <td>${patient.p_first_name}</td>
                                        <td>${patient.p_last_name}</td>
                                        <td>${birthDate}</td>
                                        <td>${patient.num_room}</td>
                                        <td>
                                            <button class="btn edit-patient-btn" data-id="${patient.p_id}">ערוך</button>
                                            <button class="btn btn-danger delete-patient-btn" data-id="${patient.p_id}">מחק</button>
                                        </td>
                                    `;
                                    tbody.appendChild(row);
                                });

                                table.appendChild(tbody);
                                patientsList.innerHTML = '';
                                patientsList.appendChild(table);

                                // הוספת מאזיני אירועים לכפתורים
                                document.querySelectorAll('.edit-patient-btn').forEach(button => {
                                    button.addEventListener('click', function() {
                                        const patientId = this.getAttribute('data-id');
                                        editPatient(patientId, patients);
                                    });
                                });

                                document.querySelectorAll('.delete-patient-btn').forEach(button => {
                                    button.addEventListener('click', function() {
                                        const patientId = this.getAttribute('data-id');
                                        if (confirm('האם אתה בטוח שברצונך למחוק מטופל זה?')) {
                                            deletePatient(patientId);
                                        }
                                    });
                                });
                            })
                            .catch(error => {
                                patientsList.innerHTML = `<div class="error">שגיאה בטעינת נתונים: ${error.message}</div>`;
                            });
                    }

                    // פונקציית חיפוש מתנדב לפי מזהה
                    function searchVolunteer() {
                        const volunteerId = document.getElementById('volunteer-search').value;
                        if (!volunteerId) {
                            alert('אנא הכנס מזהה מתנדב לחיפוש');
                            return;
                        }

                        const volunteersList = document.getElementById('volunteers-list');
                        volunteersList.innerHTML = '<div class="loading">מחפש...</div>';

                        fetch('/api/volunteers')
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('שגיאה בטעינת נתונים');
                                }
                                return response.json();
                            })
                            .then(volunteers => {
                                // סינון לפי המזהה שהוזן
                                const filteredVolunteers = volunteers.filter(volunteer => volunteer.volunteerid == volunteerId);

                                if (filteredVolunteers.length === 0) {
                                    volunteersList.innerHTML = '<div class="no-data">לא נמצא מתנדב עם המזהה המבוקש</div>';
                                    return;
                                }

                                const table = document.createElement('table');
                                table.className = 'data-table';

                                // יצירת כותרות הטבלה
                                const thead = document.createElement('thead');
                                thead.innerHTML = `
                                    <tr>
                                        <th>מזהה</th>
                                        <th>שם פרטי</th>
                                        <th>שם משפחה</th>
                                        <th>טלפון</th>
                                        <th>אימייל</th>
                                        <th>סוג מתנדב</th>
                                        <th>רופא מנהל</th>
                                        <th>פעולות</th>
                                    </tr>
                                `;
                                table.appendChild(thead);

                                // יצירת גוף הטבלה
                                const tbody = document.createElement('tbody');

                                filteredVolunteers.forEach(volunteer => {
                                    const row = document.createElement('tr');
                                    row.innerHTML = `
                                        <td>${volunteer.volunteerid}</td>
                                        <td>${volunteer.firstname}</td>
                                        <td>${volunteer.lastname}</td>
                                        <td>${volunteer.phonenumber}</td>
                                        <td>${volunteer.email}</td>
                                        <td>${volunteer.typename}</td>
                                        <td>${volunteer.doctor_name}</td>
                                        <td>
                                            <button class="btn edit-volunteer-btn" data-id="${volunteer.volunteerid}">ערוך</button>
                                            <button class="btn btn-danger delete-volunteer-btn" data-id="${volunteer.volunteerid}">מחק</button>
                                        </td>
                                    `;
                                    tbody.appendChild(row);
                                });

                                table.appendChild(tbody);
                                volunteersList.innerHTML = '';
                                volunteersList.appendChild(table);

                                // הוספת מאזיני אירועים לכפתורים
                                document.querySelectorAll('.edit-volunteer-btn').forEach(button => {
                                    button.addEventListener('click', function() {
                                        const volunteerId = this.getAttribute('data-id');
                                        editVolunteer(volunteerId, volunteers);
                                    });
                                });

                                document.querySelectorAll('.delete-volunteer-btn').forEach(button => {
                                    button.addEventListener('click', function() {
                                        const volunteerId = this.getAttribute('data-id');
                                        if (confirm('האם אתה בטוח שברצונך למחוק מתנדב זה?')) {
                                            deleteVolunteer(volunteerId);
                                        }
                                    });
                                });
                            })
                            .catch(error => {
                                volunteersList.innerHTML = `<div class="error">שגיאה בטעינת נתונים: ${error.message}</div>`;
                            });
                    }

                    // פונקציית חיפוש שיבוץ לפי מזהה מטופל או מתנדב
                    function searchVolunteerfor() {
                        const patientId = document.getElementById('patient-vf-search').value;
                        const volunteerId = document.getElementById('volunteer-vf-search').value;

                        if (!patientId && !volunteerId) {
                            alert('אנא הכנס מזהה מטופל או מזהה מתנדב לחיפוש');
                            return;
                        }

                        const volunteerforList = document.getElementById('volunteerfor-list');
                        volunteerforList.innerHTML = '<div class="loading">מחפש...</div>';

                        fetch('/api/volunteerfor')
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('שגיאה בטעינת נתונים');
                                }
                                return response.json();
                            })
                            .then(assignments => {
                                // סינון לפי המזהים שהוזנו
                                let filteredAssignments = assignments;

                                if (patientId) {
                                    filteredAssignments = filteredAssignments.filter(assignment => assignment.patientid == patientId);
                                }

                                if (volunteerId) {
                                    filteredAssignments = filteredAssignments.filter(assignment => assignment.volunteerid == volunteerId);
                                }

                                if (filteredAssignments.length === 0) {
                                    volunteerforList.innerHTML = '<div class="no-data">לא נמצאו שיבוצים מתאימים</div>';
                                    return;
                                }

                                const table = document.createElement('table');
                                table.className = 'data-table';

                                // יצירת כותרות הטבלה
                                const thead = document.createElement('thead');
                                thead.innerHTML = `
                                    <tr>
                                        <th>מטופל</th>
                                        <th>מתנדב</th>
                                        <th>פעולות</th>
                                    </tr>
                                `;
                                table.appendChild(thead);

                                // יצירת גוף הטבלה
                                const tbody = document.createElement('tbody');

                                filteredAssignments.forEach(assignment => {
                                    const row = document.createElement('tr');
                                    row.innerHTML = `
                                        <td>${assignment.patient_name} (${assignment.patientid})</td>
                                        <td>${assignment.volunteer_name} (${assignment.volunteerid})</td>
                                        <td>
                                            <button class="btn btn-danger delete-volunteerfor-btn"
                                                data-patient="${assignment.patientid}"
                                                data-volunteer="${assignment.volunteerid}">
                                                מחק
                                            </button>
                                        </td>
                                    `;
                                    tbody.appendChild(row);
                                });

                                table.appendChild(tbody);
                                volunteerforList.innerHTML = '';
                                volunteerforList.appendChild(table);

                                // הוספת מאזיני אירועים לכפתורי מחיקה
                                document.querySelectorAll('.delete-volunteerfor-btn').forEach(button => {
                                    button.addEventListener('click', function() {
                                        const patientId = this.getAttribute('data-patient');
                                        const volunteerId = this.getAttribute('data-volunteer');
                                        if (confirm('האם אתה בטוח שברצונך למחוק שיבוץ זה?')) {
                                            deleteVolunteerfor(patientId, volunteerId);
                                        }
                                    });
                                });
                            })
                            .catch(error => {
                                volunteerforList.innerHTML = `<div class="error">שגיאה בטעינת נתונים: ${error.message}</div>`;
                            });
                    }

                    function loadQueriesPage() {
                        welcomeSection.style.display = 'none';
                        contentSection.style.display = 'block';

                        // טעינת תוכן הדף
                        contentSection.innerHTML = `
                            <h2>שאילתות ופרוצדורות</h2>
                            <p>מסך זה מאפשר לך להפעיל שאילתות ופרוצדורות מיוחדות.</p>

                            <div class="queries-container">
                                <div class="query-card">
                                    <h3>שאילתת מיטות פנויות לפי חדר</h3>
                                    <p>שאילתה זו מציגה את מספר המיטות הפנויות בכל חדר ואת רשימת המטופלים המשויכים לכל חדר.</p>
                                    <button class="btn run-query" data-query="available_beds">הפעל</button>
                                </div>

                                <div class="query-card">
                                    <h3>חודשים עם מספר דוחות מקסימלי</h3>
                                    <p>שאילתה זו מציגה את החודשים בכל שנה (ב-10 השנים האחרונות) שבהם נרשם מספר הדוחות הגבוה ביותר.</p>
                                    <button class="btn run-query" data-query="max_reports">הפעל</button>
                                </div>

                                <div class="query-card">
                                    <h3>פונקצית בדיקת עומס טיפולים של רופא</h3>
                                    <p>פונקציה זו בודקת את העומס על רופא מסוים על פי הטיפולים שהוא מבצע ומחזירה את מספר הטיפולים.</p>
                                    <div class="form-group" style="margin-top: 10px;">
                                        <label for="doctor-id-function">מזהה רופא:</label>
                                        <input type="number" id="doctor-id-function" placeholder="הכנס מזהה רופא">
                                    </div>
                                    <button class="btn run-procedure" data-procedure="doctor_treatments">הפעל</button>
                                </div>

                                <div class="query-card">
                                    <h3>פרוצדורת עדכון משמרת אחות</h3>
                                    <p>פרוצדורה זו מעדכנת את המשמרת של אחות לפי מספר הטלפון שלה ומשנה את שיבוצי המטופלים בהתאם.</p>
                                    <div class="form-group" style="margin-top: 10px;">
                                        <label for="nurse-phone">מספר טלפון אחות:</label>
                                        <input type="text" id="nurse-phone" placeholder="הכנס מספר טלפון">
                                    </div>
                                    <button class="btn run-procedure" data-procedure="update_nurse_shift">הפעל</button>
                                </div>
                            </div>

                            <div id="query-results" class="list-container"></div>
                        `;

                        // הוספת מאזיני אירועים לכפתורי הרצת שאילתות ופרוצדורות
                        document.querySelectorAll('.run-query').forEach(button => {
                            button.addEventListener('click', function() {
                                const queryType = this.getAttribute('data-query');
                                runQuery(queryType);
                            });
                        });

                        document.querySelectorAll('.run-procedure').forEach(button => {
                            button.addEventListener('click', function() {
                                const procedureType = this.getAttribute('data-procedure');
                                runProcedure(procedureType);
                            });
                        });
                    }

                    // פונקציה להרצת שאילתה
                    function runQuery(queryType) {
                        const resultsContainer = document.getElementById('query-results');
                        resultsContainer.innerHTML = '<div class="loading">מבצע שאילתה...</div>';

                        let url = '';

                        if (queryType === 'available_beds') {
                            url = '/api/queries/available_beds';
                        } else if (queryType === 'max_reports') {
                            url = '/api/queries/max_reports';
                        }

                        fetch(url)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('שגיאה בביצוע השאילתה');
                                }
                                return response.json();
                            })
                            .then(data => {
                                if (data.length === 0) {
                                    resultsContainer.innerHTML = '<div class="no-data">אין תוצאות</div>';
                                    return;
                                }

                                // הצגת תוצאות בהתאם לסוג השאילתה
                                if (queryType === 'available_beds') {
                                    displayAvailableBeds(data, resultsContainer);
                                } else if (queryType === 'max_reports') {
                                    displayMaxReports(data, resultsContainer);
                                }
                            })
                            .catch(error => {
                                resultsContainer.innerHTML = `<div class="error">שגיאה בביצוע השאילתה: ${error.message}</div>`;
                            });
                    }

                    // פונקציה להצגת תוצאות שאילתת מיטות פנויות
                    function displayAvailableBeds(data, container) {
                        const table = document.createElement('table');
                        table.className = 'data-table';

                        // יצירת כותרות הטבלה
                        const thead = document.createElement('thead');
                        thead.innerHTML = `
                            <tr>
                                <th>מספר חדר</th>
                                <th>מספר מיטות פנויות</th>
                                <th>מטופלים משויכים</th>
                            </tr>
                        `;
                        table.appendChild(thead);

                        // יצירת גוף הטבלה
                        const tbody = document.createElement('tbody');

                        data.forEach(room => {
                            const row = document.createElement('tr');
                            row.innerHTML = `
                                <td>${room.num_room}</td>
                                <td>${room.available_beds}</td>
                                <td>${room.assigned_patients || 'אין מטופלים'}</td>
                            `;
                            tbody.appendChild(row);
                        });

                        table.appendChild(tbody);

                        // הוספת הכותרת והטבלה למיכל התוצאות
                        container.innerHTML = '';
                        const title = document.createElement('h3');
                        title.textContent = 'תוצאות שאילתת מיטות פנויות לפי חדר';
                        container.appendChild(title);
                        container.appendChild(table);
                    }

                    // פונקציה להצגת תוצאות שאילתת חודשים עם מספר דוחות מקסימלי
                    function displayMaxReports(data, container) {
                        const table = document.createElement('table');
                        table.className = 'data-table';

                        // יצירת כותרות הטבלה
                        const thead = document.createElement('thead');
                        thead.innerHTML = `
                            <tr>
                                <th>שנה</th>
                                <th>חודש</th>
                                <th>מספר דוחות</th>
                            </tr>
                        `;
                        table.appendChild(thead);

                        // יצירת גוף הטבלה
                        const tbody = document.createElement('tbody');

                        data.forEach(report => {
                            const row = document.createElement('tr');
                            // המרת מספר החודש לשם החודש בעברית
                            const monthName = getHebrewMonthName(report.report_month);

                            row.innerHTML = `
                                <td>${report.report_year}</td>
                                <td>${monthName}</td>
                                <td>${report.max_reports}</td>
                            `;
                            tbody.appendChild(row);
                        });

                        table.appendChild(tbody);

                        // הוספת הכותרת והטבלה למיכל התוצאות
                        container.innerHTML = '';
                        const title = document.createElement('h3');
                        title.textContent = 'תוצאות שאילתת חודשים עם מספר דוחות מקסימלי';
                        container.appendChild(title);
                        container.appendChild(table);
                    }

                    // פונקציה להרצת פרוצדורה
                    function runProcedure(procedureType) {
                        const resultsContainer = document.getElementById('query-results');
                        resultsContainer.innerHTML = '<div class="loading">מבצע פרוצדורה...</div>';

                        let url = '';
                        let params = {};

                        if (procedureType === 'doctor_treatments') {
                            const doctorId = document.getElementById('doctor-id-function').value;
                            if (!doctorId) {
                                alert('אנא הכנס מזהה רופא');
                                resultsContainer.innerHTML = '';
                                return;
                            }
                            url = '/api/procedures/doctor_treatments';
                            params = { doctor_id: doctorId };
                        } else if (procedureType === 'update_nurse_shift') {
                            const nursePhone = document.getElementById('nurse-phone').value;
                            if (!nursePhone) {
                                alert('אנא הכנס מספר טלפון של אחות');
                                resultsContainer.innerHTML = '';
                                return;
                            }
                            url = '/api/procedures/update_nurse_shift';
                            params = { phone: nursePhone };
                        }

                        fetch(url, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(params)
                        })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('שגיאה בביצוע הפרוצדורה');
                                }
                                return response.json();
                            })
                            .then(data => {
                                // הצגת תוצאות בהתאם לסוג הפרוצדורה
                                if (procedureType === 'doctor_treatments') {
                                    displayDoctorTreatments(data, resultsContainer);
                                } else if (procedureType === 'update_nurse_shift') {
                                    displayNurseShiftUpdate(data, resultsContainer);
                                }
                            })
                            .catch(error => {
                                resultsContainer.innerHTML = `<div class="error">שגיאה בביצוע הפרוצדורה: ${error.message}</div>`;
                            });
                    }

                    // פונקציה להצגת תוצאות פונקצית בדיקת עומס טיפולים של רופא
                    function displayDoctorTreatments(data, container) {
                        container.innerHTML = '';

                        const title = document.createElement('h3');
                        title.textContent = 'תוצאות פונקצית בדיקת עומס טיפולים של רופא';
                        container.appendChild(title);

                        const resultsDiv = document.createElement('div');
                        resultsDiv.className = 'procedure-results';

                        if (data.error) {
                            resultsDiv.innerHTML = `<div class="error">${data.error}</div>`;
                        } else {
                            resultsDiv.innerHTML = `
                                <p><strong>מספר הטיפולים:</strong> ${data.treatment_count}</p>
                                <p><strong>התמחות:</strong> ${data.specialization}</p>
                                <p><strong>עומס כולל:</strong> ${data.total_workload}</p>
                                <p><strong>עומס ממוצע לטיפול:</strong> ${data.avg_workload}</p>
                                <p><strong>הערכת עומס:</strong> ${data.workload_assessment}</p>
                                <h4>פירוט הטיפולים:</h4>
                                <ul class="treatments-list">
                                    ${data.treatments.map(t => `
                                        <li>
                                            <strong>${t.name}</strong> - מורכבות: ${t.complexity}, זמן המתנה: ${t.wait_after} ימים
                                        </li>
                                    `).join('')}
                                </ul>
                            `;
                        }

                        container.appendChild(resultsDiv);
                    }

                    // פונקציה להצגת תוצאות פרוצדורת עדכון משמרת אחות
                    function displayNurseShiftUpdate(data, container) {
                        container.innerHTML = '';

                        const title = document.createElement('h3');
                        title.textContent = 'תוצאות פרוצדורת עדכון משמרת אחות';
                        container.appendChild(title);

                        const resultsDiv = document.createElement('div');
                        resultsDiv.className = 'procedure-results';

                        if (data.error) {
                            resultsDiv.innerHTML = `<div class="error">${data.error}</div>`;
                        } else {
                            resultsDiv.innerHTML = `
                                <p><strong>אחות:</strong> ${data.nurse_name}</p>
                                <p><strong>משמרת קודמת:</strong> ${data.old_shift}</p>
                                <p><strong>משמרת חדשה:</strong> ${data.new_shift}</p>
                                <p><strong>סיכום:</strong> ${data.patient_count} מטופלים, ${data.reassigned_count} שובצו מחדש</p>

                                ${data.reassignments.length > 0 ? `
                                    <h4>פירוט השיבוצים מחדש:</h4>
                                    <ul class="reassignments-list">
                                        ${data.reassignments.map(r => `
                                            <li>
                                                מטופל: ${r.patient_name} (${r.patient_id}) שובץ לאחות: ${r.new_nurse_name}
                                            </li>
                                        `).join('')}
                                    </ul>
                                ` : ''}
                            `;
                        }

                        container.appendChild(resultsDiv);
                    }

                    // פונקציה עזר להמרת מספר חודש לשם חודש בעברית
                    function getHebrewMonthName(monthNumber) {
                        const hebrewMonths = [
                            'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
                            'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
                        ];

                        return hebrewMonths[monthNumber - 1] || monthNumber;
                    }
    });

