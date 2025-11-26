
import React, { useState, useMemo } from 'react';
import { PrinterIcon, CheckCircleIcon, ListBulletIcon, ChevronRightIcon } from '../components/icons';
import type { Exam, Session, Department, Hall, Student, SessionDepartment, SessionHall, SessionCourse, Course, StudentHallAssignment, StudentCourseRegistration, Attendant, AttendantAssignment, HallListPrintStatus } from '../types';

interface ExamCenterHallListsPageProps {
    exams: Exam[];
    sessions: Session[];
    departments: Department[];
    halls: Hall[];
    courses: Course[];
    students: Student[];
    sessionDepartments: SessionDepartment[];
    sessionHalls: SessionHall[];
    sessionCourses: SessionCourse[];
    studentCourseRegistrations: StudentCourseRegistration[];
    studentHallAssignments: StudentHallAssignment[];
    attendants: Attendant[];
    assignments: AttendantAssignment[];
    hallListPrintStatuses: HallListPrintStatus[];
    onMarkAsPrinted: (sessionId: string, departmentId: string, hallId: string) => void;
}

interface ReportData {
    session: Session;
    department: Department;
    hall: Hall;
    students: { no: number; studentNumber: string; firstName: string; lastName: string; signature: string }[];
    attendants: { role: string; name: string }[];
    courses: Course[];
}

