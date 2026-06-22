// ════════════════════════════════════════════════════════════════════
// HiringBoard/CandidateCard.jsx
// ════════════════════════════════════════════════════════════════════

import React from "react";
import {
    Box,
    Stack,
    Typography,
    Card,
    Avatar,
    LinearProgress,
    Chip,
    IconButton,
} from "../../../deps/ui";
import { MoreVert, Person } from "../../../deps/ui/icons";
import { getInitials, scoreColor } from "./constants";

const CandidateCard = ({ card, stageColor, isDragging, onDragStart, onDragEnd, onAssigneeClick }) => {
    const { candidate, application, score, assignedTo, source } = card;

    return (
        <Card
            variant="outlined"
            draggable
            data-card-id={application._id}
            onDragStart={(e) => onDragStart(e, card)}
            onDragEnd={onDragEnd}
            sx={{
                p: 1.25,
                cursor: 'grab',
                borderRadius: 2,
                userSelect: 'none',
                flexShrink: 0,
                borderLeft: `3px solid ${stageColor.mid}`,
                transition: 'opacity 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease',
                opacity: isDragging ? 0.35 : 1,
                transform: isDragging ? 'scale(0.97)' : 'scale(1)',
                '&:hover': { boxShadow: 2 },
                '&:active': { cursor: 'grabbing' },
            }}
        >
            <Stack direction="row" spacing={1} alignItems="flex-start">
                <Avatar
                    sx={{
                        width: 28, height: 28, fontSize: 11, fontWeight: 500,
                        bgcolor: stageColor.bg, color: stageColor.text,
                    }}
                >
                    {getInitials(`${candidate ?? ''}`)}
                </Avatar>

                <Box flex={1} minWidth={0}>
                    <Typography variant="body2" fontWeight={500} noWrap>
                        {candidate}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap display="block">
                        {application?.jobPost?.title}
                    </Typography>
                </Box>

                <IconButton size="small" onClick={(e) => onAssigneeClick(e, card)} sx={{ mt: -0.5, mr: -0.5 }}>
                    <MoreVert fontSize="small" />
                </IconButton>
            </Stack>

            <Box mt={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <LinearProgress
                        variant="determinate"
                        value={Math.min(score, 100)}
                        sx={{
                            flex: 1, height: 4, borderRadius: 2,
                            bgcolor: 'action.hover',
                            '& .MuiLinearProgress-bar': { bgcolor: scoreColor(score), borderRadius: 2 },
                        }}
                    />
                    <Typography variant="caption" color="text.secondary" minWidth={32} textAlign="right">
                        {Math.round(score)}%
                    </Typography>
                </Stack>
            </Box>

            {(source || assignedTo?.fullName) && (
                <Stack direction="row" spacing={0.5} mt={1} flexWrap="wrap">
                    {source && (
                        <Chip size="small" label={source} variant="outlined" sx={{ height: 18, fontSize: 10 }} />
                    )}
                    {assignedTo?.fullName && (
                        <Chip
                            size="small"
                            icon={<Person sx={{ fontSize: 12 }} />}
                            label={assignedTo.fullName}
                            sx={{ height: 18, fontSize: 10 }}
                        />
                    )}
                </Stack>
            )}
        </Card>
    );
};

export default CandidateCard;