
import React, { useState, useMemo } from 'react';
import { PrinterIcon, CheckCircleIcon, QrCodeIcon } from '../components/icons';
import type { Exam, Session, Department, Hall, Student, SessionDepartment, SessionHall, SessionCourse, Course, StudentHallAssignment, StudentCourseRegistration, Attendant, AttendantAssignment, HallListPrintStatus } from '../types';

interface ExamCenterOpticFormsPageProps {
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
    students: Student[];
    courses: Course[];
}

const ExamCenterOpticFormsPage: React.FC<ExamCenterOpticFormsPageProps> = ({
    exams, sessions, departments, halls, courses, students,
    sessionDepartments, sessionHalls, sessionCourses,
    studentHallAssignments, hallListPrintStatuses, onMarkAsPrinted
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
                
                // Find Courses assigned to this Session AND Department
                const relevantCourses = courses.filter(c => {
                    const inSession = sessionCourses.some(sc => sc.sessionId === session.id && sc.courseId === c.id);
                    return inSession && c.departmentId === dept.id;
                });

                return { dept, halls: relevantHalls, courses: relevantCourses };
            });

            return { session, depts: deptData };
        });
    }, [selectedExamId, sessions, sessionDepartments, departments, sessionHalls, halls, sessionCourses, courses]);

    const handleShowReport = (session: Session, department: Department, hall: Hall, coursesList: Course[]) => {
        // Get Students assigned to this specific Hall for this Session & Department
        const relevantAssignments = studentHallAssignments.filter(sha => 
            sha.sessionId === session.id && 
            sha.departmentId === department.id && 
            sha.hallId === hall.id
        );
        
        const assignedStudents = relevantAssignments
            .map(sha => students.find(s => s.id === sha.studentId))
            .filter((s): s is Student => !!s)
            .sort((a, b) => a.studentNumber.localeCompare(b.studentNumber));

        setSelectedReport({
            session,
            department,
            hall,
            students: assignedStudents,
            courses: coursesList
        });
    };

    const handlePrint = () => {
        window.print();
    };

    const handleComplete = () => {
        if (selectedReport) {
            onMarkAsPrinted(selectedReport.session.id, selectedReport.department.id, selectedReport.hall.id);
            setSelectedReport(null);
        }
    };

    const isPrinted = (sessionId: string, departmentId: string, hallId: string) => {
        return hallListPrintStatuses.some(s => s.sessionId === sessionId && s.departmentId === departmentId && s.hallId === hallId && s.isPrinted);
    };

    // --- RENDER REPORT VIEW ---
    if (selectedReport) {
        const exam = exams.find(e => e.id === selectedReport.session.examId);
        
        return (
            <div className="bg-gray-100 min-h-screen print:bg-white flex flex-col">
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

                {/* Report Content - Optic Forms */}
                <div className="p-8 print:p-0 print:w-full">
                    {selectedReport.students.length > 0 ? (
                        selectedReport.students.map((student) => (
                            <div key={student.id} className="bg-white w-[210mm] h-[297mm] mx-auto mb-8 relative shadow-lg print:shadow-none print:mb-0 print:break-after-page overflow-hidden font-sans text-black box-border border border-gray-200 print:border-none">
                                
                                {/* Trigger Marks (4 Corners) */}
                                <div className="absolute top-8 left-8 w-4 h-4 bg-black print:block"></div>
                                <div className="absolute top-8 right-8 w-4 h-4 bg-black print:block"></div>
                                <div className="absolute bottom-8 left-8 w-4 h-4 bg-black print:block"></div>
                                <div className="absolute bottom-8 right-8 w-4 h-4 bg-black print:block"></div>

                                {/* Content Container */}
                                <div className="p-12 h-full flex flex-col">
                                    
                                    {/* Header with Logo */}
                                    <div className="flex items-center justify-center mb-4 border-b-2 border-black pb-2">
                                        <img 
                                            src="https://cdn.trakya.edu.tr/images/logolar/tu_armasi_renkli_tr.png" 
                                            alt="Trakya Üniversitesi" 
                                            className="h-20 w-20 object-contain mr-4"
                                        />
                                        <div className="text-center">
                                            <h1 className="text-2xl font-bold uppercase">T.C. TRAKYA ÜNİVERSİTESİ</h1>
                                            <h2 className="text-lg font-semibold uppercase">{selectedReport.department.name}</h2>
                                            <h3 className="text-md font-medium uppercase mt-1">CEVAP KAĞIDI</h3>
                                        </div>
                                    </div>

                                    <div className="flex flex-row gap-8 mb-2">
                                        {/* LEFT SIDE: ID INFO - Moved up 2mm (mt-[-2mm] to pull up relative to flow) */}
                                        <div className="w-1/2 flex flex-col gap-3 -mt-[2mm]">
                                            <div className="border-2 border-black rounded-lg p-3 space-y-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold uppercase text-gray-600">Öğrenci Numarası</span>
                                                    <span className="font-mono text-lg font-bold tracking-widest">{student.studentNumber}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold uppercase text-gray-600">Adı</span>
                                                    <span className="font-bold text-base uppercase truncate">{student.firstName}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold uppercase text-gray-600">Soyadı</span>
                                                    <span className="font-bold text-base uppercase truncate">{student.lastName}</span>
                                                </div>
                                            </div>

                                            {/* Signature Area - Narrower */}
                                            <div className="border-2 border-black rounded-lg p-2 h-20 flex flex-col justify-between">
                                                <span className="text-[10px] font-bold uppercase text-center block">ÖĞRENCİ İMZASI</span>
                                                <span className="text-[9px] text-center text-gray-500 leading-tight block px-1">
                                                    Kitapçık türünü doğru kodladığımı ve bilgilerimin doğruluğunu onaylıyorum.
                                                </span>
                                            </div>
                                        </div>

                                        {/* RIGHT SIDE: CODING & INFO */}
                                        <div className="w-1/2 flex flex-col">
                                            {/* Student Number Coding - Moved down 2mm, No Border */}
                                            <div className="mt-[2mm] mb-3">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[10px] font-bold uppercase mb-1">Öğrenci Numarası Kodlama</span>
                                                    <div className="flex gap-1">
                                                        {student.studentNumber.split('').map((digit, idx) => (
                                                            <div key={idx} className="flex flex-col gap-[2px]">
                                                                <div className="w-5 h-6 border border-black flex items-center justify-center font-bold bg-gray-100 mb-[1px] text-xs">
                                                                    {digit}
                                                                </div>
                                                                {[0,1,2,3,4,5,6,7,8,9].map(num => (
                                                                    <div key={num} className={`w-5 h-5 rounded-full border border-black flex items-center justify-center text-[9px] ${String(num) === digit ? 'bg-black text-white' : ''}`}>
                                                                        {num}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Exam Info - Below coding area */}
                                            <div className="border-2 border-black rounded-lg p-2 bg-gray-50 text-xs space-y-1">
                                                <div className="flex justify-between"><span className="font-bold">Sınav:</span> <span className="truncate ml-2">{exam?.name}</span></div>
                                                <div className="flex justify-between"><span className="font-bold">Oturum:</span> <span>{selectedReport.session.name}</span></div>
                                                <div className="flex justify-between"><span className="font-bold">Tarih:</span> <span>{new Date(selectedReport.session.date).toLocaleString()}</span></div>
                                                <div className="flex justify-between"><span className="font-bold">Salon:</span> <span>{selectedReport.hall.name}</span></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* BOTTOM: COURSES (ANSWERS) - Moved down 3mm */}
                                    <div className="mt-[3mm] flex-1 border-t-2 border-black pt-4">
                                        <div className="grid grid-cols-4 gap-2 h-full">
                                            {selectedReport.courses.slice(0, 4).map((course) => (
                                                <div key={course.id} className="flex flex-col h-full">
                                                    <div className="font-bold text-[10px] text-center mb-1 border-b border-black pb-1 h-8 flex items-center justify-center leading-tight bg-gray-100 px-1">
                                                        {course.code}<br/>{course.name.substring(0, 15)}
                                                    </div>
                                                    <div className="flex-1 flex flex-col gap-[2px]">
                                                        {[...Array(20)].map((_, qIdx) => (
                                                            <div key={qIdx} className="flex items-center justify-between text-[9px]">
                                                                <span className="font-bold w-3 text-right mr-[2px]">{qIdx + 1}</span>
                                                                <div className="flex gap-[2px]">
                                                                    {['A','B','C','D','E'].map(opt => (
                                                                        <div key={opt} className="w-3.5 h-3.5 rounded-full border border-black flex items-center justify-center font-bold hover:bg-black hover:text-white cursor-pointer">
                                                                            {opt}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                            {/* Fill empty columns if less than 4 courses to maintain layout structure if needed, or just leave empty space */}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center p-10 bg-white rounded-xl shadow-md border border-gray-200 print:hidden">
                            <p className="text-gray-500 text-lg">Bu salonda kayıtlı öğrenci bulunamadı.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // --- SELECTION VIEW ---
    return (
        <div className="container mx-auto h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <QrCodeIcon className="h-8 w-8 mr-2 text-orange-500" />
                    Sınav Merkezi - Optik Formlar
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
                                                    <ul className="space-y-3">
                                                        {deptItem.halls.map(hall => {
                                                            const printed = isPrinted(item.session.id, deptItem.dept.id, hall.id);
                                                            return (
                                                                <li key={hall.id} className="bg-white border rounded-md p-3 hover:shadow-md transition-shadow">
                                                                    <div className="flex justify-between items-center mb-2">
                                                                        <span className="font-bold text-lg text-gray-800">{hall.name}</span>
                                                                        {printed && (
                                                                            <div className="flex items-center text-xs font-bold bg-green-50 px-2 py-1 rounded-full text-green-600 border border-green-100">
                                                                                <CheckCircleIcon className="h-3 w-3 mr-1" />
                                                                                Yazdırıldı
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    
                                                                    <div className="mb-3 text-xs text-gray-500">
                                                                        Kapasite: {hall.capacity}
                                                                    </div>

                                                                    <button
                                                                        onClick={() => handleShowReport(item.session, deptItem.dept, hall, deptItem.courses)}
                                                                        className="w-full flex justify-center items-center px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 font-medium text-sm transition-colors"
                                                                    >
                                                                        <PrinterIcon className="h-4 w-4 mr-2" />
                                                                        Optik Formları Oluştur
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
                    <QrCodeIcon className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-500">İşlem yapmak için lütfen yukarıdan bir sınav seçiniz.</h3>
                </div>
            )}
        </div>
    );
};

export default ExamCenterOpticFormsPage;
