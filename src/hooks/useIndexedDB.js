import { useState, useEffect, useCallback } from "react";
import { openDB } from "idb";

const DB_NAME = "novaDB";
const DB_VERSION = 1;
const STORE_NAME = "reports";
const CONFIG_KEY = "report_config";
// Initialize IndexedDB (Only Runs Once)
let dbPromise;

const initDB = async () => {
    if (!dbPromise) {
        dbPromise = openDB(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: "id" }); // Use existing "id"
                }
            },
        });
    }
    return dbPromise;
};

export const useIndexedDB = (tableOption) => {
    const [dataDB, setDBData] = useState([]);

    // 🔹 Save Employee Data (Bulk Insert)
    const saveDB = useCallback(async (data) => {

        const db = await initDB();
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        await store.put({ id: CONFIG_KEY, ...data });
        await tx.done;

        fetchDB(); // Refresh state
    }, []);

    // 🔹 Get All Employees
    const fetchDB = useCallback(async () => {
        const db = await initDB();
        const items = await db.get(STORE_NAME, CONFIG_KEY);
        tableOption
        const restore = {
            ...items,
            ...tableOption
        }
        setDBData(restore);
    }, []);

    // 🔹 Delete Employee Record
    const deleteDB = useCallback(async (id) => {
        const db = await initDB();
        await db.delete(STORE_NAME, id);
        fetchDB(); // Refresh state
    }, []);


    const clearAll = useCallback(async () => {
        const db = await initDB();
        await db.clear(STORE_NAME);
        setDBData([]);
    }, []);

    useEffect(() => {
        fetchDB();
    }, [fetchDB]);

    return { dataDB, saveDB, deleteDB, clearAll };
};

