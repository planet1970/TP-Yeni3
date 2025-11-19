
import React, { useState, useMemo, useEffect } from 'react';
import { EditIcon, TrashIcon } from '../components/icons';
import type { Hall, Building } from '../types';

interface HallsPageProps {
    initialBuildingId?: string;
    allBuildings: Building[];
    allHalls: Hall[];
    onAdd: (hall: Omit<Hall, 'id'>) => void;
    onUpdate: (hall: Hall) => void;
    onDelete: (hallId: string) => void;
    onNavigate: (pageState: { page: string; context?: Record<string, any> }) => void;
}

const HallForm: React.FC<{
    hall: Partial<Hall> | null;
    onSave: (hall: Omit<Hall, 'id' | 'buildingId'> & { id?: string }) => void;
    onCancel: () => void;
}> = ({ hall, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: hall?.name || '',
        floor: hall?.floor || '',
        capacity: hall?.capacity || 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'number' ? parseInt(value, 10) || 0 : value 
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: hall?.id });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
                {hall?.id ? 'Salon Bilgilerini Düzenle' : 'Yeni Salon Ekle'}
            </h3>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Salon Adı</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            required
                        />
                    </div>
                     <div>
                        <label htmlFor="floor" className="block text-sm font-medium text-gray-700">Kat Bilgisi</label>
                        <input
                            type="text"
                            name="floor"
                            id="floor"
                            value={formData.floor}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Kapasite</label>
                        <input
                            type="number"
                            name="capacity"
                            id="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
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

const HallsPage: React.FC<HallsPageProps> = ({ 
    initialBuildingId, 
    allBuildings, 
    allHalls, 
    onAdd, 
    onUpdate, 
    onDelete, 
    onNavigate 
}) => {
    const [selectedBuildingId, setSelectedBuildingId] = useState<string | undefined>(initialBuildingId);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingHall, setEditingHall] = useState<Hall | null>(null);

    useEffect(() => {
        setSelectedBuildingId(initialBuildingId);
    }, [initialBuildingId]);

    const handleBuildingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const buildingId = e.target.value;
        setSelectedBuildingId(buildingId || undefined);
        setIsFormVisible(false);
        setEditingHall(null);
    };

    const filteredHalls = useMemo(() => {
        if (!selectedBuildingId) return [];
        return allHalls.filter(h => h.buildingId === selectedBuildingId);
    }, [allHalls, selectedBuildingId]);
    
    const selectedBuildingName = useMemo(() => {
        return allBuildings.find(b => b.id === selectedBuildingId)?.name;
    }, [allBuildings, selectedBuildingId]);

    const handleAddNew = () => {
        setEditingHall(null);
        setIsFormVisible(true);
    };

    const handleEdit = (hall: Hall) => {
        setEditingHall(hall);
        setIsFormVisible(true);
    };

    const handleSave = (hallData: Omit<Hall, 'id' | 'buildingId'> & { id?: string }) => {
        if (!selectedBuildingId) return;
        if (hallData.id) { // Editing
            onUpdate({ ...hallData, buildingId: selectedBuildingId } as Hall);
        } else { // Adding
            const { id, ...newHallData } = hallData;
            onAdd({ ...newHallData, buildingId: selectedBuildingId });
        }
        setIsFormVisible(false);
        setEditingHall(null);
    };

    const handleCancel = () => {
        setIsFormVisible(false);
        setEditingHall(null);
    };
    
    return (
        <div className="container mx-auto">
             <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <div>
                     <button onClick={() => onNavigate({ page: 'buildings' })} className="text-sm text-orange-600 hover:underline mb-2">
                        &larr; Bina Yönetimine Geri Dön
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800">Salon Yönetimi</h2>
                </div>
                <div className="w-full md:w-auto">
                    <label htmlFor="building-select" className="sr-only">Bina Seçin</label>
                    <select
                        id="building-select"
                        value={selectedBuildingId || ''}
                        onChange={handleBuildingChange}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    >
                        <option value="">-- Bir Bina Seçiniz --</option>
                        {allBuildings.map(building => (
                            <option key={building.id} value={building.id}>{building.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedBuildingId ? (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-700">{selectedBuildingName} Salonları</h3>
                        {!isFormVisible && (
                            <button onClick={handleAddNew} className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-sm font-medium">
                                Yeni Salon Ekle
                            </button>
                        )}
                    </div>

                    {isFormVisible && <HallForm hall={editingHall} onSave={handleSave} onCancel={handleCancel} />}

                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Salon Adı</th>
                                        <th scope="col" className="px-6 py-3">Kat</th>
                                        <th scope="col" className="px-6 py-3">Kapasite</th>
                                        <th scope="col" className="px-6 py-3 text-right">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredHalls.map((hall) => (
                                        <tr key={hall.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{hall.name}</td>
                                            <td className="px-6 py-4">{hall.floor}</td>
                                            <td className="px-6 py-4">{hall.capacity}</td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button onClick={() => handleEdit(hall)} className="p-2 rounded-md text-gray-400 hover:bg-gray-100 hover:text-green-600 transition-colors" title="Güncelle">
                                                    <EditIcon className="h-5 w-5" />
                                                </button>
                                                <button onClick={() => onDelete(hall.id)} className="p-2 rounded-md text-gray-400 hover:bg-gray-100 hover:text-red-600 transition-colors" title="Sil">
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredHalls.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="text-center py-10 text-gray-500">Bu binaya ait salon bulunamadı.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center p-10 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-700">Salonları görüntülemek için lütfen yukarıdan bir bina seçin.</h2>
                </div>
            )}
        </div>
    );
};

export default HallsPage;