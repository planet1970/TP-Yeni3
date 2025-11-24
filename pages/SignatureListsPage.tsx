
import React, { useState, useMemo } from 'react';
import { DocumentTextIcon, PrinterIcon } from '../components/icons';
import type { 
    Exam, Session, Building, Hall, Attendant, AttendantAssignment, 
    SessionHall, Department, School 
} from '../types';

interface SignatureListsPageProps {
    exams: Exam[];
    sessions: Session[];
    buildings: Building[];
    halls: Hall[];
    attendants: Attendant[];
    assignments: AttendantAssignment[];
    sessionHalls: SessionHall[];
    departments: Department[];
    schools: School[];
}

interface ReportRow {
    no: number;
    name: string;
    role: string;
    departmentCode: string;
    buildingName: string;
    floor: string;
    hallName: string;
    priority: number;
}

const SignatureListsPage: React.FC<SignatureListsPageProps> = ({
    exams,
    sessions,
    buildings,
    halls,
    attendants,
    assignments,
    sessionHalls,
    departments,
    schools
}) => {
    const [selectedExamId, setSelectedExamId] = useState('');
    const [selectedReport, setSelectedReport] = useState<{
        session: Session;
        building: Building;
        rows: ReportRow[];
    } | null>(null);

    const activeExams = useMemo(() => exams.filter(e => e.isActive), [exams]);

    // Find available Session-Building pairs that have assignments
    const availablePairs = useMemo(() => {
        if (!selectedExamId) return [];
        
        const relevantSessions = sessions.filter(s => s.examId === selectedExamId);
        const pairs: { session: Session, building: Building }[] = [];
        const seen = new Set<string>();

        relevantSessions.forEach(session => {
            const sessionAssignments = assignments.filter(a => a.sessionId === session.id);
            sessionAssignments.forEach(assignment => {
                const key = `${session.id}-${assignment.buildingId}`;
                if (!seen.has(key)) {
                    const building = buildings.find(b => b.id === assignment.buildingId);
                    if (building) {
                        pairs.push({ session, building });
                        seen.add(key);
                    }
                }
            });
        });

        return pairs.sort((a, b) => {
            // Sort by Session Date then Building Name
            const dateDiff = new Date(a.session.date).getTime() - new Date(b.session.date).getTime();
            if (dateDiff !== 0) return dateDiff;
            return a.building.name.localeCompare(b.building.name);
        });
    }, [selectedExamId, sessions, assignments, buildings]);

    const handleShowReport = (session: Session, building: Building) => {
        // Filter assignments for this specific session and building
        const relevantAssignments = assignments.filter(a => 
            a.sessionId === session.id && a.buildingId === building.id && a.attendantId // Must have an attendant
        );

        // Define Priority for Sorting
        const rolePriority: Record<string, number> = {
            'Sınav Koordinatörü': 1,
            'Koordinatör Yardımcısı': 2,
            'Bina Sınav Sorumlusu': 3,
            'Bina Sınav Sor. Yrd.': 4,
            'Salon Başkanı': 10,
            'Gözetmen 1': 11,
            'Gözetmen 2': 12,
            'Y. Gözetmen': 20,
            'Merkez Sınav Görevlisi': 21,
            'Sınav Evrak Nakil Gör.': 22,
            'Hizmetli': 23,
            'Kaloriferci': 24,
            'Bina Güvenlik Görevlisi': 25
        };

        const rows: ReportRow[] = relevantAssignments
            .map(assignment => {
                const attendant = attendants.find(a => a.id === assignment.attendantId);
                const hall = assignment.hallId ? halls.find(h => h.id === assignment.hallId) : undefined;
                
                let departmentCode = '';
                if (hall) {
                     // Find department assigned to this hall in this session
                     // Note: A hall might host multiple departments, we can join them
                     const sessionHallEntries = sessionHalls.filter(sh => 
                        sh.sessionId === session.id && sh.hallId === hall.id
                     );
                     const codes = sessionHallEntries.map(sh => {
                         const dept = departments.find(d => d.id === sh.departmentId);
                         return dept ? dept.code : '';
                     }).filter(c => c).join(', ');
                     departmentCode = codes;
                }

                return {
                    no: 0, // Assigned later
                    name: attendant ? `${attendant.title} ${attendant.firstName} ${attendant.lastName}` : '?',
                    role: assignment.roleName,
                    departmentCode,
                    buildingName: building.name,
                    floor: hall ? hall.floor : '',
                    hallName: hall ? hall.name : '',
                    priority: rolePriority[assignment.roleName] || 99
                };
            })
            .sort((a, b) => {
                // Sort by Priority
                if (a.priority !== b.priority) return a.priority - b.priority;
                // Then by Hall Name (if exists)
                if (a.hallName && b.hallName && a.hallName !== b.hallName) return a.hallName.localeCompare(b.hallName);
                // Then by Name
                return a.name.localeCompare(b.name);
            })
            .map((row, index) => ({
                ...row,
                no: index + 1
            }));

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

    // --- RENDER ---

    if (selectedReport) {
        // Find Exam info
        const exam = exams.find(e => e.id === selectedReport.session.examId);
        
        return (
            <div className="bg-white min-h-screen print:bg-white">
                {/* Print Controls (Hidden on Print) */}
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

                {/* Report Content */}
                <div className="p-8 print:p-0 print:w-full">
                    <div className="border-4 border-black p-1 print:border-2 print:border-black">
                        <div className="border border-black p-2 print:p-1 print:border-black">
                            
                            {/* Header Area */}
                            <div className="text-center font-bold mb-2 text-gray-900">
                                {/* Row 1: University Name */}
                                <div className="text-base mb-1">T.C. TRAKYA ÜNİVERSİTESİ</div>
                                
                                {/* Row 2: Exam Description */}
                                {exam && <div className="text-sm uppercase font-bold mb-1">{exam.description}</div>}
                                
                                {/* Row 3: Exam Name */}
                                {exam && <h4 className="text-lg uppercase font-extrabold leading-none mb-2 text-black">{exam.name}</h4>}
                                
                                {/* Row 4: Session Info Bar */}
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
                                    <div>
                                        <span className="text-gray-600 font-semibold mr-1 print:text-black">Bina:</span>
                                        <span>{selectedReport.building.name}</span>
                                    </div>
                                </div>
                                
                                <div className="mt-1 bg-gray-100 py-1 uppercase font-bold text-sm border-b-2 border-black print:bg-transparent print:border-black">
                                    Sınav Görevlileri İmza Listesi
                                </div>
                            </div>

                            {/* Table */}
                            <table className="w-full border-collapse border border-black text-xs">
                                <thead>
                                    <tr className="bg-gray-100 print:bg-transparent h-8">
                                        <th className="border border-black px-1 w-8">No</th>
                                        <th className="border border-black px-2 text-left">İsim</th>
                                        <th className="border border-black px-2 text-left">Görevi</th>
                                        <th className="border border-black px-1 w-16">Bölüm</th>
                                        <th className="border border-black px-1 w-16">Kat</th>
                                        <th className="border border-black px-1 w-12">Salon</th>
                                        <th className="border border-black px-1 w-24">İmza</th>
                                        <th className="border border-black px-1 w-16">Saat</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedReport.rows.map((row) => (
                                        <tr key={row.no} className="h-[50px]">
                                            <td className="border border-black px-1 text-center align-middle font-semibold">{row.no}</td>
                                            <td className="border border-black px-2 font-semibold align-middle truncate max-w-[200px] text-sm">{row.name}</td>
                                            <td className="border border-black px-2 align-middle truncate max-w-[150px]">{row.role}</td>
                                            <td className="border border-black px-1 text-center align-middle">{row.departmentCode}</td>
                                            <td className="border border-black px-1 text-center align-middle">{row.floor}</td>
                                            <td className="border border-black px-1 text-center font-bold align-middle text-sm">{row.hallName}</td>
                                            <td className="border border-black align-middle"></td>
                                            <td className="border border-black align-middle"></td>
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
                    <DocumentTextIcon className="h-8 w-8 mr-2 text-orange-500" />
                    İmza Listeleri
                </h2>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Aktif Sınav Seçiniz</label>
                <select
                    value={selectedExamId}
                    onChange={(e) => setSelectedExamId(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                    <option value="">-- Sınav Seçiniz --</option>
                    {activeExams.map(e => (
                        <option key={e.id} value={e.id}>{e.name}</option>
                    ))}
                </select>
            </div>

            {selectedExamId && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden flex-1 flex flex-col">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Oturum</th>
                                    <th className="px-6 py-3">Tarih</th>
                                    <th className="px-6 py-3">Bina</th>
                                    <th className="px-6 py-3 text-right">İşlem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {availablePairs.map((pair, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 border-b last:border-0">
                                        <td className="px-6 py-4 font-medium text-gray-900">{pair.session.name}</td>
                                        <td className="px-6 py-4">
                                            {new Date(pair.session.date).toLocaleDateString()} {new Date(pair.session.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </td>
                                        <td className="px-6 py-4">{pair.building.name}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleShowReport(pair.session, pair.building)}
                                                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 text-xs font-bold transition-colors"
                                            >
                                                GÖSTER
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {availablePairs.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                                            Bu sınav için görevli ataması yapılmış oturum bulunamadı.
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

export default SignatureListsPage;
