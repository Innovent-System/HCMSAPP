import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export default ({
    baseUrl,
    name,
}) => {
    const fetchById = createAsyncThunk(
        `${name}/fetchByIdStatus`,
        id => fetch(`${baseUrl}/${id}`).then(r => r.json()),
    );

    const fetchAll = createAsyncThunk(
        `${name}/fetchAllStatus`,
        () => axios.get(baseUrl),
    );

    const updateById = createAsyncThunk(
        `${name}/updateByIdStatus`,
        async ({ id, data }) => {
            await fetch(`${baseUrl}/${id}`, {
                method: "UPDATE",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }).then(r => r.json());
            return data;
        },
    );

    const deleteById = createAsyncThunk(
        `${name}/deleteByIdStatus`,
        id => fetch(`${baseUrl}/${id}`, {
            method: 'DELETE',
        }).then(r => r.json()).then(() => id),
    );

    const createNew = createAsyncThunk(
        `${name}/createNewStatus`,
        data => fetch(`${baseUrl}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }),
    );

    const slice = createSlice({
        name,
        initialState: { entities: {}, loading: 'idle' },
        reducers: {},
        extraReducers: {
            [fetchById.fulfilled]: (state, action) => {
                state.entities[action.payload.id] = action.payload;
            },
            [fetchById.rejected]: (state, action) => {
                state.entities[action.payload.id] = action.payload;
            },
            [updateById.fulfilled]: (state, action) => {
                state.entities[action.payload.id] = action.payload;
            },
            [deleteById.fulfilled]: (state, action) => {
                delete state.entities[action.payload.id];
                return state;
            },
            [createNew.fulfilled]: (state, action) => {
                state.entities[action.payload.id] = action.payload;
            },
            [fetchAll.fulfilled]: (state, action) => {
                state.entities = {
                    ...state.entities,
                    ...action.payload,
                };
            },
        },
    });

    return {
        reducer: slice.reducer,
        fetchById,
        fetchAll,
        updateById,
        deleteById,
        createNew,
    };
};