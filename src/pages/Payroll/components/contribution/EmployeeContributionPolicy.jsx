import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import Popup from '@/components/Popup';
import Controls from '@/components/controls/Controls';
import { AutoForm } from '@/components/useForm';
import ConfirmDialog from '@/components/ConfirmDialog';
import DataGrid, { useGridApi, getActions } from '@/components/useDataGrid';
import { useEntitiesQuery as useRealQuery, useEntityAction as useRealAction } from '@/store/actions/httpactions';
import { Box, Chip, IconButton, Typography } from '@/deps/ui';
import Switch from '@mui/material/Switch';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/EditOutlined';
import VerifiedUserOutlined from '@mui/icons-material/VerifiedUserOutlined';
import { API, calcTypeObj, CalculationType, PercentageOfBasicSalary } from '../../_Service';
import { useAppSelector } from '@/store/storehook';

// true: dummy data (backend ke bagair frontend test); false: asli API
// false karne se pehle _Service mein ye 3 constants add karo
const USE_MOCK = false;
const POLICY_API = USE_MOCK ? 'mock/policy' : API.EmployeeContributionPolicy;          // EmployeeContributionController (policy + details)
const TYPE_API = USE_MOCK ? 'mock/type' : API.EmployeeContributionType;
const HEAD_API = USE_MOCK ? 'mock/head' : API.PayrollHead;

// EPayrollHeadType.Earning (Earning=1, Deduction=2 ...)
const HEAD_TYPE_EARNING = 1;

// ECalculationType ki asli values se match karo
const CALC_PCT = 1;
const CALC_OPTIONS = [
    { id: CALC_PCT, name: 'Percentage' },
    { id: 2, name: 'Fixed amount' },
];

const PRORATA_OPTIONS = [
    { id: "None", name: 'None' },
    { id: "EmployedDays", name: 'Employed days (joiner/leaver)' },
    { id: "PaidDays", name: 'Paid days (attendance)' },
];

const EMPTY = [];
const numOrNull = (v) => (v === '' || v == null ? null : Number(v));

// ───────────── MOCK DATA LAYER (sirf test ke liye; USE_MOCK = false karte hi bypass) ─────────────
// Backend ki shape: policy list mein details nested aati hain (type ka naam + headIds ke saath)
const mockDb = {
    'mock/type': [
        { id: 1, name: 'EPF', isActive: true }, { id: 2, name: 'SOCSO', isActive: true }, { id: 3, name: 'EIS', isActive: true },
        { id: 4, name: 'PF', isActive: true }, { id: 5, name: 'EOBI', isActive: true },
        { id: 6, name: 'CPF', isActive: false }, { id: 7, name: 'MPF', isActive: true },
    ],
    // headType: 1 = earning, 2 = deduction (deduction chips mein nazar nahi aana chahiye)
    'mock/head': [
        { id: 1, name: 'House Allowance', headType: 1 },
        { id: 2, name: 'Utility', headType: 1 },
        { id: 3, name: 'Medical', headType: 1 },
        { id: 4, name: 'Conveyance', headType: 1 },
        { id: 5, name: 'Fuel', headType: 1 },
        { id: 6, name: 'Loan Recovery', headType: 2 },
    ],
    'mock/policy': [
        {
            id: 1, name: 'Malaysia Standard', isActive: true,
            details: [
                { id: 1, employeeContributionTypeId: 1, employeeContributionTypeName: 'EPF', calculationType: 1, employeeShare: 11, employerShare: 13, minCapAmount: null, maxCapAmount: null, isProRata: false, headIds: [1] },
                { id: 2, employeeContributionTypeId: 2, employeeContributionTypeName: 'SOCSO', calculationType: 1, employeeShare: 0.5, employerShare: 1.75, minCapAmount: null, maxCapAmount: 6000, isProRata: false, headIds: [] },
                { id: 3, employeeContributionTypeId: 3, employeeContributionTypeName: 'EIS', calculationType: 1, employeeShare: 0.2, employerShare: 0.2, minCapAmount: null, maxCapAmount: 6000, isProRata: true, headIds: [] },
            ],
        },
        {
            id: 2, name: 'Pakistan Standard', isActive: true,
            details: [
                { id: 4, employeeContributionTypeId: 4, employeeContributionTypeName: 'PF', calculationType: 1, employeeShare: 8.33, employerShare: 8.33, minCapAmount: null, maxCapAmount: null, isProRata: false, headIds: [] },
                { id: 5, employeeContributionTypeId: 5, employeeContributionTypeName: 'EOBI', calculationType: 2, employeeShare: 400, employerShare: 1000, minCapAmount: null, maxCapAmount: null, isProRata: false, headIds: [] },
            ],
        },
        { id: 3, name: 'Singapore (Draft)', isActive: false, details: [] },
    ],
};
let mockSeq = 100;
let mockVersion = 0;
const mockListeners = new Set();
const mockBump = () => { mockVersion += 1; mockListeners.forEach((l) => l()); };
const mockSubscribe = (l) => { mockListeners.add(l); return () => mockListeners.delete(l); };
const mockSnapshot = () => mockVersion;

