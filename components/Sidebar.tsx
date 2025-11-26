
import React, { useState } from 'react';
import type { NavItemType } from '../types';
import { 
  ChevronRightIcon, 
  ChevronDownIcon,
  DashboardIcon,
  SettingsIcon,
  UsersIcon,
  ClockIcon,
  SchoolIcon,
  DepartmentIcon,
  BuildingIcon,
  CourseIcon,
  ExamIcon,
  HallIcon,
  BookOpenIcon,
  UserGroupIcon,
  ClipboardListIcon,
  IdentificationIcon,
  SearchCircleIcon,
  BriefcaseIcon,
  ClipboardCheckIcon,
  DocumentTextIcon,
  DocumentDuplicateIcon,
  HandRaiseIcon,
  CheckBadgeIcon,
  ArchiveBoxIcon,
  BadgeIcon,
  PencilSquareIcon,
  StackIcon,
  AcademicCapIcon,
  ListBulletIcon,
  QrCodeIcon
} from './icons';

interface NavItemProps {
  item: NavItemType;
  isActive: boolean;
  onNavigate: (pageState: { page: string }) => void;
}

const NavItem: React.FC<NavItemProps> = ({ item, isActive, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubItems = item.subItems !== undefined;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasSubItems) {
      setIsOpen(!isOpen);
    } else {
      onNavigate({ page: item.id });
    }
  };

  return (
    <li>
      <a
        href={item.path}
        onClick={handleClick}
        className={`flex items-center justify-between p-3 rounded-lg text-gray-300 hover:bg-custom-dark-blue-light transition-colors duration-200 ${isActive ? 'bg-orange-500 text-white' : ''}`}
      >
        <div className="flex items-center">
          <item.icon className="h-5 w-5 mr-3" />
          <span>{item.name}</span>
        </div>
        {hasSubItems && (
          isOpen ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />
        )}
      </a>
      {hasSubItems && isOpen && (
        <ul className="pl-8 mt-2 space-y-2">
          {/* Placeholder for sub-items */}
        </ul>
      )}
    </li>
  );
};

