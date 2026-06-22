// ════════════════════════════════════════════════════════════════════
// JobPortal/index.jsx — Public Job Opening Portal (React + MUI)
// ════════════════════════════════════════════════════════════════════
//
// TESTING MODE:
//   USE_DUMMY_DATA = true  → works standalone, no backend needed
//   USE_DUMMY_DATA = false → wires up to real API
//
// API endpoints expected:
//   GET  /api/public/jobpost/active  → list of active job posts
//   POST /api/public/apply           → multipart/form-data (see ApplyModal)
//
// Route: /careers  (public, no auth required)
// ════════════════════════════════════════════════════════════════════

import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
    Box, Stack, Typography, TextField, InputAdornment,
    Select, MenuItem, FormControl, Divider, Chip,
    FormGroup, FormControlLabel, Checkbox, Paper,
} from '../../deps/ui';
import { Search, Business, People, Language } from '../../deps/ui/icons';

import JobCard from './components/JobCard';
import { DUMMY_JOBS, DUMMY_COMPANY } from './components/constants';
import BodyBG from '../../assets/images/bg-0.jpg'
import { useAppSelector } from '@/store/storehook';
import { useEntitiesQuery, useEntityAction, useLazySingleQuery } from '@/store/actions/httpactions';
import Popup from '@/components/Popup';
import Loader from '@/components/Circularloading'
import { AutoForm } from '@/components/useForm';

// ─── Real API imports (uncomment when wiring up) ─────────────────────────────
// import { useLazySingleQuery } from '../../store/actions/httpactions';
import { API } from './_Service';

// ════════════════════════════════════════════════════════════════════
const USE_DUMMY_DATA = true; // ← false karo jab backend ready ho
// ════════════════════════════════════════════════════════════════════

const SIDEBAR_LABEL_SX = {
    fontSize: 11, fontWeight: 500, color: 'text.disabled',
    letterSpacing: '.06em', textTransform: 'uppercase',
    mb: 1, display: 'block',
};

// ════════════════════════════════════════════════════════════════════
// Sidebar filter section wrapper
// ════════════════════════════════════════════════════════════════════
const FilterSection = ({ label, children }) => (
    <Box mb={2}>
        <Typography sx={SIDEBAR_LABEL_SX}>{label}</Typography>
        {children}
    </Box>
);

