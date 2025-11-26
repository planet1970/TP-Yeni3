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
  contact: string;
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
    teacherId?: string;
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
    instructions?: string; // Exam instructions (Yönerge)
    isConfirmed: boolean; // Admin approval status
    status?: 'DRAFT' | 'READY'; // Teacher workflow status
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

export interface Teacher {
    id: string;
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    schoolId: string;
}

export interface Attendant {
    id: string;
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    schoolId: string;
    isActive: boolean;
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

export interface AttendantAssignment {
    id: string;
    sessionId: string;
    buildingId: string;
    hallId?: string; // Optional, distincts hall staff vs building staff
    roleName: string; // "Salon Başkanı", "Bina Sorumlusu" etc.
    attendantId: string;
    status: 'ASSIGNED' | 'ACCEPTED' | 'REJECTED';
}

export interface TaskRequest {
    id: string;
    attendantId: string;
    sessionId: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    requestDate: string;
}

// --- Teacher Module Types ---

export interface Topic {
    id: string;
    courseId: string;
    name: string;
}

export interface Question {
    id: string;
    courseId: string;
    topicId?: string; // Linked Topic
    type: 'TEST' | 'CLASSIC'; // Question Type
    text: string;
    options?: string[]; // Array of 4 or 5 options (Only for TEST)
    correctAnswer?: string; // Index of correct option (Only for TEST)
    // Points removed from Question Bank
}

export interface ExamCourseQuestion {
    id: string;
    examId: string;
    courseId: string;
    questionId: string;
    points: number; // Points are now specific to the Exam context
}

// --- Exam Center Types ---
export interface HallListPrintStatus {
    id: string;
    sessionId: string;
    departmentId: string;
    hallId: string;
    isPrinted: boolean;
    printedAt?: string;
}