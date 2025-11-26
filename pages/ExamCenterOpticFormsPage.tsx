
import React, { useState, useMemo } from 'react';
import { PrinterIcon, CheckCircleIcon, QrCodeIcon, DocumentArrowDownIcon } from '../components/icons';
import type { Exam, Session, Department, Hall, Student, SessionDepartment, SessionHall, SessionCourse, Course, StudentHallAssignment, StudentCourseRegistration, Attendant, AttendantAssignment, HallListPrintStatus } from '../types';
import { jsPDF } from 'jspdf';

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
        setSelectedReport({
            session,
            department,
            hall,
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

    // Helper to convert Turkish chars to ASCII approximation for standard fonts
    const tr = (text: string) => {
        return text
            .replace(/Ğ/g, "G").replace(/ğ/g, "g")
            .replace(/Ü/g, "U").replace(/ü/g, "u")
            .replace(/Ş/g, "S").replace(/ş/g, "s")
            .replace(/İ/g, "I").replace(/ı/g, "i")
            .replace(/Ö/g, "O").replace(/ö/g, "o")
            .replace(/Ç/g, "C").replace(/ç/g, "c");
    };

    const handleGeneratePDF = (session: Session, department: Department, hall: Hall, coursesList: Course[]) => {
        const assignedStudentIds = studentHallAssignments
            .filter(sha => 
                sha.sessionId === session.id && 
                sha.departmentId === department.id && 
                sha.hallId === hall.id
            )
            .map(sha => sha.studentId);

        const assignedStudents = students
            .filter(s => assignedStudentIds.includes(s.id))
            .sort((a, b) => a.studentNumber.localeCompare(b.studentNumber));

        if (assignedStudents.length === 0) {
            alert('Bu salonda öğrenci bulunmamaktadır.');
            return;
        }

        const exam = exams.find(e => e.id === session.examId);
        const doc = new jsPDF({ unit: 'mm', format: 'a4' });
        
        assignedStudents.forEach((student, index) => {
            if (index > 0) doc.addPage();

            // --- 1. HEADER ---
            doc.setFont("helvetica", "normal");
            doc.setTextColor(249, 115, 22); // Orange
            doc.setFontSize(14); 
            doc.text(tr("TRAKYA UNIVERSITESI"), 105, 18, { align: 'center' });
            
            doc.setTextColor(0, 0, 0); // Black
            doc.setFontSize(10);
            doc.text(tr((exam?.name || "").toUpperCase()), 105, 24, { align: 'center' });

            // --- 2. STUDENT NUMBER (Top Right Grid) ---
            // Adjusted to fit the grid on the right
            const snBoxX = 153.5; 
            const snBoxY = 34;
            const snGap = 4.7; 
            const snVGap = 4.7; 
            
            const studentNumStr = student.studentNumber.padEnd(10, ' ');
            
            for (let col = 0; col < 10; col++) {
                const char = studentNumStr[col] || '';
                const xPos = snBoxX + (col * snGap);
                
                // Digit
                doc.setFontSize(9);
                doc.setTextColor(0);
                doc.text(char, xPos + 1.75, snBoxY + 3, { align: 'center' });

                // Filled Bubbles Only
                for (let row = 0; row < 10; row++) {
                    const isFilled = char === String(row);
                    if (isFilled) {
                        const yPos = snBoxY + 8.5 + (row * snVGap); 
                        const centerX = xPos + 1.75;
                        
                        doc.setFillColor(0); 
                        doc.circle(centerX, yPos, 1.6, 'F'); 
                    }
                }
            }

            // --- 3. SALON / SIRA NO (RED BOX - 1. Kutu) ---
            // X: ~112mm (Indent from the checkboxes area)
            // Y: Starts around 35-36mm
            const infoBoxX = 112; 
            const salonY = 36;  
            const siraY = 42;
            
            doc.setFontSize(9); 
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0);
            
            // Value only (Labels are pre-printed)
            doc.text(tr(hall.name), infoBoxX + 20, salonY); 
            doc.text(String(index + 1), infoBoxX + 20, siraY);

            // --- 4. IDENTITY INFO (BLUE BOX - 2. Kutu) ---
            // Y: Starts around 53-54mm
            const numaraY = 54;
            const adiY = 60;
            const soyadiY = 66;
            const bolumuY = 72;
            
            doc.text(student.studentNumber, infoBoxX + 20, numaraY); 
            doc.text(tr(student.firstName), infoBoxX + 20, adiY); 
            doc.text(tr(student.lastName), infoBoxX + 20, soyadiY); 
            
            doc.setFontSize(7); 
            const splitDept = doc.splitTextToSize(tr(department.name), 60);
            doc.text(splitDept, infoBoxX + 20, bolumuY); 

            // --- 5. COURSE COLUMNS (Bottom) ---
            const colStartY = 114; 
            const colWidth = 35.6; 
            const colGap = 2; 
            const leftMargin = 10; 
            
            coursesList.slice(0, 5).forEach((course, cIdx) => {
                const colX = leftMargin + (cIdx * (colWidth + colGap));
                const centerX = colX + (colWidth / 2);

                doc.setFontSize(8);
                doc.setFont("helvetica", "normal");
                doc.setTextColor(0);
                doc.text(course.code, centerX, colStartY, { align: 'center' });
                
                doc.setFontSize(6);
                const splitName = doc.splitTextToSize(tr(course.name), colWidth - 4);
                doc.text(splitName, centerX, colStartY + 4, { align: 'center' });
            });
        });

        doc.save(`OptikFormlar_${session.name}_${hall.name}.pdf`);
    };

    const isPrinted = (sessionId: string, departmentId: string, hallId: string) => {
        return hallListPrintStatuses.some(s => s.sessionId === sessionId && s.departmentId === departmentId && s.hallId === hallId && s.isPrinted);
    };

    // --- RENDER REPORT VIEW ---
    if (selectedReport) {
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
                            onClick={() => handleGeneratePDF(selectedReport.session, selectedReport.department, selectedReport.hall, selectedReport.courses)}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-bold flex items-center transition-colors shadow-sm"
                        >
                            <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                            PDF Hazırla
                        </button>
                        <button 
                            onClick={handlePrint}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold flex items-center transition-colors shadow-sm"
                        >
                            <PrinterIcon className="h-5 w-5 mr-2" />
                            Raporla / Yazdır
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

                {/* Report Content - Placeholder for screen */}
                <div className="p-8 print:p-0 flex justify-center">
                    <div className="w-[210mm] h-[297mm] border-2 border-gray-300 bg-white shadow-lg flex items-center justify-center text-gray-400 flex-col">
                        <QrCodeIcon className="h-16 w-16 mb-4 opacity-50" />
                        <p className="font-bold text-lg">Optik Form Baskı Önizleme</p>
                        <p className="text-sm mt-2">Formları indirmek için "PDF Hazırla" butonunu kullanınız.</p>
                        <p className="text-xs mt-4 text-gray-400">Bu ekran sadece bilgilendirme amaçlıdır. Yazdırma işlemi PDF üzerinden yapılmalıdır.</p>
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
                                                                                Hazırlandı
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="mb-3 text-xs text-gray-500">Kapasite: {hall.capacity}</div>
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
