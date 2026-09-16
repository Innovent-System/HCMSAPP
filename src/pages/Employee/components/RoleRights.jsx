import React, { useEffect, useMemo, useState, useRef } from "react";

import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    Chip,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@/deps/ui";

import {
    Category as ModuleIcon, Description as FormIcon, KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon, Lock as LockIcon, LockOpen as LockOpenIcon, Save as SaveIcon, VerifiedUser as RightsIcon,
} from "@/deps/ui/icons";
import { useDropDown } from "@/components/useDropDown";
import { API } from "../_Service";
import { useEntityAction, useEntityByIdQuery } from "@/store/actions/httpactions";
import Controls from "@/components/controls/Controls";
import { AutoForm } from '@/components/useForm'
import Popup from '@/components/Popup';



const StatCard = ({ icon, iconBg, iconColor, label, value }) => (
    <Paper
        elevation={0}
        sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 2,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1.5,
        }}
    >
        <Box
            sx={{
                width: 42,
                height: 42,
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: iconBg,
                color: iconColor,
            }}
        >
            {icon}
        </Box>
        <Box>
            <Typography sx={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "text.secondary" }}>
                {label}
            </Typography>
            <Typography sx={{ fontSize: 20, fontWeight: 700, lineHeight: 1.3 }}>
                {value}
            </Typography>
        </Box>
    </Paper>
);

export const ApplyTemplate = ({ openPopup, setOpenPopup, employeeId, refetch }) => {
    const formApi = useRef(null);
    const { updateEntity } = useEntityAction();
    useEffect(() => {
        if (!formApi.current || !openPopup) return;
        const { resetForm, setFormValue } = formApi.current;
        if (openPopup)
            resetForm();

    }, [openPopup, formApi])

    const { roleTemplates } = useDropDown();

    const handleSubmit = (e) => {
        const { getValue, validateFields } = formApi.current
        if (validateFields()) {
            let values = getValue();

            updateEntity({
                url: `${DEFAULT_API}/UserTemplate`, data: {
                    roleTemplateMasterId: values.roleTemplateId.id,
                    employeeId
                }
            }).then(e => {
                refetch();
                setOpenPopup(false)
            });

        }
    }

    const formData = [
        {
            elementType: "ad_dropdown",
            name: "roleTemplateId",
            label: "Template",
            required: true,
            onKeyDown: (e) => e.keyCode == 13 && handleSubmit(),
            validate: {
                errorMessage: "Template is required",
            },
            dataName: 'name',
            options: roleTemplates,
            defaultValue: null
        }
    ];
    return <Popup
        title="Role Template"
        openPopup={openPopup}
        maxWidth="sm"
        keepMounted={true}
        addOrEditFunc={handleSubmit}
        setOpenPopup={setOpenPopup}>
        <AutoForm formData={formData} ref={formApi} isValidate={true} />
    </Popup>
}

// Sentinel option injected into a role's configuration dropdown to represent "All X" —
// selecting it clears any specific entity picks (isAll=true, entityIds=[]).
const ALL_SENTINEL = "__ALL__";

// A role's `code` decides which reference list its configuration dropdown uses. Self and
// Subordinates have no entry here on purpose — they're checkbox-only, no config column.
const buildEntityListByCode = (departments, areas) => ({
    DEPARTMENTACCESS: { options: departments, dataName: "departmentName" },
    AREAACCESS: { options: areas, dataName: "name" },
});

const SYSTEM_GENERAL_ROLES = [
    {
        id: 1,
        name: "Self",
        code: "SELF",
        description: "User's own employee data",
        access: false,
        isAll: false,
        entityIds: []
    },
    {
        id: 2,
        name: "Subordinates",
        code: "SUBORDINATES",
        description: "Employees reporting to the user",
        access: false,
        isAll: false,
        entityIds: []
    },
    {
        id: 3,
        name: "Access on Department",
        code: "DEPARTMENTACCESS",
        description: "Access employees by department",
        access: false,
        isAll: false,
        entityIds: []
    },
    {
        id: 4,
        name: "Access on Area",
        code: "AREAACCESS",
        description: "Access employees by area",
        access: false,
        isAll: false,
        entityIds: []
    },
];

