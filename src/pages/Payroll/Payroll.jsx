// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useRef, useState } from "react";
import Popup from '../../components/Popup';
import { API } from './_Service';
import { builderFieldsAction, useEntityAction, useEntitiesQuery, showDropDownFilterAction, useLazySingleQuery } from '../../store/actions/httpactions';
import { PeopleOutline, AccountBalanceWallet, Delete } from "../../deps/ui/icons";
import { GridToolbarContainer } from "../../deps/ui";
import DataGrid, { getActions, GridToolbar, GridToolbarQuickFilter, useGridApi } from '../../components/useDataGrid';
import { useSocketIo } from '../../components/useSocketio';
import ConfirmDialog from '../../components/ConfirmDialog';
import { AutoForm } from '../../components/useForm'
import PageHeader from '../../components/PageHeader'
import { formateISODateTime } from "../../services/dateTimeService";
import Loader from '../../components/Circularloading'
import { useDropDownIds } from "../../components/useDropDown";
import { useAppDispatch, useAppSelector } from "../../store/storehook";
import Controls from "../../components/controls/Controls";
import RunPayroll from "./components/RunPayroll";
import { formatNumber } from "../../util/common";

/**
 * @type {import('@react-awesome-query-builder/mui').Fields}
 */
const fields = {

    status: {
        label: "Status",
        type: "select",
        valueSources: ["value"],
        fieldName: "status", //must taken to for query binding
        defaultOperator: "select_equals", //must taken to for query binding
        defaultValue: undefined, //must taken to for query binding
        fieldSettings: {
            listValues: [
                { value: "", title: "" },
                { value: "Pending", title: "Pending" },
                { value: "Approved", title: "Approved" },
                { value: "Rejected", title: "Rejected" }
            ]
        }
    },
    createdAt: {
        label: 'Created Date',
        type: 'date',
        fieldName: "createdAt",
        defaultOperator: "equal",
        defaultValue: null,
        fieldSettings: {
            dateFormat: "D/M/YYYY",
            // mongoFormatValue: val => ({ $date: new Date(val).toISOString() }),
        },
        valueSources: ['value'],
        preferWidgets: ['date'],
    }
}

