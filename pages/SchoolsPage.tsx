
import React, { useState } from 'react';
import { EditIcon, TrashIcon, DepartmentIcon } from '../components/icons';
import type { School } from '../types';

interface SchoolsPageProps {
    schools: School[];
    onAdd: (school: Omit<School, 'id'>) => void;
    onUpdate: (school: School) => void;
    onDelete: (schoolId: string) => void;
    onNavigate: (pageState: { page: string; context?: Record<string, any> }) => void;
}

const SchoolForm: React.FC<{
    school: Partial<School> | null;
    onSave: (school: Omit<School, 'id'> & { id?: string }) => void;
    onCancel: () => void;
}> = ({ school, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: school?.name || '',
        description: school?.description || '',
        contact: school?.contact || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: school?.id });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
                {school?.id ? 'Okul Bilgilerini Düzenle' : 'Yeni Okul Ekle'}
            </h3>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Okul Adı</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="contact" className="block text-sm font-medium text-gray-700">İletişim</label>
                        <input
                            type="text"
                            name="contact"
                            id="contact"
                            value={formData.contact}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div className="md:col-span-2">
                         <label htmlFor="description" className="block text-sm font-medium text-gray-700">Açıklama</label>
                         <textarea
                            name="description"
                            id="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                         />
                    </div>
                </div>
                <div className="flex justify-end space-x-3 mt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                        İptal
                    </button>
                    <button
                        type="submit"
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-sm font-medium"
                    >
                        Kaydet
                    </button>
                </div>
            </form>
        </div>
    );
};

const SchoolsPage: React.FC<SchoolsPageProps> = ({ schools, onAdd, onUpdate, onDelete, onNavigate }) => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingSchool, setEditingSchool] = useState<School | null>(null);

    const handleAddNew = () => {
        setEditingSchool(null);
        setIsFormVisible(true);
    };

    const handleEdit = (school: School) => {
        setEditingSchool(school);
        setIsFormVisible(true);
    };

    const handleSave = (schoolData: Omit<School, 'id'> & { id?: string }) => {
        if (schoolData.id) { // Editing existing school
            onUpdate({ ...schoolData } as School);
        } else { // Adding new school
            const { id, ...newSchoolData } = schoolData;
            onAdd(newSchoolData);
        }
        setIsFormVisible(false);
        setEditingSchool(null);
    };

    const handleCancel = () => {
        setIsFormVisible(false);
        setEditingSchool(null);
    };

    const handleGoToDepartments = (school: School) => {
        onNavigate({ 
            page: 'departments', 
            context: { schoolId: school.id } 
        });
    };

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Okul Yönetimi</h2>
                {!isFormVisible && (
                    <button 
                        onClick={handleAddNew}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-sm font-medium"
                    >
                        Yeni Okul Ekle
                    </button>
                )}
            </div>

            {isFormVisible && <SchoolForm school={editingSchool} onSave={handleSave} onCancel={handleCancel} />}

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Okul Adı</th>
                                <th scope="col" className="px-6 py-3">İletişim</th>
                                <th scope="col" className="px-6 py-3 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schools.map((school) => (
                                <tr key={school.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{school.name}</td>
                                    <td className="px-6 py-4">{school.contact}</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => handleGoToDepartments(school)} className="p-2 rounded-md text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors" title="Bölümler">
                                            <DepartmentIcon className="h-5 w-5" />
                                        </button>
                                        <button onClick={() => handleEdit(school)} className="p-2 rounded-md text-gray-400 hover:bg-gray-100 hover:text-green-600 transition-colors" title="Güncelle">
                                            <EditIcon className="h-5 w-5" />
                                        </button>
                                        <button onClick={() => onDelete(school.id)} className="p-2 rounded-md text-gray-400 hover:bg-gray-100 hover:text-red-600 transition-colors" title="Sil">
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SchoolsPage;