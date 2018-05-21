class Exam {
    constructor({test_no, st_no, actual_exam_time, max_exam_time,
                percent_correct, num_questions_correct, num_questions_given,
                date_completed, date_started}) {

        this.test_no = test_no;
        this.st_no = st_no;
        this.actual_exam_time = actual_exam_time;
        this.max_exam_time = max_exam_time;
        this.percent_correct = percent_correct;
        this.num_questions_correct = num_questions_correct;
        this.num_questions_given = num_questions_given;
        this.date_completed = date_completed;
        this.date_started = date_started;
    }
}

function getSyllabus(sylco_id) {
    const sylco = getSyllabusCourse(sylco_id);

    if (sylco) {
        return syllabi.find((syl) => {
            return syl.syllabus_no === sylco.syllabus_no;
        });
    }
};

function getSyllabusCourse(sylcoid) {
    return syllabus_courses.find(sc => {
        return sc.sylco_no === sylcoid;
    });
};

function allowCertificate(credit_status, result_code) {
    return (credit_status === 1) && (result_code === 1);
};

function getResult(result_code) {
    let code;

    switch (result_code) {
        case 1: code = 'Passed'; break;
        case 2: code = 'Failed - Below minimum time on lecture'; break;
        case 3: code = 'Failed - Above maximum time on exam'; break;
        case 4: code = 'Failed - Below minimum passing grade'; break;
        default: code = 'Invalid Code';
    }

    return code;
};

export const updateObject = (oldObject, updatedValues) => {
    return {
        ...oldObject,
        ...updatedValues
    };
};

export const transformAPICompletedCoursesIntoCompletedCourses = (courses_array) => {

    let coursesArray = courses_array.filter(course => {
        return (course.exams && course.cs && course.rc && (course.sylco_no > 0));
    });

    let transcript = [];

    try {
        transcript = coursesArray.map(course => {

            const exams = course.exams.map(exam => {
                return new Exam({
                    test_no: exam.testid,
                    st_no: exam.st_no,
                    actual_exam_time: exam.e_aet,
                    max_exam_time: exam.e_met,
                    percent_correct: exam.e_pc,
                    num_questions_correct: exam.e_nqc,
                    num_questions_given: exam.e_nqg,
                    date_completed: exam.e_dc,
                    date_started: exam.e_ds
                });
            });
            
            const courseRecord = getCourse(course.cid);
    
            const syllabus = getSyllabus(course.sylco_no);

            const crs = {
                course_no: course.cid,
                ceu_min_lecture_time: course.cmlt,
                ceu_max_exam_time: course.cmet,
                ceu_pass_percent: course.cpp,
                credit_status: course.cs,
                date_enrolled: course.de,
                date_completed: course.dc,
                actual_lecture_time: course.l_alt,
                date_lecture_started: course.l_ds,
                max_exam_time: course.met,
                min_lecture_time: course.mlt,
                pass_percent: course.pp,
                result_code: course.rc,
                sc_no: course.sc_no,
                status: course.status,
                user_no: course.user_no,
                sylco_no: course.sylco_no,
                ceu: courseRecord.ceu,
                cecat_no: courseRecord.cecat_no,
                allow_certificate: allowCertificate(+course.cs, +course.rc),
                exams: exams,
                catalog: syllabus.catalog,
                syllabus: syllabus.syllabus,
                result: getResult(course.rc),
                name: getCourse(courseRecord.course_no).name
            };
    
            return crs;
        });
    
    } catch (e) {
        console.log(e);
    }

    return transcript;
};

export const sortTranscriptIntoCategories = function(transcript) {
    // console.log('Sorting transcript');
    // sort the completed courses into sets based on their ce_category
    const category_sets = {};

    // Loop over all completed courses.
    // Set up an array for each category found and add the completed course to the appropriate category array.
    transcript.forEach((course) => {
        const cecat_no = course.cecat_no;

        if (!(cecat_no in category_sets)) {
            category_sets[cecat_no] = [];
        }
        category_sets[cecat_no].push(course);
    });

    // The final output array.
    const sorted_output = [];

    // Order the categories: ce_categories is already in the order that I want the output to be in.
    // Take each category that is found and push into the final output array
    ce_categories.forEach((cat) => {

        if (cat.cecat_no in category_sets) {

            const categoryDetail = {
                cecat_no: cat.cecat_no,
                courses: category_sets[cat.cecat_no],
                name: getCategory(cat.cecat_no).name
            };

            sorted_output.push(categoryDetail);
        }

    });

    // Now sort the courses in each category by date completed.
    sorted_output.forEach((cat) => {
        cat.courses.sort((a, b) => {
            const d1 = new Date(a.date_completed);
            const d2 = new Date(b.date_completed);
            if (d1 < d2) { return -1; }
            if (d1 > d2) { return 1; }
            return 0;
        });
    });

    return sorted_output;
};

export const getCategory = (id) => {
    return ce_categories.find((category) => {
        // console.log(category);
        return category.cecat_no === id;
    });
};

export const getAccredCodes = function(dept_id) {
    return accreditation_codes.filter((codeObj) => {
        const departments_list = codeObj.departments;
        return departments_list.indexOf(dept_id) !== -1;
    });
};

export const getAccredCode = function(id) {
    return accreditation_codes.find((codeObj) => {
        return codeObj.id === id;
    });
};

export const getCourse = function(id) {
    return courses.find((course) => {
        return course.course_no === id;
    });
};

export const accreditation_codes = [
    {id: 1, code: '', state: 'Alaska', departments: [0, 1, 2, 7, 8, 16, 17, 18]},
    {id: 2, code: '', state: 'Illinois', departments: [0, 1, 2, 7, 8, 16, 17, 18]},
    {id: 3, code: 'Approval Number: 94-0106', state: 'California', departments: [0, 1, 2, 7, 8, 16, 17, 18]},
    {id: 4, code: 'SOEMS-2006-04', state: 'Georgia', departments: [1]},
    {id: 5, code: 'SOEMS-2006-3', state: 'Georgia', departments: [2]},
    {id: 6, code: 'Approval Number: TDH 600524', state: 'Ohio', departments: [0, 1, 2, 7, 8, 16, 17, 18]},
    {id: 7, code: 'Approval Number: 600524', state: 'Texas', departments: [0, 1, 2, 7, 8, 16, 17, 18]}
];