const getColumns = (onDelete) => [
    { field: '_id', headerName: 'Id', hide: true, hideable: false },
    {
        field: 'fullName', headerName: 'Name', width: 220, hideable: false, valueGetter: ({ row }) => row.employees?.fullName
    },
    {
        field: 'payrollsetup', headerName: 'Setup', hideable: false, valueGetter: ({ row }) => row.payrollsetup?.name
    },
    { field: 'salaryType', headerName: 'Type', hideable: false },
    { field: 'month', headerName: 'Month', hideable: false },
    { field: 'year', headerName: 'Year', hideable: false },
    { field: 'monthlySalary', headerName: 'Monthly Salary', hideable: false, valueGetter: ({ row }) => formatNumber(row.monthlySalary) },
    { field: 'totalSalary', headerName: 'Net Salary', hideable: false, valueGetter: ({ row }) => formatNumber(row.totalSalary) },
    { field: 'modifiedOn', headerName: 'Modified On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.modifiedOn) },
    { field: 'createdOn', headerName: 'Created On', flex: 1, valueGetter: ({ row }) => formateISODateTime(row.createdOn) },
    getActions(null, { onDelete })
];

const DEFAULT_API = API.PayrollDetail;
const Payroll = () => {
    const dispatch = useAppDispatch();
    const [openPopup, setOpenPopup] = useState(false);

    const [selectionModel, setSelectionModel] = React.useState([]);

    const [gridFilter, setGridFilter] = useState({
        lastKey: null,
        limit: 10,
        page: 0,
        totalRecord: 0
    })

    const [sort, setSort] = useState({ sort: { createdAt: -1 } });

    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: "",
        subTitle: "",
    });


    const gridApiRef = useGridApi();
    const query = useAppSelector(e => e.appdata.query.builder);
    const { countryIds, stateIds, cityIds, areaIds, departmentIds, groupIds, designationIds, employeeIds } = useDropDownIds();

    const { data, isLoading, refetch, totalRecord } = useEntitiesQuery({
        url: `${DEFAULT_API}/get`,
        data: {
            limit: gridFilter.limit,
            page: gridFilter.page + 1,
            lastKeyId: gridFilter.lastKey,
            ...sort,
            searchParams: {
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
        }
    }, { selectFromResult: ({ data, isLoading }) => ({ data: data?.entityData, totalRecord: data?.totalRecord, isLoading }) });

    const { removeEntity, updateOneEntity, addEntity } = useEntityAction();

    const handleCancel = (id) => {
        setConfirmDialog({
            isOpen: true,
            title: "Are you sure to cancel this request?",
            subTitle: "You can't undo this operation",
            onConfirm: () => {
                updateOneEntity({ url: `${DEFAULT_API}/cancel/${id}`, data: {} });
            },
        });

    }


    const { socketData } = useSocketIo("changeInPayroll", refetch);


    const handelDeleteItems = (ids = []) => {
        let idTobeDelete = ids;
        if (!Array.isArray(ids)) {
            idTobeDelete = [ids];
        }
        const deletPayroll = data.filter(e => idTobeDelete.includes(e.id));

        const distinctMap = {
            payrollIds: [],
            employeeIds: new Set(),
            years: new Set(),
            months: new Set()
        };

        for (const del of deletPayroll) {
            distinctMap.payrollIds.push(del.id);
            distinctMap.employeeIds.add(del.fkEmployeeId);
            distinctMap.years.add(del.year);
            distinctMap.months.add(del.monthInNumber);
        }

        distinctMap.employeeIds = Array.from(distinctMap.employeeIds);
        distinctMap.years = Array.from(distinctMap.years);
        distinctMap.months = Array.from(distinctMap.months);

        setConfirmDialog({
            isOpen: true,
            title: "Are you sure to delete this records?",
            subTitle: "You can't undo this operation",
            onConfirm: () => {
                addEntity({
                    url: `${DEFAULT_API}/delete`, data: distinctMap
                }).then(res => {
                    setSelectionModel([]);
                })

            },
        });
    }

    const columns = getColumns(handelDeleteItems);

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


    const showAddModal = () => {
        setOpenPopup(true);
    }

    return (
        <>
            <PageHeader
                title="Payroll"
                enableFilter={true}

                subTitle="Manage Payroll"
                icon={<PeopleOutline fontSize="large" />}
            />

            <Popup
                title="Process Payroll"
                openPopup={openPopup} maxWidth="xl"
                fullScreen={true}
                footer={<></>}
                setOpenPopup={setOpenPopup}>
                <RunPayroll setOpenPopup={setOpenPopup} />
            </Popup>

            <DataGrid apiRef={gridApiRef}
                columns={columns} rows={data}
                page={gridFilter.page}
                disableSelectionOnClick={true}
                loading={isLoading} pageSize={gridFilter.limit}
                setFilter={setGridFilter}
                onSortModelChange={(s) => setSort({ sort: s.reduce((a, v) => ({ ...a, [v.field]: v.sort === 'asc' ? 1 : -1 }), {}) })}
                totalCount={totalRecord}
                toolbarProps={{
                    apiRef: gridApiRef,
                    onAdd: showAddModal,
                    onMultipleDelete: handelDeleteItems,
                    selectionModel
                }}
                gridToolBar={PayrollToolbar}
                selectionModel={selectionModel}
                setSelectionModel={setSelectionModel}

            />
            <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
        </>
    );
}

function PayrollToolbar(props) {
    const { onAdd, selectionModel, onMultipleDelete } = props;

    return (
        <GridToolbarContainer sx={{ justifyContent: "space-between" }}>
            <GridToolbarQuickFilter />
            <div>
                {selectionModel?.length ? <Controls.Button onClick={() => onMultipleDelete(selectionModel)} startIcon={<Delete />} text="Delete Payroll" /> : null}
                <Controls.Button onClick={onAdd} startIcon={<AccountBalanceWallet />} text="Genearate" />
            </div>
        </GridToolbarContainer>
    );
}

export default Payroll;