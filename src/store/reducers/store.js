
import { configureStore } from '@reduxjs/toolkit'
import { getApi, appSlice } from '../actions/httpactions'


export const store = configureStore({
  reducer: {
    [appSlice.name]: appSlice.reducer,
    [getApi.reducerPath]: getApi.reducer,
  },
  middleware: (getDefaulMiddleWare) => getDefaulMiddleWare({ immutableCheck: false, serializableCheck: false }).concat(getApi.middleware)
})

// export const store = createStore(reducers, {}, applyMiddleware(...middleware));
