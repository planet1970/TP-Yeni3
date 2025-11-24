
import React, { useState, useMemo } from 'react';
import { CheckBadgeIcon, ClockIcon, BuildingIcon, HandRaiseIcon, TrashIcon, ArrowUturnLeftIcon } from '../components/icons';
import type { Attendant, AttendantAssignment, Exam, Session, Building, Hall } from '../types';

interface TaskAcceptPageProps {
    attendants: Attendant[];
    assignments: AttendantAssignment[];
    exams: Exam[];
    sessions: Session[];
    buildings: Building[];
    halls: Hall[];
    onRespond: (assignmentId: string, status: 'ACCEPTED' | 'REJECTED') => void;
}

const TaskCard: React.FC<{
    assignment: AttendantAssignment;
    examName: string;
    sessionName: string;
    sessionDate: string;
    placeName: string;
    roleName: string;
    status: 'ASSIGNED' | 'ACCEPTED' | 'REJECTED';
    onAccept: () => void;
    onReject: () => void;
    onReturn: () => void;
}> = ({ assignment, examName, sessionName, sessionDate, placeName, roleName, status, onAccept, onReject, onReturn }) => {
    let borderClass = 'border-gray-200';
    let bgClass = 'bg-white';

    if (status === 'ACCEPTED') {
        borderClass = 'border-green-200';
        bgClass = 'bg-green-50/30';
    } else if (status === 'REJECTED') {
        borderClass = 'border-red-200';
        bgClass = 'bg-red-50/30';
    }

    return (
        <div className={`border rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col ${borderClass} ${bgClass}`}>
            <div className="mb-4">
                <div className="flex justify-between items-start mb-2">
                    <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                        {sessionName}
                    </span>
                    <div className="flex items-center space-x-2">
                        <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2 py-1 rounded border border-blue-100">
                            {roleName}
                        </span>
                        {status === 'ACCEPTED' && (
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded flex items-center">
                                <CheckBadgeIcon className="h-3 w-3 mr-1" />
                                Kabul Edildi
                            </span>
                        )}
                        {status === 'REJECTED' && (
                            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded flex items-center">
                                <TrashIcon className="h-3 w-3 mr-1" />
                                Reddedildi
                            </span>
                        )}
                    </div>
                </div>
                <h4 className="text-md font-bold text-gray-800 mb-1 line-clamp-2" title={examName}>{examName}</h4>
                <div className="space-y-1 mt-3">
                    <div className="flex items-center text-gray-500 text-sm">
                        <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span>
                            {new Date(sessionDate).toLocaleDateString()} - {new Date(sessionDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                        <BuildingIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{placeName}</span>
                    </div>
                </div>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-100 flex space-x-3">
                {status === 'ASSIGNED' && (
                    <>
                        <button
                            onClick={onReject}
                            className="flex-1 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium text-sm transition-colors flex items-center justify-center"
                        >
                            <TrashIcon className="h-4 w-4 mr-1" />
                            Reddet
                        </button>
                        <button
                            onClick={onAccept}
                            className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm transition-colors flex items-center justify-center shadow-sm"
                        >
                            <CheckBadgeIcon className="h-4 w-4 mr-1" />
                            Kabul Et
                        </button>
                    </>
                )}
                {status === 'ACCEPTED' && (
                    <button
                        onClick={onReturn}
                        className="flex-1 py-2 bg-white border border-orange-200 text-orange-600 rounded-lg hover:bg-orange-50 font-medium text-sm transition-colors flex items-center justify-center shadow-sm"
                    >
                        <ArrowUturnLeftIcon className="h-4 w-4 mr-1" />
                        İade Et
                    </button>
                )}
                {status === 'REJECTED' && (
                    <div className="w-full text-center text-sm text-red-600 font-medium py-2 bg-white border border-red-100 rounded-lg">
                        Bu görev reddedildi.
                    </div>
                )}
            </div>
        </div>
    );
};

const TaskAcceptPage: React.FC<TaskAcceptPageProps> = ({
    attendants,
    assignments,
    exams,
    sessions,
    buildings,
    halls,
    onRespond
}) => {
    const [currentAttendantId, setCurrentAttendantId] = useState('');

    const myAssignments = useMemo(() => {
        if (!currentAttendantId) return [];
        
        return assignments.filter(a => 
            a.attendantId === currentAttendantId && 
            (a.status === 'ASSIGNED' || a.status === 'ACCEPTED' || a.status === 'REJECTED')
        ).sort((a, b) => {
            // Sort by Session Date only to prevent jumping when status changes
            const sessionA = sessions.find(s => s.id === a.sessionId);
            const sessionB = sessions.find(s => s.id === b.sessionId);
            
            if (!sessionA || !sessionB) return 0;
            
            const dateDiff = new Date(sessionA.date).getTime() - new Date(sessionB.date).getTime();
            if (dateDiff !== 0) return dateDiff;

            // Secondary sort by Role Name for stability
            return a.roleName.localeCompare(b.roleName);
        });
    }, [assignments, currentAttendantId, sessions]);

    return (
        <div className="container mx-auto h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <CheckBadgeIcon className="h-8 w-8 mr-2 text-orange-500" />
                    Görev Kabul
                </h2>
                
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
                    <h3 className="text-lg font-medium text-gray-500">Görevlerinizi görüntülemek için lütfen yukarıdan isminizi seçiniz.</h3>
                </div>
            ) : (
                <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myAssignments.map(assignment => {
                            const session = sessions.find(s => s.id === assignment.sessionId);
                            const exam = exams.find(e => e.id === session?.examId);
                            const building = buildings.find(b => b.id === assignment.buildingId);
                            const hall = assignment.hallId ? halls.find(h => h.id === assignment.hallId) : null;
                            
                            if (!session || !exam || !building) return null;

                            const placeName = hall 
                                ? `${building.name} / ${hall.name} (${hall.floor})`
                                : building.name;

                            return (
                                <TaskCard
                                    key={assignment.id}
                                    assignment={assignment}
                                    examName={exam.name}
                                    sessionName={session.name}
                                    sessionDate={session.date}
                                    placeName={placeName}
                                    roleName={assignment.roleName}
                                    status={assignment.status}
                                    onAccept={() => onRespond(assignment.id, 'ACCEPTED')}
                                    onReject={() => onRespond(assignment.id, 'REJECTED')}
                                    onReturn={() => {
                                        if (window.confirm('Görevi iade etmek istediğinize emin misiniz?')) {
                                            onRespond(assignment.id, 'REJECTED');
                                        }
                                    }}
                                />
                            );
                        })}
                    </div>

                    {myAssignments.length === 0 && (
                        <div className="text-center p-12 bg-white rounded-xl shadow-md border border-gray-100">
                            <CheckBadgeIcon className="h-12 w-12 mx-auto text-green-500 mb-4 opacity-50" />
                            <h3 className="text-lg font-bold text-gray-700">Görev Bulunamadı</h3>
                            <p className="text-gray-500">Şu an onayınızı bekleyen veya işlem yapılmış bir görev bulunmamaktadır.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TaskAcceptPage;
