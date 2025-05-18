// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import { API } from './_Service';
import { builderFieldsAction, useEntityAction, enableFilterAction, useLazyPostQuery, showDropDownFilterAction } from '../../store/actions/httpactions';
import { Circle, Add as AddIcon, PeopleOutline, Edit as EditIcon, Cancel as CancelIcon, Save as SaveIcon } from "../../deps/ui/icons";
import { GridToolbarContainer, Chip } from "../../deps/ui";
import DataGrid, { getActions, useGridApi, GridRowModes, GridActionsCellItem, GridRowEditStopReasons } from '../../components/useDataGrid';
import ConfirmDialog from '../../components/ConfirmDialog';
import { endOfDay, formateISODateTime } from "../../services/dateTimeService";
import Controls from "../../components/controls/Controls";
import PageHeader from '../../components/PageHeader'
import { AttendanceflagMap, weekday } from "../../util/common";
import { useDropDownIds } from "../../components/useDropDown";
import { addDays, startOfDay, isEqual } from '../../services/dateTimeService'
import { useAppDispatch, useAppSelector } from "../../store/storehook";
import { useSocketIo } from "../../components/useSocketio";
import { AutoForm } from '../../components/useForm'
import Popup from "../../components/Popup";

/**
 * @type {import('@react-awesome-query-builder/mui').Fields}
 */
const fields = {
    firstName: {
        label: 'Employee Name',
        type: 'text',
        valueSources: ['value'],
        preferWidgets: ['text'],
    },
    scheduleStartDt: {
        label: 'From',
        fieldName: "scheduleStartDt",
        defaultOperator: "greater_or_equal",
        defaultValue: null,
        operators: ['greater_or_equal'],
        type: 'date',
        fieldSettings: {
            dateFormat: "D/M/YYYY",
            mongoFormatValue: val => new Date(val).toISOString(),
        },
        valueSources: ['value'],
        preferWidgets: ['date'],
    },
    scheduleEndDt: {
        label: 'To',
        fieldName: "scheduleEndDt",
        defaultOperator: "less_or_equal",
        defaultValue: null,
        type: 'date',
        operators: ['less_or_equal'],
        fieldSettings: {
            dateFormat: "D/M/YYYY",
            mongoFormatValue: val => new Date(val).toISOString()
        },
        valueSources: ['value'],
        preferWidgets: ['date'],
    },
}

const DateTimeCell = ({ apiRef, value, id, field, hasFocus, row, type = 'In' }) => {
    const [error, setError] = useState(null);

    const schDt = new Date(type === "In" ? row.scheduleStartDt : row.scheduleEndDt);

    const hanldechange = (e) => {
        let { value: currentValue } = e.target;

        const minDate = new Date(row.minTime), maxDate = new Date(row.maxTime);
        minDate.setDate(schDt.getDate());
        minDate.setMonth(schDt.getMonth());
        minDate.setFullYear(schDt.getFullYear());

        maxDate.setDate(schDt.getDate());
        maxDate.setMonth(schDt.getMonth());
        maxDate.setFullYear(schDt.getFullYear());

        if (currentValue.getTime() < minDate.getTime() || currentValue.getTime() > maxDate.getTime()) {
            currentValue = null;
            setError(`${type} time should be between company ${type.toLowerCase()} time`);
        }
        else if (error)
            setError(null)

        apiRef.current.setEditCellValue({ id, field, value: currentValue, debounceMs: 150 });

        // .then(c => apiRef.current.setRows([...Array.from(apiRef.current.getRowModels().values()), { ...row, [field]: value }]));


    }

    return <Controls.DatePicker error={error} name={id}
        shouldDisableDate={(date) => (type === 'In' ?
            !isEqual(startOfDay(date), startOfDay(schDt))
            :
            date < startOfDay(row?.startDateTime) || date >= addDays(startOfDay(row?.startDateTime), 2)
        )
        }
        key={id} onChange={hanldechange} category="datetime" value={value} />
}

/**
 * 
 * @param {Function} apiRef 
 * @param {Function} onEdit 
 * @param {Function} onActive  
 * @returns {import("@mui/x-data-grid-pro").GridColumns}
 */