const ACCEPTED = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const DEFAULT_API = API.JobApplication;
const AddCandidate = ({ job, openPopup, setOpenPopup }) => {
    const formApi = useRef(null);
    const [loader, setLoader] = useState(false);

    const { addEntity } = useEntityAction();

    useEffect(() => {
        if (formApi.current && openPopup) {
            const { resetForm } = formApi.current;
            resetForm();
        }
    }, [openPopup, formApi])
    const validateFile = (file) => {
        if (!file) return 'Please upload your CV';
        if (!ACCEPTED.includes(file.type) && !file.name.match(/\.(pdf|docx)$/i))
            return 'Only PDF or DOCX files are accepted';
        if (file.size > 5 * 1024 * 1024)
            return 'File size must be under 5MB';

        return "";
    }
    const formData = [
        {
            elementType: "inputfield",
            name: "firstName",
            required: true,
            label: "First Name",
            validate: {
                errorMessage: "First name is required",
            },
            defaultValue: ""
        },
        {
            elementType: "inputfield",
            name: "lastName",
            required: true,
            label: "Last Name",
            validate: {
                errorMessage: "Last name is required",
            },
            defaultValue: ""
        },
        {
            elementType: "inputfield",
            name: "email",
            label: "Email",
            required: true,
            type: "email",
            validate: {
                errorMessage: "Email is required",
                validate: (val) => /$^|.+@.+..+/.test(val.email)
            },
            defaultValue: ""
        },
        {
            elementType: "inputfield",
            name: "mobileNo",
            required: true,
            label: "Phone",
            validate: {
                errorMessage: "Phone is required",
            },
            defaultValue: ""
        },
        {
            elementType: "filedrop",
            name: "resumeFile",
            required: true,
            breakpoints: { size: { md: 12, sm: 12, xs: 12 } },
            validate: {
                errorMessage: "Please upload your CV",
                validate: (val) => validateFile(val.resumeFile)
            },
            defaultValue: null
        },
        {
            elementType: "inputfield",
            name: "coverNote",
            label: "Covert Note (Optional)",
            placeholder: "Briefly describe why you are a strong fit for this role...",
            multiline: true,
            minRows: 3,
            variant: "outlined",
            breakpoints: { size: { md: 12, sm: 12, xs: 12 } },
            defaultValue: ""
        }
    ];


    const handleSubmit = (e) => {
        const { getValue, validateFields } = formApi.current
        if (validateFields()) {
            let values = getValue();
            let dataToInsert = { ...values };
            dataToInsert.fkJobPostId = job._id;
            dataToInsert.uploadFileName = values.resumeFile.name;
            addEntity({ url: `${DEFAULT_API}/apply`, data: [dataToInsert] });

        }
    }
    return <>
        <Loader open={loader} />
        <Popup
            title={`Apply for ${job?.title}`}
            openPopup={openPopup}
            maxWidth="sm"
            loader={loader}
            isEdit={false}
            keepMounted={true}
            addOrEditFunc={handleSubmit}
            setOpenPopup={setOpenPopup}>
            <AutoForm formData={formData} ref={formApi} isValidate={true} />
        </Popup>
    </>
}
// ════════════════════════════════════════════════════════════════════
// Main Page
// ════════════════════════════════════════════════════════════════════
const JobPortal = () => {
    // const [jobs, setJobs] = useState([]);
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(false);
    const [applyJob, setApplyJob] = useState(null);
    const [openPopup, setOpenPopup] = useState(false);

    // ── Filters ──────────────────────────────────────────────────────
    const [search, setSearch] = useState('');
    const [selDept, setSelDept] = useState('All');
    const [selTypes, setSelTypes] = useState(new Set());
    const [selLocs, setSelLocs] = useState(new Set());
    const [sort, setSort] = useState("createdAt");
    const [filter, setFilter] = useState({
        fkDepartmentId: null,
        fkCityId: null,
        employmentType: ""
    })

    // ── Real API hooks (uncomment when wiring) ────────────────────────
    const { jobs, depts, types, locs, isFetching, refetch } = useEntitiesQuery({
        url: `${DEFAULT_API}/active`,
        data: {
            limit: 100, page: 1, sort: sort === "createdAt" ? { createdAt: -1 } : { title: 1 },
            searchParams: {
                ...(filter.fkDepartmentId && { "fkDepartmentId": filter.fkDepartmentId }),
                ...(filter.fkCityId && { "fkCityId": filter.fkCityId }),
                ...(filter.employmentType && { "employmentType": filter.employmentType })
            }

        },
    }, {
        selectFromResult: ({ data, isFetching }) => ({
            jobs: data?.jobpost ?? [],
            depts: data?.departList ?? [],
            types: data?.types ?? [],
            locs: data?.cityList ?? [],
            isFetching
        })
    });

    const deptCount = (d) => d._id === 'All' ? jobs.length : jobs.filter(j => j.fkDepartmentId === d._id).length;

    return (
        <Box sx={{ maxWidth: 1100, background: `url(${BodyBG})`, height: '100vh', overflowX: 'hidden', overflowY: 'auto', mx: 'auto', px: { xs: 2, md: 3 }, py: 3 }}>
            <Loader open={isFetching} />
            {/* ── Company header ─────────────────────────────────────────── */}
            {company && (
                <Paper variant="outlined" sx={{ p: 2.5, mb: 2.5, borderRadius: 2 }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" gap={2}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Box sx={{
                                width: 52, height: 52, borderRadius: 1.5, flexShrink: 0,
                                bgcolor: 'primary.light', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', fontSize: 22, fontWeight: 500, color: 'primary.dark',
                            }}>
                                {company.initials}
                            </Box>
                            <Box>
                                <Typography variant="body1" fontWeight={500}>{company.name}</Typography>
                                <Stack direction="row" alignItems="center" gap={1.5} mt={0.25} flexWrap="wrap">
                                    <Stack direction="row" alignItems="center" gap={0.4}>
                                        <Business sx={{ fontSize: 13, color: 'text.disabled' }} />
                                        <Typography variant="caption" color="text.secondary">{company.location}</Typography>
                                    </Stack>
                                    <Stack direction="row" alignItems="center" gap={0.4}>
                                        <Language sx={{ fontSize: 13, color: 'text.disabled' }} />
                                        <Typography variant="caption" color="text.secondary">{company.website}</Typography>
                                    </Stack>
                                </Stack>
                            </Box>
                        </Stack>

                        <Stack direction="row" gap={3} flexShrink={0}>
                            {[
                                { value: jobs.length, label: 'Open roles' },
                                { value: depts.length - 1, label: 'Departments' },
                                { value: `${company.employeeCount}+`, label: 'Employees' },
                            ].map(({ value, label }) => (
                                <Box key={label} textAlign="center">
                                    <Typography variant="h6" fontWeight={500} lineHeight={1}>{value}</Typography>
                                    <Typography variant="caption" color="text.secondary">{label}</Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Stack>

                    <Divider sx={{ my: 1.75 }} />
                    <Typography variant="body2" color="text.secondary" lineHeight={1.7}>{company.about}</Typography>
                </Paper>
            )}

            {/* ── Search bar ─────────────────────────────────────────────── */}
            <TextField
                fullWidth size="small"
                placeholder="Search by title, skill, or keyword..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search fontSize="small" sx={{ color: 'text.disabled' }} />
                        </InputAdornment>
                    ),
                }}
                sx={{ mb: 2 }}
            />

            {/* ── Main layout ────────────────────────────────────────────── */}
            <Stack direction={{ xs: 'column', md: 'row' }} gap={2} alignItems="flex-start">

                {/* Sidebar */}
                <Paper
                    variant="outlined"
                    sx={{
                        width: { xs: '100%', md: 210 },
                        flexShrink: 0,
                        p: 1.75,
                        borderRadius: 2,
                        position: { md: 'sticky' },
                        top: { md: 16 },
                    }}
                >
                    {/* Department */}
                    <FilterSection label="Department">
                        <Stack spacing={0.25}>

                            {depts.map(d => (
                                <Stack
                                    key={d._id}
                                    direction="row" alignItems="center" justifyContent="space-between"
                                    onClick={() => setFilter({ ...filter, fkDepartmentId: d._id })}
                                    sx={{
                                        px: 1, py: 0.6, borderRadius: 1.5, cursor: 'pointer',
                                        bgcolor: filter.fkDepartmentId === d.i_d ? 'action.selected' : 'transparent',
                                        color: filter.fkDepartmentId === d.i_d ? 'primary.main' : 'text.secondary',
                                        fontWeight: filter.fkDepartmentId === d.i_d ? 500 : 400,
                                        '&:hover': { bgcolor: 'action.hover' },
                                        transition: 'background .12s',
                                    }}
                                >
                                    <Typography variant="body2" fontSize={13} fontWeight="inherit" color="inherit">
                                        {d.departmentName}
                                    </Typography>
                                    <Chip
                                        size="small"
                                        label={deptCount(d)}
                                        sx={{
                                            height: 18, fontSize: 10, minWidth: 24,
                                            bgcolor: filter.fkDepartmentId === d.i_d ? 'primary.light' : 'action.hover',
                                            color: filter.fkDepartmentId === d.i_d ? 'primary.dark' : 'text.secondary',
                                        }}
                                    />
                                </Stack>
                            ))}
                        </Stack>
                    </FilterSection>

                    <Divider sx={{ my: 1.5 }} />

                    {/* Employment type */}
                    <FilterSection label="Employment type">
                        <FormGroup>
                            {types.map(t => (
                                <FormControlLabel
                                    key={t}
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={Boolean(filter.employmentType)}
                                            onChange={(e) => setFilter({ ...filter, employmentType: e.target.checked ? t : "" })}
                                            sx={{ py: 0.4 }}
                                        />
                                    }
                                    label={<Typography variant="body2" fontSize={13}>{t}</Typography>}
                                />
                            ))}
                        </FormGroup>
                    </FilterSection>

                    <Divider sx={{ my: 1.5 }} />

                    {/* Location */}
                    <FilterSection label="Location">
                        <FormGroup>
                            {locs.map(l => (
                                <FormControlLabel
                                    key={l._id}
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={Boolean(filter.fkCityId)}
                                            onChange={(e) => setFilter({ ...filter, fkCityId: e.target.checked ? l._id : null })}
                                            sx={{ py: 0.4 }}
                                        />
                                    }
                                    label={<Typography variant="body2" fontSize={13}>{l.name}</Typography>}
                                />
                            ))}
                        </FormGroup>
                    </FilterSection>
                </Paper>

                {/* Job list */}
                <Box flex={1} minWidth={0}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.25}>
                        <Typography variant="body2" color="text.secondary">
                            {jobs.length} position{jobs.length !== 1 ? 's' : ''} found
                        </Typography>
                        <FormControl size="small" sx={{ minWidth: 130 }}>
                            <Select value={sort} onChange={e => setSort(e.target.value)} sx={{ fontSize: 13 }}>
                                <MenuItem value="createdAt" sx={{ fontSize: 13 }}>Newest first</MenuItem>
                                <MenuItem value="title" sx={{ fontSize: 13 }}>A → Z</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>

                    {jobs.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <People sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                            <Typography color="text.secondary" variant="body2">
                                No positions match your filters
                            </Typography>
                        </Box>
                    ) : (
                        <Stack spacing={1.25}>
                            {jobs.map(job => (
                                <JobCard key={job._id} job={job} onApply={setApplyJob} setOpenPopup={setOpenPopup} />
                            ))}
                        </Stack>
                    )}
                </Box>
            </Stack>

            {/* Apply modal */}
            {/* <ApplyModal
                job={applyJob}
                onClose={() => setApplyJob(null)}
                onSubmit={handleApplySubmit}
            /> */}
            <AddCandidate openPopup={openPopup} setOpenPopup={setOpenPopup} job={applyJob} />
        </Box>
    );
};

export default JobPortal;