export const syllabi = [
    {syllabus_no: 1, catalog_no: 1, syllabus: 'Airway Management & Ventilation',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'EMS Advanced (EMT-I & EMT-P)', cecat_type: 1},
    {syllabus_no: 2, catalog_no: 1, syllabus: 'Clinically Related Operations',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'EMS Advanced (EMT-I & EMT-P)', cecat_type: 1},
    {syllabus_no: 3, catalog_no: 1, syllabus: 'Medical Emergencies',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'EMS Advanced (EMT-I & EMT-P)', cecat_type: 1},
    {syllabus_no: 4, catalog_no: 1, syllabus: 'Patient Assessment',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'EMS Advanced (EMT-I & EMT-P)', cecat_type: 1},
    {syllabus_no: 5, catalog_no: 1, syllabus: 'Preparatory',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'EMS Advanced (EMT-I & EMT-P)', cecat_type: 1},
    {syllabus_no: 6, catalog_no: 1, syllabus: 'Special Considerations',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'EMS Advanced (EMT-I & EMT-P)', cecat_type: 1},
    {syllabus_no: 7, catalog_no: 1, syllabus: 'Trauma',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'EMS Advanced (EMT-I & EMT-P)', cecat_type: 1},
    {syllabus_no: 8, catalog_no: 2, syllabus: 'Airway Management & Ventilation',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'EMS Basic (First Responder & EMT-B)', cecat_type: 1},
    {syllabus_no: 9, catalog_no: 2, syllabus: 'Clinically Related Operations',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'EMS Basic (First Responder & EMT-B)', cecat_type: 1},
    {syllabus_no: 10, catalog_no: 2, syllabus: 'Medical Emergencies',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'EMS Basic (First Responder & EMT-B)', cecat_type: 1},
    {syllabus_no: 11, catalog_no: 2, syllabus: 'Patient Assessment',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'EMS Basic (First Responder & EMT-B)', cecat_type: 1},
    {syllabus_no: 12, catalog_no: 2, syllabus: 'Preparatory',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'EMS Basic (First Responder & EMT-B)', cecat_type: 1},
    {syllabus_no: 13, catalog_no: 2, syllabus: 'Special Considerations',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'EMS Basic (First Responder & EMT-B)', cecat_type: 1},
    {syllabus_no: 14, catalog_no: 2, syllabus: 'Trauma',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'EMS Basic (First Responder & EMT-B)', cecat_type: 1},
    {syllabus_no: 15, catalog_no: 3, syllabus: 'General Firefighter Courses',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'Fire', cecat_type: 2},
    {syllabus_no: 16, catalog_no: 3, syllabus: 'Hazardous Materials: Container Information',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'Fire', cecat_type: 2},
    {syllabus_no: 17, catalog_no: 3, syllabus: 'Hazardous Materials: Gathering Information',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'Fire', cecat_type: 2},
    {syllabus_no: 18, catalog_no: 3, syllabus: 'Hazardous Materials: General Courses',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'Fire', cecat_type: 2},
    {syllabus_no: 19, catalog_no: 3, syllabus: 'Structural Fire Investigation',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'Fire', cecat_type: 2},
    {syllabus_no: 20, catalog_no: 4, syllabus: '01 - Introduction',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'Advanced Cardiac Life Support (ACLS): Initial Training', cecat_type: 0},
    {syllabus_no: 21, catalog_no: 4, syllabus: '02 - Basic Science and Psychomotor Skills',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'Advanced Cardiac Life Support (ACLS): Initial Training', cecat_type: 0},
    {syllabus_no: 22, catalog_no: 4, syllabus: '03 - Advanced Science and Psychomotor Skills',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'Advanced Cardiac Life Support (ACLS): Initial Training', cecat_type: 0},
    {syllabus_no: 23, catalog_no: 4, syllabus: '04 - Pulseless Arrest Practice',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'Advanced Cardiac Life Support (ACLS): Initial Training', cecat_type: 0},
    {syllabus_no: 24, catalog_no: 4, syllabus: '05 - Peri-arrest Rhythms',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'Advanced Cardiac Life Support (ACLS): Initial Training', cecat_type: 0},
    {syllabus_no: 25, catalog_no: 4, syllabus: '06 - Other ACLS Emergencies',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'Advanced Cardiac Life Support (ACLS): Initial Training', cecat_type: 0},
    {syllabus_no: 26, catalog_no: 4, syllabus: '07 - Random Scenario Practice',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'Advanced Cardiac Life Support (ACLS): Initial Training', cecat_type: 0},
    {syllabus_no: 27, catalog_no: 4, syllabus: '08 - Final Exam',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'Advanced Cardiac Life Support (ACLS): Initial Training', cecat_type: 0},
    {syllabus_no: 28, catalog_no: 4, syllabus: '09 - Schedule A Skills Exam',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'Advanced Cardiac Life Support (ACLS): Initial Training', cecat_type: 0},
    {syllabus_no: 29, catalog_no: 5, syllabus: '01 - Introduction',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'Advanced Cardiac Life Support (ACLS): Renewal Course', cecat_type: 0},
    {syllabus_no: 30, catalog_no: 5, syllabus: '02 - Basic and Advanced Science and Psychomotor Skills',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'Advanced Cardiac Life Support (ACLS): Renewal Course', cecat_type: 0},
    {syllabus_no: 31, catalog_no: 5, syllabus: '03 - Algorithm and Code Management',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'Advanced Cardiac Life Support (ACLS): Renewal Course', cecat_type: 0},
    {syllabus_no: 32, catalog_no: 5, syllabus: '04 - Final Exam',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'Advanced Cardiac Life Support (ACLS): Renewal Course', cecat_type: 0},
    {syllabus_no: 33, catalog_no: 5, syllabus: '05 - Schedule A Skills Exam',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'Advanced Cardiac Life Support (ACLS): Renewal Course', cecat_type: 0},
    {syllabus_no: 34, catalog_no: 6, syllabus: '01 - Introduction',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'Pediatric Advanced Life Support (PALS): Initial Training', cecat_type: 0},
    {syllabus_no: 35, catalog_no: 6, syllabus: '02 - Review',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'Pediatric Advanced Life Support (PALS): Initial Training', cecat_type: 0},
    {syllabus_no: 36, catalog_no: 6, syllabus: '03 - Assessment and Team Concept',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'Pediatric Advanced Life Support (PALS): Initial Training', cecat_type: 0},
    {syllabus_no: 37, catalog_no: 6, syllabus: '04 - Core Cases',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'Pediatric Advanced Life Support (PALS): Initial Training', cecat_type: 0},
    {syllabus_no: 38, catalog_no: 6, syllabus: '05 - Random Scenario Practice',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'Pediatric Advanced Life Support (PALS): Initial Training', cecat_type: 0},
    {syllabus_no: 39, catalog_no: 6, syllabus: '06 - Final Exam',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'Pediatric Advanced Life Support (PALS): Initial Training', cecat_type: 0},
    {syllabus_no: 40, catalog_no: 6, syllabus: '07 - Schedule A Skills Exam',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'Pediatric Advanced Life Support (PALS): Initial Training', cecat_type: 0},
    {syllabus_no: 41, catalog_no: 7, syllabus: '01 - Introduction',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'Pediatric Advanced Life Support (PALS): Renewal Course', cecat_type: 0},
    {syllabus_no: 42, catalog_no: 7, syllabus: '02 - Review',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'Pediatric Advanced Life Support (PALS): Renewal Course', cecat_type: 0},
    {syllabus_no: 43, catalog_no: 7, syllabus: '03 - Testing',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'Pediatric Advanced Life Support (PALS): Renewal Course', cecat_type: 0},
    {syllabus_no: 44, catalog_no: 7, syllabus: '04 - Final Exam',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'Pediatric Advanced Life Support (PALS): Renewal Course', cecat_type: 0},
    {syllabus_no: 45, catalog_no: 7, syllabus: '05 - Schedule A Skills Exam',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0,
    catalog: 'Pediatric Advanced Life Support (PALS): Renewal Course', cecat_type: 0},
    {syllabus_no: 46, catalog_no: 8, syllabus: 'PEMSS Protocols',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0, catalog: 'PEMSS Basic', cecat_type: 0},
    {syllabus_no: 47, catalog_no: 1, syllabus: 'Pediatric',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0, catalog: 'EMS Advanced (EMT-I & EMT-P)', cecat_type: 1},
    {syllabus_no: 48, catalog_no: 2, syllabus: 'Pediatric',
    pass_percent: 70, min_lecture_time: 0, max_exam_time: 0, catalog: 'EMS Basic (First Responder & EMT-B)', cecat_type: 1},
];