const ExamCenterHallListsPage: React.FC<ExamCenterHallListsPageProps> = ({
    exams, sessions, departments, halls, courses, students,
    sessionDepartments, sessionHalls, sessionCourses, studentCourseRegistrations,
    studentHallAssignments, attendants, assignments, hallListPrintStatuses, onMarkAsPrinted
}) => {
    const [selectedExamId, setSelectedExamId] = useState('');
    const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);

    const activeExams = useMemo(() => exams.filter(e => e.isActive), [exams]);

    // Prepare the hierarchical list: Exam -> Session -> Department -> Hall
    const treeData = useMemo(() => {
        if (!selectedExamId) return [];

        const examSessions = sessions
            .filter(s => s.examId === selectedExamId)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return examSessions.map(session => {
            const relevantDepts = sessionDepartments
                .filter(sd => sd.sessionId === session.id)
                .map(sd => departments.find(d => d.id === sd.departmentId))
                .filter((d): d is Department => !!d);

            const deptData = relevantDepts.map(dept => {
                const relevantHalls = sessionHalls
                    .filter(sh => sh.sessionId === session.id && sh.departmentId === dept.id)
                    .map(sh => halls.find(h => h.id === sh.hallId))
                    .filter((h): h is Hall => !!h);
                
                return { dept, halls: relevantHalls };
            });

            return { session, depts: deptData };
        });
    }, [selectedExamId, sessions, sessionDepartments, departments, sessionHalls, halls]);

    const handleShowReport = (session: Session, department: Department, hall: Hall) => {
        // 1. Get Students in this Hall for this Session/Dept
        const assignedStudents = studentHallAssignments
            .filter(sha => sha.sessionId === session.id && sha.departmentId === department.id && sha.hallId === hall.id)
            .map(sha => students.find(s => s.id === sha.studentId))
            .filter((s): s is Student => !!s)
            .sort((a, b) => a.studentNumber.localeCompare(b.studentNumber))
            .map((s, idx) => ({
                no: idx + 1,
                studentNumber: s.studentNumber,
                firstName: s.firstName,
                lastName: s.lastName,
                signature: ''
            }));

        // 2. Get Attendants for this Hall (Salon Başkanı etc.)
        const relevantAssignments = assignments.filter(a => 
            a.sessionId === session.id && a.hallId === hall.id
        );
        const reportAttendants = relevantAssignments.map(a => {
            const att = attendants.find(at => at.id === a.attendantId);
            return {
                role: a.roleName,
                name: att ? `${att.title} ${att.firstName} ${att.lastName}` : '(Boş)'
            };
        });

        // 3. Get Courses for this Session/Dept
        const sessionCourseIds = sessionCourses
            .filter(sc => sc.sessionId === session.id)
            .map(sc => sc.courseId);
        const relevantCourses = courses.filter(c => 
            sessionCourseIds.includes(c.id) && c.departmentId === department.id
        );

        setSelectedReport({
            session,
            department,
            hall,
            students: assignedStudents,
            attendants: reportAttendants,
            courses: relevantCourses
        });
    };

    const handlePrint = () => {
        window.print();
    };

    const handleComplete = () => {
        if (selectedReport) {
            onMarkAsPrinted(selectedReport.session.id, selectedReport.department.id, selectedReport.hall.id);
            setSelectedReport(null); // Go back to list
        }
    };

    const isPrinted = (sessionId: string, departmentId: string, hallId: string) => {
        return hallListPrintStatuses.some(s => s.sessionId === sessionId && s.departmentId === departmentId && s.hallId === hallId && s.isPrinted);
    };

    // --- RENDER REPORT VIEW ---
    if (selectedReport) {
        const exam = exams.find(e => e.id === selectedReport.session.examId);
        
        return (
            <div className="bg-white min-h-screen print:bg-white flex flex-col">
                {/* Controls */}
                <div className="p-4 bg-gray-100 border-b flex justify-between items-center print:hidden sticky top-0 z-10 shadow-sm">
                    <button 
                        onClick={() => setSelectedReport(null)}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                    >
                        &larr; Geri Dön
                    </button>
                    <div className="flex space-x-3">
                        <button 
                            onClick={handlePrint}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold flex items-center transition-colors shadow-sm"
                        >
                            <PrinterIcon className="h-5 w-5 mr-2" />
                            Yazdır
                        </button>
                        <button 
                            onClick={handleComplete}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold flex items-center transition-colors shadow-sm"
                        >
                            <CheckCircleIcon className="h-5 w-5 mr-2" />
                            Tamamlandı
                        </button>
                    </div>
                </div>

                {/* Report Content - A4 Layout */}
                <div className="p-8 print:p-0 print:w-full">
                    <div className="border border-gray-400 p-4 print:border-none print:p-0">
                        
                        {/* Header Table */}
                        <table className="w-full border-collapse border border-black mb-4">
                            <tbody>
                                <tr>
                                    <td className="border border-black p-2 font-bold w-24 bg-gray-100 print:bg-transparent">Oturum:</td>
                                    <td className="border border-black p-2">
                                        {selectedReport.session.name}
                                        <span className="font-normal text-sm ml-2">
                                            ({new Date(selectedReport.session.date).toLocaleDateString()} - {new Date(selectedReport.session.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})})
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black p-2 font-bold bg-gray-100 print:bg-transparent">Bölüm:</td>
                                    <td className="border border-black p-2">{selectedReport.department.name}</td>
                                </tr>
                                <tr>
                                    <td className="border border-black p-2 font-bold bg-gray-100 print:bg-transparent">Sınıf:</td>
                                    <td className="border border-black p-2 font-bold text-lg">{selectedReport.hall.name}</td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Students Table */}
                        <table className="w-full border-collapse border border-black text-sm mb-8">
                            <thead>
                                <tr className="bg-gray-200 print:bg-gray-100">
                                    <th className="border border-black p-1 w-12 text-center">Sıra No</th>
                                    <th className="border border-black p-1 w-32">Öğrenci No</th>
                                    <th className="border border-black p-1 text-left">Adı</th>
                                    <th className="border border-black p-1 text-left">Soyadı</th>
                                    <th className="border border-black p-1 w-32">İmza</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedReport.students.map((student) => (
                                    <tr key={student.studentNumber} className="h-8">
                                        <td className="border border-black p-1 text-center font-bold">{student.no}</td>
                                        <td className="border border-black p-1 font-mono">{student.studentNumber}</td>
                                        <td className="border border-black p-1 uppercase">{student.firstName}</td>
                                        <td className="border border-black p-1 uppercase">{student.lastName}</td>
                                        <td className="border border-black p-1"></td>
                                    </tr>
                                ))}
                                {selectedReport.students.length === 0 && (
                                    <tr><td colSpan={5} className="border border-black p-4 text-center italic">Öğrenci bulunamadı.</td></tr>
                                )}
                                {/* Add extra rows to fill page if needed, or kept as dynamic */}
                                {[...Array(Math.max(0, 25 - selectedReport.students.length))].map((_, i) => (
                                    <tr key={`fill-${i}`} className="h-8">
                                        <td className="border border-black p-1 text-center">{selectedReport.students.length + i + 1}</td>
                                        <td className="border border-black p-1"></td>
                                        <td className="border border-black p-1"></td>
                                        <td className="border border-black p-1"></td>
                                        <td className="border border-black p-1"></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Footer / Attendants */}
                        <div className="flex justify-between items-end mt-12 pt-4 border-t-2 border-black">
                            {/* We usually need signatures for Salon Başkanı and Gözetmen */}
                            <div className="text-center w-1/3">
                                <div className="mb-8 font-bold">Salon Başkanı</div>
                                <div className="border-t border-black w-3/4 mx-auto"></div>
                            </div>
                            <div className="text-center w-1/3">
                                <div className="mb-8 font-bold">Gözetmen</div>
                                <div className="border-t border-black w-3/4 mx-auto"></div>
                            </div>
                            <div className="text-center w-1/3">
                                <div className="mb-8 font-bold">Gözetmen</div>
                                <div className="border-t border-black w-3/4 mx-auto"></div>
                            </div>
                        </div>

                        {/* Attendant Names if assigned (Optional display) */}
                        <div className="mt-4 text-xs text-gray-500">
                            Görevliler: {selectedReport.attendants.map(a => `${a.role}: ${a.name}`).join(', ')}
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    // --- SELECTION VIEW ---
    return (
        <div className="container mx-auto h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <ListBulletIcon className="h-8 w-8 mr-2 text-orange-500" />
                    Sınav Merkezi - Salon Listeleri
                </h2>
            </div>

            {/* Exam Selection */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Aktif Sınav Seçiniz</label>
                <select
                    value={selectedExamId}
                    onChange={(e) => setSelectedExamId(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                    <option value="">-- Sınav Seçiniz --</option>
                    {activeExams.map(e => (
                        <option key={e.id} value={e.id}>{e.name}</option>
                    ))}
                </select>
            </div>

            {selectedExamId ? (
                <div className="space-y-6 pb-10">
                    {treeData.map((item) => (
                        <div key={item.session.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                            <div className="bg-orange-50 px-6 py-3 border-b border-orange-100 flex justify-between items-center">
                                <h3 className="font-bold text-orange-800">{item.session.name}</h3>
                                <span className="text-sm text-orange-600">
                                    {new Date(item.session.date).toLocaleDateString()} {new Date(item.session.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                            
                            <div className="p-6">
                                {item.depts.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {item.depts.map((deptItem) => (
                                            <div key={deptItem.dept.id} className="border rounded-lg p-4 bg-gray-50">
                                                <h4 className="font-bold text-gray-700 mb-3 border-b pb-2">{deptItem.dept.name}</h4>
                                                
                                                {deptItem.halls.length > 0 ? (
                                                    <ul className="space-y-2">
                                                        {deptItem.halls.map(hall => {
                                                            const printed = isPrinted(item.session.id, deptItem.dept.id, hall.id);
                                                            return (
                                                                <li key={hall.id}>
                                                                    <button
                                                                        onClick={() => handleShowReport(item.session, deptItem.dept, hall)}
                                                                        className={`w-full flex justify-between items-center p-3 rounded-md border transition-all hover:shadow-sm ${
                                                                            printed 
                                                                            ? 'bg-green-50 border-green-200 text-green-800' 
                                                                            : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                                                                        }`}
                                                                    >
                                                                        <span className="font-bold">{hall.name}</span>
                                                                        {printed ? (
                                                                            <div className="flex items-center text-xs font-bold bg-white px-2 py-1 rounded-full shadow-sm text-green-600">
                                                                                <CheckCircleIcon className="h-3 w-3 mr-1" />
                                                                                Yazdırıldı
                                                                            </div>
                                                                        ) : (
                                                                            <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                                                                        )}
                                                                    </button>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                ) : (
                                                    <p className="text-xs text-gray-400 italic">Salon atanmamış.</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-4">Bu oturumda bölüm/salon ataması bulunamadı.</p>
                                )}
                            </div>
                        </div>
                    ))}
                    
                    {treeData.length === 0 && (
                        <div className="text-center p-10 bg-white rounded-xl shadow-md">
                            <p className="text-gray-500">Bu sınava ait oturum bulunamadı.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center flex-1 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-12">
                    <ListBulletIcon className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-500">İşlem yapmak için lütfen yukarıdan bir sınav seçiniz.</h3>
                </div>
            )}
        </div>
    );
};

export default ExamCenterHallListsPage;
