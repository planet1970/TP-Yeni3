
import React, { useState, useMemo, useEffect } from 'react';
import { PencilSquareIcon, BookOpenIcon, StackIcon, TrashIcon, CheckBadgeIcon, CurrencyDollarIcon, CheckCircleIcon, PlusIcon, MinusIcon } from '../components/icons';
import type { Teacher, Exam, Course, ExamCourse, Question, ExamCourseQuestion, Topic } from '../types';

interface TeacherExamDefinitionPageProps {
    teachers: Teacher[];
    exams: Exam[];
    courses: Course[];
    examCourses: ExamCourse[];
    questions: Question[];
    topics: Topic[];
    examCourseQuestions: ExamCourseQuestion[];
    onUpdateExamCourse: (examCourse: ExamCourse) => void;
    onAssignQuestions: (examId: string, courseId: string, questionIds: string[]) => void;
    onRemoveQuestionFromExam: (examId: string, courseId: string, questionId: string) => void;
    onUpdateQuestionPoints: (examId: string, courseId: string, questionId: string, newPoints: number) => void;
    onRecalculatePoints: (examId: string, courseId: string) => void;
}

const QuestionSelectionModal: React.FC<{
    course: Course;
    allQuestions: Question[];
    topics: Topic[];
    assignedQuestionIds: string[];
    onAddSingle: (questionId: string) => void;
    onRemoveSingle: (questionId: string) => void;
    onClose: () => void;
}> = ({ course, allQuestions, topics, assignedQuestionIds, onAddSingle, onRemoveSingle, onClose }) => {
    const [topicFilter, setTopicFilter] = useState('');

    const filteredQuestions = useMemo(() => {
        // Filter out invalid questions with missing IDs
        const validQuestions = allQuestions.filter(q => q.id);
        if (!topicFilter) return validQuestions;
        return validQuestions.filter(q => q.topicId === topicFilter);
    }, [allQuestions, topicFilter]);

    const getTopicName = (topicId?: string) => {
        const topic = topics.find(t => t.id === topicId);
        return topic ? topic.name : '-';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h3 className="text-xl font-bold text-gray-800">
                        Soru Bankasından Soru Ekle: <span className="text-orange-600">{course.name}</span>
                    </h3>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <select
                            value={topicFilter}
                            onChange={(e) => setTopicFilter(e.target.value)}
                            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-orange-500 flex-1"
                        >
                            <option value="">Tüm Konular</option>
                            {topics.filter(t => t.courseId === course.id).map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
                    </div>
                </div>

                <div className="p-6 flex-1 overflow-y-auto bg-gray-50">
                    {filteredQuestions.length > 0 ? (
                        <div className="space-y-3">
                            {filteredQuestions.map((q, index) => {
                                const isAdded = assignedQuestionIds.includes(q.id);
                                return (
                                    <div 
                                        // Using composite key to handle potential duplicates in render only
                                        key={`${q.id}-${index}`} 
                                        className={`p-4 rounded-lg border transition-all ${
                                            isAdded 
                                            ? 'bg-green-50 border-green-200' 
                                            : 'bg-white border-gray-200 hover:border-orange-300'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${q.type === 'TEST' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-teal-50 text-teal-700 border-teal-200'}`}>
                                                        {q.type === 'TEST' ? 'Test' : 'Klasik'}
                                                    </span>
                                                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                                                        {getTopicName(q.topicId)}
                                                    </span>
                                                    {isAdded && (
                                                        <span className="flex items-center text-green-700 text-xs font-bold px-2 py-0.5 bg-green-100 rounded">
                                                            <CheckBadgeIcon className="h-3 w-3 mr-1" />
                                                            Eklendi
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="font-medium text-gray-800 line-clamp-2">{q.text}</p>
                                                {/* VISUAL DEBUG: Show ID to verify uniqueness */}
                                                <span className="text-[10px] text-gray-300 mt-1 block font-mono">ID: {q.id}</span>
                                            </div>
                                            
                                            <div className="flex flex-col justify-center min-w-[100px]">
                                                {isAdded ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => onRemoveSingle(q.id)}
                                                        className="w-full px-3 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-xs font-bold flex items-center justify-center transition-colors shadow-sm"
                                                        title="Sınavdan Çıkar"
                                                    >
                                                        <MinusIcon className="h-3 w-3 mr-1.5" />
                                                        Çıkar
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => onAddSingle(q.id)}
                                                        className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs font-bold flex items-center justify-center transition-colors shadow-sm"
                                                        title="Sınava Ekle"
                                                    >
                                                        <PlusIcon className="h-3 w-3 mr-1.5" />
                                                        Ekle
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            {topicFilter ? 'Bu konuda soru bulunmamaktadır.' : 'Soru bankasında bu ders için soru bulunmamaktadır.'}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl flex justify-end">
                    <button 
                        onClick={onClose}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 font-medium"
                    >
                        Kapat
                    </button>
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
    topics,
    examCourseQuestions,
    onUpdateExamCourse,
    onAssignQuestions,
    onRemoveQuestionFromExam,
    onUpdateQuestionPoints,
    onRecalculatePoints
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

    // Get assigned questions details including points from relation
    const assignedQuestionsData = useMemo(() => {
        if (!selectedExamId || !selectedCourseId) return [];
        const relations = examCourseQuestions.filter(ecq => ecq.examId === selectedExamId && ecq.courseId === selectedCourseId);
        
        return relations.map(r => {
            const q = questions.find(que => que.id === r.questionId);
            if (!q) return null;
            return {
                ...q, // Question details
                points: r.points, // Points from relation
                relationId: r.id // Relation ID for updates if needed
            };
        }).filter((item): item is (Question & { points: number; relationId: string }) => !!item); 
    }, [selectedExamId, selectedCourseId, examCourseQuestions, questions]);

    const totalPoints = assignedQuestionsData.reduce((sum, item) => sum + (item.points || 0), 0);

    // Check existing EC record
    const existingEC = useMemo(() => {
        return examCourses.find(ec => ec.examId === selectedExamId && ec.courseId === selectedCourseId);
    }, [examCourses, selectedExamId, selectedCourseId]);

    // Workflow States
    const isDraft = existingEC?.status === 'DRAFT';
    const isReady = existingEC?.status === 'READY';
    const isAdded = existingEC !== undefined; // Meaning record exists in some form

    // Validation for Submission
    const addedCount = assignedQuestionsData.length;
    const isTargetReached = questionCount > 0 && addedCount >= questionCount;

    const handleSaveDefinition = () => {
        if (!selectedExamId || !selectedCourseId) return;
        
        onUpdateExamCourse({
            id: existingEC ? existingEC.id : '',
            examId: selectedExamId,
            courseId: selectedCourseId,
            instructions,
            duration,
            questionCount,
            isConfirmed: existingEC ? existingEC.isConfirmed : false,
            status: 'DRAFT' // Explicitly set to Draft on save
        });
        
        alert('Sınav ayarları kaydedildi. Durum: TASLAK');
    };

    const handleSubmitExam = () => {
        if (!existingEC) return;
        if (!isTargetReached) {
            alert('Soru sayısı hedeflenen sayıya ulaşmadan sınavı gönderemezsiniz.');
            return;
        }

        onUpdateExamCourse({
            ...existingEC,
            status: 'READY'
        });
        alert('Sınav başarıyla gönderildi. Durum: HAZIR');
    };

    // Status Badge Logic
    let statusBadgeClass = 'bg-gray-100 text-gray-600';
    let statusText = 'Belirsiz';

    if (questionCount > 0) {
        if (addedCount < questionCount) {
            statusBadgeClass = 'bg-red-100 text-red-700 border-red-200';
            statusText = 'Eksik';
        } else if (addedCount === questionCount) {
            statusBadgeClass = 'bg-green-100 text-green-700 border-green-200';
            statusText = 'Tamam';
        } else {
            statusBadgeClass = 'bg-yellow-100 text-yellow-800 border-yellow-200';
            statusText = 'Fazla';
        }
    }

    return (
        <div className="container mx-auto h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <PencilSquareIcon className="h-8 w-8 mr-2 text-orange-500" />
                    Sınav Tanımlama
                </h2>
                
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
                                    const ec = examCourses.find(item => item.examId === selectedExamId && item.courseId === c.id);
                                    let statusLabel = '';
                                    if (ec) {
                                        if (ec.isConfirmed) statusLabel = '(Eklendi)';
                                        else if (ec.status === 'READY') statusLabel = '(Hazır)';
                                        else if (ec.status === 'DRAFT') statusLabel = '(Taslak)';
                                    }
                                    
                                    return (
                                        <option key={c.id} value={c.id}>
                                            {c.code} - {c.name} {statusLabel}
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
                                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex justify-between items-center">
                                    Sınav Ayarları
                                    {isDraft && <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded font-bold uppercase">Taslak</span>}
                                    {isReady && <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded font-bold uppercase">Hazır</span>}
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Yönerge</label>
                                        <textarea
                                            rows={4}
                                            value={instructions}
                                            onChange={(e) => setInstructions(e.target.value)}
                                            disabled={isReady}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
                                            placeholder="Sınav kuralları ve açıklamaları..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Soru Sayısı (Hedef)</label>
                                        <input
                                            type="number"
                                            value={questionCount}
                                            onChange={(e) => setQuestionCount(parseInt(e.target.value) || 0)}
                                            disabled={isReady}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Sınav Süresi (Dakika)</label>
                                        <input
                                            type="number"
                                            value={duration}
                                            onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                                            disabled={isReady}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
                                        />
                                    </div>
                                    
                                    {isReady ? (
                                        <button 
                                            onClick={() => {
                                                if (confirm('Sınavı tekrar taslak moduna almak istiyor musunuz? Yönetici onayı verilmişse bu işlem önerilmez.')) {
                                                    onUpdateExamCourse({ ...existingEC!, status: 'DRAFT' });
                                                }
                                            }}
                                            className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium shadow-sm text-sm"
                                        >
                                            Düzenlemeyi Aç (Taslak Yap)
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={handleSaveDefinition}
                                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                                        >
                                            Ayarları Kaydet
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Right: Questions */}
                            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md flex flex-col">
                                <div className="flex justify-between items-center mb-4 border-b pb-2">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-bold text-gray-800">Sınav Soruları</h3>
                                        {questionCount > 0 && (
                                            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusBadgeClass}`}>
                                                {addedCount} / {questionCount} Soru ({statusText})
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-right flex items-center gap-4">
                                        <p className="text-sm text-gray-500">
                                            Toplam Puan: <span className={`font-bold ${Math.abs(totalPoints - 100) < 0.1 ? 'text-green-600' : 'text-red-500'}`}>{totalPoints.toFixed(2)}</span>
                                        </p>
                                        
                                        {/* SUBMIT EXAM BUTTON */}
                                        {!isReady && isDraft && (
                                            <button
                                                onClick={handleSubmitExam}
                                                disabled={!isTargetReached}
                                                className={`px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm flex items-center ${
                                                    isTargetReached
                                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                }`}
                                                title={!isTargetReached ? 'Hedef soru sayısına ulaşılmalı' : 'Yönetici onayına gönder'}
                                            >
                                                <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                                                Sınavı Gönder
                                            </button>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex justify-end gap-2 mb-4">
                                    <button
                                        onClick={() => onRecalculatePoints(selectedExamId, selectedCourseId)}
                                        disabled={assignedQuestionsData.length === 0 || isReady}
                                        className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${isReady ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200'}`}
                                        title="Tüm puanları eşit dağıt (100 / Soru Sayısı)"
                                    >
                                        Puanları Eşitle
                                    </button>
                                    <button 
                                        onClick={() => setIsModalOpen(true)}
                                        disabled={!isAdded || isReady}
                                        title={!isAdded ? "Önce ayarları kaydediniz" : isReady ? "Sınav hazır durumdayken soru eklenemez" : ""}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center shadow-sm ${
                                            !isAdded || isReady
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                            : 'bg-orange-500 text-white hover:bg-orange-600'
                                        }`}
                                    >
                                        <StackIcon className="h-4 w-4 mr-2" />
                                        Soru Ekle
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto max-h-[500px] bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    {assignedQuestionsData.length > 0 ? (
                                        <div className="space-y-3">
                                            {assignedQuestionsData.map((q, idx) => (
                                                <div key={q.id} className="bg-white p-3 rounded border border-gray-200 hover:shadow-sm flex justify-between items-start">
                                                    <div className="flex-1 mr-4">
                                                        <div className="flex items-center mb-1 gap-2">
                                                            <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-0.5 rounded">#{idx + 1}</span>
                                                            <span className={`text-xs font-bold px-2 py-0.5 rounded border ${q.type === 'TEST' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-teal-50 text-teal-700 border-teal-200'}`}>
                                                                {q.type === 'TEST' ? 'Test' : 'Klasik'}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-800 line-clamp-2">{q.text}</p>
                                                    </div>
                                                    
                                                    <div className="flex items-center space-x-3">
                                                        <div className="flex flex-col items-end">
                                                            <label className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Puan</label>
                                                            <input 
                                                                type="number" 
                                                                value={q.points}
                                                                disabled={isReady}
                                                                onChange={(e) => onUpdateQuestionPoints(selectedExamId, selectedCourseId, q.id!, parseFloat(e.target.value) || 0)}
                                                                className="w-16 px-2 py-1 text-sm border rounded text-center focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
                                                            />
                                                        </div>
                                                        {!isReady && (
                                                            <button 
                                                                onClick={() => onRemoveQuestionFromExam(selectedExamId, selectedCourseId, q.id!)}
                                                                className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors"
                                                                title="Sınavdan Çıkar"
                                                            >
                                                                <TrashIcon className="h-5 w-5" />
                                                            </button>
                                                        )}
                                                    </div>
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
                    topics={topics}
                    assignedQuestionIds={assignedQuestionsData.map(q => q.id!)}
                    onAddSingle={(id) => onAssignQuestions(selectedExamId, selectedCourseId, [id])}
                    onRemoveSingle={(id) => onRemoveQuestionFromExam(selectedExamId, selectedCourseId, id)}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default TeacherExamDefinitionPage;
