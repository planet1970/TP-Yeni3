import React, { useState, useEffect } from 'react';
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
import AttendantsPage from './pages/AttendantsPage';
import AttendantAssignmentsPage from './pages/AttendantAssignmentsPage';
import SignatureListsPage from './pages/SignatureListsPage';
import HallListsPage from './pages/HallListsPage';
import SessionInquiryPage from './pages/SessionInquiryPage';
import TaskRequestPage from './pages/TaskRequestPage';
import TaskAcceptPage from './pages/TaskAcceptPage';
import TaskArchivePage from './pages/TaskArchivePage';
import TaskCardsPage from './pages/TaskCardsPage';
import TeacherExamDefinitionPage from './pages/TeacherExamDefinitionPage';
import TeacherQuestionBankPage from './pages/TeacherQuestionBankPage';
import { School, Department, Building, Hall, Course, Exam, Session, SessionCourse, SessionDepartment, ExamCourse, ExamHall, SessionHall, Student, Teacher, Attendant, StudentCourseRegistration, StudentHallAssignment, AttendantAssignment, TaskRequest, Question, ExamCourseQuestion } from './types';
import { 
  BellIcon, 
  CogIcon, 
  MoonIcon, 
  SearchIcon, 
  ClockIcon,
  MenuIcon
} from './components/icons';

interface PageState {
  page: string;
  context?: Record<string, any>;
}

// --- Custom Hook for LocalStorage Persistence ---
function usePersistedState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState] as const;
}

// --- INITIAL DATA (Rich Mock Data based on User Scenario) ---

const initialSchoolsData: School[] = [
    { id: 'S001', name: 'Sosyal Bilimler Enstitüsü', description: 'Lisansüstü eğitim merkezi.', contact: 'sosyalbilimler@trakya.edu.tr' },
    { id: 'S002', name: 'İktisadi ve İdari Bilimler Fakültesi', description: 'İktisat ve İşletme bölümleri.', contact: 'iibf@trakya.edu.tr' },
    { id: 'S003', name: 'Edebiyat Fakültesi', description: 'Sosyal ve beşeri bilimler.', contact: 'edebiyat@trakya.edu.tr' },
];

const allDepartmentsData: Department[] = [
    { id: 'D001', name: 'Yönetim ve Organizasyon', code: 'YON', schoolId: 'S001' },
    { id: 'D002', name: 'İşletme', code: 'ISL', schoolId: 'S001' },
    { id: 'D003', name: 'İktisat', code: 'IKT', schoolId: 'S001' },
    { id: 'D004', name: 'Türk Dili ve Edebiyatı', code: 'EBY', schoolId: 'S003' },
];

const initialBuildingsData: Building[] = [
    { id: 'B001', name: 'Edebiyat Fakültesi - A Blok', description: 'Merkez Kampüs Girişi', contact: '0284 235 00 00' },
    { id: 'B002', name: 'İİBF - B Blok', description: 'Kütüphane Yanı', contact: '0284 235 00 01' },
];

const allHallsData: Hall[] = [
    { id: 'H001', name: '101', capacity: 40, buildingId: 'B001', floor: 'Zemin Kat' },
    { id: 'H002', name: '102', capacity: 45, buildingId: 'B001', floor: 'Zemin Kat' },
    { id: 'H003', name: '103', capacity: 50, buildingId: 'B001', floor: 'Zemin Kat' },
    { id: 'H004', name: '104', capacity: 35, buildingId: 'B001', floor: 'Zemin Kat' },
    { id: 'H005', name: 'Amfi-1', capacity: 100, buildingId: 'B002', floor: '1. Kat' },
];

const initialTeachersData: Teacher[] = [
    { id: 'T001', title: 'Prof. Dr.', firstName: 'Ahmet', lastName: 'Yılmaz', email: 'ahmet@trakya.edu.tr', phone: '05551112233', schoolId: 'S001' },
    { id: 'T002', title: 'Doç. Dr.', firstName: 'Ayşe', lastName: 'Kaya', email: 'ayse@trakya.edu.tr', phone: '05552223344', schoolId: 'S001' },
];