export const syllabus_courses = [
    {sylco_no: 1, syllabus_no: 47, course_no: 1},
    {sylco_no: 2, syllabus_no: 1, course_no: 2},
    {sylco_no: 3, syllabus_no: 1, course_no: 3},
    {sylco_no: 4, syllabus_no: 1, course_no: 4},
    {sylco_no: 5, syllabus_no: 1, course_no: 5},
    {sylco_no: 6, syllabus_no: 1, course_no: 6},
    {sylco_no: 7, syllabus_no: 2, course_no: 7},
    {sylco_no: 8, syllabus_no: 2, course_no: 8},
    {sylco_no: 9, syllabus_no: 2, course_no: 9},
    {sylco_no: 10, syllabus_no: 3, course_no: 10},
    {sylco_no: 11, syllabus_no: 3, course_no: 11},
    {sylco_no: 12, syllabus_no: 3, course_no: 12},
    {sylco_no: 13, syllabus_no: 3, course_no: 13},
    {sylco_no: 14, syllabus_no: 3, course_no: 14},
    {sylco_no: 15, syllabus_no: 3, course_no: 15},
    {sylco_no: 16, syllabus_no: 3, course_no: 16},
    {sylco_no: 17, syllabus_no: 3, course_no: 17},
    {sylco_no: 18, syllabus_no: 4, course_no: 18},
    {sylco_no: 19, syllabus_no: 4, course_no: 19},
    {sylco_no: 20, syllabus_no: 5, course_no: 20},
    {sylco_no: 21, syllabus_no: 5, course_no: 21},
    {sylco_no: 22, syllabus_no: 5, course_no: 22},
    {sylco_no: 23, syllabus_no: 5, course_no: 23},
    {sylco_no: 24, syllabus_no: 6, course_no: 24},
    {sylco_no: 25, syllabus_no: 47, course_no: 25},
    {sylco_no: 26, syllabus_no: 6, course_no: 26},
    {sylco_no: 27, syllabus_no: 6, course_no: 27},
    {sylco_no: 28, syllabus_no: 47, course_no: 28},
    {sylco_no: 29, syllabus_no: 7, course_no: 29},
    {sylco_no: 30, syllabus_no: 7, course_no: 30},
    {sylco_no: 31, syllabus_no: 7, course_no: 31},
    {sylco_no: 32, syllabus_no: 7, course_no: 32},
    {sylco_no: 33, syllabus_no: 7, course_no: 33},
    {sylco_no: 34, syllabus_no: 8, course_no: 34},
    {sylco_no: 35, syllabus_no: 8, course_no: 35},
    {sylco_no: 36, syllabus_no: 9, course_no: 36},
    {sylco_no: 37, syllabus_no: 9, course_no: 37},
    {sylco_no: 38, syllabus_no: 9, course_no: 38},
    {sylco_no: 39, syllabus_no: 10, course_no: 39},
    {sylco_no: 40, syllabus_no: 10, course_no: 40},
    {sylco_no: 41, syllabus_no: 10, course_no: 41},
    {sylco_no: 42, syllabus_no: 10, course_no: 42},
    {sylco_no: 43, syllabus_no: 10, course_no: 43},
    {sylco_no: 44, syllabus_no: 10, course_no: 44},
    {sylco_no: 45, syllabus_no: 10, course_no: 45},
    {sylco_no: 46, syllabus_no: 10, course_no: 46},
    {sylco_no: 47, syllabus_no: 11, course_no: 47},
    {sylco_no: 48, syllabus_no: 11, course_no: 48},
    {sylco_no: 49, syllabus_no: 11, course_no: 49},
    {sylco_no: 50, syllabus_no: 11, course_no: 50},
    {sylco_no: 51, syllabus_no: 11, course_no: 51},
    {sylco_no: 52, syllabus_no: 12, course_no: 52},
    {sylco_no: 53, syllabus_no: 12, course_no: 53},
    {sylco_no: 54, syllabus_no: 12, course_no: 54},
    {sylco_no: 55, syllabus_no: 12, course_no: 55},
    {sylco_no: 56, syllabus_no: 12, course_no: 56},
    {sylco_no: 57, syllabus_no: 12, course_no: 57},
    {sylco_no: 58, syllabus_no: 13, course_no: 58},
    {sylco_no: 59, syllabus_no: 13, course_no: 59},
    {sylco_no: 60, syllabus_no: 48, course_no: 60},
    {sylco_no: 61, syllabus_no: 13, course_no: 61},
    {sylco_no: 62, syllabus_no: 48, course_no: 62},
    {sylco_no: 63, syllabus_no: 13, course_no: 63},
    {sylco_no: 64, syllabus_no: 14, course_no: 64},
    {sylco_no: 65, syllabus_no: 14, course_no: 65},
    {sylco_no: 66, syllabus_no: 14, course_no: 66},
    {sylco_no: 67, syllabus_no: 14, course_no: 67},
    {sylco_no: 68, syllabus_no: 15, course_no: 68},
    {sylco_no: 69, syllabus_no: 15, course_no: 69},
    {sylco_no: 70, syllabus_no: 15, course_no: 70},
    {sylco_no: 71, syllabus_no: 15, course_no: 71},
    {sylco_no: 72, syllabus_no: 15, course_no: 72},
    {sylco_no: 73, syllabus_no: 15, course_no: 73},
    {sylco_no: 74, syllabus_no: 15, course_no: 74},
    {sylco_no: 75, syllabus_no: 15, course_no: 75},
    {sylco_no: 76, syllabus_no: 15, course_no: 76},
    {sylco_no: 77, syllabus_no: 15, course_no: 77},
    {sylco_no: 78, syllabus_no: 15, course_no: 78},
    {sylco_no: 79, syllabus_no: 15, course_no: 79},
    {sylco_no: 80, syllabus_no: 15, course_no: 80},
    {sylco_no: 81, syllabus_no: 15, course_no: 81},
    {sylco_no: 82, syllabus_no: 18, course_no: 82},
    {sylco_no: 83, syllabus_no: 18, course_no: 83},
    {sylco_no: 84, syllabus_no: 17, course_no: 84},
    {sylco_no: 85, syllabus_no: 17, course_no: 85},
    {sylco_no: 86, syllabus_no: 17, course_no: 86},
    {sylco_no: 87, syllabus_no: 17, course_no: 87},
    {sylco_no: 88, syllabus_no: 16, course_no: 88},
    {sylco_no: 89, syllabus_no: 16, course_no: 89},
    {sylco_no: 90, syllabus_no: 16, course_no: 90},
    {sylco_no: 91, syllabus_no: 16, course_no: 91},
    {sylco_no: 92, syllabus_no: 16, course_no: 92},
    {sylco_no: 93, syllabus_no: 19, course_no: 93},
    {sylco_no: 94, syllabus_no: 19, course_no: 94},
    {sylco_no: 97, syllabus_no: 20, course_no: 97},
    {sylco_no: 98, syllabus_no: 20, course_no: 98},
    {sylco_no: 99, syllabus_no: 21, course_no: 99},
    {sylco_no: 100, syllabus_no: 21, course_no: 100},
    {sylco_no: 101, syllabus_no: 21, course_no: 101},
    {sylco_no: 102, syllabus_no: 22, course_no: 102},
    {sylco_no: 103, syllabus_no: 22, course_no: 103},
    {sylco_no: 104, syllabus_no: 23, course_no: 104},
    {sylco_no: 105, syllabus_no: 23, course_no: 105},
    {sylco_no: 106, syllabus_no: 23, course_no: 106},
    {sylco_no: 107, syllabus_no: 24, course_no: 107},
    {sylco_no: 108, syllabus_no: 24, course_no: 108},
    {sylco_no: 109, syllabus_no: 24, course_no: 109},
    {sylco_no: 110, syllabus_no: 25, course_no: 110},
    {sylco_no: 111, syllabus_no: 25, course_no: 111},
    {sylco_no: 112, syllabus_no: 26, course_no: 112},
    {sylco_no: 113, syllabus_no: 27, course_no: 113},
    {sylco_no: 114, syllabus_no: 28, course_no: 114},
    {sylco_no: 115, syllabus_no: 29, course_no: 115},
    {sylco_no: 116, syllabus_no: 29, course_no: 116},
    {sylco_no: 117, syllabus_no: 30, course_no: 117},
    {sylco_no: 118, syllabus_no: 30, course_no: 118},
    {sylco_no: 119, syllabus_no: 30, course_no: 119},
    {sylco_no: 120, syllabus_no: 30, course_no: 120},
    {sylco_no: 121, syllabus_no: 30, course_no: 121},
    {sylco_no: 122, syllabus_no: 31, course_no: 122},
    {sylco_no: 123, syllabus_no: 31, course_no: 123},
    {sylco_no: 124, syllabus_no: 32, course_no: 124},
    {sylco_no: 125, syllabus_no: 33, course_no: 125},
    {sylco_no: 126, syllabus_no: 34, course_no: 126},
    {sylco_no: 127, syllabus_no: 34, course_no: 127},
    {sylco_no: 128, syllabus_no: 34, course_no: 128},
    {sylco_no: 129, syllabus_no: 35, course_no: 129},
    {sylco_no: 130, syllabus_no: 35, course_no: 130},
    {sylco_no: 131, syllabus_no: 35, course_no: 131},
    {sylco_no: 132, syllabus_no: 35, course_no: 132},
    {sylco_no: 133, syllabus_no: 36, course_no: 133},
    {sylco_no: 134, syllabus_no: 36, course_no: 134},
    {sylco_no: 135, syllabus_no: 36, course_no: 135},
    {sylco_no: 136, syllabus_no: 37, course_no: 136},
    {sylco_no: 137, syllabus_no: 37, course_no: 137},
    {sylco_no: 138, syllabus_no: 37, course_no: 138},
    {sylco_no: 139, syllabus_no: 37, course_no: 139},
    {sylco_no: 140, syllabus_no: 37, course_no: 140},
    {sylco_no: 141, syllabus_no: 37, course_no: 141},
    {sylco_no: 142, syllabus_no: 37, course_no: 142},
    {sylco_no: 143, syllabus_no: 37, course_no: 143},
    {sylco_no: 144, syllabus_no: 37, course_no: 144},
    {sylco_no: 145, syllabus_no: 37, course_no: 145},
    {sylco_no: 146, syllabus_no: 37, course_no: 146},
    {sylco_no: 147, syllabus_no: 37, course_no: 147},
    {sylco_no: 148, syllabus_no: 38, course_no: 148},
    {sylco_no: 149, syllabus_no: 39, course_no: 149},
    {sylco_no: 150, syllabus_no: 40, course_no: 150},
    {sylco_no: 151, syllabus_no: 41, course_no: 151},
    {sylco_no: 152, syllabus_no: 41, course_no: 152},
    {sylco_no: 153, syllabus_no: 41, course_no: 153},
    {sylco_no: 154, syllabus_no: 42, course_no: 154},
    {sylco_no: 155, syllabus_no: 42, course_no: 155},
    {sylco_no: 156, syllabus_no: 42, course_no: 156},
    {sylco_no: 157, syllabus_no: 42, course_no: 157},
    {sylco_no: 158, syllabus_no: 43, course_no: 158},
    {sylco_no: 159, syllabus_no: 43, course_no: 159},
    {sylco_no: 160, syllabus_no: 43, course_no: 160},
    {sylco_no: 161, syllabus_no: 44, course_no: 161},
    {sylco_no: 162, syllabus_no: 45, course_no: 162},
    {sylco_no: 163, syllabus_no: 1, course_no: 34},
    {sylco_no: 164, syllabus_no: 4, course_no: 48},
    {sylco_no: 165, syllabus_no: 4, course_no: 50},
    {sylco_no: 166, syllabus_no: 5, course_no: 53},
    {sylco_no: 167, syllabus_no: 6, course_no: 95},
    {sylco_no: 168, syllabus_no: 13, course_no: 95},
    {sylco_no: 169, syllabus_no: 3, course_no: 45},
    {sylco_no: 170, syllabus_no: 19, course_no: 180},
    {sylco_no: 171, syllabus_no: 19, course_no: 181},
    {sylco_no: 172, syllabus_no: 18, course_no: 178},
    {sylco_no: 173, syllabus_no: 18, course_no: 179},
    {sylco_no: 174, syllabus_no: 15, course_no: 174},
    {sylco_no: 175, syllabus_no: 15, course_no: 175},
    {sylco_no: 176, syllabus_no: 15, course_no: 176},
    {sylco_no: 177, syllabus_no: 15, course_no: 177},
    {sylco_no: 178, syllabus_no: 15, course_no: 182},
    {sylco_no: 179, syllabus_no: 15, course_no: 183},
    {sylco_no: 180, syllabus_no: 46, course_no: 207}
];

