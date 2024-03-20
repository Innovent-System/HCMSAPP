import { useEffect, useState, useContext, useRef } from "react";
import { WorkerContext } from '../services/workerService';
import { parse } from 'date-fns'
import { downloadTextFIle } from "../util/common";

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
const spread = " ..."
const commaSeprateValue = (options, dataName, max = 3) => {
    let values = "", index = 0;

    for (const opt of options) {
        if (max === index) break
        values += opt[dataName] + ","
        ++index
    }
    return values.substring(0, values.length - 1) + spread;
}
/**
 * Assign the Excel Data for Modify.
 * @param {Object} data - The data who is responsible for the process.
 * @param {Array<string>} data.colInfo - The colInfo of the data.
 * @param {Array} data.excelData - The excelData's from xlsx.
 * @param {Function} data.transformData - if you want to tranform data on each row.
 * @returns {Array<T>}
 */
const processAndVerifyData = ({ colInfo, excelData, transformData }) => {
    const modifyData = [], errors = [], errorPrefix = "#On Row --> ";
    let objectData = {}, errorMsg = "";

    if (excelData[0].length !== colInfo.length) {
        errors.push("Template Format not correct");
        return [errors, modifyData];
    }
    for (let i = 0; i < excelData.length; i++) {
        if (i === 0) continue;
        const values = excelData[i];
        objectData = {};
        for (let j = 0; j < values.length; j++) {
            let value = values[j];
            const prop = colInfo[j];
            errorMsg = "";
            if (prop?.required && notValid.includes(value)) { errorMsg = `${errorPrefix}${i + 1}${prop.label} is required`; continue };
            if (prop?.options) {
                value = value.toLowerCase();
                if (notValid.includes(value)) {
                    objectData[prop.name] = null;
                } else {
                    const isExist = prop?.options.find(c => c[prop.dataName].toLowerCase() === value);
                    if (isExist) {
                        objectData[prop.name] = prop.elementType === "dropdown" ? isExist[prop?.dataId] : { ...isExist };
                    }
                    else
                        errorMsg = `${errorPrefix}${i + 1} value not correct for ${prop.label},
                       value should be in ${commaSeprateValue(prop.options, prop.dataName)}`;

                }

            } else if (prop.elementType === "datetimepicker") {

                if (notValid.includes(value))
                    objectData[prop.name] = null;
                else if (parse(value, "dd/MM/yyyy", new Date()).toString() !== "Invalid Date")
                    objectData[prop.name] = parse(value, "dd/MM/yyyy", new Date());
                else
                    errorMsg = `${errorPrefix}${i + 1} ${prop.label} is not valid ,date should be in dd/MM/yyyy format`;
            }
            else {
                objectData[prop.name] = value;
            }

            if (errorMsg)
                errors.push(errorMsg);
        }
        if (errors.length) continue;
        if (typeof transformData === "function")
            modifyData.push(transformData(objectData));
        else
            modifyData.push(objectData);
    }
    if (!modifyData.length && !errors.length)
        errors.push("No rows found");

    return [errors, modifyData];
}
let colInfo = [];
/**
 * @param {import("../types/fromstype").FormType} formTemplate 
 * @param {string} fileName 
 * @param {Function} transformData 
 * @returns 
 */
export const useExcelReader = (formTemplate, transformData = null, fileName = "Template.xlsx") => {
    const { excelWorker } = useContext(WorkerContext);

    const [file, setFile] = useState();
    const [excelData, setExcelData] = useState();
    // const [colInfo] = useState(() => );
    // const [wbData, setWbData] = useState([]);
    const [status, setStatus] = useState({
        inProcess: false,
        isDone: false
    });
    colInfo = formTemplate.flatMap(c => c?._children ?? c).filter(c => c?.label);
   
    
    const getTemplate = () => {
        if (Array.isArray(formTemplate)) {
            const excelCol = formTemplate.flatMap(c => c?._children ?? c).filter(c => c?.label).map(c => c.label);
            const dummyData = formTemplate.flatMap(c => c?._children ?? c).filter(c => c?.excel).map(c => c.excel.sampleData);

            setStatus({ inProcess: true, isDone: false });
            excelWorker.postMessage({ action: "write", a_o_a: [excelCol, dummyData], fileName });
        }
    }

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

                const [error, resultData] = processAndVerifyData({
                    colInfo: colInfo,
                    excelData: result,
                    transformData
                })
                if (error.length)
                    downloadTextFIle(error.join(" "))
                else
                    setExcelData(resultData);
            }
            else if (action === "write") write(result);

            setStatus({ isDone: true, inProcess: false })
        };

    }, [excelWorker])

    // useEffect(() => {
    //     if (wbData.length) {
    //         setStatus({ inProcess: true, isDone: false });
    //         setWbData([]);
    //         excelWorker.postMessage({ action: "write", a_o_a: wbData, fileName })
    //     }
    // }, [wbData])

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
        getTemplate,
        excelData,
        // processAndVerifyData
    };
};