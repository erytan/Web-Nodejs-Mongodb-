import { createSlice } from "@reduxjs/toolkit";
import * as action from './asyncAction'

export const userSilce = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false,
        current: null,
        token: null,
        isLoading: false,
    },
    reducers: {
        register: (state, action) => {
            console.log(action)
            state.isLoggedIn = action.payload.isLoggedIn
            state.current = action.payload.userData
            state.token = action.payload.token
        },
        login: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
            state.token = action.payload.token;
        },
        logout: (state, action) => {
            state.isLoggedIn = false
            state.token = null;
        } 
    },
    extraReducers: (builder) => {
        builder.addCase(action.getCurrent.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(action.getCurrent.fulfilled, (state, action) => {
            state.isLoading = false;
            state.current = action.payload;

        });
        builder.addCase(action.getCurrent.rejected, (state, action) => {
            state.isLoading = false;
            state.current = null;
        });
    }
})
export const {register,login,logout} = userSilce.actions
export default userSilce.reducer 