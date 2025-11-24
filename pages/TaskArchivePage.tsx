
import React, { useState, useMemo } from 'react';
import { ArchiveBoxIcon, CheckBadgeIcon, ClockIcon, BuildingIcon, HandRaiseIcon, TrashIcon } from '../components/icons';
import type { Attendant, AttendantAssignment, Exam, Session, Building, Hall } from '../types';

interface TaskArchivePageProps {
    attendants: Attendant[];
    assignments: AttendantAssignment[];
    exams: Exam[];
    sessions: Session[];
    buildings: Building[];
    halls: Hall[];
}

const TaskArchivePage: React.FC<TaskArchivePageProps> = ({ 
    attendants,
    assignments,
    exams,
    sessions,
    buildings,
    halls
}) => {
    const [currentAttendantId, setCurrentAttendantId] = useState('');

    const archivedAssignments = useMemo(() => {
        if (!currentAttendantId) return [];
        
        return assignments.filter(a => 
            a.attendantId === currentAttendantId && 
            (a.status === 'ACCEPTED' || a.status === 'REJECTED')
        ).sort((a, b) => {
            const sessionA = sessions.find(s => s.id === a.sessionId);
            const sessionB = sessions.find(s => s.id === b.sessionId);
            if (!sessionA || !sessionB) return 0;
            return new Date(sessionB.date).getTime() - new Date(sessionA.date).getTime(); // Newest first
        });
    }, [assignments, currentAttendantId, sessions]);

    return (
        <div className="container mx-auto h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <ArchiveBoxIcon className="h-8 w-8 mr-2 text-orange-500" />
                    Arşiv
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
                    <h3 className="text-lg font-medium text-gray-500">Geçmiş görevlerinizi görüntülemek için lütfen yukarıdan isminizi seçiniz.</h3>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3">Sınav</th>
                                    <th className="px-6 py-3">Oturum</th>
                                    <th className="px-6 py-3">Tarih/Saat</th>
                                    <th className="px-6 py-3">Görev Yeri</th>
                                    <th className="px-6 py-3">Görevi</th>
                                    <th className="px-6 py-3 text-center">Durum</th>
                                </tr>
                            </thead>
                            <tbody>
                                {archivedAssignments.map(assignment => {
                                    const session = sessions.find(s => s.id === assignment.sessionId);
                                    const exam = exams.find(e => e.id === session?.examId);
                                    const building = buildings.find(b => b.id === assignment.buildingId);
                                    const hall = assignment.hallId ? halls.find(h => h.id === assignment.hallId) : null;

                                    if (!session || !exam || !building) return null;

                                    const placeName = hall 
                                        ? `${building.name} / ${hall.name}`
                                        : building.name;

                                    return (
                                        <tr key={assignment.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{exam.name}</td>
                                            <td className="px-6 py-4">{session.name}</td>
                                            <td className="px-6 py-4 flex items-center">
                                                <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                                                <span>{new Date(session.date).toLocaleDateString()} {new Date(session.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <BuildingIcon className="h-4 w-4 mr-2 text-gray-400" />
                                                    <span>{placeName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-blue-600">{assignment.roleName}</td>
                                            <td className="px-6 py-4 text-center">
                                                {assignment.status === 'ACCEPTED' ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        <CheckBadgeIcon className="h-3 w-3 mr-1" />
                                                        Kabul Edildi
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        <TrashIcon className="h-3 w-3 mr-1" />
                                                        Reddedildi
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {archivedAssignments.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                            Arşivlenmiş (kabul veya red edilmiş) görev bulunamadı.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskArchivePage;