// Key used in the same expandedModules map as the module rows, so the accordion
// expand/collapse behaves identically to every other section in this table.
const GENERAL_ACCESS_KEY = "general-access";

const DEFAULT_API = API.RoleTemplate;

const RoleRights = ({ isUserRole = false }) => {
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [expandedModules, setExpandedModules] = useState({ [GENERAL_ACCESS_KEY]: true });
    const [loading, setLoading] = useState(false);
    const [openPopup, setOpenPopup] = useState(false);

    const [generalRoles, setGeneralRoles] = useState(SYSTEM_GENERAL_ROLES);

    const { roleTemplates: templates, employees, departments = [], areas = [] } = useDropDown();
    const entityListByCode = useMemo(() => buildEntityListByCode(departments, areas), [departments, areas]);

    const { data, refetch } = useEntityByIdQuery({
        url: isUserRole ? `${DEFAULT_API}/userRole` : DEFAULT_API,
        id: selectedTemplate?.id
    }, { selectFromResult: ({ data, isFetching }) => ({ data: data?.result, isFetching }) });

    const { addEntity, updateEntity } = useEntityAction();
    // Load rights whenever a different template is picked
    useEffect(() => {
        if (!data) return;
        setPermissions([...data.formRights]);
        setGeneralRoles([...data.generalAccess]);
        setExpandedModules((prev) => ({
            ...data.formRights.reduce((acc, module) => {
                acc[module.moduleId] = true;
                return acc;
            }, {}),
            [GENERAL_ACCESS_KEY]: prev[GENERAL_ACCESS_KEY] ?? true,
        }));
    }, [data]);

    // Union of every distinct action across ALL forms/modules — different forms can expose
    // different action sets (e.g. CanExport only on report forms).
    const actions = useMemo(() => {
        const map = new Map();
        permissions.forEach((module) =>
            module.forms.forEach((form) =>
                form.actions.forEach((action) => {
                    if (!map.has(action.actionId)) map.set(action.actionId, action);
                })
            )
        );
        return Array.from(map.values());
    }, [permissions]);


    const stats = useMemo(() => {
        const totalForms = permissions.reduce((sum, m) => sum + m.forms.length, 0);
        const rightsGranted = permissions.reduce(
            (sum, m) =>
                sum + m.forms.reduce((s, f) => s + f.actions.filter((a) => a.isSelected).length, 0),
            0
        );
        return { totalModules: permissions.length, totalForms, rightsGranted };
    }, [permissions]);


    const toggleModule = (moduleId) =>
        setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));


    const toggleAction = (moduleId, formId, actionId) =>
        setPermissions((prev) =>
            prev.map((module) =>
                module.moduleId !== moduleId
                    ? module
                    : {
                        ...module,
                        forms: module.forms.map((form) =>
                            form.formId !== formId
                                ? form
                                : {
                                    ...form,
                                    actions: form.actions.map((action) =>
                                        action.actionId === actionId
                                            ? { ...action, isSelected: !action.isSelected }
                                            : action
                                    ),
                                }
                        ),
                    }
            )
        );


    const toggleAllFormActions = (moduleId, formId, checked) =>
        setPermissions((prev) =>
            prev.map((module) =>
                module.moduleId !== moduleId
                    ? module
                    : {
                        ...module,
                        forms: module.forms.map((form) =>
                            form.formId !== formId
                                ? form
                                : { ...form, actions: form.actions.map((a) => ({ ...a, isSelected: checked })) }
                        ),
                    }
            )
        );


    const toggleAllModuleActions = (moduleId, checked) =>
        setPermissions((prev) =>
            prev.map((module) =>
                module.moduleId !== moduleId
                    ? module
                    : {
                        ...module,
                        forms: module.forms.map((form) => ({
                            ...form,
                            actions: form.actions.map((a) => ({ ...a, isSelected: checked })),
                        })),
                    }
            )
        );

    // ---- General Access handlers ----

    const toggleGeneralRole = (roleId) => {
        setGeneralRoles((prev) =>
            prev.map((role) =>
                role.id === roleId
                    ? { ...role, access: !role.access, ...(role.access ? { isAll: false, entityIds: [] } : {}) }
                    : role
            )
        );
    };

    const updateGeneralRoleConfig = (roleId, value, optionLength) => {
        const hasAll = value.length === optionLength;
        setGeneralRoles((prev) =>
            prev.map((role) =>
                role.id === roleId
                    ? { ...role, isAll: hasAll, entityIds: hasAll ? [] : (value || []).map((v) => v.id) }
                    : role
            )
        );
    };

    const handleSave = () => {
        if (!selectedTemplate) return;

        // Send every form explicitly, including ones with zero actions checked, so the
        // backend can clear previously-granted rights rather than only insert checked ones.
        const payload = permissions.flatMap((module) =>
            module.forms.map((form) => ({
                applicationFormId: form.formId,
                actionIds: form.actions.filter((a) => a.isSelected).map((a) => a.actionId),
            }))
        );
        const roleTemplateId = isUserRole ? 0 : selectedTemplate.id

        const generalAccessPayload = generalRoles
            .filter((r) => r.access)
            .map((r) => ({
                generalRoleId: r.id, isAll: r.isAll,
                generalRoleTemplateId: r?.generalRoleTemplateId,
                roleTemplateMasterId: r?.roleTemplateMasterId,
                mappings: r.entityIds.map((e) => ({
                    generalRoleTemplateId: 0,
                    roleTemplateMasterId: roleTemplateId,
                    entityId: e
                }))
            }));


        const url = isUserRole ? `${DEFAULT_API}/userRole` : DEFAULT_API

        updateEntity({
            url: `${url}/${selectedTemplate.id}`, data: {
                roleTemplateMasterId: roleTemplateId,
                permissions: payload,
                generalAccess: generalAccessPayload,
            }
        });
    };


    return (
        <Box>

            <ApplyTemplate openPopup={openPopup} setOpenPopup={setOpenPopup} refetch={refetch} employeeId={selectedTemplate?.id} />

            <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
                {isUserRole ?
                    <>
                        <Controls.MultiSelect
                            options={employees}
                            dataId="id"
                            sx={{ width: 320 }}
                            dataName="fullName"
                            name="employeeId"
                            onChange={(e) => setSelectedTemplate(e.target.value)}
                        />
                        {selectedTemplate && <Chip
                            icon={<FormIcon sx={{ fontSize: 14 }} />}
                            label='Apply Template'
                            size="small"
                            sx={{ cursor: "pointer" }}
                            onClick={() => setOpenPopup(true)}
                        />}
                    </> : <Controls.MultiSelect
                        options={templates}
                        sx={{ width: 320 }}
                        name="roleTemplateMasterId"
                        dataId="id"
                        dataName="name"
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                    />

                }

                {selectedTemplate && !isUserRole && (
                    <Chip
                        icon={
                            selectedTemplate?.isLock
                                ? <LockIcon sx={{ fontSize: 14 }} />
                                : <LockOpenIcon sx={{ fontSize: 14 }} />
                        }
                        label={selectedTemplate?.isLock ? "Locked" : "Active"}
                        size="small"
                        sx={{
                            backgroundColor: selectedTemplate?.isLock ? "#fdecea" : "#e6f4ea",
                            color: selectedTemplate?.isLock ? "error.main" : "success.main",
                            fontWeight: 700,
                            fontSize: 11.5,
                        }}
                    />
                )}

                <Box sx={{ flex: 1 }} />

                <Button
                    variant="contained"
                    size="small"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={!selectedTemplate || !permissions?.length}
                    sx={{ borderRadius: 1.2, textTransform: "none", fontSize: 12, fontWeight: 600, px: 1.8 }}
                >
                    Save Changes
                </Button>

            </Stack>


            {(!selectedTemplate || !permissions?.length) && (
                <Paper
                    elevation={0}
                    sx={{
                        border: "1px dashed",
                        borderColor: "divider",
                        borderRadius: 1.5,
                        py: 8,
                        textAlign: "center",
                        color: "text.secondary",
                        fontSize: 13,
                    }}
                >
                    Select a {isUserRole ? 'user' : 'role template'}  above to view and edit its rights
                </Paper>
            )}


            {selectedTemplate && permissions.length > 0 && (
                <>

                    {/* =================================================
                        STAT CARDS
                    ================================================= */}

                    <Stack direction="row" spacing={2} mb={2}>
                        <StatCard
                            icon={<ModuleIcon sx={{ fontSize: 20 }} />}
                            iconBg="#e8f0fe"
                            iconColor="primary.main"
                            label="Modules"
                            value={stats.totalModules}
                        />
                        <StatCard
                            icon={<FormIcon sx={{ fontSize: 20 }} />}
                            iconBg="#fdecea"
                            iconColor="error.main"
                            label="Forms"
                            value={stats.totalForms}
                        />
                        <StatCard
                            icon={<RightsIcon sx={{ fontSize: 20 }} />}
                            iconBg="#e6f4ea"
                            iconColor="success.main"
                            label="Rights Granted"
                            value={stats.rightsGranted}
                        />
                    </Stack>


                    {/* =================================================
                        MATRIX TABLE — Form Rights modules, then General
                        Access as one more accordion section, same table.
                    ================================================= */}

                    <TableContainer
                        component={Paper}
                        elevation={0}
                        sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1.5, overflow: "hidden" }}
                    >
                        <Table size="small" sx={{ tableLayout: "fixed", width: "100%" }}>

                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#fafafa" }}>
                                    <TableCell sx={{ width: 42, py: 0.65, px: 1 }} />
                                    <TableCell sx={{ py: 0.65, px: 1, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "text.secondary" }}>
                                        Module / Form
                                    </TableCell>

                                    {actions.map((action) => (
                                        <TableCell
                                            key={action.actionId}
                                            align="center"
                                            sx={{ width: 100, py: 0.65, px: 0.5, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "text.secondary" }}
                                        >
                                            {action.actionName}
                                        </TableCell>
                                    ))}

                                    <TableCell align="center" sx={{ width: 80, py: 0.65, px: 0.5, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "text.secondary" }}>
                                        All
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>

                                {loading && (
                                    <TableRow>
                                        <TableCell colSpan={actions.length + 3} align="center" sx={{ py: 5, color: "text.secondary", fontSize: 13 }}>
                                            Loading rights...
                                        </TableCell>
                                    </TableRow>
                                )}

                                {!loading && permissions.map((module) => {
                                    const isExpanded = expandedModules[module.moduleId] ?? true;

                                    const moduleAllSelected =
                                        module.forms.length > 0 &&
                                        module.forms.every(
                                            (form) => form.actions.length > 0 && form.actions.every((a) => a.isSelected)
                                        );

                                    const moduleSomeSelected = module.forms.some((form) =>
                                        form.actions.some((a) => a.isSelected)
                                    );

                                    return (
                                        <React.Fragment key={module.moduleId}>

                                            {/* MODULE ROW */}
                                            <TableRow
                                                sx={{
                                                    backgroundColor: "#fafafa",
                                                    "& > td": { borderBottom: "1px solid", borderColor: "divider" },
                                                    "&:hover": { backgroundColor: "#f7f7f7" },
                                                }}
                                            >
                                                <TableCell sx={{ width: 42, py: 0.6, px: 1 }}>
                                                    <IconButton size="small" onClick={() => toggleModule(module.moduleId)} sx={{ p: 0.3 }}>
                                                        {isExpanded
                                                            ? <KeyboardArrowUpIcon sx={{ fontSize: 18 }} />
                                                            : <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />}
                                                    </IconButton>
                                                </TableCell>

                                                <TableCell sx={{ py: 0.6, px: 1 }}>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Box sx={{ width: 4, height: 26, borderRadius: 1, backgroundColor: "primary.main" }} />
                                                        <Box>
                                                            <Typography sx={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.2, textTransform: "uppercase", letterSpacing: 0.4 }}>
                                                                {module.moduleName}
                                                            </Typography>
                                                            <Typography sx={{ fontSize: 10.5, color: "text.secondary", lineHeight: 1.2, mt: 0.2 }}>
                                                                {module.forms.length} Forms
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </TableCell>

                                                {actions.map((action) => (
                                                    <TableCell key={action.actionId} sx={{ width: 100, py: 0.6, px: 0.5 }} />
                                                ))}

                                                <TableCell align="center" sx={{ width: 80, py: 0.6, px: 0.5 }}>
                                                    <Checkbox
                                                        size="small"
                                                        checked={moduleAllSelected}
                                                        indeterminate={!moduleAllSelected && moduleSomeSelected}
                                                        onChange={(e) => toggleAllModuleActions(module.moduleId, e.target.checked)}
                                                        sx={{ p: 0.4 }}
                                                    />
                                                </TableCell>
                                            </TableRow>

                                            {/* FORM ROWS */}
                                            {isExpanded && module.forms.map((form) => {
                                                const formAllSelected =
                                                    form.actions.length > 0 && form.actions.every((a) => a.isSelected);
                                                const formSomeSelected = form.actions.some((a) => a.isSelected);

                                                return (
                                                    <TableRow
                                                        hover
                                                        key={form.formId}
                                                        sx={{
                                                            "& > td": { borderBottom: "1px solid", borderColor: "divider" },
                                                            "&:hover": { backgroundColor: "#fafafa" },
                                                        }}
                                                    >
                                                        <TableCell sx={{ width: 42, py: 0.35, px: 1 }} />

                                                        <TableCell sx={{ py: 0.35, px: 1, pl: 5.5 }}>
                                                            <Typography sx={{ fontSize: 12.5, lineHeight: 1.3 }}>
                                                                {form.formName}
                                                            </Typography>
                                                        </TableCell>

                                                        {actions.map((action) => {
                                                            const currentAction = form.actions.find(
                                                                (item) => item.actionId === action.actionId
                                                            );
                                                            // Form doesn't expose this action — dash, so it reads as
                                                            // "not applicable" rather than a silently-unchecked box.
                                                            if (!currentAction) {
                                                                return (
                                                                    <TableCell key={action.actionId} align="center" sx={{ width: 100, py: 0.35, px: 0.5, color: "text.disabled", fontSize: 12 }}>
                                                                        –
                                                                    </TableCell>
                                                                );
                                                            }
                                                            return (
                                                                <TableCell key={action.actionId} align="center" sx={{ width: 100, py: 0.35, px: 0.5 }}>
                                                                    <Checkbox
                                                                        size="small"
                                                                        checked={currentAction.isSelected ?? false}
                                                                        onChange={() => toggleAction(module.moduleId, form.formId, action.actionId)}
                                                                        sx={{ p: 0.35 }}
                                                                    />
                                                                </TableCell>
                                                            );
                                                        })}

                                                        <TableCell align="center" sx={{ width: 80, py: 0.35, px: 0.5 }}>
                                                            <Checkbox
                                                                size="small"
                                                                checked={formAllSelected}
                                                                indeterminate={!formAllSelected && formSomeSelected}
                                                                onChange={(e) => toggleAllFormActions(module.moduleId, form.formId, e.target.checked)}
                                                                sx={{ p: 0.35 }}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}

                                        </React.Fragment>
                                    );
                                })}


                                {/* =================================================
                                    GENERAL ACCESS — same accordion pattern as a
                                    module above, appended as the last section.
                                ================================================= */}

                                {!loading && (() => {
                                    const isGeneralAccessExpanded = expandedModules[GENERAL_ACCESS_KEY] ?? true;
                                    const grantedCount = generalRoles.filter((r) => r.access).length;

                                    return (
                                        <React.Fragment key={GENERAL_ACCESS_KEY}>

                                            {/* SECTION HEADER — same look as a module row */}
                                            <TableRow
                                                sx={{
                                                    backgroundColor: "#fafafa",
                                                    "& > td": { borderBottom: "1px solid", borderColor: "divider" },
                                                    "&:hover": { backgroundColor: "#f7f7f7" },
                                                }}
                                            >
                                                <TableCell sx={{ width: 42, py: 0.6, px: 1 }}>
                                                    <IconButton size="small" onClick={() => toggleModule(GENERAL_ACCESS_KEY)} sx={{ p: 0.3 }}>
                                                        {isGeneralAccessExpanded
                                                            ? <KeyboardArrowUpIcon sx={{ fontSize: 18 }} />
                                                            : <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />}
                                                    </IconButton>
                                                </TableCell>

                                                <TableCell sx={{ py: 0.6, px: 1 }}>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Box sx={{ width: 4, height: 26, borderRadius: 1, backgroundColor: "primary.main" }} />
                                                        <Box>
                                                            <Typography sx={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.2, textTransform: "uppercase", letterSpacing: 0.4 }}>
                                                                General Access
                                                            </Typography>
                                                            <Typography sx={{ fontSize: 10.5, color: "text.secondary", lineHeight: 1.2, mt: 0.2 }}>
                                                                {grantedCount} Enabled
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </TableCell>

                                                <TableCell colSpan={actions.length + 1} sx={{ py: 0.6, px: 0.5 }} />
                                            </TableRow>

                                            {/* ROLE ROWS */}
                                            {isGeneralAccessExpanded && generalRoles.map((role) => {
                                                const entityList = entityListByCode[role.code];

                                                return (
                                                    <TableRow
                                                        hover
                                                        key={role.id}
                                                        sx={{
                                                            "& > td": { borderBottom: "1px solid", borderColor: "divider" },
                                                            "&:hover": { backgroundColor: "#fafafa" },
                                                        }}
                                                    >
                                                        <TableCell sx={{ width: 42, py: 0.5, px: 1 }} />

                                                        <TableCell sx={{ py: 0.5, px: 1, pl: 5.5 }}>
                                                            <Typography sx={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.3 }}>
                                                                {role.name}
                                                            </Typography>
                                                            <Typography sx={{ fontSize: 10.5, color: "text.secondary", lineHeight: 1.3 }}>
                                                                {role.description}
                                                            </Typography>
                                                        </TableCell>

                                                        {/* Configuration — spans the action columns, only shown once
                                                            the role is enabled and it has a reference list (Self /
                                                            Subordinates don't — checkbox alone is their full state) */}
                                                        <TableCell colSpan={actions.length} sx={{ py: 0.5, px: 1 }}>
                                                            {role.access && entityList && (
                                                                <Controls.MultiSelect
                                                                    isMultiple={true}
                                                                    options={entityList.options}
                                                                    dataId="id"
                                                                    sx={{ maxWidth: 250 }}
                                                                    dataName={entityList.dataName}
                                                                    value={
                                                                        role.isAll
                                                                            ? entityList.options
                                                                            : entityList.options.filter((o) => role.entityIds.includes(o.id))
                                                                    }
                                                                    onChange={(e) => updateGeneralRoleConfig(role.id, e.target.value, entityList.options.length)}
                                                                />
                                                            )}
                                                        </TableCell>

                                                        <TableCell align="center" sx={{ width: 80, py: 0.5, px: 0.5 }}>
                                                            <Checkbox
                                                                size="small"
                                                                checked={role.access}
                                                                onChange={() => toggleGeneralRole(role.id)}
                                                                sx={{ p: 0.4 }}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}

                                        </React.Fragment>
                                    );
                                })()}

                            </TableBody>

                        </Table>
                    </TableContainer>

                </>
            )}

        </Box>
    );
};

export default RoleRights;