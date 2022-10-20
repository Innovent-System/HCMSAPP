import { createContext } from 'react';

export const excelWorker = new Worker(new URL(`../worker/excel.worker.js`, import.meta.url));

export const WorkerContext = createContext();