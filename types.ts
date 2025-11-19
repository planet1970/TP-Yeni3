
import React from 'react';

export interface NavItemType {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  subItems?: NavItemType[];
}

export interface StatCardType {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: string;
  trendDirection: 'up' | 'down';
  period: string;
}

export interface PerformanceDataType {
  name: string;
  pageViews: number;
  clicks: number;
}

export interface TopPageType {
  path: string;
  views: number;
  exitRate: number;
}

export interface School {
  id: string;
  name: string;
  description: string;
  contact: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  schoolId: string;
}

export interface Building {
  id: string;
  name: string;
  description: string;
}

export interface Hall {
    id: string;
    name: string;
    capacity: number;
    buildingId: string;
    floor: string;
}

export interface Course {
    id: string;
    name: string;
    code: string;
    departmentId: string;
}

export interface Exam {
    id: string;
    name: string;
    description: string;
    closingDate: string;
    isActive: boolean;
}

export interface Session {
    id: string;
    name: string;
    date: string;
    examId: string;
}