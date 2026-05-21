// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useState } from "react";
import Popup from '../../../components/Popup';
import { AutoForm } from '../../../components/useForm';
import { API } from '../_Service';
import { builderFieldsAction, useEntityAction, useEntitiesQuery, enableFilterAction } from '../../../store/actions/httpactions';
import { Circle } from "../../../deps/ui/icons";
import DataGrid, { useGridApi, getActions, GridToolbar } from '../../../components/useDataGrid';
import { useSocketIo } from '../../../components/useSocketio';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { useAppDispatch, useAppSelector } from "../../../store/storehook";
import { formateISODateTime } from "../../../services/dateTimeService";

const SalaryAppraisal = ({ openPopup, setOpenPopup, colData = [] }) => {
    const formApi = useRef(null);
    const [loader, setLoader] = useState(false);

    const { Employees } = useAppSelector(e => e.appdata.employeeData);
    const { addEntity } = useEntityAction();

    useEffect(() => {
        if (formApi.current && openPopup) {
            const { resetForm } = formApi.current;
            resetForm();
        }
    }, [openPopup, formApi])
    const formData = [
        {
            elementType: "ad_dropdown",
            name: "fkEmployeeId",
            label: "Employee",
            variant: "outlined",
            required: true,
            validate: {
                errorMessage: "Select Employee",
            },
            dataName: 'fullName',
            dataId: "_id",
            options: Employees,
            defaultValue: null,
            excel: {
                sampleData: "Faizan Siddiqui"
            }
        },
        {
            elementType: "datetimepicker",
            label: "Date",
            name: "salaryChangeDate",
            required: true,
            // disablePast: true,
            validate: {
                errorMessage: "Select Date please",
            },
            defaultValue: new Date(),
            excel: {
                sampleData: new Date().toLocaleDateString('en-CA')
            }
        },
        {
            elementType: "inputfield",
            name: "title",
            required: true,
            label: "Title",
            validate: {
                errorMessage: "Title required",
            },
            defaultValue: "",
            excel: {
                sampleData: "Advance"
            }
        },
        {
            elementType: "dropdown",
            name: "type",
            label: "Type",

            dataId: "id",
            dataName: "title",
            isNone: false,
            defaultValue: "Increment",
            options: salaryChangeType,
            excel: {
                sampleData: "Increment"
            }
        },
        {
            elementType: "inputfield",
            name: "amount",
            required: true,
            type: "number",
            label: "Amount",
            validate: {
                errorMessage: "Amount required",
            },
            defaultValue: 0,
            excel: {
                sampleData: 10000
            }
        },
        {
            elementType: "inputfield",
            name: "description",
            required: true,
            label: "Description",
            multiline: true,
            validate: {
                errorMessage: "Description required",
            },
            minRows: 5,
            variant: "outlined",
            breakpoints: { size: { md: 12, sm: 12, xs: 12 } },
            defaultValue: "",
            excel: {
                sampleData: "Personl reson"
            }
        }
    ];
    colData.current = formData;

    const handleSubmit = (e) => {
        const { getValue, validateFields } = formApi.current
        if (validateFields()) {
            let values = getValue();
            let dataToInsert = { ...values };
            dataToInsert.salaryChangeDate = systemFormatDate(values.salaryChangeDate);
            dataToInsert.fkEmployeeId = values.fkEmployeeId._id;

            addEntity({ url: DEFAULT_API, data: [dataToInsert] });

        }
    }
    return <>
        <Loader open={loader} />
        <Popup
            title={`${DEFAULT_NAME} Request`}
            openPopup={openPopup}
            maxWidth="sm"
            isEdit={false}
            keepMounted={true}
            addOrEditFunc={handleSubmit}
            setOpenPopup={setOpenPopup}>
            <AutoForm formData={formData} ref={formApi} isValidate={true} />
        </Popup>
    </>
}