function useMockQuery({ url, data }, opts = {}) {
    const version = useSyncExternalStore(mockSubscribe, mockSnapshot, mockSnapshot);
    const searchKey = JSON.stringify(data?.searchParams ?? {});
    const entityData = useMemo(() => {
        if (opts.skip) return undefined;
        const params = JSON.parse(searchKey);
        return (mockDb[url.replace(/\/get$/, '')] ?? []).filter((row) =>
            Object.entries(params).every(([k, c]) => row[k] === c.value));
    }, [version, url, searchKey, opts.skip]);
    const result = {
        data: entityData ? { entityData, totalRecord: entityData.length } : undefined,
        isFetching: false,
        refetch: () => { },
    };
    return opts.selectFromResult ? opts.selectFromResult(result) : result;
}

// Backend jaisa: policy save = details poori replace (headMappings -> headIds, type ka naam)
function useMockAction() {
    const addEntity = ({ url, data }) => {
        const list = mockDb[url];
        const details = (data.details ?? []).map((d) => ({
            id: ++mockSeq,
            employeeContributionTypeId: d.employeeContributionTypeId,
            employeeContributionTypeName: mockDb['mock/type'].find((t) => t.id === d.employeeContributionTypeId)?.name,
            calculationType: d.calculationType,
            employeeShare: d.employeeShare,
            employerShare: d.employerShare,
            minCapAmount: d.minCapAmount,
            maxCapAmount: d.maxCapAmount,
            isProRata: d.isProRata,
            headIds: (d.headMappings ?? []).map((m) => m.payrollHeadId),
        }));
        const row = { id: data.id ?? ++mockSeq, name: data.name, isActive: data.isActive, details };
        const idx = list.findIndex((r) => r.id === row.id);
        if (idx >= 0) list[idx] = row;
        else list.push(row);
        mockBump();
        return Promise.resolve({ data: row });
    };
    return { addEntity };
}

const useEntitiesQuery = USE_MOCK ? useMockQuery : useRealQuery;
const useEntityAction = USE_MOCK ? useMockAction : useRealAction;

// ───────────── Popup state hook (API nahi, sirf form + submit callback) ─────────────
// onSubmit(values, editRow) -> true/false (success par popup band hota hai)
// validateValues(values) -> error string ya null (AutoForm ki required check ke baad ki business rules)
function useFormPopup({ rowToForm, addDefaults = () => ({}), validateValues, onOpen, onSubmit }) {
    const formApi = useRef(null);
    const isEdit = useRef(false);
    const editRow = useRef(null);
    const submitting = useRef(false);
    const [openPopup, setOpenPopup] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!openPopup || !formApi.current) return;
        const { resetForm, setFormValue } = formApi.current;
        resetForm();
        setFormValue(isEdit.current ? rowToForm(editRow.current) : addDefaults());
        setError(null);
        onOpen?.(isEdit.current ? editRow.current : null);
    }, [openPopup]);

    const showAdd = () => {
        isEdit.current = false;
        editRow.current = null;
        setOpenPopup(true);
    };

    const showEdit = (row) => {
        isEdit.current = true;
        editRow.current = row;
        setOpenPopup(true);
    };

    const handleSubmit = async () => {
        if (submitting.current) return;
        const { getValue, validateFields } = formApi.current;
        if (!validateFields()) return;
        const msg = validateValues?.(getValue());
        if (msg) {
            setError(msg);
            return;
        }
        submitting.current = true;
        try {
            const ok = await onSubmit(getValue(), editRow.current);
            if (ok) setOpenPopup(false);
        } catch (err) {
            console.error('Save failed', err);
        } finally {
            submitting.current = false;
        }
    };

    return { formApi, isEdit, editRow, openPopup, setOpenPopup, error, showAdd, showEdit, handleSubmit };
}

