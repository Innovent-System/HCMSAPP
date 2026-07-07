// listenerMiddleware.js
import { createListenerMiddleware, isRejected, isPending, isFulfilled } from '@reduxjs/toolkit';
import { setGlobalLoader } from '../store/actions/httpactions';
import { enqueueSnackbar } from 'notistack';
import { appsocket } from '@/services/socketService';
import { CloseSnackBar } from '@/router/StatusHandler';

export const listenerMiddleware = createListenerMiddleware();


listenerMiddleware.startListening({
    predicate: (action) =>
        isPending(action) || isFulfilled(action) || isRejected(action),

    effect: async (action, { dispatch, getState }) => {

        // ─── Pending ────────────────────────────────────────
        if (isPending(action)) {
            dispatch(setGlobalLoader(true));
        }

        // ─── Fulfilled ──────────────────────────────────────
        else if (isFulfilled(action)) {
            dispatch(setGlobalLoader(false));
            const message = action.payload?.message;
            if (message) {
                enqueueSnackbar(message, { variant: 'success',action: CloseSnackBar });
            }
        }

        // ─── Rejected ───────────────────────────────────────
        else if (isRejected(action)) {
            dispatch(setGlobalLoader(false));

            const { status, data } = action.payload || {};
            const { message, result, errors } = data || {};

            // Array errors — popup
            if (Array.isArray(result) && result.length) {
                //dispatch(setErrors(result));      // ✅ Redux mein store
                //dispatch(setOpenPopup(true));
            }
            else if (message) {
                enqueueSnackbar(message, { variant: 'error', action: CloseSnackBar });
            }

            // 401 — logout
            if (status === 401) {
                appsocket.stop();
                sessionStorage.clear();
                window.location.href = '/';
            }
        }
    }
});