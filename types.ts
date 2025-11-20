
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
    sequenceNumber: number;
    name: string;
    date: string;
    examId: string;
    isActive: boolean;
}

export interface SessionCourse {
    id: string;
    sessionId: string;
    courseId: string;
}

export interface SessionDepartment {
    id: string;
    sessionId: string;
    departmentId: string;
}

export interface ExamCourse {
    id: string;
    examId: string;
    courseId: string;
    questionCount: number;
    duration: number; // in minutes
}

export interface ExamHall {
    id: string;
    examId: string;
    hallId: string;
}

export interface SessionHall {
    id: string;
    sessionId: string;
    departmentId: string;
    hallId: string;
}

export interface Student {
    id: string;
    studentNumber: string;
    firstName: string;
    lastName: string;
}

export interface StudentCourseRegistration {
    id: string;
    examId: string;
    courseId: string;
    studentId: string;
}

export interface StudentHallAssignment {
    id: string;
    sessionId: string;
    departmentId: string;
    hallId: string;
    studentId: string;
}
