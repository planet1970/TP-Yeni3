
import React, { useState, useMemo } from 'react';
import { TrashIcon, HallIcon } from '../components/icons';
import type { Exam, Building, Hall, ExamHall } from '../types';

interface ExamHallsPageProps {
    exams: Exam[];
    buildings: Building[];
    halls: Hall[];
    examHalls: ExamHall[];
    onAddExamHall: (examId: string, hallId: string) => void;
    onRemoveExamHall: (examId: string, hallId: string) => void;
}

const ExamHallsPage: React.FC<ExamHallsPageProps> = ({
    exams,
    buildings,
    halls,
    examHalls,
    onAddExamHall,
    onRemoveExamHall,
}) => {
    const [selectedExamId, setSelectedExamId] = useState<string>('');
    const [selectedBuildingId, setSelectedBuildingId] = useState<string>('');

    // Filter only active exams for selection
    const activeExams = useMemo(() => exams.filter(e => e.isActive), [exams]);

    // Handlers
    const handleExamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedExamId(e.target.value);
    };

    const handleBuildingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBuildingId(e.target.value);
    };

    // Filter Lists
    const availableHalls = useMemo(() => {
        return halls.filter(h => h.buildingId === selectedBuildingId);
    }, [halls, selectedBuildingId]);

    // Halls already added to the selected exam
    const addedHallsList = useMemo(() => {
        if (!selectedExamId) return [];
        const examHallEntries = examHalls.filter(eh => eh.examId === selectedExamId);
        
        return examHallEntries.map(eh => {
            const hall = halls.find(h => h.id === eh.hallId);
            const building = buildings.find(b => b.id === hall?.buildingId);
            return {
                ...hall,
                ...eh, // Includes id (ExamHallId)
                hallName: hall?.name,
                buildingName: building?.name,
                capacity: hall?.capacity,
                floor: hall?.floor
            };
        }).filter(item => item.hallId); // Filter out undefined halls
    }, [examHalls, selectedExamId, halls, buildings]);

    // Check if a specific hall is already added
    const isHallAdded = (hallId: string) => {
        return examHalls.some(eh => eh.examId === selectedExamId && eh.hallId === hallId);
    };

    return (
        <div className="container mx-auto h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <HallIcon className="h-8 w-8 mr-2 text-orange-500" />
                    Sınav - Salon Yönetimi
                </h2>
            </div>

            {/* Exam Selection Bar */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                <label htmlFor="examSelect" className="block text-sm font-medium text-gray-700 mb-2">
                    İşlem Yapılacak Aktif Sınavı Seçiniz
                </label>
                <select
                    id="examSelect"
                    value={selectedExamId}
                    onChange={handleExamChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                >
                    <option value="">-- Bir Sınav Seçiniz --</option>
                    {activeExams.map(exam => (
                        <option key={exam.id} value={exam.id}>
                            {exam.name} ({new Date(exam.closingDate).toLocaleDateString()})
                        </option>
                    ))}
                </select>
                {activeExams.length === 0 && (
                    <p className="text-red-500 text-sm mt-2">Listelenecek aktif sınav bulunamadı. Lütfen Sınavlar sayfasından bir sınavı aktif duruma getiriniz.</p>
                )}
            </div>

            {selectedExamId ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
                    
                    {/* Left Panel: Add Halls */}
                    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Salon Ekleme Paneli</h3>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bina</label>
                            <select
                                value={selectedBuildingId}
                                onChange={handleBuildingChange}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            >
                                <option value="">-- Bina Seçiniz --</option>
                                {buildings.map(b => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-1 overflow-auto border rounded-lg mt-2">
                            {selectedBuildingId ? (
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-3">Salon Adı</th>
                                            <th className="px-4 py-3">Kat</th>
                                            <th className="px-4 py-3 text-center">Kapasite</th>
                                            <th className="px-4 py-3 text-right">İşlem</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {availableHalls.map(hall => {
                                            const added = isHallAdded(hall.id);
                                            return (
                                                <tr key={hall.id} className="bg-white border-b hover:bg-gray-50">
                                                    <td className="px-4 py-3 font-medium">{hall.name}</td>
                                                    <td className="px-4 py-3">{hall.floor}</td>
                                                    <td className="px-4 py-3 text-center">{hall.capacity}</td>
                                                    <td className="px-4 py-3 text-right">
                                                        <button
                                                            onClick={() => onAddExamHall(selectedExamId, hall.id)}
                                                            disabled={added}
                                                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                                                added 
                                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                            }`}
                                                        >
                                                            {added ? 'Eklendi' : 'Ekle'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {availableHalls.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">Bu binada salon bulunamadı.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400 text-sm p-4">
                                    Salonları listelemek için Bina seçiniz.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Assigned Halls */}
                    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col">
                         <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 flex justify-between items-center">
                             <span>Sınava Dahil Edilen Salonlar</span>
                             <span className="text-sm bg-orange-100 text-orange-800 py-0.5 px-2.5 rounded-full">{addedHallsList.length}</span>
                         </h3>
                         
                         <div className="flex-1 overflow-auto border rounded-lg">
                            {addedHallsList.length > 0 ? (
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-3">Salon Adı</th>
                                            <th className="px-4 py-3">Bina</th>
                                            <th className="px-4 py-3">Kat</th>
                                            <th className="px-4 py-3 text-center">Kapasite</th>
                                            <th className="px-4 py-3 text-right">İşlem</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {addedHallsList.map(item => (
                                            <tr key={item.hallId} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-4 py-3 font-medium text-gray-900">{item.hallName}</td>
                                                <td className="px-4 py-3">{item.buildingName}</td>
                                                <td className="px-4 py-3">{item.floor}</td>
                                                <td className="px-4 py-3 text-center">{item.capacity}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <button
                                                        onClick={() => onRemoveExamHall(selectedExamId, item.hallId as string)}
                                                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                                                        title="Çıkar"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm p-4">
                                    <HallIcon className="h-12 w-12 mb-2 opacity-20" />
                                    <p>Bu sınava henüz salon eklenmemiş.</p>
                                    <p className="text-xs mt-1">Sol panelden salon seçerek ekleyebilirsiniz.</p>
                                </div>
                            )}
                         </div>
                    </div>

                </div>
            ) : (
                 <div className="flex flex-col items-center justify-center flex-1 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-12">
                    <HallIcon className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-500">Lütfen işlem yapmak için yukarıdan bir sınav seçiniz.</h3>
                </div>
            )}
        </div>
    );
};

export default ExamHallsPage;