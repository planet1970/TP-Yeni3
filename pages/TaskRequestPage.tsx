
import React, { useState, useMemo } from 'react';
import { HandRaiseIcon, ClockIcon, CheckBadgeIcon, TrashIcon } from '../components/icons';
import type { Exam, Session, Attendant, TaskRequest } from '../types';

interface TaskRequestPageProps {
    exams: Exam[];
    sessions: Session[];
    attendants: Attendant[];
    taskRequests: TaskRequest[];
    onRequestTask: (attendantId: string, sessionId: string) => void;
    onCancelRequest: (attendantId: string, sessionId: string) => void;
}

const TaskRequestPage: React.FC<TaskRequestPageProps> = ({
    exams,
    sessions,
    attendants,
    taskRequests,
    onRequestTask,
    onCancelRequest
}) => {
    // Mock Authentication / User Selection
    const [currentAttendantId, setCurrentAttendantId] = useState('');

    const activeExams = useMemo(() => exams.filter(e => e.isActive), [exams]);

    const getRequestStatus = (sessionId: string) => {
        if (!currentAttendantId) return null;
        return taskRequests.find(r => r.attendantId === currentAttendantId && r.sessionId === sessionId);
    };

    const handleToggleRequest = (sessionId: string) => {
        if (!currentAttendantId) return;
        
        const existingRequest = getRequestStatus(sessionId);
        if (existingRequest) {
            onCancelRequest(currentAttendantId, sessionId);
        } else {
            onRequestTask(currentAttendantId, sessionId);
        }
    };

    return (
        <div className="container mx-auto h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <HandRaiseIcon className="h-8 w-8 mr-2 text-orange-500" />
                    Görev İste
                </h2>
                
                {/* Mock User Selector */}
                <div className="flex items-center bg-white p-2 rounded-lg shadow-sm border border-orange-200">
                    <span className="text-sm text-gray-500 mr-2 font-medium">Aktif Görevli:</span>
                    <select 
                        value={currentAttendantId} 
                        onChange={(e) => setCurrentAttendantId(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 block p-1.5"
                    >
                        <option value="">-- Görevli Seçiniz --</option>
                        {attendants.filter(a => a.isActive).map(att => (
                            <option key={att.id} value={att.id}>
                                {att.title} {att.firstName} {att.lastName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {!currentAttendantId ? (
                <div className="flex flex-col items-center justify-center flex-1 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-12">
                    <HandRaiseIcon className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-500">İşlem yapmak için lütfen yukarıdan bir görevli seçiniz.</h3>
                </div>
            ) : (
                <div className="space-y-8 pb-10">
                    {activeExams.map(exam => {
                        const examSessions = sessions.filter(s => s.examId === exam.id);
                        if (examSessions.length === 0) return null;

                        return (
                            <div key={exam.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                                <div className="bg-slate-800 p-4 border-b border-slate-700">
                                    <h3 className="text-lg font-bold text-white">{exam.name}</h3>
                                    <p className="text-slate-300 text-sm">{exam.description}</p>
                                </div>
                                
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {examSessions.map(session => {
                                            const request = getRequestStatus(session.id);
                                            const isRequested = !!request;

                                            return (
                                                <div 
                                                    key={session.id} 
                                                    className={`border rounded-lg p-4 flex flex-col justify-between transition-all ${
                                                        isRequested 
                                                        ? 'bg-blue-50 border-blue-200 shadow-sm' 
                                                        : 'bg-white border-gray-200 hover:border-orange-300 hover:shadow-md'
                                                    }`}
                                                >
                                                    <div>
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                                                                Oturum {session.sequenceNumber}
                                                            </div>
                                                            {isRequested && (
                                                                <span className="flex items-center text-blue-600 text-xs font-bold">
                                                                    <CheckBadgeIcon className="h-4 w-4 mr-1" />
                                                                    İstendi
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h4 className="text-md font-bold text-gray-800 mb-1">{session.name}</h4>
                                                        <div className="flex items-center text-gray-500 text-sm mb-4">
                                                            <ClockIcon className="h-4 w-4 mr-1" />
                                                            <span>
                                                                {new Date(session.date).toLocaleDateString()} - {new Date(session.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => handleToggleRequest(session.id)}
                                                        className={`w-full py-2 rounded-lg font-medium text-sm flex items-center justify-center transition-colors ${
                                                            isRequested
                                                            ? 'bg-white border border-red-200 text-red-600 hover:bg-red-50'
                                                            : 'bg-orange-500 text-white hover:bg-orange-600 shadow-sm'
                                                        }`}
                                                    >
                                                        {isRequested ? (
                                                            <>
                                                                <TrashIcon className="h-4 w-4 mr-2" />
                                                                Talebi İptal Et
                                                            </>
                                                        ) : (
                                                            <>
                                                                <HandRaiseIcon className="h-4 w-4 mr-2" />
                                                                Görev İste
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {activeExams.length === 0 && (
                        <div className="text-center p-10 bg-white rounded-xl shadow-md">
                            <p className="text-gray-500 text-lg">Şu anda görev talep edilebilecek aktif bir sınav bulunmamaktadır.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TaskRequestPage;
