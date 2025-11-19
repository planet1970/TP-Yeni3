
import React, { useState } from 'react';
import { EditIcon, TrashIcon, ClockIcon, EyeIcon, EyeOffIcon } from '../components/icons';
import type { Exam } from '../types';

interface ExamsPageProps {
    exams: Exam[];
    onAdd: (exam: Omit<Exam, 'id' | 'isActive'>) => void;
    onUpdate: (exam: Exam) => void;
    onDelete: (examId: string) => void;
    onToggleStatus: (examId: string) => void;
    onNavigate: (pageState: { page: string; context?: Record<string, any> }) => void;
}

const ExamForm: React.FC<{
    exam: Partial<Exam> | null;
    onSave: (exam: Omit<Exam, 'id' | 'isActive'> & { id?: string }) => void;
    onCancel: () => void;
}> = ({ exam, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: exam?.name || '',
        description: exam?.description || '',
        closingDate: exam?.closingDate || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: exam?.id });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
                {exam?.id ? 'Sınav Bilgilerini Düzenle' : 'Yeni Sınav Ekle'}
            </h3>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Sınav Adı</label>
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
                        <label htmlFor="closingDate" className="block text-sm font-medium text-gray-700">Kapanış Tarihi</label>
                        <input
                            type="date"
                            name="closingDate"
                            id="closingDate"
                            value={formData.closingDate}
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
                    <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium">İptal</button>
                    <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-sm font-medium">Kaydet</button>
                </div>
            </form>
        </div>
    );
};

const ExamsPage: React.FC<ExamsPageProps> = ({ exams, onAdd, onUpdate, onDelete, onToggleStatus, onNavigate }) => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingExam, setEditingExam] = useState<Exam | null>(null);

    const handleAddNew = () => {
        setEditingExam(null);
        setIsFormVisible(true);
    };

    const handleEdit = (exam: Exam) => {
        setEditingExam(exam);
        setIsFormVisible(true);
    };

    const handleSave = (examData: Omit<Exam, 'id' | 'isActive'> & { id?: string }) => {
        if (examData.id) {
            const originalExam = exams.find(e => e.id === examData.id);
            onUpdate({ ...examData, isActive: originalExam?.isActive ?? false } as Exam);
        } else {
            onAdd(examData);
        }
        setIsFormVisible(false);
        setEditingExam(null);
    };

    const handleCancel = () => {
        setIsFormVisible(false);
        setEditingExam(null);
    };

    const handleGoToSessions = (exam: Exam) => {
        onNavigate({ page: 'sessions', context: { examId: exam.id } });
    };

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Sınav Yönetimi</h2>
                {!isFormVisible && (
                    <button onClick={handleAddNew} className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-sm font-medium">Yeni Sınav Ekle</button>
                )}
            </div>

            {isFormVisible && <ExamForm exam={editingExam} onSave={handleSave} onCancel={handleCancel} />}

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Sınav Adı</th>
                                <th scope="col" className="px-6 py-3">Kapanış Tarihi</th>
                                <th scope="col" className="px-6 py-3">Durum</th>
                                <th scope="col" className="px-6 py-3 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exams.map((exam) => (
                                <tr key={exam.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{exam.name}</td>
                                    <td className="px-6 py-4">{new Date(exam.closingDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${exam.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {exam.isActive ? 'Aktif' : 'Pasif'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => onToggleStatus(exam.id)} className={`p-2 rounded-md ${exam.isActive ? 'text-green-500 hover:bg-gray-100' : 'text-gray-400 hover:bg-gray-100'}`} title={exam.isActive ? 'Pasif Yap' : 'Aktif Yap'}>
                                            {exam.isActive ? <EyeIcon className="h-5 w-5" /> : <EyeOffIcon className="h-5 w-5" />}
                                        </button>
                                        <button onClick={() => handleGoToSessions(exam)} className="p-2 rounded-md text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors" title="Oturumlar">
                                            <ClockIcon className="h-5 w-5" />
                                        </button>
                                        <button onClick={() => handleEdit(exam)} className="p-2 rounded-md text-gray-400 hover:bg-gray-100 hover:text-green-600 transition-colors" title="Güncelle">
                                            <EditIcon className="h-5 w-5" />
                                        </button>
                                        <button onClick={() => onDelete(exam.id)} className="p-2 rounded-md text-gray-400 hover:bg-gray-100 hover:text-red-600 transition-colors" title="Sil">
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

export default ExamsPage;