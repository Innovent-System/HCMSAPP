
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
