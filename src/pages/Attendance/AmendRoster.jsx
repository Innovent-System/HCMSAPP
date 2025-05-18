
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { API } from './_Service';
import { useEntitiesQuery, useEntityAction, enableFilterAction, builderFieldsAction, useLazySingleQuery, useLazyPostQuery, showDropDownFilterAction } from '../../store/actions/httpactions';
import { Circle, PeopleOutline, Add as AddIcon, FileCopy } from "../../deps/ui/icons";
import { ButtonGroup, GridToolbarContainer, Tooltip, IconButton, Divider, Grid, Button, Input, Alert } from '../../deps/ui'
import DataGrid, { useGridApi, getActions } from '../../components/useDataGrid';
import { useSocketIo } from '../../components/useSocketio';
import Controls from "../../components/controls/Controls";
import ConfirmDialog from '../../components/ConfirmDialog';
import { useAppDispatch, useAppSelector } from "../../store/storehook";
import PageHeader from '../../components/PageHeader'
import Popup from "../../components/Popup";
import { dateRange, formateDate, getWeekStartEnd, formateISODateTime, formateISODate } from "../../services/dateTimeService";
import { useExcelReader } from "../../hooks/useExcelReader";
import { AutoForm } from '../../components/useForm'
import { useDropDownIds } from "../../components/useDropDown";

const fields = {
    name: {
        label: 'Country',
        type: 'text',
        valueSources: ['value'],
        preferWidgets: ['text'],
    },
    createdAt: {
        label: 'Created Date',
        type: 'date',
        fieldSettings: {
            dateFormat: "D/M/YYYY",
            mongoFormatValue: val => ({ $date: new Date(val).toISOString() }),
        },
        valueSources: ['value'],
        preferWidgets: ['date'],
    },

    isActive: {
        label: 'Status',
        type: 'boolean',
        operators: ['equal'],
        valueSources: ['value'],
    },
}
/**
 * 
 * @param {Function} apiRef 
 * @param {Function} onEdit 
 * @param {Function} onActive  
 * @returns {import("@mui/x-data-grid-pro").GridColumns}
 */
