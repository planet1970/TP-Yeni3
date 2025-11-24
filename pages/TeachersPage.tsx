
import React, { useState } from 'react';
import { EditIcon, TrashIcon } from '../components/icons';
import type { Teacher, School } from '../types';

interface TeachersPageProps {
    teachers: Teacher[];
    schools: School[];
    onAdd: (teacher: Omit<Teacher, 'id'>) => void;
    onUpdate: (teacher: Teacher) => void;
    onDelete: (teacherId: string) => void;
    onNavigate: (pageState: { page: string; context?: Record<string, any> }) => void;
}

const TeacherForm: React.FC<{
    teacher: Partial<Teacher> | null;
    schools: School[];
    onSave: (teacher: Omit<Teacher, 'id'> & { id?: string }) => void;
    onCancel: () => void;
}> = ({ teacher, schools, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        title: teacher?.title || '',
        firstName: teacher?.firstName || '',
        lastName: teacher?.lastName || '',
        email: teacher?.email || '',
        phone: teacher?.phone || '',
        schoolId: teacher?.schoolId || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: teacher?.id });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
                {teacher?.id ? 'Öğretmen Bilgilerini Düzenle' : 'Yeni Öğretmen Ekle'}
            </h3>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ünvan</label>
                        <select
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            required
                        >
                            <option value="">Seçiniz</option>
                            <option value="Prof. Dr.">Prof. Dr.</option>
                            <option value="Doç. Dr.">Doç. Dr.</option>
                            <option value="Dr. Öğr. Üyesi">Dr. Öğr. Üyesi</option>
                            <option value="Öğr. Gör.">Öğr. Gör.</option>
                            <option value="Arş. Gör.">Arş. Gör.</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Okul</label>
                        <select
                            name="schoolId"
                            value={formData.schoolId}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            required
                        >
                            <option value="">Seçiniz</option>
                            {schools.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ad</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Soyad</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">E-Posta</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            required
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Telefon Numarası</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            required
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-3 mt-4">
                    <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium">İptal</button>
                    <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-sm font-medium">Kaydet</button>
                </div>
            </form>
        </div>
    );
};

const TeachersPage: React.FC<TeachersPageProps> = ({ teachers, schools, onAdd, onUpdate, onDelete, onNavigate }) => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

    const handleAddNew = () => {
        setEditingTeacher(null);
        setIsFormVisible(true);
    };

    const handleEdit = (teacher: Teacher) => {
        setEditingTeacher(teacher);
        setIsFormVisible(true);
    };

    const handleSave = (teacherData: Omit<Teacher, 'id'> & { id?: string }) => {
        if (teacherData.id) {
            onUpdate({ ...teacherData } as Teacher);
        } else {
            onAdd(teacherData);
        }
        setIsFormVisible(false);
        setEditingTeacher(null);
    };

    const handleCancel = () => {
        setIsFormVisible(false);
        setEditingTeacher(null);
    };

    const getSchoolName = (schoolId: string) => {
        const school = schools.find(s => s.id === schoolId);
        return school ? school.name : '-';
    };

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Öğretmen Yönetimi</h2>
                {!isFormVisible && (
                    <button onClick={handleAddNew} className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-sm font-medium">Yeni Öğretmen Ekle</button>
                )}
            </div>

            {isFormVisible && <TeacherForm teacher={editingTeacher} schools={schools} onSave={handleSave} onCancel={handleCancel} />}

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Ünvan</th>
                                <th scope="col" className="px-6 py-3">Adı Soyadı</th>
                                <th scope="col" className="px-6 py-3">Okul</th>
                                <th scope="col" className="px-6 py-3">E-Posta</th>
                                <th scope="col" className="px-6 py-3">Telefon</th>
                                <th scope="col" className="px-6 py-3 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teachers.map((teacher) => (
                                <tr key={teacher.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">{teacher.title}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{teacher.firstName} {teacher.lastName}</td>
                                    <td className="px-6 py-4">{getSchoolName(teacher.schoolId)}</td>
                                    <td className="px-6 py-4">{teacher.email}</td>
                                    <td className="px-6 py-4">{teacher.phone}</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => handleEdit(teacher)} className="p-2 rounded-md text-gray-400 hover:bg-gray-100 hover:text-green-600 transition-colors" title="Güncelle">
                                            <EditIcon className="h-5 w-5" />
                                        </button>
                                        <button onClick={() => onDelete(teacher.id)} className="p-2 rounded-md text-gray-400 hover:bg-gray-100 hover:text-red-600 transition-colors" title="Sil">
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {teachers.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">Henüz öğretmen eklenmemiş.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TeachersPage;
