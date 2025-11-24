
import React, { useState } from 'react';
import { SearchCircleIcon, PrinterIcon, SchoolIcon, ChevronRightIcon } from '../components/icons';
import type { 
    Student, 
    Exam, 
    Session, 
    Hall, 
    Course, 
    Department,
    StudentHallAssignment,
    SessionCourse,
    StudentCourseRegistration,
    Building,
    School
} from '../types';

interface SessionInquiryPageProps {
    students: Student[];
    exams: Exam[];
    sessions: Session[];
    halls: Hall[];
    courses: Course[];
    departments: Department[];
    studentHallAssignments: StudentHallAssignment[];
    sessionCourses: SessionCourse[];
    studentCourseRegistrations: StudentCourseRegistration[];
    buildings: Building[];
    schools: School[];
}

interface InquiryResult {
    student: Student;
    department: Department | undefined;
    exam: Exam | undefined;
    examPlace: string;
    schoolName: string;
    sessions: {
        session: Session;
        hall: Hall;
        seatNumber: number;
        courses: Course[];
    }[];
}

const SessionInquiryPage: React.FC<SessionInquiryPageProps> = ({
    students,
    exams,
    sessions,
    halls,
    courses,
    departments,
    studentHallAssignments,
    sessionCourses,
    studentCourseRegistrations,
    buildings,
    schools
}) => {
    const [searchNumber, setSearchNumber] = useState('');
    const [result, setResult] = useState<InquiryResult | null>(null);
    const [error, setError] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setResult(null);

        if (!searchNumber.trim()) {
            setError('Lütfen öğrenci numarası giriniz.');
            return;
        }

        const student = students.find(s => s.studentNumber === searchNumber.trim());

        if (!student) {
            setError('Öğrenci bulunamadı.');
            return;
        }

        // Find Active Exam
        const activeExam = exams.find(e => e.isActive);
        if (!activeExam) {
            setError('Sistemde aktif bir sınav bulunmamaktadır.');
            return;
        }

        // Find assignments
        const myAssignments = studentHallAssignments.filter(a => a.studentId === student.id);
        const activeSessionIds = sessions.filter(s => s.examId === activeExam.id).map(s => s.id);
        const validAssignments = myAssignments.filter(a => activeSessionIds.includes(a.sessionId));

        if (validAssignments.length === 0) {
            setError('Bu sınav için öğrenciye atanmış bir oturum bulunamadı.');
            return;
        }

        const department = departments.find(d => d.id === validAssignments[0].departmentId);

        // Find School Name
        let schoolName = 'SOSYAL BİLİMLER ENSTİTÜSÜ';
        if (department && department.schoolId) {
            const school = schools.find(s => s.id === department.schoolId);
            if (school) {
                schoolName = school.name;
            }
        }

        const sessionDetails = validAssignments.map(assignment => {
            const session = sessions.find(s => s.id === assignment.sessionId)!;
            const hall = halls.find(h => h.id === assignment.hallId)!;
            
            // Calculate Seat Number
            const allInHall = studentHallAssignments.filter(a => 
                a.sessionId === assignment.sessionId && a.hallId === assignment.hallId
            );
            
            const sortedStudentsInHall = allInHall.map(a => {
                const s = students.find(st => st.id === a.studentId);
                return { assignmentId: a.id, studentNumber: s?.studentNumber || '' };
            }).sort((a, b) => a.studentNumber.localeCompare(b.studentNumber));

            const seatIndex = sortedStudentsInHall.findIndex(x => x.assignmentId === assignment.id);
            const seatNumber = seatIndex + 1;

            // Find Courses
            const sessionCourseIds = sessionCourses
                .filter(sc => sc.sessionId === session.id)
                .map(sc => sc.courseId);
            
            const myRegisteredCourseIds = studentCourseRegistrations
                .filter(scr => scr.studentId === student.id && scr.examId === activeExam.id)
                .map(scr => scr.courseId);
            
            const myCoursesInSessionIds = sessionCourseIds.filter(id => myRegisteredCourseIds.includes(id));
            const myCourses = courses.filter(c => myCoursesInSessionIds.includes(c.id));

            return {
                session,
                hall,
                seatNumber,
                courses: myCourses
            };
        }).sort((a, b) => new Date(a.session.date).getTime() - new Date(b.session.date).getTime());

        // Derive Exam Place
        const firstHall = halls.find(h => h.id === validAssignments[0].hallId);
        const building = buildings.find(b => b.id === firstHall?.buildingId);
        const examPlace = building ? `${building.name}` : 'Merkez Kampüs';

        setResult({
            student,
            department,
            exam: activeExam,
            examPlace,
            schoolName,
            sessions: sessionDetails
        });
    };

    const handleReset = () => {
        setResult(null);
        setSearchNumber('');
        setError('');
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="container mx-auto max-w-5xl py-8">
            {/* Search Form - Hidden if Result exists */}
            {!result && (
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto border border-gray-100">
                    <div className="text-center mb-8">
                        <div className="bg-orange-100 p-4 rounded-full inline-block mb-4">
                            <SearchCircleIcon className="h-10 w-10 text-orange-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Sınav Giriş Belgesi Sorgulama</h2>
                        <p className="text-gray-500 mt-2">Öğrenci numaranızı girerek sınav yeri ve oturum bilgilerinizi öğrenebilirsiniz.</p>
                    </div>
                    
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Öğrenci Numarası</label>
                            <input 
                                type="text" 
                                placeholder="Örn: 123456789" 
                                value={searchNumber}
                                onChange={(e) => setSearchNumber(e.target.value)}
                                className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 text-lg transition-all"
                            />
                        </div>
                        <button 
                            type="submit"
                            className="w-full bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 duration-200"
                        >
                            SORGULA
                        </button>
                    </form>
                    {error && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 flex items-center justify-center">
                            <span className="font-medium">{error}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Result / Print Area */}
            {result && (
                <div className="bg-white shadow-2xl rounded-2xl overflow-hidden print:shadow-none print:rounded-none">
                    
                    {/* Document Header */}
                    <div className="bg-slate-800 text-white p-8 text-center print:bg-white print:text-black print:p-4 print:border-b-2 print:border-black">
                        <div className="flex items-center justify-center mb-4">
                            <SchoolIcon className="h-12 w-12 text-orange-500 print:text-black" />
                        </div>
                        <h1 className="text-2xl font-bold uppercase tracking-wide">T.C. TRAKYA ÜNİVERSİTESİ</h1>
                        <h2 className="text-lg font-medium opacity-90 mt-1 uppercase">{result.schoolName}</h2>
                        <div className="mt-4 inline-block px-6 py-2 bg-white/10 rounded-full print:bg-transparent print:border print:border-black print:px-4 print:py-1">
                            <h3 className="text-xl font-bold tracking-wider uppercase">{result.exam?.name}</h3>
                        </div>
                    </div>

                    {/* Student Info Card */}
                    <div className="p-8 bg-slate-50 print:bg-white print:p-4">
                        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6 print:border-none print:shadow-none print:p-0">
                            <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4 border-b pb-2">Öğrenci Bilgileri</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                                <div>
                                    <span className="block text-xs font-semibold text-gray-400 uppercase">Öğrenci Numarası</span>
                                    <span className="block text-lg font-bold text-gray-800">{result.student.studentNumber}</span>
                                </div>
                                <div>
                                    <span className="block text-xs font-semibold text-gray-400 uppercase">Adı Soyadı</span>
                                    <span className="block text-lg font-bold text-gray-800 uppercase">{result.student.firstName} {result.student.lastName}</span>
                                </div>
                                <div>
                                    <span className="block text-xs font-semibold text-gray-400 uppercase">Bölüm</span>
                                    <span className="block text-lg font-medium text-gray-800">{result.department?.name}</span>
                                </div>
                                <div>
                                    <span className="block text-xs font-semibold text-gray-400 uppercase">Sınav Yeri</span>
                                    <span className="block text-lg font-medium text-gray-800">{result.examPlace}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sessions List */}
                    <div className="p-8 print:p-4">
                        <div className="max-w-4xl mx-auto space-y-6">
                            <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest border-b pb-2">Oturum Detayları</h4>
                            
                            {result.sessions.map((sessionDetail, index) => (
                                <div key={index} className="flex flex-col md:flex-row bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm print:border-black print:shadow-none print:rounded-lg">
                                    {/* Date/Time Column */}
                                    <div className="bg-orange-50 p-6 flex flex-col justify-center items-center text-center md:w-48 border-b md:border-b-0 md:border-r border-orange-100 print:bg-gray-100 print:border-black print:w-40">
                                        <span className="text-sm font-bold text-orange-600 print:text-black mb-1">{sessionDetail.session.sequenceNumber}. OTURUM</span>
                                        <span className="text-2xl font-bold text-gray-800 print:text-black">
                                            {new Date(sessionDetail.session.date).getDate()}
                                        </span>
                                        <span className="text-sm font-medium text-gray-600 print:text-black uppercase mb-2">
                                            {new Date(sessionDetail.session.date).toLocaleDateString('tr-TR', { month: 'long' })}
                                        </span>
                                        <div className="bg-white px-3 py-1 rounded-full text-sm font-bold text-gray-800 border border-gray-200 print:border-black">
                                            {new Date(sessionDetail.session.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>

                                    {/* Details Column */}
                                    <div className="p-6 flex-1">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 pb-4 border-b border-gray-100 print:border-gray-300">
                                            <div className="mb-2 md:mb-0">
                                                <span className="block text-xs font-bold text-gray-400 uppercase">Salon</span>
                                                <span className="text-lg font-bold text-gray-800">{sessionDetail.hall.name} <span className="text-sm font-normal text-gray-500">({sessionDetail.hall.floor})</span></span>
                                            </div>
                                            <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 print:border-black print:bg-white">
                                                <span className="text-xs font-bold text-blue-600 uppercase mr-2 print:text-black">Sıra No:</span>
                                                <span className="text-xl font-bold text-gray-900">{sessionDetail.seatNumber}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <span className="block text-xs font-bold text-gray-400 uppercase mb-2">Sınav Dersleri</span>
                                            {sessionDetail.courses.length > 0 ? (
                                                <ul className="space-y-2">
                                                    {sessionDetail.courses.map(c => (
                                                        <li key={c.id} className="flex items-start">
                                                            <ChevronRightIcon className="h-5 w-5 text-orange-500 mr-2 mt-0.5 print:hidden" />
                                                            <span className="font-mono font-bold text-gray-600 mr-2">{c.code}</span>
                                                            <span className="text-gray-800 font-medium uppercase">{c.name}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-gray-400 italic text-sm">Bu oturumda sınavınız bulunmamaktadır.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Bar - Hidden on Print */}
                    <div className="bg-gray-50 border-t border-gray-200 p-6 flex justify-between items-center print:hidden">
                        <button 
                            onClick={handleReset}
                            className="px-6 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors"
                        >
                            &larr; Yeni Sorgu
                        </button>
                        <button 
                            onClick={handlePrint}
                            className="bg-slate-800 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-700 transition-colors flex items-center shadow-lg"
                        >
                            <PrinterIcon className="h-5 w-5 mr-2" />
                            GİRİŞ BELGESİNİ YAZDIR
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
};

export default SessionInquiryPage;
