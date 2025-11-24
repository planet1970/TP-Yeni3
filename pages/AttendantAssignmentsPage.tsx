
import React, { useState, useMemo } from 'react';
import { ClipboardCheckIcon, BuildingIcon, TrashIcon } from '../components/icons';
import type { Exam, Session, Hall, Building, SessionHall, Attendant, AttendantAssignment, TaskRequest } from '../types';

interface AttendantAssignmentsPageProps {
    exams: Exam[];
    sessions: Session[];
    halls: Hall[];
    buildings: Building[];
    sessionHalls: SessionHall[];
    attendants: Attendant[];
    assignments: AttendantAssignment[];
    taskRequests: TaskRequest[];
    onUpdateAssignment: (sessionId: string, buildingId: string, roleName: string, attendantId: string, hallId?: string) => void;
}

interface SelectionRowProps {
    label: string;
    currentAttendantId: string;
    assignmentStatus?: 'ASSIGNED' | 'ACCEPTED' | 'REJECTED';
    availableAttendants: Attendant[];
    onSelect: (attendantId: string) => void;
}

const SelectionRow: React.FC<SelectionRowProps> = ({ label, currentAttendantId, assignmentStatus, availableAttendants, onSelect }) => {
    const isRejected = assignmentStatus === 'REJECTED';

    return (
        <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-2 rounded-md">
            <div className="w-1/3 flex items-center">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                {isRejected && (
                    <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600" title="Görevli bu görevi reddetti">
                        <TrashIcon className="h-3 w-3 mr-1" />
                        RED
                    </span>
                )}
            </div>
            <select
                value={currentAttendantId}
                onChange={(e) => onSelect(e.target.value)}
                className={`w-2/3 ml-4 px-3 py-1.5 bg-white border rounded-md text-sm focus:outline-none focus:ring-2 ${
                    isRejected 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200 text-red-700 font-medium' 
                    : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                }`}
            >
                <option value="">{isRejected ? '-- Yeniden Seçiniz --' : '-- Seçiniz --'}</option>
                {availableAttendants.map(att => (
                    <option key={att.id} value={att.id}>
                        {att.title} {att.firstName} {att.lastName}
                    </option>
                ))}
            </select>
        </div>
    );
};

