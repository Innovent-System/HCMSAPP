// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useState } from "react";
import { API } from '../_Service';
import { usePostQuery } from '../../../store/actions/httpactions';
import DataGrid, { useGridApi } from '../../../components/useDataGrid';
import { useSocketIo } from '../../../components/useSocketio';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { useDropDownIds } from '../../../components/useDropDown'
import CommonDropDown from "../../../components/CommonDropDown";
import { Link } from "../../../deps/ui";
import Tabs from '../../../components/Tabs'


const columns = [
    { field: 'id', headerName: 'Id', hide: true, hideable: false },
    {
        field: 'fullName', headerName: 'Employee', width: 180, hideable: false, renderCell: ({ row }) => (
            <Link underline="hover">{row.fullName}</Link>
        )
    },
    { field: 'area', headerName: 'Area', hideable: false },
    { field: 'department', headerName: 'Department', hideable: false },
    { field: 'designation', headerName: 'Desgination', hideable: false },
    { field: 'group', headerName: 'Group', hideable: false },
]

const DEFAULT_API = API.ScheduleDetail;
let editId = 0;
const AssingSchedule = ({ scheduleId, tab, handleTabs, selectedEmployees, setSelectedEmployees }) => {

    const isEdit = React.useRef(false);

    const [sort, setSort] = useState({ sort: { createdAt: -1 } });

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

    const { countryIds, stateIds, cityIds, areaIds, departmentIds, groupIds, designationIds, companyIds } = useDropDownIds();


    const { data, isLoading, refetch, totalRecord } = usePostQuery({
        url: DEFAULT_API,
        data: {
            limit: filter.limit,
            page: filter.page + 1,
            ...sort,
            scheduleId,
            isAssigneSchedule: tab === '0',
            searchParams: {
                ...(countryIds && { "countryId": { value: countryIds.split(','), operator: "In" } }),
                ...(stateIds && { "stateId": { value: stateIds.split(','), operator: "In" } }),
                ...(cityIds && { "cityId": { value: cityIds.split(','), operator: "In" } }),
                ...(areaIds && { "areaId": { value: areaIds.split(','), operator: "In" } }),
                ...(groupIds && { "employeeGroupId": { value: groupIds.split(','), operator: "In" } }),
                ...(departmentIds && { "departmentId": { value: departmentIds.split(','), operator: "In" } }),
                ...(designationIds && { "designationId": { value: designationIds.split(','), operator: "In" } })

            }
        }
    }, { selectFromResult: ({ data, isLoading }) => ({ data: data?.entityData, totalRecord: data?.totalRecord, isLoading }) });

    useEffect(() => {
        if (tab)
            refetch();
    }, [tab])

    const handleSort = (s) => {
        if (s?.length) {
            const { field, sort } = s[0];
            if (field === "fullName") {
                setSort({ sort: { firstName: sort === 'asc' ? 1 : -1, lastName: sort === 'asc' ? 1 : -1 } })
            }
            else
                setSort({ sort: s.reduce((a, v) => ({ ...a, [v.field]: v.sort === 'asc' ? 1 : -1 }), {}) })

        }
    }
    const tabs = [
        {
            title: "Assigned",
            panel: <DataGrid apiRef={gridApiRef}
                columns={columns} rows={data}
                disableSelectionOnClick
                loading={isLoading} pageSize={filter.limit}
                setFilter={setFilter}
                onSortModelChange={handleSort}
                page={filter.page}
                totalCount={totalRecord}
                selectionModel={selectedEmployees}
                setSelectionModel={setSelectedEmployees}
            />,

        },
        {
            title: "UnAssigned",
            panel: <DataGrid apiRef={gridApiRef}
                columns={columns} rows={data}
                disableSelectionOnClick
                loading={isLoading} pageSize={filter.limit}
                setFilter={setFilter}
                onSortModelChange={handleSort}
                page={filter.page}
                totalCount={totalRecord}
                selectionModel={selectedEmployees}
                setSelectionModel={setSelectedEmployees}
            />,

        }
    ]


    const { socketData } = useSocketIo("changeInSchedule", refetch);

    return (
        <>
            <CommonDropDown showFilters={{
                company: true,
                country: true,
                state: true,
                city: true,
                department: true,
                area: true
            }}

            />


            <Tabs orientation='horizontal' value={tab} setValue={handleTabs} TabsConfig={tabs} />



            <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
        </>
    );
}
export default AssingSchedule;