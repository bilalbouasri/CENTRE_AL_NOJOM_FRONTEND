// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Student types
export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  grade: string;
  joined_date: string;
  notes?: string;
  payment_status: string;
  total_subjects: number;
  paid_subjects: number;
  unpaid_subjects: number;
  subjects: Subject[];
  classes?: Class[];
  payments?: Payment[];
  monthlyPayments?: MonthlyPayment[];
}

export interface StudentFormData {
  first_name: string;
  last_name: string;
  phone: string;
  grade: string;
  joined_date: string;
  notes?: string;
  subjects: string[];
}

// Teacher types
export interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address?: string;
  qualification: string;
  experience_years: number;
  hourly_rate: number;
  joined_date: string;
  status: 'active' | 'inactive';
  notes?: string;
  subjects: Subject[];
  classes_count: number;
  total_earnings: number;
  current_month_earnings: number;
  classes?: Class[];
  payments?: TeacherPayment[];
}

export interface TeacherFormData {
  first_name: string;
  last_name: string;
  phone: string;
  joined_date: string;
  monthly_percentage: number;
  notes?: string;
  subjects: string[];
}

// Subject types
export interface Subject {
  id: string;
  name_en: string;
  name_ar: string;
  description?: string;
  fee_amount: number;
  student_count?: number;
  teacher_count?: number;
  class_count?: number;
  monthly_revenue?: number;
}

export interface SubjectFormData {
  name_en: string;
  name_ar: string;
  description?: string;
  fee_amount: number;
}

// Class types
export interface Class {
  id: string;
  name: string;
  teacher_id: string;
  teacher_name: string;
  subject_id: string;
  subject_name: string;
  grade_level: string;
  grade_levels: string[];
  student_count: number;
  max_students: number;
  monthly_fee: number;
  schedule_days: string[];
  start_time: string;
  end_time: string;
  status: 'active' | 'inactive' | 'completed';
  schedules: ClassSchedule[];
  students?: Student[];
  available_students?: AvailableStudent[];
}

export interface ClassFormData {
  name: string;
  teacher_id: string;
  subject_id: string;
  grade_levels: string[];
  schedules: ClassScheduleFormData[];
}

export interface ClassSchedule {
  day_of_week: string;
  start_time: string;
  end_time: string;
}

export interface ClassScheduleFormData {
  day_of_week: string;
  start_time: string;
  end_time: string;
}

export interface AvailableStudent {
  id: string;
  name: string;
  grade: string;
  phone: string;
  can_join: boolean;
  restriction_reason?: string;
}

// Payment types
export interface Payment {
  id: string;
  student_id: string;
  student_name: string;
  subject_id: string;
  subject_name: string;
  amount: number;
  payment_method: string;
  payment_month: number;
  payment_year: number;
  payment_date: string;
  notes?: string;
}

export interface PaymentFormData {
  student_id: string;
  subject_id: string;
  amount: number;
  payment_method: string;
  payment_month: number;
  payment_year: number;
  payment_date: string;
  notes?: string;
}

export interface BulkPaymentData {
  payments: PaymentFormData[];
}

export interface MonthlyPayment {
  id: string;
  subject_id: string;
  subject_name: string;
  amount: number;
  payment_month: number;
  payment_year: number;
  payment_date: string;
}

// Teacher Payment types
export interface TeacherPayment {
  id: string;
  teacher_id: string;
  teacher_name: string;
  amount: number;
  payment_month: number;
  payment_year: number;
  payment_date: string;
  notes?: string;
}

export interface TeacherPaymentFormData {
  teacher_id: string;
  amount: number;
  payment_month: number;
  payment_year: number;
  payment_date: string;
  notes?: string;
}

// Dashboard types
export interface DashboardStats {
  total_students: number;
  total_teachers: number;
  total_classes: number;
  total_subjects: number;
  monthly_revenue: number;
  current_month_revenue: number;
  last_6_months_revenue: MonthlyRevenue[];
  year_to_date: YearToDateStats;
  recent_payments: Payment[];
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface YearToDateStats {
  total_revenue: number;
  average_monthly: number;
  growth_percentage: number;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
  filters?: Record<string, any>;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
    timestamp: string;
  };
}

// Filter types
export interface StudentFilters {
  search?: string;
  grade?: string;
  payment_status?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface PaymentFilters {
  month?: number;
  year?: number;
  student_id?: string;
  subject_id?: string;
  page?: number;
  limit?: number;
}

// Utility types
export interface SelectOption {
  value: string;
  label: string;
  label_ar?: string;
}

export interface WeekDay {
  value: string;
  label_en: string;
  label_ar: string;
}