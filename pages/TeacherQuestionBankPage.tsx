
import React, { useState, useMemo } from 'react';
import { StackIcon, EditIcon, TrashIcon, TagIcon } from '../components/icons';
import type { Teacher, Course, Question, Topic } from '../types';

interface TeacherQuestionBankPageProps {
    teachers: Teacher[];
    courses: Course[];
    questions: Question[];
    topics: Topic[];
    onAddQuestion: (question: Omit<Question, 'id'>) => void;
    onUpdateQuestion: (question: Question) => void;
    onDeleteQuestion: (questionId: string) => void;
    onAddTopic: (topic: Omit<Topic, 'id'>) => void;
    onDeleteTopic: (topicId: string) => void;
}

const TopicManagerModal: React.FC<{
    courseId: string;
    topics: Topic[];
    onAdd: (name: string) => void;
    onDelete: (id: string) => void;
    onClose: () => void;
}> = ({ courseId, topics, onAdd, onDelete, onClose }) => {
    const [newTopicName, setNewTopicName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTopicName.trim()) {
            onAdd(newTopicName.trim());
            setNewTopicName('');
        }
    };

    const courseTopics = topics.filter(t => t.courseId === courseId);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md flex flex-col max-h-[80vh]">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800">Konu Yönetimi</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1">
                    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={newTopicName}
                            onChange={(e) => setNewTopicName(e.target.value)}
                            placeholder="Yeni Konu Adı"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                        />
                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Ekle</button>
                    </form>

                    <ul className="space-y-2">
                        {courseTopics.map(topic => (
                            <li key={topic.id} className="flex justify-between items-center p-2 bg-gray-50 rounded border border-gray-200">
                                <span className="text-gray-700">{topic.name}</span>
                                <button onClick={() => onDelete(topic.id)} className="text-red-500 hover:text-red-700 p-1">
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            </li>
                        ))}
                        {courseTopics.length === 0 && (
                            <li className="text-center text-gray-400 text-sm italic">Henüz konu eklenmemiş.</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

const QuestionForm: React.FC<{
    question: Partial<Question> | null;
    courseId: string;
    topics: Topic[];
    onSave: (questionData: Omit<Question, 'id' | 'courseId'> & { id?: string }) => void;
    onCancel: () => void;
}> = ({ question, courseId, topics, onSave, onCancel }) => {
    const [type, setType] = useState<'TEST' | 'CLASSIC'>(question?.type || 'TEST');
    const [topicId, setTopicId] = useState(question?.topicId || '');
    const [text, setText] = useState(question?.text || '');
    const [options, setOptions] = useState<string[]>(question?.options || ['', '', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState(question?.correctAnswer || '0');
    
    // New state to prevent double submission
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isSubmitting) return;

        // Validate Duplicate Options for TEST questions
        if (type === 'TEST') {
            const uniqueOptions = new Set(options.map(o => o.trim()));
            if (uniqueOptions.size !== options.length) {
                alert('Lütfen tekrar eden seçenekleri düzeltiniz.');
                return;
            }
            if (options.some(o => !o.trim())) {
                alert('Lütfen tüm seçenekleri doldurunuz.');
                return;
            }
        }

        setIsSubmitting(true);

        onSave({
            id: question?.id, // if undefined, App.tsx will generate a new unique one
            type,
            topicId,
            text,
            options: type === 'TEST' ? options : undefined,
            correctAnswer: type === 'TEST' ? correctAnswer : undefined,
        });
    };

    // Filter topics for this course
    const courseTopics = topics.filter(t => t.courseId === courseId);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800">
                        {question?.id ? 'Soruyu Düzenle' : 'Yeni Soru Ekle'}
                    </h3>
                    <button onClick={onCancel} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Soru Tipi</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value as 'TEST' | 'CLASSIC')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                            >
                                <option value="TEST">Çoktan Seçmeli (Test)</option>
                                <option value="CLASSIC">Klasik</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Konu</label>
                            <select
                                value={topicId}
                                onChange={(e) => setTopicId(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                            >
                                <option value="">-- Konu Seçiniz --</option>
                                {courseTopics.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Soru Metni</label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                            required
                        />
                    </div>
                    
                    {type === 'TEST' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Seçenekler</label>
                            {options.map((opt, idx) => {
                                // Check for duplicates
                                const isDuplicate = opt.trim() !== '' && options.filter(o => o.trim() === opt.trim()).length > 1;
                                
                                return (
                                    <div key={idx} className="mb-3">
                                        <div className="flex items-center">
                                            <span className="w-8 text-center font-bold text-gray-500">{String.fromCharCode(65 + idx)}</span>
                                            <input
                                                type="text"
                                                value={opt}
                                                onChange={(e) => handleOptionChange(idx, e.target.value)}
                                                className={`flex-1 px-3 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500 ml-2 ${
                                                    isDuplicate ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
                                                }`}
                                                required
                                            />
                                            <input
                                                type="radio"
                                                name="correctAnswer"
                                                value={idx}
                                                checked={correctAnswer === String(idx)}
                                                onChange={(e) => setCorrectAnswer(e.target.value)}
                                                className="ml-3 h-4 w-4 text-orange-600 focus:ring-orange-500"
                                                title="Doğru Cevap"
                                            />
                                        </div>
                                        {isDuplicate && (
                                            <div className="ml-10 mt-1 text-xs text-red-500 font-medium">
                                                Bu seçenek tekrar kullanılmış!
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            <p className="text-xs text-gray-500 mt-1">* Doğru cevabı yanındaki butonu işaretleyerek belirtiniz.</p>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">İptal</button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className={`px-6 py-2 bg-orange-500 text-white rounded-lg font-medium shadow-sm ${
                                isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-600'
                            }`}
                        >
                            {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const TeacherQuestionBankPage: React.FC<TeacherQuestionBankPageProps> = ({
    teachers,
    courses,
    questions,
    topics,
    onAddQuestion,
    onUpdateQuestion,
    onDeleteQuestion,
    onAddTopic,
    onDeleteTopic
}) => {
    const [selectedTeacherId, setSelectedTeacherId] = useState('');
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [selectedTopicFilter, setSelectedTopicFilter] = useState('');
    
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isTopicManagerOpen, setIsTopicManagerOpen] = useState(false);

    // --- Filtering ---
    const teacherCourses = useMemo(() => {
        return courses.filter(c => c.teacherId === selectedTeacherId);
    }, [courses, selectedTeacherId]);

    const courseTopics = useMemo(() => {
        return topics.filter(t => t.courseId === selectedCourseId);
    }, [topics, selectedCourseId]);

    const filteredQuestions = useMemo(() => {
        if (!selectedCourseId) return [];
        let qList = questions.filter(q => q.courseId === selectedCourseId);
        
        if (selectedTopicFilter) {
            qList = qList.filter(q => q.topicId === selectedTopicFilter);
        }
        
        return qList;
    }, [questions, selectedCourseId, selectedTopicFilter]);

    // Handlers
    const handleAdd = () => {
        setEditingQuestion(null);
        setIsFormOpen(true);
    };

    const handleEdit = (q: Question) => {
        setEditingQuestion(q);
        setIsFormOpen(true);
    };

    const handleSave = (data: Omit<Question, 'id' | 'courseId'> & { id?: string }) => {
        if (!selectedCourseId) return;

        if (data.id) {
            onUpdateQuestion({ ...data, id: data.id, courseId: selectedCourseId } as Question);
        } else {
            onAddQuestion({ ...data, courseId: selectedCourseId });
        }
        setIsFormOpen(false);
    };

    const getTopicName = (topicId?: string) => {
        const topic = topics.find(t => t.id === topicId);
        return topic ? topic.name : '-';
    };

    return (
        <div className="container mx-auto h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <StackIcon className="h-8 w-8 mr-2 text-orange-500" />
                    Soru Bankası
                </h2>
                
                {/* Teacher Selector */}
                <div className="flex items-center bg-white p-2 rounded-lg shadow-sm border border-orange-200">
                    <span className="text-sm text-gray-500 mr-2 font-medium">Aktif Öğretmen:</span>
                    <select 
                        value={selectedTeacherId} 
                        onChange={(e) => { setSelectedTeacherId(e.target.value); setSelectedCourseId(''); }}
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
                    <StackIcon className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-500">İşlem yapmak için lütfen yukarıdan kendinizi (öğretmen) seçiniz.</h3>
                </div>
            ) : (
                <div className="flex flex-col flex-1 space-y-6">
                    {/* Course Selection */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Ders Seçiniz</label>
                                <select
                                    value={selectedCourseId}
                                    onChange={(e) => { setSelectedCourseId(e.target.value); setSelectedTopicFilter(''); }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="">-- Ders Seçiniz --</option>
                                    {teacherCourses.map(c => (
                                        <option key={c.id} value={c.id}>
                                            {c.code} - {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {selectedCourseId && (
                                <div className="flex items-end">
                                    <button
                                        onClick={() => setIsTopicManagerOpen(true)}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 font-medium flex items-center"
                                    >
                                        <TagIcon className="h-5 w-5 mr-2 text-gray-500" />
                                        Konu Yönetimi
                                    </button>
                                </div>
                            )}
                        </div>
                        {teacherCourses.length === 0 && (
                            <p className="text-sm text-red-500 mt-2">Üzerinize tanımlı ders bulunamadı.</p>
                        )}
                    </div>

                    {/* Question List */}
                    {selectedCourseId && (
                        <div className="bg-white rounded-xl shadow-md overflow-hidden flex-1 flex flex-col">
                            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center bg-gray-50 gap-4">
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <h3 className="text-lg font-bold text-gray-800">Sorular</h3>
                                    <select
                                        value={selectedTopicFilter}
                                        onChange={(e) => setSelectedTopicFilter(e.target.value)}
                                        className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-orange-500"
                                    >
                                        <option value="">Tüm Konular</option>
                                        {courseTopics.map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <button 
                                    onClick={handleAdd}
                                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 text-sm font-bold shadow-sm flex items-center w-full md:w-auto justify-center"
                                >
                                    + Yeni Soru
                                </button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-6">
                                {filteredQuestions.length > 0 ? (
                                    <div className="space-y-4">
                                        {filteredQuestions.map((q, idx) => (
                                            <div key={q.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <div className="flex flex-wrap items-center mb-2 gap-2">
                                                            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">Soru {idx + 1}</span>
                                                            <span className={`text-xs font-bold px-2 py-1 rounded border ${q.type === 'TEST' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-teal-50 text-teal-700 border-teal-200'}`}>
                                                                {q.type === 'TEST' ? 'Test' : 'Klasik'}
                                                            </span>
                                                            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded flex items-center">
                                                                <TagIcon className="h-3 w-3 mr-1" />
                                                                {getTopicName(q.topicId)}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-800 font-medium mb-3 whitespace-pre-wrap">{q.text}</p>
                                                        
                                                        {q.type === 'TEST' && q.options && (
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                {q.options.map((opt, optIdx) => (
                                                                    <div key={optIdx} className={`text-sm px-3 py-1.5 rounded border ${String(optIdx) === q.correctAnswer ? 'bg-green-50 border-green-200 text-green-800 font-medium' : 'bg-white border-gray-200 text-gray-600'}`}>
                                                                        <span className="font-bold mr-2">{String.fromCharCode(65 + optIdx)})</span>
                                                                        {opt}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex space-x-2 ml-4">
                                                        <button onClick={() => handleEdit(q)} className="text-gray-400 hover:text-blue-600 p-1">
                                                            <EditIcon className="h-5 w-5" />
                                                        </button>
                                                        <button onClick={() => onDeleteQuestion(q.id)} className="text-gray-400 hover:text-red-600 p-1">
                                                            <TrashIcon className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 text-gray-500">
                                        Bu filtreye uygun soru bulunmamaktadır.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {isTopicManagerOpen && selectedCourseId && (
                <TopicManagerModal
                    courseId={selectedCourseId}
                    topics={topics}
                    onAdd={(name) => onAddTopic({ courseId: selectedCourseId, name })}
                    onDelete={onDeleteTopic}
                    onClose={() => setIsTopicManagerOpen(false)}
                />
            )}

            {isFormOpen && (
                <QuestionForm 
                    question={editingQuestion}
                    courseId={selectedCourseId}
                    topics={courseTopics}
                    onSave={handleSave}
                    onCancel={() => setIsFormOpen(false)}
                />
            )}
        </div>
    );
};

export default TeacherQuestionBankPage;
