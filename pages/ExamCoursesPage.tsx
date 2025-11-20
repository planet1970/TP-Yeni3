
import React, { useState, useMemo } from 'react';
import { TrashIcon, BookOpenIcon } from '../components/icons';
import type { Exam, School, Department, Course, ExamCourse } from '../types';

interface ExamCoursesPageProps {
    exams: Exam[];
    schools: School[];
    departments: Department[];
    courses: Course[];
    examCourses: ExamCourse[];
    onAddExamCourse: (examId: string, courseId: string, questionCount: number, duration: number) => void;
    onRemoveExamCourse: (examId: string, courseId: string) => void;
}

const AddCourseDetailsModal: React.FC<{
    course: Course;
    onSave: (questionCount: number, duration: number) => void;
    onClose: () => void;
}> = ({ course, onSave, onClose }) => {
    const [questionCount, setQuestionCount] = useState<number>(20);
    const [duration, setDuration] = useState<number>(30);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(questionCount, duration);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">Sınav Dersi Detayları</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="bg-gray-50 p-3 rounded-md mb-4 border border-gray-200">
                        <p className="text-sm text-gray-500">Seçilen Ders:</p>
                        <p className="font-semibold text-gray-800">{course.code} - {course.name}</p>
                    </div>

                    <div>
                        <label htmlFor="questionCount" className="block text-sm font-medium text-gray-700 mb-1">Soru Sayısı</label>
                        <input 
                            type="number" 
                            id="questionCount"
                            min="1"
                            value={questionCount}
                            onChange={(e) => setQuestionCount(parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Sınav Süresi (Dakika)</label>
                        <input 
                            type="number" 
                            id="duration"
                            min="1"
                            value={duration}
                            onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        >
                            İptal
                        </button>
                        <button 
                            type="submit"
                            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-sm font-medium"
                        >
                            Tamam
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


const ExamCoursesPage: React.FC<ExamCoursesPageProps> = ({
    exams,
    schools,
    departments,
    courses,
    examCourses,
    onAddExamCourse,
    onRemoveExamCourse,
}) => {
    const [selectedExamId, setSelectedExamId] = useState<string>('');
    const [selectedSchoolId, setSelectedSchoolId] = useState<string>('');
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');

    // Modal State
    const [courseToAdd, setCourseToAdd] = useState<Course | null>(null);

    // Filter only active exams for selection
    const activeExams = useMemo(() => exams.filter(e => e.isActive), [exams]);

    // Handlers
    const handleExamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedExamId(e.target.value);
    };

    const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSchoolId(e.target.value);
        setSelectedDepartmentId(''); // Reset department when school changes
    };

    const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDepartmentId(e.target.value);
    };

    // Filter Lists
    const availableDepartments = useMemo(() => {
        return departments.filter(d => d.schoolId === selectedSchoolId);
    }, [departments, selectedSchoolId]);

    const availableCourses = useMemo(() => {
        return courses.filter(c => c.departmentId === selectedDepartmentId);
    }, [courses, selectedDepartmentId]);

    // Courses already added to the selected exam
    const addedCoursesList = useMemo(() => {
        if (!selectedExamId) return [];
        const examCourseEntries = examCourses.filter(ec => ec.examId === selectedExamId);
        
        return examCourseEntries.map(ec => {
            const course = courses.find(c => c.id === ec.courseId);
            return {
                ...course,
                ...ec, // Includes id (ExamCourseId), questionCount, duration
                courseName: course?.name,
                courseCode: course?.code
            };
        }).filter(item => item.courseId); // Filter out undefined courses
    }, [examCourses, selectedExamId, courses]);

    // Check if a specific course is already added
    const isCourseAdded = (courseId: string) => {
        return examCourses.some(ec => ec.examId === selectedExamId && ec.courseId === courseId);
    };

    // Modal Handlers
    const handleOpenAddModal = (course: Course) => {
        setCourseToAdd(course);
    };

    const handleCloseAddModal = () => {
        setCourseToAdd(null);
    };

    const handleSaveCourseDetails = (questionCount: number, duration: number) => {
        if (selectedExamId && courseToAdd) {
            onAddExamCourse(selectedExamId, courseToAdd.id, questionCount, duration);
            handleCloseAddModal();
        }
    };

    return (
        <div className="container mx-auto h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <BookOpenIcon className="h-8 w-8 mr-2 text-orange-500" />
                    Sınav - Ders Yönetimi
                </h2>
            </div>

            {/* Exam Selection Bar */}
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
                {activeExams.length === 0 && (
                    <p className="text-red-500 text-sm mt-2">Listelenecek aktif sınav bulunamadı. Lütfen Sınavlar sayfasından bir sınavı aktif duruma getiriniz.</p>
                )}
            </div>

            {selectedExamId ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
                    
                    {/* Left Panel: Add Courses */}
                    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Ders Ekleme Paneli</h3>
                        
                        <div className="space-y-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Okul</label>
                                <select
                                    value={selectedSchoolId}
                                    onChange={handleSchoolChange}
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                >
                                    <option value="">-- Okul Seçiniz --</option>
                                    {schools.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bölüm</label>
                                <select
                                    value={selectedDepartmentId}
                                    onChange={handleDepartmentChange}
                                    disabled={!selectedSchoolId}
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm disabled:bg-gray-100"
                                >
                                    <option value="">-- Bölüm Seçiniz --</option>
                                    {availableDepartments.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto border rounded-lg mt-2">
                            {selectedDepartmentId ? (
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-3">Kod</th>
                                            <th className="px-4 py-3">Ders Adı</th>
                                            <th className="px-4 py-3 text-right">İşlem</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {availableCourses.map(course => {
                                            const added = isCourseAdded(course.id);
                                            return (
                                                <tr key={course.id} className="bg-white border-b hover:bg-gray-50">
                                                    <td className="px-4 py-3 font-medium">{course.code}</td>
                                                    <td className="px-4 py-3">{course.name}</td>
                                                    <td className="px-4 py-3 text-right">
                                                        <button
                                                            onClick={() => handleOpenAddModal(course)}
                                                            disabled={added}
                                                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                                                added 
                                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                            }`}
                                                        >
                                                            {added ? 'Eklendi' : 'Ekle'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {availableCourses.length === 0 && (
                                            <tr>
                                                <td colSpan={3} className="px-4 py-8 text-center text-gray-400">Bu bölümde ders bulunamadı.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400 text-sm p-4">
                                    Dersleri listelemek için Okul ve Bölüm seçiniz.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Assigned Courses */}
                    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col">
                         <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 flex justify-between items-center">
                             <span>Sınava Dahil Edilen Dersler</span>
                             <span className="text-sm bg-orange-100 text-orange-800 py-0.5 px-2.5 rounded-full">{addedCoursesList.length}</span>
                         </h3>
                         
                         <div className="flex-1 overflow-auto border rounded-lg">
                            {addedCoursesList.length > 0 ? (
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-3">Kod</th>
                                            <th className="px-4 py-3">Ders Adı</th>
                                            <th className="px-4 py-3 text-center">Soru</th>
                                            <th className="px-4 py-3 text-center">Süre (dk)</th>
                                            <th className="px-4 py-3 text-right">İşlem</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {addedCoursesList.map(item => (
                                            <tr key={item.courseId} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-4 py-3 font-medium text-gray-900">{item.courseCode}</td>
                                                <td className="px-4 py-3">{item.courseName}</td>
                                                <td className="px-4 py-3 text-center">{item.questionCount}</td>
                                                <td className="px-4 py-3 text-center">{item.duration}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <button
                                                        onClick={() => onRemoveExamCourse(selectedExamId, item.courseId as string)}
                                                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                                                        title="Çıkar"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm p-4">
                                    <BookOpenIcon className="h-12 w-12 mb-2 opacity-20" />
                                    <p>Bu sınava henüz ders eklenmemiş.</p>
                                    <p className="text-xs mt-1">Sol panelden ders seçerek ekleyebilirsiniz.</p>
                                </div>
                            )}
                         </div>
                    </div>

                </div>
            ) : (
                 <div className="flex flex-col items-center justify-center flex-1 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-12">
                    <BookOpenIcon className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-500">Lütfen işlem yapmak için yukarıdan bir sınav seçiniz.</h3>
                </div>
            )}
            
            {/* Modal */}
            {courseToAdd && (
                <AddCourseDetailsModal 
                    course={courseToAdd}
                    onSave={handleSaveCourseDetails}
                    onClose={handleCloseAddModal}
                />
            )}
        </div>
    );
};

export default ExamCoursesPage;
