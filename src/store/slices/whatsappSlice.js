import { createSlice } from "@reduxjs/toolkit";
import {
  fetchWhatsappStatus,
  fetchWhatsappQrCode,
  sendWhatsappInvite,
  sendWhatsappReminder,
  sendWhatsappBulk,
  disconnectWhatsapp,
} from "../actions/whatsappActions";

const initialState = {
  status: null, // { exists: boolean, connected: boolean, status: string }
  qrCode: null, // base64 string
  loadingStatus: false,
  loadingQrCode: false,
  sendingMessage: false, // General sending state for invite/reminder
  sendingBulk: false,
  disconnecting: false,
  error: null,
  lastSentResult: null, // Store result of the last send operation (invite/reminder/bulk)
};

const whatsappSlice = createSlice({
  name: "whatsapp",
  initialState,
  reducers: {
    clearWhatsappError: (state) => {
      state.error = null;
    },
    clearLastSentResult: (state) => {
      state.lastSentResult = null;
    },
    // Potentially add reducers to manually update status if needed based on webhooks
  },
  extraReducers: (builder) => {
    builder
      // fetchWhatsappStatus
      .addCase(fetchWhatsappStatus.pending, (state) => {
        state.loadingStatus = true;
        state.error = null;
      })
      .addCase(fetchWhatsappStatus.fulfilled, (state, action) => {
        state.loadingStatus = false;
        state.status = action.payload;
      })
      .addCase(fetchWhatsappStatus.rejected, (state, action) => {
        state.loadingStatus = false;
        state.error = action.payload;
        state.status = null; // Clear status on error
      })

      // fetchWhatsappQrCode
      .addCase(fetchWhatsappQrCode.pending, (state) => {
        state.loadingQrCode = true;
        state.error = null;
        state.qrCode = null; // Clear previous QR code while fetching
      })
      .addCase(fetchWhatsappQrCode.fulfilled, (state, action) => {
        state.loadingQrCode = false;
        state.qrCode = action.payload.qrcode; // Store only the base64 string
      })
      .addCase(fetchWhatsappQrCode.rejected, (state, action) => {
        state.loadingQrCode = false;
        state.error = action.payload;
        state.qrCode = null; // Clear QR code on error
      })

      // sendWhatsappInvite
      .addCase(sendWhatsappInvite.pending, (state) => {
        state.sendingMessage = true;
        state.error = null;
        state.lastSentResult = null;
      })
      .addCase(sendWhatsappInvite.fulfilled, (state, action) => {
        state.sendingMessage = false;
        // Optionally store result or just handle success in component
        state.lastSentResult = { type: "invite", success: true, ...action.payload };
      })
      .addCase(sendWhatsappInvite.rejected, (state, action) => {
        state.sendingMessage = false;
        state.error = action.payload;
        state.lastSentResult = { type: "invite", success: false, error: action.payload };
      })

      // sendWhatsappReminder
      .addCase(sendWhatsappReminder.pending, (state) => {
        state.sendingMessage = true; // Use the same flag for simplicity
        state.error = null;
        state.lastSentResult = null;
      })
      .addCase(sendWhatsappReminder.fulfilled, (state, action) => {
        state.sendingMessage = false;
        state.lastSentResult = { type: "reminder", success: true, ...action.payload };
      })
      .addCase(sendWhatsappReminder.rejected, (state, action) => {
        state.sendingMessage = false;
        state.error = action.payload;
        state.lastSentResult = { type: "reminder", success: false, error: action.payload };
      })

      // sendWhatsappBulk
      .addCase(sendWhatsappBulk.pending, (state) => {
        state.sendingBulk = true;
        state.error = null;
        state.lastSentResult = null;
      })
      .addCase(sendWhatsappBulk.fulfilled, (state, action) => {
        state.sendingBulk = false;
        state.lastSentResult = { type: "bulk", success: true, ...action.payload };
      })
      .addCase(sendWhatsappBulk.rejected, (state, action) => {
        state.sendingBulk = false;
        state.error = action.payload;
        state.lastSentResult = { type: "bulk", success: false, error: action.payload };
      })

      // disconnectWhatsapp
      .addCase(disconnectWhatsapp.pending, (state) => {
        state.disconnecting = true;
        state.error = null;
      })
      .addCase(disconnectWhatsapp.fulfilled, (state, action) => {
        state.disconnecting = false;
        state.status = { ...state.status, connected: false, status: "disconnected" }; // Optimistically update status
        state.qrCode = null; // Clear QR code on disconnect
      })
      .addCase(disconnectWhatsapp.rejected, (state, action) => {
        state.disconnecting = false;
        state.error = action.payload;
      });
  },
});

export const { clearWhatsappError, clearLastSentResult } = whatsappSlice.actions;

export default whatsappSlice.reducer;