// ───────────── Shared UI pieces (EmployeeDocuments wale hi, agar shared file mein nikaal lo to import kar lena) ─────────────
const FormPopup = ({ popup, popupTitle, formData, children }) => (
    <Popup
        title={`${popup.isEdit.current ? 'Edit' : 'Add'} ${popupTitle}`}
        openPopup={popup.openPopup}
        maxWidth="sm"
        isEdit={popup.isEdit.current}
        keepMounted={true}
        addOrEditFunc={popup.handleSubmit}
        setOpenPopup={popup.setOpenPopup}>
        {popup.error && <Alert severity="error" sx={{ mb: 2 }}>{popup.error}</Alert>}
        <AutoForm formData={formData} ref={popup.formApi} isValidate={true} />
        {children}
    </Popup>
);

const EmptyState = ({ icon, title, hint }) => (
    <Box sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 1, py: 5, textAlign: 'center', color: 'text.secondary' }}>
        <Box sx={{ mb: 1 }}>{icon}</Box>
        <Typography variant="body2" fontWeight={600}>{title}</Typography>
        <Typography variant="caption">{hint}</Typography>
    </Box>
);

// Scheme popup ke andar: Basic hamesha included, baqi earning heads chips se select
const HeadChips = ({ heads, value, onToggle }) => (
    <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
            Insurable wage = Basic + selected heads
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
            <Chip size="small" label="Basic (always included)" />
            {heads.map((h) => {
                const on = value.includes(h.id);
                return (
                    <Chip
                        key={h.id}
                        size="small"
                        label={h.name}
                        color={on ? 'primary' : 'default'}
                        variant={on ? 'filled' : 'outlined'}
                        onClick={() => onToggle(h.id)}
                    />
                );
            })}
        </Box>
    </Box>
);

// Backend ko details ki shape: headIds -> headMappings
const toPayloadDetail = (d) => ({
    employeeContributionTypeId: d.employeeContributionTypeId,
    calculationType: d.calculationType,
    employeeShare: Number(d.employeeShare),
    employerShare: Number(d.employerShare),
    minCapAmount: numOrNull(d.minCapAmount),
    maxCapAmount: numOrNull(d.maxCapAmount),
    proRataType: d.proRataType ?? 0,
    headMappings: (d.headIds ?? []).map((id) => ({ payrollHeadId: id })),
});

// Schemes policy ke andar nested hain (client-side, kam rows), isliye DataGrid ka search/filter/bulk-delete
// toolbar nahi; sirf Add button
const SchemeToolbar = ({ onAdd }) => (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <Controls.Button onClick={onAdd} startIcon={<AddIcon />} text="Add Scheme" />
    </Box>
);

const fmtNum = (n) => (n == null || n === '' ? '—' : Number(n).toLocaleString());
const round2 = (n) => Math.round(n * 100) / 100;

const Panel = ({ title, subtitle, action, children }) => (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, bgcolor: 'background.paper', overflow: 'hidden' }}>
        <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2,
            px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50',
        }}>
            <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle2" fontWeight={700} noWrap>{title}</Typography>
                {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
            </Box>
            {action}
        </Box>
        {children}
    </Box>
);

