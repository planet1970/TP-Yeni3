import React, { useState, useMemo } from 'react';
import { PrinterIcon, CheckCircleIcon, QrCodeIcon, DocumentArrowDownIcon, DocumentPlusIcon } from '../components/icons';
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

const ExamCenterOpticFormsPage: React.FC<ExamCenterOpticFormsPageProps> = ({
    exams, sessions, departments, halls, courses, students,
    sessionDepartments, sessionHalls, sessionCourses,
    studentHallAssignments, hallListPrintStatuses, onMarkAsPrinted
}) => {
    const [selectedExamId, setSelectedExamId] = useState('');

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

    // --- GRID CONSTANTS (50 Rows x 70 Columns) ---
    // A4 Size: 210mm x 297mm
    const CELL_W = 210 / 70; // 3mm
    const CELL_H = 297 / 50; // 5.94mm

    // --- 1. OVERLAY PDF GENERATION (For Pre-Printed Forms) ---
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

            // --- 1. HEADER (Exam Name Only) ---
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0); 
            doc.setFontSize(10);
            // Centered at top, approx Row 5 (29mm)
            (doc as any).text(tr((exam?.name || "").toUpperCase()), 105, 5 * CELL_H, { align: 'center' });

            // --- 2. STUDENT NUMBER (Grid Based: 50x70) ---
            // Start Col: 38 (per request)
            // Digit Row: 9 (per request)
            const startCol = 38;
            const digitRow = 9;
            const bubbleStartRow = 10; // Bubbles start from row 10
            
            // Pad or truncate to exactly 10 digits
            const studentNumStr = student.studentNumber.padEnd(10, ' ').substring(0, 10);
            
            for (let i = 0; i < 10; i++) {
                const char = studentNumStr[i] || '';
                const digit = parseInt(char);
                
                // Calculate Center X of the cell
                const centerX = (startCol + i) * CELL_W + (CELL_W / 2);
                
                // Draw Digit at Row 9
                // Text Y is baseline, adjust slightly down (+4mm for vertical centering in ~6mm height)
                const digitY = digitRow * CELL_H + 4; 

                doc.setFontSize(9);
                doc.setTextColor(0, 0, 0);
                (doc as any).text(char, centerX, digitY, { align: 'center' });

                // Mark Bubble if digit is valid (0-9)
                // 0 -> Row 10, 1 -> Row 11 ...
                if (!isNaN(digit)) {
                    const bubbleRow = bubbleStartRow + digit;
                    const bubbleY = bubbleRow * CELL_H + (CELL_H / 2);
                    
                    doc.setFillColor(0, 0, 0); 
                    doc.circle(centerX, bubbleY, 1.6, 'F'); 
                }
            }

            // --- 3. IDENTITY INFO (Grid Based: 50x70) ---
            // Start Col: 25 (per request)
            // Rows: 13, 14, 15, 16, 17, 18 (per request order)
            const infoCol = 25;
            const infoX = infoCol * CELL_W;
            
            doc.setFontSize(8); // Match "Bolum" font size
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0);

            // Helper to print at specific row
            const printInfo = (text: string, row: number) => {
                (doc as any).text(text, infoX, row * CELL_H + 4);
            };

            // Row 13: Salon No
            printInfo(tr(hall.name), 13);
            
            // Row 14: Sira No
            printInfo(String(index + 1), 14);
            
            // Row 15: Ogrenci No
            printInfo(student.studentNumber, 15);

            // Row 16: Ad
            printInfo(tr(student.firstName), 16);

            // Row 17: Soyad
            printInfo(tr(student.lastName), 17);

            // Row 18: Bolum
            doc.setFontSize(7); 
            const splitDept = doc.splitTextToSize(tr(department.name), 70); // Limit width
            printInfo(splitDept, 18);


            // --- 4. COURSE COLUMNS (Bottom) ---
            // Start ~Row 20 (Adjust as needed for bottom area)
            const courseStartRow = 19;
            const colWidthCols = 12; // Width in grid cells
            const colGapCols = 1; 
            const startCourseCol = 3; 
            
            coursesList.slice(0, 5).forEach((course, cIdx) => {
                const currentCol = startCourseCol + (cIdx * (colWidthCols + colGapCols));
                const centerX = (currentCol * CELL_W) + ((colWidthCols * CELL_W) / 2);
                const startY = courseStartRow * CELL_H;

                doc.setFontSize(6); 
                doc.setFont("helvetica", "normal");
                doc.setTextColor(0, 0, 0);
                
                (doc as any).text(course.code, centerX, startY + 3, { align: 'center' });
                const splitName = doc.splitTextToSize(tr(course.name), (colWidthCols * CELL_W) - 4);
                (doc as any).text(splitName, centerX, startY + 6, { align: 'center' });
            });
        });

        doc.save(`${session.name} - ${hall.name}.pdf`);
        onMarkAsPrinted(session.id, department.id, hall.id);
    };

    // --- 2. FULL FORM GENERATION (For Blank Paper) ---
    const handleGenerateFullFormPDF = (session: Session, department: Department, hall: Hall, coursesList: Course[]) => {
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
            doc.setFont("helvetica", "bold");
            doc.setTextColor(249, 115, 22);
            doc.setFontSize(16);
            (doc as any).text(tr("TRAKYA UNIVERSITESI"), 105, 15, { align: 'center' });
            
            doc.setTextColor(100, 100, 100);
            doc.setFontSize(10);
            (doc as any).text(tr("SINAV UYGULAMA VE ARASTIRMA MERKEZI"), 105, 20, { align: 'center' });
            
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(12);
            (doc as any).text(tr((exam?.name || "").toUpperCase()), 105, 28, { align: 'center' });

            doc.setFontSize(14);
            doc.setTextColor(249, 115, 22);
            doc.text("CEVAP KAGIDI", 15, 35);

            // --- 2. STUDENT NUMBER GRID (Using similar grid logic) ---
            const startCol = 38;
            const digitRow = 9;
            const gridW = 10 * CELL_W; 
            const gridH = 11 * CELL_H; // Digits + 10 rows

            // Draw Box
            const boxX = startCol * CELL_W;
            const boxY = (digitRow - 1) * CELL_H; // Header area
            doc.setDrawColor(0);
            doc.rect(boxX, boxY, gridW, gridH + CELL_H);

            // Header
            doc.setFillColor(240, 240, 240);
            doc.rect(boxX, boxY, gridW, CELL_H, 'F');
            doc.setFontSize(8);
            doc.setTextColor(0, 0, 0);
            (doc as any).text("OGRENCI NUMARANIZ", boxX + (gridW/2), boxY + (CELL_H * 0.7), { align: 'center' });

            const studentNumStr = student.studentNumber.padEnd(10, ' ').substring(0, 10);
            
            for (let i = 0; i < 10; i++) {
                const char = studentNumStr[i] || '';
                const digit = parseInt(char);
                const colX = (startCol + i) * CELL_W;
                const centerX = colX + (CELL_W / 2);
                
                // Digit
                doc.rect(colX, digitRow * CELL_H, CELL_W, CELL_H);
                (doc as any).text(char, centerX, digitRow * CELL_H + 4, { align: 'center' });

                // Bubbles
                for (let j = 0; j < 10; j++) {
                    const bubbleRow = 10 + j;
                    const bubbleY = bubbleRow * CELL_H + (CELL_H/2);
                    
                    const isFilled = digit === j;
                    
                    if (isFilled) {
                        doc.setFillColor(0, 0, 0);
                        doc.circle(centerX, bubbleY, 1.6, 'F');
                    } else {
                        doc.setDrawColor(100);
                        doc.circle(centerX, bubbleY, 1.6, 'S');
                        doc.setFontSize(5);
                        doc.setTextColor(150, 150, 150);
                        (doc as any).text(String(j), centerX, bubbleY + 0.5, { align: 'center' });
                        doc.setTextColor(0, 0, 0);
                    }
                }
            }

            // --- 3. INFO BOXES ---
            const infoX = 15;
            const infoY = 40;
            doc.setDrawColor(200);
            doc.rect(infoX, infoY, 90, 35);
            doc.setFontSize(6);
            doc.setTextColor(150, 150, 150);
            (doc as any).text("DIKKAT! Bu alanda isaretleme yapmayiniz.", infoX + 45, infoY + 3, { align: 'center' });

            // Info Text (Full Form has explicit labels)
            const labelCol = 22;
            const valCol = 28;
            
            // Helper
            const printField = (label: string, val: string, r: number) => {
                doc.setFontSize(6);
                (doc as any).text(label, labelCol * CELL_W, r * CELL_H + 4);
                doc.setFontSize(8);
                (doc as any).text(val, valCol * CELL_W, r * CELL_H + 4);
            };
            
            printField("Salon:", tr(hall.name), 13);
            printField("Sira:", String(index + 1), 14);
            printField("No:", student.studentNumber, 15);
            printField("Ad:", tr(student.firstName), 16);
            printField("Soyad:", tr(student.lastName), 17);
            printField("Bolum:", tr(department.name).substring(0, 20), 18);

            // ... (Rest of Full Form Logic: Test Group, Sig, Courses) ...
            // Re-using simplified course draw for full form
             const courseStartRow = 25;
             coursesList.slice(0, 5).forEach((course, cIdx) => {
                const currentCol = 4 + (cIdx * 9);
                const colX = currentCol * CELL_W;
                const centerX = colX + (4 * CELL_W);
                const startY = courseStartRow * CELL_H;

                doc.rect(colX, startY, 8 * CELL_W, 4 * CELL_H);
                (doc as any).text(course.code, centerX, startY + 5, { align: 'center' });
                
                for(let q=1; q<=20; q++) {
                    doc.text(`${q}`, colX, startY + 20 + (q*5));
                }
             });
        });

        doc.save(`TamOptikForm_${session.name}_${hall.name}.pdf`);
        onMarkAsPrinted(session.id, department.id, hall.id);
    };

    const isPrinted = (sessionId: string, departmentId: string, hallId: string) => {
        return hallListPrintStatuses.some(s => s.sessionId === sessionId && s.departmentId === departmentId && s.hallId === hallId && s.isPrinted);
    };

    return (
        <div className="container mx-auto h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <QrCodeIcon className="h-8 w-8 mr-2 text-orange-500" />
                    Sınav Merkezi - Optik Formlar
                </h2>
            </div>

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
                                                        {deptItem.halls.map(currentHall => {
                                                            const printed = isPrinted(item.session.id, deptItem.dept.id, currentHall.id);
                                                            return (
                                                                <li key={currentHall.id} className="bg-white border rounded-md p-3 hover:shadow-md transition-shadow">
                                                                    <div className="flex justify-between items-center mb-2">
                                                                        <span className="font-bold text-lg text-gray-800">{currentHall.name}</span>
                                                                        {printed && (
                                                                            <div className="flex items-center text-xs font-bold bg-green-50 px-2 py-1 rounded-full text-green-600 border border-green-100">
                                                                                <CheckCircleIcon className="h-3 w-3 mr-1" />
                                                                                Hazırlandı
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="mb-3 text-xs text-gray-500">Kapasite: {currentHall.capacity}</div>
                                                                    
                                                                    <div className="flex flex-col gap-2">
                                                                        <button
                                                                            onClick={() => handleGeneratePDF(item.session, deptItem.dept, currentHall, deptItem.courses)}
                                                                            className="w-full flex justify-center items-center px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 font-medium text-sm transition-colors"
                                                                        >
                                                                            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                                                                            PDF Hazırla (Baskı)
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleGenerateFullFormPDF(item.session, deptItem.dept, currentHall, deptItem.courses)}
                                                                            className="w-full flex justify-center items-center px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 font-medium text-sm transition-colors"
                                                                        >
                                                                            <DocumentPlusIcon className="h-4 w-4 mr-2" />
                                                                            Tam Optik Form Oluştur
                                                                        </button>
                                                                    </div>
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