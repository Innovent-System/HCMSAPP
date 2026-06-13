import { createSlice } from "@reduxjs/toolkit";

export const formSlice = createSlice({
    name: 'forms',
    initialState: {} as Record<string, any>,
    reducers: {
        setFormData: (state, action) => {
            const { key, values } = action.payload;
            state[key] = { ...state[key], ...values };
        },
        resetFormData: (state, action) => {
            delete state[action.payload];
        }
    }
});

export const { setFormData, resetFormData } = formSlice.actions;