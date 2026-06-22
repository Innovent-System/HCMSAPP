// ════════════════════════════════════════════════════════════════════
// HiringBoard/index.jsx — Hiring Board (React + MUI + Redux Toolkit)
// ════════════════════════════════════════════════════════════════════
//
// TESTING MODE:
//   USE_DUMMY_DATA = true  → works standalone, no backend needed
//   USE_DUMMY_DATA = false → wires up to real API (see endpoints below)
//
// API endpoints expected (adjust to your _Service.ts):
//   GET  /jobpost/get                          → list of job posts
//   GET  /applicationstage/board/:jobPostId    → { template, columns, isOverride }
//   POST /applicationstage/move                → { applicationId, toStageId, toIndex }
//   POST /applicationstage/assign              → { applicationId, fkAssignedToId }
// ════════════════════════════════════════════════════════════════════

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Box,
    Stack,
    Typography,
    Select,
    MenuItem,
    Chip,
    Menu,
    FormControl,
    InputLabel,
    Skeleton,
} from "../../deps/ui";
import { Person } from "../../deps/ui/icons";
import { PeopleOutline } from "../../deps/ui/icons";
import PageHeader from '../../components/PageHeader';

import StageColumn from "./components/StageColumn";
import { STAGE_COLORS, DUMMY_JOBPOSTS, DUMMY_BOARDS, DUMMY_EMPLOYEES } from "./components/constants";
import { useEntityAction, useLazySingleQuery } from "@/store/actions/httpactions";
import { API } from "./_Service";
import { useAppSelector } from "@/store/storehook";

// ─── Real API imports (uncomment when wiring up backend) ────────────────────
// import { API } from '../_Service';
// import { useEntitiesQuery, useLazySingleQuery, useEntityAction } from '../../store/actions/httpactions';
// import { useSocketIo } from '../../components/useSocketio';
// import { useAppSelector } from "../../store/storehook";

// ════════════════════════════════════════════════════════════════════
const USE_DUMMY_DATA = true; // ← false karo jab backend ready ho
// ════════════════════════════════════════════════════════════════════

