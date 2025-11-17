import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Subject, SubjectFormData } from '../types';
import { subjectAPI } from '../services/api';

interface SubjectState {
  subjects: Subject[];
  currentSubject: Subject | null;
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  } | null;
  filters: {
    search?: string;
    grade_level?: string;
    status?: string;
    page?: number;
    limit?: number;
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: SubjectState = {
  subjects: [],
  currentSubject: null,
  pagination: null,
  filters: {
    search: '',
    grade_level: '',
    status: '',
    page: 1,
    limit: 15,
  },
  isLoading: false,
  error: null,
};

export const fetchSubjects = createAsyncThunk(
  'subjects/fetchSubjects',
  async (filters: SubjectState['filters'], { rejectWithValue }) => {
    try {
      const response = await subjectAPI.getAll(filters);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch subjects';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchSubject = createAsyncThunk(
  'subjects/fetchSubject',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await subjectAPI.getById(id);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch subject';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createSubject = createAsyncThunk(
  'subjects/createSubject',
  async (subjectData: SubjectFormData, { rejectWithValue }) => {
    try {
      const response = await subjectAPI.create(subjectData);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create subject';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateSubject = createAsyncThunk(
  'subjects/updateSubject',
  async ({ id, data }: { id: string; data: SubjectFormData }, { rejectWithValue }) => {
    try {
      const response = await subjectAPI.update(id, data);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update subject';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteSubject = createAsyncThunk(
  'subjects/deleteSubject',
  async (id: string, { rejectWithValue }) => {
    try {
      await subjectAPI.delete(id);
      return id;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete subject';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchSubjectsByGrade = createAsyncThunk(
  'subjects/fetchByGrade',
  async (grade: string, { rejectWithValue }) => {
    try {
      const response = await subjectAPI.getByGrade(grade);
      return { grade, data: response.data };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch subjects by grade';
      return rejectWithValue(errorMessage);
    }
  }
);

const subjectSlice = createSlice({
  name: 'subjects',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<Partial<SubjectState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        grade_level: '',
        status: '',
        page: 1,
        limit: 15,
      };
    },
    clearCurrentSubject: (state) => {
      state.currentSubject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch subjects
      .addCase(fetchSubjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subjects = action.payload.data;
        state.pagination = action.payload.meta;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch single subject
      .addCase(fetchSubject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSubject = action.payload;
      })
      .addCase(fetchSubject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create subject
      .addCase(createSubject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSubject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subjects.unshift(action.payload);
      })
      .addCase(createSubject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update subject
      .addCase(updateSubject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSubject.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.subjects.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.subjects[index] = action.payload;
        }
        if (state.currentSubject?.id === action.payload.id) {
          state.currentSubject = action.payload;
        }
      })
      .addCase(updateSubject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete subject
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.subjects = state.subjects.filter(s => s.id !== action.payload);
        if (state.currentSubject?.id === action.payload) {
          state.currentSubject = null;
        }
      })
      .addCase(deleteSubject.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setFilters, clearFilters, clearCurrentSubject } = subjectSlice.actions;
export default subjectSlice.reducer;