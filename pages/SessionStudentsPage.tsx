
import React, { useState, useMemo, useEffect } from 'react';
import { IdentificationIcon, ChevronDownIcon, ChevronRightIcon } from '../components/icons';
import type { Exam, Session, Department, Hall, Student, SessionDepartment, SessionHall, SessionCourse, Course, StudentHallAssignment, StudentCourseRegistration } from '../types';

interface SessionStudentsPageProps {
    exams: Exam[];
    sessions: Session[];
    departments: Department[];
    halls: Hall[];
    students: Student[];
    courses: Course[];
    sessionDepartments: SessionDepartment[];
    sessionHalls: SessionHall[];
    sessionCourses: SessionCourse[];
    studentCourseRegistrations: StudentCourseRegistration[];
    studentHallAssignments: StudentHallAssignment[];
    onSaveAssignments: (assignments: StudentHallAssignment[]) => void;
}

const PlacementModal: React.FC<{
    session: Session;
    department: Department;
    studentCount: number;
    studentsList: Student[];
    assignedHalls: Hall[];
    existingAssignments: StudentHallAssignment[];
    allStudents: Student[];
    onSave: (assignments: StudentHallAssignment[]) => void;
    onClose: () => void;
}> = ({ session, department, studentCount, studentsList, assignedHalls, existingAssignments, allStudents, onSave, onClose }) => {
    const [distributions, setDistributions] = useState<Record<string, number>>({});
    const [placements, setPlacements] = useState<Record<string, Student[]>>({});
    const [isPlaced, setIsPlaced] = useState(false);
    const [expandedHallId, setExpandedHallId] = useState<string | null>(null);

    // Helper to calculate proportional distribution
    const calculateProportionalDistribution = () => {
        const totalCapacity = assignedHalls.reduce((sum, h) => sum + h.capacity, 0);
        if (totalCapacity === 0) return {};

        const newDist: Record<string, number> = {};
        let assignedSoFar = 0;
        
        assignedHalls.forEach((hall, index) => {
            if (index === assignedHalls.length - 1) {
                 // Last hall gets the remainder
                 newDist[hall.id] = Math.max(0, studentCount - assignedSoFar);
            } else {
                const count = Math.floor((hall.capacity / totalCapacity) * studentCount);
                newDist[hall.id] = count;
                assignedSoFar += count;
            }
        });
        return newDist;
    };

    // Initialize distributions on mount
    useEffect(() => {
        // If we already have existing assignments, use them
        if (existingAssignments.length > 0) {
            const savedPlacements: Record<string, Student[]> = {};
            const savedDistributions: Record<string, number> = {};

            assignedHalls.forEach(hall => {
                const hallAssignments = existingAssignments.filter(a => a.hallId === hall.id);
                savedDistributions[hall.id] = hallAssignments.length;
                
                const assignedStudentIds = hallAssignments.map(a => a.studentId);
                savedPlacements[hall.id] = allStudents.filter(s => assignedStudentIds.includes(s.id));
            });

            setDistributions(savedDistributions);
            setPlacements(savedPlacements);
            setIsPlaced(true);
        } else {
            // Initial Proportional Distribution
            setDistributions(calculateProportionalDistribution());
        }
    }, [assignedHalls, studentCount, existingAssignments, allStudents]);

    const handleDistributionChange = (hallId: string, value: string) => {
        const num = parseInt(value) || 0;
        setDistributions(prev => ({ ...prev, [hallId]: num }));
        setIsPlaced(false); // Reset placement if numbers change
    };

    const getTotalDistributed = () => {
        return Object.values(distributions).reduce((sum: number, val: number) => sum + val, 0);
    };

    const totalDistributed = getTotalDistributed();
    const isValidTotal = totalDistributed === studentCount;

    const handlePlaceStudents = () => {
        if (!isValidTotal) return;

        // Fisher-Yates Shuffle
        const shuffled = [...studentsList];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        const newPlacements: Record<string, Student[]> = {};
        let offset = 0;

        assignedHalls.forEach(hall => {
            const count = distributions[hall.id] || 0;
            newPlacements[hall.id] = shuffled.slice(offset, offset + count);
            offset += count;
        });

        setPlacements(newPlacements);
        setIsPlaced(true);
    };

    const handleReset = () => {
        if (window.confirm("Yerleşimi sıfırlamak üzeresiniz. Mevcut atamalar temizlenecek ve salon öğrenci sayıları varsayılan kapasite oranlarına dönecektir. Onaylıyor musunuz?")) {
            // Reset assignments completely
            setDistributions(calculateProportionalDistribution());
            setPlacements({});
            setIsPlaced(false);
            setExpandedHallId(null);
        }
    };

    const handleSave = () => {
        // Convert placements to flat assignment list
        const assignments: StudentHallAssignment[] = [];
        
        (Object.entries(placements) as [string, Student[]][]).forEach(([hallId, students]) => {
            students.forEach(student => {
                assignments.push({
                    id: `SHA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    sessionId: session.id,
                    departmentId: department.id,
                    hallId: hallId,
                    studentId: student.id
                });
            });
        });

        onSave(assignments);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
                 <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Öğrenci Yerleştirme</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {session.name} - <span className="font-medium text-orange-600">{department.name}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    <div className="mb-6 flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                        <div>
                            <span className="text-sm text-gray-500">Toplam Öğrenci</span>
                            <p className="text-xl font-bold">{studentCount}</p>
                        </div>
                        <div className="text-right">
                            <span className="text-sm text-gray-500">Dağıtılan</span>
                            <p className={`text-xl font-bold ${isValidTotal ? 'text-green-600' : 'text-red-500'}`}>
                                {totalDistributed}
                            </p>
                            {!isValidTotal && (
                                <span className="text-xs text-red-500 font-medium">
                                    {totalDistributed < studentCount ? `${Number(studentCount) - Number(totalDistributed)} Eksik` : `${Number(totalDistributed) - Number(studentCount)} Fazla`}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {assignedHalls.map(hall => (
                            <div key={hall.id} className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        <div className="bg-blue-100 p-2 rounded-md mr-3">
                                            <IdentificationIcon className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">{hall.name}</h4>
                                            <span className="text-xs text-gray-500">Kapasite: {hall.capacity}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <label className="text-xs font-medium text-gray-600">Öğrenci Sayısı:</label>
                                        <input
                                            type="number"
                                            min="0"
                                            disabled={isPlaced} // Disable edit if placed, force Reset first
                                            value={distributions[hall.id] || 0}
                                            onChange={(e) => handleDistributionChange(hall.id, e.target.value)}
                                            className={`w-20 px-2 py-1 border rounded text-center focus:ring-orange-500 focus:border-orange-500 ${isPlaced ? 'bg-gray-100' : ''}`}
                                        />
                                    </div>
                                </div>

                                {isPlaced && placements[hall.id] && (
                                    <div className="mt-3 border-t pt-2">
                                        <button 
                                            onClick={() => setExpandedHallId(expandedHallId === hall.id ? null : hall.id)}
                                            className="flex items-center text-xs text-gray-500 hover:text-gray-700 w-full"
                                        >
                                            {expandedHallId === hall.id ? <ChevronDownIcon className="h-4 w-4 mr-1"/> : <ChevronRightIcon className="h-4 w-4 mr-1"/>}
                                            Atanan Öğrenciler ({placements[hall.id].length})
                                        </button>
                                        
                                        {expandedHallId === hall.id && (
                                            <ul className="mt-2 text-sm space-y-1 bg-gray-50 p-2 rounded max-h-40 overflow-y-auto">
                                                {placements[hall.id].map(s => (
                                                    <li key={s.id} className="flex justify-between">
                                                        <span>{s.studentNumber}</span>
                                                        <span>{s.firstName} {s.lastName}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end space-x-3">
                     <button 
                        onClick={onClose}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                        İptal
                    </button>
                    
                    {isPlaced && (
                         <button 
                            onClick={handleReset}
                            className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg hover:bg-yellow-200 transition-colors font-medium"
                        >
                            Sıfırla
                        </button>
                    )}

                    {!isPlaced && (
                        <button 
                            onClick={handlePlaceStudents}
                            disabled={!isValidTotal}
                            className={`px-6 py-2 rounded-lg font-medium transition-colors shadow-sm ${
                                isValidTotal ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            Yerleştir
                        </button>
                    )}
                    
                    {isPlaced && (
                         <button 
                            onClick={handleSave}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm font-medium"
                        >
                            Tamam (Kaydet)
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const SessionStudentsPage: React.FC<SessionStudentsPageProps> = ({
    exams,
    sessions,
    departments,
    halls,
    students,
    courses,
    sessionDepartments,
    sessionHalls,
    sessionCourses,
    studentCourseRegistrations,
    studentHallAssignments,
    onSaveAssignments
}) => {
    const [selectedExamId, setSelectedExamId] = useState<string>('');
    
    // Modal State
    const [modalConfig, setModalConfig] = useState<{ 
        session: Session, 
        department: Department, 
        studentCount: number,
        studentsList: Student[],
        assignedHalls: Hall[]
    } | null>(null);

    const activeExams = useMemo(() => exams.filter(e => e.isActive), [exams]);

    const handleExamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedExamId(e.target.value);
    };

    // Helper: Get unique students and list of students
    const getStudentData = (sessionId: string, departmentId: string) => {
        const sessionCourseIds = sessionCourses
            .filter(sc => sc.sessionId === sessionId)
            .map(sc => sc.courseId);
        
        const relevantCourses = courses.filter(c => 
            sessionCourseIds.includes(c.id) && c.departmentId === departmentId
        );

        const uniqueStudentIds = new Set<string>();
        relevantCourses.forEach(course => {
            const registrations = studentCourseRegistrations.filter(r => 
                r.examId === selectedExamId && 
                r.courseId === course.id
            );
            registrations.forEach(r => uniqueStudentIds.add(r.studentId));
        });

        const uniqueStudentList = students.filter(s => uniqueStudentIds.has(s.id));
        return {
            count: uniqueStudentIds.size,
            list: uniqueStudentList
        };
    };

    const tableRows = useMemo(() => {
        if (!selectedExamId) return [];

        const examSessions = sessions
            .filter(s => s.examId === selectedExamId)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        const rows: {
            session: Session,
            department: Department,
            studentCount: number,
            studentsList: Student[],
            assignedHalls: Hall[],
            isPlaced: boolean
        }[] = [];

        examSessions.forEach(session => {
            const sessionDepts = sessionDepartments.filter(sd => sd.sessionId === session.id);
            
            sessionDepts.forEach(sd => {
                const dept = departments.find(d => d.id === sd.departmentId);
                if (dept) {
                    const { count, list } = getStudentData(session.id, dept.id);
                    
                    // Only show if there are students to place
                    if (count > 0) {
                        const assignedSessionHalls = sessionHalls.filter(sh => 
                            sh.sessionId === session.id && sh.departmentId === dept.id
                        );
                        const assignedHalls = assignedSessionHalls
                            .map(sh => halls.find(h => h.id === sh.hallId))
                            .filter((h): h is Hall => !!h);

                        // Check if assignments already exist
                        const isPlaced = studentHallAssignments.some(a => 
                            a.sessionId === session.id && a.departmentId === dept.id
                        );

                        rows.push({
                            session,
                            department: dept,
                            studentCount: count,
                            studentsList: list,
                            assignedHalls,
                            isPlaced
                        });
                    }
                }
            });
        });

        return rows;
    }, [selectedExamId, sessions, sessionDepartments, departments, sessionCourses, courses, studentCourseRegistrations, sessionHalls, halls, studentHallAssignments]);

    return (
        <div className="container mx-auto h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <IdentificationIcon className="h-8 w-8 mr-2 text-orange-500" />
                    Oturum - Öğrenci Yerleştirme
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
                                        <th scope="col" className="px-6 py-3 text-center">Öğrenci</th>
                                        <th scope="col" className="px-6 py-3">Salonlar / Kapasite</th>
                                        <th scope="col" className="px-6 py-3 text-right">İşlem</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {tableRows.map((row) => {
                                        const totalCapacity = row.assignedHalls.reduce((sum, h) => sum + h.capacity, 0);
                                        const isCapacityEnough = totalCapacity >= row.studentCount;

                                        return (
                                            <tr key={`${row.session.id}-${row.department.id}`} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-gray-900">{row.session.name}</td>
                                                <td className="px-6 py-4 text-orange-600 font-medium">{row.department.code}</td>
                                                <td className="px-6 py-4 text-center font-bold">{row.studentCount}</td>
                                                <td className="px-6 py-4">
                                                    {row.assignedHalls.length > 0 ? (
                                                        <div>
                                                            <div className="flex flex-wrap gap-1 mb-1">
                                                                {row.assignedHalls.map(h => (
                                                                    <span key={h.id} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                                                                        {h.name} ({h.capacity})
                                                                    </span>
                                                                ))}
                                                            </div>
                                                            <div className={`text-xs font-medium ${isCapacityEnough ? 'text-green-600' : 'text-red-600'}`}>
                                                                Top: {totalCapacity} ({isCapacityEnough ? 'Yeterli' : 'Yetersiz'})
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 italic text-xs">- Salon Yok -</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button 
                                                        onClick={() => setModalConfig({ 
                                                            session: row.session, 
                                                            department: row.department,
                                                            studentCount: row.studentCount,
                                                            studentsList: row.studentsList,
                                                            assignedHalls: row.assignedHalls
                                                        })}
                                                        disabled={!isCapacityEnough || row.assignedHalls.length === 0}
                                                        className={`p-2 rounded-lg transition-colors flex items-center ml-auto shadow-sm ${
                                                            row.isPlaced 
                                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                            : (!isCapacityEnough || row.assignedHalls.length === 0) 
                                                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                                : 'bg-orange-500 text-white hover:bg-orange-600'
                                                        }`}
                                                        title={row.isPlaced ? "Düzenle / Görüntüle" : "Öğrencileri Yerleştir"}
                                                    >
                                                        <span className="mr-2 text-xs font-semibold">
                                                            {row.isPlaced ? 'Yerleştirildi' : 'Yerleştir'}
                                                        </span>
                                                        <IdentificationIcon className="h-5 w-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {tableRows.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                                Bu sınav için öğrenci kaydı bulunan oturum listelenemedi. <br/>
                                                "Ders-Öğrenci" ve "Oturum-Salon" tanımlamalarını kontrol ediniz.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                             </table>
                         </div>
                    </div>

                    {modalConfig && (
                        <PlacementModal
                            session={modalConfig.session}
                            department={modalConfig.department}
                            studentCount={modalConfig.studentCount}
                            studentsList={modalConfig.studentsList}
                            assignedHalls={modalConfig.assignedHalls}
                            allStudents={students}
                            existingAssignments={studentHallAssignments.filter(a => 
                                a.sessionId === modalConfig.session.id && 
                                a.departmentId === modalConfig.department.id
                            )}
                            onSave={onSaveAssignments}
                            onClose={() => setModalConfig(null)}
                        />
                    )}
                </>
            ) : (
                 <div className="flex flex-col items-center justify-center flex-1 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-12 mt-6">
                    <IdentificationIcon className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-500">Lütfen işlem yapmak için yukarıdan bir sınav seçiniz.</h3>
                </div>
            )}
        </div>
    );
};

export default SessionStudentsPage;
