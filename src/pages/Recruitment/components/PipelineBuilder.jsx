// ════════════════════════════════════════════════════════════════════
// PipelineTemplateBuilder.jsx — Pipeline Template Designer (React + MUI)
// ════════════════════════════════════════════════════════════════════
// Pattern follows existing HCMS components (JobPost.jsx, AdvanceSalary.jsx)
//
// Props:
//   values           { name, fkDepartmentId, isDefault }
//   setValues        setter
//   stages           IPipelineStage[]
//   setStages        setter
//   errors           { [stageIndex]: string }
//   setErrors        setter
//   handleInputChange  (e) => void
//
// API endpoints expected:
//   GET    /pipelinetemplate/get     → list of templates (populate department)
//   POST   /pipelinetemplate         → create  { name, fkDepartmentId, isDefault, stages }
//   PUT    /pipelinetemplate/:id     → update  same payload
// ════════════════════════════════════════════════════════════════════

import React, { useRef, useState } from "react";
import {
    Box,
    Stack,
    Typography,
    TextField,
    Select,
    MenuItem,
    Button,
    IconButton,
    Chip,
    FormControl,
    FormControlLabel,
    Switch,
    Tooltip,
    ToggleButton,
    ToggleButtonGroup,
} from "../../../deps/ui";
import {
    Add,
    Close,
    DragIndicator,
    Person,
    AutoAwesome,
    Lock,
} from "../../../deps/ui/icons";
import Controls from "../../../components/controls/Controls";
import { useDropDown } from "../../../components/useDropDown";
import { useAppSelector } from "../../../store/storehook";
import { STAGE_COLORS, emptyStage } from "./constants";

// ════════════════════════════════════════════════════════════════════
// Locked stage names — always first two, cannot be removed/renamed/reordered
// ════════════════════════════════════════════════════════════════════
const LOCKED_STAGES = [
    { name: 'Applied',   type: 'Auto', minScore: 0  },
    { name: 'Screening', type: 'Auto', minScore: 70 },
];

// ════════════════════════════════════════════════════════════════════
// Drop placeholder line
// ════════════════════════════════════════════════════════════════════
const DropLine = ({ color }) => (
    <Box
        sx={{
            height: 3,
            borderRadius: 2,
            bgcolor: color?.mid || 'info.main',
            animation: 'pulse 1s ease-in-out infinite',
            '@keyframes pulse': {
                '0%, 100%': { opacity: 0.5 },
                '50%': { opacity: 1 },
            },
        }}
    />
);

