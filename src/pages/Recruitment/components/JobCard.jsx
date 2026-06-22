// ════════════════════════════════════════════════════════════════════
// JobPortal/JobCard.jsx
// ════════════════════════════════════════════════════════════════════

import React from 'react';
import {
    Box, Stack, Typography, Chip, Button,
} from '../../../deps/ui';
import {
    Business, LocationOn, WorkOutline,
    AttachMoney, AccessTime, Bolt,
} from '../../../deps/ui/icons';
import { TYPE_COLORS, postedLabel, salaryLabel } from './constants';

const JobCard = ({ job, onApply, setOpenPopup }) => {
    const dept = job.department?.departmentName ?? '';
    const city = job.city?.name ?? '';
    const typeClr = TYPE_COLORS[job.employmentType] ?? TYPE_COLORS['Full-time'];

    return (
        <Box
            sx={{
                bgcolor: 'background.paper',
                border: '0.5px solid',
                borderColor: 'divider',
                borderLeft: job.isUrgent ? '3px solid #E24B4A' : '0.5px solid',
                borderLeftColor: job.isUrgent ? '#E24B4A' : 'divider',
                borderRadius: 2,
                p: 1.75,
                transition: 'border-color .15s, box-shadow .15s',
                '&:hover': { borderColor: 'action.focus', boxShadow: 1 },
            }}
        >
            {/* Title row */}
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={1} mb={0.75}>
                <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
                    <Typography variant="body2" color='textPrimary' fontWeight={500}>
                        {job.title}
                    </Typography>
                    <Chip
                        size="small"
                        label={job.employmentType}
                        sx={{ height: 20, fontSize: 11, bgcolor: typeClr.bg, color: typeClr.color }}
                    />
                    {job.isUrgent && (
                        <Chip
                            size="small"
                            icon={<Bolt sx={{ fontSize: 11 }} />}
                            label="Urgent"
                            sx={{ height: 20, fontSize: 11, bgcolor: '#FCEBEB', color: '#501313', '& .MuiChip-icon': { color: '#501313' } }}
                        />
                    )}
                </Stack>
                <Button
                    size="small"
                    variant="contained"
                    disableElevation
                    onClick={() => { setOpenPopup(true); onApply(job); }}
                    sx={{ fontSize: 12, py: 0.5, px: 2, flexShrink: 0, whiteSpace: 'nowrap' }}
                >
                    Apply
                </Button>
            </Stack>

            {/* Meta row */}
            <Stack direction="row" gap={1.5} flexWrap="wrap" mb={1}>
                {[
                    { icon: <Business sx={{ fontSize: 13 }} />, label: dept },
                    { icon: <LocationOn sx={{ fontSize: 13 }} />, label: city },
                    { icon: <WorkOutline sx={{ fontSize: 13 }} />, label: job.experience },
                    { icon: <AttachMoney sx={{ fontSize: 13 }} />, label: salaryLabel(job.salary) },
                ].map(({ icon, label }) => (
                    <Stack key={label} direction="row" alignItems="center" gap={0.4}>
                        <Box sx={{ color: 'text.disabled', display: 'flex' }}>{icon}</Box>
                        <Typography variant="caption" color="text.secondary">{label}</Typography>
                    </Stack>
                ))}
            </Stack>

            {/* Description */}
            <Typography variant="caption" color="text.secondary" display="block" sx={{ lineHeight: 1.65, mb: 1.25 }}>
                {job.description}
            </Typography>

            {/* Skills + Posted */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
                <Stack direction="row" gap={0.5} flexWrap="wrap">
                    {job.skills.map(skill => (
                        <Chip
                            key={skill}
                            size="small"
                            label={skill}
                            variant="outlined"
                            sx={{ height: 20, fontSize: 11, borderRadius: '99px' }}
                        />
                    ))}
                </Stack>
                <Stack direction="row" alignItems="center" gap={0.4}>
                    <AccessTime sx={{ fontSize: 12, color: 'text.disabled' }} />
                    <Typography variant="caption" color="text.disabled">
                        {postedLabel(job.createdAt)}
                    </Typography>
                </Stack>
            </Stack>
        </Box>
    );
};

export default JobCard;