const getColumns = (apiRef, onEdit, onActive) => {
    const actionKit = {
        onActive: onActive,
        onEdit: onEdit
    }
    return [
        { field: '_id', headerName: 'Id', hide: true },
        {
            field: 'fullName', headerName: 'Employee Name', flex: 1, valueGetter: ({ row }) => row.employees.fullName
        },
        { field: 'rosterDate', headerName: 'Roster Date', flex: 1, valueGetter: ({ row }) => formateISODate(row.rosterDate) },
        {
            field: 'shift', headerName: 'Shift', width: 180, valueGetter: ({ row }) => row.shift.shiftName
        },
        {
            field: 'isActive', headerName: 'Active', renderCell: (param) => (
                param.row["isActive"] ? <Circle color="success" /> : <Circle color="disabled" />
            ),
            flex: '0 1 5%',
            align: 'center',
        },
        { field: 'modifiedOn', headerName: 'Modified On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.modifiedOn) },
        { field: 'createdOn', headerName: 'Created On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.createdOn) }
    ]
}
let editId = 0;
const DEFAULT_API = API.AmendRoster;
const { weekStart, weekEnd } = getWeekStartEnd();
export const AddRoster = ({ getTemplate, setFile, roster, setRoster, openPopup, setOpenPopup, isEdit = false, row = null, shifts }) => {
    const formApi = useRef(null);
    const { addEntity } = useEntityAction();
    const { Employees } = useAppSelector(e => e.appdata.employeeData);
    const handleSubmit = (e) => {
        const { getValue, validateFields } = formApi.current
        const { fkEmployeeId, rosterDates, fkShiftId } = getValue();
        const roasterData = [];
        for (let index = 0; index < fkEmployeeId.length; index++) {

            for (let r = 0; r < rosterDates.length; r++) {
                const _date = rosterDates[r];
                roasterData.push({
                    fkEmployeeId: fkEmployeeId[index]._id,
                    rosterDate: new Date(_date),
                    fkShiftId: fkShiftId
                })
            }

        }
        // console.log(roasterData);
        addEntity({ url: `${DEFAULT_API}/insert`, data: { roster: roasterData } });

    }

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
            elementType: "dropdown",
            name: `fkShiftId`,
            label: "Shift",
            // variant: "outlined",
            required: true,
            validate: {
                errorMessage: "Shift is required",
            },
            dataName: 'shiftName',
            dataId: "_id",
            options: shifts,
            excel: {
                sampleData: shifts.length ? shifts[0].shiftName : ""
            }
        },
        {
            elementType: "multidatepicker",
            name: "rosterDates",
            required: true,
            validate: {
                errorMessage: "Select Date please",
            },
            defaultValue: []
        },



    ]

    return <Popup
        title="Roster"
        openPopup={openPopup}
        maxWidth="sm"
        // footer={<></>}
        isEdit={isEdit}
        addOrEditFunc={handleSubmit}
        setOpenPopup={setOpenPopup}>
        <AutoForm formData={formData} ref={formApi} isValidate={true} />

    </Popup>
}
const transform = (_roster) => {
    const data = [];
    Object.keys(_roster).forEach(r => {
        if (r !== "fkEmployeeId") {
            const variable = r.split("_");
            data.push({
                fkEmployeeId: _roster["fkEmployeeId"].id,
                rosterDate: new Date(variable[3], variable[2], variable[1]),
                fkShiftId: _roster[r]
            })
        }
    })
    return data;
}
const AmendRoster = () => {
    const dispatch = useAppDispatch();
    const [openPopup, setOpenPopup] = useState(false);

    const isEdit = React.useRef(false);
    const row = useRef(null);
    const [selectionModel, setSelectionModel] = React.useState([]);
    const [getShiftList] = useLazyPostQuery();
    const [shifts, setShift] = useState([]);

    const [sort, setSort] = useState({ sort: { createdAt: -1 } });
    const { Employees } = useAppSelector(e => e.appdata.employeeData);
    const [roster, setRoster] = useState([weekStart, weekEnd])
    const [filter, setFilter] = useState({
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

    const gridApiRef = useGridApi();
    const query = useAppSelector(e => e.appdata.query.builder);
    const rosterExcel = useMemo(() => {
        const form = [{
            elementType: "ad_dropdown",
            name: "fkEmployeeId",
            label: "Employee",
            // variant: "outlined",
            required: true,
            validate: {
                errorMessage: "Select Employee",
            },
            dataName: 'fullName',
            dataId: "_id",
            options: Employees,
            excel: {
                sampleData: "Faizan Siddiqui"
            }
        }]
        const rosterDates = dateRange(roster[0], roster[1]);

        for (let index = 0; index < rosterDates.length; index++) {
            const date = rosterDates[index];
            form.push({
                elementType: "dropdown",
                name: `date_${date.getDate()}_${date.getMonth()}_${date.getFullYear()}`,
                label: formateDate(date),
                // variant: "outlined",
                required: true,
                validate: {
                    errorMessage: "Shift is required",
                },
                dataName: 'shiftName',
                dataId: "_id",
                options: shifts,
                excel: {
                    sampleData: shifts.length ? shifts[0].shiftName : ""
                }
            })

        }

        return form;
    }, [roster, shifts])
    const { countryIds, stateIds, cityIds, areaIds, departmentIds, groupIds, designationIds, employeeIds } = useDropDownIds();

    const { getTemplate, excelData, setFile } = useExcelReader({ formTemplate: rosterExcel, transform, fileName: "AmendRoster.xlsx" });
    const { data, isLoading, refetch, totalRecord } = useEntitiesQuery({
        url: `${DEFAULT_API}/get`,
        data: {
            limit: filter.limit,
            page: filter.page + 1,
            lastKeyId: filter.lastKey,
            ...sort,
            searchParams: {
                ...(employeeIds && { "fkEmployeeId": { $in: employeeIds.split(',') } }),
                // ...(countryIds && { "companyInfo.fkCountryId": { $in: countryIds.split(',') } }),
                // ...(stateIds && { "companyInfo.fkStateId": { $in: stateIds.split(',') } }),
                // ...(cityIds && { "companyInfo.fkCityId": { $in: cityIds.split(',') } }),
                // ...(areaIds && { "companyInfo.fkAreaId": { $in: areaIds.split(',') } }),
                // ...(groupIds && { "companyInfo.fkEmployeeGroupId": { $in: groupIds.split(',') } }),
                // ...(departmentIds && { "companyInfo.fkDepartmentId": { $in: departmentIds.split(',') } }),
                // ...(designationIds && { "companyInfo.fkDesignationId": { $in: designationIds.split(',') } }),
                ...query

            }
        }
    }, { selectFromResult: ({ data, isLoading }) => ({ data: data?.entityData, totalRecord: data?.totalRecord, isLoading }) });

    const { updateOneEntity, removeEntity, addEntity } = useEntityAction();

    const { socketData } = useSocketIo("changeInRoster", refetch);
    useEffect(() => {
        if (excelData) {
            // console.log(excelData);
            const distinctMap = new Map();

            for (const obj of excelData) {
                const key = `${obj.fkEmployeeId}-${obj.rosterDate}`;
                distinctMap.set(key, obj);
            }

            const distinctData = Array.from(distinctMap.values());

            addEntity({ url: `${DEFAULT_API}/insert`, data: { roster: distinctData } });
        }
    }, [excelData])
    const handleEdit = (id) => {
        isEdit.current = true;
        editId = id;
        row.current = data.find(a => a.id === id);
        setOpenPopup(true);
    }

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
        getShiftList({
            url: `${API.Shift}/get`, data: {
                page: 1,
                limit: 30,
                searchParams: {}
            }
        }).then(c => {
            if (c.data)
                setShift(c.data?.entityData)

        })
    }, [dispatch])

    const columns = getColumns(gridApiRef, handleEdit, handleActiveInActive);


    const showAddModal = () => {
        isEdit.current = false;
        setOpenPopup(true);
    }

    return (
        <>
            <PageHeader
                title="Amend Roster"
                enableFilter={true}
                subTitle="Manage Amend Roster"
                icon={<PeopleOutline fontSize="large" />}
            />
            <AddRoster shifts={shifts} openPopup={openPopup} setFile={setFile} roster={roster} setRoster={setRoster} getTemplate={getTemplate} setOpenPopup={setOpenPopup} row={row.current} isEdit={isEdit.current} />

            <DataGrid apiRef={gridApiRef}
                columns={columns} rows={data}
                loading={isLoading}
                totalCount={totalRecord}
                pageSize={filter.limit}
                page={filter.page}
                setFilter={setFilter}
                onSortModelChange={(s) => setSort({ sort: s.reduce((a, v) => ({ ...a, [v.field]: v.sort === 'asc' ? 1 : -1 }), {}) })}
                toolbarProps={{
                    apiRef: gridApiRef,
                    onAdd: showAddModal,
                    selectionModel
                }}
                gridToolBar={RosterToolbar}
                selectionModel={selectionModel}
                setSelectionModel={setSelectionModel}
            />
            <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
        </>
    );
}

function RosterToolbar(props) {
    const { apiRef, onAdd, onDelete, selectionModel } = props;

    return (
        <GridToolbarContainer sx={{ justifyContent: "flex-end" }}>
            {/* {selectionModel?.length ? <Controls.Button onClick={() => onDelete(selectionModel)} startIcon={<DeleteIcon />} text="Delete Items" /> : null} */}
            <Controls.Button onClick={onAdd} startIcon={<AddIcon />} text="Upload Roster" />
        </GridToolbarContainer>
    );
}
export default AmendRoster;