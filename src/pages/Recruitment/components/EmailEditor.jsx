// EmailDialog.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import QuillEditor from './QuillEditor';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Stack,
    Typography,
    TextField,
    Button,
    IconButton,
    FormControlLabel,
    Checkbox,
    Chip,
    Select,
    MenuItem,
    Tooltip,
    Autocomplete,
    Divider,
    Menu,
} from "../../../deps/ui";
import {
    Close,
    Add,
    Delete,
    ContentCopy,
    Visibility,
    Email as EmailIcon,
} from "../../../deps/ui/icons";
import { EMAIL_TRIGGERS, EMAIL_VARIABLES, emptyEmailConfig } from "./constants";

const VariableMenu = ({ onSelect }) => {
    const [anchor, setAnchor] = useState(null);

    return (
        <>
            <Button
                size="small"
                variant="outlined"
                startIcon={<Add fontSize="small" />}
                onClick={(e) => setAnchor(e.currentTarget)}
                sx={{ fontSize: 11, py: 0.25 }}
            >
                Variable
            </Button>
            <Menu
                anchorEl={anchor}
                open={Boolean(anchor)}
                onClose={() => setAnchor(null)}
                PaperProps={{ sx: { maxHeight: 300, width: 240 } }}
            >
                {EMAIL_VARIABLES.map((v) => (
                    <MenuItem
                        key={v.key}
                        onClick={() => { onSelect(v.key); setAnchor(null); }}
                        sx={{ py: 1 }}
                    >
                        <Stack>
                            <Typography variant="body2" fontWeight={500}>
                                {v.label}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                e.g. {v.example}
                            </Typography>
                        </Stack>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

// ── Main EmailDialog ───────────────────────────────────────────────
const EmailDialog = ({ open, onClose, stage, onSave }) => {
    // Single config per stage — initialize from stage or default

    const [config, setConfig] = useState(stage?.emailConfigs || emptyEmailConfig(0));
    const [previewOpen, setPreviewOpen] = useState(false);

    // Sync when dialog opens
    useEffect(() => {
        if (open) {
            setConfig(stage?.emailConfigs || emptyEmailConfig(0));
        }
    }, [open, stage._id]);

    const handleClose = () => {
        onSave({ ...stage, emailConfigs: config });
        onClose();
    };

    const handleChange = (field, value) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    const handleInsertVariable = (variable) => {
        const container = document.querySelector('[data-quill-editor]');
        const insertFn = container?._quillInsert;
        if (insertFn) {
            insertFn(`{{${variable}}}`);
        } else {
            handleChange('body', (config.body || '') + `{{${variable}}}`);
        }
    };

    const renderPreview = () => {
        let html = config.body || '';
        EMAIL_VARIABLES.forEach(v => {
            html = html.replace(
                new RegExp(`{{${v.key}}}`, 'g'),
                `<span style="color:#1976d2;background:#e3f2fd;padding:2px 4px;border-radius:3px;">${v.example}</span>`
            );
        });
        return html;
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <EmailIcon color="primary" />
                        <Typography variant="h6" fontSize={18}>
                            Email for "{stage.name}"
                        </Typography>
                    </Stack>
                    <IconButton onClick={handleClose}>
                        <Close />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <DialogContent dividers>
                <Box
                    sx={{
                        border: '1px solid',
                        borderColor: config.isActive ? 'primary.main' : 'divider',
                        borderRadius: 2,
                        p: 2,
                        bgcolor: config.isActive ? 'rgba(25, 118, 210, 0.04)' : 'background.default',
                    }}
                >
                    {/* Header: Trigger + Active */}
                    <Stack direction="row" alignItems="center" spacing={1} mb={2}>

                        <Box flex={1} />

                        <Tooltip title="Preview">
                            <IconButton size="small" onClick={() => setPreviewOpen(true)}>
                                <Visibility fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>

                    {/* Recipients */}
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                        Recipients
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap" mb={2} mt={0.5}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    size="small"
                                    checked={config.recipients.candidate}
                                    onChange={(e) => handleChange('recipients', {
                                        ...config.recipients,
                                        candidate: e.target.checked
                                    })}
                                />
                            }
                            label={<Typography variant="caption">Candidate</Typography>}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    size="small"
                                    checked={config.recipients.assignee}
                                    onChange={(e) => handleChange('recipients', {
                                        ...config.recipients,
                                        assignee: e.target.checked
                                    })}
                                />
                            }
                            label={<Typography variant="caption">Assignee</Typography>}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    size="small"
                                    checked={config.recipients.hr}
                                    onChange={(e) => handleChange('recipients', {
                                        ...config.recipients,
                                        hr: e.target.checked
                                    })}
                                />
                            }
                            label={<Typography variant="caption">HR</Typography>}
                        />
                        <Autocomplete
                            size="small"
                            multiple
                            freeSolo
                            options={[]}
                            value={config.recipients.customEmails}
                            onChange={(e, newVal) => handleChange('recipients', {
                                ...config.recipients,
                                customEmails: newVal
                            })}
                            renderTags={(value, getTagProps) => value.map((email, i) => (
                                <Chip
                                    size="small"
                                    label={email}
                                    {...getTagProps({ index: i })}
                                    key={email}
                                    sx={{ height: 20, fontSize: 11 }}
                                />
                            ))}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    size="small"
                                    placeholder="Custom emails"
                                    sx={{ width: 180 }}
                                />
                            )}
                        />
                    </Stack>

                    {/* Subject */}
                    <TextField
                        fullWidth
                        size="small"
                        label="Subject"
                        value={config.subject}
                        onChange={(e) => handleChange('subject', e.target.value)}
                        placeholder="e.g. Interview Scheduled for {{candidateName}}"
                        sx={{ mb: 2, '& input': { fontSize: 13 } }}
                        InputProps={{
                            endAdornment: (
                                <VariableMenu
                                    onSelect={(v) => handleChange('subject', (config.subject || '') + `{{${v}}}`)}
                                />
                            )
                        }}
                    />

                    {/* Body */}
                    <Box>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                            <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                Body
                            </Typography>
                            <VariableMenu onSelect={handleInsertVariable} />
                        </Stack>
                        <Box
                            data-quill-editor
                            sx={{
                                '& .ql-toolbar': {
                                    borderRadius: '8px 8px 0 0',
                                    borderColor: 'divider',
                                    bgcolor: 'action.hover',
                                },
                                '& .ql-container': {
                                    borderRadius: '0 0 8px 8px',
                                    borderColor: 'divider',
                                    fontSize: 13,
                                },
                                '& .ql-editor': {
                                    minHeight: 140,
                                },
                            }}
                        >
                            <QuillEditor
                                value={config.body}
                                onChange={(html) => handleChange('body', html)}
                                placeholder="Write email content..."
                            />
                        </Box>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} variant="contained">
                    Save & Close
                </Button>
            </DialogActions>

            {/* Preview Dialog */}
            <Dialog
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Preview</Typography>
                        <IconButton onClick={() => setPreviewOpen(false)}>
                            <Close />
                        </IconButton>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 2, p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                            Subject:
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                            {config.subject?.replace(/{{(\w+)}}/g, (m, key) => {
                                const v = EMAIL_VARIABLES.find(x => x.key === key);
                                return v ? `[${v.example}]` : m;
                            }) || ''}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            p: 2,
                            minHeight: 150,
                        }}
                        dangerouslySetInnerHTML={{
                            __html: renderPreview()
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPreviewOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
};


export default EmailDialog;