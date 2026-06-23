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

    // ── Multi-select state ────────────────────────────────────────────
    const [selectedCards, setSelectedCards] = useState(new Set());

    // Card click — toggle selection
    const handleCardSelect = (e, card) => {
        e.stopPropagation();

        const currentStageId = findCardStageId(boardData.columns, card.application._id);

        setSelectedCards(prev => {
            // Empty → add this card
            if (prev.size === 0) {
                return new Set([card.application._id]);
            }

            // Check if all selected are same stage as current
            const firstSelectedId = [...prev][0];
            const firstSelectedStageId = findCardStageId(boardData.columns, firstSelectedId);

            // Different stage → reset and select only this card
            if (firstSelectedStageId !== currentStageId) {
                return new Set([card.application._id]);
            }

            // Same stage → toggle
            const next = new Set(prev);
            if (next.has(card.application._id)) {
                next.delete(card.application._id);
            } else {
                next.add(card.application._id);
            }
            return next;
        });
    }



    // Escape se selection clear
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') setSelectedCards(new Set()); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    // Multi Drop End
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
        const isMultiDrag = selectedCards.size > 1 && selectedCards.has(card.application._id);
        const dragIds = isMultiDrag ? [...selectedCards] : [card.application._id];

        const draggedCards = [];
        for (const cards of Object.values(boardData.columns)) {
            for (const c of cards) {
                if (dragIds.includes(c.application._id)) draggedCards.push(c);
            }
        }

        draggedCardRef.current = draggedCards;
        setDraggedCardId(card.application._id);
        e.dataTransfer.effectAllowed = 'move';

        try {
            let ghost = null;

            if (draggedCards.length > 1) {
                // === MULTI-DRAG: SOLID CARD STACK ===
                const container = document.createElement('div');
                container.style.cssText = `
                position: fixed;
                top: -2000px;
                left: -2000px;
                pointer-events: none;
                z-index: 99999;
            `;

                // Background cards (peeche) — dark grey stack
                const stackCount = Math.min(draggedCards.length, 3);
                for (let i = stackCount - 1; i >= 1; i--) {
                    const backCard = document.createElement('div');
                    backCard.style.cssText = `
                    position: absolute;
                    top: ${i * 8}px;
                    left: ${i * 6}px;
                    width: 200px;
                    height: 60px;
                    background: #37474f;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
                    z-index: ${-i};
                `;
                    container.appendChild(backCard);
                }

                // Main card — solid white
                const mainCard = document.createElement('div');
                const cardData = draggedCards[0];

                // ✅ Direct candidate access — name field hai
                const candidateName = cardData.candidate || 'Candidate';
                const nameParts = candidateName.split(' ');
                const initials = (nameParts[0]?.[0] || '') + (nameParts[1]?.[0] || '');
                const jobTitle = cardData.jobTitle || '.Net Developer';

                mainCard.style.cssText = `
                position: relative;
                width: 200px;
                background: #ffffff;
                border-radius: 8px;
                padding: 12px 14px;
                box-shadow: 0 6px 16px rgba(0,0,0,0.25);
                border: 2px solid #1976d2;
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 1;
            `;

                mainCard.innerHTML = `
                <div style="
                    width: 36px; 
                    height: 36px;
                    background: #1976d2;
                    color: #ffffff;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 13px;
                    font-weight: 700;
                    flex-shrink: 0;
                ">${initials}</div>
                <div style="min-width: 0; flex: 1;">
                    <div style="
                        font-size: 13px;
                        font-weight: 600;
                        color: #212121;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    ">${candidateName}</div>
                    <div style="
                        font-size: 11px;
                        color: #616161;
                        margin-top: 2px;
                    ">${jobTitle}</div>
                </div>
            `;
                container.appendChild(mainCard);

                // Red count badge
                const badge = document.createElement('div');
                badge.textContent = draggedCards.length;
                badge.style.cssText = `
                position: absolute;
                top: -10px;
                right: -10px;
                background: #d32f2f;
                color: white;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 13px;
                font-weight: 700;
                box-shadow: 0 3px 8px rgba(0,0,0,0.3);
                border: 2px solid white;
                z-index: 10;
            `;
                mainCard.appendChild(badge);

                ghost = container;
            } else {
                // === SINGLE DRAG ===
                const cardEl = e.target.closest('[data-card-id]');
                ghost = cardEl?.cloneNode(true) || e.target.cloneNode(true);
                ghost.style.cssText = `
                position: fixed;
                top: -2000px;
                left: -2000px;
                opacity: 0.8;
                pointer-events: none;
                z-index: 99999;
                box-shadow: 0 12px 32px rgba(0,0,0,0.3);
                width: ${cardEl?.offsetWidth || 260}px;
            `;
            }

            document.body.appendChild(ghost);

            // Offset: Mouse ke bilkul neeche
            const rect = e.target.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const offsetY = e.clientY - rect.top;

            e.dataTransfer.setDragImage(ghost, offsetX, offsetY);

            setTimeout(() => {
                if (ghost.parentNode) ghost.remove();
            }, 100);

        } catch (err) {
            console.error('Drag ghost error:', err);
        }
    };

    const handleCardDragEnd = () => {
        setDraggedCardId(null);
        setDragOverStageId(null);
        setDropIndex(null);
        draggedCardRef.current = null;
        //setSelectedCards(new Set()); // drag ke baad selection clear
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
        const cards = draggedCardRef.current;  // ab array hai
        const insertIndex = dropIndex ?? 0;

        setDragOverStageId(null);
        setDropIndex(null);
        setDraggedCardId(null);
        setSelectedCards(new Set());

        if (!cards?.length || !boardData) return;

        // Same stage check — saare cards same stage mein hain?
        const allSameStage = cards.every(card => {
            const fromStageId = findCardStageId(boardData.columns, card.application._id);
            return fromStageId === stage._id;
        });
        if (allSameStage) return;

        // Optimistic update — saare cards move karo
        setBoardData(prev => {
            const columns = { ...prev.columns };
            const cardIds = new Set(cards.map(c => c.application._id));

            // Sab source columns se remove karo
            for (const stageId of Object.keys(columns)) {
                columns[stageId] = columns[stageId].filter(c => !cardIds.has(c.application._id));
            }

            // Target column mein insert karo
            const targetCol = [...(columns[stage._id] || [])];
            targetCol.splice(Math.min(insertIndex, targetCol.length), 0, ...cards);
            columns[stage._id] = targetCol;

            return { ...prev, columns };
        });

        // API call — saare cards ke liye
        try {
            await updateEntity({
                url: `${API.PipelineStage}/move`,
                data: {
                    applicationIds: cards.map(c => c.application._id),
                    toStageId: stage._id,
                },
            });
        } catch (err) {
            console.error('Bulk move failed', err);
            loadBoard(selectedJobPost);
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
                            selectedCards={selectedCards}
                            onCardSelect={handleCardSelect}
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