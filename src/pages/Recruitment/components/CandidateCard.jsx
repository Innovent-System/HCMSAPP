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
import { MoreVert, Person,Check } from "../../../deps/ui/icons";
import { getInitials, scoreColor } from "./constants";

const CandidateCard = ({ card, stageColor, isDragging, isSelected, onDragStart, onDragEnd, onAssigneeClick, onCardSelect }) => {
    const { candidate, application, score, assignedTo, source } = card;

    return (
        <Card
            variant="outlined"
            draggable
            data-card-id={application._id}
            onClick={(e) => onCardSelect(e, card)}
            onDragStart={(e) => onDragStart(e, card)}
            onDragEnd={onDragEnd}
            sx={{
                p: 1.25,
                cursor: 'grab',
                borderRadius: 2,
                userSelect: 'none',
                outline: isSelected ? '2px solid #1976d2' : 'none',         // ← selected border
                outlineOffset: '-2px',
                bgcolor: isSelected ? 'action.selected' : 'background.paper',
                flexShrink: 0,
                borderLeft: `3px solid ${stageColor.mid}`,
                transition: 'opacity 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease',
                opacity: isDragging ? 0.35 : 1,
                transform: isDragging ? 'scale(0.97)' : 'scale(1)',
                '&:hover': { boxShadow: 2 },
                '&:active': { cursor: 'grabbing' },
            }}
        >
            {isSelected && (
                <Box sx={{
                    position: 'absolute', top: 6, right: 6,
                    width: 16, height: 16, borderRadius: '50%',
                    bgcolor: 'primary.main', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                }}>
                    <Check sx={{ fontSize: 11, color: 'white' }} />
                </Box>
            )}
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