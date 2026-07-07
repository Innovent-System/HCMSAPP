
import { configureStore } from '@reduxjs/toolkit'
import { getApi, appSlice, empSlice } from './actions/httpactions'
import { moduleSettingSlice } from './slicer/modulesettings'
import { reportSlice } from './slicer/report';
import { formSlice } from './slicer/form';
import { attendanceSlice } from './slicer/attendance';
import { listenerMiddleware } from './listenerMiddleware';


export const store = configureStore({
  reducer: {
    [appSlice.name]: appSlice.reducer,
    [getApi.reducerPath]: getApi.reducer,
    [empSlice.name]: empSlice.reducer,
    [moduleSettingSlice.name]: moduleSettingSlice.reducer,
    [reportSlice.name]: reportSlice.reducer,
    [formSlice.name]: formSlice.reducer,
    [attendanceSlice.name]: attendanceSlice.reducer
  },
  middleware: (getDefaulMiddleWare) => getDefaulMiddleWare({ immutableCheck: false, serializableCheck: false })
  .prepend(listenerMiddleware.middleware) 
  .concat(getApi.middleware)
})

// export const store = createStore(reducers, {}, applyMiddleware(...middleware));
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch