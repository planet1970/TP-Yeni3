
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { useAppData } from './hooks/useAppData';

// Pages
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
import ExamCenterHallListsPage from './pages/ExamCenterHallListsPage';
import ExamCenterOpticFormsPage from './pages/ExamCenterOpticFormsPage';

interface PageState {
  page: string;
  context?: Record<string, any>;
}

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<PageState>({ page: 'dashboard' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const { state, handlers } = useAppData();

  const handleNavigate = (pageState: PageState) => {
    setActivePage(pageState);
    setIsSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activePage.page) {
      case 'dashboard':
        return <DashboardPage 
                  students={state.students}
                  teachers={state.teachers}
                  attendants={state.attendants}
                  exams={state.exams}
                  sessions={state.sessions}
                  courses={state.courses}
                  schools={state.schools}
               />;
      case 'schools':
        return <SchoolsPage 
                  schools={state.schools}
                  onAdd={handlers.handleAddSchool}
                  onUpdate={handlers.handleUpdateSchool}
                  onDelete={handlers.handleDeleteSchool}
                  onNavigate={handleNavigate} 
                />;
      case 'departments':
        return <DepartmentsPage 
                  initialSchoolId={activePage.context?.schoolId} 
                  allSchools={state.schools}
                  allDepartments={state.departments}
                  onAdd={handlers.handleAddDepartment}
                  onUpdate={handlers.handleUpdateDepartment}
                  onDelete={handlers.handleDeleteDepartment}
                  onNavigate={handleNavigate} 
                />;
      case 'buildings':
        return <BuildingsPage
                    buildings={state.buildings}
                    onAdd={handlers.handleAddBuilding}
                    onUpdate={handlers.handleUpdateBuilding}
                    onDelete={handlers.handleDeleteBuilding}
                    onNavigate={handleNavigate}
                />;
      case 'halls':
        return <HallsPage
                    initialBuildingId={activePage.context?.buildingId}
                    allBuildings={state.buildings}
                    allHalls={state.halls}
                    onAdd={handlers.handleAddHall}
                    onUpdate={handlers.handleUpdateHall}
                    onDelete={handlers.handleDeleteHall}
                    onNavigate={handleNavigate}
                />;
      case 'courses':
        return <CoursesPage
                    allSchools={state.schools}
                    allDepartments={state.departments}
                    allCourses={state.courses}
                    teachers={state.teachers}
                    onAdd={handlers.handleAddCourse}
                    onUpdate={handlers.handleUpdateCourse}
                    onDelete={handlers.handleDeleteCourse}
                    onNavigate={handleNavigate}
               />;
      case 'teachers':
        return <TeachersPage
                    teachers={state.teachers}
                    schools={state.schools}
                    onAdd={handlers.handleAddTeacher}
                    onUpdate={handlers.handleUpdateTeacher}
                    onDelete={handlers.handleDeleteTeacher}
                    onNavigate={handleNavigate}
               />;
      case 'attendants':
        return <AttendantsPage
                    attendants={state.attendants}
                    schools={state.schools}
                    onAdd={handlers.handleAddAttendant}
                    onUpdate={handlers.handleUpdateAttendant}
                    onDelete={handlers.handleDeleteAttendant}
                    onToggleStatus={handlers.handleToggleAttendantStatus}
               />;
      case 'exams':
        return <ExamsPage
                    exams={state.exams}
                    onAdd={handlers.handleAddExam}
                    onUpdate={handlers.handleUpdateExam}
                    onDelete={handlers.handleDeleteExam}
                    onToggleStatus={handlers.handleToggleExamStatus}
                    onNavigate={handleNavigate}
                />;
      case 'sessions':
        return <SessionsPage
                    initialExamId={activePage.context?.examId}
                    allExams={state.exams}
                    allSessions={state.sessions}
                    allDepartments={state.departments}
                    sessionDepartments={state.sessionDepartments}
                    onAdd={handlers.handleAddSession}
                    onUpdate={handlers.handleUpdateSession}
                    onDelete={handlers.handleDeleteSession}
                    onToggleStatus={handlers.handleToggleSessionStatus}
                    onNavigate={handleNavigate}
                    onAddSessionDepartment={handlers.handleAddSessionDepartment}
                    onRemoveSessionDepartment={handlers.handleRemoveSessionDepartment}
                />;
      case 'exam-courses':
          return <ExamCoursesPage
                    exams={state.exams}
                    schools={state.schools}
                    departments={state.departments}
                    courses={state.courses}
                    examCourses={state.examCourses}
                    onAddExamCourse={handlers.handleAddExamCourse}
                    onRemoveExamCourse={handlers.handleRemoveExamCourse}
                    onRevertToDraft={handlers.handleRevertExamToDraft}
                />;
      case 'exam-halls':
          return <ExamHallsPage
                    exams={state.exams}
                    buildings={state.buildings}
                    halls={state.halls}
                    examHalls={state.examHalls}
                    onAddExamHall={handlers.handleAddExamHall}
                    onRemoveExamHall={handlers.handleRemoveExamHall}
                />;
      case 'student-registrations':
          return <StudentCourseRegistrationsPage
                    exams={state.exams}
                    courses={state.courses}
                    examCourses={state.examCourses}
                    students={state.students}
                    studentCourseRegistrations={state.studentCourseRegistrations}
                    onImportRegistrations={handlers.handleImportStudentRegistrations}
                    onAddSingleRegistration={handlers.handleAddSingleRegistration}
                    onRemoveRegistration={handlers.handleRemoveRegistration}
                />;
      case 'session-courses':
          return <SessionCoursesPage
                    exams={state.exams}
                    sessions={state.sessions}
                    departments={state.departments}
                    courses={state.courses}
                    examCourses={state.examCourses}
                    sessionDepartments={state.sessionDepartments}
                    sessionCourses={state.sessionCourses}
                    studentCourseRegistrations={state.studentCourseRegistrations}
                    onAddSessionCourse={handlers.handleAddSessionCourse}
                    onRemoveSessionCourse={handlers.handleRemoveSessionCourse}
                />;
      case 'session-halls':
          return <SessionHallsPage
                    exams={state.exams}
                    sessions={state.sessions}
                    departments={state.departments}
                    halls={state.halls}
                    courses={state.courses}
                    examHalls={state.examHalls}
                    sessionDepartments={state.sessionDepartments}
                    sessionCourses={state.sessionCourses}
                    sessionHalls={state.sessionHalls}
                    studentCourseRegistrations={state.studentCourseRegistrations}
                    onAddSessionHall={handlers.handleAddSessionHall}
                    onRemoveSessionHall={handlers.handleRemoveSessionHall}
                />;
      case 'session-students':
          return <SessionStudentsPage
                    exams={state.exams}
                    sessions={state.sessions}
                    departments={state.departments}
                    halls={state.halls}
                    students={state.students}
                    courses={state.courses}
                    sessionDepartments={state.sessionDepartments}
                    sessionHalls={state.sessionHalls}
                    sessionCourses={state.sessionCourses}
                    studentCourseRegistrations={state.studentCourseRegistrations}
                    studentHallAssignments={state.studentHallAssignments}
                    onSaveAssignments={handlers.handleSaveStudentHallAssignments}
                    onResetAssignments={handlers.handleResetStudentHallAssignments}
                />;
      case 'session-inquiry':
          return <SessionInquiryPage
                    students={state.students}
                    exams={state.exams}
                    sessions={state.sessions}
                    halls={state.halls}
                    courses={state.courses}
                    departments={state.departments}
                    studentHallAssignments={state.studentHallAssignments}
                    sessionCourses={state.sessionCourses}
                    studentCourseRegistrations={state.studentCourseRegistrations}
                    buildings={state.buildings}
                    schools={state.schools}
                />;
      case 'attendant-assignments':
        return <AttendantAssignmentsPage
                    exams={state.exams}
                    sessions={state.sessions}
                    halls={state.halls}
                    buildings={state.buildings}
                    sessionHalls={state.sessionHalls}
                    attendants={state.attendants}
                    assignments={state.attendantAssignments}
                    taskRequests={state.taskRequests}
                    onUpdateAssignment={handlers.handleUpdateAttendantAssignment}
               />;
      case 'signature-lists':
          return <SignatureListsPage
                    exams={state.exams}
                    sessions={state.sessions}
                    buildings={state.buildings}
                    halls={state.halls}
                    attendants={state.attendants}
                    assignments={state.attendantAssignments}
                    sessionHalls={state.sessionHalls}
                    departments={state.departments}
                    schools={state.schools}
                />;
      case 'hall-lists':
          return <HallListsPage
                    exams={state.exams}
                    sessions={state.sessions}
                    buildings={state.buildings}
                    halls={state.halls}
                    attendants={state.attendants}
                    assignments={state.attendantAssignments}
                    sessionHalls={state.sessionHalls}
                />;
      case 'task-request':
          return <TaskRequestPage
                    exams={state.exams}
                    sessions={state.sessions}
                    attendants={state.attendants}
                    taskRequests={state.taskRequests}
                    onRequestTask={handlers.handleRequestTask}
                    onCancelRequest={handlers.handleCancelTaskRequest}
                />;
      case 'task-accept':
          return <TaskAcceptPage 
                    attendants={state.attendants}
                    assignments={state.attendantAssignments}
                    exams={state.exams}
                    sessions={state.sessions}
                    buildings={state.buildings}
                    halls={state.halls}
                    onRespond={handlers.handleAssignmentResponse}
                />;
      case 'task-archive':
          return <TaskArchivePage 
                    attendants={state.attendants}
                    assignments={state.attendantAssignments}
                    exams={state.exams}
                    sessions={state.sessions}
                    buildings={state.buildings}
                    halls={state.halls}
                />;
      case 'task-cards':
          return <TaskCardsPage
                    attendants={state.attendants}
                    assignments={state.attendantAssignments}
                    exams={state.exams}
                    sessions={state.sessions}
                    buildings={state.buildings}
                    halls={state.halls}
                />;
      case 'teacher-question-bank':
          return <TeacherQuestionBankPage
                    teachers={state.teachers}
                    courses={state.courses}
                    questions={state.questions}
                    topics={state.topics}
                    onAddQuestion={handlers.handleAddQuestion}
                    onUpdateQuestion={handlers.handleUpdateQuestion}
                    onDeleteQuestion={handlers.handleDeleteQuestion}
                    onAddTopic={handlers.handleAddTopic}
                    onDeleteTopic={handlers.handleDeleteTopic}
                />;
      case 'teacher-exam-definition':
          return <TeacherExamDefinitionPage
                    teachers={state.teachers}
                    exams={state.exams}
                    courses={state.courses}
                    examCourses={state.examCourses}
                    questions={state.questions}
                    topics={state.topics}
                    examCourseQuestions={state.examCourseQuestions}
                    onUpdateExamCourse={handlers.handleUpdateExamCourse}
                    onAssignQuestions={handlers.handleAssignQuestionsToExam}
                    onRemoveQuestionFromExam={handlers.handleRemoveQuestionFromExam}
                    onUpdateQuestionPoints={handlers.handleUpdateExamQuestionPoints}
                    onRecalculatePoints={handlers.handleRecalculatePoints}
                />;
      case 'exam-center-hall-lists':
          return <ExamCenterHallListsPage
                    exams={state.exams}
                    sessions={state.sessions}
                    departments={state.departments}
                    halls={state.halls}
                    courses={state.courses}
                    students={state.students}
                    sessionDepartments={state.sessionDepartments}
                    sessionHalls={state.sessionHalls}
                    sessionCourses={state.sessionCourses}
                    studentCourseRegistrations={state.studentCourseRegistrations}
                    studentHallAssignments={state.studentHallAssignments}
                    attendants={state.attendants}
                    assignments={state.attendantAssignments}
                    hallListPrintStatuses={state.hallListPrintStatuses}
                    onMarkAsPrinted={handlers.handleMarkHallListAsPrinted}
                />;
      case 'exam-center-optic-forms':
          return <ExamCenterOpticFormsPage
                    exams={state.exams}
                    sessions={state.sessions}
                    departments={state.departments}
                    halls={state.halls}
                    courses={state.courses}
                    students={state.students}
                    sessionDepartments={state.sessionDepartments}
                    sessionHalls={state.sessionHalls}
                    sessionCourses={state.sessionCourses}
                    studentCourseRegistrations={state.studentCourseRegistrations}
                    studentHallAssignments={state.studentHallAssignments}
                    attendants={state.attendants}
                    assignments={state.attendantAssignments}
                    hallListPrintStatuses={state.hallListPrintStatuses}
                    onMarkAsPrinted={handlers.handleMarkHallListAsPrinted}
                />;
      default:
        return <DashboardPage 
                  students={state.students}
                  teachers={state.teachers}
                  attendants={state.attendants}
                  exams={state.exams}
                  sessions={state.sessions}
                  courses={state.courses}
                  schools={state.schools}
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
