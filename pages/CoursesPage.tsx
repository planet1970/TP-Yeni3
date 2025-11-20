
import React, { useState, useMemo, useEffect } from 'react';
import { EditIcon, TrashIcon } from '../components/icons';
import type { Course, School, Department, Teacher } from '../types';

interface CoursesPageProps {
    allSchools: School[];
    allDepartments: Department[];
    allCourses: Course[];
    teachers: Teacher[]; // Passed from App
    onAdd: (course: Omit<Course, 'id'>) => void;
    onUpdate: (course: Course) => void;
    onDelete: (courseId: string) => void;
    onNavigate: (pageState: { page: string; context?: Record<string, any> }) => void;
}

const CourseForm: React.FC<{
    course: Partial<Course> | null;
    teachers: Teacher[]; // Filtered teachers list
    onSave: (course: Omit<Course, 'id' | 'departmentId'> & { id?: string }) => void;
    onCancel: () => void;
}> = ({ course, teachers, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: course?.name || '',
        code: course?.code || '',
        teacherId: course?.teacherId || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: course?.id });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
                {course?.id ? 'Ders Bilgilerini Düzenle' : 'Yeni Ders Ekle'}
            </h3>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Ders Adı"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        required
                    />
                    <input
                        type="text"
                        name="code"
                        placeholder="Ders Kodu"
                        value={formData.code}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        required
                    />
                    <div className="md:col-span-2">
                         <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700 mb-1">Öğretmen</label>
                         <select
                            name="teacherId"
                            id="teacherId"
                            value={formData.teacherId}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            required
                        >
                            <option value="">-- Öğretmen Seçiniz --</option>
                            {teachers.map(t => (
                                <option key={t.id} value={t.id}>
                                    {t.title} {t.firstName} {t.lastName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex justify-end space-x-3 mt-4">
                    <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                        İptal
                    </button>
                    <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-sm font-medium">
                        Kaydet
                    </button>
                </div>
            </form>
        </div>
    );
};

const CoursesPage: React.FC<CoursesPageProps> = ({ 
    allSchools, 
    allDepartments, 
    allCourses, 
    teachers,
    onAdd, 
    onUpdate, 
    onDelete, 
}) => {
    const [selectedSchoolId, setSelectedSchoolId] = useState<string | undefined>();
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | undefined>();
    
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);

    const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const schoolId = e.target.value;
        setSelectedSchoolId(schoolId || undefined);
        setSelectedDepartmentId(undefined); // Reset department on school change
        setIsFormVisible(false);
        setEditingCourse(null);
    };

    const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const departmentId = e.target.value;
        setSelectedDepartmentId(departmentId || undefined);
        setIsFormVisible(false);
        setEditingCourse(null);
    };

    const availableDepartments = useMemo(() => {
        if (!selectedSchoolId) return [];
        return allDepartments.filter(d => d.schoolId === selectedSchoolId);
    }, [allDepartments, selectedSchoolId]);

    const availableTeachers = useMemo(() => {
        if (!selectedSchoolId) return [];
        return teachers.filter(t => t.schoolId === selectedSchoolId);
    }, [teachers, selectedSchoolId]);

    const filteredCourses = useMemo(() => {
        if (!selectedDepartmentId) return [];
        return allCourses.filter(c => c.departmentId === selectedDepartmentId);
    }, [allCourses, selectedDepartmentId]);
    
    const selectedDepartmentName = useMemo(() => {
        return allDepartments.find(d => d.id === selectedDepartmentId)?.name;
    }, [allDepartments, selectedDepartmentId]);

    const handleAddNew = () => {
        setEditingCourse(null);
        setIsFormVisible(true);
    };

    const handleEdit = (course: Course) => {
        setEditingCourse(course);
        setIsFormVisible(true);
    };

    const handleSave = (courseData: Omit<Course, 'id' | 'departmentId'> & { id?: string }) => {
        if (!selectedDepartmentId) return;
        if (courseData.id) { // Editing
            onUpdate({ ...courseData, departmentId: selectedDepartmentId } as Course);
        } else { // Adding
            const { id, ...newCourseData } = courseData;
            onAdd({ ...newCourseData, departmentId: selectedDepartmentId });
        }
        setIsFormVisible(false);
        setEditingCourse(null);
    };

    const handleCancel = () => {
        setIsFormVisible(false);
        setEditingCourse(null);
    };

    const getTeacherName = (teacherId?: string) => {
        if (!teacherId) return '-';
        const teacher = teachers.find(t => t.id === teacherId);
        return teacher ? `${teacher.title} ${teacher.firstName} ${teacher.lastName}` : '-';
    };
    
    return (
        <div className="container mx-auto">
             <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Ders Yönetimi</h2>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <select
                        value={selectedSchoolId || ''}
                        onChange={handleSchoolChange}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    >
                        <option value="">-- Önce Okul Seçiniz --</option>
                        {allSchools.map(school => (
                            <option key={school.id} value={school.id}>{school.name}</option>
                        ))}
                    </select>
                     <select
                        value={selectedDepartmentId || ''}
                        onChange={handleDepartmentChange}
                        disabled={!selectedSchoolId}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm disabled:bg-gray-100"
                    >
                        <option value="">-- Sonra Bölüm Seçiniz --</option>
                        {availableDepartments.map(dep => (
                            <option key={dep.id} value={dep.id}>{dep.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedDepartmentId ? (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-700">{selectedDepartmentName} Dersleri</h3>
                        {!isFormVisible && (
                            <button onClick={handleAddNew} className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-sm font-medium">
                                Yeni Ders Ekle
                            </button>
                        )}
                    </div>

                    {isFormVisible && <CourseForm course={editingCourse} teachers={availableTeachers} onSave={handleSave} onCancel={handleCancel} />}

                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Ders Adı</th>
                                        <th scope="col" className="px-6 py-3">Ders Kodu</th>
                                        <th scope="col" className="px-6 py-3">Öğretmen</th>
                                        <th scope="col" className="px-6 py-3 text-right">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCourses.map((course) => (
                                        <tr key={course.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{course.name}</td>
                                            <td className="px-6 py-4">{course.code}</td>
                                            <td className="px-6 py-4">{getTeacherName(course.teacherId)}</td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button onClick={() => handleEdit(course)} className="p-2 rounded-md text-gray-400 hover:bg-gray-100 hover:text-green-600 transition-colors" title="Güncelle">
                                                    <EditIcon className="h-5 w-5" />
                                                </button>
                                                <button onClick={() => onDelete(course.id)} className="p-2 rounded-md text-gray-400 hover:bg-gray-100 hover:text-red-600 transition-colors" title="Sil">
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredCourses.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="text-center py-10 text-gray-500">Bu bölüme ait ders bulunamadı.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center p-10 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-700">Dersleri görüntülemek için lütfen bir okul ve bölüm seçin.</h2>
                </div>
            )}
        </div>
    );
};

export default CoursesPage;
