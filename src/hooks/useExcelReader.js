import { useEffect, useRef, useState, useContext } from "react";
import { WorkerContext } from '../services/workerService';

export const useExcelReader = (fileName = "Template.xlsx") => {
    const { excelWorker } = useContext(WorkerContext);

    const [file, setFile] = useState();
    const [excelData, setExcelData] = useState();
    const [wbData, setWbData] = useState([]);
    const [status, setStatus] = useState({
        inProcess: false,
        isDone: false
    });

    const write = (result) => {
        const blob = new Blob([result], { type: "application/octet-stream" }),
            url = URL.createObjectURL(blob),
            a = document.createElement("a");
        a.download = fileName;
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    useEffect(() => {
        excelWorker.onmessage = ({ data }) => {
            const { action, result } = data;
            if (action === "read") {
                setFile(null);
                setExcelData(result);
            }
            else if (action === "write") {
                write(result);
            }
            setStatus({ isDone: true, inProcess: false })
        };

    }, [excelWorker])

    useEffect(() => {
        if (wbData.length) {
            setStatus({ inProcess: true, isDone: false });
            setWbData([]);
            excelWorker.postMessage({ action: "write", a_o_a: wbData, fileName })
        }
    }, [wbData])

    useEffect(() => {
        if (file) {
            setStatus({ inProcess: true, isDone: false });
            setExcelData(null);
            excelWorker.postMessage({ action: "read", file })
        }
    }, [file])

    return {
        inProcess: status.inProcess,
        isDone: status.isDone,
        file,
        setFile,
        setWbData,
        excelData
    };
};