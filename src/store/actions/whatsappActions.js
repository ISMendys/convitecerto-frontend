import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/api";

const WHATSAPP_API_URL = "/whatsapp";

// Helper to extract error messages
const getErrorMessage = (error) => {
  return error.response?.data?.error || error.message || "Ocorreu um erro desconhecido";
};

// Fetch WhatsApp instance status
export const fetchWhatsappStatus = createAsyncThunk(
  "whatsapp/fetchStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${WHATSAPP_API_URL}/status`);
      return response.data; // { exists: boolean, connected: boolean, status: string }
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Fetch WhatsApp QR Code
export const fetchWhatsappQrCode = createAsyncThunk(
  "whatsapp/fetchQrCode",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${WHATSAPP_API_URL}/qrcode`);
      return response.data; // { qrcode: "base64..." }
    } catch (error) {
      // Handle 404 specifically
      if (error.response?.status === 404) {
        return rejectWithValue(
          error.response?.data?.error ||
            "QR Code não disponível (Instância conectada ou QR não gerado)."
        );
      }
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Send WhatsApp Invite Message
export const sendWhatsappInvite = createAsyncThunk(
  "whatsapp/sendInvite",
  async (data /* { guestId: string, message: string, inviteLink: string } */, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`${WHATSAPP_API_URL}/send-invite`, data);
      return { guestId: data.guestId, ...response.data }; // Include guestId for potential tracking
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Send WhatsApp Reminder Message
export const sendWhatsappReminder = createAsyncThunk(
  "whatsapp/sendReminder",
  async (data /* { guestId: string, message: string } */, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`${WHATSAPP_API_URL}/send-reminder`, data);
      return { guestId: data.guestId, ...response.data };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Send Bulk WhatsApp Message
export const sendWhatsappBulk = createAsyncThunk(
  "whatsapp/sendBulk",
  async (data /* { eventId: string, message: string, filter?: object } */, { rejectWithValue }) => {
    try {
      // Note: Current backend sends to all matching filter, not specific guestIds
      const response = await apiClient.post(`${WHATSAPP_API_URL}/send-bulk`, data);
      return response.data; // { totalSent: number, totalFailed: number, results: array }
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Disconnect WhatsApp Instance
export const disconnectWhatsapp = createAsyncThunk(
  "whatsapp/disconnect",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`${WHATSAPP_API_URL}/disconnect`);
      return response.data; // { success: true, message: string }
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

