
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import SchoolsPage from './pages/SchoolsPage';
import DepartmentsPage from './pages/DepartmentsPage';
import BuildingsPage from './pages/BuildingsPage';
import HallsPage from './pages/HallsPage';
import CoursesPage from './pages/CoursesPage';
import ExamsPage from './pages/ExamsPage';
import SessionsPage from './pages/SessionsPage';
import ExamCoursesPage from './pages/ExamCoursesPage';
import ExamHallsPage from './pages/ExamHallsPage';
import StudentCourseRegistrationsPage from './pages/StudentCourseRegistrationsPage';
import SessionCoursesPage from './pages/SessionCoursesPage';
import SessionHallsPage from './pages/SessionHallsPage';
import SessionStudentsPage from './pages/SessionStudentsPage';
import TeachersPage from './pages/TeachersPage';
import SessionInquiryPage from './pages/SessionInquiryPage';
import { School, Department, Building, Hall, Course, Exam, Session, SessionCourse, SessionDepartment, ExamCourse, ExamHall, SessionHall, Student, Teacher, StudentCourseRegistration, StudentHallAssignment } from './types';
import { 
  BellIcon, 
  CogIcon, 
  MoonIcon, 
  SearchIcon, 
  ClockIcon
} from './components/icons';

interface PageState {
  page: string;
  context?: Record<string, any>;
}

// Initial Data moved here to be the single source of truth
const initialSchoolsData: School[] = [
    { id: 'S001', name: 'Mühendislik ve Doğa Bilimleri Fakültesi', description: 'İleri teknoloji ve temel bilimler üzerine eğitim verir.', contact: 'mdbf@example.edu.tr' },
    { id: 'S002', name: 'İktisadi ve İdari Bilimler Fakültesi', description: 'Ekonomi, işletme ve uluslararası ilişkiler alanlarında uzman yetiştirir.', contact: 'iibf@example.edu.tr' },
    { id: 'S003', name: 'Tıp Fakültesi', description: 'Modern tıp eğitimi ve araştırmaları yapar.', contact: 'tip@example.edu.tr' },
];

const initialTeachersData: Teacher[] = [
    { id: 'T001', title: 'Prof. Dr.', firstName: 'Ahmet', lastName: 'Yılmaz', email: 'ahmet.yilmaz@example.edu.tr', phone: '05551112233', schoolId: 'S001' },
    { id: 'T002', title: 'Doç. Dr.', firstName: 'Ayşe', lastName: 'Demir', email: 'ayse.demir@example.edu.tr', phone: '05554445566', schoolId: 'S001' },
    { id: 'T003', title: 'Dr. Öğr. Üyesi', firstName: 'Mehmet', lastName: 'Kaya', email: 'mehmet.kaya@example.edu.tr', phone: '05557778899', schoolId: 'S002' },
    { id: 'T004', title: 'Prof. Dr.', firstName: 'Canan', lastName: 'Işık', email: 'canan.isik@example.edu.tr', phone: '05559990011', schoolId: 'S003' },
];

const allDepartmentsData: Department[] = [
    { id: 'D001', name: 'Bilgisayar Mühendisliği', code: 'BM', schoolId: 'S001' },
    { id: 'D002', name: 'Makine Mühendisliği', code: 'MM', schoolId: 'S001' },
    { id: 'D003', name: 'İşletme', code: 'ISL', schoolId: 'S002' },
];

const initialBuildingsData: Building[] = [
    { id: 'B001', name: 'A Blok', description: 'Mühendislik Binası' },
    { id: 'B002', name: 'B Blok', description: 'Kütüphane ve Sosyal Tesisler' },
    { id: 'B003', name: 'C Blok', description: 'Rektörlük Binası' },
];

const allHallsData: Hall[] = [
    { id: 'H001', name: 'A-101', capacity: 50, buildingId: 'B001', floor: '1. Kat' },
    { id: 'H002', name: 'A-102', capacity: 75, buildingId: 'B001', floor: '1. Kat' },
    { id: 'H003', name: 'Kütüphane Okuma Salonu', capacity: 200, buildingId: 'B002', floor: 'Zemin Kat' },
];