export const ce_categories = [
    {cecat_no: 1, cecat_type: 1, name: 'Airway Management & Ventilation'},
    {cecat_no: 2, cecat_type: 1, name: 'Clinically Related Operations'},
    {cecat_no: 3, cecat_type: 1, name: 'Medical Emergencies'},
    {cecat_no: 4, cecat_type: 1, name: 'Patient Assessment'},
    {cecat_no: 20, cecat_type: 1, name: 'Pediatric'},
    {cecat_no: 5, cecat_type: 1, name: 'Preparatory'},
    {cecat_no: 6, cecat_type: 1, name: 'Special Considerations'},
    {cecat_no: 7, cecat_type: 1, name: 'Trauma'},
    {cecat_no: 8, cecat_type: 2, name: 'Fire'},
    {cecat_no: 9, cecat_type: 2, name: 'Hazardous Materials'},
    {cecat_no: 10, cecat_type: 2, name: 'ISO Auto Aid Drill'},
    {cecat_no: 11, cecat_type: 2, name: 'ISO Company Training'},
    {cecat_no: 12, cecat_type: 2, name: 'ISO Driver'},
    {cecat_no: 13, cecat_type: 2, name: 'ISO Multi-Company Drills'},
    {cecat_no: 14, cecat_type: 2, name: 'ISO New Driver'},
    {cecat_no: 15, cecat_type: 2, name: 'ISO Night Drills'},
    {cecat_no: 16, cecat_type: 2, name: 'ISO Officer'},
    {cecat_no: 17, cecat_type: 2, name: 'ISO Single Company Drills'},
    {cecat_no: 18, cecat_type: 1, name: 'Other EMS'},
    {cecat_no: 19, cecat_type: 2, name: 'Other Fire'}
];

