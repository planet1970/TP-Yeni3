import type { School, Department, Building, Hall, Teacher, Course, Exam, Session, Attendant, Student, ExamCourse, ExamHall, SessionCourse, SessionDepartment, SessionHall } from '../types';

export const initialSchoolsData: School[] = [
    { id: 'S001', name: 'Sosyal Bilimler Enstitüsü', description: 'Lisansüstü eğitim merkezi.', contact: 'sosyalbilimler@trakya.edu.tr' },
    { id: 'S002', name: 'İktisadi ve İdari Bilimler Fakültesi', description: 'İktisat ve İşletme bölümleri.', contact: 'iibf@trakya.edu.tr' },
    { id: 'S003', name: 'Edebiyat Fakültesi', description: 'Sosyal ve beşeri bilimler.', contact: 'edebiyat@trakya.edu.tr' },
];

export const allDepartmentsData: Department[] = [
    { id: 'D001', name: 'Yönetim ve Organizasyon', code: 'YON', schoolId: 'S001' },
    { id: 'D002', name: 'İşletme', code: 'ISL', schoolId: 'S001' },
    { id: 'D003', name: 'İktisat', code: 'IKT', schoolId: 'S001' },
    { id: 'D004', name: 'Türk Dili ve Edebiyatı', code: 'EBY', schoolId: 'S003' },
];

export const initialBuildingsData: Building[] = [
    { id: 'B001', name: 'Edebiyat Fakültesi - A Blok', description: 'Merkez Kampüs Girişi', contact: '0284 235 00 00' },
    { id: 'B002', name: 'İİBF - B Blok', description: 'Kütüphane Yanı', contact: '0284 235 00 01' },
];

export const allHallsData: Hall[] = [
    { id: 'H001', name: '101', capacity: 40, buildingId: 'B001', floor: 'Zemin Kat' },
    { id: 'H002', name: '102', capacity: 45, buildingId: 'B001', floor: 'Zemin Kat' },
    { id: 'H003', name: '103', capacity: 50, buildingId: 'B001', floor: 'Zemin Kat' },
    { id: 'H004', name: '104', capacity: 35, buildingId: 'B001', floor: 'Zemin Kat' },
    { id: 'H005', name: 'Amfi-1', capacity: 100, buildingId: 'B002', floor: '1. Kat' },
];

export const initialTeachersData: Teacher[] = [
    { id: 'T001', title: 'Prof. Dr.', firstName: 'Ahmet', lastName: 'Yılmaz', email: 'ahmet@trakya.edu.tr', phone: '05551112233', schoolId: 'S001' },
    { id: 'T002', title: 'Doç. Dr.', firstName: 'Ayşe', lastName: 'Kaya', email: 'ayse@trakya.edu.tr', phone: '05552223344', schoolId: 'S001' },
];

export const allCoursesData: Course[] = [
    { id: 'C001', name: 'İŞ ETİĞİ', code: 'YON701', departmentId: 'D001', teacherId: 'T001' },
    { id: 'C002', name: 'YÖNETİMDE ÇAĞDAŞ YAKLAŞIMLAR', code: 'YON705', departmentId: 'D001', teacherId: 'T002' },
    { id: 'C003', name: 'ÖRGÜT KÜLTÜRÜ', code: 'YON707', departmentId: 'D001', teacherId: 'T001' },
    { id: 'C004', name: 'ÖRGÜTLERDE İNSAN DAVRANIŞI', code: 'YON709', departmentId: 'D001', teacherId: 'T002' },
    { id: 'C005', name: 'STRATEJİK YÖNETİM', code: 'YON711', departmentId: 'D001', teacherId: 'T001' },
];

export const initialExamsData: Exam[] = [
    { id: 'E001', name: '2025-2026 GÜZ DÖNEMİ ARA SINAVI', description: 'SOSYAL BİLİMLER ENSTİTÜSÜ', closingDate: '2025-11-10', isActive: true },
    { id: 'E002', name: 'UZAKTAN EĞİTİM TEZSİZ YÜKSEK LİSANS FİNAL SINAVLARI', description: 'DÖNEM SONU', closingDate: '2026-01-15', isActive: false },
];

export const allSessionsData: Session[] = [
    { id: 'SS001', sequenceNumber: 1, name: '1. Oturum', date: '2025-11-15T10:00', examId: 'E001', isActive: true },
    { id: 'SS002', sequenceNumber: 2, name: '2. Oturum', date: '2025-11-15T11:30', examId: 'E001', isActive: true },
    { id: 'SS003', sequenceNumber: 3, name: '3. Oturum', date: '2025-11-15T14:00', examId: 'E001', isActive: true },
    { id: 'SS004', sequenceNumber: 4, name: '4. Oturum', date: '2025-11-15T15:30', examId: 'E001', isActive: true },
];

