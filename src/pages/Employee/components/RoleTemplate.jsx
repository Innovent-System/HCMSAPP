import React, { useEffect, useMemo, useState } from "react";

import {
    Box,
    Button,
    Checkbox,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@/deps/ui";

import {
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
    Save as SaveIcon,
} from "@/deps/ui/icons";
import Controls from "@/components/controls/Controls";
import { useAppSelector } from "@/store/storehook";
import { useDropDown } from "@/components/useDropDown";
import { useEntityByIdQuery } from "@/store/actions/httpactions";
import { API } from "../_Service";


const DEFAULT_API = API.RoleTemplate;
const UserFormRights = () => {
    const [permissions, setPermissions] = useState([]);
    const [expandedModules, setExpandedModules] = useState({});
    const { roleTemplates } = useDropDown();
    const [templateId, setTemplateId] = useState(null);

    const { data } = useEntityByIdQuery({
        url: DEFAULT_API,
        id: templateId
    }, { selectFromResult: ({ data, isFetching }) => ({ data: data?.result, isFetching }) });

    useEffect(() => {
        if (!data) return;
        setPermissions([...data]);
        const expanded = data.reduce((acc, module) => {
            acc[module.moduleId] = true;
            return acc;
        }, {});

        setExpandedModules(expanded);
    }, [data]);

    const actions = useMemo(() => {
        const firstForm = permissions
            .flatMap((module) => module.forms ?? [])
            .find((form) => form.actions?.length > 0);

        return firstForm?.actions ?? [];
    }, [permissions]);


    const toggleModule = (moduleId) => {
        setExpandedModules((prev) => ({
            ...prev,
            [moduleId]: !prev[moduleId],
        }));
    };

    // ---------------------------------------------------------
    // TOGGLE SINGLE ACTION
    // ---------------------------------------------------------

    const toggleAction = (moduleId, formId, actionId) => {
        setPermissions((prev) =>
            prev.map((module) => {
                if (module.moduleId !== moduleId) {
                    return module;
                }

                return {
                    ...module,

                    forms: module.forms.map((form) => {
                        if (form.formId !== formId) {
                            return form;
                        }

                        return {
                            ...form,

                            actions: form.actions.map(
                                (action) =>
                                    action.actionId === actionId
                                        ? {
                                            ...action,
                                            isSelected:
                                                !action.isSelected,
                                        }
                                        : action
                            ),
                        };
                    }),
                };
            })
        );
    };


    // ---------------------------------------------------------
    // TOGGLE ALL ACTIONS OF FORM
    // ---------------------------------------------------------

    const toggleAllFormActions = (moduleId, formId, checked) => {
        setPermissions((prev) =>
            prev.map((module) => {
                if (module.moduleId !== moduleId) {
                    return module;
                }

                return {
                    ...module,

                    forms: module.forms.map((form) => {
                        if (form.formId !== formId) {
                            return form;
                        }

                        return {
                            ...form,

                            actions: form.actions.map(
                                (action) => ({
                                    ...action,
                                    isSelected: checked,
                                })
                            ),
                        };
                    }),
                };
            })
        );
    };


    // ---------------------------------------------------------
    // TOGGLE ALL ACTIONS OF MODULE
    // ---------------------------------------------------------

    const toggleAllModuleActions = (moduleId, checked) => {
        setPermissions((prev) =>
            prev.map((module) => {
                if (module.moduleId !== moduleId) {
                    return module;
                }

                return {
                    ...module,

                    forms: module.forms.map((form) => ({
                        ...form,

                        actions: form.actions.map(
                            (action) => ({
                                ...action,
                                isSelected: checked,
                            })
                        ),
                    })),
                };
            })
        );
    };


    // ---------------------------------------------------------
    // SAVE
    // ---------------------------------------------------------

    const handleSave = () => {
        const payload = permissions.flatMap(
            (module) =>
                module.forms
                    .map((form) => ({
                        applicationFormId: form.formId,

                        actionIds: form.actions
                            .filter(
                                (action) =>
                                    action.isSelected
                            )
                            .map(
                                (action) =>
                                    action.actionId
                            ),
                    }))
                    .filter(
                        (form) =>
                            form.actionIds.length > 0
                    )
        );

        onSave(payload);
    }

    return (
        <Box>

            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                <Box width={300}>
                    <Controls.Select
                        options={roleTemplates}
                        label='Role Template'
                        fullWidth={true}
                        onChange={(e) => setTemplateId(e.target.value)}
                        name='roleTemplateId'
                        dataId='id'
                        dataName="name"
                        isNone={false}
                    />
                </Box>

                <Button
                    variant="contained"
                    size="small"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    sx={{
                        borderRadius: 1.2,
                        textTransform: "none",
                        fontSize: 12,
                        fontWeight: 600,
                        px: 1.8,
                    }}
                >
                    Save Changes
                </Button>
            </Stack>

            <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1.5,
                    overflow: "hidden",
                }}
            >

                <Table
                    size="small"
                    sx={{
                        tableLayout: "fixed",
                        width: "100%",
                    }}
                >

                    <TableHead>
                        <TableRow
                            sx={{
                                backgroundColor:
                                    "#fafafa",
                            }}
                        >
                            <TableCell
                                sx={{
                                    width: 42,
                                    py: 0.65,
                                    px: 1,
                                }}
                            />

                            <TableCell
                                sx={{
                                    py: 0.65,
                                    px: 1,
                                    fontSize: 11,
                                    fontWeight: 600,
                                    textTransform:
                                        "uppercase",
                                    letterSpacing: 0.5,
                                    color:
                                        "text.secondary",
                                }}
                            >
                                Module / Form
                            </TableCell>

                            {actions.map((action) => (
                                <TableCell
                                    key={
                                        action.actionId
                                    }
                                    align="center"
                                    sx={{
                                        width: 100,
                                        py: 0.65,
                                        px: 0.5,
                                        fontSize: 11,
                                        fontWeight: 600,
                                        textTransform:
                                            "uppercase",
                                        letterSpacing: 0.5,
                                        color:
                                            "text.secondary",
                                    }}
                                >
                                    {
                                        action.actionName
                                    }
                                </TableCell>
                            ))}

                            <TableCell
                                align="center"
                                sx={{
                                    width: 80,
                                    py: 0.65,
                                    px: 0.5,
                                    fontSize: 11,
                                    fontWeight: 600,
                                    textTransform:
                                        "uppercase",
                                    letterSpacing: 0.5,
                                    color:
                                        "text.secondary",
                                }}
                            >
                                All
                            </TableCell>

                        </TableRow>
                    </TableHead>

                    <TableBody>

                        {permissions.map((module) => {

                            const isExpanded =
                                expandedModules[
                                module.moduleId
                                ] ?? true;

                            const moduleAllSelected =
                                module.forms.length > 0 &&
                                module.forms.every(
                                    (form) =>
                                        form.actions.length >
                                        0 &&
                                        form.actions.every(
                                            (action) =>
                                                action.isSelected
                                        )
                                );


                            const moduleSomeSelected =
                                module.forms.some(
                                    (form) =>
                                        form.actions.some(
                                            (action) =>
                                                action.isSelected
                                        )
                                );


                            return (
                                <React.Fragment
                                    key={
                                        module.moduleId
                                    }
                                >

                                    <TableRow
                                        sx={{
                                            backgroundColor:
                                                "#fafafa",

                                            "& > td": {
                                                borderBottom:
                                                    "1px solid",
                                                borderColor:
                                                    "divider",
                                            },

                                            "&:hover": {
                                                backgroundColor:
                                                    "#f7f7f7",
                                            },
                                        }}
                                    >

                                        <TableCell
                                            sx={{
                                                width: 42,
                                                py: 0.6,
                                                px: 1,
                                            }}
                                        >
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    toggleModule(
                                                        module.moduleId
                                                    )
                                                }
                                                sx={{
                                                    p: 0.3,
                                                }}
                                            >
                                                {isExpanded ? (
                                                    <KeyboardArrowUpIcon
                                                        sx={{
                                                            fontSize: 18,
                                                        }}
                                                    />
                                                ) : (
                                                    <KeyboardArrowDownIcon
                                                        sx={{
                                                            fontSize: 18,
                                                        }}
                                                    />
                                                )}
                                            </IconButton>
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                py: 0.6,
                                                px: 1,
                                            }}
                                        >
                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                alignItems="center"
                                            >

                                                <Box
                                                    sx={{
                                                        width: 4,
                                                        height: 26,
                                                        borderRadius: 1,
                                                        backgroundColor:
                                                            "primary.main",
                                                    }}
                                                />

                                                <Box>

                                                    <Typography
                                                        sx={{
                                                            fontSize: 12.5,
                                                            fontWeight: 600,
                                                            lineHeight: 1.2,
                                                            textTransform:
                                                                "uppercase",
                                                            letterSpacing:
                                                                0.4,
                                                        }}
                                                    >
                                                        {
                                                            module.moduleName
                                                        }
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            fontSize: 10.5,
                                                            color:
                                                                "text.secondary",
                                                            lineHeight:
                                                                1.2,
                                                            mt: 0.2,
                                                        }}
                                                    >
                                                        {
                                                            module
                                                                .forms
                                                                .length
                                                        }{" "}
                                                        Forms
                                                    </Typography>

                                                </Box>

                                            </Stack>
                                        </TableCell>

                                        {actions.map(
                                            (action) => (
                                                <TableCell
                                                    key={
                                                        action.actionId
                                                    }
                                                    sx={{
                                                        width: 100,
                                                        py: 0.6,
                                                        px: 0.5,
                                                    }}
                                                />
                                            )
                                        )}

                                        <TableCell
                                            align="center"
                                            sx={{
                                                width: 80,
                                                py: 0.6,
                                                px: 0.5,
                                            }}
                                        >
                                            <Checkbox
                                                size="small"
                                                checked={
                                                    moduleAllSelected
                                                }
                                                indeterminate={
                                                    !moduleAllSelected &&
                                                    moduleSomeSelected
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    toggleAllModuleActions(
                                                        module.moduleId,
                                                        e.target
                                                            .checked
                                                    )
                                                }
                                                sx={{
                                                    p: 0.4,
                                                }}
                                            />
                                        </TableCell>

                                    </TableRow>

                                    {isExpanded &&
                                        module.forms.map(
                                            (form) => {

                                                const formAllSelected =
                                                    form.actions.length >
                                                    0 &&
                                                    form.actions.every(
                                                        (
                                                            action
                                                        ) =>
                                                            action.isSelected
                                                    );


                                                const formSomeSelected =
                                                    form.actions.some(
                                                        (
                                                            action
                                                        ) =>
                                                            action.isSelected
                                                    );


                                                return (
                                                    <TableRow
                                                        hover
                                                        key={
                                                            form.formId
                                                        }
                                                        sx={{
                                                            "& > td":
                                                            {
                                                                borderBottom:
                                                                    "1px solid",
                                                                borderColor:
                                                                    "divider",
                                                            },

                                                            "&:hover":
                                                            {
                                                                backgroundColor:
                                                                    "#fafafa",
                                                            },
                                                        }}
                                                    >

                                                        <TableCell
                                                            sx={{
                                                                width: 42,
                                                                py: 0.35,
                                                                px: 1,
                                                            }}
                                                        />

                                                        <TableCell
                                                            sx={{
                                                                py: 0.35,
                                                                px: 1,
                                                                pl: 5.5,
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    fontSize: 12.5,
                                                                    lineHeight:
                                                                        1.3,
                                                                }}
                                                            >
                                                                {
                                                                    form.formName
                                                                }
                                                            </Typography>
                                                        </TableCell>

                                                        {actions.map(
                                                            (
                                                                action
                                                            ) => {

                                                                const currentAction =
                                                                    form.actions.find(
                                                                        (
                                                                            item
                                                                        ) =>
                                                                            item.actionId ===
                                                                            action.actionId
                                                                    );


                                                                return (
                                                                    <TableCell
                                                                        key={
                                                                            action.actionId
                                                                        }
                                                                        align="center"
                                                                        sx={{
                                                                            width: 100,
                                                                            py: 0.35,
                                                                            px: 0.5,
                                                                        }}
                                                                    >
                                                                        <Checkbox
                                                                            size="small"
                                                                            checked={
                                                                                currentAction?.isSelected ??
                                                                                false
                                                                            }
                                                                            onChange={() =>
                                                                                toggleAction(
                                                                                    module.moduleId,
                                                                                    form.formId,
                                                                                    action.actionId
                                                                                )
                                                                            }
                                                                            sx={{
                                                                                p: 0.35,
                                                                            }}
                                                                        />
                                                                    </TableCell>
                                                                );
                                                            }
                                                        )}

                                                        <TableCell
                                                            align="center"
                                                            sx={{
                                                                width: 80,
                                                                py: 0.35,
                                                                px: 0.5,
                                                            }}
                                                        >
                                                            <Checkbox
                                                                size="small"
                                                                checked={
                                                                    formAllSelected
                                                                }
                                                                indeterminate={
                                                                    !formAllSelected &&
                                                                    formSomeSelected
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) =>
                                                                    toggleAllFormActions(
                                                                        module.moduleId,
                                                                        form.formId,
                                                                        e
                                                                            .target
                                                                            .checked
                                                                    )
                                                                }
                                                                sx={{
                                                                    p: 0.35,
                                                                }}
                                                            />
                                                        </TableCell>

                                                    </TableRow>
                                                );
                                            }
                                        )}

                                </React.Fragment>
                            );
                        })}

                    </TableBody>

                </Table>

            </TableContainer>

        </Box>
    );
};


export default UserFormRights;