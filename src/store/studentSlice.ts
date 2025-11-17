import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Student, StudentFormData, PaginatedResponse, StudentFilters } from '../types';
import { studentAPI } from '../services/api';

interface StudentState {
  students: Student[];
  currentStudent: Student | null;
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  } | null;
  filters: StudentFilters;
  isLoading: boolean;
  error: string | null;
}

const initialState: StudentState = {
  students: [],
  currentStudent: null,
  pagination: null,
  filters: {
    search: '',
    grade: '',
    payment_status: '',
    page: 1,
    limit: 15,
  },
  isLoading: false,
  error: null,
};

export const fetchStudents = createAsyncThunk(
  'students/fetchStudents',
  async (filters: StudentFilters, { rejectWithValue }) => {
    try {
      const response = await studentAPI.getAll(filters);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch students';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchStudent = createAsyncThunk(
  'students/fetchStudent',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await studentAPI.getById(id);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch student';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createStudent = createAsyncThunk(
  'students/createStudent',
  async (studentData: StudentFormData, { rejectWithValue }) => {
    try {
      const response = await studentAPI.create(studentData);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create student';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateStudent = createAsyncThunk(
  'students/updateStudent',
  async ({ id, data }: { id: string; data: StudentFormData }, { rejectWithValue }) => {
    try {
      const response = await studentAPI.update(id, data);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update student';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteStudent = createAsyncThunk(
  'students/deleteStudent',
  async (id: string, { rejectWithValue }) => {
    try {
      await studentAPI.delete(id);
      return id;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete student';
      return rejectWithValue(errorMessage);
    }
  }
);

const studentSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<Partial<StudentFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        grade: '',
        payment_status: '',
        page: 1,
        limit: 15,
      };
    },
    clearCurrentStudent: (state) => {
      state.currentStudent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch students
      .addCase(fetchStudents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.students = action.payload.data;
        state.pagination = action.payload.meta;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch single student
      .addCase(fetchStudent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentStudent = action.payload;
      })
      .addCase(fetchStudent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create student
      .addCase(createStudent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.students.unshift(action.payload);
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update student
      .addCase(updateStudent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.students.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.students[index] = action.payload;
        }
        if (state.currentStudent?.id === action.payload.id) {
          state.currentStudent = action.payload;
        }
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete student
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.students = state.students.filter(s => s.id !== action.payload);
        if (state.currentStudent?.id === action.payload) {
          state.currentStudent = null;
        }
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setFilters, clearFilters, clearCurrentStudent } = studentSlice.actions;
export default studentSlice.reducer;