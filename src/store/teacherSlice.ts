import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Teacher, TeacherFormData } from '../types';
import { teacherAPI } from '../services/api';

interface TeacherState {
  teachers: Teacher[];
  currentTeacher: Teacher | null;
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  } | null;
  filters: {
    search?: string;
    subject_id?: string;
    status?: string;
    page?: number;
    limit?: number;
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: TeacherState = {
  teachers: [],
  currentTeacher: null,
  pagination: null,
  filters: {
    search: '',
    subject_id: '',
    status: '',
    page: 1,
    limit: 15,
  },
  isLoading: false,
  error: null,
};

export const fetchTeachers = createAsyncThunk(
  'teachers/fetchTeachers',
  async (filters: TeacherState['filters'], { rejectWithValue }) => {
    try {
      const response = await teacherAPI.getAll(filters);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch teachers';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchTeacher = createAsyncThunk(
  'teachers/fetchTeacher',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await teacherAPI.getById(id);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch teacher';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createTeacher = createAsyncThunk(
  'teachers/createTeacher',
  async (teacherData: TeacherFormData, { rejectWithValue }) => {
    try {
      const response = await teacherAPI.create(teacherData);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create teacher';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateTeacher = createAsyncThunk(
  'teachers/updateTeacher',
  async ({ id, data }: { id: string; data: TeacherFormData }, { rejectWithValue }) => {
    try {
      const response = await teacherAPI.update(id, data);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update teacher';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteTeacher = createAsyncThunk(
  'teachers/deleteTeacher',
  async (id: string, { rejectWithValue }) => {
    try {
      await teacherAPI.delete(id);
      return id;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete teacher';
      return rejectWithValue(errorMessage);
    }
  }
);

const teacherSlice = createSlice({
  name: 'teachers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<Partial<TeacherState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        subject_id: '',
        status: '',
        page: 1,
        limit: 15,
      };
    },
    clearCurrentTeacher: (state) => {
      state.currentTeacher = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch teachers
      .addCase(fetchTeachers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teachers = action.payload.data;
        state.pagination = action.payload.meta;
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch single teacher
      .addCase(fetchTeacher.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTeacher.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTeacher = action.payload;
      })
      .addCase(fetchTeacher.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create teacher
      .addCase(createTeacher.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTeacher.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teachers.unshift(action.payload);
      })
      .addCase(createTeacher.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update teacher
      .addCase(updateTeacher.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTeacher.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.teachers.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.teachers[index] = action.payload;
        }
        if (state.currentTeacher?.id === action.payload.id) {
          state.currentTeacher = action.payload;
        }
      })
      .addCase(updateTeacher.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete teacher
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        state.teachers = state.teachers.filter(t => t.id !== action.payload);
        if (state.currentTeacher?.id === action.payload) {
          state.currentTeacher = null;
        }
      })
      .addCase(deleteTeacher.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setFilters, clearFilters, clearCurrentTeacher } = teacherSlice.actions;
export default teacherSlice.reducer;