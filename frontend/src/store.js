import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "./admin/adminAuthSlice";

export const store = configureStore({
    reducer: {
        adminAuth: adminAuthReducer,
    },
});