export const courses = [
    {course_no: 1, area_no: 11, department_no: 1, college_no: 1, name: 'Advanced Pediatric Airway Management', ceu: 5.00, cecat_no: 20},
    {course_no: 2, area_no: 11, department_no: 1, college_no: 1, name: 'Advanced Rapid Sequence Intubation', ceu: 4.00, cecat_no: 1},
    {course_no: 3, area_no: 11, department_no: 1, college_no: 1, name: 'Advanced Special Situations', ceu: 7.00, cecat_no: 1},
    {course_no: 4, area_no: 11, department_no: 1, college_no: 1, name: 'Advanced Surgical Airways', ceu: 4.00, cecat_no: 1},
    {course_no: 5, area_no: 11, department_no: 1, college_no: 1, name: 'Advanced Tracheal Intubation', ceu: 6.00, cecat_no: 1},
    {course_no: 6, area_no: 11, department_no: 1, college_no: 1,
        name: 'Advanced Verification of Endotracheal Tube Placement', ceu: 2.00, cecat_no: 1},
    {course_no: 7, area_no: 12, department_no: 1, college_no: 1, name: 'Advanced Ambulance Operations', ceu: 3.00, cecat_no: 2},
    {course_no: 8, area_no: 12, department_no: 1, college_no: 1,
        name: 'Advanced Hazardous Materials Incidents', ceu: 4.00, cecat_no: 2},
    {course_no: 9, area_no: 12, department_no: 1, college_no: 1, name: 'Advanced Medical Incident Command', ceu: 4.00, cecat_no: 2},
    {course_no: 10, area_no: 13, department_no: 1, college_no: 1,
        name: 'Advanced Acute Myocardial Infarctions', ceu: 1.00, cecat_no: 2},
    {course_no: 11, area_no: 13, department_no: 1, college_no: 1, name: 'Advanced Allergies and Anaphylaxis', ceu: 3.00, cecat_no: 3},
    {course_no: 12, area_no: 13, department_no: 1, college_no: 1, name: 'Advanced Endocrinology', ceu: 4.00, cecat_no: 3},
    {course_no: 13, area_no: 13, department_no: 1, college_no: 1, name: 'Advanced Environmental Emergencies', ceu: 7.00, cecat_no: 3},
    {course_no: 14, area_no: 13, department_no: 1, college_no: 1, name: 'Advanced Gastroenterology', ceu: 6.00, cecat_no: 3},
    {course_no: 15, area_no: 13, department_no: 1, college_no: 1, name: 'Advanced Infectious Diseases', ceu: 13.00, cecat_no: 3},
    {course_no: 16, area_no: 13, department_no: 1, college_no: 1,
        name: 'Advanced Interpretation of EKG Strips', ceu: 2.00, cecat_no: 3},
    {course_no: 17, area_no: 13, department_no: 1, college_no: 1,
        name: 'Advanced Myocardial Ischemia, Injury and Necrosis', ceu: 1.00, cecat_no: 3},
    {course_no: 18, area_no: 14, department_no: 1, college_no: 1,
        name: 'Advanced Patient Assessment in the Field', ceu: 9.00, cecat_no: 4},
    {course_no: 19, area_no: 14, department_no: 1, college_no: 1, name: 'Advanced Pediatric Assessment', ceu: 5.00, cecat_no: 4},
    {course_no: 20, area_no: 15, department_no: 1, college_no: 1, name: 'Advanced Administration of Drugs', ceu: 4.00, cecat_no: 5},
    {course_no: 21, area_no: 15, department_no: 1, college_no: 1, name: 'Advanced Cardiovascular Pharmacology', ceu: 2.00, cecat_no: 5},
    {course_no: 22, area_no: 15, department_no: 1, college_no: 1, name: 'Advanced Drug Dosage Calculations', ceu: 4.00, cecat_no: 5},
    {course_no: 23, area_no: 15, department_no: 1, college_no: 1,
        name: 'Advanced Pharmaco-kinetics and Pharmaco-dynamics', ceu: 3.00, cecat_no: 5},
    {course_no: 24, area_no: 16, department_no: 1, college_no: 1, name: 'Advanced Alzheimer\'s', ceu: 2.00, cecat_no: 6},
    {course_no: 25, area_no: 16, department_no: 1, college_no: 1, name: 'Advanced Child Abuse and Neglect', ceu: 4.00, cecat_no: 20},
    {course_no: 26, area_no: 16, department_no: 1, college_no: 1, name: 'Advanced Children with Special Needs', ceu: 6.00, cecat_no: 6},
    {course_no: 27, area_no: 16, department_no: 1, college_no: 1, name: 'Advanced Elder Abuse', ceu: 2.00, cecat_no: 6},
    {course_no: 28, area_no: 16, department_no: 1, college_no: 1, name: 'Advanced Newborn Resuscitation', ceu: 3.00, cecat_no: 20},
    {course_no: 29, area_no: 17, department_no: 1, college_no: 1, name: 'Advanced Burns', ceu: 6.00, cecat_no: 7},
    {course_no: 30, area_no: 17, department_no: 1, college_no: 1,
        name: 'Advanced Head, Facial and Neck Trauma', ceu: 10.00, cecat_no: 7},
    {course_no: 31, area_no: 17, department_no: 1, college_no: 1, name: 'Advanced Musculoskeletal Trauma', ceu: 8.00, cecat_no: 7},
    {course_no: 32, area_no: 17, department_no: 1, college_no: 1, name: 'Advanced Spinal Trauma', ceu: 6.00, cecat_no: 7},
    {course_no: 33, area_no: 17, department_no: 1, college_no: 1, name: 'Advanced Thoracic Trauma', ceu: 8.00, cecat_no: 7},
    {course_no: 34, area_no: 18, department_no: 2, college_no: 1, name: 'Advanced Airway', ceu: 5.00, cecat_no: 1},
    {course_no: 35, area_no: 18, department_no: 2, college_no: 1, name: 'Airway Management', ceu: 6.00, cecat_no: 1},
    {course_no: 36, area_no: 19, department_no: 2, college_no: 1, name: 'Ambulance Operations', ceu: 3.00, cecat_no: 2},
    {course_no: 37, area_no: 19, department_no: 2, college_no: 1, name: 'Gaining Access and Rescue', ceu: 3.00, cecat_no: 2},
    {course_no: 38, area_no: 19, department_no: 2, college_no: 1, name: 'Special Operations', ceu: 4.00, cecat_no: 2},
    {course_no: 39, area_no: 20, department_no: 2, college_no: 1, name: 'Allergies', ceu: 3.00, cecat_no: 3},
    {course_no: 40, area_no: 20, department_no: 2, college_no: 1, name: 'Behavioral Emergencies', ceu: 4.00, cecat_no: 3},
    {course_no: 41, area_no: 20, department_no: 2, college_no: 1, name: 'Cardiac Emergencies', ceu: 3.00, cecat_no: 3},
    {course_no: 42, area_no: 20, department_no: 2, college_no: 1,
        name: 'Diabetic Emergencies and Altered Mental Status', ceu: 3.00, cecat_no: 3},
    {course_no: 43, area_no: 20, department_no: 2, college_no: 1, name: 'Environmental Emergencies', ceu: 3.00, cecat_no: 3},
    {course_no: 44, area_no: 20, department_no: 2, college_no: 1, name: 'Obstetrics and Gynecology', ceu: 3.00, cecat_no: 3},
    {course_no: 45, area_no: 20, department_no: 2, college_no: 1, name: 'Poisoning and Overdose Emergencies', ceu: 3.00, cecat_no: 3},
    {course_no: 46, area_no: 20, department_no: 2, college_no: 1, name: 'Respiratory Emergencies', ceu: 3.00, cecat_no: 3},
    {course_no: 47, area_no: 21, department_no: 2, college_no: 1,
        name: 'Assessment of the Pediatric and Geriatric Patients', ceu: 2.00, cecat_no: 4},
    {course_no: 48, area_no: 21, department_no: 2, college_no: 1, name: 'Assessment of the Medical Patient', ceu: 1.00, cecat_no: 4},
    {course_no: 49, area_no: 21, department_no: 2, college_no: 1, name: 'Assessment of the Trauma Patient', ceu: 2.00, cecat_no: 4},
    {course_no: 50, area_no: 21, department_no: 2, college_no: 1, name: 'Communication and Documentation', ceu: 3.00, cecat_no: 4},
    {course_no: 51, area_no: 21, department_no: 2, college_no: 1, name: 'Scene Assessment', ceu: 3.00, cecat_no: 4},
    {course_no: 52, area_no: 22, department_no: 2, college_no: 1, name: 'General Pharmacology', ceu: 1.00, cecat_no: 5},
    {course_no: 53, area_no: 22, department_no: 2, college_no: 1, name: 'Lifting and Moving Patients', ceu: 2.00, cecat_no: 5},
    {course_no: 54, area_no: 22, department_no: 2, college_no: 1, name: 'Introduction to EMS', ceu: 2.00, cecat_no: 5},
    {course_no: 55, area_no: 22, department_no: 2, college_no: 1, name: 'Medical, Legal and Ethical Issues', ceu: 3.00, cecat_no: 5},
    {course_no: 56, area_no: 22, department_no: 2, college_no: 1, name: 'The Human Body', ceu: 1.00, cecat_no: 5},
    {course_no: 57, area_no: 22, department_no: 2, college_no: 1, name: 'Well-Being of the EMT', ceu: 2.00, cecat_no: 5},
    {course_no: 58, area_no: 23, department_no: 2, college_no: 1, name: 'Alzheimer\'s', ceu: 2.00, cecat_no: 6},
    {course_no: 59, area_no: 23, department_no: 2, college_no: 1, name: 'Child Abuse and Neglect', ceu: 4.00, cecat_no: 6},
    {course_no: 60, area_no: 23, department_no: 2, college_no: 1, name: 'Children with Special Needs', ceu: 6.00, cecat_no: 20},
    {course_no: 61, area_no: 23, department_no: 2, college_no: 1, name: 'Elder Abuse', ceu: 2.00, cecat_no: 6},
    {course_no: 62, area_no: 23, department_no: 2, college_no: 1, name: 'Infants and Children', ceu: 4.00, cecat_no: 20},
    {course_no: 63, area_no: 23, department_no: 2, college_no: 1, name: 'Newborn Resuscitation', ceu: 3.00, cecat_no: 6},
    {course_no: 64, area_no: 24, department_no: 2, college_no: 1, name: 'Bleeding and Shock', ceu: 3.00, cecat_no: 7},
    {course_no: 65, area_no: 24, department_no: 2, college_no: 1, name: 'Injuries to the Head and Spine', ceu: 5.00, cecat_no: 7},
    {course_no: 66, area_no: 24, department_no: 2, college_no: 1, name: 'Musculoskeletal Injuries', ceu: 3.00, cecat_no: 7},
    {course_no: 67, area_no: 24, department_no: 2, college_no: 1, name: 'Soft Tissue Injuries', ceu: 3.00, cecat_no: 7},
    {course_no: 68, area_no: 25, department_no: 7, college_no: 2,
        name: 'Advanced Rescue Awareness and Operations', ceu: 6.00, cecat_no: 8},
    {course_no: 69, area_no: 25, department_no: 7, college_no: 2, name: 'After the Incident', ceu: 2.00, cecat_no: 8},
    {course_no: 70, area_no: 25, department_no: 7, college_no: 2, name: 'Building Construction', ceu: 3.00, cecat_no: 8},
    {course_no: 71, area_no: 25, department_no: 7, college_no: 2,
        name: 'Chemical Fires and Hazardous Materials', ceu: 3.00, cecat_no: 8},
    {course_no: 72, area_no: 25, department_no: 7, college_no: 2,
        name: 'Combustion Properties of Liquid and Gaseous Fuels', ceu: 6.00, cecat_no: 8},
    {course_no: 73, area_no: 25, department_no: 7, college_no: 2, name: 'Fire Streams', ceu: 2.00, cecat_no: 8},
    {course_no: 74, area_no: 25, department_no: 7, college_no: 2, name: 'Firefighter Safety', ceu: 4.00, cecat_no: 8},
    {course_no: 75, area_no: 25, department_no: 7, college_no: 2, name: 'Forcible Entry', ceu: 2.00, cecat_no: 8},
    {course_no: 76, area_no: 25, department_no: 7, college_no: 2, name: 'Legal Issues', ceu: 4.00, cecat_no: 8},
    {course_no: 77, area_no: 25, department_no: 7, college_no: 2, name: 'Nature and Behavior of Fire', ceu: 6.00, cecat_no: 8},
    {course_no: 78, area_no: 25, department_no: 7, college_no: 2, name: 'Pre-incident Management', ceu: 2.00, cecat_no: 8},
    {course_no: 79, area_no: 25, department_no: 7, college_no: 2, name: 'Pump Theory', ceu: 3.00, cecat_no: 8},
    {course_no: 80, area_no: 25, department_no: 7, college_no: 2, name: 'Self-Contained Breathing Apparatus', ceu: 2.00, cecat_no: 8},
    {course_no: 81, area_no: 25, department_no: 7, college_no: 2, name: 'Ventilation', ceu: 2.00, cecat_no: 8},
    {course_no: 82, area_no: 26, department_no: 7, college_no: 2, name: 'Determining Strategic Goals', ceu: 2.00, cecat_no: 9},
    {course_no: 83, area_no: 26, department_no: 7, college_no: 2, name: 'Estimating Potential Course and Harm', ceu: 6.00, cecat_no: 9},
    {course_no: 84, area_no: 28, department_no: 7, college_no: 2, name: 'The Basics', ceu: 1.00, cecat_no: 9},
    {course_no: 85, area_no: 28, department_no: 7, college_no: 2, name: 'Product Information', ceu: 2.00, cecat_no: 9},
    {course_no: 86, area_no: 28, department_no: 7, college_no: 2, name: 'Environmental Information', ceu: 1.00, cecat_no: 9},
    {course_no: 87, area_no: 28, department_no: 7, college_no: 2, name: 'Damage Assessment', ceu: 4.00, cecat_no: 9},
    {course_no: 88, area_no: 29, department_no: 7, college_no: 2, name: 'Bulk and Non-Bulk Packaging', ceu: 3.00, cecat_no: 9},
    {course_no: 89, area_no: 29, department_no: 7, college_no: 2, name: 'Rail Containers', ceu: 5.00, cecat_no: 9},
    {course_no: 90, area_no: 29, department_no: 7, college_no: 2, name: 'Air Containers', ceu: 1.00, cecat_no: 9},
    {course_no: 91, area_no: 29, department_no: 7, college_no: 2, name: 'Water Containers', ceu: 1.00, cecat_no: 9},
    {course_no: 92, area_no: 29, department_no: 7, college_no: 2, name: 'Fixed Containers', ceu: 2.00, cecat_no: 9},
    {course_no: 93, area_no: 27, department_no: 7, college_no: 2,
        name: 'Building Construction, Fire Behavior and Investigation', ceu: 4.00, cecat_no: 8},
    {course_no: 94, area_no: 27, department_no: 7, college_no: 2,
        name: 'Examination of a Structure Fire Scene', ceu: 5.00, cecat_no: 8},
    {course_no: 95, area_no: 23, department_no: 2, college_no: 1, name: 'Terminally Ill Patient', ceu: 2.00, cecat_no: 6},
    {course_no: 174, area_no: 25, department_no: 7, college_no: 2,
        name: 'Advanced Rescue Awareness and Operations I', ceu: 3.00, cecat_no: 0},
    {course_no: 175, area_no: 25, department_no: 7, college_no: 2,
        name: 'Advanced Rescue Awareness and Operations II', ceu: 3.00, cecat_no: 0},
    {course_no: 176, area_no: 25, department_no: 7, college_no: 2,
        name: 'Combustion Properties of Liquid and Gaseous Fuels I', ceu: 3.00, cecat_no: 0},
    {course_no: 177, area_no: 25, department_no: 7, college_no: 2,
        name: 'Combustion Properties of Liquid and Gaseous Fuels II', ceu: 3.00, cecat_no: 0},
    {course_no: 178, area_no: 26, department_no: 7, college_no: 2,
        name: 'Estimating Potential Course and Harm I', ceu: 3.00, cecat_no: 0},
    {course_no: 179, area_no: 26, department_no: 7, college_no: 2,
        name: 'Estimating Potential Course and Harm II', ceu: 3.00, cecat_no: 0},
    {course_no: 180, area_no: 27, department_no: 7, college_no: 2,
        name: 'Examination of a Structure Fire Scene I', ceu: 3.00, cecat_no: 0},
    {course_no: 181, area_no: 27, department_no: 7, college_no: 2,
        name: 'Examination of a Structure Fire Scene II', ceu: 3.00, cecat_no: 0},
    {course_no: 182, area_no: 25, department_no: 7, college_no: 2, name: 'Nature and Behavior of Fire I', ceu: 3.00, cecat_no: 0},
    {course_no: 183, area_no: 25, department_no: 7, college_no: 2, name: 'Nature and Behavior of Fire II', ceu: 3.00, cecat_no: 0},
    {course_no: 184, area_no: 56, department_no: 16, college_no: 0, name: 'Documentation and Conclusion', ceu: 3.00, cecat_no: 0},
    {course_no: 185, area_no: 56, department_no: 16, college_no: 0, name: 'Advanced Crime Scene Awareness', ceu: 3.00, cecat_no: 0},
    {course_no: 186, area_no: 56, department_no: 16, college_no: 0, name: 'Fire-Related Deaths and injuries', ceu: 7.00, cecat_no: 0},
    {course_no: 187, area_no: 56, department_no: 16, college_no: 0, name: 'Hose', ceu: 2.00, cecat_no: 0},
    {course_no: 188, area_no: 56, department_no: 16, college_no: 0, name: 'Personal Protective Equipment', ceu: 2.00, cecat_no: 0},
    {course_no: 189, area_no: 57, department_no: 17, college_no: 0, name: 'Special Needs', ceu: 2.00, cecat_no: 0},
    {course_no: 190, area_no: 57, department_no: 17, college_no: 0, name: 'Fire Science', ceu: 2.00, cecat_no: 0},
    {course_no: 191, area_no: 57, department_no: 17, college_no: 0, name: 'Portable Extinguishers', ceu: 2.00, cecat_no: 0},
    {course_no: 192, area_no: 57, department_no: 17, college_no: 0, name: 'Ropes, Knots, Hitches', ceu: 2.00, cecat_no: 0},
    {course_no: 193, area_no: 57, department_no: 17, college_no: 0, name: 'Ladders', ceu: 2.00, cecat_no: 0},
    {course_no: 194, area_no: 57, department_no: 17, college_no: 0, name: 'Salvage and Overhaul', ceu: 2.00, cecat_no: 0},
    {course_no: 195, area_no: 57, department_no: 17, college_no: 0, name: 'Inspections', ceu: 2.00, cecat_no: 0},
    {course_no: 196, area_no: 57, department_no: 17, college_no: 0, name: 'Water Supplies', ceu: 2.00, cecat_no: 0},
    {course_no: 197, area_no: 57, department_no: 17, college_no: 0, name: 'Hydraulics', ceu: 2.00, cecat_no: 0},
    {course_no: 198, area_no: 57, department_no: 17, college_no: 0, name: 'Fire Cause Determination', ceu: 2.00, cecat_no: 0},
    {course_no: 199, area_no: 57, department_no: 17, college_no: 0, name: 'Reports and Records', ceu: 2.00, cecat_no: 0},
    {course_no: 200, area_no: 57, department_no: 17, college_no: 0, name: 'High Angle Rescue', ceu: 2.00, cecat_no: 0},
    {course_no: 201, area_no: 57, department_no: 17, college_no: 0, name: 'Fire Inspector', ceu: 2.00, cecat_no: 0},
    {course_no: 202, area_no: 57, department_no: 17, college_no: 0, name: 'Pump/Driver Operator', ceu: 2.00, cecat_no: 0},
    {course_no: 203, area_no: 57, department_no: 17, college_no: 0, name: 'Fire Apparatus', ceu: 2.00, cecat_no: 0},
    {course_no: 204, area_no: 57, department_no: 17, college_no: 0, name: 'Emergency Communications - Fire', ceu: 2.00, cecat_no: 0},
    {course_no: 205, area_no: 57, department_no: 17, college_no: 0,
        name: 'Fire Prevention and Public Education', ceu: 2.00, cecat_no: 0},
    {course_no: 206, area_no: 57, department_no: 17, college_no: 0, name: 'Engine Company Operations', ceu: 2.00, cecat_no: 0},
    {course_no: 207, area_no: 58, department_no: 18, college_no: 14, name: 'PEMSS Protocols Exam - Basic', ceu: 0.00, cecat_no: 0},
    {course_no: 208, area_no: 59, department_no: 19, college_no: 0, name: 'Pre-Hospital Pain Management', ceu: 3.00, cecat_no: 0},
    {course_no: 209, area_no: 60, department_no: 20, college_no: 0, name: 'EMT-P', ceu: 0.00, cecat_no: 0},
    {course_no: 210, area_no: 60, department_no: 20, college_no: 0, name: 'EMT-I', ceu: 0.00, cecat_no: 0},
    {course_no: 211, area_no: 60, department_no: 20, college_no: 0, name: 'EMT-B', ceu: 0.00, cecat_no: 0},
    {course_no: 212, area_no: 60, department_no: 20, college_no: 0, name: 'First Responder', ceu: 0.00, cecat_no: 0}
];

