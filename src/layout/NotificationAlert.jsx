import React, { useEffect, useRef, useState } from "react";
import {
    IconButton,
    Badge,
    Popover,
    Box,
    Typography,
    List,
    ListItemButton,
    Divider,
    Button,
    Skeleton,
    Avatar,
    CircularProgress,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import { useNavigate } from "react-router-dom";
import { useEntityAction, useEntitiesQuery } from "@/store/actions/httpactions";
import { useSocketIo } from "@/components/useSocketio";

const DEFAULT_API = "Notification"; // TODO: confirm exact endpoint for fetching notifications
const ACCENT = "#12A989";
const NAVY = "#0F1C30";
const PAGE_LIMIT = 12;
const SCROLL_BUFFER_PX = 50;

// TEMP: UI test data (20 rows to exercise scroll pagination) — remove once useEntitiesQuery is wired.
const MOCK_ALL_NOTIFICATIONS = Array.from({ length: 20 }, (_, i) => {
    const templates = [
        { title: "Leave Approved", message: "Your leave request for Oct 5-7 has been approved by your manager.", formId: 1, entityId: 101 },
        { title: "Missed Clock-Out", message: "You forgot to clock out yesterday. Please update your attendance record.", formId: 2, entityId: null },
        { title: "Payslip Ready", message: "Your payslip for September 2026 is now available for download.", formId: 3, entityId: 205 },
        { title: "Company Announcement", message: "Office will remain closed on Oct 12 for a public holiday.", formId: null, entityId: null },
    ];
    const t = templates[i % templates.length];
    return {
        id: i + 1,
        ...t,
        isRead: i > 3,
        createdAt: new Date(Date.now() - i * 3 * 60 * 60 * 1000).toISOString(),
    };
});

// FormId -> route template. EntityId substitutes :id. Keep in sync with ApplicationForm table.
const FORM_ROUTE_MAP = {
    12: "/attendance/request/12",
    13: "/attendance/exemption/13",
    17: "/leave/request/17",
};

const APPROVAL_ROUTE = {
    12: "/attendance/approval/14",
    13: "/attendance/approval/14",
    17: "/leave/approval/19",
}

// FormId -> icon + tint, purely presentational (falls back to a generic bell/announcement look)
const TYPE_STYLE = {
    12: { icon: AccessTimeRoundedIcon, color: "#B26A00", bg: "#FFF3E0" }, // Attendance
    13: { icon: AccessTimeRoundedIcon, color: "#B26A00", bg: "#FFF3E0" }, // Attendance
    17: { icon: EventAvailableRoundedIcon, color: "#2E7D32", bg: "#E8F5E9" }, // Leave
    26: { icon: PaymentsRoundedIcon, color: "#1565C0", bg: "#E3F2FD" }, // Payroll
    default: { icon: CampaignRoundedIcon, color: "#6A1B9A", bg: "#F3E5F5" }, // Announcement / other
};

const resolveRoute = (formId, entityId, isRequester = false) => {
    const template = isRequester ? FORM_ROUTE_MAP[formId] : APPROVAL_ROUTE[formId];
    if (!template) return null;
    return template;
};

// Compact relative time — "2m", "3h", "1d", falls back to short date past a week
const relativeTime = (isoDate) => {
    const diffMs = Date.now() - new Date(isoDate).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(isoDate).toLocaleDateString(undefined, { day: "2-digit", month: "short" });
};

const NotificationItem = ({ notification, onClick }) => {
    const style = TYPE_STYLE[notification.formId] ?? TYPE_STYLE.default;
    const Icon = style.icon;

    return (
        <ListItemButton
            onClick={() => onClick(notification)}
            sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.25,
                px: 2,
                py: 1.1,
                backgroundColor: notification.isRead ? "transparent" : "rgba(18,169,137,0.05)",
                "&:hover": { backgroundColor: "rgba(15,28,48,0.04)" },
            }}
        >
            <Avatar sx={{ width: 32, height: 32, bgcolor: style.bg, color: style.color, flexShrink: 0 }}>
                <Icon sx={{ fontSize: 17 }} />
            </Avatar>

            <Box sx={{ minWidth: 0, flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                    <Typography
                        fontWeight={notification.isRead ? 500 : 700}
                        fontSize={13.5}
                        color={NAVY}
                        noWrap
                    >
                        {notification.title}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexShrink: 0 }}>
                        <Typography fontSize={11} color="text.disabled" whiteSpace="nowrap">
                            {relativeTime(notification.createdAt)}
                        </Typography>
                        {!notification.isRead && (
                            <Box sx={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: ACCENT }} />
                        )}
                    </Box>
                </Box>
                <Typography
                    fontSize={11.5}
                    color="text.secondary"
                    sx={{
                        mt: 0.25,
                        // overflow: "hidden",
                        // textOverflow: "ellipsis",
                        // whiteSpace: "",
                    }}
                >
                    {notification.message}
                </Typography>
            </Box>
        </ListItemButton>
    );
};