interface SidebarProps {
  activePage: string;
  onNavigate: (pageState: { page: string }) => void;
  isOpen?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, isOpen }) => {
    // State to track which sections are open. Defaulting all to true for initial visibility.
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        management: true,
        exam_ops: true,
        attendant_ops: true,
        exam_center_ops: true,
        task_ops: true,
        teacher_ops: true,
    });

    const toggleSection = (sectionId: string) => {
        setOpenSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    // Helper to close sidebar on navigation if on mobile
    const handleNavigation = (pageState: { page: string }) => {
        onNavigate(pageState);
    };

    const navItemsYonetim: NavItemType[] = [
        { id: 'dashboard', name: 'Ana Sayfa', icon: DashboardIcon, path: '#' },
        { id: 'schools', name: 'Okullar', icon: SchoolIcon, path: '#' },
        { id: 'departments', name: 'Bölümler', icon: DepartmentIcon, path: '#' },
        { id: 'buildings', name: 'Binalar', icon: BuildingIcon, path: '#' },
        { id: 'halls', name: 'Salonlar', icon: HallIcon, path: '#' },
        { id: 'courses', name: 'Dersler', icon: CourseIcon, path: '#' },
        { id: 'teachers', name: 'Öğretmenler', icon: UsersIcon, path: '#' },
    ];

    const navItemsSinav: NavItemType[] = [
        { id: 'exams', name: 'Sınavlar', icon: ExamIcon, path: '#' },
        { id: 'sessions', name: 'Sınav-Oturum', icon: ClockIcon, path: '#' },
        { id: 'exam-courses', name: 'Sınav-Ders', icon: BookOpenIcon, path: '#' },
        { id: 'exam-halls', name: 'Sınav-Salon', icon: HallIcon, path: '#' },
        { id: 'student-registrations', name: 'Ders-Öğrenci', icon: UserGroupIcon, path: '#' },
        { id: 'session-courses', name: 'Oturum-Ders', icon: ClipboardListIcon, path: '#' },
        { id: 'session-halls', name: 'Oturum-Salon', icon: HallIcon, path: '#' },
        { id: 'session-students', name: 'Oturum-Öğrenci', icon: IdentificationIcon, path: '#' },
        { id: 'session-inquiry', name: 'Oturum Sorgu', icon: SearchCircleIcon, path: '#' },
    ];

    const navItemsGorevli: NavItemType[] = [
        { id: 'attendants', name: 'Görevliler', icon: BriefcaseIcon, path: '#' },
        { id: 'attendant-assignments', name: 'Görevli Tanımla', icon: ClipboardCheckIcon, path: '#' },
        { id: 'signature-lists', name: 'İmza Listeleri', icon: DocumentTextIcon, path: '#' },
        { id: 'hall-lists', name: 'Salon Listeleri (Eski)', icon: DocumentDuplicateIcon, path: '#' },
    ];

    const navItemsSinavMerkezi: NavItemType[] = [
        { id: 'exam-center-hall-lists', name: 'Salon Listeleri', icon: ListBulletIcon, path: '#' },
        { id: 'exam-center-optic-forms', name: 'Optik Formlar', icon: QrCodeIcon, path: '#' },
    ];

    const navItemsGorev: NavItemType[] = [
        { id: 'task-request', name: 'Görev İste', icon: HandRaiseIcon, path: '#' },
        { id: 'task-accept', name: 'Görev Kabul', icon: CheckBadgeIcon, path: '#' },
        { id: 'task-cards', name: 'Görev Kartı', icon: BadgeIcon, path: '#' },
        { id: 'task-archive', name: 'Arşiv', icon: ArchiveBoxIcon, path: '#' },
    ];

    const navItemsOgretmen: NavItemType[] = [
        { id: 'teacher-question-bank', name: 'Soru Bankası', icon: StackIcon, path: '#' },
        { id: 'teacher-exam-definition', name: 'Sınav Oluştur', icon: PencilSquareIcon, path: '#' },
    ];

  return (
    <aside className={`
        w-64 bg-custom-dark-blue text-white flex flex-col h-screen 
        fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-auto shrink-0 print:hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="flex items-center justify-between p-4 mb-2 shrink-0">
        <div className="flex items-center">
          <SchoolIcon className="h-8 w-8 text-orange-400" />
          <span className="text-xl font-bold ml-2">Sınav Sistemi</span>
        </div>
      </div>

      {/* Added style to hide scrollbar but allow scrolling */}
      <nav className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>
            {`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}
        </style>
        
        {/* YÖNETİM Section */}
        <div>
            <button 
                onClick={() => toggleSection('management')}
                className="w-full flex justify-between items-center text-xs text-gray-400 uppercase tracking-wider mb-3 mt-2 hover:text-white focus:outline-none"
            >
                <span>YÖNETİM</span>
                {openSections['management'] ? <ChevronDownIcon className="h-3 w-3" /> : <ChevronRightIcon className="h-3 w-3" />}
            </button>
            {openSections['management'] && (
                <ul className="space-y-2 mb-4">
                {navItemsYonetim.map((item) => (
                    <NavItem 
                    key={item.id} 
                    item={item} 
                    isActive={activePage === item.id}
                    onNavigate={handleNavigation}
                    />
                ))}
                </ul>
            )}
        </div>

        {/* SINAV İŞLEMLERİ Section */}
        <div>
            <button 
                onClick={() => toggleSection('exam_ops')}
                className="w-full flex justify-between items-center text-xs text-gray-400 uppercase tracking-wider mb-3 mt-4 hover:text-white focus:outline-none"
            >
                <span>SINAV İŞLEMLERİ</span>
                {openSections['exam_ops'] ? <ChevronDownIcon className="h-3 w-3" /> : <ChevronRightIcon className="h-3 w-3" />}
            </button>
            {openSections['exam_ops'] && (
                <ul className="space-y-2 mb-4">
                {navItemsSinav.map((item) => (
                    <NavItem 
                    key={item.id} 
                    item={item} 
                    isActive={activePage === item.id}
                    onNavigate={handleNavigation}
                    />
                ))}
                </ul>
            )}
        </div>

        {/* GÖREVLİ İŞLEMLERİ Section */}
        <div>
            <button 
                onClick={() => toggleSection('attendant_ops')}
                className="w-full flex justify-between items-center text-xs text-gray-400 uppercase tracking-wider mb-3 mt-4 hover:text-white focus:outline-none"
            >
                <span>GÖREVLİ İŞLEMLERİ</span>
                {openSections['attendant_ops'] ? <ChevronDownIcon className="h-3 w-3" /> : <ChevronRightIcon className="h-3 w-3" />}
            </button>
            {openSections['attendant_ops'] && (
                <ul className="space-y-2 mb-4">
                {navItemsGorevli.map((item) => (
                    <NavItem 
                    key={item.id} 
                    item={item} 
                    isActive={activePage === item.id}
                    onNavigate={handleNavigation}
                    />
                ))}
                </ul>
            )}
        </div>

        {/* SINAV MERKEZİ Section */}
        <div>
            <button 
                onClick={() => toggleSection('exam_center_ops')}
                className="w-full flex justify-between items-center text-xs text-gray-400 uppercase tracking-wider mb-3 mt-4 hover:text-white focus:outline-none"
            >
                <span>SINAV MERKEZİ</span>
                {openSections['exam_center_ops'] ? <ChevronDownIcon className="h-3 w-3" /> : <ChevronRightIcon className="h-3 w-3" />}
            </button>
            {openSections['exam_center_ops'] && (
                <ul className="space-y-2 mb-4">
                {navItemsSinavMerkezi.map((item) => (
                    <NavItem 
                    key={item.id} 
                    item={item} 
                    isActive={activePage === item.id}
                    onNavigate={handleNavigation}
                    />
                ))}
                </ul>
            )}
        </div>

        {/* ÖĞRETMEN Section */}
        <div>
            <button 
                onClick={() => toggleSection('teacher_ops')}
                className="w-full flex justify-between items-center text-xs text-gray-400 uppercase tracking-wider mb-3 mt-4 hover:text-white focus:outline-none"
            >
                <span>ÖĞRETMEN</span>
                {openSections['teacher_ops'] ? <ChevronDownIcon className="h-3 w-3" /> : <ChevronRightIcon className="h-3 w-3" />}
            </button>
            {openSections['teacher_ops'] && (
                <ul className="space-y-2 mb-4">
                {navItemsOgretmen.map((item) => (
                    <NavItem 
                    key={item.id} 
                    item={item} 
                    isActive={activePage === item.id}
                    onNavigate={handleNavigation}
                    />
                ))}
                </ul>
            )}
        </div>

        {/* GÖREV İŞLEMLERİ Section */}
        <div>
            <button 
                onClick={() => toggleSection('task_ops')}
                className="w-full flex justify-between items-center text-xs text-gray-400 uppercase tracking-wider mb-3 mt-4 hover:text-white focus:outline-none"
            >
                <span>GÖREV İŞLEMLERİ</span>
                {openSections['task_ops'] ? <ChevronDownIcon className="h-3 w-3" /> : <ChevronRightIcon className="h-3 w-3" />}
            </button>
            {openSections['task_ops'] && (
                <ul className="space-y-2 mb-4">
                {navItemsGorev.map((item) => (
                    <NavItem 
                    key={item.id} 
                    item={item} 
                    isActive={activePage === item.id}
                    onNavigate={handleNavigation}
                    />
                ))}
                </ul>
            )}
        </div>
        
        <div className="mt-8 border-t border-gray-700 pt-4">
             <ul className="space-y-2">
                <NavItem 
                  item={{ id: 'settings', name: 'Ayarlar', icon: SettingsIcon, path: '#' }} 
                  isActive={activePage === 'settings'}
                  onNavigate={handleNavigation}
                />
             </ul>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