const getColumns = (apiRef, onEdit, onSave, onCancel) => {

    // const actionKit = {
    //     onEdit, onSave
    // }
    return [
        { field: '_id', headerName: 'Id', hide: true, hideable: false },
        {
            field: 'fullName', headerName: 'Employee Name', width: 180, hideable: false
        },
        { field: 'scheduleStartDt', headerName: 'Schedule Start', width: 200, hideable: false, valueGetter: ({ value }) => formateISODateTime(value) },
        { field: 'scheduleEndDt', headerName: 'Schedule End', width: 200, hideable: false, valueGetter: ({ value }) => formateISODateTime(value) },
        {
            field: 'startDateTime', headerName: 'Actual In', width: 200, hideable: false,
            type: 'dateTime',
            editable: true,
            valueGetter: ({ value }) => value ? new Date(value) : null,
            renderEditCell: (params) => <DateTimeCell apiRef={apiRef}  {...params} />,
            // /**  @param {import("@mui/x-data-grid-pro").GridPreProcessEditCellProps} params   */
            // preProcessEditCellProps: ({ props }) => {

            //     const hasError = props.value.length < 3;
            //     return { ...props, error: hasError };
            // }
        },
        {
            field: 'endDateTime', headerName: 'Actual Out', width: 200, hideable: false, type: 'dateTime',
            editable: true,
            valueGetter: ({ value }) => value ? new Date(value) : null,
            renderEditCell: (params) => <DateTimeCell type="Out" apiRef={apiRef} {...params} />
        },
        {
            field: 'status', headerName: 'Status', width: 180, hideable: false, renderCell: ({ row }) => <Chip color={AttendanceflagMap[row.status].color} label={AttendanceflagMap[row.status].short} />
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {

                const isInEditMode = apiRef.current.getRowMode(id) === 'edit';

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            onClick={onSave(id)}
                            color="primary"
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={onCancel(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={onEdit(id)}
                        color="inherit"
                    />
                ];
            }
        }
    ]
}

export const CallAttendanceRepost = ({ openPopup, setOpenPopup }) => {
    const formApi = useRef(null);

    const [leaveTypes, setLeaveTypes] = useState([]);
    const { Employees } = useAppSelector(e => e.appdata.employeeData);
    const { addEntity } = useEntityAction();
    // const [attendanceRespost] = useLazySingleQuery();

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
            required: true,
            validate: {
                errorMessage: "Employee is required",
            },
            dataId: '_id',
            dataName: "fullName",
            options: Employees,
            isMultiple: true,
            defaultValue: []
        },

        {
            elementType: "daterangepicker",
            name: "attendanceDate",
            required: true,
            // disableFuture: true,
            breakpoints: { size: { md: 12, xs: 12 } },
            validate: {
                errorMessage: "Select Date please",
            },
            defaultValue: [new Date(), new Date()]
        }
    ];

    const handleSubmit = (e) => {
        const { getValue, validateFields } = formApi.current
        if (validateFields()) {
            let values = getValue();
            let dataToInsert = {};

            dataToInsert.employeeCodes = values.fkEmployeeId.map(e => e.punchCode);
            dataToInsert.deviceFromDate = startOfDay(values.attendanceDate[0]);
            dataToInsert.deviceToDate = endOfDay(values.attendanceDate[1]);

            addEntity({ url: API.AttendanceRepost, data: dataToInsert }).finally(() => setOpenPopup(false));

        }
    }
    return <>

        <Popup
            title="Attendance Repost"
            openPopup={openPopup}
            maxWidth="sm"
            addOrEditFunc={handleSubmit}
            setOpenPopup={setOpenPopup}>
            <AutoForm formData={formData} ref={formApi} isValidate={true} />
        </Popup>
    </>
}

const DEFAULT_API = API.Attendance;

