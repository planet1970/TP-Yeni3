
import React, { useState, useMemo, useRef } from 'react';
import { UploadIcon, UserGroupIcon, BookOpenIcon, EditIcon, TrashIcon } from '../components/icons';
import type { Exam, Course, ExamCourse, Student, StudentCourseRegistration } from '../types';

// Declare XLSX from global window object (loaded via CDN in index.html)
declare const XLSX: any;

interface StudentCourseRegistrationsPageProps {
    exams: Exam[];
    courses: Course[];
    examCourses: ExamCourse[];
    students: Student[];
    studentCourseRegistrations: StudentCourseRegistration[];
    onImportRegistrations: (students: Student[], registrations: Omit<StudentCourseRegistration, 'id'>[]) => void;
    onAddSingleRegistration: (student: Student, examId: string, courseId: string) => void;
    onRemoveRegistration: (examId: string, courseId: string, studentId: string) => void;
}

const StudentListModal: React.FC<{
    examId: string;
    course: { courseId: string; code: string; name: string };
    registrations: StudentCourseRegistration[];
    allStudents: Student[];
    onRemove: (studentId: string) => void;
    onAdd: (student: Student) => void;
    onClose: () => void;
}> = ({ examId, course, registrations, allStudents, onRemove, onAdd, onClose }) => {
    const [newStudentNumber, setNewStudentNumber] = useState('');
    const [newFirstName, setNewFirstName] = useState('');
    const [newLastName, setNewLastName] = useState('');
    const [error, setError] = useState('');

    // Filter students registered for this specific course and exam
    const courseStudentIds = new Set(
        registrations
            .filter(r => r.examId === examId && r.courseId === course.courseId)
            .map(r => r.studentId)
    );

    const registeredStudents = allStudents.filter(s => courseStudentIds.has(s.id));

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newStudentNumber || !newFirstName || !newLastName) {
            setError('Lütfen tüm alanları doldurunuz.');
            return;
        }

        const studentId = `ST-${newStudentNumber.trim()}`;

        // Check if student is already registered for THIS course
        if (courseStudentIds.has(studentId)) {
            setError('Bu öğrenci numarası zaten bu derse kayıtlı.');
            return;
        }
        
        // Check if student exists in global list (to reuse name if needed, but here we take form inputs as source of truth for update or new)
        // For simplicity, we pass the form data as the student object
        const studentObj: Student = {
            id: studentId,
            studentNumber: newStudentNumber.trim(),
            firstName: newFirstName.trim(),
            lastName: newLastName.trim()
        };

        onAdd(studentObj);
        setNewStudentNumber('');
        setNewFirstName('');
        setNewLastName('');
        setError('');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800">
                        Öğrenci Listesi: <span className="text-orange-600">{course.code} - {course.name}</span>
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                    {/* Left: List */}
                    <div className="flex-1 p-6 overflow-y-auto border-r border-gray-200">
                        <h4 className="font-semibold text-gray-700 mb-4 flex justify-between">
                            <span>Kayıtlı Öğrenciler</span>
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{registeredStudents.length}</span>
                        </h4>
                        {registeredStudents.length > 0 ? (
                            <ul className="divide-y divide-gray-100">
                                {registeredStudents.map(student => (
                                    <li key={student.id} className="py-3 flex justify-between items-center">
                                        <div>
                                            <p className="font-medium text-gray-900">{student.firstName} {student.lastName}</p>
                                            <p className="text-xs text-gray-500">{student.studentNumber}</p>
                                        </div>
                                        <button 
                                            onClick={() => onRemove(student.id)}
                                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded"
                                            title="Kaydı Sil"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400 italic text-center py-4">Bu derse kayıtlı öğrenci bulunmamaktadır.</p>
                        )}
                    </div>

                    {/* Right: Add Form */}
                    <div className="w-full md:w-1/3 p-6 bg-gray-50">
                        <h4 className="font-semibold text-gray-700 mb-4">Yeni Öğrenci Ekle</h4>
                        <form onSubmit={handleAddSubmit} className="space-y-3">
                            {error && <p className="text-xs text-red-500 bg-red-50 p-2 rounded">{error}</p>}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Öğrenci No</label>
                                <input 
                                    type="text" 
                                    value={newStudentNumber}
                                    onChange={(e) => setNewStudentNumber(e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                    placeholder="Örn: 2023001"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Ad</label>
                                <input 
                                    type="text" 
                                    value={newFirstName}
                                    onChange={(e) => setNewFirstName(e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                    placeholder="Örn: Ali"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Soyad</label>
                                <input 
                                    type="text" 
                                    value={newLastName}
                                    onChange={(e) => setNewLastName(e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                    placeholder="Örn: Yılmaz"
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium shadow-sm mt-2"
                            >
                                Ekle
                            </button>
                        </form>
                    </div>
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

const StudentCourseRegistrationsPage: React.FC<StudentCourseRegistrationsPageProps> = ({
    exams,
    courses,
    examCourses,
    students,
    studentCourseRegistrations,
    onImportRegistrations,
    onAddSingleRegistration,
    onRemoveRegistration
}) => {
    const [selectedExamId, setSelectedExamId] = useState<string>('');
    const [importStatus, setImportStatus] = useState<{ total: number, success: number, duplicates: number, message: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Modal State
    const [selectedCourseForModal, setSelectedCourseForModal] = useState<{ courseId: string; code: string; name: string } | null>(null);

    // Filter active exams
    const activeExams = useMemo(() => exams.filter(e => e.isActive), [exams]);

    const handleExamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedExamId(e.target.value);
        setImportStatus(null);
    };

    // Get list of courses assigned to selected exam with student counts
    const courseList = useMemo(() => {
        if (!selectedExamId) return [];

        // Get all courses assigned to this exam
        const examSpecificCourses = examCourses.filter(ec => ec.examId === selectedExamId);

        return examSpecificCourses.map(ec => {
            const course = courses.find(c => c.id === ec.courseId);
            // Count registrations for this specific course in this exam
            const studentCount = studentCourseRegistrations.filter(
                scr => scr.examId === selectedExamId && scr.courseId === ec.courseId
            ).length;

            return {
                courseId: ec.courseId,
                code: course?.code || 'Unknown',
                name: course?.name || 'Unknown',
                studentCount
            };
        });
    }, [selectedExamId, examCourses, courses, studentCourseRegistrations]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !selectedExamId) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const bstr = evt.target?.result;
                const workbook = XLSX.read(bstr, { type: 'binary' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                // Convert to array of arrays
                const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                processExcelData(data);
            } catch (error) {
                console.error("Error reading Excel file:", error);
                alert("Dosya okunamadı. Lütfen geçerli bir Excel dosyası yükleyin.");
            }
        };
        reader.readAsBinaryString(file);
        
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const processExcelData = (rows: any[][]) => {
        if (rows.length < 1) return;

        let successCount = 0;
        let duplicateCount = 0;
        const newStudents: Student[] = [];
        const newRegistrations: Omit<StudentCourseRegistration, 'id'>[] = [];
        
        // Map courses by code for fast lookup
        const validCourseCodes = new Map<string, string>();
        courseList.forEach(c => validCourseCodes.set(c.code.trim(), c.courseId));

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (!row || row.length < 4) continue;

            const studentNumber = String(row[0]).trim();
            const firstName = String(row[1]).trim();
            const lastName = String(row[2]).trim();
            const courseCode = String(row[3]).trim();

            // Basic validation
            if (!studentNumber || !courseCode) continue;
            if (studentNumber.toLowerCase().includes("öğrenci") || studentNumber.toLowerCase().includes("no")) continue;

            const courseId = validCourseCodes.get(courseCode);
            
            if (courseId) {
                const studentId = `ST-${studentNumber}`;
                
                // Check if duplicate registration already exists in STATE
                const isAlreadyRegistered = studentCourseRegistrations.some(r => 
                    r.examId === selectedExamId && 
                    r.courseId === courseId && 
                    r.studentId === studentId
                );

                // Check if duplicate registration already exists in CURRENT BATCH
                const isDuplicateInBatch = newRegistrations.some(r => 
                    r.courseId === courseId && 
                    r.studentId === studentId
                );

                if (isAlreadyRegistered || isDuplicateInBatch) {
                    duplicateCount++;
                    continue;
                }
                
                // Prepare Student Object (if not in batch)
                if (!newStudents.find(s => s.id === studentId)) {
                    newStudents.push({
                        id: studentId,
                        studentNumber,
                        firstName,
                        lastName
                    });
                }

                // Prepare Registration Object
                newRegistrations.push({
                    examId: selectedExamId,
                    courseId: courseId,
                    studentId: studentId
                });

                successCount++;
            }
        }

        if (successCount > 0) {
            onImportRegistrations(newStudents, newRegistrations);
        }

        setImportStatus({
            total: rows.length,
            success: successCount,
            duplicates: duplicateCount,
            message: `İşlem Tamamlandı. ${successCount} öğrenci eklendi. ${duplicateCount} tekrar eden kayıt atlandı.`
        });
    };

    const handleTriggerUpload = () => {
        fileInputRef.current?.click();
    };

    const handleOpenModal = (courseItem: typeof courseList[0]) => {
        setSelectedCourseForModal(courseItem);
    };

    return (
        <div className="container mx-auto h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <UserGroupIcon className="h-8 w-8 mr-2 text-orange-500" />
                    Ders - Öğrenci Kayıt Yönetimi
                </h2>
            </div>

            {/* Exam Selection */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex-1">
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
                    
                    <div>
                        <input 
                            type="file" 
                            accept=".xlsx, .xls" 
                            ref={fileInputRef} 
                            className="hidden" 
                            onChange={handleFileUpload}
                        />
                        <button 
                            onClick={handleTriggerUpload}
                            disabled={!selectedExamId}
                            className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed w-full md:w-auto"
                        >
                            <UploadIcon className="h-5 w-5 mr-2" />
                            Excel'den Öğrenci Ekle
                        </button>
                    </div>
                </div>
                
                {importStatus && (
                    <div className={`mt-4 p-4 rounded-md border ${importStatus.success > 0 ? 'bg-green-50 border-green-200 text-green-800' : 'bg-yellow-50 border-yellow-200 text-yellow-800'}`}>
                        <p className="font-medium">{importStatus.message}</p>
                    </div>
                )}
            </div>

            {/* Course List with Student Counts */}
            {selectedExamId ? (
                <>
                    <div className="bg-white rounded-xl shadow-md flex-1 overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800">Ders Listesi ve Öğrenci Sayıları</h3>
                        </div>
                        <div className="overflow-auto flex-1">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-3">Ders Kodu</th>
                                        <th className="px-6 py-3">Ders Adı</th>
                                        <th className="px-6 py-3 text-center">Kayıtlı Öğrenci Sayısı</th>
                                        <th className="px-6 py-3 text-right">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courseList.map((course) => (
                                        <tr key={course.courseId} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{course.code}</td>
                                            <td className="px-6 py-4">{course.name}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-bold ${course.studentCount > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'}`}>
                                                    {course.studentCount}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => handleOpenModal(course)}
                                                    className="p-2 rounded-md text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors" 
                                                    title="Öğrenci Listesini Düzenle"
                                                >
                                                    <EditIcon className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {courseList.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                                                Bu sınav için tanımlanmış ders bulunmamaktadır. Lütfen önce "Sınav-Ders" menüsünden ders ekleyiniz.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Student Management Modal */}
                    {selectedCourseForModal && (
                        <StudentListModal 
                            examId={selectedExamId}
                            course={selectedCourseForModal}
                            registrations={studentCourseRegistrations}
                            allStudents={students}
                            onRemove={(studentId) => onRemoveRegistration(selectedExamId, selectedCourseForModal.courseId, studentId)}
                            onAdd={(student) => onAddSingleRegistration(student, selectedExamId, selectedCourseForModal.courseId)}
                            onClose={() => setSelectedCourseForModal(null)}
                        />
                    )}
                </>
            ) : (
                 <div className="flex flex-col items-center justify-center flex-1 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-12 mt-6">
                    <BookOpenIcon className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-500">Öğrenci kayıtlarını yönetmek için yukarıdan bir sınav seçiniz.</h3>
                </div>
            )}
        </div>
    );
};

export default StudentCourseRegistrationsPage;
