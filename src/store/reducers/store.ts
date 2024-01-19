
import { configureStore } from '@reduxjs/toolkit'
import { getApi, appSlice, empSlice } from '../actions/httpactions'


export const store = configureStore({
  reducer: {
    [appSlice.name]: appSlice.reducer,
    [getApi.reducerPath]: getApi.reducer,
    [empSlice.name]: empSlice.reducer
  },
  middleware: (getDefaulMiddleWare) => getDefaulMiddleWare({ immutableCheck: false, serializableCheck: false }).concat(getApi.middleware)
})

// export const store = createStore(reducers, {}, applyMiddleware(...middleware));
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch