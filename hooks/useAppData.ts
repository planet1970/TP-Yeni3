
import { usePersistedState, generateUniqueId } from '../utils/helpers';
import * as InitialData from '../data/mockData';
import type { 
    School, Department, Building, Hall, Course, Exam, Session, 
    SessionCourse, SessionDepartment, ExamCourse, ExamHall, SessionHall, 
    Student, Teacher, Attendant, StudentCourseRegistration, 
    StudentHallAssignment, AttendantAssignment, TaskRequest, 
    Question, ExamCourseQuestion, Topic, HallListPrintStatus
} from '../types';

export const useAppData = () => {
    // --- Persistent State ---
    const [schools, setSchools] = usePersistedState<School[]>('ems_schools_v1', InitialData.initialSchoolsData);
    const [departments, setDepartments] = usePersistedState<Department[]>('ems_departments_v1', InitialData.allDepartmentsData);
    const [buildings, setBuildings] = usePersistedState<Building[]>('ems_buildings_v1', InitialData.initialBuildingsData);
    const [halls, setHalls] = usePersistedState<Hall[]>('ems_halls_v1', InitialData.allHallsData);
    const [courses, setCourses] = usePersistedState<Course[]>('ems_courses_v1', InitialData.allCoursesData);
    const [exams, setExams] = usePersistedState<Exam[]>('ems_exams_v1', InitialData.initialExamsData);
    const [sessions, setSessions] = usePersistedState<Session[]>('ems_sessions_v1', InitialData.allSessionsData);
    
    // Relations
    const [sessionCourses, setSessionCourses] = usePersistedState<SessionCourse[]>('ems_sessionCourses_v1', InitialData.initialSessionCoursesData);
    const [sessionDepartments, setSessionDepartments] = usePersistedState<SessionDepartment[]>('ems_sessionDepartments_v1', InitialData.initialSessionDepartmentsData);
    const [examCourses, setExamCourses] = usePersistedState<ExamCourse[]>('ems_examCourses_v1', InitialData.initialExamCoursesData);
    const [examHalls, setExamHalls] = usePersistedState<ExamHall[]>('ems_examHalls_v1', InitialData.initialExamHallsData);
    const [sessionHalls, setSessionHalls] = usePersistedState<SessionHall[]>('ems_sessionHalls_v1', InitialData.initialSessionHallsData);
    
    // People
    const [students, setStudents] = usePersistedState<Student[]>('ems_students_v1', InitialData.initialStudentsData);
    const [teachers, setTeachers] = usePersistedState<Teacher[]>('ems_teachers_v1', InitialData.initialTeachersData);
    const [attendants, setAttendants] = usePersistedState<Attendant[]>('ems_attendants_v1', InitialData.initialAttendantsData);
    
    // Operations
    const [studentCourseRegistrations, setStudentCourseRegistrations] = usePersistedState<StudentCourseRegistration[]>('ems_studentCourseRegistrations_v1', []);
    const [studentHallAssignments, setStudentHallAssignments] = usePersistedState<StudentHallAssignment[]>('ems_studentHallAssignments_v1', []);
    const [attendantAssignments, setAttendantAssignments] = usePersistedState<AttendantAssignment[]>('ems_attendantAssignments_v1', []);
    const [taskRequests, setTaskRequests] = usePersistedState<TaskRequest[]>('ems_taskRequests_v1', []);

    // Teacher Module
    const [questions, setQuestions] = usePersistedState<Question[]>('ems_questions_v8', []);
    const [examCourseQuestions, setExamCourseQuestions] = usePersistedState<ExamCourseQuestion[]>('ems_examCourseQuestions_v5', []);
    const [topics, setTopics] = usePersistedState<Topic[]>('ems_topics_v1', []);

    // Exam Center
    const [hallListPrintStatuses, setHallListPrintStatuses] = usePersistedState<HallListPrintStatus[]>('ems_hallListPrintStatuses_v1', []);

    // --- CRUD Handlers ---

    // School
    const handleAddSchool = (data: Omit<School, 'id'>) => setSchools([ { id: generateUniqueId('S'), ...data }, ...schools ]);
    const handleUpdateSchool = (data: School) => setSchools(schools.map(s => s.id === data.id ? data : s));
    const handleDeleteSchool = (id: string) => {
        setSchools(schools.filter(s => s.id !== id));
        setDepartments(departments.filter(d => d.schoolId !== id));
    };

    // Department
    const handleAddDepartment = (data: Omit<Department, 'id'>) => setDepartments([ { id: generateUniqueId('D'), ...data }, ...departments ]);
    const handleUpdateDepartment = (data: Department) => setDepartments(departments.map(d => d.id === data.id ? data : d));
    const handleDeleteDepartment = (id: string) => {
        setDepartments(departments.filter(d => d.id !== id));
        setCourses(courses.filter(c => c.departmentId !== id));
    };

    // Building
    const handleAddBuilding = (data: Omit<Building, 'id'>) => setBuildings([ { id: generateUniqueId('B'), ...data }, ...buildings ]);
    const handleUpdateBuilding = (data: Building) => setBuildings(buildings.map(b => b.id === data.id ? data : b));
    const handleDeleteBuilding = (id: string) => {
        setBuildings(buildings.filter(b => b.id !== id));
        setHalls(halls.filter(h => h.buildingId !== id));
    };

    // Hall
    const handleAddHall = (data: Omit<Hall, 'id'>) => setHalls([ { id: generateUniqueId('H'), ...data }, ...halls ]);
    const handleUpdateHall = (data: Hall) => setHalls(halls.map(h => h.id === data.id ? data : h));
    const handleDeleteHall = (id: string) => setHalls(halls.filter(h => h.id !== id));

    // Course
    const handleAddCourse = (data: Omit<Course, 'id'>) => setCourses([ { id: generateUniqueId('C'), ...data }, ...courses ]);
    const handleUpdateCourse = (data: Course) => setCourses(courses.map(c => c.id === data.id ? data : c));
    const handleDeleteCourse = (id: string) => setCourses(courses.filter(c => c.id !== id));

    // Exam
    const handleAddExam = (data: Omit<Exam, 'id' | 'isActive'>) => setExams([ { id: generateUniqueId('E'), ...data, isActive: false }, ...exams ]);
    const handleUpdateExam = (data: Exam) => setExams(exams.map(e => e.id === data.id ? data : e));
    const handleDeleteExam = (id: string) => {
        setExams(exams.filter(e => e.id !== id));
        setSessions(sessions.filter(s => s.examId !== id));
    };
    const handleToggleExamStatus = (id: string) => setExams(exams.map(e => e.id === id ? { ...e, isActive: !e.isActive } : e));

    // Session
    const handleAddSession = (data: Omit<Session, 'id' | 'isActive'>) => setSessions([ { id: generateUniqueId('SS'), ...data, isActive: true }, ...sessions ]);
    const handleUpdateSession = (data: Session) => setSessions(sessions.map(s => s.id === data.id ? data : s));
    const handleDeleteSession = (id: string) => {
        setSessions(sessions.filter(s => s.id !== id));
        setSessionCourses(sessionCourses.filter(sc => sc.sessionId !== id));
        setSessionDepartments(sessionDepartments.filter(sd => sd.sessionId !== id));
        setSessionHalls(sessionHalls.filter(sh => sh.sessionId !== id));
    };
    const handleToggleSessionStatus = (id: string) => setSessions(sessions.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));

    // Session Relations
    const handleAddSessionDepartment = (sessionId: string, departmentId: string) => {
        if (!sessionDepartments.some(sd => sd.sessionId === sessionId && sd.departmentId === departmentId)) {
            setSessionDepartments([...sessionDepartments, { id: generateUniqueId('SD'), sessionId, departmentId }]);
        }
    };
    const handleRemoveSessionDepartment = (sessionId: string, departmentId: string) => {
        setSessionDepartments(sessionDepartments.filter(sd => !(sd.sessionId === sessionId && sd.departmentId === departmentId)));
        setSessionHalls(sessionHalls.filter(sh => !(sh.sessionId === sessionId && sh.departmentId === departmentId)));
    };

    const handleAddSessionCourse = (sessionId: string, courseId: string) => {
        if (!sessionCourses.some(sc => sc.sessionId === sessionId && sc.courseId === courseId)) {
            setSessionCourses([...sessionCourses, { id: generateUniqueId('SC'), sessionId, courseId }]);
        }
    };
    const handleRemoveSessionCourse = (sessionId: string, courseId: string) => {
        setSessionCourses(sessionCourses.filter(sc => !(sc.sessionId === sessionId && sc.courseId === courseId)));
    };

    const handleAddSessionHall = (sessionId: string, departmentId: string, hallId: string) => {
        if (!sessionHalls.some(sh => sh.sessionId === sessionId && sh.departmentId === departmentId && sh.hallId === hallId)) {
            setSessionHalls([...sessionHalls, { id: generateUniqueId('SH'), sessionId, departmentId, hallId }]);
        }
    };
    const handleRemoveSessionHall = (sessionId: string, departmentId: string, hallId: string) => {
        setSessionHalls(sessionHalls.filter(sh => !(sh.sessionId === sessionId && sh.departmentId === departmentId && sh.hallId === hallId)));
    };

    // Exam Relations
    const handleAddExamCourse = (examId: string, courseId: string, questionCount: number, duration: number) => {
        setExamCourses(prev => {
            const existing = prev.find(ec => ec.examId === examId && ec.courseId === courseId);
            if (existing) {
                return prev.map(ec => ec.id === existing.id ? { ...existing, isConfirmed: true } : ec);
            } else {
                return [...prev, { id: generateUniqueId('EC'), examId, courseId, questionCount, duration, isConfirmed: true, status: 'READY' }];
            }
        });
    };
    const handleUpdateExamCourse = (data: ExamCourse) => {
        setExamCourses(prev => {
            const existing = prev.find(ec => ec.examId === data.examId && ec.courseId === data.courseId);
            if (existing) {
                return prev.map(ec => ec.id === existing.id ? { ...existing, ...data } : ec);
            } else {
                return [...prev, { ...data, id: data.id || generateUniqueId('EC'), isConfirmed: data.isConfirmed || false, status: data.status || 'DRAFT' }];
            }
        });
    };
    const handleRemoveExamCourse = (examId: string, courseId: string) => {
        setExamCourses(examCourses.filter(ec => !(ec.examId === examId && ec.courseId === courseId)));
    };
    const handleRevertExamToDraft = (examId: string, courseId: string) => {
        setExamCourses(prev => prev.map(ec => 
            (ec.examId === examId && ec.courseId === courseId) 
            ? { ...ec, status: 'DRAFT', isConfirmed: false } 
            : ec
        ));
    };

    const handleAddExamHall = (examId: string, hallId: string) => {
        if (!examHalls.some(eh => eh.examId === examId && eh.hallId === hallId)) {
            setExamHalls([...examHalls, { id: generateUniqueId('EH'), examId, hallId }]);
        }
    };
    const handleRemoveExamHall = (examId: string, hallId: string) => {
        setExamHalls(examHalls.filter(eh => !(eh.examId === examId && eh.hallId === hallId)));
    };

    // Student Logic
    const handleSaveStudentHallAssignments = (sessionId: string, departmentId: string, newAssignments: StudentHallAssignment[]) => {
        setStudentHallAssignments(prev => [
            ...prev.filter(a => !(a.sessionId === sessionId && a.departmentId === departmentId)),
            ...newAssignments
        ]);
    };
    const handleResetStudentHallAssignments = (sessionId: string, departmentId: string) => {
        setStudentHallAssignments(prev => prev.filter(a => !(a.sessionId === sessionId && a.departmentId === departmentId)));
    };

    const handleImportStudentRegistrations = (newStudents: Student[], newRegistrations: Omit<StudentCourseRegistration, 'id'>[]) => {
        setStudents(prev => {
            const existingNumbers = new Set(prev.map(s => s.studentNumber));
            const uniqueNew = newStudents.filter(s => !existingNumbers.has(s.studentNumber));
            return [...prev, ...uniqueNew];
        });
        setStudentCourseRegistrations(prev => [
            ...prev, 
            ...newRegistrations.map(r => ({ ...r, id: generateUniqueId('SCR') }))
        ]);
    };
    const handleAddSingleRegistration = (student: Student, examId: string, courseId: string) => {
        setStudents(prev => prev.some(s => s.id === student.id) ? prev : [...prev, student]);
        setStudentCourseRegistrations(prev => {
            if (prev.some(r => r.examId === examId && r.courseId === courseId && r.studentId === student.id)) return prev;
            return [...prev, { id: generateUniqueId('SCR'), examId, courseId, studentId: student.id }];
        });
    };
    const handleRemoveRegistration = (examId: string, courseId: string, studentId: string) => {
        setStudentCourseRegistrations(prev => prev.filter(r => !(r.examId === examId && r.courseId === courseId && r.studentId === studentId)));
    };

    // People Management
    const handleAddTeacher = (data: Omit<Teacher, 'id'>) => setTeachers([{ id: generateUniqueId('T'), ...data }, ...teachers]);
    const handleUpdateTeacher = (data: Teacher) => setTeachers(teachers.map(t => t.id === data.id ? data : t));
    const handleDeleteTeacher = (id: string) => setTeachers(teachers.filter(t => t.id !== id));

    const handleAddAttendant = (data: Omit<Attendant, 'id' | 'isActive'>) => setAttendants([{ id: generateUniqueId('A'), ...data, isActive: true }, ...attendants]);
    const handleUpdateAttendant = (data: Attendant) => setAttendants(attendants.map(a => a.id === data.id ? data : a));
    const handleDeleteAttendant = (id: string) => setAttendants(attendants.filter(a => a.id !== id));
    const handleToggleAttendantStatus = (id: string) => setAttendants(attendants.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));

    // Attendant Assignments & Requests
    const handleUpdateAttendantAssignment = (sessionId: string, buildingId: string, roleName: string, attendantId: string, hallId?: string) => {
        setAttendantAssignments(prev => {
            const filtered = prev.filter(a => !(a.sessionId === sessionId && a.buildingId === buildingId && a.roleName === roleName && a.hallId === hallId));
            if (attendantId === "") return filtered;
            return [...filtered, { id: generateUniqueId('AA'), sessionId, buildingId, hallId, roleName, attendantId, status: 'ASSIGNED' }];
        });
    };
    const handleAssignmentResponse = (id: string, status: 'ACCEPTED' | 'REJECTED') => {
        setAttendantAssignments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    };
    const handleRequestTask = (attendantId: string, sessionId: string) => {
        setTaskRequests(prev => {
            if (prev.some(r => r.attendantId === attendantId && r.sessionId === sessionId)) return prev;
            return [...prev, { id: generateUniqueId('TR'), attendantId, sessionId, status: 'PENDING', requestDate: new Date().toISOString() }];
        });
    };
    const handleCancelTaskRequest = (attendantId: string, sessionId: string) => {
        setTaskRequests(prev => prev.filter(r => !(r.attendantId === attendantId && r.sessionId === sessionId)));
    };

    // Topics
    const handleAddTopic = (data: Omit<Topic, 'id'>) => setTopics(prev => [...prev, { id: generateUniqueId('TOPIC'), ...data }]);
    const handleDeleteTopic = (id: string) => setTopics(prev => prev.filter(t => t.id !== id));

    // Questions
    const handleAddQuestion = (data: Omit<Question, 'id'>) => setQuestions(prev => [{ ...data, id: generateUniqueId('Q') }, ...prev]);
    const handleUpdateQuestion = (data: Question) => setQuestions(prev => prev.map(q => q.id === data.id ? data : q));
    const handleDeleteQuestion = (id: string) => {
        setQuestions(prev => prev.filter(q => q.id !== id));
        setExamCourseQuestions(prev => prev.filter(ecq => ecq.questionId !== id));
    };

    // Exam Questions
    const handleAssignQuestionsToExam = (examId: string, courseId: string, questionIds: string[]) => {
        setExamCourseQuestions(prev => {
            const existing = prev.filter(ecq => ecq.examId === examId && ecq.courseId === courseId);
            const existingIds = new Set(existing.map(ecq => ecq.questionId));
            const toAdd = questionIds.filter(qid => !existingIds.has(qid));
            if (toAdd.length === 0) return prev;

            const total = existing.length + toAdd.length;
            const points = total > 0 ? parseFloat((100 / total).toFixed(2)) : 0;

            const updatedExisting = prev.map(ecq => (ecq.examId === examId && ecq.courseId === courseId) ? { ...ecq, points } : ecq);
            const newAssigns = toAdd.map(qid => ({ id: generateUniqueId('ECQ'), examId, courseId, questionId: qid, points }));
            
            return [...updatedExisting, ...newAssigns];
        });
    };
    const handleRemoveQuestionFromExam = (examId: string, courseId: string, questionId: string) => {
        setExamCourseQuestions(prev => {
            const remaining = prev.filter(ecq => !(ecq.examId === examId && ecq.courseId === courseId && ecq.questionId === questionId));
            const relevant = remaining.filter(ecq => ecq.examId === examId && ecq.courseId === courseId);
            const points = relevant.length > 0 ? parseFloat((100 / relevant.length).toFixed(2)) : 0;
            
            return remaining.map(ecq => (ecq.examId === examId && ecq.courseId === courseId) ? { ...ecq, points } : ecq);
        });
    };
    const handleUpdateExamQuestionPoints = (examId: string, courseId: string, questionId: string, points: number) => {
        setExamCourseQuestions(prev => prev.map(ecq => (ecq.examId === examId && ecq.courseId === courseId && ecq.questionId === questionId) ? { ...ecq, points } : ecq));
    };
    const handleRecalculatePoints = (examId: string, courseId: string) => {
        setExamCourseQuestions(prev => {
            const count = prev.filter(ecq => ecq.examId === examId && ecq.courseId === courseId).length;
            if (count === 0) return prev;
            const points = parseFloat((100 / count).toFixed(2));
            return prev.map(ecq => (ecq.examId === examId && ecq.courseId === courseId) ? { ...ecq, points } : ecq);
        });
    };

    // Exam Center Handlers
    const handleMarkHallListAsPrinted = (sessionId: string, departmentId: string, hallId: string) => {
        setHallListPrintStatuses(prev => {
            const exists = prev.find(s => s.sessionId === sessionId && s.departmentId === departmentId && s.hallId === hallId);
            if (exists) {
                return prev.map(s => s.id === exists.id ? { ...s, isPrinted: true, printedAt: new Date().toISOString() } : s);
            }
            return [...prev, { id: generateUniqueId('HLPS'), sessionId, departmentId, hallId, isPrinted: true, printedAt: new Date().toISOString() }];
        });
    };

    return {
        state: {
            schools, departments, buildings, halls, courses, exams, sessions,
            sessionCourses, sessionDepartments, examCourses, examHalls, sessionHalls,
            students, teachers, attendants, studentCourseRegistrations, studentHallAssignments,
            attendantAssignments, taskRequests, questions, examCourseQuestions, topics,
            hallListPrintStatuses
        },
        handlers: {
            handleAddSchool, handleUpdateSchool, handleDeleteSchool,
            handleAddDepartment, handleUpdateDepartment, handleDeleteDepartment,
            handleAddBuilding, handleUpdateBuilding, handleDeleteBuilding,
            handleAddHall, handleUpdateHall, handleDeleteHall,
            handleAddCourse, handleUpdateCourse, handleDeleteCourse,
            handleAddExam, handleUpdateExam, handleDeleteExam, handleToggleExamStatus,
            handleAddSession, handleUpdateSession, handleDeleteSession, handleToggleSessionStatus,
            handleAddSessionDepartment, handleRemoveSessionDepartment,
            handleAddSessionCourse, handleRemoveSessionCourse,
            handleAddSessionHall, handleRemoveSessionHall,
            handleAddExamCourse, handleUpdateExamCourse, handleRemoveExamCourse, handleRevertExamToDraft,
            handleAddExamHall, handleRemoveExamHall,
            handleSaveStudentHallAssignments, handleResetStudentHallAssignments,
            handleImportStudentRegistrations, handleAddSingleRegistration, handleRemoveRegistration,
            handleAddTeacher, handleUpdateTeacher, handleDeleteTeacher,
            handleAddAttendant, handleUpdateAttendant, handleDeleteAttendant, handleToggleAttendantStatus,
            handleUpdateAttendantAssignment, handleAssignmentResponse,
            handleRequestTask, handleCancelTaskRequest,
            handleAddTopic, handleDeleteTopic,
            handleAddQuestion, handleUpdateQuestion, handleDeleteQuestion,
            handleAssignQuestionsToExam, handleRemoveQuestionFromExam, handleUpdateExamQuestionPoints, handleRecalculatePoints,
            handleMarkHallListAsPrinted
        }
    };
};