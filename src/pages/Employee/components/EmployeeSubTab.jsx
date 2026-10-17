import React, { useEffect, useMemo, useRef, useState } from 'react';
import Popup from '../../../components/Popup';
import Controls from '../../../components/controls/Controls';
import { AutoForm } from '../../../components/useForm';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { useEntitiesQuery, useEntityAction } from '../../../store/actions/httpactions';
import { Box, Chip, IconButton, Typography } from '../../../deps/ui';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import ViewListIcon from '@mui/icons-material/ViewList';
import GridViewIcon from '@mui/icons-material/GridView';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined';
import AccountBalanceOutlined from '@mui/icons-material/AccountBalanceOutlined';
import { API } from '../_Service';
import { alnumRule } from '@/util/common';
import { startOfDay, isBefore, systemFormatDate } from '@/services/dateTimeService';
// TODO: _Service mein ye 2 constants add karo (backend ke controller routes ke mutabiq)
const DOCUMENTS_API = API.EmployeeDocument;
const BANK_API = API.BankDetail;

// File column / card row (backend list mein fileName aur fileSize bhejta hai)
const SHOW_FILE_COLUMN = true;
// DocumentType.maxFileSizeMb ka fallback (0/null aane par bhi 5 MB hi lagega)
const DEFAULT_FILE_MB = 5;
const limitMbOf = (type) => (type?.maxFileSizeMb > 0 ? type.maxFileSizeMb : DEFAULT_FILE_MB);

// Documents ki chuni hui view (list/card) browser mein yaad rakhi jati hai
const VIEW_KEY = 'hrnova.employeeDocuments.view';
const readView = () => {
    try {
        return localStorage.getItem(VIEW_KEY) === 'card' ? 'card' : 'list';
    } catch {
        return 'list';
    }
};

// ───────────── SAMPLE DATA (baad mein useDropDown se replace karna) ─────────────
// Dhyan: sample ids asli tables mein nahi hain, save karne se pehle real lists jodna (ya DB mein same ids rakho)
// asli list mein bhi har item par notifyOnExpiry (bool) aur maxFileSizeMb (int) aane chahiye
export const DOCUMENT_TYPES_SAMPLE = [
    { id: 1, name: 'CNIC / National ID', notifyOnExpiry: false, maxFileSizeMb: 5 },
    { id: 2, name: 'Iqama', notifyOnExpiry: true, maxFileSizeMb: 5 },
    { id: 3, name: 'Passport', notifyOnExpiry: true, maxFileSizeMb: 5 },
    { id: 4, name: 'Visa', notifyOnExpiry: true, maxFileSizeMb: 3 },
    { id: 5, name: 'Driving License', notifyOnExpiry: true, maxFileSizeMb: 3 },
    { id: 6, name: 'Work Permit', notifyOnExpiry: true, maxFileSizeMb: 5 },
];

export const BANKS_SAMPLE = [
    { id: 1, name: 'HBL' },
    { id: 2, name: 'UBL' },
    { id: 3, name: 'MCB' },
    { id: 4, name: 'Meezan Bank' },
    { id: 5, name: 'Bank Alfalah' },
    { id: 6, name: 'Al Rajhi Bank' },
    { id: 7, name: 'Saudi National Bank' },
    { id: 8, name: 'Riyad Bank' },
];

// ───────────── Date helpers (DateOnly) ─────────────
const pad = (n) => String(n).padStart(2, '0');

// local yyyy-MM-dd; toISOString() nahi, Pakistan/KSA mein date ek din peeche chali jati hai
export const toDateOnly = (d) => {
    if (!d) return null;
    const x = new Date(d);
    return Number.isNaN(x.getTime()) ? null : `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`;
};
const fromDateOnly = (s) => (s ? new Date(`${String(s).slice(0, 10)}T00:00:00`) : null);
const fmtDate = (s) => (s
    ? fromDateOnly(s).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—');

// rank: 0 expired, 1 30 din ke andar, 2 valid, 3 expiry nahi (sorting aur warning strip dono isi se)
const getExpiryStatus = (date) => {
    if (!date) return { rank: 3, label: null, color: null };
    const days = Math.ceil((fromDateOnly(date) - new Date().setHours(0, 0, 0, 0)) / 86400000);
    if (days < 0) return { rank: 0, label: 'Expired', color: 'error' };
    if (days === 0) return { rank: 1, label: 'Expires today', color: 'warning' };
    if (days <= 30) return { rank: 1, label: `${days}d left`, color: 'warning' };
    return { rank: 2, label: 'Valid', color: 'success' };
};

const StatusChip = ({ status }) =>
    (status.label ? <Chip size="small" color={status.color} label={status.label} /> : '—');

// File ko base64 string banata hai (data-URL ka prefix hata kar); backend ke byte[] mein seedha bind hota hai
const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
});

