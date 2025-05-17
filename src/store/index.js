import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import eventReducer from './slices/eventSlice';
import inviteReducer from './slices/inviteSlice';
import guestReducer from './slices/guestSlice';
import dashboardReducer from './actions/dashboardActions';
import whatsappReducer from './slices/whatsappSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    invites: inviteReducer,
    guests: guestReducer,
    dashboard: dashboardReducer,
    whatsapp: whatsappReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store;
