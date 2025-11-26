import React, { useState, useMemo, useEffect } from 'react';
import { PencilSquareIcon, BookOpenIcon, StackIcon, TrashIcon, CheckBadgeIcon } from '../components/icons';
import type { Teacher, Exam, Course, ExamCourse, Question, ExamCourseQuestion } from '../types';

interface TeacherExamDefinitionPageProps {
    teachers: Teacher[];
    exams: Exam[];
    courses: Course[];
    examCourses: ExamCourse[];
    questions: Question[];
    examCourseQuestions: ExamCourseQuestion[];
    onUpdateExamCourse: (examCourse: ExamCourse) => void;
    onAssignQuestions: (examId: string, courseId: string, questionIds: string[]) => void;
    onRemoveQuestionFromExam: (examId: string, courseId: string, questionId: string) => void;
}

const QuestionSelectionModal: React.FC<{
    course: Course;
    allQuestions: Question[];
    assignedQuestionIds: string[];
    onSave: (selectedIds: string[]) => void;
    onClose: () => void;
}> = ({ course, allQuestions, assignedQuestionIds, onSave, onClose }) => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(assignedQuestionIds));

    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedIds(newSet);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800">
                        Soru Bankasından Soru Ekle: <span className="text-orange-600">{course.name}</span>
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto bg-gray-50">
                    {allQuestions.length > 0 ? (
                        <div className="space-y-3">
                            {allQuestions.map((q, idx) => (
                                <div 
                                    key={q.id} 
                                    onClick={() => toggleSelection(q.id)}
                                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                                        selectedIds.has(q.id) 
                                        ? 'bg-blue-50 border-blue-500 shadow-md' 
                                        : 'bg-white border-gray-200 hover:border-orange-300'
                                    }`}
                                >
                                    <div className="flex items-start">
                                        <div className={`w-5 h-5 mt-1 mr-3 rounded border flex items-center justify-center ${
                                            selectedIds.has(q.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-400'
                                        }`}>
                                            {selectedIds.has(q.id) && <CheckBadgeIcon className="h-4 w-4 text-white" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-800">{q.text}</p>
                                            <div className="mt-2 text-xs text-gray-500 flex space-x-4">
                                                <span>Puan: {q.points}</span>
                                                <span>Seçenek Sayısı: {q.options.length}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            Soru bankasında bu ders için soru bulunmamaktadır.
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl flex justify-between items-center">
                    <div className="text-sm text-gray-600 font-medium">
                        {selectedIds.size} soru seçildi.
                    </div>
                    <div className="flex space-x-3">
                        <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">İptal</button>
                        <button 
                            onClick={() => onSave(Array.from(selectedIds))} 
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-sm"
                        >
                            Seçilenleri Ekle
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TeacherExamDefinitionPage: React.FC<TeacherExamDefinitionPageProps> = ({
    teachers,
    exams,
    courses,
    examCourses,
    questions,
    examCourseQuestions,
    onUpdateExamCourse,
    onAssignQuestions,
    onRemoveQuestionFromExam
}) => {
    const [selectedTeacherId, setSelectedTeacherId] = useState('');
    const [selectedExamId, setSelectedExamId] = useState('');
    const [selectedCourseId, setSelectedCourseId] = useState('');
    
    // Form State
    const [instructions, setInstructions] = useState('');
    const [duration, setDuration] = useState(0);
    const [questionCount, setQuestionCount] = useState(0);
    
    const [isModalOpen, setIsModalOpen] = useState(false);

    const activeExams = useMemo(() => exams.filter(e => e.isActive), [exams]);

    // Filter available courses for the selected teacher within the selected exam
    const availableCourses = useMemo(() => {
        if (!selectedTeacherId) return [];
        
        // Return ALL courses belonging to teacher
        return courses.filter(c => c.teacherId === selectedTeacherId);
    }, [selectedTeacherId, courses]);

    // Load existing data when course changes
    useEffect(() => {
        if (selectedExamId && selectedCourseId) {
            const ec = examCourses.find(e => e.examId === selectedExamId && e.courseId === selectedCourseId);
            if (ec) {
                setInstructions(ec.instructions || '');
                setDuration(ec.duration || 0);
                setQuestionCount(ec.questionCount || 0);
            } else {
                // Defaults for a new exam-course relation
                setInstructions('');
                setDuration(30); // Default 30 mins
                setQuestionCount(20); // Default 20 questions
            }
        } else {
            setInstructions('');
            setDuration(0);
            setQuestionCount(0);
        }
    }, [selectedExamId, selectedCourseId, examCourses]);

    // Get assigned questions
    const assignedQuestions = useMemo(() => {
        if (!selectedExamId || !selectedCourseId) return [];
        const assignedIds = examCourseQuestions
            .filter(ecq => ecq.examId === selectedExamId && ecq.courseId === selectedCourseId)
            .map(ecq => ecq.questionId);
        
        return questions.filter(q => assignedIds.includes(q.id));
    }, [selectedExamId, selectedCourseId, examCourseQuestions, questions]);

    // Check if the ExamCourse is saved (exists)
    const isDefinitionSaved = useMemo(() => {
        return examCourses.some(ec => ec.examId === selectedExamId && ec.courseId === selectedCourseId);
    }, [examCourses, selectedExamId, selectedCourseId]);

    const handleSaveDefinition = () => {
        if (!selectedExamId || !selectedCourseId) return;
        
        const existingEC = examCourses.find(ec => ec.examId === selectedExamId && ec.courseId === selectedCourseId);
        
        onUpdateExamCourse({
            id: existingEC ? existingEC.id : '', // Empty ID will trigger insertion in App.tsx
            examId: selectedExamId,
            courseId: selectedCourseId,
            instructions,
            duration,
            questionCount,
            isConfirmed: existingEC ? existingEC.isConfirmed : false
        });
        
        alert(existingEC ? 'Sınav tanımlamaları güncellendi.' : 'Ders sınava eklendi ve tanımlamalar kaydedildi.');
    };

    const handleAddQuestions = (ids: string[]) => {
        if (selectedExamId && selectedCourseId) {
            if (!isDefinitionSaved) {
                alert('Lütfen önce sınav ayarlarını kaydediniz (dersi sınava ekleyiniz).');
                return;
            }

            onAssignQuestions(selectedExamId, selectedCourseId, ids);
            setIsModalOpen(false);
        }
    };

    return (
        <div className="container mx-auto h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <PencilSquareIcon className="h-8 w-8 mr-2 text-orange-500" />
                    Sınav Tanımlama
                </h2>
                
                {/* Teacher Selector */}
                <div className="flex items-center bg-white p-2 rounded-lg shadow-sm border border-orange-200">
                    <span className="text-sm text-gray-500 mr-2 font-medium">Aktif Öğretmen:</span>
                    <select 
                        value={selectedTeacherId} 
                        onChange={(e) => { 
                            setSelectedTeacherId(e.target.value); 
                            setSelectedExamId(''); 
                            setSelectedCourseId(''); 
                        }}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 block p-1.5 w-64"
                    >
                        <option value="">-- Öğretmen Seçiniz --</option>
                        {teachers.map(t => (
                            <option key={t.id} value={t.id}>
                                {t.title} {t.firstName} {t.lastName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {!selectedTeacherId ? (
                <div className="flex flex-col items-center justify-center flex-1 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-12">
                    <PencilSquareIcon className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-500">İşlem yapmak için lütfen yukarıdan kendinizi (öğretmen) seçiniz.</h3>
                </div>
            ) : (
                <div className="flex flex-col space-y-6 pb-10">
                    
                    {/* Filters */}
                    <div className="bg-white p-6 rounded-xl shadow-md grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Aktif Sınav</label>
                            <select
                                value={selectedExamId}
                                onChange={(e) => { setSelectedExamId(e.target.value); setSelectedCourseId(''); }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="">-- Sınav Seçiniz --</option>
                                {activeExams.map(e => (
                                    <option key={e.id} value={e.id}>{e.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ders Seçimi</label>
                            <select
                                value={selectedCourseId}
                                onChange={(e) => setSelectedCourseId(e.target.value)}
                                disabled={!selectedExamId}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                            >
                                <option value="">-- Ders Seçiniz --</option>
                                {availableCourses.map(c => {
                                    const isAdded = examCourses.some(ec => ec.examId === selectedExamId && ec.courseId === c.id);
                                    return (
                                        <option key={c.id} value={c.id}>
                                            {c.code} - {c.name} {isAdded ? '(Eklendi)' : ''}
                                        </option>
                                    );
                                })}
                            </select>
                            {selectedExamId && availableCourses.length === 0 && (
                                <p className="text-xs text-red-500 mt-1">Üzerinize tanımlı ders bulunamadı.</p>
                            )}
                        </div>
                    </div>

                    {selectedCourseId && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left: Definitions */}
                            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md h-fit">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Sınav Ayarları</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Yönerge</label>
                                        <textarea
                                            rows={4}
                                            value={instructions}
                                            onChange={(e) => setInstructions(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                            placeholder="Sınav kuralları ve açıklamaları..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Soru Sayısı (Hedef)</label>
                                        <input
                                            type="number"
                                            value={questionCount}
                                            onChange={(e) => setQuestionCount(parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Sınav Süresi (Dakika)</label>
                                        <input
                                            type="number"
                                            value={duration}
                                            onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                        />
                                    </div>
                                    <button 
                                        onClick={handleSaveDefinition}
                                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                                    >
                                        Ayarları Kaydet
                                    </button>
                                </div>
                            </div>

                            {/* Right: Questions */}
                            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md flex flex-col">
                                <div className="flex justify-between items-center mb-4 border-b pb-2">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">Sınav Soruları</h3>
                                        <p className="text-sm text-gray-500">
                                            Eklenen: {assignedQuestions.length} / Hedef: {questionCount}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => setIsModalOpen(true)}
                                        disabled={!isDefinitionSaved}
                                        title={!isDefinitionSaved ? "Önce ayarları kaydediniz" : ""}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center shadow-sm ${
                                            !isDefinitionSaved 
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                            : 'bg-orange-500 text-white hover:bg-orange-600'
                                        }`}
                                    >
                                        <StackIcon className="h-4 w-4 mr-2" />
                                        Sınava Soru Ekle
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto max-h-[500px] bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    {assignedQuestions.length > 0 ? (
                                        <div className="space-y-3">
                                            {assignedQuestions.map((q, idx) => (
                                                <div key={q.id} className="bg-white p-3 rounded border border-gray-200 hover:shadow-sm flex justify-between items-start">
                                                    <div>
                                                        <div className="flex items-center mb-1">
                                                            <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-0.5 rounded mr-2">#{idx + 1}</span>
                                                            <span className="text-xs text-gray-500 font-medium">{q.points} Puan</span>
                                                        </div>
                                                        <p className="text-sm text-gray-800">{q.text}</p>
                                                    </div>
                                                    <button 
                                                        onClick={() => onRemoveQuestionFromExam(selectedExamId, selectedCourseId, q.id)}
                                                        className="text-red-400 hover:text-red-600 p-1"
                                                        title="Sınavdan Çıkar"
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8">
                                            <BookOpenIcon className="h-12 w-12 mb-2 opacity-20" />
                                            <p>Bu sınava henüz soru eklenmemiş.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {isModalOpen && (
                <QuestionSelectionModal 
                    course={courses.find(c => c.id === selectedCourseId)!}
                    allQuestions={questions.filter(q => q.courseId === selectedCourseId)}
                    assignedQuestionIds={assignedQuestions.map(q => q.id)}
                    onSave={handleAddQuestions}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default TeacherExamDefinitionPage;