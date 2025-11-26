
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import StatCard from '../components/StatCard';
import { 
  UserGroupIcon, 
  UsersIcon,
  BookOpenIcon,
  ExamIcon,
  ClockIcon,
  SchoolIcon,
  BriefcaseIcon
} from '../components/icons';
import type { Student, Teacher, Attendant, Exam, Session, Course, School } from '../types';

interface DashboardPageProps {
    students: Student[];
    teachers: Teacher[];
    attendants: Attendant[];
    exams: Exam[];
    sessions: Session[];
    courses: Course[];
    schools: School[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#F97316', '#8884d8'];

const DashboardPage: React.FC<DashboardPageProps> = ({
    students,
    teachers,
    attendants,
    exams,
    sessions,
    courses,
    schools
}) => {
    
    const stats = useMemo(() => {
        return {
            totalStudents: students.length,
            totalStaff: teachers.length + attendants.length,
            activeExams: exams.filter(e => e.isActive).length,
            totalCourses: courses.length,
            upcomingSessions: sessions
                .filter(s => new Date(s.date) > new Date())
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 5)
        };
    }, [students, teachers, attendants, exams, sessions, courses]);

    // Chart Data: Courses per School (Mock logic since direct link isn't explicit in props, but can be inferred via Departments if available, simplified here for demo)
    // Since we don't pass Departments to Dashboard yet, we will show simple distribution of Entity Counts
    const entityDistributionData = [
        { name: 'Öğrenciler', value: students.length },
        { name: 'Öğretmenler', value: teachers.length },
        { name: 'Görevliler', value: attendants.length },
        { name: 'Dersler', value: courses.length },
    ];

    return (
        <div className="container mx-auto">
            {/* Welcome Banner */}
            <div className="bg-white border-l-4 border-blue-500 p-4 mb-6 rounded-r-md shadow-sm flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">Sınav Yönetim Sistemine Hoş Geldiniz</h2>
                    <p className="text-sm text-gray-600">Sistem durumu normal ve kullanıma hazır.</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500 font-semibold">{new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>
      
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard
                    title="Toplam Öğrenci"
                    value={stats.totalStudents.toString()}
                    icon={UserGroupIcon}
                    trend="Aktif"
                    trendDirection="up"
                    period="Dönem"
                />
                <StatCard
                    title="Akademik Kadro"
                    value={teachers.length.toString()}
                    icon={UsersIcon}
                    trend="Eğitmen"
                    trendDirection="up"
                    period="Toplam"
                />
                <StatCard
                    title="İdari Görevli"
                    value={attendants.length.toString()}
                    icon={BriefcaseIcon}
                    trend="Personel"
                    trendDirection="up"
                    period="Aktif"
                />
                <StatCard
                    title="Aktif Sınavlar"
                    value={stats.activeExams.toString()}
                    icon={ExamIcon}
                    trend={stats.activeExams > 0 ? "Devam Ediyor" : "Yok"}
                    trendDirection={stats.activeExams > 0 ? "up" : "down"}
                    period="Süreç"
                />
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Chart: System Overview */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Sistem Veri Dağılımı</h3>
                    <div className="h-64 w-full min-w-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={entityDistributionData}>
                                <XAxis dataKey="name" tick={{fontSize: 12}} />
                                <YAxis />
                                <Tooltip cursor={{fill: '#f3f4f6'}} />
                                <Bar dataKey="value" fill="#F97316" radius={[4, 4, 0, 0]} name="Sayı" barSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Chart: Pie Distribution */}
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Kayıt Oranları</h3>
                    <div className="h-64 w-full relative min-w-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={entityDistributionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {entityDistributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <span className="text-2xl font-bold text-gray-700">{stats.totalStudents + stats.totalStaff}</span>
                            <span className="block text-xs text-gray-500">Toplam Kişi</span>
                        </div>
                    </div>
                </div>

                {/* List: Upcoming Sessions */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Yaklaşan Sınav Oturumları</h3>
                        <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded">İlk 5</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3">Oturum Adı</th>
                                    <th className="px-4 py-3">Tarih</th>
                                    <th className="px-4 py-3">Saat</th>
                                    <th className="px-4 py-3">Sınav</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.upcomingSessions.map(session => {
                                    const exam = exams.find(e => e.id === session.examId);
                                    return (
                                        <tr key={session.id} className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-gray-900">{session.name}</td>
                                            <td className="px-4 py-3">{new Date(session.date).toLocaleDateString('tr-TR')}</td>
                                            <td className="px-4 py-3 font-bold text-orange-600">{new Date(session.date).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}</td>
                                            <td className="px-4 py-3 text-xs">{exam?.name || '-'}</td>
                                        </tr>
                                    );
                                })}
                                {stats.upcomingSessions.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-6 text-center text-gray-400 italic">
                                            Yaklaşan planlı oturum bulunamadı.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* List: Schools */}
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Tanımlı Okullar</h3>
                    <ul className="space-y-4">
                        {schools.map(school => (
                            <li key={school.id} className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="bg-white p-2 rounded-full shadow-sm mr-3 shrink-0">
                                    <SchoolIcon className="h-5 w-5 text-blue-500" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-800">{school.name}</h4>
                                    <p className="text-xs text-gray-500 mt-1 truncate">{school.contact}</p>
                                </div>
                            </li>
                        ))}
                        {schools.length === 0 && (
                            <li className="text-center text-gray-400 text-sm py-4">Okul kaydı bulunamadı.</li>
                        )}
                    </ul>
                </div>

            </div>
        </div>
    );
};

export default DashboardPage;
