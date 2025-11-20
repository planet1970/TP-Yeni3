
import React, { useState, useMemo, useEffect } from 'react';
import { EditIcon, TrashIcon, DepartmentIcon, EyeIcon, EyeOffIcon, ClockIcon } from '../components/icons';
import type { Session, Exam, Department, SessionDepartment } from '../types';

interface SessionsPageProps {
    initialExamId?: string;
    allExams: Exam[];
    allSessions: Session[];
    allDepartments: Department[];
    sessionDepartments: SessionDepartment[];
    onAdd: (session: Omit<Session, 'id' | 'isActive'>) => void;
    onUpdate: (session: Session) => void;
    onDelete: (sessionId: string) => void;
    onToggleStatus: (sessionId: string) => void;
    onNavigate: (pageState: { page: string; context?: Record<string, any> }) => void;
    onAddSessionDepartment: (sessionId: string, departmentId: string) => void;
    onRemoveSessionDepartment: (sessionId: string, departmentId: string) => void;
}

const SessionForm: React.FC<{
    session: Partial<Session> | null;
    onSave: (session: Omit<Session, 'id' | 'examId' | 'isActive'> & { id?: string }) => void;
    onCancel: () => void;
}> = ({ session, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: session?.name || '',
        date: session?.date || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: value 
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Default sequenceNumber to 0 since it's removed from UI but exists in type
        onSave({ ...formData, sequenceNumber: session?.sequenceNumber || 0, id: session?.id });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
                {session?.id ? 'Oturum Bilgilerini Düzenle' : 'Yeni Oturum Ekle'}
            </h3>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Oturum Adı</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Oturum Adı"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                         <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Tarih ve Saat</label>
                         <input
                            type="datetime-local"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            required
                        />
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

const SessionDepartmentsModal: React.FC<{
    session: Session;
    allDepartments: Department[];
    sessionDepartments: SessionDepartment[];
    onAddDepartment: (departmentId: string) => void;
    onRemoveDepartment: (departmentId: string) => void;
    onClose: () => void;
}> = ({ session, allDepartments, sessionDepartments, onAddDepartment, onRemoveDepartment, onClose }) => {
    
    const isDepartmentAdded = (deptId: string) => {
        return sessionDepartments.some(sd => sd.sessionId === session.id && sd.departmentId === deptId);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800">
                        Oturuma Bölüm Ekle: <span className="text-orange-600">{session.name}</span>
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1">
                    <div className="overflow-x-auto border rounded-lg">
                        <table className="w-full text-sm text-left text-gray-500">
                             <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3">Bölüm Kodu</th>
                                    <th className="px-6 py-3">Bölüm Adı</th>
                                    <th className="px-6 py-3 text-right">İşlem</th>
                                </tr>
                             </thead>
                             <tbody>
                                {allDepartments.map(dept => {
                                    const added = isDepartmentAdded(dept.id);
                                    return (
                                        <tr key={dept.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium">{dept.code}</td>
                                            <td className="px-6 py-4">{dept.name}</td>
                                            <td className="px-6 py-4 text-right">
                                                {added ? (
                                                    <button
                                                        onClick={() => onRemoveDepartment(dept.id)}
                                                        className="px-3 py-1 rounded-md text-xs font-medium transition-colors bg-red-100 text-red-700 hover:bg-red-200"
                                                    >
                                                        Çıkar
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => onAddDepartment(dept.id)}
                                                        className="px-3 py-1 rounded-md text-xs font-medium transition-colors bg-green-100 text-green-700 hover:bg-green-200"
                                                    >
                                                        Ekle
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                                {allDepartments.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-gray-500">Listelenecek bölüm bulunamadı.</td>
                                    </tr>
                                )}
                             </tbody>
                        </table>
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

const SessionsPage: React.FC<SessionsPageProps> = ({ 
    initialExamId, 
    allExams, 
    allSessions,
    allDepartments,
    sessionDepartments,
    onAdd, 
    onUpdate, 
    onDelete, 
    onToggleStatus,
    onNavigate,
    onAddSessionDepartment,
    onRemoveSessionDepartment
}) => {
    const [selectedExamId, setSelectedExamId] = useState<string | undefined>(initialExamId);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingSession, setEditingSession] = useState<Session | null>(null);
    
    // Modal State
    const [departmentModalSession, setDepartmentModalSession] = useState<Session | null>(null);

    useEffect(() => {
        setSelectedExamId(initialExamId);
    }, [initialExamId]);

    const activeExams = useMemo(() => {
        return allExams.filter(e => e.isActive);
    }, [allExams]);

    const handleExamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const examId = e.target.value;
        setSelectedExamId(examId || undefined);
        setIsFormVisible(false);
        setEditingSession(null);
    };

    const filteredSessions = useMemo(() => {
        if (!selectedExamId) return [];
        return allSessions
            .filter(s => s.examId === selectedExamId)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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

    const handleSave = (sessionData: Omit<Session, 'id' | 'examId' | 'isActive'> & { id?: string }) => {
        if (!selectedExamId) return;
        if (sessionData.id) { // Editing
            const existingSession = allSessions.find(s => s.id === sessionData.id);
            onUpdate({ ...sessionData, examId: selectedExamId, isActive: existingSession?.isActive ?? true } as Session);
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

    // Modal Handlers
    const handleOpenDepartmentModal = (session: Session) => {
        setDepartmentModalSession(session);
    };

    const handleCloseDepartmentModal = () => {
        setDepartmentModalSession(null);
    };
    
    return (
        <div className="container mx-auto h-full flex flex-col">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <ClockIcon className="h-8 w-8 mr-2 text-orange-500" />
                    Sınav - Oturum Yönetimi
                </h2>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="w-full md:flex-1">
                         <label htmlFor="exam-select" className="block text-sm font-medium text-gray-700 mb-2">İşlem Yapılacak Aktif Sınavı Seçiniz</label>
                         <select
                            id="exam-select"
                            value={selectedExamId || ''}
                            onChange={handleExamChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                        >
                            <option value="">-- Bir Sınav Seçiniz --</option>
                            {activeExams.map(exam => (
                                <option key={exam.id} value={exam.id}>{exam.name}</option>
                            ))}
                        </select>
                        {activeExams.length === 0 && (
                            <p className="text-red-500 text-sm mt-2">Listelenecek aktif sınav bulunamadı. Lütfen Sınavlar sayfasından bir sınavı aktif duruma getiriniz.</p>
                        )}
                    </div>
                </div>
            </div>

            {selectedExamId ? (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-700">{selectedExamName} Oturum Listesi</h3>
                        {!isFormVisible && (
                            <button onClick={handleAddNew} className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-sm font-medium">
                                Yeni Oturum Ekle
                            </button>
                        )}
                    </div>

                    {isFormVisible && <SessionForm session={editingSession} onSave={handleSave} onCancel={handleCancel} />}
                    
                    {departmentModalSession && (
                        <SessionDepartmentsModal 
                            session={departmentModalSession}
                            allDepartments={allDepartments}
                            sessionDepartments={sessionDepartments}
                            onAddDepartment={(deptId) => onAddSessionDepartment(departmentModalSession.id, deptId)}
                            onRemoveDepartment={(deptId) => onRemoveSessionDepartment(departmentModalSession.id, deptId)}
                            onClose={handleCloseDepartmentModal}
                        />
                    )}

                    <div className="bg-white rounded-xl shadow-md overflow-hidden flex-1">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Oturum Adı</th>
                                        <th scope="col" className="px-6 py-3">Tarih ve Saat</th>
                                        <th scope="col" className="px-6 py-3">Bölümler</th>
                                        <th scope="col" className="px-6 py-3 text-right">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSessions.map((session) => {
                                        // Get assigned departments for this session
                                        const assignedDepartments = sessionDepartments
                                            .filter(sd => sd.sessionId === session.id)
                                            .map(sd => allDepartments.find(d => d.id === sd.departmentId))
                                            .filter((d): d is Department => !!d);
                                        
                                        return (
                                            <tr key={session.id} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-gray-900">{session.name}</td>
                                                <td className="px-6 py-4">{new Date(session.date).toLocaleString()}</td>
                                                <td className="px-6 py-4">
                                                    {assignedDepartments.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {assignedDepartments.map(d => (
                                                                <span key={d.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                                    {d.code}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 italic text-xs">- Bölüm Yok -</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <button onClick={() => onToggleStatus(session.id)} className={`p-2 rounded-md ${session.isActive ? 'text-green-500 hover:bg-gray-100' : 'text-gray-400 hover:bg-gray-100'}`} title={session.isActive ? 'Pasif Yap' : 'Aktif Yap'}>
                                                        {session.isActive ? <EyeIcon className="h-5 w-5" /> : <EyeOffIcon className="h-5 w-5" />}
                                                    </button>
                                                    <button onClick={() => handleOpenDepartmentModal(session)} className="p-2 rounded-md text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors" title="Bölümler">
                                                        <DepartmentIcon className="h-5 w-5" />
                                                    </button>
                                                    <button onClick={() => handleEdit(session)} className="p-2 rounded-md text-gray-400 hover:bg-gray-100 hover:text-green-600 transition-colors" title="Düzenle">
                                                        <EditIcon className="h-5 w-5" />
                                                    </button>
                                                    <button onClick={() => onDelete(session.id)} className="p-2 rounded-md text-gray-400 hover:bg-gray-100 hover:text-red-600 transition-colors" title="Sil">
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {filteredSessions.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="text-center py-10 text-gray-500">Bu sınava ait oturum bulunamadı.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center flex-1 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-12">
                    <ClockIcon className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-500">Oturumları görüntülemek için lütfen yukarıdan bir sınav seçiniz.</h3>
                </div>
            )}
        </div>
    );
};

export default SessionsPage;