const formatSize = (bytes) => {
    if (typeof bytes !== 'number') return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

// ───────────── Shared CRUD logic (fetch + popup + save + soft delete) ─────────────
// onOpen(row | null): popup khulne par (edit mein row, add mein null), taake tab apni state sync kar sake
function useRowCrud({ api, employeeId, rowToForm, formToPayload, addDefaults = () => ({}), onOpen }) {
    const formApi = useRef(null);
    const isEdit = useRef(false);
    const editRow = useRef(null);
    const [openPopup, setOpenPopup] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });
    const { addEntity, removeEntity } = useEntityAction();

    const { data, isFetching, refetch } = useEntitiesQuery(
        { url: `${api}/get`, data: { limit: 100, page: 1, searchParams: { employeeId: { operator: 'Equal', value: employeeId } } } },
        {
            skip: !employeeId,
            selectFromResult: ({ data, isFetching }) => ({ data: data?.entityData, isFetching }),
        }
    );
    const rows = data ?? [];

    // popup khulte hi form reset + (edit ho to row load / add ho to defaults)
    useEffect(() => {
        if (!openPopup || !formApi.current) return;
        const { resetForm, setFormValue } = formApi.current;
        resetForm();
        setFormValue(isEdit.current ? rowToForm(editRow.current) : addDefaults(rows));
        onOpen?.(isEdit.current ? editRow.current : null);
    }, [openPopup]);

    const save = (payload) =>
        addEntity({ url: api, data: { ...payload, employeeId } }).then((r) => {
            if (r?.data) refetch();
            return r;
        });

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

    // soft delete: backend IsDeleted set karega, frontend sirf confirm + refetch
    const askDelete = (row) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Are you sure to delete this record?',
            subTitle: "You can't undo this operation",
            onConfirm: () => {
                removeEntity({ url: api, params: String(row.id) }).then(() => refetch());
            },
        });
    };

    // formToPayload async ho sakta hai (file bytes padhne ke liye); double click par dobara submit nahi hota
    const submitting = useRef(false);
    const handleSubmit = async () => {
        if (submitting.current) return;
        const { getValue, validateFields } = formApi.current;
        if (!validateFields()) return;
        submitting.current = true;
        try {
            const payload = await formToPayload(getValue(), editRow.current);
            if (isEdit.current) payload.id = editRow.current.id;
            const r = await save(payload);
            if (r?.data) setOpenPopup(false);
        } catch (err) {
            console.error('Save failed', err);
        } finally {
            submitting.current = false;
        }
    };

    return {
        rows, isFetching, formApi, isEdit, openPopup, setOpenPopup,
        showAdd, showEdit, askDelete, save, handleSubmit, confirmDialog, setConfirmDialog,
    };
}

// ───────────── Shared UI pieces ─────────────
const FormPopup = ({ crud, popupTitle, formData }) => (
    <Popup
        title={`${crud.isEdit.current ? 'Edit' : 'Add'} ${popupTitle}`}
        openPopup={crud.openPopup}
        maxWidth="sm"
        isEdit={crud.isEdit.current}
        keepMounted={true}
        addOrEditFunc={crud.handleSubmit}
        setOpenPopup={crud.setOpenPopup}>
        <AutoForm formData={formData} ref={crud.formApi} isValidate={true} />
    </Popup>
);

const SectionHeader = ({ title, count, addLabel, onAdd, children }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <Box>
            <Typography variant="subtitle1" fontWeight={700}>{title}</Typography>
            <Typography variant="caption" color="text.secondary">
                {count} {count === 1 ? 'record' : 'records'}
            </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {children}
            <Controls.Button onClick={onAdd} startIcon={<AddIcon />} text={addLabel} />
        </Box>
    </Box>
);