const allCoursesData: Course[] = [
    { id: 'C001', name: 'Programlamaya Giriş', code: 'BM101', departmentId: 'D001', teacherId: 'T001' },
    { id: 'C002', name: 'Veri Yapıları', code: 'BM201', departmentId: 'D001', teacherId: 'T002' },
    { id: 'C003', name: 'Termodinamik', code: 'MM205', departmentId: 'D002', teacherId: 'T001' },
    { id: 'C004', name: 'İktisada Giriş', code: 'ISL101', departmentId: 'D003', teacherId: 'T003' },
];

const initialExamsData: Exam[] = [
    { id: 'E001', name: '2024 Güz Dönemi Vize Sınavları', description: 'Tüm bölümlerin vize sınavları.', closingDate: '2024-11-10', isActive: true },
    { id: 'E002', name: '2024 Güz Dönemi Final Sınavları', description: 'Tüm bölümlerin final sınavları.', closingDate: '2025-01-15', isActive: false },
];

const allSessionsData: Session[] = [
    { id: 'SS001', sequenceNumber: 1, name: '1. Oturum - Sabah', date: '2024-11-20T09:00', examId: 'E001', isActive: true },
    { id: 'SS002', sequenceNumber: 2, name: '2. Oturum - Öğleden Sonra', date: '2024-11-20T14:00', examId: 'E001', isActive: true },
    { id: 'SS003', sequenceNumber: 1, name: 'Final 1. Oturum', date: '2025-01-20T10:00', examId: 'E002', isActive: false },
];

const initialSessionCoursesData: SessionCourse[] = [];

const initialExamCoursesData: ExamCourse[] = [];
const initialExamHallsData: ExamHall[] = [];
const initialSessionDepartmentsData: SessionDepartment[] = [];
const initialSessionHallsData: SessionHall[] = [];