const AttendantAssignmentsPage: React.FC<AttendantAssignmentsPageProps> = ({
    exams,
    sessions,
    halls,
    buildings,
    sessionHalls,
    attendants,
    assignments,
    taskRequests,
    onUpdateAssignment
}) => {
    const [selectedExamId, setSelectedExamId] = useState('');
    const [selectedSessionId, setSelectedSessionId] = useState('');

    // --- Derived State ---
    const activeExams = useMemo(() => exams.filter(e => e.isActive), [exams]);
    
    const filteredSessions = useMemo(() => {
        return sessions
            .filter(s => s.examId === selectedExamId)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [sessions, selectedExamId]);

    // Active Attendants Only
    const activeAttendants = useMemo(() => attendants.filter(a => a.isActive), [attendants]);

    // Find Buildings and Halls used in the selected session
    const sessionDetails = useMemo(() => {
        if (!selectedSessionId) return [];

        // Get all halls assigned to any department in this session
        const assignedSessionHalls = sessionHalls.filter(sh => sh.sessionId === selectedSessionId);
        
        // Get unique Hall IDs
        const hallIds = Array.from(new Set(assignedSessionHalls.map(sh => sh.hallId)));
        
        // Get Hall Objects
        const usedHalls = halls.filter(h => hallIds.includes(h.id));
        
        // Group by Building
        const buildingGroups = new Map<string, Hall[]>();
        usedHalls.forEach(hall => {
            if (!buildingGroups.has(hall.buildingId)) {
                buildingGroups.set(hall.buildingId, []);
            }
            buildingGroups.get(hall.buildingId)?.push(hall);
        });

        // Convert to array structure for rendering
        const result: { building: Building, halls: Hall[] }[] = [];
        buildingGroups.forEach((hallsList, buildingId) => {
            const building = buildings.find(b => b.id === buildingId);
            if (building) {
                result.push({ building, halls: hallsList.sort((a, b) => a.name.localeCompare(b.name)) });
            }
        });

        return result;
    }, [selectedSessionId, sessionHalls, halls, buildings]);


    // --- Helper for Filtering Attendants ---
    // Returns available attendants who have REQUESTED this session, excluding those already assigned to OTHER roles in THIS session
    const getAvailableAttendants = (currentAttendantId?: string) => {
        if (!selectedSessionId) return [];

        // 1. Get IDs of attendants who requested this session
        const requesters = taskRequests
            .filter(req => req.sessionId === selectedSessionId)
            .map(req => req.attendantId);

        // 2. Get IDs of attendants already assigned to this session (Active or Accepted, ignoring Rejected for exclusion purposes so they can be reassigned)
        const assignedAttendantIds = assignments
            .filter(a => a.sessionId === selectedSessionId && a.status !== 'REJECTED')
            .map(a => a.attendantId);

        return activeAttendants.filter(attendant => {
            // Rule 1: Always include the person currently selected for this specific row (so value doesn't disappear)
            if (currentAttendantId && attendant.id === currentAttendantId) return true;

            // Rule 2: Must have requested the task for this session
            if (!requesters.includes(attendant.id)) return false;

            // Rule 3: Exclude if assigned elsewhere in this session (Double booking prevention)
            return !assignedAttendantIds.includes(attendant.id);
        });
    };

    // --- Role Definitions ---
    const buildingAdminRoles = [
        'Sınav Koordinatörü',
        'Koordinatör Yardımcısı',
        'Bina Sınav Sorumlusu',
        'Bina Sınav Sor. Yrd.'
    ];

    const buildingSupportRoles = [
        'Y. Gözetmen',
        'Merkez Sınav Görevlisi',
        'Sınav Evrak Nakil Gör.',
        'Hizmetli',
        'Kaloriferci',
        'Bina Güvenlik Görevlisi'
    ];

    const handleAssignmentChange = (buildingId: string, roleName: string, attendantId: string, hallId?: string) => {
        onUpdateAssignment(selectedSessionId, buildingId, roleName, attendantId, hallId);
    };

    const getAssignedAssignment = (buildingId: string, roleName: string, hallId?: string) => {
        return assignments.find(a => 
            a.sessionId === selectedSessionId &&
            a.buildingId === buildingId &&
            a.roleName === roleName &&
            a.hallId === hallId
        );
    };

    const renderSelectionRow = (label: string, buildingId: string, roleName: string, hallId?: string, key?: string) => {
        const assignment = getAssignedAssignment(buildingId, roleName, hallId);
        const currentId = assignment?.attendantId || '';
        const status = assignment?.status;
        const options = getAvailableAttendants(currentId);

        return (
            <SelectionRow
                key={key}
                label={label}
                currentAttendantId={currentId}
                assignmentStatus={status}
                availableAttendants={options}
                onSelect={(val) => handleAssignmentChange(buildingId, roleName, val, hallId)}
            />
        );
    };

    return (
        <div className="container mx-auto h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <ClipboardCheckIcon className="h-8 w-8 mr-2 text-orange-500" />
                    Görevli Tanımlama
                </h2>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Aktif Sınav</label>
                    <select
                        value={selectedExamId}
                        onChange={(e) => { setSelectedExamId(e.target.value); setSelectedSessionId(''); }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="">-- Sınav Seçiniz --</option>
                        {activeExams.map(e => (
                            <option key={e.id} value={e.id}>{e.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Oturum</label>
                    <select
                        value={selectedSessionId}
                        onChange={(e) => setSelectedSessionId(e.target.value)}
                        disabled={!selectedExamId}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                    >
                        <option value="">-- Oturum Seçiniz --</option>
                        {filteredSessions.map(s => (
                            <option key={s.id} value={s.id}>{s.name} ({new Date(s.date).toLocaleDateString()} {new Date(s.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Content Area */}
            {selectedSessionId ? (
                <div className="flex-1 overflow-y-auto space-y-8">
                    {sessionDetails.map(({ building, halls }) => (
                        <div key={building.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                            {/* Building Header */}
                            <div className="bg-slate-800 text-white p-4 flex items-center">
                                <BuildingIcon className="h-6 w-6 mr-2 text-orange-400" />
                                <h3 className="text-lg font-bold">{building.name}</h3>
                            </div>

                            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left Column: Admin & Support Roles */}
                                <div className="space-y-6">
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 border-b pb-1">Bina Sınav Yönetimi</h4>
                                        <div className="space-y-1">
                                            {buildingAdminRoles.map(role => renderSelectionRow(role, building.id, role, undefined, role))}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 border-b pb-1">Bina Destek Hizmetleri</h4>
                                        <div className="space-y-1">
                                            {buildingSupportRoles.map(role => renderSelectionRow(role, building.id, role, undefined, role))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Hall Roles */}
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                    <h4 className="text-xs font-bold text-blue-600 uppercase mb-3 border-b border-blue-200 pb-1">Salon Görevlileri</h4>
                                    <div className="space-y-6">
                                        {halls.map(hall => (
                                            <div key={hall.id} className="bg-white p-3 rounded shadow-sm border border-gray-100">
                                                <h5 className="font-bold text-gray-800 mb-2 border-b pb-1 flex justify-between">
                                                    <span>{hall.name}</span>
                                                    <span className="text-xs font-normal text-gray-500">{hall.floor}</span>
                                                </h5>
                                                <div className="space-y-1">
                                                    {renderSelectionRow("Salon Başkanı", building.id, "Salon Başkanı", hall.id)}
                                                    {renderSelectionRow("Gözetmen 1", building.id, "Gözetmen 1", hall.id)}
                                                    {renderSelectionRow("Gözetmen 2", building.id, "Gözetmen 2", hall.id)}
                                                </div>
                                            </div>
                                        ))}
                                        {halls.length === 0 && (
                                            <p className="text-gray-500 italic text-sm">Bu binada bu oturum için aktif salon bulunmamaktadır.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {sessionDetails.length === 0 && (
                        <div className="text-center p-12 bg-white rounded-xl shadow-md border-2 border-dashed border-gray-300">
                            <p className="text-gray-500 text-lg">Bu oturum için tanımlanmış salon/bina bulunamadı.</p>
                            <p className="text-gray-400 text-sm mt-2">Lütfen "Oturum-Salon" menüsünden atama yapınız.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center flex-1 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-12">
                    <ClipboardCheckIcon className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-500">Görevli tanımlamak için lütfen yukarıdan Sınav ve Oturum seçiniz.</h3>
                </div>
            )}
        </div>
    );
};

export default AttendantAssignmentsPage;