export const initialAttendantsData: Attendant[] = [
    { id: 'A001', title: 'Doç. Dr.', firstName: 'Ali İhsan', lastName: 'MEŞE', schoolId: 'S001', email: 'ali.mese@trakya.edu.tr', phone: '', isActive: true },
    { id: 'A002', title: 'Öğr. Gör.', firstName: 'Can', lastName: 'TEZCAN', schoolId: 'S001', email: 'can.tezcan@trakya.edu.tr', phone: '', isActive: true },
    { id: 'A003', title: 'Dr. Öğr. Üyesi', firstName: 'Levent', lastName: 'DOĞAN', schoolId: 'S001', email: 'levent.dogan@trakya.edu.tr', phone: '', isActive: true },
    { id: 'A004', title: 'Dr. Öğr. Üyesi', firstName: 'Müge', lastName: 'ATAKAN', schoolId: 'S001', email: 'muge.atakan@trakya.edu.tr', phone: '', isActive: true },
    { id: 'A005', title: 'Enstitü Sekr.', firstName: 'Cihan', lastName: 'SAYAN', schoolId: 'S001', email: '', phone: '', isActive: true },
    { id: 'A006', title: 'Bilg. İşl.', firstName: 'Özlem', lastName: 'GÜÇKAN', schoolId: 'S001', email: '', phone: '', isActive: true },
    { id: 'A007', title: 'Bilg. İşl.', firstName: 'Cem', lastName: 'KAVALCI', schoolId: 'S001', email: '', phone: '', isActive: true },
    { id: 'A008', title: 'Dr. Öğr. Üyesi', firstName: 'Tolga', lastName: 'DİLLİOĞLU', schoolId: 'S001', email: '', phone: '', isActive: true },
    { id: 'A009', title: 'Bilg. İşl.', firstName: 'Mehmet', lastName: 'GÜNGÖR', schoolId: 'S001', email: '', phone: '', isActive: true },
    { id: 'A010', title: 'Bilg. İşl.', firstName: 'Hilal', lastName: 'ÖZTÜRK', schoolId: 'S001', email: '', phone: '', isActive: true },
    { id: 'A011', title: 'Arş. Gör. Dr.', firstName: 'Engin', lastName: 'ÇİÇEK', schoolId: 'S001', email: '', phone: '', isActive: true },
    { id: 'A012', title: 'Bilg. İşl.', firstName: 'İlknur', lastName: 'HAKAN', schoolId: 'S001', email: '', phone: '', isActive: true },
    { id: 'A013', title: 'Bilg. İşl.', firstName: 'Eren', lastName: 'MAZLUM', schoolId: 'S001', email: '', phone: '', isActive: true },
    { id: 'A014', title: 'Şef', firstName: 'Cengiz', lastName: 'ERDUVAN', schoolId: 'S001', email: '', phone: '', isActive: true },
    { id: 'A015', title: 'Bilg. İşl.', firstName: 'Arzu Atabey', lastName: 'KILIÇ', schoolId: 'S001', email: '', phone: '', isActive: true },
    { id: 'A016', title: 'Bilg. İşl.', firstName: 'Mehmet', lastName: 'AKTAŞ', schoolId: 'S001', email: '', phone: '', isActive: true },
    { id: 'A017', title: 'Veri Haz. Kont. İşl.', firstName: 'Murat', lastName: 'SOYASLAN', schoolId: 'S001', email: '', phone: '', isActive: true },
    { id: 'A018', title: 'Bilg. İşl.', firstName: 'Serkan', lastName: 'MEYDAN', schoolId: 'S001', email: '', phone: '', isActive: true },
    { id: 'A019', title: '', firstName: 'Şükrü', lastName: 'GÜLER', schoolId: 'S001', email: '', phone: '', isActive: true },
    { id: 'A020', title: '', firstName: 'Arif Kaan', lastName: 'AVCU', schoolId: 'S001', email: '', phone: '', isActive: true },
    { id: 'A021', title: '', firstName: 'İhsan', lastName: 'KARA', schoolId: 'S001', email: '', phone: '', isActive: true },
];

export const initialStudentsData: Student[] = [
    { id: 'ST-2582634027', studentNumber: '2582634027', firstName: 'HİLAL', lastName: 'AKGÜN KOKALA' }
];

export const initialExamCoursesData: ExamCourse[] = [
    { id: 'EC001', examId: 'E001', courseId: 'C001', questionCount: 20, duration: 30, isConfirmed: true, status: 'READY' },
    { id: 'EC002', examId: 'E001', courseId: 'C002', questionCount: 25, duration: 40, isConfirmed: true, status: 'READY' },
];

export const initialSessionCoursesData: SessionCourse[] = [];
export const initialExamHallsData: ExamHall[] = [];
export const initialSessionDepartmentsData: SessionDepartment[] = [];
export const initialSessionHallsData: SessionHall[] = [];