const Header: React.FC = () => {
  return (
    <header className="bg-white p-4 flex justify-between items-center shadow-sm print:hidden">
      <h1 className="text-xl font-bold text-gray-700">WELCOME!</h1>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <MoonIcon className="h-6 w-6" />
        </button>
        <button className="relative text-gray-500 hover:text-gray-700">
          <BellIcon className="h-6 w-6" />
          <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
        </button>
        <button className="text-gray-500 hover:text-gray-700">
          <CogIcon className="h-6 w-6" />
        </button>
        <button className="text-gray-500 hover:text-gray-700">
            <ClockIcon className="h-6 w-6" />
        </button>
        <div className="flex items-center space-x-2">
          <img
            className="h-9 w-9 rounded-full"
            src="https://picsum.photos/100"
            alt="User avatar"
          />
        </div>
      </div>
    </header>
  );
};

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<PageState>({ page: 'dashboard' });
  const [schools, setSchools] = useState<School[]>(initialSchoolsData);
  const [departments, setDepartments] = useState<Department[]>(allDepartmentsData);
  const [buildings, setBuildings] = useState<Building[]>(initialBuildingsData);
  const [halls, setHalls] = useState<Hall[]>(allHallsData);
  const [courses, setCourses] = useState<Course[]>(allCoursesData);
  const [exams, setExams] = useState<Exam[]>(initialExamsData);
  const [sessions, setSessions] = useState<Session[]>(allSessionsData);
  const [sessionCourses, setSessionCourses] = useState<SessionCourse[]>(initialSessionCoursesData);
  const [sessionDepartments, setSessionDepartments] = useState<SessionDepartment[]>(initialSessionDepartmentsData);
  const [examCourses, setExamCourses] = useState<ExamCourse[]>(initialExamCoursesData);
  const [examHalls, setExamHalls] = useState<ExamHall[]>(initialExamHallsData);
  const [sessionHalls, setSessionHalls] = useState<SessionHall[]>(initialSessionHallsData);
  
  // Student, Teacher and Registration State
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachersData);
  const [studentCourseRegistrations, setStudentCourseRegistrations] = useState<StudentCourseRegistration[]>([]);
  
  // Student Hall Assignments
  const [studentHallAssignments, setStudentHallAssignments] = useState<StudentHallAssignment[]>([]);

  const handleNavigate = (pageState: PageState) => {
    setActivePage(pageState);
  };

  // --- School CRUD Handlers ---
  const handleAddSchool = (schoolData: Omit<School, 'id'>) => {
    const newSchool: School = { id: `S00${Date.now()}`, ...schoolData };
    setSchools([newSchool, ...schools]);
  };
  const handleUpdateSchool = (updatedSchool: School) => {
    setSchools(schools.map(s => s.id === updatedSchool.id ? updatedSchool : s));
  };
  const handleDeleteSchool = (schoolId: string) => {
    setSchools(schools.filter(s => s.id !== schoolId));
    setDepartments(departments.filter(d => d.schoolId !== schoolId));
  };

  // --- Department CRUD Handlers ---
  const handleAddDepartment = (departmentData: Omit<Department, 'id'>) => {
    const newDepartment: Department = { id: `D${Date.now()}`, ...departmentData };
    setDepartments([newDepartment, ...departments]);
  };
  const handleUpdateDepartment = (updatedDepartment: Department) => {
    setDepartments(departments.map(d => d.id === updatedDepartment.id ? updatedDepartment : d));
  };
  const handleDeleteDepartment = (departmentId: string) => {
    setDepartments(departments.filter(d => d.id !== departmentId));
    setCourses(courses.filter(c => c.departmentId !== departmentId));
  };

  // --- Building CRUD Handlers ---
    const handleAddBuilding = (buildingData: Omit<Building, 'id'>) => {
        const newBuilding: Building = { id: `B${Date.now()}`, ...buildingData };
        setBuildings([newBuilding, ...buildings]);
    };
    const handleUpdateBuilding = (updatedBuilding: Building) => {
        setBuildings(buildings.map(b => b.id === updatedBuilding.id ? updatedBuilding : b));
    };
    const handleDeleteBuilding = (buildingId: string) => {
        setBuildings(buildings.filter(b => b.id !== buildingId));
        setHalls(halls.filter(h => h.buildingId !== buildingId));
    };

  // --- Hall CRUD Handlers ---
    const handleAddHall = (hallData: Omit<Hall, 'id'>) => {
        const newHall: Hall = { id: `H${Date.now()}`, ...hallData };
        setHalls([newHall, ...halls]);
    };
    const handleUpdateHall = (updatedHall: Hall) => {
        setHalls(halls.map(h => h.id === updatedHall.id ? updatedHall : h));
    };
    const handleDeleteHall = (hallId: string) => {
        setHalls(halls.filter(h => h.id !== hallId));
    };

  // --- Course CRUD Handlers ---
    const handleAddCourse = (courseData: Omit<Course, 'id'>) => {
        const newCourse: Course = { id: `C${Date.now()}`, ...courseData };
        setCourses([newCourse, ...courses]);
    };
    const handleUpdateCourse = (updatedCourse: Course) => {
        setCourses(courses.map(c => c.id === updatedCourse.id ? updatedCourse : c));
    };
    const handleDeleteCourse = (courseId: string) => {
        setCourses(courses.filter(c => c.id !== courseId));
    };
    
  // --- Exam CRUD Handlers ---
    const handleAddExam = (examData: Omit<Exam, 'id' | 'isActive'>) => {
        const newExam: Exam = { id: `E${Date.now()}`, ...examData, isActive: false };
        setExams([newExam, ...exams]);
    };
    const handleUpdateExam = (updatedExam: Exam) => {
        setExams(exams.map(e => e.id === updatedExam.id ? updatedExam : e));
    };
    const handleDeleteExam = (examId: string) => {
        setExams(exams.filter(e => e.id !== examId));
        setSessions(sessions.filter(s => s.examId !== examId));
    };
    const handleToggleExamStatus = (examId: string) => {
        setExams(exams.map(e => e.id === examId ? { ...e, isActive: !e.isActive } : e));
    };

  // --- Session CRUD Handlers ---
    const handleAddSession = (sessionData: Omit<Session, 'id' | 'isActive'>) => {
        const newSession: Session = { id: `SS${Date.now()}`, ...sessionData, isActive: true };
        setSessions([newSession, ...sessions]);
    };
    const handleUpdateSession = (updatedSession: Session) => {
        setSessions(sessions.map(s => s.id === updatedSession.id ? updatedSession : s));
    };
    const handleDeleteSession = (sessionId: string) => {
        setSessions(sessions.filter(s => s.id !== sessionId));
        setSessionCourses(sessionCourses.filter(sc => sc.sessionId !== sessionId));
        setSessionDepartments(sessionDepartments.filter(sd => sd.sessionId !== sessionId));
        setSessionHalls(sessionHalls.filter(sh => sh.sessionId !== sessionId));
    };
    const handleToggleSessionStatus = (sessionId: string) => {
        setSessions(sessions.map(s => s.id === sessionId ? { ...s, isActive: !s.isActive } : s));
    };

    // --- SessionDepartment Handlers ---
    const handleAddSessionDepartment = (sessionId: string, departmentId: string) => {
        if (sessionDepartments.some(sd => sd.sessionId === sessionId && sd.departmentId === departmentId)) {
            return;
        }
        const newSD: SessionDepartment = {
            id: `SD${Date.now()}`,
            sessionId,
            departmentId
        };
        setSessionDepartments([...sessionDepartments, newSD]);
    };

    const handleRemoveSessionDepartment = (sessionId: string, departmentId: string) => {
        setSessionDepartments(sessionDepartments.filter(sd => !(sd.sessionId === sessionId && sd.departmentId === departmentId)));
        // Also remove associated halls for this session-dept
        setSessionHalls(sessionHalls.filter(sh => !(sh.sessionId === sessionId && sh.departmentId === departmentId)));
    };

    // --- SessionCourse Handlers ---
    const handleAddSessionCourse = (sessionId: string, courseId: string) => {
        if (sessionCourses.some(sc => sc.sessionId === sessionId && sc.courseId === courseId)) {
            return;
        }
        const newSC: SessionCourse = {
            id: `SC${Date.now()}`,
            sessionId,
            courseId
        };
        setSessionCourses([...sessionCourses, newSC]);
    };

    const handleRemoveSessionCourse = (sessionId: string, courseId: string) => {
        setSessionCourses(sessionCourses.filter(sc => !(sc.sessionId === sessionId && sc.courseId === courseId)));
    };

    // --- ExamCourse Handlers ---
    const handleAddExamCourse = (examId: string, courseId: string, questionCount: number, duration: number) => {
        if (examCourses.some(ec => ec.examId === examId && ec.courseId === courseId)) {
            return;
        }
        const newEC: ExamCourse = {
            id: `EC${Date.now()}`,
            examId,
            courseId,
            questionCount,
            duration
        };
        setExamCourses([...examCourses, newEC]);
    };

    const handleRemoveExamCourse = (examId: string, courseId: string) => {
        setExamCourses(examCourses.filter(ec => !(ec.examId === examId && ec.courseId === courseId)));
    };

    // --- ExamHall Handlers ---
    const handleAddExamHall = (examId: string, hallId: string) => {
        if (examHalls.some(eh => eh.examId === examId && eh.hallId === hallId)) {
            return;
        }
        const newEH: ExamHall = {
            id: `EH${Date.now()}`,
            examId,
            hallId
        };
        setExamHalls([...examHalls, newEH]);
    };

    const handleRemoveExamHall = (examId: string, hallId: string) => {
        setExamHalls(examHalls.filter(eh => !(eh.examId === examId && eh.hallId === hallId)));
    };

    // --- SessionHall Handlers ---
    const handleAddSessionHall = (sessionId: string, departmentId: string, hallId: string) => {
        if (sessionHalls.some(sh => sh.sessionId === sessionId && sh.departmentId === departmentId && sh.hallId === hallId)) {
            return;
        }
        const newSH: SessionHall = {
            id: `SH${Date.now()}-${Math.random().toString(36).substr(2,9)}`,
            sessionId,
            departmentId,
            hallId
        };
        setSessionHalls([...sessionHalls, newSH]);
    };

    const handleRemoveSessionHall = (sessionId: string, departmentId: string, hallId: string) => {
        setSessionHalls(sessionHalls.filter(sh => !(sh.sessionId === sessionId && sh.departmentId === departmentId && sh.hallId === hallId)));
    };
    
    // --- Student Hall Assignments Handlers ---
    const handleSaveStudentHallAssignments = (sessionId: string, departmentId: string, newAssignments: StudentHallAssignment[]) => {
        setStudentHallAssignments(prev => {
            // Remove old assignments for this specific session and department
            const filtered = prev.filter(a => !(a.sessionId === sessionId && a.departmentId === departmentId));
            return [...filtered, ...newAssignments];
        });
    };

    // Explicit handler to clear/reset assignments
    const handleResetStudentHallAssignments = (sessionId: string, departmentId: string) => {
        setStudentHallAssignments(prev => {
            // Only return assignments that DO NOT match the sessionId and departmentId
            return prev.filter(a => !(a.sessionId === sessionId && a.departmentId === departmentId));
        });
    };

    // --- Student Registration Handlers ---
    const handleImportStudentRegistrations = (
        newStudents: Student[], 
        newRegistrations: Omit<StudentCourseRegistration, 'id'>[]
    ) => {
        setStudents(prevStudents => {
            const existingNumbers = new Set(prevStudents.map(s => s.studentNumber));
            const uniqueNewStudents = newStudents.filter(s => !existingNumbers.has(s.studentNumber));
            return [...prevStudents, ...uniqueNewStudents];
        });

        setStudentCourseRegistrations(prevRegs => {
             const addedRegs = newRegistrations.map(r => ({ ...r, id: `SCR${Date.now()}-${Math.random().toString(36).substr(2, 9)}` }));
             return [...prevRegs, ...addedRegs];
        });
    };

    const handleAddSingleRegistration = (student: Student, examId: string, courseId: string) => {
        setStudents(prev => {
            if (prev.some(s => s.id === student.id)) return prev;
            return [...prev, student];
        });

        setStudentCourseRegistrations(prev => {
            if (prev.some(r => r.examId === examId && r.courseId === courseId && r.studentId === student.id)) {
                return prev;
            }
            const newReg: StudentCourseRegistration = {
                id: `SCR${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                examId,
                courseId,
                studentId: student.id
            };
            return [...prev, newReg];
        });
    };

    const handleRemoveRegistration = (examId: string, courseId: string, studentId: string) => {
        setStudentCourseRegistrations(prev => 
            prev.filter(r => !(r.examId === examId && r.courseId === courseId && r.studentId === studentId))
        );
    };

    // --- Teacher CRUD Handlers ---
    const handleAddTeacher = (teacherData: Omit<Teacher, 'id'>) => {
        const newTeacher: Teacher = { id: `T${Date.now()}`, ...teacherData };
        setTeachers([newTeacher, ...teachers]);
    };
    const handleUpdateTeacher = (updatedTeacher: Teacher) => {
        setTeachers(teachers.map(t => t.id === updatedTeacher.id ? updatedTeacher : t));
    };
    const handleDeleteTeacher = (teacherId: string) => {
        setTeachers(teachers.filter(t => t.id !== teacherId));
    };


  const renderContent = () => {
    switch (activePage.page) {
      case 'dashboard':
        return <DashboardPage />;
      case 'schools':
        return <SchoolsPage 
                  schools={schools}
                  onAdd={handleAddSchool}
                  onUpdate={handleUpdateSchool}
                  onDelete={handleDeleteSchool}
                  onNavigate={handleNavigate} 
                />;
      case 'departments':
        return <DepartmentsPage 
                  initialSchoolId={activePage.context?.schoolId} 
                  allSchools={schools}
                  allDepartments={departments}
                  onAdd={handleAddDepartment}
                  onUpdate={handleUpdateDepartment}
                  onDelete={handleDeleteDepartment}
                  onNavigate={handleNavigate} 
                />;
      case 'buildings':
        return <BuildingsPage
                    buildings={buildings}
                    onAdd={handleAddBuilding}
                    onUpdate={handleUpdateBuilding}
                    onDelete={handleDeleteBuilding}
                    onNavigate={handleNavigate}
                />;
      case 'halls':
        return <HallsPage
                    initialBuildingId={activePage.context?.buildingId}
                    allBuildings={buildings}
                    allHalls={halls}
                    onAdd={handleAddHall}
                    onUpdate={handleUpdateHall}
                    onDelete={handleDeleteHall}
                    onNavigate={handleNavigate}
                />;
      case 'courses':
        return <CoursesPage
                    allSchools={schools}
                    allDepartments={departments}
                    allCourses={courses}
                    teachers={teachers}
                    onAdd={handleAddCourse}
                    onUpdate={handleUpdateCourse}
                    onDelete={handleDeleteCourse}
                    onNavigate={handleNavigate}
               />;
      case 'teachers':
        return <TeachersPage
                    teachers={teachers}
                    schools={schools}
                    onAdd={handleAddTeacher}
                    onUpdate={handleUpdateTeacher}
                    onDelete={handleDeleteTeacher}
                    onNavigate={handleNavigate}
               />;
      case 'exams':
        return <ExamsPage
                    exams={exams}
                    onAdd={handleAddExam}
                    onUpdate={handleUpdateExam}
                    onDelete={handleDeleteExam}
                    onToggleStatus={handleToggleExamStatus}
                    onNavigate={handleNavigate}
                />;
      case 'sessions':
        return <SessionsPage
                    initialExamId={activePage.context?.examId}
                    allExams={exams}
                    allSessions={sessions}
                    allDepartments={departments}
                    sessionDepartments={sessionDepartments}
                    onAdd={handleAddSession}
                    onUpdate={handleUpdateSession}
                    onDelete={handleDeleteSession}
                    onToggleStatus={handleToggleSessionStatus}
                    onNavigate={handleNavigate}
                    onAddSessionDepartment={handleAddSessionDepartment}
                    onRemoveSessionDepartment={handleRemoveSessionDepartment}
                />;
      case 'exam-courses':
          return <ExamCoursesPage
                    exams={exams}
                    schools={schools}
                    departments={departments}
                    courses={courses}
                    examCourses={examCourses}
                    onAddExamCourse={handleAddExamCourse}
                    onRemoveExamCourse={handleRemoveExamCourse}
                />;
      case 'exam-halls':
          return <ExamHallsPage
                    exams={exams}
                    buildings={buildings}
                    halls={halls}
                    examHalls={examHalls}
                    onAddExamHall={handleAddExamHall}
                    onRemoveExamHall={handleRemoveExamHall}
                />;
      case 'student-registrations':
          return <StudentCourseRegistrationsPage
                    exams={exams}
                    courses={courses}
                    examCourses={examCourses}
                    students={students}
                    studentCourseRegistrations={studentCourseRegistrations}
                    onImportRegistrations={handleImportStudentRegistrations}
                    onAddSingleRegistration={handleAddSingleRegistration}
                    onRemoveRegistration={handleRemoveRegistration}
                />;
      case 'session-courses':
          return <SessionCoursesPage
                    exams={exams}
                    sessions={sessions}
                    departments={departments}
                    courses={courses}
                    examCourses={examCourses}
                    sessionDepartments={sessionDepartments}
                    sessionCourses={sessionCourses}
                    studentCourseRegistrations={studentCourseRegistrations}
                    onAddSessionCourse={handleAddSessionCourse}
                    onRemoveSessionCourse={handleRemoveSessionCourse}
                />;
      case 'session-halls':
          return <SessionHallsPage
                    exams={exams}
                    sessions={sessions}
                    departments={departments}
                    halls={halls}
                    courses={courses}
                    examHalls={examHalls}
                    sessionDepartments={sessionDepartments}
                    sessionCourses={sessionCourses}
                    sessionHalls={sessionHalls}
                    studentCourseRegistrations={studentCourseRegistrations}
                    onAddSessionHall={handleAddSessionHall}
                    onRemoveSessionHall={handleRemoveSessionHall}
                />;
      case 'session-students':
          return <SessionStudentsPage
                    exams={exams}
                    sessions={sessions}
                    departments={departments}
                    halls={halls}
                    students={students}
                    courses={courses}
                    sessionDepartments={sessionDepartments}
                    sessionHalls={sessionHalls}
                    sessionCourses={sessionCourses}
                    studentCourseRegistrations={studentCourseRegistrations}
                    studentHallAssignments={studentHallAssignments}
                    onSaveAssignments={handleSaveStudentHallAssignments}
                    onResetAssignments={handleResetStudentHallAssignments}
                />;
      case 'session-inquiry':
          return <SessionInquiryPage
                    students={students}
                    exams={exams}
                    sessions={sessions}
                    halls={halls}
                    courses={courses}
                    departments={departments}
                    studentHallAssignments={studentHallAssignments}
                    sessionCourses={sessionCourses}
                    studentCourseRegistrations={studentCourseRegistrations}
                    buildings={buildings}
                    schools={schools}
                />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      <Sidebar activePage={activePage.page} onNavigate={handleNavigate} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 print:p-0 print:bg-white print:overflow-visible">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