const EmptyState = ({ icon, title, hint }) => (
    <Box sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 3, py: 6, textAlign: 'center', color: 'text.secondary' }}>
        <Box sx={{ mb: 1 }}>{icon}</Box>
        <Typography variant="body2" fontWeight={600}>{title}</Typography>
        <Typography variant="caption">{hint}</Typography>
    </Box>
);

const RowActions = ({ onEdit, onDelete }) => (
    <>
        <IconButton size="small" aria-label="Edit" onClick={onEdit}><EditIcon fontSize="small" /></IconButton>
        <IconButton size="small" aria-label="Delete" onClick={onDelete}><DeleteIcon fontSize="small" /></IconButton>
    </>
);

const SR_COLUMN = { header: 'Sr#', width: '56px', render: (row, index) => index + 1 };

// Simple list (DataGrid nahi): header + rows, har column {header, width, render(row, index), align?}
function DataList({ columns, rows }) {
    const template = columns.map((c) => c.width).join(' ');
    const cellSx = { px: 1.5, py: 1.25, fontSize: '0.8rem', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
    return (
        <Box sx={{ overflowX: 'auto' }}>
            <Box sx={{ minWidth: 720, border: 1, borderColor: 'divider', borderRadius: 3, overflow: 'hidden', bgcolor: 'background.paper' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: template, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
                    {columns.map((c, i) => (
                        <Box key={`${c.header}-${i}`} sx={{
                            ...cellSx, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase',
                            letterSpacing: '0.06em', color: 'text.secondary', textAlign: c.align ?? 'left',
                        }}>
                            {c.header}
                        </Box>
                    ))}
                </Box>
                {rows.map((row, rowIndex) => (
                    <Box key={row.id} sx={{
                        display: 'grid', gridTemplateColumns: template, alignItems: 'center',
                        borderTop: rowIndex ? 1 : 0, borderColor: 'divider',
                        '&:hover': { bgcolor: 'action.hover' },
                    }}>
                        {columns.map((c, i) => (
                            <Box key={`${c.header}-${i}`} sx={{ ...cellSx, textAlign: c.align ?? 'left', ...(c.sx ?? {}) }}>
                                {c.render(row, rowIndex)}
                            </Box>
                        ))}
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

// ───────────── Documents tab (list / card toggle) ─────────────
const DocCard = ({ doc, typeName, onEdit, onDelete }) => (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 2, bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
            <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <DescriptionOutlined fontSize="small" />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle2" fontWeight={700} noWrap>{typeName}</Typography>
                    <StatusChip status={doc._status} />
                </Box>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{doc.number}</Typography>
            </Box>
        </Box>

        {doc.issueDate || doc.expiryDate ? (
            <Box sx={{ display: 'flex', gap: 4, mt: 1.5 }}>
                <Box>
                    <Typography variant="caption" color="text.secondary" display="block">Issued</Typography>
                    <Typography variant="body2">{fmtDate(doc.issueDate)}</Typography>
                </Box>
                <Box>
                    <Typography variant="caption" color="text.secondary" display="block">Expires</Typography>
                    <Typography variant="body2">{fmtDate(doc.expiryDate)}</Typography>
                </Box>
            </Box>
        ) : (
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1.5 }}>No expiry</Typography>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mt: 1.5, pt: 1, borderTop: 1, borderColor: 'divider' }}>
            <Box sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                {SHOW_FILE_COLUMN && (
                    <>
                        <AttachFileIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption" noWrap>
                            {doc.fileName
                                ? `${doc.fileName}${formatSize(doc.fileSize) ? ` (${formatSize(doc.fileSize)})` : ''}`
                                : 'No file attached'}
                        </Typography>
                    </>
                )}
            </Box>
            <Box sx={{ flexShrink: 0 }}><RowActions onEdit={onEdit} onDelete={onDelete} /></Box>
        </Box>
    </Box>
);

export const EmployeeDocumentsTab = ({ employeeId }) => {
    const [view, setView] = useState(readView);
    const { data: documentTypes, isFetching, refetch, totalRecord } = useEntitiesQuery({
        url: `${API.DocumentType}/get`,
        data: {
            limit: 100,
            page: 1,
            searchParams: {
                isActive: { operator: 'Equal', value: true },
            }
        }
    }, { selectFromResult: ({ data, isFetching }) => ({ data: data?.entityData, totalRecord: data?.totalRecord, isFetching }) });

    // popup mein chuni hui document type: file ki size limit aur expiry required isi se tay hoti hai
    const [selectedType, setSelectedType] = useState(null);

    const crud = useRowCrud({
        api: DOCUMENTS_API,
        employeeId,
        onOpen: (row) =>
            setSelectedType(row ? documentTypes.find((t) => t.id === row.documentTypeId) ?? null : null),
        rowToForm: (row) => ({
            fkDocumentTypeId: documentTypes.find((t) => t.id === row.documentTypeId) ?? null,
            number: row.number,
            issueDate: fromDateOnly(row.issueDate),
            expiryDate: fromDateOnly(row.expiryDate),
            // purani file sirf naam/size ke object ke taur par (FileDrop value.name dikhata hai)
            file: row.fileName ? { name: row.fileName, size: row.fileSize } : null,
        }),
        formToPayload: async (v, row) => {
            const payload = {
                documentTypeId: v.fkDocumentTypeId.id,
                number: v.number.trim(),
                issueDate: systemFormatDate(v.issueDate),
                expiryDate: systemFormatDate(v.expiryDate),
            };
            if (v.file instanceof File) {
                // nayi/replace file: bytes isi request mein (base64 string, backend byte[])
                payload.fileName = v.file.name;
                payload.contentType = v.file.type || 'application/octet-stream';
                payload.fileContent = await fileToBase64(v.file);
            } else if (row?.fileName) {
                payload.fileName = row?.fileName;
                payload.contentType = row?.contentType;
            }
            // file na chhui ho to koi file field nahi jata, backend purani file rakhega
            return payload;
        },
    });

    // Expired pehle, phir jald expire hone wale, phir valid, phir bina expiry wale
    const docs = useMemo(() => crud.rows
        .map((r) => ({ ...r, _status: getExpiryStatus(r.expiryDate) }))
        .sort((a, b) =>
            a._status.rank - b._status.rank
            || String(a.expiryDate ?? '').localeCompare(String(b.expiryDate ?? ''))), [crud.rows]);

    const typeName = (r) =>
        r.documentTypeName ?? documentTypes.find((t) => t.id === r.documentTypeId)?.name ?? '';

    const limitMb = limitMbOf(selectedType);

    const expired = docs.filter((d) => d._status.rank === 0).length;
    const soon = docs.filter((d) => d._status.rank === 1).length;
    const alertText = [
        expired ? `${expired} expired` : null,
        soon ? `${soon} expiring within 30 days` : null,
    ].filter(Boolean).join(', ');

    const changeView = (_, next) => {
        if (!next) return;
        setView(next);
        try { localStorage.setItem(VIEW_KEY, next); } catch { /* ignore */ }
    };

    const columns = [
        SR_COLUMN,
        { header: 'Type', width: '1.2fr', render: (r) => <strong>{typeName(r)}</strong> },
        { header: 'Number', width: '1.3fr', render: (r) => <span style={{ fontFamily: 'monospace' }}>{r.number}</span> },
        { header: 'Issued', width: '0.9fr', render: (r) => fmtDate(r.issueDate) },
        { header: 'Expires', width: '0.9fr', render: (r) => fmtDate(r.expiryDate) },
        { header: 'Status', width: '0.9fr', render: (r) => <StatusChip status={r._status} /> },
        ...(SHOW_FILE_COLUMN ? [{
            header: 'File',
            width: '1.5fr',
            render: (r) => (r.fileName
                ? (
                    <>
                        <AttachFileIcon sx={{ fontSize: 14, verticalAlign: 'middle' }} /> {r.fileName}
                        {formatSize(r.fileSize) && <span style={{ opacity: 0.6 }}> ({formatSize(r.fileSize)})</span>}
                    </>
                )
                : <span style={{ opacity: 0.6 }}>No file</span>),
        }] : []),
        {
            header: '',
            width: '104px',
            align: 'right',
            sx: { overflow: 'visible', py: 0.5 },
            render: (r) => <RowActions onEdit={() => crud.showEdit(r)} onDelete={() => crud.askDelete(r)} />,
        },
    ];

    const formData = [
        {
            elementType: 'ad_dropdown',
            name: 'fkDocumentTypeId',
            label: 'Document Type',
            required: true,
            validate: { errorMessage: 'Document type is required' },
            dataName: 'name',
            dataId: 'id',
            options: documentTypes,
            onChange: (type) => {
                setSelectedType(type);
                // nayi chuni hui file naye (chhote) limit se bari ho to hata do; purani server wali file ko nahi chhedte
                const file = crud.formApi.current?.getValue().file;
                if (file instanceof File && file.size > limitMbOf(type) * 1024 * 1024) {
                    crud.formApi.current.setFormValue({ file: null });
                }
            },
            defaultValue: null,
        },
        {
            elementType: 'inputfield',
            name: 'number',
            label: 'Number',
            required: true,
            validate: { errorMessage: 'Number is required' },
            defaultValue: '',
        },
        { elementType: 'datetimepicker', name: 'issueDate', label: 'Issue Date', defaultValue: null },
        {
            elementType: 'datetimepicker',
            name: 'expiryDate',
            label: 'Expiry Date',
            disablePast: true,
            // shouldDisableDate: (date) => isBefore(startOfDay(date), startOfDay(crud.formApi.current?.getValue().issueDate)),
            // jis type par NotifyOnExpiry on hai uski expiry date zaroori (warna alert kabhi nahi chalega)
            required: (v) => Boolean(v.fkDocumentTypeId?.notifyOnExpiry),
            validate: { errorMessage: 'Expiry date is required for this document type' },
            defaultValue: null,
        },
        {
            elementType: 'filedrop',
            name: 'file',
            label: 'Document copy',
            accept: '.pdf,.jpg,.jpeg,.png',
            maxSize: limitMb * 1024 * 1024, // hint ("max X MB") FileDrop khud banata hai
            clearable: true,
            breakpoints: { size: { xs: 12, sm: 12, md: 12 } },
            defaultValue: null,
        },
    ];

    return (
        <>
            <SectionHeader title="Documents" count={docs.length} addLabel="Add Document" onAdd={crud.showAdd}>
                <ToggleButtonGroup size="small" exclusive value={view} onChange={changeView} aria-label="Documents view">
                    <ToggleButton value="list" aria-label="List view"><ViewListIcon fontSize="small" /></ToggleButton>
                    <ToggleButton value="card" aria-label="Card view"><GridViewIcon fontSize="small" /></ToggleButton>
                </ToggleButtonGroup>
            </SectionHeader>

            {crud.isFetching && !docs.length && <LinearProgress sx={{ mb: 2 }} />}
            {alertText && <Alert severity="warning" sx={{ mb: 2 }}>{alertText}</Alert>}

            {!docs.length && !crud.isFetching ? (
                <EmptyState
                    icon={<DescriptionOutlined />}
                    title="No documents yet"
                    hint="Add Iqama, passport, visa or any other document of this employee"
                />
            ) : view === 'list' ? (
                <DataList columns={columns} rows={docs} />
            ) : (
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' } }}>
                    {docs.map((d) => (
                        <DocCard
                            key={d.id}
                            doc={d}
                            typeName={typeName(d)}
                            onEdit={() => crud.showEdit(d)}
                            onDelete={() => crud.askDelete(d)}
                        />
                    ))}
                </Box>
            )}

            <FormPopup crud={crud} popupTitle="Document" formData={formData} />
            <ConfirmDialog confirmDialog={crud.confirmDialog} setConfirmDialog={crud.setConfirmDialog} />
        </>
    );
};

const ALPHANUM_VALID = /^[A-Za-z0-9]+$/;

// ───────────── Bank tab (sirf list) ─────────────
export const EmployeeBankTab = ({ employeeId, employeeName = '' }) => {

    const { data: banks, isFetching, refetch, totalRecord } = useEntitiesQuery({
        url: `${API.Bank}/get`,
        data: {
            limit: 100,
            page: 1,
            searchParams: {
                isActive: { operator: 'Equal', value: true },
            }
        }
    }, { selectFromResult: ({ data, isFetching }) => ({ data: data?.entityData, totalRecord: data?.totalRecord, isFetching }) });

    const crud = useRowCrud({
        api: BANK_API,
        employeeId,
        // pehla account khud default, account title employee ke naam se prefill
        addDefaults: (rows) => ({ accountTitle: employeeName, isDefault: rows.length === 0 }),
        rowToForm: (row) => ({
            fkBankId: banks.find((b) => b.id === row.bankId) ?? null,
            accountTitle: row.accountTitle,
            accountNo: row.accountNo,
            iban: row.iban ?? null,
            isDefault: Boolean(row.isDefault),
        }),
        formToPayload: (v) => ({
            bankId: v.fkBankId.id,
            accountTitle: v.accountTitle.trim(),
            accountNo: v.accountNo.trim(),
            iban: v.iban ? v.iban.replace(/\s+/g, '').toUpperCase() : null,
            isDefault: Boolean(v.isDefault),
        }),
    });

    // default account sab se upar
    const accounts = useMemo(
        () => [...crud.rows].sort((a, b) => Number(Boolean(b.isDefault)) - Number(Boolean(a.isDefault))),
        [crud.rows]
    );

    const bankName = (r) => r.bankName ?? banks.find((b) => b.id === r.bankId)?.name ?? '';

    const setDefault = (r) => crud.save({
        id: r.id,
        bankId: r.bankId,
        accountTitle: r.accountTitle,
        accountNo: r.accountNo,
        iban: r.iban ?? null,
        isDefault: true,
    });

    const columns = [
        SR_COLUMN,
        { header: 'Bank', width: '1.1fr', render: (r) => <strong>{bankName(r)}</strong> },
        { header: 'Account Title', width: '1.1fr', render: (r) => r.accountTitle },
        { header: 'Account No', width: '1.1fr', render: (r) => <span style={{ fontFamily: 'monospace' }}>{r.accountNo}</span> },
        { header: 'IBAN', width: '2fr', render: (r) => <span style={{ fontFamily: 'monospace' }}>{r.iban ?? '—'}</span> },
        {
            header: 'Default',
            width: '130px',
            sx: { overflow: 'visible', py: 0.5 },
            render: (r) => (r.isDefault
                ? <Chip size="small" color="success" label="Default" />
                : <Button size="small" onClick={() => setDefault(r)}>Set default</Button>),
        },
        {
            header: '',
            width: '104px',
            align: 'right',
            sx: { overflow: 'visible', py: 0.5 },
            render: (r) => <RowActions onEdit={() => crud.showEdit(r)} onDelete={() => crud.askDelete(r)} />,
        },
    ];

    const formData = [
        {
            elementType: 'ad_dropdown',
            name: 'fkBankId',
            label: 'Bank',
            required: true,
            validate: { errorMessage: 'Bank is required' },
            dataName: 'name',
            dataId: 'id',
            options: banks,
            defaultValue: null,
        },
        {
            elementType: 'inputfield',
            name: 'accountTitle',
            label: 'Account Title',
            required: true,
            validate: { errorMessage: 'Account title is required' },
            defaultValue: '',
        },
        {
            elementType: 'inputfield',
            name: 'accountNo',
            label: 'Account No',
            required: true,
            validate: {
                errorMessage: 'Account number is required',
                validate: alnumRule('accountNo', ALPHANUM_VALID, 'Only letters and numbers are allowed')
            },
            defaultValue: '',
        },
        { elementType: 'inputfield', name: 'iban', label: 'IBAN', defaultValue: null },
        { elementType: 'checkbox', name: 'isDefault', label: 'Default account', defaultValue: false },
    ];

    return (
        <>
            <SectionHeader title="Bank Accounts" count={accounts.length} addLabel="Add Account" onAdd={crud.showAdd} />

            {crud.isFetching && !accounts.length && <LinearProgress sx={{ mb: 2 }} />}

            {!accounts.length && !crud.isFetching ? (
                <EmptyState
                    icon={<AccountBalanceOutlined />}
                    title="No bank accounts yet"
                    hint="Add the account where this employee's salary will be paid"
                />
            ) : (
                <DataList columns={columns} rows={accounts} />
            )}

            <FormPopup crud={crud} popupTitle="Bank Account" formData={formData} />
            <ConfirmDialog confirmDialog={crud.confirmDialog} setConfirmDialog={crud.setConfirmDialog} />
        </>
    );
};