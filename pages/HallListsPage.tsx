
import React, { useState, useMemo } from 'react';
import { DocumentDuplicateIcon, PrinterIcon } from '../components/icons';
import type { 
    Exam, Session, Building, Hall, Attendant, AttendantAssignment, 
    SessionHall
} from '../types';

interface HallListsPageProps {
    exams: Exam[];
    sessions: Session[];
    buildings: Building[];
    halls: Hall[];
    attendants: Attendant[];
    assignments: AttendantAssignment[];
    sessionHalls: SessionHall[];
}

interface ReportRow {
    no: number;
    name: string;
    role: string;
    floor: string;
    hallName: string;
}

const HallListsPage: React.FC<HallListsPageProps> = ({
    exams,
    sessions,
    buildings,
    halls,
    attendants,
    assignments,
    sessionHalls,
}) => {
    const [selectedExamId, setSelectedExamId] = useState('');
    const [selectedSessionId, setSelectedSessionId] = useState('');
    const [selectedReport, setSelectedReport] = useState<{
        session: Session;
        building: Building;
        rows: ReportRow[];
    } | null>(null);

    const activeExams = useMemo(() => exams.filter(e => e.isActive), [exams]);

    const filteredSessions = useMemo(() => {
        return sessions
            .filter(s => s.examId === selectedExamId)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [sessions, selectedExamId]);

    // Find Buildings used in the selected session
    const availableBuildings = useMemo(() => {
        if (!selectedSessionId) return [];

        // Get all halls assigned to any department in this session
        const assignedSessionHalls = sessionHalls.filter(sh => sh.sessionId === selectedSessionId);
        const hallIds = new Set(assignedSessionHalls.map(sh => sh.hallId));
        
        const usedHalls = halls.filter(h => hallIds.has(h.id));
        const buildingIds = new Set(usedHalls.map(h => h.buildingId));

        return buildings.filter(b => buildingIds.has(b.id));
    }, [selectedSessionId, sessionHalls, halls, buildings]);

    const handleShowReport = (session: Session, building: Building) => {
        // 1. Find all Halls in this building that are used in this session
        const relevantSessionHalls = sessionHalls.filter(sh => sh.sessionId === session.id);
        const relevantHallIds = new Set(relevantSessionHalls.map(sh => sh.hallId));
        
        const buildingHalls = halls.filter(h => h.buildingId === building.id && relevantHallIds.has(h.id));

        // 2. For each hall, find the "Salon Başkanı" assignment
        const rows: ReportRow[] = buildingHalls
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((hall, index) => {
                const assignment = assignments.find(a => 
                    a.sessionId === session.id && 
                    a.buildingId === building.id && 
                    a.hallId === hall.id &&
                    (a.roleName === 'Salon Başkanı' || a.roleName.includes('Başkanı'))
                );

                let attendantName = '';
                if (assignment) {
                    const attendant = attendants.find(a => a.id === assignment.attendantId);
                    if (attendant) {
                        attendantName = `${attendant.title} ${attendant.firstName} ${attendant.lastName}`;
                    }
                }

                return {
                    no: index + 1,
                    name: attendantName || '(Atanmadı)',
                    role: 'Salon Başkanı',
                    floor: hall.floor,
                    hallName: hall.name
                };
            });

        setSelectedReport({
            session,
            building,
            rows
        });
    };

    const handleBack = () => {
        setSelectedReport(null);
    };

    const handlePrint = () => {
        window.print();
    };

    // --- RENDER REPORT ---
    if (selectedReport) {
        const exam = exams.find(e => e.id === selectedReport.session.examId);
        
        return (
            <div className="bg-white min-h-screen print:bg-white">
                {/* Controls */}
                <div className="p-4 bg-gray-100 border-b flex justify-between items-center print:hidden sticky top-0 z-10 shadow-sm">
                    <button 
                        onClick={handleBack}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                    >
                        &larr; Geri Dön
                    </button>
                    <button 
                        onClick={handlePrint}
                        className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-bold flex items-center transition-colors shadow-sm"
                    >
                        <PrinterIcon className="h-5 w-5 mr-2" />
                        Yazdır
                    </button>
                </div>

                {/* Report Body */}
                <div className="p-8 print:p-0 print:w-full">
                    <div className="border-4 border-black p-1 print:border-2 print:border-black">
                        <div className="border border-black p-2 print:p-1 print:border-black">
                            
                            {/* Header */}
                            <div className="text-center font-bold mb-2 text-gray-900">
                                <div className="text-base mb-1">T.C. TRAKYA ÜNİVERSİTESİ</div>
                                {exam && <div className="text-sm uppercase font-bold mb-1">{exam.description}</div>}
                                {exam && <h4 className="text-lg uppercase font-extrabold leading-none mb-2 text-black">{exam.name}</h4>}
                                
                                <div className="flex justify-center items-center space-x-6 text-xs uppercase border-t border-b border-black py-2 my-2 print:border-black">
                                    <div>
                                        <span className="text-gray-600 font-semibold mr-1 print:text-black">Oturum:</span>
                                        <span>{selectedReport.session.name}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 font-semibold mr-1 print:text-black">Tarih:</span>
                                        <span>{new Date(selectedReport.session.date).toLocaleDateString()}</span>
                                        <span className="ml-1">{new Date(selectedReport.session.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                </div>
                                
                                <div className="mt-1 bg-gray-100 py-1 uppercase font-bold text-sm border-b-2 border-black print:bg-transparent print:border-black italic">
                                    SALON EVRAKI TESLİM BELGESİ
                                </div>
                            </div>

                            {/* Table */}
                            <table className="w-full border-collapse border border-black text-xs">
                                <thead>
                                    <tr className="bg-gray-100 print:bg-transparent h-8">
                                        <th rowSpan={2} className="border border-black px-2 text-left w-1/4">İsim</th>
                                        <th rowSpan={2} className="border border-black px-2 text-left w-32">Görevi</th>
                                        <th rowSpan={2} className="border border-black px-1 w-16">Kat</th>
                                        <th rowSpan={2} className="border border-black px-1 w-12">Salon</th>
                                        <th colSpan={2} className="border border-black px-1 text-center">Teslim Alma</th>
                                        <th colSpan={2} className="border border-black px-1 text-center">Teslim Etme</th>
                                    </tr>
                                    <tr className="bg-gray-50 print:bg-transparent h-6">
                                        <th className="border border-black px-1 w-16">Saat</th>
                                        <th className="border border-black px-1">İmza</th>
                                        <th className="border border-black px-1 w-16">Saat</th>
                                        <th className="border border-black px-1">İmza</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedReport.rows.map((row) => (
                                        <tr key={row.no} className="h-[50px]">
                                            <td className="border border-black px-2 font-bold align-middle text-sm">{row.name}</td>
                                            <td className="border border-black px-2 align-middle font-medium">{row.role}</td>
                                            <td className="border border-black px-1 text-center align-middle">{row.floor}</td>
                                            <td className="border border-black px-1 text-center font-bold align-middle text-sm">{row.hallName}</td>
                                            
                                            {/* Delivery In */}
                                            <td className="border border-black bg-gray-100 print:bg-transparent"></td>
                                            <td className="border border-black bg-gray-100 print:bg-transparent"></td>
                                            
                                            {/* Delivery Out */}
                                            <td className="border border-black bg-gray-100 print:bg-transparent"></td>
                                            <td className="border border-black bg-gray-100 print:bg-transparent"></td>
                                        </tr>
                                    ))}
                                    {/* Filler Rows if needed, standard form look */}
                                    {[...Array(3)].map((_, i) => (
                                        <tr key={`fill-${i}`} className="h-[50px]">
                                            <td className="border border-black"></td>
                                            <td className="border border-black"></td>
                                            <td className="border border-black"></td>
                                            <td className="border border-black"></td>
                                            <td className="border border-black bg-gray-100 print:bg-transparent"></td>
                                            <td className="border border-black bg-gray-100 print:bg-transparent"></td>
                                            <td className="border border-black bg-gray-100 print:bg-transparent"></td>
                                            <td className="border border-black bg-gray-100 print:bg-transparent"></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- Selection View ---
    return (
        <div className="container mx-auto h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <DocumentDuplicateIcon className="h-8 w-8 mr-2 text-orange-500" />
                    Salon Listeleri
                </h2>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Aktif Sınav Seçiniz</label>
                    <select
                        value={selectedExamId}
                        onChange={(e) => { setSelectedExamId(e.target.value); setSelectedSessionId(''); }}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="">-- Sınav Seçiniz --</option>
                        {activeExams.map(e => (
                            <option key={e.id} value={e.id}>{e.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Oturum Seçiniz</label>
                    <select
                        value={selectedSessionId}
                        onChange={(e) => setSelectedSessionId(e.target.value)}
                        disabled={!selectedExamId}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                    >
                        <option value="">-- Oturum Seçiniz --</option>
                        {filteredSessions.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedSessionId && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden flex-1 flex flex-col">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Bina</th>
                                    <th className="px-6 py-3">Açıklama</th>
                                    <th className="px-6 py-3 text-right">İşlem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {availableBuildings.map((building) => {
                                    const session = sessions.find(s => s.id === selectedSessionId)!;
                                    return (
                                        <tr key={building.id} className="hover:bg-gray-50 border-b last:border-0">
                                            <td className="px-6 py-4 font-medium text-gray-900">{building.name}</td>
                                            <td className="px-6 py-4">{building.description}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleShowReport(session, building)}
                                                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 text-xs font-bold transition-colors"
                                                >
                                                    GÖSTER
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {availableBuildings.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-10 text-center text-gray-500">
                                            Bu oturum için aktif salon/bina kaydı bulunamadı.
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

export default HallListsPage;
