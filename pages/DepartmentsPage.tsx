
import React, { useState, useMemo, useEffect } from 'react';
import { EditIcon, TrashIcon } from '../components/icons';
import type { Department, School } from '../types';

interface DepartmentsPageProps {
    initialSchoolId?: string;
    allSchools: School[];
    allDepartments: Department[];
    onAdd: (department: Omit<Department, 'id'>) => void;
    onUpdate: (department: Department) => void;
    onDelete: (departmentId: string) => void;
    onNavigate: (pageState: { page: string; context?: Record<string, any> }) => void;
}

const DepartmentForm: React.FC<{
    department: Partial<Department> | null;
    onSave: (department: Omit<Department, 'id' | 'schoolId'> & { id?: string }) => void;
    onCancel: () => void;
}> = ({ department, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: department?.name || '',
        code: department?.code || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: department?.id });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
                {department?.id ? 'Bölüm Bilgilerini Düzenle' : 'Yeni Bölüm Ekle'}
            </h3>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Bölüm Adı"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        required
                    />
                    <input
                        type="text"
                        name="code"
                        placeholder="Bölüm Kodu"
                        value={formData.code}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        required
                    />
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

const DepartmentsPage: React.FC<DepartmentsPageProps> = ({ 
    initialSchoolId, 
    allSchools, 
    allDepartments, 
    onAdd, 
    onUpdate, 
    onDelete, 
    onNavigate 
}) => {
    const [selectedSchoolId, setSelectedSchoolId] = useState<string | undefined>(initialSchoolId);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

    useEffect(() => {
        setSelectedSchoolId(initialSchoolId);
    }, [initialSchoolId]);

    const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const schoolId = e.target.value;
        setSelectedSchoolId(schoolId || undefined);
        setIsFormVisible(false); // Hide form when school changes
        setEditingDepartment(null);
    };

    const filteredDepartments = useMemo(() => {
        if (!selectedSchoolId) return [];
        return allDepartments.filter(d => d.schoolId === selectedSchoolId);
    }, [allDepartments, selectedSchoolId]);
    
    const selectedSchoolName = useMemo(() => {
        return allSchools.find(s => s.id === selectedSchoolId)?.name;
    }, [allSchools, selectedSchoolId]);


    const handleAddNew = () => {
        setEditingDepartment(null);
        setIsFormVisible(true);
    };

    const handleEdit = (department: Department) => {
        setEditingDepartment(department);
        setIsFormVisible(true);
    };

    const handleSave = (departmentData: Omit<Department, 'id' | 'schoolId'> & { id?: string }) => {
        if (!selectedSchoolId) return;
        if (departmentData.id) { // Editing
            onUpdate({ ...departmentData, schoolId: selectedSchoolId } as Department);
        } else { // Adding
            const { id, ...newDeptData } = departmentData;
            onAdd({ ...newDeptData, schoolId: selectedSchoolId });
        }
        setIsFormVisible(false);
        setEditingDepartment(null);
    };

    const handleCancel = () => {
        setIsFormVisible(false);
        setEditingDepartment(null);
    };
    
    return (
        <div className="container mx-auto">
             <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <div>
                     <button onClick={() => onNavigate({ page: 'schools' })} className="text-sm text-orange-600 hover:underline mb-2">
                        &larr; Okul Yönetimine Geri Dön
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800">Bölüm Yönetimi</h2>
                </div>
                <div className="w-full md:w-auto">
                    <label htmlFor="school-select" className="sr-only">Okul Seçin</label>
                    <select
                        id="school-select"
                        value={selectedSchoolId || ''}
                        onChange={handleSchoolChange}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    >
                        <option value="">-- Bir Okul Seçiniz --</option>
                        {allSchools.map(school => (
                            <option key={school.id} value={school.id}>{school.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedSchoolId ? (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-700">{selectedSchoolName} Bölümleri</h3>
                        {!isFormVisible && (
                            <button onClick={handleAddNew} className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-sm font-medium">
                                Yeni Bölüm Ekle
                            </button>
                        )}
                    </div>

                    {isFormVisible && <DepartmentForm department={editingDepartment} onSave={handleSave} onCancel={handleCancel} />}

                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Bölüm Adı</th>
                                        <th scope="col" className="px-6 py-3">Bölüm Kodu</th>
                                        <th scope="col" className="px-6 py-3 text-right">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDepartments.map((department) => (
                                        <tr key={department.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{department.name}</td>
                                            <td className="px-6 py-4">{department.code}</td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button onClick={() => handleEdit(department)} className="p-2 rounded-md text-gray-400 hover:bg-gray-100 hover:text-green-600 transition-colors" title="Güncelle">
                                                    <EditIcon className="h-5 w-5" />
                                                </button>
                                                <button onClick={() => onDelete(department.id)} className="p-2 rounded-md text-gray-400 hover:bg-gray-100 hover:text-red-600 transition-colors" title="Sil">
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredDepartments.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="text-center py-10 text-gray-500">Bu okula ait bölüm bulunamadı.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center p-10 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-700">Bölümleri görüntülemek için lütfen yukarıdan bir okul seçin.</h2>
                </div>
            )}
        </div>
    );
};

export default DepartmentsPage;