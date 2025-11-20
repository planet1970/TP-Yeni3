
import React, { useState, useMemo } from 'react';
import { ClipboardListIcon, BookOpenIcon } from '../components/icons';
import type { Exam, Session, Department, Course, ExamCourse, SessionDepartment, SessionCourse, StudentCourseRegistration } from '../types';

interface SessionCoursesPageProps {
    exams: Exam[];
    sessions: Session[];
    departments: Department[];
    courses: Course[];
    examCourses: ExamCourse[];
    sessionDepartments: SessionDepartment[];
    sessionCourses: SessionCourse[];
    studentCourseRegistrations: StudentCourseRegistration[];
    onAddSessionCourse: (sessionId: string, courseId: string) => void;
    onRemoveSessionCourse: (sessionId: string, courseId: string) => void;
}

const AssignCoursesModal: React.FC<{
    session: Session;
    department: Department;
    examCourses: ExamCourse[];
    allCourses: Course[];
    sessionCourses: SessionCourse[];
    allSessionsInExam: Session[];
    onAdd: (courseId: string) => void;
    onRemove: (courseId: string) => void;
    onClose: () => void;
}> = ({ session, department, examCourses, allCourses, sessionCourses, allSessionsInExam, onAdd, onRemove, onClose }) => {
    
    // 1. Get courses that are in the Exam AND belong to the specific Department
    const relevantExamCourses = examCourses.filter(ec => {
        const course = allCourses.find(c => c.id === ec.courseId);
        return course && course.departmentId === department.id;
    });

    // Helper to check status
    const getCourseStatus = (courseId: string) => {
        // Is added to THIS session?
        const addedToThis = sessionCourses.some(sc => sc.sessionId === session.id && sc.courseId === courseId);
        if (addedToThis) return 'ADDED_THIS';

        // Is added to ANY OTHER session in this exam?
        const sessionIdsInExam = allSessionsInExam.map(s => s.id);
        const addedToAny = sessionCourses.some(sc => sessionIdsInExam.includes(sc.sessionId) && sc.courseId === courseId);
        if (addedToAny) return 'ADDED_OTHER';

        return 'AVAILABLE';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Ders Atama</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {session.name} - <span className="font-medium text-orange-600">{department.name}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                     <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-6 py-3">Ders Kodu</th>
                                <th className="px-6 py-3">Ders Adı</th>
                                <th className="px-6 py-3 text-right">Durum</th>
                            </tr>
                        </thead>
                        <tbody>
                            {relevantExamCourses.map(ec => {
                                const course = allCourses.find(c => c.id === ec.courseId);
                                if (!course) return null;
                                const status = getCourseStatus(course.id);

                                return (
                                    <tr key={course.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">{course.code}</td>
                                        <td className="px-6 py-4">{course.name}</td>
                                        <td className="px-6 py-4 text-right">
                                            {status === 'ADDED_THIS' && (
                                                <button
                                                    onClick={() => onRemove(course.id)}
                                                    className="text-red-600 font-medium text-xs bg-red-100 hover:bg-red-200 px-2 py-1 rounded transition-colors"
                                                >
                                                    Çıkar
                                                </button>
                                            )}
                                            {status === 'ADDED_OTHER' && (
                                                <span className="text-gray-400 font-medium text-xs bg-gray-100 px-2 py-1 rounded" title="Başka bir oturuma atanmış">Başka Oturumda Ekli</span>
                                            )}
                                            {status === 'AVAILABLE' && (
                                                <button 
                                                    onClick={() => onAdd(course.id)}
                                                    className="bg-orange-100 text-orange-700 hover:bg-orange-200 px-3 py-1 rounded font-medium text-xs transition-colors"
                                                >
                                                    Ekle
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {relevantExamCourses.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                        Bu bölüm için sınava dahil edilmiş ders bulunamadı. <br/>
                                        Lütfen önce "Sınav-Ders" menüsünden ders ekleyiniz.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                     </table>
                </div>

                <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end">
                    <button 
                        onClick={onClose}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                        Kapat
                    </button>
                </div>
            </div>
        </div>
    );
};

const SessionCoursesPage: React.FC<SessionCoursesPageProps> = ({
    exams,
    sessions,
    departments,
    courses,
    examCourses,
    sessionDepartments,
    sessionCourses,
    studentCourseRegistrations,
    onAddSessionCourse,
    onRemoveSessionCourse
}) => {
    const [selectedExamId, setSelectedExamId] = useState<string>('');
    
    // Modal State
    const [modalConfig, setModalConfig] = useState<{ session: Session, department: Department } | null>(null);

    const activeExams = useMemo(() => exams.filter(e => e.isActive), [exams]);

    const handleExamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedExamId(e.target.value);
    };

    // Prepare Table Data
    const tableRows = useMemo(() => {
        if (!selectedExamId) return [];

        const examSessions = sessions
            .filter(s => s.examId === selectedExamId)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        const rows: {
            session: Session,
            department: Department,
            assignedCourses: Course[],
            uniqueStudentCount: number
        }[] = [];

        examSessions.forEach(session => {
            const sessionDepts = sessionDepartments.filter(sd => sd.sessionId === session.id);
            
            sessionDepts.forEach(sd => {
                const dept = departments.find(d => d.id === sd.departmentId);
                if (dept) {
                    // Find courses assigned to this session AND belonging to this department
                    const assignedCourseIds = sessionCourses
                        .filter(sc => sc.sessionId === session.id)
                        .map(sc => sc.courseId);
                    
                    const assignedCourses = courses.filter(c => 
                        assignedCourseIds.includes(c.id) && c.departmentId === dept.id
                    );

                    // Calculate unique students for this session-department pair
                    const uniqueStudentIds = new Set<string>();
                    assignedCourses.forEach(course => {
                        const registrations = studentCourseRegistrations.filter(r => 
                            r.examId === selectedExamId && 
                            r.courseId === course.id
                        );
                        registrations.forEach(r => uniqueStudentIds.add(r.studentId));
                    });

                    rows.push({
                        session,
                        department: dept,
                        assignedCourses,
                        uniqueStudentCount: uniqueStudentIds.size
                    });
                }
            });
        });

        return rows;
    }, [selectedExamId, sessions, sessionDepartments, departments, sessionCourses, courses, studentCourseRegistrations]);

    return (
        <div className="container mx-auto h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <ClipboardListIcon className="h-8 w-8 mr-2 text-orange-500" />
                    Oturum - Ders Atama
                </h2>
            </div>

            {/* Exam Selection */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                <label htmlFor="examSelect" className="block text-sm font-medium text-gray-700 mb-2">
                    İşlem Yapılacak Aktif Sınavı Seçiniz
                </label>
                <select
                    id="examSelect"
                    value={selectedExamId}
                    onChange={handleExamChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                >
                    <option value="">-- Bir Sınav Seçiniz --</option>
                    {activeExams.map(exam => (
                        <option key={exam.id} value={exam.id}>
                            {exam.name} ({new Date(exam.closingDate).toLocaleDateString()})
                        </option>
                    ))}
                </select>
            </div>

            {selectedExamId ? (
                <>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden flex-1 flex flex-col">
                         <div className="overflow-x-auto">
                             <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Oturum Adı</th>
                                        <th scope="col" className="px-6 py-3">Tarih / Saat</th>
                                        <th scope="col" className="px-6 py-3">Bölüm</th>
                                        <th scope="col" className="px-6 py-3">Eklenen Dersler</th>
                                        <th scope="col" className="px-6 py-3 text-center">Öğrenci Sayısı</th>
                                        <th scope="col" className="px-6 py-3 text-right">İşlem</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {tableRows.map((row, idx) => (
                                        <tr key={`${row.session.id}-${row.department.id}`} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{row.session.name}</td>
                                            <td className="px-6 py-4">{new Date(row.session.date).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-orange-600 font-medium">{row.department.code}</td>
                                            <td className="px-6 py-4">
                                                {row.assignedCourses.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {row.assignedCourses.map(c => (
                                                            <span key={c.id} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                                {c.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 italic text-xs">- Yok -</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-bold ${row.uniqueStudentCount > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                                                    {row.uniqueStudentCount}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => setModalConfig({ session: row.session, department: row.department })}
                                                    className="bg-orange-50 text-orange-600 hover:bg-orange-100 p-2 rounded-lg transition-colors"
                                                    title="Ders Ekle"
                                                >
                                                    <BookOpenIcon className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {tableRows.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                                Bu sınavın oturumlarına henüz bölüm eklenmemiş. <br/>
                                                Lütfen önce "Sınav-Oturum" sayfasından oturumlara bölüm atayınız.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                             </table>
                         </div>
                    </div>

                    {modalConfig && (
                        <AssignCoursesModal
                            session={modalConfig.session}
                            department={modalConfig.department}
                            examCourses={examCourses.filter(ec => ec.examId === selectedExamId)}
                            allCourses={courses}
                            sessionCourses={sessionCourses}
                            allSessionsInExam={sessions.filter(s => s.examId === selectedExamId)}
                            onAdd={(courseId) => onAddSessionCourse(modalConfig.session.id, courseId)}
                            onRemove={(courseId) => onRemoveSessionCourse(modalConfig.session.id, courseId)}
                            onClose={() => setModalConfig(null)}
                        />
                    )}
                </>
            ) : (
                 <div className="flex flex-col items-center justify-center flex-1 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-12 mt-6">
                    <ClipboardListIcon className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-500">Lütfen işlem yapmak için yukarıdan bir sınav seçiniz.</h3>
                </div>
            )}
        </div>
    );
};

export default SessionCoursesPage;