export const timeForSeconds = (secs) => {

    let tol = '';
    const days = Math.floor(secs / 86400);	// 60 seconds/minute * 60 minutes/hour * 24 hours/day = 86400 seconds/day
    let hours = 0;
    let minutes = 0;

    secs = secs % 86400;
    hours = Math.floor(secs / 3600);
    secs = secs % 3600;
    minutes = Math.floor(secs / 60);

    if (days === 1) {
        tol = '1 day';
    } else if (days > 1) {
        tol = `${ days } days`;
    }

    if ( hours === 1) {
        if ( days === 0 ) {
            tol = '1 hour';
        } else {
            tol = tol + ', 1 hour';
        }
    } else if (hours > 1) {
        if (days === 0) {
            tol = `${ hours } hours`;
        } else {
            tol = tol + `, ${ hours } hours`;
        }
    }

    if (minutes === 1) {
        if (tol === '') {
            tol = '1 minute';
        } else {
            tol = tol + ', 1 minute';
        }
    } else if (minutes > 1) {
        if (tol === '') {
            tol = `${ minutes } minutes`;
        } else {
            tol = tol + `, ${ minutes } minutes`;
        }
    } else if (tol.length === 0) {
        tol = '0 minutes';
    } else {
        console.log('Failure (timeForSeconds): ' + tol);
    }

    return tol;
}