const Amend = () => {
    const dispatch = useAppDispatch();
    const [openPopup, setOpenPopup] = useState(false);
    const isEdit = React.useRef(false);
    const row = React.useRef(null);
    const [selectionModel, setSelectionModel] = React.useState([]);
    const [editedRow, setEditedRow] = useState([]);

    const [rowModesModel, setRowModesModel] = React.useState({});

    const [gridFilter, setGridFilter] = useState({
        lastKey: null,
        limit: 10,
        page: 0,
        totalRecord: 0
    })


    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: "",
        subTitle: "",
    });

    const [records, setRecords] = useState([]);

    const gridApiRef = useGridApi();
    const query = useAppSelector(e => e.appdata.query.builder);

    const [getEmployeeAttendance] = useLazyPostQuery();
    const { updateOneEntity, removeEntity, addEntity } = useEntityAction();


    const handleActiveInActive = (id) => {
        updateOneEntity({ url: DEFAULT_API, data: { _id: id } });
    }

    const handelDeleteItems = (ids) => {
        let idTobeDelete = ids;
        if (Array.isArray(ids)) {
            idTobeDelete = ids.join(',');
        }


        setConfirmDialog({
            isOpen: true,
            title: "Are you sure to delete this records?",
            subTitle: "You can't undo this operation",
            onConfirm: () => {
                removeEntity({ url: DEFAULT_API, params: idTobeDelete }).then(res => {
                    setSelectionModel([]);
                })
            },
        });

    }
    const { countryIds, stateIds, cityIds, areaIds, departmentIds, groupIds, designationIds, employeeIds } = useDropDownIds();

    const handleAmendAttendance = () => {

        getEmployeeAttendance({
            url: DEFAULT_API, data: {
                ...(employeeIds && { "_id": { $in: employeeIds.split(',') } }),
                ...(countryIds && { "companyInfo.fkCountryId": { $in: countryIds.split(',') } }),
                ...(stateIds && { "companyInfo.fkStateId": { $in: stateIds.split(',') } }),
                ...(cityIds && { "companyInfo.fkCityId": { $in: cityIds.split(',') } }),
                ...(areaIds && { "companyInfo.fkAreaId": { $in: areaIds.split(',') } }),
                ...(groupIds && { "companyInfo.fkEmployeeGroupId": { $in: groupIds.split(',') } }),
                ...(departmentIds && { "companyInfo.fkDepartmentId": { $in: departmentIds.split(',') } }),
                ...(designationIds && { "companyInfo.fkDesignationId": { $in: designationIds.split(',') } }),
                ...query
            }
        }).then(({ data }) => {
            if (data) {
                setRecords(data);
                setGridFilter({
                    lastKey: null,
                    limit: 10,
                    page: 0,
                    totalRecord: 0
                })

            }
        })
    }
    const processRowUpdate = (newRow, prev) => {

        const updatedRow = { ...newRow, isNew: false };
        if (JSON.stringify(newRow) !== JSON.stringify(prev) && !editedRow.includes(newRow.id)) {
            setEditedRow([...editedRow, newRow.id])
        }
        // setRecords(records.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    }
    const handleSaveAttendance = () => {

        const attData = Array.from(gridApiRef.current.getRowModels().values());
        addEntity({
            url: API.AttendanceInsert,
            data: {
                attendances: attData.filter(c => editedRow.includes(c.id) && c.startDateTime),
                ids: selectionModel
            }
        }).finally(() => {
            handleAmendAttendance()
            setSelectionModel([]);
            setEditedRow([]);
            setRowModesModel(selectionModel.reduce((a, v) => ({ ...a, [v]: { mode: 'view' } }), {}));
        })
    }

    useEffect(() => {

        dispatch(showDropDownFilterAction({
            company: true,
            country: true,
            state: true,
            city: true,
            area: true,
            department: true,
            group: true,
            designation: true,
            employee: true
        }));
        dispatch(builderFieldsAction(fields));
    }, [dispatch])

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        // const editedRow = rows.find((row) => row.id === id);
        // if (editedRow.isNew) {
        //     setRows(rows.filter((row) => row.id !== id));
        // }
    };
    const columns = getColumns(gridApiRef, handleEditClick, handleSaveClick, handleCancelClick);

    const showRepostModal = () => {
        isEdit.current = false;
        setOpenPopup(true);
    }
    /** @param {Array} _selectModels  */
    const hanldeSelectionEdit = (_selectModels) => {

        // const id = _selectModels.at(-1);
        let selectedCells = { ...rowModesModel }
        const notSelected = selectionModel.filter(e => !_selectModels.includes(e));

        selectedCells = _selectModels.reduce((acc, curr) => {
            acc[curr] = { mode: "edit" };
            return acc;
        }, selectedCells)

        notSelected.forEach((acc) => {
            selectedCells[acc] = { mode: "view" };
        })

        setRowModesModel(selectedCells);
        setSelectionModel(_selectModels);
    }

    return (
        <>
            <PageHeader
                title="Amend Attendance"
                handleApply={handleAmendAttendance}
                enableFilter={true}
                subTitle="Manage Amend Attendance"
                icon={<PeopleOutline fontSize="large" />}
            />
            <CallAttendanceRepost openPopup={openPopup} setOpenPopup={setOpenPopup} />
            <DataGrid apiRef={gridApiRef}
                columns={columns} rows={records}
                loading={false}
                autoHeight={true}
                totalCount={records?.length}
                disableSelectionOnClick
                rowModesModel={rowModesModel}
                page={gridFilter.page}
                pageSize={gridFilter.limit}
                editMode='row'
                paginationMode='client'
                onRowEditStop={handleRowEditStop}
                experimentalFeatures={{ newEditingApi: true }}
                processRowUpdate={processRowUpdate}
                onRowEditCommit={console.log}
                onRowModesModelChange={setRowModesModel}
                setFilter={setGridFilter}
                // isCellEditable={console.log}
                toolbarProps={{
                    apiRef: gridApiRef,
                    onAdd: handleSaveAttendance,
                    showRepostModal,

                    records,
                    editedRow
                }}

                gridToolBar={AmendToolbar}
                selectionModel={selectionModel}
                setSelectionModel={hanldeSelectionEdit}
            />
            <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
        </>
    );
}

export function AmendToolbar(props) {
    const { onAdd, showRepostModal, editedRow } = props;

    return (
        <GridToolbarContainer sx={{ justifyContent: "flex-end" }}>

            {editedRow?.length ? <Controls.Button onClick={onAdd} startIcon={<AddIcon />} text="Save" /> : null}
            <Controls.Button onClick={showRepostModal} startIcon={<AddIcon />} text="Attendance Repost" />
        </GridToolbarContainer>
    );
}

export default Amend;