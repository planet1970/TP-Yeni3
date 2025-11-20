
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
  IdentificationIcon
} from './icons';

const navItemsYonetim: NavItemType[] = [
  { id: 'dashboard', name: 'Ana Sayfa', icon: DashboardIcon, path: '#' },
  { id: 'schools', name: 'Okullar', icon: SchoolIcon, path: '#' },
  { id: 'departments', name: 'Bölümler', icon: DepartmentIcon, path: '#' },
  { id: 'buildings', name: 'Binalar', icon: BuildingIcon, path: '#' },
  { id: 'halls', name: 'Salonlar', icon: HallIcon, path: '#' },
  { id: 'courses', name: 'Dersler', icon: CourseIcon, path: '#' },
  { id: 'students', name: 'Öğrenciler', icon: UsersIcon, path: '#' },
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
];

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
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  return (
    <aside className="w-64 bg-custom-dark-blue text-white flex flex-col h-screen flex-shrink-0">
      <div className="flex items-center justify-between p-4 mb-2 shrink-0">
        <div className="flex items-center">
          <SchoolIcon className="h-8 w-8 text-orange-400" />
          <span className="text-xl font-bold ml-2">Sınav Sistemi</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-3 mt-2">Yönetim</h3>
        <ul className="space-y-2">
          {navItemsYonetim.map((item) => (
            <NavItem 
              key={item.id} 
              item={item} 
              isActive={activePage === item.id}
              onNavigate={onNavigate}
            />
          ))}
        </ul>

        <h3 className="text-xs text-gray-400 uppercase tracking-wider mt-8 mb-3">Sınav İşlemleri</h3>
        <ul className="space-y-2">
          {navItemsSinav.map((item) => (
            <NavItem 
              key={item.id} 
              item={item} 
              isActive={activePage === item.id}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
        
        <div className="mt-8 border-t border-gray-700 pt-4">
             <ul className="space-y-2">
                <NavItem 
                  item={{ id: 'settings', name: 'Ayarlar', icon: SettingsIcon, path: '#' }} 
                  isActive={activePage === 'settings'}
                  onNavigate={onNavigate}
                />
             </ul>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