// ════════════════════════════════════════════════════════════════════
// Stage Row
// ════════════════════════════════════════════════════════════════════
const StageRow = ({ stage, index, colorIdx, isDragging, onChange, onRemove, onDragStart, onDragEnd, Employees, error }) => {
    const color = STAGE_COLORS[colorIdx % STAGE_COLORS.length];
    const isLocked = !!stage.isLocked;

    return (
        <Box
            draggable={!isLocked}
            data-stage-index={index}
            onDragStart={!isLocked ? (e) => onDragStart(e, index) : undefined}
            onDragEnd={!isLocked ? onDragEnd : undefined}
            sx={{
                bgcolor: isLocked ? 'action.hover' : 'background.default',
                border: '1px solid',
                borderColor: error ? 'error.main' : isLocked ? 'divider' : 'divider',
                borderRadius: 2,
                p: 1.25,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                cursor: isLocked ? 'default' : 'grab',
                opacity: isDragging ? 0.35 : 1,
                transform: isDragging ? 'scale(0.98)' : 'scale(1)',
                transition: 'opacity 0.15s ease, transform 0.15s ease',
                '&:active': { cursor: isLocked ? 'default' : 'grabbing' },
            }}
        >
            <Stack direction="row" alignItems="center" spacing={1}>

                {/* Drag handle or Lock icon */}
                {isLocked ? (
                    <Tooltip title="Required stage — cannot be removed or reordered" placement="top">
                        <Lock fontSize="small" sx={{ color: 'text.disabled', flexShrink: 0 }} />
                    </Tooltip>
                ) : (
                    <DragIndicator fontSize="small" sx={{ color: 'text.disabled', flexShrink: 0 }} />
                )}

                {/* Color dot */}
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color.mid, flexShrink: 0 }} />

                {/* Stage name — readonly if locked */}
                {isLocked ? (
                    <Typography
                        variant="body2"
                        fontWeight={500}
                        sx={{ flex: 1, fontSize: 13, color: 'text.primary' }}
                    >
                        {stage.name}
                    </Typography>
                ) : (
                    <Controls.Input
                        variant="standard"
                        placeholder="Stage name"
                        value={stage.name}
                        onChange={(e) => onChange(index, { ...stage, name: e.target.value })}
                        InputProps={{ disableUnderline: true }}
                        sx={{ flex: 1, '& input': { fontSize: 13, fontWeight: 500 } }}
                    />
                )}

                {/* Type toggle — disabled if locked */}
                <ToggleButtonGroup
                    size="small"
                    exclusive
                    value={stage.type}
                    onChange={(e, val) => {
                        if (!val || isLocked) return;
                        onChange(index, {
                            ...stage,
                            type: val,
                            minScore: val === 'Manual' ? 0 : stage.minScore,
                        });
                    }}
                >
                    <ToggleButton
                        value="Manual"
                        disabled={isLocked}
                        sx={{ fontSize: 11, py: 0.25, px: 1.5 }}
                    >
                        Manual
                    </ToggleButton>
                    <ToggleButton
                        value="Auto"
                        disabled={isLocked}
                        sx={{ fontSize: 11, py: 0.25, px: 1.5 }}
                    >
                        <AutoAwesome sx={{ fontSize: 12, mr: 0.5 }} /> Auto
                    </ToggleButton>
                </ToggleButtonGroup>

                {/* Delete — hidden if locked */}
                {isLocked ? (
                    <Box sx={{ width: 34 }} /> // spacer to keep alignment
                ) : (
                    <IconButton size="small" onClick={() => onRemove(index)}>
                        <Close fontSize="small" />
                    </IconButton>
                )}
            </Stack>

            {/* Second row: minScore + assignee */}
            <Stack direction="row" alignItems="center" spacing={2} pl={4.5} flexWrap="wrap">

                {/* minScore — always visible for Auto stages (locked or not) */}
                <Box sx={{ visibility: stage.type === 'Auto' ? 'visible' : 'hidden', display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <TextField
                        type="number"
                        size="small"
                        value={stage.minScore}
                        onChange={(e) => onChange(index, { ...stage, minScore: Math.max(0, Math.min(100, +e.target.value)) })}
                        inputProps={{ min: 0, max: 100, style: { textAlign: 'center', width: 40, padding: '4px 6px' } }}
                    />
                    <Typography variant="caption" color="text.secondary">% min score to auto-move</Typography>
                </Box>

                {/* Default assignee — available for all stages */}
                <Stack direction="row" alignItems="center" spacing={0.75}>
                    <Person fontSize="small" sx={{ color: 'text.disabled', fontSize: 16 }} />
                    <FormControl size="small" sx={{ minWidth: 180 }}>
                        <Select
                            displayEmpty
                            value={stage.fkDefaultAssigneeId || ''}
                            onChange={(e) => onChange(index, { ...stage, fkDefaultAssigneeId: e.target.value || null })}
                            sx={{ fontSize: 12, '& .MuiSelect-select': { py: 0.5 } }}
                        >
                            <MenuItem value=""><em>Unassigned</em></MenuItem>
                            {Employees?.map((emp) => (
                                <MenuItem key={emp._id} value={emp._id} sx={{ fontSize: 12 }}>
                                    {emp.fullName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Typography variant="caption" color="text.secondary">default interviewer</Typography>
                </Stack>
            </Stack>

            {error && (
                <Typography variant="caption" color="error.main" pl={4.5}>{error}</Typography>
            )}
        </Box>
    );
};

// ════════════════════════════════════════════════════════════════════
// Pipeline Preview Strip
// ════════════════════════════════════════════════════════════════════
const PipelinePreview = ({ stages }) => (
    <Stack direction="row" spacing={0.75} flexWrap="wrap" alignItems="center" useFlexGap>
        {stages.map((s, i) => {
            const color = STAGE_COLORS[i % STAGE_COLORS.length];
            let label = s.name || 'Untitled';
            if (s.type === 'Auto' && s.minScore > 0) label += ` (${s.minScore}%+)`;
            else if (s.type === 'Auto') label += ' (auto)';
            return (
                <React.Fragment key={i}>
                    <Chip
                        size="small"
                        label={label}
                        icon={s.isLocked ? <Lock sx={{ fontSize: 11 }} /> : undefined}
                        sx={{ bgcolor: color.bg, color: color.text, fontWeight: 500, fontSize: 11 }}
                    />
                    {i < stages.length - 1 && (
                        <Typography color="text.disabled" fontSize={13}>→</Typography>
                    )}
                </React.Fragment>
            );
        })}
    </Stack>
);

// ════════════════════════════════════════════════════════════════════
// Main Builder
// ════════════════════════════════════════════════════════════════════
const PipelineTemplateBuilder = ({ values, setValues, stages, setStages, errors, setErrors, handleInputChange }) => {

    // ── Drag state ───────────────────────────────────────────────────────
    const [draggedIdx, setDraggedIdx] = useState(null);
    const [dropIndex, setDropIndex]   = useState(null);
    const dragIdxRef = useRef(null);

    const { departments }  = useDropDown();
    const { Employees }    = useAppSelector(e => e.appdata.employeeData);

    // ── Stage operations ─────────────────────────────────────────────────
    const handleStageChange = (index, updated) => {
        setStages(prev => prev.map((s, i) => i === index ? updated : s));
        setErrors(prev => ({ ...prev, [index]: undefined }));
    };

    const handleAddStage = () => {
        // Only add after locked stages — locked ones are always at the top
        setStages(prev => [...prev, emptyStage(prev.length + 1, prev.length)]);
    };

    const handleRemoveStage = (index) => {
        // Guard: never remove locked stages
        if (stages[index]?.isLocked) return;
        // Must keep at least 1 non-locked stage
        const nonLocked = stages.filter(s => !s.isLocked);
        if (nonLocked.length <= 1) return;
        setStages(prev => prev.filter((_, i) => i !== index));
        setErrors({});
    };

    // ── Drag to reorder (locked stages excluded from drag zone) ───────────
    const handleDragStart = (e, index) => {
        if (stages[index]?.isLocked) return;
        dragIdxRef.current = index;
        setDraggedIdx(index);
    };

    const handleDragEnd = () => {
        setDraggedIdx(null);
        setDropIndex(null);
        dragIdxRef.current = null;
    };

    const handleListDragOver = (e) => {
        e.preventDefault();
        const listEl = e.currentTarget;

        // Only consider non-locked rows for drop target calculation
        const rowEls = [...listEl.querySelectorAll('[data-stage-index]')]
            .filter(el => {
                const i = +el.getAttribute('data-stage-index');
                return !stages[i]?.isLocked && i !== draggedIdx;
            });

        const mouseY = e.clientY;
        const lockedCount = stages.filter(s => s.isLocked).length;

        let newIndex = stages.length;
        for (let i = 0; i < rowEls.length; i++) {
            const rect = rowEls[i].getBoundingClientRect();
            if (mouseY < rect.top + rect.height / 2) {
                // Offset by locked count so index maps to actual stages array position
                newIndex = lockedCount + i;
                break;
            }
        }
        // Never drop before locked stages
        if (newIndex < lockedCount) newIndex = lockedCount;
        setDropIndex(newIndex);
    };

    const handleListDrop = (e) => {
        e.preventDefault();
        const from = dragIdxRef.current;
        const to   = dropIndex;
        setDropIndex(null);
        setDraggedIdx(null);
        dragIdxRef.current = null;

        if (from === null || to === null) return;

        setStages(prev => {
            const next = [...prev];
            const [moved] = next.splice(from, 1);
            const adjustedTo = from < to ? to - 1 : to;
            next.splice(adjustedTo, 0, moved);
            return next;
        });
    };

    return (
        <Box sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>

            {/* ── Template meta ─────────────────────────────────────────────── */}
            <Stack direction="row" spacing={2} mb={2} >
                <Controls.Input
                    label="Template name"
                    size="small"
                    value={values.name}
                    name="name"
                    onChange={handleInputChange}
                    error={!values.name?.trim() && Object.keys(errors).length > 0}
                />
                <Controls.Select
                    options={departments}
                    error={!values.fkDepartmentId && Object.keys(errors).length > 0}
                    label="Department"
                    size="small"
                    value={values.fkDepartmentId}
                    onChange={handleInputChange}
                    name="fkDepartmentId"
                    dataId="_id"
                    dataName="departmentName"
                    isNone={false}
                />
                <FormControlLabel
                    sx={{ whiteSpace: 'nowrap' }}
                    control={
                        <Switch
                            size="small"
                            name="isDefault"
                            checked={values.isDefault}
                            onChange={(e) => handleInputChange({ target: { name: 'isDefault', value: e.target.checked } })}
                        />
                    }
                    label="Default for department"
                />
            </Stack>

            <Box sx={{ borderTop: '1px solid', borderColor: 'divider', my: 2 }} />

            {/* ── Stages ───────────────────────────────────────────────────── */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2" fontWeight={500}>Stages</Typography>
                    <Chip
                        size="small"
                        icon={<Lock sx={{ fontSize: 11 }} />}
                        label="Applied & Screening are required"
                        sx={{ height: 18, fontSize: 10 }}
                        variant="outlined"
                    />
                </Stack>
                <Typography variant="caption" color="text.disabled">drag to reorder</Typography>
            </Stack>

            <Stack
                spacing={1}
                mb={1.5}
                onDragOver={handleListDragOver}
                onDrop={handleListDrop}
            >
                {stages.map((stage, index) => (
                    <React.Fragment key={index}>
                        {/* Drop line only shows for non-locked positions */}
                        {dropIndex === index && !stage.isLocked && (
                            <DropLine color={STAGE_COLORS[index % STAGE_COLORS.length]} />
                        )}
                        <StageRow
                            stage={stage}
                            index={index}
                            colorIdx={index}
                            isDragging={draggedIdx === index}
                            onChange={handleStageChange}
                            onRemove={handleRemoveStage}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            Employees={Employees}
                            error={errors[index]}
                        />
                    </React.Fragment>
                ))}
                {dropIndex === stages.length && (
                    <DropLine color={STAGE_COLORS[stages.length % STAGE_COLORS.length]} />
                )}
            </Stack>

            <Button
                fullWidth
                variant="outlined"
                startIcon={<Add />}
                onClick={handleAddStage}
                sx={{ borderStyle: 'dashed' }}
            >
                Add stage
            </Button>

            <Box sx={{ borderTop: '1px solid', borderColor: 'divider', my: 2 }} />

            {/* ── Preview ───────────────────────────────────────────────────── */}
            <Typography variant="body2" fontWeight={500} mb={1}>Pipeline preview</Typography>
            <PipelinePreview stages={stages} />

        </Box>
    );
};

export default PipelineTemplateBuilder;