const allCoursesData: Course[] = [
    { id: 'C001', name: 'İŞ ETİĞİ', code: 'YON701', departmentId: 'D001', teacherId: 'T001' },
    { id: 'C002', name: 'YÖNETİMDE ÇAĞDAŞ YAKLAŞIMLAR', code: 'YON705', departmentId: 'D001', teacherId: 'T002' },
    { id: 'C003', name: 'ÖRGÜT KÜLTÜRÜ', code: 'YON707', departmentId: 'D001', teacherId: 'T001' },
    { id: 'C004', name: 'ÖRGÜTLERDE İNSAN DAVRANIŞI', code: 'YON709', departmentId: 'D001', teacherId: 'T002' },
    { id: 'C005', name: 'STRATEJİK YÖNETİM', code: 'YON711', departmentId: 'D001', teacherId: 'T001' },
];

const initialExamsData: Exam[] = [
    { id: 'E001', name: '2025-2026 GÜZ DÖNEMİ ARA SINAVI', description: 'SOSYAL BİLİMLER ENSTİTÜSÜ', closingDate: '2025-11-10', isActive: true },
    { id: 'E002', name: 'UZAKTAN EĞİTİM TEZSİZ YÜKSEK LİSANS FİNAL SINAVLARI', description: 'DÖNEM SONU', closingDate: '2026-01-15', isActive: false },
];

const allSessionsData: Session[] = [
    { id: 'SS001', sequenceNumber: 1, name: '1. Oturum', date: '2025-11-15T10:00', examId: 'E001', isActive: true },
    { id: 'SS002', sequenceNumber: 2, name: '2. Oturum', date: '2025-11-15T11:30', examId: 'E001', isActive: true },
    { id: 'SS003', sequenceNumber: 3, name: '3. Oturum', date: '2025-11-15T14:00', examId: 'E001', isActive: true },
    { id: 'SS004', sequenceNumber: 4, name: '4. Oturum', date: '2025-11-15T15:30', examId: 'E001', isActive: true },
];

const initialAttendantsData: Attendant[] = [
    { id: 'A001', title: 'Doç. Dr.', firstName: 'Ali İhsan', lastName: 'MEŞE', schoolId: 'S001', email: 'ali.mese@trakya.edu.tr', phone: '', isActive: true },
    { id: 'A002', title: 'Öğr. Gör.', firstName: 'Can', lastName: 'TEZCAN', schoolId: 'S001', email: 'can.tezcan@trakya.edu.tr', phone: '', isActive: true },
    { id: 'A003', title: 'Dr. Öğr. Üyesi', firstName: 'Levent', lastName: 'DOĞAN', schoolId: 'S001', email: 'levent.dogan@trakya.edu.tr', phone: '', isActive: true },
    { id: 'A004', title: 'Dr. Öğr. Üyesi', firstName: 'Müge', lastName: 'ATAKAN', schoolId: 'S001', email: 'muge.atakan@trakya.edu.tr', phone: '', isActive: true },
    { id: 'A005', title: 'Enstitü Sekr.', firstName: 'Cihan', lastName: 'SAYAN', schoolId: 'S001', email: '', phone: '', isActive: true },
    { id: 'A006', title: 'Bilg. İşl.', firstName: 'Özlem', lastName: 'GÜÇKAN', schoolId: 'S001', email: '', phone: '', isActive: true },
    { id: 'A007', title: 'Bilg. İşl.', firstName: 'Cem', lastName: 'KAVALCI', schoolId: 'S001', email: '', phone: '', isActive: true },
    { id: 'A008', title: 'Dr. Öğr. Üyesi', firstName: 'Tolga', lastName: 'DİLLİOĞLU', schoolId: 'S001', email: '', phone: '', isActive: true },
    { id: 'A009', title: 'Bilg. İşl.', firstName: 'Mehmet', lastName: 'GÜNGÖR', schoolId: 'S001', email: '', phone: '', isActive: true },
    { id: 'A010', title: 'Bilg. İşl.', firstName: 'Hilal', lastName: 'ÖZTÜRK', schoolId: 'S001', email: '', phone: '', isActive: true },
    { id: 'A011', title: 'Arş. Gör. Dr.', firstName: 'Engin', lastName: 'ÇİÇEK', schoolId: 'S001', email: '', phone: '', isActive: true },
    { id: 'A012', title: 'Bilg. İşl.', firstName: 'İlknur', lastName: 'HAKAN', schoolId: 'S001', email: '', phone: '', isActive: true },
    { id: 'A013', title: 'Bilg. İşl.', firstName: 'Eren', lastName: 'MAZLUM', schoolId: 'S001', email: '', phone: '', isActive: true },
    { id: 'A014', title: 'Şef', firstName: 'Cengiz', lastName: 'ERDUVAN', schoolId: 'S001', email: '', phone: '', isActive: true },
    { id: 'A015', title: 'Bilg. İşl.', firstName: 'Arzu Atabey', lastName: 'KILIÇ', schoolId: 'S001', email: '', phone: '', isActive: true },
    { id: 'A016', title: 'Bilg. İşl.', firstName: 'Mehmet', lastName: 'AKTAŞ', schoolId: 'S001', email: '', phone: '', isActive: true },
    { id: 'A017', title: 'Veri Haz. Kont. İşl.', firstName: 'Murat', lastName: 'SOYASLAN', schoolId: 'S001', email: '', phone: '', isActive: true },
    { id: 'A018', title: 'Bilg. İşl.', firstName: 'Serkan', lastName: 'MEYDAN', schoolId: 'S001', email: '', phone: '', isActive: true },
    { id: 'A019', title: '', firstName: 'Şükrü', lastName: 'GÜLER', schoolId: 'S001', email: '', phone: '', isActive: true },
    { id: 'A020', title: '', firstName: 'Arif Kaan', lastName: 'AVCU', schoolId: 'S001', email: '', phone: '', isActive: true },
    { id: 'A021', title: '', firstName: 'İhsan', lastName: 'KARA', schoolId: 'S001', email: '', phone: '', isActive: true },
];

