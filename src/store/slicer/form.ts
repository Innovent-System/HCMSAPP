import { createSlice } from "@reduxjs/toolkit";

export const formSlice = createSlice({
    name: 'forms',
    initialState: {} as Record<string, any>,
    reducers: {
        setFormValues: (state, action) => {
            const { key, values } = action.payload;
            state[key] = { ...state[key], ...values };
        },
        resetFormValues: (state, action) => {
            delete state[action.payload];
        }
    }
});