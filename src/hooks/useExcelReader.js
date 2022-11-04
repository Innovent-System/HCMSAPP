import { useEffect, useState, useContext } from "react";
import { WorkerContext } from '../services/workerService';
import { parse } from 'date-fns'

const notValid = [null, undefined, "", "N/A", "-"];
function isValidDate(date) {
    const d = new Date(date);
    let [month, day, year] = date.split('/')
    // need to reduce month value by 1 to accommodate new Date formats the month
    --month;
    if (d.getFullYear() === year && d.getMonth() === month && d.getDate() === day) {
        return true;
    }
    return false;
}

/**
 * Assign the Excel Data for Modify.
 * @param {Object} data - The data who is responsible for the process.
 * @param {Array} data.colInfo - The colInfo of the data.
 * @param {Array} data.excelData - The excelData's from xlsx.
 * @param {Function} data.transformData - if you want to tranform data on each row.
 */
const processAndVerifyData = ({ colInfo, excelData, transformData }) => {
    const excelCol = colInfo.flatMap(c => c._children).filter(c => c?.label),
        modifyData = [], errors = [], errorPrefix = "#On Row --> ";
    let objectData = {};
    if (excelData[0].length !== excelCol.length) {
        errors.push("Template Format not correct");
        return [errors, modifyData];
    }
    for (let i = 0; i < excelData.length; i++) {
        if (i === 0) continue;
        const values = excelData[i];
        objectData = {};
        for (let j = 0; j < values.length; j++) {
            let value = values[j];
            const prop = excelCol[j];
            if (prop?.required && notValid.includes(value)) { errors.push(`${errorPrefix}${j + 1}${prop.label} is required`); continue };
            if (prop?.options) {
                value = value.toLowerCase();
                if (notValid.includes(value)) {
                    objectData[prop.name] = null;
                } else {
                    const isExist = prop?.options.find(c => c[prop.dataName].toLowerCase() === value);
                    if (isExist) {
                        objectData[prop.name] = prop.elementType === "dropdown" ? isExist[prop?.dataId] : { [prop?.dataId]: isExist[prop?.dataId] };
                    }
                    else
                        errors.push(`${errorPrefix}${j + 1} value not correct for ${prop.label}`);

                }

            } else if (prop.elementType === "datetimepicker") {

                if (notValid.includes(value))
                    objectData[prop.name] = null;
                else if (parse(value, "dd/MM/yyyy", new Date()).toString() !== "Invalid Date")
                    objectData[prop.name] = parse(value, "dd/MM/yyyy", new Date());
                else
                    errors.push(`${errorPrefix}${j + 1}${prop.label} is not valid`)
            }
            else {
                objectData[prop.name] = value;
            }
        }
        if (typeof transformData === "function")
            modifyData.push(transformData(objectData));
        else
            modifyData.push(objectData);
    }
    if (!modifyData.length)
        errors.push("No rows found");

    return [errors, modifyData];
}

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
            else if (action === "write") write(result);

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
        excelData,
        processAndVerifyData
    };
};