import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Payment, PaymentFormData } from '../types';
import { paymentAPI } from '../services/api';

interface PaymentState {
  payments: Payment[];
  currentPayment: Payment | null;
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  } | null;
  filters: {
    month?: number;
    year?: number;
    student_id?: string;
    subject_id?: string;
    page?: number;
    limit?: number;
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  payments: [],
  currentPayment: null,
  pagination: null,
  filters: {
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    student_id: '',
    subject_id: '',
    page: 1,
    limit: 15,
  },
  isLoading: false,
  error: null,
};

export const fetchPayments = createAsyncThunk(
  'payments/fetchPayments',
  async (filters: PaymentState['filters'], { rejectWithValue }) => {
    try {
      const response = await paymentAPI.getAll(filters);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch payments';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchPayment = createAsyncThunk(
  'payments/fetchPayment',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.getById(id);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch payment';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createPayment = createAsyncThunk(
  'payments/createPayment',
  async (paymentData: PaymentFormData, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.create(paymentData);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create payment';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createBulkPayments = createAsyncThunk(
  'payments/createBulkPayments',
  async (paymentsData: { payments: PaymentFormData[] }, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.createBulk(paymentsData);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create bulk payments';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updatePayment = createAsyncThunk(
  'payments/updatePayment',
  async ({ id, data }: { id: string; data: PaymentFormData }, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.update(id, data);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update payment';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deletePayment = createAsyncThunk(
  'payments/deletePayment',
  async (id: string, { rejectWithValue }) => {
    try {
      await paymentAPI.delete(id);
      return id;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete payment';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchStudentPayments = createAsyncThunk(
  'payments/fetchStudentPayments',
  async (studentId: string, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.getByStudent(studentId);
      return { studentId, data: response.data };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch student payments';
      return rejectWithValue(errorMessage);
    }
  }
);

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<Partial<PaymentState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        student_id: '',
        subject_id: '',
        page: 1,
        limit: 15,
      };
    },
    clearCurrentPayment: (state) => {
      state.currentPayment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch payments
      .addCase(fetchPayments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.payments = action.payload.data;
        state.pagination = action.payload.meta;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch single payment
      .addCase(fetchPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPayment = action.payload;
      })
      .addCase(fetchPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create payment
      .addCase(createPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.payments.unshift(action.payload);
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create bulk payments
      .addCase(createBulkPayments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBulkPayments.fulfilled, (state, action) => {
        state.isLoading = false;
        // Add the new payments to the list
        state.payments = [...action.payload, ...state.payments];
      })
      .addCase(createBulkPayments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update payment
      .addCase(updatePayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePayment.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.payments.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.payments[index] = action.payload;
        }
        if (state.currentPayment?.id === action.payload.id) {
          state.currentPayment = action.payload;
        }
      })
      .addCase(updatePayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete payment
      .addCase(deletePayment.fulfilled, (state, action) => {
        state.payments = state.payments.filter(p => p.id !== action.payload);
        if (state.currentPayment?.id === action.payload) {
          state.currentPayment = null;
        }
      })
      .addCase(deletePayment.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setFilters, clearFilters, clearCurrentPayment } = paymentSlice.actions;
export default paymentSlice.reducer;