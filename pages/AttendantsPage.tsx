
import React, { useState } from 'react';
import { EditIcon, TrashIcon, EyeIcon, EyeOffIcon } from '../components/icons';
import type { Attendant, School } from '../types';

interface AttendantsPageProps {
    attendants: Attendant[];
    schools: School[];
    onAdd: (attendant: Omit<Attendant, 'id' | 'isActive'>) => void;
    onUpdate: (attendant: Attendant) => void;
    onDelete: (attendantId: string) => void;
    onToggleStatus: (attendantId: string) => void;
}

const AttendantForm: React.FC<{
    attendant: Partial<Attendant> | null;
    schools: School[];
    onSave: (attendant: Omit<Attendant, 'id' | 'isActive'> & { id?: string }) => void;
    onCancel: () => void;
}> = ({ attendant, schools, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        title: attendant?.title || '',
        firstName: attendant?.firstName || '',
        lastName: attendant?.lastName || '',
        schoolId: attendant?.schoolId || '',
        email: attendant?.email || '',
        phone: attendant?.phone || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: attendant?.id });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
                {attendant?.id ? 'Görevli Bilgilerini Düzenle' : 'Yeni Görevli Ekle'}
            </h3>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                            <option value="Memur">Memur</option>
                            <option value="Diğer">Diğer</option>
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
                        <label className="block text-sm font-medium text-gray-700">Telefon</label>
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

const AttendantsPage: React.FC<AttendantsPageProps> = ({ attendants, schools, onAdd, onUpdate, onDelete, onToggleStatus }) => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingAttendant, setEditingAttendant] = useState<Attendant | null>(null);

    const handleAddNew = () => {
        setEditingAttendant(null);
        setIsFormVisible(true);
    };

    const handleEdit = (attendant: Attendant) => {
        setEditingAttendant(attendant);
        setIsFormVisible(true);
    };

    const handleSave = (attendantData: Omit<Attendant, 'id' | 'isActive'> & { id?: string }) => {
        if (attendantData.id) {
            // Preserve existing isActive status
            const existing = attendants.find(a => a.id === attendantData.id);
            onUpdate({ ...attendantData, isActive: existing?.isActive ?? true } as Attendant);
        } else {
            onAdd(attendantData);
        }
        setIsFormVisible(false);
        setEditingAttendant(null);
    };

    const handleCancel = () => {
        setIsFormVisible(false);
        setEditingAttendant(null);
    };

    const getSchoolName = (schoolId: string) => {
        const school = schools.find(s => s.id === schoolId);
        return school ? school.name : '-';
    };

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Görevli Yönetimi</h2>
                {!isFormVisible && (
                    <button onClick={handleAddNew} className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-sm font-medium">Yeni Görevli Ekle</button>
                )}
            </div>

            {isFormVisible && <AttendantForm attendant={editingAttendant} schools={schools} onSave={handleSave} onCancel={handleCancel} />}

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
                                <th scope="col" className="px-6 py-3">Durum</th>
                                <th scope="col" className="px-6 py-3 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendants.map((attendant) => (
                                <tr key={attendant.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">{attendant.title}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{attendant.firstName} {attendant.lastName}</td>
                                    <td className="px-6 py-4">{getSchoolName(attendant.schoolId)}</td>
                                    <td className="px-6 py-4">{attendant.email}</td>
                                    <td className="px-6 py-4">{attendant.phone}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${attendant.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {attendant.isActive ? 'Aktif' : 'Pasif'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => onToggleStatus(attendant.id)} className={`p-2 rounded-md ${attendant.isActive ? 'text-green-500 hover:bg-gray-100' : 'text-gray-400 hover:bg-gray-100'}`} title={attendant.isActive ? 'Pasif Yap' : 'Aktif Yap'}>
                                            {attendant.isActive ? <EyeIcon className="h-5 w-5" /> : <EyeOffIcon className="h-5 w-5" />}
                                        </button>
                                        <button onClick={() => handleEdit(attendant)} className="p-2 rounded-md text-gray-400 hover:bg-gray-100 hover:text-green-600 transition-colors" title="Güncelle">
                                            <EditIcon className="h-5 w-5" />
                                        </button>
                                        <button onClick={() => onDelete(attendant.id)} className="p-2 rounded-md text-gray-400 hover:bg-gray-100 hover:text-red-600 transition-colors" title="Sil">
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {attendants.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500">Henüz görevli eklenmemiş.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AttendantsPage;