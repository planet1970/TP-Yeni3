
import React, { useState, useMemo, useEffect } from 'react';
import { EditIcon, TrashIcon } from '../components/icons';
import type { Session, Exam } from '../types';

interface SessionsPageProps {
    initialExamId?: string;
    allExams: Exam[];
    allSessions: Session[];
    onAdd: (session: Omit<Session, 'id'>) => void;
    onUpdate: (session: Session) => void;
    onDelete: (sessionId: string) => void;
    onNavigate: (pageState: { page: string; context?: Record<string, any> }) => void;
}

const SessionForm: React.FC<{
    session: Partial<Session> | null;
    onSave: (session: Omit<Session, 'id' | 'examId'> & { id?: string }) => void;
    onCancel: () => void;
}> = ({ session, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: session?.name || '',
        date: session?.date || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: session?.id });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
                {session?.id ? 'Oturum Bilgilerini Düzenle' : 'Yeni Oturum Ekle'}
            </h3>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Oturum Adı"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        required
                    />
                    <input
                        type="datetime-local"
                        name="date"
                        value={formData.date}
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

const SessionsPage: React.FC<SessionsPageProps> = ({ 
    initialExamId, 
    allExams, 
    allSessions, 
    onAdd, 
    onUpdate, 
    onDelete, 
    onNavigate 
}) => {
    const [selectedExamId, setSelectedExamId] = useState<string | undefined>(initialExamId);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingSession, setEditingSession] = useState<Session | null>(null);

    useEffect(() => {
        setSelectedExamId(initialExamId);
    }, [initialExamId]);

    const handleExamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const examId = e.target.value;
        setSelectedExamId(examId || undefined);
        setIsFormVisible(false);
        setEditingSession(null);
    };

    const filteredSessions = useMemo(() => {
        if (!selectedExamId) return [];
        return allSessions.filter(s => s.examId === selectedExamId);
    }, [allSessions, selectedExamId]);
    
    const selectedExamName = useMemo(() => {
        return allExams.find(e => e.id === selectedExamId)?.name;
    }, [allExams, selectedExamId]);

    const handleAddNew = () => {
        setEditingSession(null);
        setIsFormVisible(true);
    };

    const handleEdit = (session: Session) => {
        setEditingSession(session);
        setIsFormVisible(true);
    };

    const handleSave = (sessionData: Omit<Session, 'id' | 'examId'> & { id?: string }) => {
        if (!selectedExamId) return;
        if (sessionData.id) { // Editing
            onUpdate({ ...sessionData, examId: selectedExamId } as Session);
        } else { // Adding
            const { id, ...newSessionData } = sessionData;
            onAdd({ ...newSessionData, examId: selectedExamId });
        }
        setIsFormVisible(false);
        setEditingSession(null);
    };

    const handleCancel = () => {
        setIsFormVisible(false);
        setEditingSession(null);
    };
    
    return (
        <div className="container mx-auto">
             <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <div>
                     <button onClick={() => onNavigate({ page: 'exams' })} className="text-sm text-orange-600 hover:underline mb-2">
                        &larr; Sınav Yönetimine Geri Dön
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800">Oturum Yönetimi</h2>
                </div>
                <div className="w-full md:w-auto">
                    <label htmlFor="exam-select" className="sr-only">Sınav Seçin</label>
                    <select
                        id="exam-select"
                        value={selectedExamId || ''}
                        onChange={handleExamChange}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    >
                        <option value="">-- Bir Sınav Seçiniz --</option>
                        {allExams.map(exam => (
                            <option key={exam.id} value={exam.id}>{exam.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedExamId ? (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-700">{selectedExamName} Oturumları</h3>
                        {!isFormVisible && (
                            <button onClick={handleAddNew} className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-sm font-medium">
                                Yeni Oturum Ekle
                            </button>
                        )}
                    </div>

                    {isFormVisible && <SessionForm session={editingSession} onSave={handleSave} onCancel={handleCancel} />}

                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Oturum Adı</th>
                                        <th scope="col" className="px-6 py-3">Tarih ve Saat</th>
                                        <th scope="col" className="px-6 py-3 text-right">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSessions.map((session) => (
                                        <tr key={session.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{session.name}</td>
                                            <td className="px-6 py-4">{new Date(session.date).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button onClick={() => handleEdit(session)} className="p-2 rounded-md text-gray-400 hover:bg-gray-100 hover:text-green-600 transition-colors" title="Güncelle">
                                                    <EditIcon className="h-5 w-5" />
                                                </button>
                                                <button onClick={() => onDelete(session.id)} className="p-2 rounded-md text-gray-400 hover:bg-gray-100 hover:text-red-600 transition-colors" title="Sil">
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredSessions.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="text-center py-10 text-gray-500">Bu sınava ait oturum bulunamadı.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center p-10 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-700">Oturumları görüntülemek için lütfen yukarıdan bir sınav seçin.</h2>
                </div>
            )}
        </div>
    );
};

export default SessionsPage;