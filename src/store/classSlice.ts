import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Class, ClassFormData } from '../types';
import { classAPI } from '../services/api';

interface ClassState {
  classes: Class[];
  currentClass: Class | null;
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  } | null;
  filters: {
    search?: string;
    subject_id?: string;
    teacher_id?: string;
    grade_level?: string;
    status?: string;
    page?: number;
    limit?: number;
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: ClassState = {
  classes: [],
  currentClass: null,
  pagination: null,
  filters: {
    search: '',
    subject_id: '',
    teacher_id: '',
    grade_level: '',
    status: '',
    page: 1,
    limit: 15,
  },
  isLoading: false,
  error: null,
};

export const fetchClasses = createAsyncThunk(
  'classes/fetchClasses',
  async (filters: ClassState['filters'], { rejectWithValue }) => {
    try {
      const response = await classAPI.getAll(filters);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch classes';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchClass = createAsyncThunk(
  'classes/fetchClass',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await classAPI.getById(id);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch class';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createClass = createAsyncThunk(
  'classes/createClass',
  async (classData: ClassFormData, { rejectWithValue }) => {
    try {
      const response = await classAPI.create(classData);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create class';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateClass = createAsyncThunk(
  'classes/updateClass',
  async ({ id, data }: { id: string; data: ClassFormData }, { rejectWithValue }) => {
    try {
      const response = await classAPI.update(id, data);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update class';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteClass = createAsyncThunk(
  'classes/deleteClass',
  async (id: string, { rejectWithValue }) => {
    try {
      await classAPI.delete(id);
      return id;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete class';
      return rejectWithValue(errorMessage);
    }
  }
);

export const addStudentToClass = createAsyncThunk(
  'classes/addStudent',
  async ({ classId, studentId }: { classId: string; studentId: string }, { rejectWithValue }) => {
    try {
      await classAPI.addStudent(classId, studentId);
      return { classId, studentId };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add student to class';
      return rejectWithValue(errorMessage);
    }
  }
);

export const removeStudentFromClass = createAsyncThunk(
  'classes/removeStudent',
  async ({ classId, studentId }: { classId: string; studentId: string }, { rejectWithValue }) => {
    try {
      await classAPI.removeStudent(classId, studentId);
      return { classId, studentId };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove student from class';
      return rejectWithValue(errorMessage);
    }
  }
);

const classSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<Partial<ClassState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        subject_id: '',
        teacher_id: '',
        grade_level: '',
        status: '',
        page: 1,
        limit: 15,
      };
    },
    clearCurrentClass: (state) => {
      state.currentClass = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch classes
      .addCase(fetchClasses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.classes = action.payload.data;
        state.pagination = action.payload.meta;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch single class
      .addCase(fetchClass.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClass.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentClass = action.payload;
      })
      .addCase(fetchClass.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create class
      .addCase(createClass.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.isLoading = false;
        state.classes.unshift(action.payload);
      })
      .addCase(createClass.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update class
      .addCase(updateClass.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateClass.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.classes.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.classes[index] = action.payload;
        }
        if (state.currentClass?.id === action.payload.id) {
          state.currentClass = action.payload;
        }
      })
      .addCase(updateClass.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete class
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.classes = state.classes.filter(c => c.id !== action.payload);
        if (state.currentClass?.id === action.payload) {
          state.currentClass = null;
        }
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setFilters, clearFilters, clearCurrentClass } = classSlice.actions;
export default classSlice.reducer;