const initialStudentsData: Student[] = [
    { id: 'ST-2582634027', studentNumber: '2582634027', firstName: 'HİLAL', lastName: 'AKGÜN KOKALA' }
];

const initialExamCoursesData: ExamCourse[] = [
    // Mock data assumed to be confirmed for initial view
    { id: 'EC001', examId: 'E001', courseId: 'C001', questionCount: 20, duration: 30, isConfirmed: true },
    { id: 'EC002', examId: 'E001', courseId: 'C002', questionCount: 25, duration: 40, isConfirmed: true },
];

const initialSessionCoursesData: SessionCourse[] = [];
const initialExamHallsData: ExamHall[] = [];
const initialSessionDepartmentsData: SessionDepartment[] = [];
const initialSessionHallsData: SessionHall[] = [];


const Header: React.FC<{ onToggleSidebar: () => void }> = ({ onToggleSidebar }) => {
  return (
    <header className="bg-white p-4 flex justify-between items-center shadow-sm print:hidden">
      <div className="flex items-center">
        {/* Mobile Menu Button */}
        <button onClick={onToggleSidebar} className="mr-4 text-gray-600 hover:text-gray-900 lg:hidden">
            <MenuIcon className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-700 hidden sm:block">HOŞ GELDİNİZ!</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative hidden sm:block">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Ara..."
            className="pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 w-64"
          />
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <MoonIcon className="h-6 w-6" />
        </button>
        <button className="relative text-gray-500 hover:text-gray-700">
          <BellIcon className="h-6 w-6" />
          <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
        </button>
        <button className="text-gray-500 hover:text-gray-700 hidden sm:block">
          <CogIcon className="h-6 w-6" />
        </button>
        <button className="text-gray-500 hover:text-gray-700 hidden sm:block">
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Persistent State using localStorage - KEY NAMES UPDATED TO _v1 TO LOAD NEW MOCK DATA
  const [schools, setSchools] = usePersistedState<School[]>('ems_schools_v1', initialSchoolsData);
  const [departments, setDepartments] = usePersistedState<Department[]>('ems_departments_v1', allDepartmentsData);
  const [buildings, setBuildings] = usePersistedState<Building[]>('ems_buildings_v1', initialBuildingsData);
  const [halls, setHalls] = usePersistedState<Hall[]>('ems_halls_v1', allHallsData);
  const [courses, setCourses] = usePersistedState<Course[]>('ems_courses_v1', allCoursesData);
  const [exams, setExams] = usePersistedState<Exam[]>('ems_exams_v1', initialExamsData);
  const [sessions, setSessions] = usePersistedState<Session[]>('ems_sessions_v1', allSessionsData);
  const [sessionCourses, setSessionCourses] = usePersistedState<SessionCourse[]>('ems_sessionCourses_v1', initialSessionCoursesData);
  const [sessionDepartments, setSessionDepartments] = usePersistedState<SessionDepartment[]>('ems_sessionDepartments_v1', initialSessionDepartmentsData);
  const [examCourses, setExamCourses] = usePersistedState<ExamCourse[]>('ems_examCourses_v1', initialExamCoursesData);
  const [examHalls, setExamHalls] = usePersistedState<ExamHall[]>('ems_examHalls_v1', initialExamHallsData);
  const [sessionHalls, setSessionHalls] = usePersistedState<SessionHall[]>('ems_sessionHalls_v1', initialSessionHallsData);
  
  // Student, Teacher, Attendant and Registration State
  const [students, setStudents] = usePersistedState<Student[]>('ems_students_v1', initialStudentsData);
  const [teachers, setTeachers] = usePersistedState<Teacher[]>('ems_teachers_v1', initialTeachersData);
  const [attendants, setAttendants] = usePersistedState<Attendant[]>('ems_attendants_v1', initialAttendantsData);
  const [studentCourseRegistrations, setStudentCourseRegistrations] = usePersistedState<StudentCourseRegistration[]>('ems_studentCourseRegistrations_v1', []);
  
  // Assignments
  const [studentHallAssignments, setStudentHallAssignments] = usePersistedState<StudentHallAssignment[]>('ems_studentHallAssignments_v1', []);
  const [attendantAssignments, setAttendantAssignments] = usePersistedState<AttendantAssignment[]>('ems_attendantAssignments_v1', []);
  const [taskRequests, setTaskRequests] = usePersistedState<TaskRequest[]>('ems_taskRequests_v1', []);

  // Teacher Module State
  const [questions, setQuestions] = usePersistedState<Question[]>('ems_questions_v1', []);
  const [examCourseQuestions, setExamCourseQuestions] = usePersistedState<ExamCourseQuestion[]>('ems_examCourseQuestions_v1', []);


  const handleNavigate = (pageState: PageState) => {
    setActivePage(pageState);
    setIsSidebarOpen(false); // Close sidebar on mobile when navigating
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
    // This handler is used by ADMIN to Confirm the course or TEACHER to upsert definition
    const handleAddExamCourse = (examId: string, courseId: string, questionCount: number, duration: number) => {
        // Admin "Adding" implies confirming the existing definition
        setExamCourses(prev => {
            const existing = prev.find(ec => ec.examId === examId && ec.courseId === courseId);
            if (existing) {
                return prev.map(ec => ec.id === existing.id ? { ...existing, isConfirmed: true } : ec);
            } else {
                // Should not ideally happen if workflow is Teacher Defined -> Admin Confirms
                // But fallback for manual admin entry if allowed
                return [...prev, {
                    id: `EC${Date.now()}`,
                    examId,
                    courseId,
                    questionCount,
                    duration,
                    isConfirmed: true
                }];
            }
        });
    };

    // Updated to handle definition updates (instructions, etc.) AND inserting new ones if they don't exist
    const handleUpdateExamCourse = (examCourseData: ExamCourse) => {
        setExamCourses(prev => {
            const existing = prev.find(ec => ec.examId === examCourseData.examId && ec.courseId === examCourseData.courseId);
            if (existing) {
                // Update existing, preserve ID and existing confirmed status unless explicitly changed
                return prev.map(ec => ec.id === existing.id ? { ...existing, ...examCourseData } : ec);
            } else {
                // Add new if it doesn't exist (Upsert) - Default not confirmed
                const newEC: ExamCourse = {
                    ...examCourseData,
                    id: examCourseData.id || `EC${Date.now()}`,
                    isConfirmed: examCourseData.isConfirmed || false 
                };
                return [...prev, newEC];
            }
        });
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

    const handleResetStudentHallAssignments = (sessionId: string, departmentId: string) => {
        setStudentHallAssignments(prev => {
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

    // --- Attendant CRUD Handlers ---
    const handleAddAttendant = (attendantData: Omit<Attendant, 'id' | 'isActive'>) => {
        const newAttendant: Attendant = { id: `A${Date.now()}`, ...attendantData, isActive: true };
        setAttendants([newAttendant, ...attendants]);
    };
    const handleUpdateAttendant = (updatedAttendant: Attendant) => {
        setAttendants(attendants.map(a => a.id === updatedAttendant.id ? updatedAttendant : a));
    };
    const handleDeleteAttendant = (attendantId: string) => {
        setAttendants(attendants.filter(a => a.id !== attendantId));
    };
    const handleToggleAttendantStatus = (attendantId: string) => {
        setAttendants(attendants.map(a => a.id === attendantId ? { ...a, isActive: !a.isActive } : a));
    };

    // --- Attendant Assignment Handlers ---
    const handleUpdateAttendantAssignment = (
        sessionId: string,
        buildingId: string,
        roleName: string,
        attendantId: string,
        hallId?: string
    ) => {
        setAttendantAssignments(prev => {
            const filtered = prev.filter(a => {
                const isSameSession = a.sessionId === sessionId;
                const isSameBuilding = a.buildingId === buildingId;
                const isSameRole = a.roleName === roleName;
                const isSameHall = a.hallId === hallId;
                
                return !(isSameSession && isSameBuilding && isSameRole && isSameHall);
            });

            if (attendantId === "") return filtered;

            return [...filtered, {
                id: `AA-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                sessionId,
                buildingId,
                hallId,
                roleName,
                attendantId,
                status: 'ASSIGNED'
            }];
        });
    };

    const handleAssignmentResponse = (assignmentId: string, status: 'ACCEPTED' | 'REJECTED') => {
        setAttendantAssignments(prev => prev.map(a => 
            a.id === assignmentId ? { ...a, status } : a
        ));
    };

    // --- Task Request Handlers ---
    const handleRequestTask = (attendantId: string, sessionId: string) => {
        setTaskRequests(prev => {
            if (prev.some(r => r.attendantId === attendantId && r.sessionId === sessionId)) return prev;
            return [...prev, {
                id: `TR-${Date.now()}`,
                attendantId,
                sessionId,
                status: 'PENDING',
                requestDate: new Date().toISOString()
            }];
        });
    };

    const handleCancelTaskRequest = (attendantId: string, sessionId: string) => {
        setTaskRequests(prev => prev.filter(r => !(r.attendantId === attendantId && r.sessionId === sessionId)));
    };

    // --- Question Handlers ---
    const handleAddQuestion = (questionData: Omit<Question, 'id'>) => {
        const newQuestion: Question = {
            id: `Q-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            ...questionData
        };
        setQuestions(prev => [newQuestion, ...prev]);
    };

    const handleUpdateQuestion = (updatedQuestion: Question) => {
        setQuestions(prev => prev.map(q => q.id === updatedQuestion.id ? updatedQuestion : q));
    };

    const handleDeleteQuestion = (questionId: string) => {
        setQuestions(prev => prev.filter(q => q.id !== questionId));
        // Also remove from exam assignments
        setExamCourseQuestions(prev => prev.filter(ecq => ecq.questionId !== questionId));
    };

    // --- Exam Question Assignment Handlers ---
    const handleAssignQuestionsToExam = (examId: string, courseId: string, questionIds: string[]) => {
        setExamCourseQuestions(prev => {
            // Filter out duplicates that already exist for this pair to avoid duplicate keys or entries
            const existingIds = new Set(prev.filter(ecq => ecq.examId === examId && ecq.courseId === courseId).map(ecq => ecq.questionId));
            
            const newAssignments = questionIds
                .filter(qid => !existingIds.has(qid))
                .map(qid => ({
                    id: `ECQ-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                    examId,
                    courseId,
                    questionId: qid
                }));
                
            return [...prev, ...newAssignments];
        });
    };

    const handleRemoveQuestionFromExam = (examId: string, courseId: string, questionId: string) => {
        setExamCourseQuestions(prev => prev.filter(ecq => !(ecq.examId === examId && ecq.courseId === courseId && ecq.questionId === questionId)));
    };


  const renderContent = () => {
    switch (activePage.page) {
      case 'dashboard':
        return <DashboardPage 
                  students={students}
                  teachers={teachers}
                  attendants={attendants}
                  exams={exams}
                  sessions={sessions}
                  courses={courses}
                  schools={schools}
               />;
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
      case 'attendants':
        return <AttendantsPage
                    attendants={attendants}
                    schools={schools}
                    onAdd={handleAddAttendant}
                    onUpdate={handleUpdateAttendant}
                    onDelete={handleDeleteAttendant}
                    onToggleStatus={handleToggleAttendantStatus}
               />;
      case 'attendant-assignments':
        return <AttendantAssignmentsPage
                    exams={exams}
                    sessions={sessions}
                    halls={halls}
                    buildings={buildings}
                    sessionHalls={sessionHalls}
                    attendants={attendants}
                    assignments={attendantAssignments}
                    taskRequests={taskRequests}
                    onUpdateAssignment={handleUpdateAttendantAssignment}
               />;
      case 'signature-lists':
          return <SignatureListsPage
                    exams={exams}
                    sessions={sessions}
                    buildings={buildings}
                    halls={halls}
                    attendants={attendants}
                    assignments={attendantAssignments}
                    sessionHalls={sessionHalls}
                    departments={departments}
                    schools={schools}
                />;
      case 'hall-lists':
          return <HallListsPage
                    exams={exams}
                    sessions={sessions}
                    buildings={buildings}
                    halls={halls}
                    attendants={attendants}
                    assignments={attendantAssignments}
                    sessionHalls={sessionHalls}
                />;
      case 'task-request':
          return <TaskRequestPage
                    exams={exams}
                    sessions={sessions}
                    attendants={attendants}
                    taskRequests={taskRequests}
                    onRequestTask={handleRequestTask}
                    onCancelRequest={handleCancelTaskRequest}
                />;
      case 'task-accept':
          return <TaskAcceptPage 
                    attendants={attendants}
                    assignments={attendantAssignments}
                    exams={exams}
                    sessions={sessions}
                    buildings={buildings}
                    halls={halls}
                    onRespond={handleAssignmentResponse}
                />;
      case 'task-archive':
          return <TaskArchivePage 
                    attendants={attendants}
                    assignments={attendantAssignments}
                    exams={exams}
                    sessions={sessions}
                    buildings={buildings}
                    halls={halls}
                />;
      case 'task-cards':
          return <TaskCardsPage
                    attendants={attendants}
                    assignments={attendantAssignments}
                    exams={exams}
                    sessions={sessions}
                    buildings={buildings}
                    halls={halls}
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
      // --- Teacher Module Routes ---
      case 'teacher-question-bank':
          return <TeacherQuestionBankPage
                    teachers={teachers}
                    courses={courses}
                    questions={questions}
                    onAddQuestion={handleAddQuestion}
                    onUpdateQuestion={handleUpdateQuestion}
                    onDeleteQuestion={handleDeleteQuestion}
                />;
      case 'teacher-exam-definition':
          return <TeacherExamDefinitionPage
                    teachers={teachers}
                    exams={exams}
                    courses={courses}
                    examCourses={examCourses}
                    questions={questions}
                    examCourseQuestions={examCourseQuestions}
                    onUpdateExamCourse={handleUpdateExamCourse}
                    onAssignQuestions={handleAssignQuestionsToExam}
                    onRemoveQuestionFromExam={handleRemoveQuestionFromExam}
                />;
      default:
        return <DashboardPage 
                  students={students}
                  teachers={teachers}
                  attendants={attendants}
                  exams={exams}
                  sessions={sessions}
                  courses={courses}
                  schools={schools}
               />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      <Sidebar 
        activePage={activePage.page} 
        onNavigate={handleNavigate} 
        isOpen={isSidebarOpen}
      />
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 print:p-0 print:bg-white print:overflow-visible">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;