
import React, { useState, useMemo } from 'react';
import { BadgeIcon, PrinterIcon } from '../components/icons';
import type { Attendant, AttendantAssignment, Exam, Session, Building, Hall } from '../types';

interface TaskCardsPageProps {
    attendants: Attendant[];
    assignments: AttendantAssignment[];
    exams: Exam[];
    sessions: Session[];
    buildings: Building[];
    halls: Hall[];
}

const TaskCardsPage: React.FC<TaskCardsPageProps> = ({
    attendants,
    assignments,
    exams,
    sessions,
    buildings,
    halls
}) => {
    const [currentAttendantId, setCurrentAttendantId] = useState('');

    const activeAttendant = useMemo(() => {
        return attendants.find(a => a.id === currentAttendantId);
    }, [attendants, currentAttendantId]);

    const acceptedTasks = useMemo(() => {
        if (!currentAttendantId) return [];
        
        return assignments
            .filter(a => a.attendantId === currentAttendantId && a.status === 'ACCEPTED')
            .sort((a, b) => {
                const sessionA = sessions.find(s => s.id === a.sessionId);
                const sessionB = sessions.find(s => s.id === b.sessionId);
                if (!sessionA || !sessionB) return 0;
                return new Date(sessionA.date).getTime() - new Date(sessionB.date).getTime();
            });
    }, [assignments, currentAttendantId, sessions]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="container mx-auto h-full flex flex-col">
            <div className="flex justify-between items-center mb-6 print:hidden">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <BadgeIcon className="h-8 w-8 mr-2 text-orange-500" />
                    Görev Kartı Oluştur
                </h2>
                
                <div className="flex items-center space-x-4">
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
                    
                    <button 
                        onClick={handlePrint}
                        disabled={!currentAttendantId || acceptedTasks.length === 0}
                        className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-bold flex items-center transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <PrinterIcon className="h-5 w-5 mr-2" />
                        Yazdır
                    </button>
                </div>
            </div>

            {!currentAttendantId ? (
                <div className="flex flex-col items-center justify-center flex-1 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-12 print:hidden">
                    <BadgeIcon className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-500">Görev kartlarını görüntülemek için lütfen yukarıdan isminizi seçiniz.</h3>
                </div>
            ) : (
                <div className="print:w-full">
                    {/* Warning for screen view */}
                    <div className="mb-4 p-4 bg-blue-50 text-blue-700 rounded-md border border-blue-200 print:hidden">
                        <p className="text-sm font-medium">
                            <span className="font-bold mr-1">Bilgi:</span> 
                            Sadece "Kabul Edilmiş" görevler için kart oluşturulmaktadır.
                        </p>
                    </div>

                    {/* Grid for Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2 print:gap-4 print:block">
                        {acceptedTasks.map(assignment => {
                            const session = sessions.find(s => s.id === assignment.sessionId);
                            const building = buildings.find(b => b.id === assignment.buildingId);
                            const hall = assignment.hallId ? halls.find(h => h.id === assignment.hallId) : null;
                            
                            if (!session || !building) return null;

                            const formattedDate = new Date(session.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
                            const formattedTime = new Date(session.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

                            return (
                                <div key={assignment.id} className="border-2 border-blue-900 bg-white w-full max-w-[450px] mx-auto break-inside-avoid mb-8 print:mb-6 print:inline-block print:mr-4 print:align-top print:w-[48%] shadow-lg print:shadow-none">
                                    {/* Header */}
                                    <div className="bg-blue-900 text-white p-2 flex items-center h-22 relative overflow-hidden">
                                        {/* Logo Area */}
                                        <div className="z-10 shrink-0 ml-2 bg-white rounded-full p-1 h-16 w-16 flex items-center justify-center">
                                            <img 
                                                src="https://cdn.trakya.edu.tr/images/logolar/tu_armasi_renkli_tr.png" 
                                                alt="Logo"
                                                className="h-14 w-14 object-contain"
                                                onError={(e) => {
                                                    e.currentTarget.src = 'https://via.placeholder.com/100x100?text=LOGO';
                                                }}
                                            />
                                        </div>
                                        
                                        {/* Text Area */}
                                        <div className="z-10 flex flex-col items-center justify-center w-full mr-2 pl-2">
                                            <h3 className="font-serif font-bold text-lg uppercase tracking-wider leading-none text-center mb-1">Trakya Üniversitesi</h3>
                                            <span className="text-white text-xs font-medium leading-tight text-center uppercase tracking-wide opacity-90">Uzaktan Eğitim Araştırma ve Uygulama Mrk.</span>
                                        </div>
                                        
                                        {/* Decorative Curve Simulation (Gray now) */}
                                        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gray-500 rounded-full opacity-30 print:opacity-20"></div>
                                    </div>

                                    {/* Body */}
                                    <div className="p-4 text-sm text-gray-800 bg-white">
                                        <div className="flex">
                                            {/* Info Column */}
                                            <div className="flex-1 pr-3 space-y-2">
                                                <div className="border-b border-gray-100 pb-1">
                                                    <span className="font-bold block text-[10px] text-gray-500 uppercase tracking-wider">Ad Soyad</span>
                                                    <span className="block font-bold text-base leading-tight">{activeAttendant?.title} {activeAttendant?.firstName} {activeAttendant?.lastName}</span>
                                                </div>
                                                <div className="border-b border-gray-100 pb-1">
                                                    <span className="font-bold block text-[10px] text-gray-500 uppercase tracking-wider">Tarih</span>
                                                    <span className="block font-semibold text-sm leading-tight">{formattedDate} - {formattedTime}</span>
                                                </div>
                                                <div className="border-b border-gray-100 pb-1">
                                                    <span className="font-bold block text-[10px] text-gray-500 uppercase tracking-wider">Görev</span>
                                                    <span className="block font-bold text-sm text-blue-900 leading-tight">{assignment.roleName}</span>
                                                </div>
                                                <div>
                                                    <span className="font-bold block text-[10px] text-gray-500 uppercase tracking-wider">Sınav Yeri</span>
                                                    <span className="block font-semibold text-xs leading-tight">{building.name}</span>
                                                    <span className="block font-bold text-sm mt-0.5">{hall ? `Salon: ${hall.name} (${hall.floor})` : 'Salon: _ - _'}</span>
                                                </div>
                                            </div>

                                            {/* Photo Column */}
                                            <div className="w-28 shrink-0 flex flex-col">
                                                <div className="border border-gray-300 rounded p-0.5 bg-gray-50 h-36 w-28 shadow-sm flex items-center justify-center overflow-hidden">
                                                    {/* Subtle Gray User Icon Placeholder */}
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-20 h-20 text-gray-300">
                                                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer (Gray border instead of orange) */}
                                    <div className="bg-blue-900 text-white py-1.5 px-4 text-center font-bold uppercase text-xs tracking-widest border-t-2 border-gray-400">
                                        {session.name}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {acceptedTasks.length === 0 && (
                        <div className="text-center p-12 bg-white rounded-xl shadow-md border border-gray-100 print:hidden">
                            <p className="text-gray-500">Bu görevli için kabul edilmiş aktif bir görev bulunmamaktadır.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TaskCardsPage;