const HiringBoard = () => {
    const [jobPosts, setJobPosts] = useState([]);
    const [selectedJobPost, setSelectedJobPost] = useState('');
    const [boardData, setBoardData] = useState(null);
    const [loading, setLoading] = useState(false);


    // ── Drag state ───────────────────────────────────────────────────────
    const [draggedCardId, setDraggedCardId] = useState(null);
    const [dragOverStageId, setDragOverStageId] = useState(null);
    const [dropIndex, setDropIndex] = useState(null);
    const draggedCardRef = useRef(null);


    const [fetchData] = useLazySingleQuery();
    const { updateEntity } = useEntityAction();
    const { Employees } = useAppSelector(e => e.appdata.employeeData);


    useEffect(() => {
        fetchData({ url: `${API.JobPost}/list` }).then(e => {
            if (e.data?.result?.length) setJobPosts(e.data.result); setSelectedJobPost(e.data.result[0]._id)
        })
    }, []);

    // ── Load board data when job post changes ────────────────────────────
    const loadBoard = async (jobPostId) => {
        if (!jobPostId) return;
        setLoading(true);

        const { fkPipelineTemplateId } = jobPosts.find(e => e._id === jobPostId);
        try {
            const res = await fetchData({ url: `${API.PipelineStage}/${jobPostId}/${fkPipelineTemplateId}` });

            setBoardData(res?.data?.result ?? null);
        } catch (err) {
            console.error('Failed to load board', err);
            setBoardData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBoard(selectedJobPost);
    }, [selectedJobPost]);

    // ── Realtime updates (uncomment when wiring up) ───────────────────────
    // useSocketIo("changeInApplicationStage", () => loadBoard(selectedJobPost));

    // ── Sorted stages ──────────────────────────────────────────────────────
    const sortedStages = useMemo(() => {
        if (!boardData?.stages) return [];
        return [...boardData.stages].sort((a, b) => a.order - b.order);
    }, [boardData]);

    // ════════════════════════════════════════════════════════════════════
    // Drag & Drop handlers
    // ════════════════════════════════════════════════════════════════════

    const handleCardDragStart = (e, card) => {
        draggedCardRef.current = card;
        setDraggedCardId(card.application._id);
        e.dataTransfer.effectAllowed = 'move';

        // Reduce default browser ghost opacity for a cleaner look
        try {
            const ghost = e.target.cloneNode(true);
            ghost.style.opacity = '0.8';
            ghost.style.position = 'absolute';
            ghost.style.top = '-9999px';
            document.body.appendChild(ghost);
            e.dataTransfer.setDragImage(ghost, 0, 0);
            setTimeout(() => document.body.removeChild(ghost), 0);
        } catch (_) { /* no-op fallback */ }
    };

    const handleCardDragEnd = () => {
        setDraggedCardId(null);
        setDragOverStageId(null);
        setDropIndex(null);
        draggedCardRef.current = null;
    };

    // Compute insertion index based on mouse Y position vs card midpoints
    const handleColumnDragOver = (e, stage, cards) => {
        e.preventDefault();
        setDragOverStageId(stage._id);

        const columnEl = e.currentTarget;
        const cardEls = [...columnEl.querySelectorAll('[data-card-id]')]
            .filter(el => el.getAttribute('data-card-id') !== draggedCardId);
        const mouseY = e.clientY;

        let newIndex = cards.filter(c => c.application._id !== draggedCardId).length;
        for (let i = 0; i < cardEls.length; i++) {
            const rect = cardEls[i].getBoundingClientRect();
            const midpoint = rect.top + rect.height / 2;
            if (mouseY < midpoint) {
                newIndex = i;
                break;
            }
        }
        setDropIndex(newIndex);
    };

    const handleColumnDrop = async (e, stage) => {
        e.preventDefault();
        const card = draggedCardRef.current;
        const insertIndex = dropIndex ?? 0;

        setDragOverStageId(null);
        setDropIndex(null);
        setDraggedCardId(null);

        if (!card || !boardData) return;

        const fromStageId = findCardStageId(boardData.columns, card.application._id);
        if (!fromStageId) return;

        // Optimistic update — remove from source, insert at target index
        setBoardData((prev) => {
            const columns = { ...prev.columns };
            columns[fromStageId] = columns[fromStageId].filter(
                c => c.application._id !== card.application._id
            );

            const targetCol = [...(columns[stage._id] || [])];
            const safeIndex = Math.min(insertIndex, targetCol.length);
            targetCol.splice(safeIndex, 0, card);
            columns[stage._id] = targetCol;

            return { ...prev, columns };
        });

        // if (USE_DUMMY_DATA) return; // nothing else to do in test mode

        try {
            await updateEntity({
                url: `${API.PipelineStage}/move`,
                data: {
                    applicationId: card.application._id,
                    toStageId: stage._id,
                    toIndex: insertIndex,
                },
            });
        } catch (err) {
            console.error('Move failed', err);
            loadBoard(selectedJobPost); // revert on failure
        }
    };

    // ════════════════════════════════════════════════════════════════════
    // Assignee menu
    // ════════════════════════════════════════════════════════════════════
    const [assigneeMenu, setAssigneeMenu] = useState({ anchor: null, card: null });

    const handleAssigneeClick = (e, card) => {
        setAssigneeMenu({ anchor: e.currentTarget, card });
    };

    const handleAssigneeSelect = async (employeeId, employeeName) => {
        const { card } = assigneeMenu;
        setAssigneeMenu({ anchor: null, card: null });
        if (!card) return;

        setBoardData((prev) => {
            const columns = { ...prev.columns };
            const stageId = findCardStageId(columns, card.application._id);
            columns[stageId] = columns[stageId].map(c =>
                c.application._id === card.application._id
                    ? { ...c, assignedTo: employeeId ? { _id: employeeId, fullName: employeeName } : null }
                    : c
            );
            return { ...prev, columns };
        });

        if (USE_DUMMY_DATA) return;

        // try {
        //     await updateOneEntity({
        //         url: `${API.ApplicationStage}/assign`,
        //         data: { applicationId: card.application._id, fkAssignedToId: employeeId || null },
        //     });
        // } catch (err) {
        //     console.error('Assign failed', err);
        //     loadBoard(selectedJobPost);
        // }
    };

    // ════════════════════════════════════════════════════════════════════
    return (
        <>
            <PageHeader
                title="Hiring Board"
                subTitle="Drag candidates between stages"
                icon={<PeopleOutline fontSize="large" />}
            />

            <Box mb={2} display="flex" alignItems="center" gap={1}>
                <FormControl size="small" sx={{ minWidth: 280 }}>
                    <InputLabel>Job post</InputLabel>
                    <Select
                        label="Job post"
                        value={selectedJobPost}
                        onChange={(e) => setSelectedJobPost(e.target.value)}
                    >
                        {jobPosts?.map((jp) => (
                            <MenuItem key={jp._id} value={jp._id}>
                                {jp.title}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {boardData && (
                    <Chip
                        size="small"
                        label={
                            boardData.isOverride
                                ? `${boardData.name} · custom`
                                : `${boardData.name} · default`
                        }
                        sx={{
                            bgcolor: boardData.isOverride ? 'warning.light' : 'success.light',
                            color: boardData.isOverride ? 'warning.dark' : 'success.dark',
                        }}
                    />
                )}
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', height: { xs: 'calc(100vh - 230px)', md: 'calc(100vh - 210px)' }, minHeight: 320 }}>
                    {[1, 2, 3, 4, 5].map(i => (
                        <Skeleton
                            key={i}
                            variant="rounded"
                            sx={{ width: { xs: '78vw', sm: 240 }, minWidth: { xs: '78vw', sm: 240 }, height: '100%', flexShrink: 0 }}
                        />
                    ))}
                </Box>
            ) : !boardData ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Typography color="text.secondary">
                        No pipeline template configured for this job post's department.
                    </Typography>
                </Box>
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1.5,
                        overflowX: 'auto',
                        overflowY: 'hidden',
                        pb: 1,
                        // Fixed board height — adjust 230px if your header/page padding differs
                        height: { xs: 'calc(100vh - 230px)', md: 'calc(100vh - 150px)' },
                        minHeight: 320,
                        // Mobile: snap each column into view while swiping
                        scrollSnapType: { xs: 'x mandatory', sm: 'none' },
                        '&::-webkit-scrollbar': { height: 8 },
                        '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: 4 },
                    }}
                >
                    {sortedStages.map((stage, idx) => (
                        <StageColumn
                            key={stage._id}
                            stage={stage}
                            cards={boardData.columns?.[stage._id] || []}
                            color={STAGE_COLORS[idx % STAGE_COLORS.length]}
                            draggedCardId={draggedCardId}
                            isDragOver={dragOverStageId === stage._id}
                            dropIndex={dragOverStageId === stage._id ? dropIndex : null}
                            onCardDragStart={handleCardDragStart}
                            onCardDragEnd={handleCardDragEnd}
                            onColumnDragOver={handleColumnDragOver}
                            onColumnDrop={handleColumnDrop}
                            onAssigneeClick={handleAssigneeClick}
                        />
                    ))}
                </Box>
            )}

            {/* Assignee dropdown menu */}
            <Menu
                anchorEl={assigneeMenu.anchor}
                open={Boolean(assigneeMenu.anchor)}
                onClose={() => setAssigneeMenu({ anchor: null, card: null })}
                sx={{ maxHeight: 500 }}
            >
                <MenuItem onClick={() => handleAssigneeSelect(null, null)}>
                    <Person sx={{ fontSize: 16, mr: 1 }} /> Unassigned
                </MenuItem>
                {Employees?.map((emp) => (
                    <MenuItem key={emp._id} onClick={() => handleAssigneeSelect(emp._id, emp.fullName)}>
                        {emp.fullName}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

// ── Helper: find which stage a card currently belongs to ────────────────────
function findCardStageId(columns, applicationId) {
    for (const [stageId, cards] of Object.entries(columns)) {
        if (cards.some(c => c.application._id === applicationId)) return stageId;
    }
    return null;
}

export default HiringBoard;