// Poori row click se select hoti hai; switch/edit par click select nahi karta
const PolicyItem = ({ policy, selected, onSelect, onEdit, onToggle }) => {
    const active = policy.isActive ?? true;
    const count = policy.schemeCount ?? policy.details?.length ?? 0;
    const stop = (e) => e.stopPropagation();
    return (
        <Box
            onClick={onSelect}
            sx={{
                display: 'flex', alignItems: 'center', gap: 1, pl: 2, pr: 1, py: 1.25, cursor: 'pointer',
                bgcolor: selected ? 'action.selected' : 'transparent',
                boxShadow: selected ? (t) => `inset 3px 0 0 ${t.palette.primary.main}` : 'none',
                '&:hover': { bgcolor: selected ? 'action.selected' : 'action.hover' },
            }}>
            <Box sx={{ flex: 1, minWidth: 0, opacity: active ? 1 : 0.6 }}>
                <Typography variant="body2" fontWeight={700} noWrap>{policy.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                    {count} {count === 1 ? 'scheme' : 'schemes'}{!active && ' · Inactive'}
                </Typography>
            </Box>
            <Switch
                size="small"
                checked={active}
                onClick={stop}
                onChange={onToggle}
                inputProps={{ 'aria-label': active ? 'Active' : 'Inactive' }}
            />
            <IconButton size="small" aria-label="Edit" onClick={(e) => { stop(e); onEdit(); }}>
                <EditIcon fontSize="small" />
            </IconButton>
        </Box>
    );
};

// ───────────── Screen: Policy list (upar) + selected policy ke schemes (neeche) ─────────────
// Backend policy + details ek hi request mein save karta hai (details poori replace hoti hain),
// isliye scheme add/edit/delete = details ka naya array bana kar poori policy save.
export default function EmployeeContributionPolicy() {
    const [policyId, setPolicyId] = useState(null);
    const [headIds, setHeadIds] = useState([]);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });
    const { addEntity } = useEntityAction();
    const gridApiRef = useGridApi();
    const [selectionModel, setSelectionModel] = useState([]);
    const [gridFilter, setGridFilter] = useState({ lastKey: null, limit: 10, page: 0, totalRecord: 0 });

    const { data: policies, isFetching, refetch } = useEntitiesQuery(
        { url: `${POLICY_API}/get`, data: { limit: 100, page: 1, searchParams: {} } },
        { selectFromResult: ({ data, isFetching }) => ({ data: data?.entityData ?? EMPTY, isFetching }) }
    );

    const { data: types } = useEntitiesQuery(
        { url: `${TYPE_API}/get`, data: { limit: 100, page: 1 } },
        { selectFromResult: ({ data }) => ({ data: data?.entityData ?? EMPTY }) }
    );

    // sirf earning heads (basic PayrollHead nahi hai, wo hamesha included hai)
    const { allowanceHeads: heads } = useAppSelector(c => c.appdata.payrollData)
    // const { data: heads } = useEntitiesQuery(
    //     {
    //         url: `${HEAD_API}/get`,
    //         data: { limit: 100, page: 1, searchParams: { headType: { operator: 'Equal', value: HEAD_TYPE_EARNING } } },
    //     },
    //     { selectFromResult: ({ data }) => ({ data: data?.entityData ?? EMPTY }) }
    // );

    // pehli policy khud select; selected policy list se gayab ho to bhi pehli par aa jao
    useEffect(() => {
        if (!policies.length) {
            if (policyId) setPolicyId(null);
            return;
        }
        if (!policies.some((p) => p.id === policyId)) setPolicyId(policies[0].id);
    }, [policies]);

    const selectedPolicy = policies.find((p) => p.id === policyId);
    const details = selectedPolicy?.details ?? EMPTY;

    // Policy + details save. details ke bagair bheji to backend saari schemes hata dega,
    // isliye policy edit/toggle par bhi maujooda details saath jati hain
    const savePolicy = (policy, nextDetails) =>
        addEntity({
            url: POLICY_API,
            data: [{
                ...(policy.id ? { id: policy.id } : {}),
                name: policy.name,
                isActive: policy.isActive,
                details: nextDetails.map(toPayloadDetail),
            }]
        }).then((r) => {
            if (r?.data) refetch();
            return Boolean(r?.data);
        });

    const toggleActive = (p) => savePolicy({ ...p, isActive: !p.isActive }, p.details ?? EMPTY);

    // ── Policy popup (name + active) ──
    const policyPopup = useFormPopup({
        addDefaults: () => ({ isActive: true }),
        rowToForm: (row) => ({ name: row.name, isActive: row.isActive ?? true }),
        onSubmit: (v, row) =>
            savePolicy({ id: row?.id, name: v.name.trim(), isActive: Boolean(v.isActive) }, row?.details ?? EMPTY),
    });

    // ── Scheme popup ──
    const editingId = (row) => row?.id;
    const schemePopup = useFormPopup({
        addDefaults: () => ({ fkCalculationType: PercentageOfBasicSalary, proRataType: "None" }),
        onOpen: (row) => setHeadIds(row?.headIds ?? []),
        rowToForm: (row) => ({
            fkTypeId: types.find((t) => t.id === row.employeeContributionTypeId) ?? null,
            fkCalculationType: row.calculationType,
            employeeShare: String(row.employeeShare ?? ''),
            employerShare: String(row.employerShare ?? ''),
            minCapAmount: row.minCapAmount == null ? '' : String(row.minCapAmount),
            maxCapAmount: row.maxCapAmount == null ? '' : String(row.maxCapAmount),
            proRataType: row.proRataType ?? "None",
        }),
        validateValues: (v) => {
            const usedByOthers = details.some(
                (d) => d.employeeContributionTypeId === v.fkTypeId?.id && d.id !== editingId(schemePopup.editRow.current)
            );
            if (usedByOthers) return 'This scheme type is already added in this policy';
            const e = Number(v.employeeShare);
            const r = Number(v.employerShare);
            if (e < 0 || r < 0) return 'Shares cannot be negative';
            if (v.fkCalculationType === PercentageOfBasicSalary && (e > 100 || r > 100)) return 'Percentage cannot exceed 100';
            const mn = numOrNull(v.minCapAmount);
            const mx = numOrNull(v.maxCapAmount);
            if (mn != null && mx != null && mn > mx) return 'Max insurable wage must be greater than or equal to min';
            return null;
        },
        onSubmit: (v, row) => {
            const next = {
                employeeContributionTypeId: v.fkTypeId.id,
                calculationType: v.fkCalculationType,
                employeeShare: v.employeeShare,
                employerShare: v.employerShare,
                minCapAmount: v.minCapAmount,
                maxCapAmount: v.maxCapAmount,
                proRataType: v.proRataType,
                headIds,
            };
            const list = row
                ? details.map((d) => (d.id === row.id ? { ...d, ...next } : d))
                : [...details, next];
            return savePolicy(selectedPolicy, list);
        },
    });

    const askDeleteScheme = (row) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Are you sure to delete this scheme?',
            subTitle: "You can't undo this operation",
            onConfirm: () => {
                savePolicy(selectedPolicy, details.filter((d) => d.id !== row.id));
            },
        });
    };

    const toggleHead = (id) =>
        setHeadIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

    const typeName = (r) => r.employeeContributionTypeName ?? types.find((t) => t.id === r.employeeContributionTypeId)?.name ?? '';
    const headNames = (r) => (r.headIds ?? []).map((id) => heads.find((h) => h.id === id)?.name).filter(Boolean);
    const share = (r, v) => (r.calculationType === PercentageOfBasicSalary ? `${round2(Number(v))}%` : fmtNum(v));
    const totalShare = (r) => round2(Number(r.employeeShare) + Number(r.employerShare));
    const limits = (r) => {
        const mn = r.minCapAmount;
        const mx = r.maxCapAmount;
        if (mn != null && mx != null) return `${fmtNum(mn)} – ${fmtNum(mx)}`;
        if (mx != null) return `Up to ${fmtNum(mx)}`;
        if (mn != null) return `From ${fmtNum(mn)}`;
        return 'No limit';
    };

    // Type dropdown: policy mein pehle se maujood types disabled (label par "already added"),
    // inactive types sirf tab jab wahi scheme edit ho rahi ho
    const currentRow = schemePopup.editRow.current;
    const usedTypeIds = new Set(
        details.filter((d) => d.id !== editingId(currentRow)).map((d) => d.employeeContributionTypeId)
    );
    const typeOptions = types
        .filter((t) => t.isActive !== false || t.id === currentRow?.employeeContributionTypeId)
        .map((t) => ({
            ...t,
            disabled: usedTypeIds.has(t.id),
            name: usedTypeIds.has(t.id) ? `${t.name} (already added)` : t.name,
        }));

    const detailColumns = [
        { field: 'id', headerName: 'Id', hide: true, hideable: false },
        {
            field: 'scheme', headerName: 'Scheme', width: 100, hideable: false,
            valueGetter: ({ row }) => typeName(row),
            renderCell: ({ row }) => (
                <>
                    <strong>{typeName(row)}</strong>
                    {row.proRataType !== "None" && (
                        <Chip size="small" variant="outlined" sx={{ ml: 1, height: 20 }} label={row.proRataType} />
                    )}
                </>
            ),
        },
        { field: 'calculationType', headerName: 'Basis', flex: 1, valueGetter: ({ row }) => calcTypeObj[row.calculationType] },
        {
            field: 'employeeShare', headerName: 'Employee', width: 70, align: 'right', headerAlign: 'right',
            valueGetter: ({ row }) => share(row, row.employeeShare),
        },
        {
            field: 'employerShare', headerName: 'Employer', width: 70, align: 'right', headerAlign: 'right',
            valueGetter: ({ row }) => share(row, row.employerShare),
        },
        {
            field: 'total', headerName: 'Total', width: 70, align: 'right', headerAlign: 'right',
            valueGetter: ({ row }) => share(row, totalShare(row)),
            renderCell: ({ row }) => <strong>{share(row, totalShare(row))}</strong>,
        },
        { field: 'limits', headerName: 'Wage limits', width: 100, valueGetter: ({ row }) => limits(row) },
        {
            field: 'wageBase', headerName: 'Wage base', flex: 1, minWidth: 170, sortable: false,
            valueGetter: ({ row }) => ['Basic', ...headNames(row)].join(' + '),
            renderCell: ({ row }) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    <Chip size="small" label="Basic" />
                    {headNames(row).map((n) => <Chip key={n} size="small" variant="outlined" label={n} />)}
                </Box>
            ),
        },
        getActions(gridApiRef, {
            onEdit: (id) => schemePopup.showEdit(details.find((d) => d.id === id)),
            onDelete: (id) => askDeleteScheme(details.find((d) => d.id === id)),
        }, false, null, false),
    ];

    const policyFormData = [
        {
            elementType: 'inputfield',
            name: 'name',
            label: 'Policy Name',
            required: true,
            validate: { errorMessage: 'Policy name is required' },
            defaultValue: '',
        },
        { elementType: 'checkbox', name: 'isActive', label: 'Active', defaultValue: true },
    ];

    // getOptionDisabled: AutoForm ke ad_dropdown se forward na ho to bhi duplicate validateValues se rukta hai
    // inputfield par type: 'number' support na ho to AutoForm ke hisab se adjust kar lena
    const schemeFormData = [
        {
            elementType: 'ad_dropdown',
            name: 'fkTypeId',
            label: 'Scheme Type',
            required: true,
            validate: { errorMessage: 'Scheme type is required' },
            dataName: 'name',
            dataId: 'id',
            options: typeOptions,
            getOptionDisabled: (o) => Boolean(o?.disabled),
            defaultValue: null,
        },
        {
            elementType: "dropdown",
            name: "fkCalculationType",
            label: "Calculation",
            required: true,
            validate: { errorMessage: 'Calculation type is required' },
            dataId: "id",
            dataName: "title",
            isNone: false,
            defaultValue: PercentageOfBasicSalary,
            options: CalculationType,
        },
        {
            elementType: 'inputfield',
            name: 'employeeShare',
            label: 'Employee Share',
            type: 'number',
            required: true,
            validate: { errorMessage: 'Employee share is required' },
            defaultValue: '',
        },
        {
            elementType: 'inputfield',
            name: 'employerShare',
            label: 'Employer Share',
            type: 'number',
            required: true,
            validate: { errorMessage: 'Employer share is required' },
            defaultValue: '',
        },
        { elementType: 'inputfield', name: 'minCapAmount', label: 'Min Insurable Wage', type: 'number', defaultValue: '' },
        { elementType: 'inputfield', name: 'maxCapAmount', label: 'Max Insurable Wage', type: 'number', defaultValue: '' },
        {
            elementType: "dropdown",
            name: "proRataType",
            label: "Pro-rata",
            required: true,
            validate: { errorMessage: 'Pro-rata type is required' },
            dataId: "id",
            dataName: "name",
            isNone: false,
            options: PRORATA_OPTIONS,
            defaultValue: "None"
        },
    ];

    return (
        <>
            {isFetching && !policies.length && <LinearProgress sx={{ mb: 2 }} />}
            <Box sx={{
                pt: 1,
                display: 'grid', gap: 1, alignItems: 'start',
                gridTemplateColumns: { xs: '1fr', md: '320px minmax(0, 1fr)' },
            }}>
                <Panel
                    title="Policies"
                    subtitle={`${policies.length} ${policies.length === 1 ? 'policy' : 'policies'}`}
                    action={<Controls.Button onClick={policyPopup.showAdd} startIcon={<AddIcon />} text="Add Policy" />}>
                    {policies.length ? (
                        <Box sx={{ '& > * + *': { borderTop: 1, borderColor: 'divider' } }}>
                            {policies.map((p) => (
                                <PolicyItem
                                    key={p.id}
                                    policy={p}
                                    selected={p.id === policyId}
                                    onSelect={() => setPolicyId(p.id)}
                                    onEdit={() => policyPopup.showEdit(p)}
                                    onToggle={() => toggleActive(p)}
                                />
                            ))}
                        </Box>
                    ) : (
                        <Box sx={{ p: 2 }}>
                            <EmptyState
                                icon={<VerifiedUserOutlined />}
                                title="No policies yet"
                                hint="Create a policy first, then add its schemes (EPF, SOCSO, PF ...)"
                            />
                        </Box>
                    )}
                </Panel>

                <Panel
                    title={selectedPolicy ? selectedPolicy.name : 'Schemes'}
                    subtitle={selectedPolicy
                        ? `${details.length} ${details.length === 1 ? 'scheme' : 'schemes'} · ${(selectedPolicy.isActive ?? true) ? 'Active' : 'Inactive'}`
                        : undefined}>
                    {!selectedPolicy ? (
                        <Box sx={{ p: 2 }}>
                            <EmptyState
                                icon={<VerifiedUserOutlined />}
                                title="No policy selected"
                                hint="Create a policy to start adding schemes"
                            />
                        </Box>
                    ) : (
                        // DataGrid ko explicit height chahiye (apni grid ke hisab se adjust kar lena)

                        <DataGrid
                            apiRef={gridApiRef}
                            columns={detailColumns}
                            rows={details}
                            loading={isFetching}
                            pageSize={gridFilter.limit}
                            gridHeight={270}
                            page={gridFilter.page}
                            checkboxSelection={false}
                            totalCount={details.length}
                            setFilter={setGridFilter}
                            toolbarProps={{ apiRef: gridApiRef, onAdd: schemePopup.showAdd, selectionModel }}
                            gridToolBar={SchemeToolbar}
                            selectionModel={selectionModel}
                            setSelectionModel={setSelectionModel}
                        />

                    )}
                </Panel>
            </Box>

            <FormPopup popup={policyPopup} popupTitle="Policy" formData={policyFormData} />
            <FormPopup popup={schemePopup} popupTitle="Scheme" formData={schemeFormData}>
                <HeadChips heads={heads} value={headIds} onToggle={toggleHead} />
            </FormPopup>

            <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
        </>
    );
}