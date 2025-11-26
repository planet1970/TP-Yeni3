
import React, { useState, useMemo } from 'react';
import { StackIcon, EditIcon, TrashIcon } from '../components/icons';
import type { Teacher, Course, Question } from '../types';

interface TeacherQuestionBankPageProps {
    teachers: Teacher[];
    courses: Course[];
    questions: Question[];
    onAddQuestion: (question: Omit<Question, 'id'>) => void;
    onUpdateQuestion: (question: Question) => void;
    onDeleteQuestion: (questionId: string) => void;
}

const QuestionForm: React.FC<{
    question: Partial<Question> | null;
    courseId: string;
    onSave: (questionData: Omit<Question, 'id' | 'courseId'> & { id?: string }) => void;
    onCancel: () => void;
}> = ({ question, courseId, onSave, onCancel }) => {
    const [text, setText] = useState(question?.text || '');
    const [options, setOptions] = useState<string[]>(question?.options || ['', '', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState(question?.correctAnswer || '0');
    const [points, setPoints] = useState(question?.points || 5);

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: question?.id,
            text,
            options,
            correctAnswer,
            points
        });
    };

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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Soru Metni</label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Seçenekler</label>
                        {options.map((opt, idx) => (
                            <div key={idx} className="flex items-center mb-2">
                                <span className="w-8 text-center font-bold text-gray-500">{String.fromCharCode(65 + idx)}</span>
                                <input
                                    type="text"
                                    value={opt}
                                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 ml-2"
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
                        ))}
                        <p className="text-xs text-gray-500 mt-1">* Doğru cevabı yanındaki butonu işaretleyerek belirtiniz.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Puan Değeri</label>
                        <input
                            type="number"
                            value={points}
                            onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
                            min="1"
                            className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">İptal</button>
                        <button type="submit" className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium shadow-sm">Kaydet</button>
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
    onAddQuestion,
    onUpdateQuestion,
    onDeleteQuestion
}) => {
    const [selectedTeacherId, setSelectedTeacherId] = useState('');
    const [selectedCourseId, setSelectedCourseId] = useState('');
    
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    // --- Filtering ---
    // Filter courses based on selected teacher
    const teacherCourses = useMemo(() => {
        return courses.filter(c => c.teacherId === selectedTeacherId);
    }, [courses, selectedTeacherId]);

    // Filter questions based on selected course
    const filteredQuestions = useMemo(() => {
        if (!selectedCourseId) return [];
        return questions.filter(q => q.courseId === selectedCourseId);
    }, [questions, selectedCourseId]);

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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ders Seçiniz</label>
                        <select
                            value={selectedCourseId}
                            onChange={(e) => setSelectedCourseId(e.target.value)}
                            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="">-- Ders Seçiniz --</option>
                            {teacherCourses.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.code} - {c.name}
                                </option>
                            ))}
                        </select>
                        {teacherCourses.length === 0 && (
                            <p className="text-sm text-red-500 mt-2">Üzerinize tanımlı ders bulunmamaktadır.</p>
                        )}
                    </div>

                    {/* Question List */}
                    {selectedCourseId && (
                        <div className="bg-white rounded-xl shadow-md overflow-hidden flex-1 flex flex-col">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h3 className="text-lg font-bold text-gray-800">Sorular</h3>
                                <button 
                                    onClick={handleAdd}
                                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 text-sm font-bold shadow-sm flex items-center"
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
                                                        <div className="flex items-center mb-2">
                                                            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded mr-2">Soru {idx + 1}</span>
                                                            <span className="text-xs text-gray-500 font-medium">{q.points} Puan</span>
                                                        </div>
                                                        <p className="text-gray-800 font-medium mb-3">{q.text}</p>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                            {q.options.map((opt, optIdx) => (
                                                                <div key={optIdx} className={`text-sm px-3 py-1.5 rounded border ${String(optIdx) === q.correctAnswer ? 'bg-green-50 border-green-200 text-green-800 font-medium' : 'bg-white border-gray-200 text-gray-600'}`}>
                                                                    <span className="font-bold mr-2">{String.fromCharCode(65 + optIdx)})</span>
                                                                    {opt}
                                                                </div>
                                                            ))}
                                                        </div>
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
                                        Bu derse ait soru bulunmamaktadır.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {isFormOpen && (
                <QuestionForm 
                    question={editingQuestion}
                    courseId={selectedCourseId}
                    onSave={handleSave}
                    onCancel={() => setIsFormOpen(false)}
                />
            )}
        </div>
    );
};

export default TeacherQuestionBankPage;