const NotificationSkeleton = () => (
    <Box sx={{ px: 2, py: 1 }}>
        {[1, 2, 3].map((i) => (
            <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.25, py: 1 }}>
                <Skeleton variant="circular" width={32} height={32} />
                <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="50%" height={16} />
                    <Skeleton variant="text" width="80%" height={14} />
                </Box>
            </Box>
        ))}
    </Box>
);

const EmptyState = () => (
    <Box sx={{ py: 5, textAlign: "center" }}>
        <NotificationsNoneIcon sx={{ fontSize: 28, color: "text.disabled", mb: 0.5 }} />
        <Typography variant="body2" color="text.secondary">
            No notifications yet
        </Typography>
    </Box>
);

const NotificationBell = () => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const scrollBoxRef = useRef(null);

    const { updateEntity, updateOneEntity } = useEntityAction();

    const [gridFilter, setGridFilter] = useState({
        startIndex: 0,
        limit: PAGE_LIMIT,
        isFromScroll: false,
    });

    // TODO: confirm exact query-shape/url convention (matches useEntitiesQuery usage in Designation.jsx)
    const { data: pageData = [], isFetching, totalRecord = 0, unreadCount = 0, refetch, status } = useEntitiesQuery(
        { url: `${DEFAULT_API}/get`, data: { startIndex: gridFilter.startIndex, limit: gridFilter.limit, sort: { createdAt: -1 } } },
        {
            selectFromResult: ({ data, isFetching, status }) => ({
                data: data?.entityData, totalRecord: data?.totalRecord,
                unreadCount: data?.unReadCount,
                isFetching, status
            })
        }
    );

    useEffect(() => {
        if (status === "fulfilled") {
            setItems((prev) => (gridFilter.isFromScroll ? [...prev, ...pageData] : pageData));
        }
    }, [status, pageData]);

    // TEMP: mock pagination — simulates the same startIndex/limit slicing the real API will do.
    // Swap this block (and the effect below) for the useEntitiesQuery wiring above.
    const [items, setItems] = useState([]);
    // const [isLoading, setIsLoading] = useState(false);
    // const totalRecord = MOCK_ALL_NOTIFICATIONS.length;

    // useEffect(() => {
    //     setIsLoading(true);
    //     const timer = setTimeout(() => {
    //         const page = MOCK_ALL_NOTIFICATIONS.slice(gridFilter.startIndex, gridFilter.startIndex + gridFilter.limit);
    //         setItems((prev) => (gridFilter.isFromScroll ? [...prev, ...page] : page));
    //         setIsLoading(false);
    //     }, 300);
    //     return () => clearTimeout(timer);
    // }, [gridFilter]);

    // const refetch = () => setGridFilter({ startIndex: 0, limit: PAGE_LIMIT, isFromScroll: false });

    // const unreadCount = items.filter((n) => !n.isRead).length;

    // TODO: confirm socket event name emitted by NotificationService (e.g. "changeInNotification")
    useSocketIo("ReceiveNotification", refetch);

    const handleOpen = (e) => {
        setAnchorEl(e.currentTarget);
        // Reset to first page every time the panel opens, so a stale scroll position
        // from a previous open doesn't leave gaps or duplicate items.
        setGridFilter({ startIndex: 0, limit: PAGE_LIMIT, isFromScroll: false });
    };
    const handleClose = () => setAnchorEl(null);

    const handleScroll = ({ currentTarget }) => {
        const { scrollTop, clientHeight, scrollHeight } = currentTarget;
        const bottomReached = scrollTop + clientHeight >= scrollHeight - SCROLL_BUFFER_PX;

        if (bottomReached && !isFetching && items.length < totalRecord) {
            setGridFilter((prev) => ({
                ...prev,
                startIndex: prev.startIndex + prev.limit,
                isFromScroll: true,
            }));
        }
    };

    const handleItemClick = (notification) => {
        if (!notification.isRead) {
            // TODO: confirm mark-read call shape — updateOneEntity({ id }) mirrors the
            // Designation active-toggle pattern; swap for the correct hook/endpoint if different
            updateOneEntity({ url: `${DEFAULT_API}`, data: { id: notification.id } }).finally(() => {
                refetch();
            });
        }
        const route = resolveRoute(notification.formId, notification.entityId, notification.isRequester);
        handleClose();
        if (route) navigate(route);
    };

    const handleMarkAllRead = () => {
        updateEntity({ url: `${DEFAULT_API}/mark-all-read`, data: {} }).finally(() => {
            refetch();
        });
    };

    // Only show the full skeleton on the first page load; page 2+ gets a small inline spinner instead.
    const isFirstPageLoading = isFetching && !gridFilter.isFromScroll && items.length === 0;
    const isLoadingMore = isFetching && gridFilter.isFromScroll;

    return (
        <>
            <IconButton onClick={handleOpen} sx={{ color: "common.white" }}>
                <Badge
                    badgeContent={unreadCount}
                    max={99}
                    sx={{ "& .MuiBadge-badge": { backgroundColor: ACCENT, color: "#fff", fontSize: 10, height: 16, minWidth: 16 } }}
                >
                    <NotificationsNoneIcon fontSize="small" />
                </Badge>
            </IconButton>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{
                    paper: {
                        sx: {
                            width: 340,
                            maxHeight: 420,
                            borderRadius: 1,
                            overflow: "hidden",
                            boxShadow: "0 8px 24px rgba(15,28,48,0.16)",
                        },
                    },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        px: 2,
                        py: 1.25,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <Typography fontWeight={600} fontSize={14} color={NAVY}>
                        Notifications
                    </Typography>
                    {unreadCount > 0 && (
                        <Button
                            size="small"
                            onClick={handleMarkAllRead}
                            sx={{ color: ACCENT, textTransform: "none", fontWeight: 600, fontSize: 12.5, minWidth: 0, p: 0.5 }}
                        >
                            Mark all read
                        </Button>
                    )}
                </Box>

                <Box ref={scrollBoxRef} onScroll={handleScroll} sx={{ maxHeight: 360, overflowY: "auto" }}>
                    {isFirstPageLoading ? (
                        <NotificationSkeleton />
                    ) : items.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <>
                            <List sx={{ py: 0.5 }}>
                                {items.map((n, idx) => (
                                    <React.Fragment key={n.id}>
                                        <NotificationItem notification={n} onClick={handleItemClick} />
                                        {idx < items.length - 1 && <Divider sx={{ mx: 2 }} />}
                                    </React.Fragment>
                                ))}
                            </List>
                            {isLoadingMore && (
                                <Box sx={{ display: "flex", justifyContent: "center", py: 1.5 }}>
                                    <CircularProgress size={18} sx={{ color: ACCENT }} />
                                </Box>
                            )}
                        </>
                    )}
                </Box>
            </Popover>
        </>
    );
};

export default NotificationBell;