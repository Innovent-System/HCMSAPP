// ════════════════════════════════════════════════════════════════════
// HiringBoard/StageColumn.jsx
// ════════════════════════════════════════════════════════════════════
// - Fixed full-height column (header sticky, cards area scrolls)
// - Shows a "drop line" indicator between cards while dragging
// - Width is responsive: narrower on mobile so 1.x columns are visible

import React from "react";
import { Box, Stack, Typography, Chip } from "../../../deps/ui";
import { AutoAwesome } from "../../../deps/ui/icons";
import CandidateCard from "./CandidateCard";

const DropLine = ({ color }) => (
    <Box
        sx={{
            height: 3,
            borderRadius: 2,
            bgcolor: color?.mid || 'info.main',
            mx: 0.5,
            flexShrink: 0,
            animation: 'pulse 1s ease-in-out infinite',
            '@keyframes pulse': {
                '0%, 100%': { opacity: 0.5 },
                '50%': { opacity: 1 },
            },
        }}
    />
);

const StageColumn = ({
    stage,
    cards,
    color,
    draggedCardId,
    isDragOver,
    dropIndex,
    onCardDragStart,
    onCardDragEnd,
    onColumnDragOver,
    onColumnDrop,
    onAssigneeClick,
}) => {
    return (
        <Box
            sx={{
                // Responsive width — narrower on mobile so next column peeks in (snap-scroll feel)
                width: { xs: '78vw', sm: 240 },
                minWidth: { xs: '78vw', sm: 240 },
                maxWidth: { xs: '78vw', sm: 240 },
                flexShrink: 0,
                scrollSnapAlign: 'start',

                // Fixed height — fills the board container, header + scroll area inside
                height: '100%',
                display: 'flex',
                flexDirection: 'column',

                bgcolor: isDragOver ? 'action.hover' : 'background.default',
                borderRadius: 2,
                border: '1px solid',
                borderColor: isDragOver ? color.mid : 'divider',
                overflow: 'hidden',
                transition: 'background-color 0.15s, border-color 0.15s',
            }}
        >
            {/* ── Sticky header ─────────────────────────────────────────────── */}
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                    px: 1.25, py: 1,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    flexShrink: 0,
                }}
            >
                <Box minWidth={0}>
                    <Typography variant="caption" fontWeight={500} color="text.secondary" noWrap>
                        {stage.name}
                    </Typography>
                    {stage.type === 'Auto' && (
                        <Chip
                            size="small"
                            icon={<AutoAwesome sx={{ fontSize: 11 }} />}
                            label={stage.minScore > 0 ? `auto · ${stage.minScore}%+` : 'auto'}
                            sx={{
                                height: 18, fontSize: 10, ml: 0.5,
                                bgcolor: 'success.light', color: 'success.dark',
                                '& .MuiChip-icon': { color: 'success.dark' },
                            }}
                        />
                    )}
                </Box>
                <Chip size="small" label={cards.length} sx={{ height: 20, fontSize: 11, minWidth: 28, flexShrink: 0 }} />
            </Stack>

            {/* ── Scrollable cards area ────────────────────────────────────── */}
            <Box
                onDragOver={(e) => onColumnDragOver(e, stage, cards)}
                onDrop={(e) => onColumnDrop(e, stage)}
                sx={{
                    flex: 1,
                    minHeight: 0,           // required for overflow to work inside flex column
                    overflowY: 'auto',
                    p: 1.25,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    '&::-webkit-scrollbar': { width: 6 },
                    '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: 3 },
                }}
            >
                {cards.length === 0 && dropIndex === null && (
                    <Box
                        sx={{
                            border: '1px dashed', borderColor: isDragOver ? color.mid : 'divider',
                            borderRadius: 1.5, py: 2.5, textAlign: 'center',
                            flexShrink: 0,
                            transition: 'border-color 0.15s',
                        }}
                    >
                        <Typography variant="caption" color="text.disabled">
                            {isDragOver ? 'Drop here' : 'No candidates'}
                        </Typography>
                    </Box>
                )}

                {cards.length === 0 && dropIndex !== null && <DropLine color={color} />}

                {cards.map((card, idx) => {
                    const isDragging = draggedCardId === card.application._id;
                    return (
                        <React.Fragment key={card.application._id}>
                            {dropIndex === idx && <DropLine color={color} />}
                            <CandidateCard
                                card={card}
                                stageColor={color}
                                isDragging={isDragging}
                                onDragStart={onCardDragStart}
                                onDragEnd={onCardDragEnd}
                                onAssigneeClick={onAssigneeClick}
                            />
                        </React.Fragment>
                    );
                })}

                {dropIndex === cards.length && cards.length > 0 && <DropLine color={color} />}

                {/* Bottom spacer so DropLine after last card stays clickable on drop */}
                {dropIndex === cards.length && cards.length === 0 && null}
            </Box>
        </Box>
    );
};

export default StageColumn;