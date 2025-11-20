
import React, { useState, useMemo } from 'react';
import { HallIcon, TrashIcon } from '../components/icons';
import type { Exam, Session, Department, SessionDepartment, Hall, ExamHall, SessionCourse, StudentCourseRegistration, Course, SessionHall } from '../types';

interface SessionHallsPageProps {
    exams: Exam[];
    sessions: Session[];
    departments: Department[];
    halls: Hall[];
    courses: Course[];
    examHalls: ExamHall[];
    sessionDepartments: SessionDepartment[];
    sessionCourses: SessionCourse[];
    sessionHalls: SessionHall[];
    studentCourseRegistrations: StudentCourseRegistration[];
    onAddSessionHall: (sessionId: string, departmentId: string, hallId: string) => void;
    onRemoveSessionHall: (sessionId: string, departmentId: string, hallId: string) => void;
}

const AssignHallsModal: React.FC<{
    session: Session;
    department: Department;
    studentCount: number;
    availableHalls: Hall[]; // Halls from Exam-Hall pool
    assignedHalls: Hall[]; // Halls already assigned to this session-dept
    occupiedHallIds: string[]; // Halls assigned to OTHER depts in THIS session
    onAdd: (hallId: string) => void;
    onRemove: (hallId: string) => void;
    onClose: () => void;
}> = ({ session, department, studentCount, availableHalls, assignedHalls, occupiedHallIds, onAdd, onRemove, onClose }) => {
    
    // Calculate current total capacity
    const currentCapacity = assignedHalls.reduce((sum, hall) => sum + hall.capacity, 0);
    const isCapacitySufficient = currentCapacity >= studentCount;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Salon Atama</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {session.name} - <span className="font-medium text-orange-600">{department.name}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
                </div>

                {/* Info Bar */}
                <div className="px-6 py-4 bg-blue-50 border-b border-blue-100 grid grid-cols-2 gap-4">
                     <div>
                         <p className="text-xs text-gray-500 uppercase tracking-wider">Toplam Öğrenci Sayısı</p>
                         <p className="text-2xl font-bold text-gray-800">{studentCount}</p>
                     </div>
                     <div>
                         <p className="text-xs text-gray-500 uppercase tracking-wider">Toplam Salon Kapasitesi</p>
                         <div className="flex items-center">
                             <p className={`text-2xl font-bold mr-2 ${isCapacitySufficient ? 'text-green-600' : 'text-red-600'}`}>
                                 {currentCapacity}
                             </p>
                             {isCapacitySufficient ? (
                                 <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">Yeterli</span>
                             ) : (
                                 <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full font-medium">Yetersiz</span>
                             )}
                         </div>
                     </div>
                </div>

                {/* Progress Bar for Capacity */}
                <div className="w-full h-2 bg-gray-200">
                    <div 
                        className={`h-full transition-all duration-500 ${isCapacitySufficient ? 'bg-green-500' : 'bg-red-500'}`} 
                        style={{ width: `${Math.min((currentCapacity / (studentCount || 1)) * 100, 100)}%` }}
                    ></div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                     <h4 className="font-semibold text-gray-700 mb-3">Sınav İçin Tanımlanmış Uygun Salonlar</h4>
                     <div className="overflow-hidden border rounded-lg">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3">Salon Adı</th>
                                    <th className="px-4 py-3 text-center">Kat</th>
                                    <th className="px-4 py-3 text-center">Kapasite</th>
                                    <th className="px-4 py-3 text-right">Durum/İşlem</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {availableHalls.map(hall => {
                                    const isAssigned = assignedHalls.some(h => h.id === hall.id);
                                    const isOccupied = occupiedHallIds.includes(hall.id);

                                    return (
                                        <tr key={hall.id} className={`hover:bg-gray-50 ${isAssigned ? 'bg-blue-50' : isOccupied ? 'bg-gray-100 opacity-60' : 'bg-white'}`}>
                                            <td className="px-4 py-3 font-medium text-gray-900">
                                                {hall.name}
                                                {isOccupied && <span className="ml-2 text-xs text-red-500 font-normal">(Oturumda Dolu)</span>}
                                            </td>
                                            <td className="px-4 py-3 text-center">{hall.floor}</td>
                                            <td className="px-4 py-3 text-center font-semibold">{hall.capacity}</td>
                                            <td className="px-4 py-3 text-right">
                                                {isAssigned ? (
                                                    <button
                                                        onClick={() => onRemove(hall.id)}
                                                        className="text-red-600 font-medium text-xs bg-red-100 hover:bg-red-200 px-3 py-1 rounded transition-colors"
                                                    >
                                                        Çıkar
                                                    </button>
                                                ) : isOccupied ? (
                                                    <span className="text-gray-400 font-medium text-xs bg-gray-200 px-3 py-1 rounded cursor-not-allowed">
                                                        Kullanımda
                                                    </span>
                                                ) : (
                                                    <button 
                                                        onClick={() => onAdd(hall.id)}
                                                        className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded font-medium text-xs transition-colors"
                                                    >
                                                        Ekle
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {availableHalls.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                            Bu sınav için henüz salon tanımlanmamış. <br/>
                                            Lütfen "Sınav-Salon" sayfasından salon ekleyiniz.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                     </div>
                     
                     {!isCapacitySufficient && studentCount > 0 && availableHalls.length > 0 && (
                         <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
                             <strong>Dikkat:</strong> Seçilen salonların toplam kapasitesi öğrenci sayısını karşılamıyor. Lütfen daha fazla salon ekleyiniz.
                         </div>
                     )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end items-center space-x-3">
                    <button 
                        onClick={onClose}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                        Kapat
                    </button>
                    <button 
                        onClick={onClose}
                        disabled={!isCapacitySufficient && studentCount > 0}
                        className={`px-6 py-2 rounded-lg font-medium transition-colors shadow-sm ${
                            isCapacitySufficient || studentCount === 0
                            ? 'bg-orange-500 text-white hover:bg-orange-600' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        Tamam
                    </button>
                </div>
            </div>
        </div>
    );
};

const SessionHallsPage: React.FC<SessionHallsPageProps> = ({
    exams,
    sessions,
    departments,
    halls,
    courses,
    examHalls,
    sessionDepartments,
    sessionCourses,
    sessionHalls,
    studentCourseRegistrations,
    onAddSessionHall,
    onRemoveSessionHall
}) => {
    const [selectedExamId, setSelectedExamId] = useState<string>('');
    
    // Modal State
    const [modalConfig, setModalConfig] = useState<{ 
        session: Session, 
        department: Department, 
        studentCount: number 
    } | null>(null);

    const activeExams = useMemo(() => exams.filter(e => e.isActive), [exams]);

    const handleExamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedExamId(e.target.value);
    };

    // Helper to calculate unique students for a session-department pair
    const getUniqueStudentCount = (sessionId: string, departmentId: string) => {
        // 1. Find courses assigned to this session
        const sessionCourseIds = sessionCourses
            .filter(sc => sc.sessionId === sessionId)
            .map(sc => sc.courseId);
        
        // 2. Filter courses that belong to this department
        const relevantCourses = courses.filter(c => 
            sessionCourseIds.includes(c.id) && c.departmentId === departmentId
        );

        // 3. Count unique students registered to these courses for this exam
        const uniqueStudentIds = new Set<string>();
        relevantCourses.forEach(course => {
            const registrations = studentCourseRegistrations.filter(r => 
                r.examId === selectedExamId && 
                r.courseId === course.id
            );
            registrations.forEach(r => uniqueStudentIds.add(r.studentId));
        });

        return uniqueStudentIds.size;
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
            studentCount: number,
            assignedHalls: Hall[]
        }[] = [];

        examSessions.forEach(session => {
            const sessionDepts = sessionDepartments.filter(sd => sd.sessionId === session.id);
            
            sessionDepts.forEach(sd => {
                const dept = departments.find(d => d.id === sd.departmentId);
                if (dept) {
                    const studentCount = getUniqueStudentCount(session.id, dept.id);
                    
                    // Get Assigned Halls
                    const assignedSessionHalls = sessionHalls.filter(sh => 
                        sh.sessionId === session.id && sh.departmentId === dept.id
                    );
                    const assignedHalls = assignedSessionHalls
                        .map(sh => halls.find(h => h.id === sh.hallId))
                        .filter((h): h is Hall => !!h);

                    rows.push({
                        session,
                        department: dept,
                        studentCount,
                        assignedHalls
                    });
                }
            });
        });

        return rows;
    }, [selectedExamId, sessions, sessionDepartments, departments, sessionCourses, courses, studentCourseRegistrations, sessionHalls, halls]);

    return (
        <div className="container mx-auto h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <HallIcon className="h-8 w-8 mr-2 text-orange-500" />
                    Oturum - Salon Atama
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
                                        <th scope="col" className="px-6 py-3">Bölüm</th>
                                        <th scope="col" className="px-6 py-3 text-center">Öğrenci Sayısı</th>
                                        <th scope="col" className="px-6 py-3">Atanan Salonlar</th>
                                        <th scope="col" className="px-6 py-3 text-right">İşlem</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {tableRows.map((row, idx) => (
                                        <tr key={`${row.session.id}-${row.department.id}`} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{row.session.name}</td>
                                            <td className="px-6 py-4 text-orange-600 font-medium">{row.department.code}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-bold ${row.studentCount > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'}`}>
                                                    {row.studentCount}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {row.assignedHalls.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {row.assignedHalls.map(h => (
                                                            <span key={h.id} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                                                {h.name} ({h.capacity})
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 italic text-xs">- Atanmadı -</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => setModalConfig({ 
                                                        session: row.session, 
                                                        department: row.department,
                                                        studentCount: row.studentCount
                                                    })}
                                                    className="bg-orange-50 text-orange-600 hover:bg-orange-100 p-2 rounded-lg transition-colors flex items-center ml-auto"
                                                    title="Salon Ekle"
                                                >
                                                    <span className="mr-2 text-xs font-semibold">Salon Ekle</span>
                                                    <HallIcon className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {tableRows.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
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
                        <AssignHallsModal
                            session={modalConfig.session}
                            department={modalConfig.department}
                            studentCount={modalConfig.studentCount}
                            availableHalls={
                                // Filter halls that are assigned to this EXAM via ExamHalls
                                examHalls
                                    .filter(eh => eh.examId === selectedExamId)
                                    .map(eh => halls.find(h => h.id === eh.hallId))
                                    .filter((h): h is Hall => !!h)
                            }
                            assignedHalls={
                                // Halls currently assigned to this session-dept
                                sessionHalls
                                    .filter(sh => sh.sessionId === modalConfig.session.id && sh.departmentId === modalConfig.department.id)
                                    .map(sh => halls.find(h => h.id === sh.hallId))
                                    .filter((h): h is Hall => !!h)
                            }
                            occupiedHallIds={
                                // Halls assigned to ANY department in this session (EXCEPT current department)
                                sessionHalls
                                    .filter(sh => sh.sessionId === modalConfig.session.id && sh.departmentId !== modalConfig.department.id)
                                    .map(sh => sh.hallId)
                            }
                            onAdd={(hallId) => onAddSessionHall(modalConfig.session.id, modalConfig.department.id, hallId)}
                            onRemove={(hallId) => onRemoveSessionHall(modalConfig.session.id, modalConfig.department.id, hallId)}
                            onClose={() => setModalConfig(null)}
                        />
                    )}
                </>
            ) : (
                 <div className="flex flex-col items-center justify-center flex-1 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-12 mt-6">
                    <HallIcon className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-500">Lütfen işlem yapmak için yukarıdan bir sınav seçiniz.</h3>
                </div>
            )}
        </div>
    );
};

export default SessionHallsPage;
