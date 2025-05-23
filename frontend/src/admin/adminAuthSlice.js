import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("adminToken");
const user = localStorage.getItem("adminUser");

const initialState = {
    user: user ? JSON.parse(user) : null,
    token: token || null,
    isAuthenticated: !!token,
};

const adminAuthSlice = createSlice({
    name:"adminAuth",
    initialState,
    reducers: {
        loginAdmin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
        logoutAdmin: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminUser");
        },
    },
});

export const { loginAdmin, logoutAdmin} = adminAuthSlice.actions;
export default adminAuthSlice.reducer;