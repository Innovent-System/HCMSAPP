import { Paper, Typography, Stack, Link, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSingleQuery } from "@/store/actions/httpactions";
import { MODULE_BADGE_COLOR, essColors } from "./theme";


const MODULE_ROUTES = {
    12: "/attendance/request/12",
    17: "/leave/request/17",
    30: "/payroll/advancesalary/30",
};



export default function PendingRequestsCard() {
    const navigate = useNavigate();

    const { data: requests } = useSingleQuery(
        { url: "ESSDashboard/pendingrequest", params: {} },
        { selectFromResult: ({ data }) => ({ data: data?.result ?? [] }) }
    );

    const handleOpen = (req) => {
        const route = MODULE_ROUTES[req.formId] ?? "/";
        navigate(route, { state: { requestId: req.id } });
    };

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: "10px",
                p: "14px 16px",
                boxShadow: "0 1px 2px rgba(16,28,48,0.06)",
                borderLeft: `3px solid ${essColors.amber}`,
                height: "100%",
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" mb={1}>
                <Typography sx={{ fontSize: 11, color: essColors.textFaint, letterSpacing: "0.3px" }}>
                    PENDING REQUESTS
                </Typography>
                <Typography sx={{ fontSize: 11, color: essColors.amberText, fontWeight: 500 }}>
                    {requests.length}
                </Typography>
            </Stack>

            {requests.length === 0 && (
                <Typography sx={{ fontSize: 12, color: essColors.textFaint, mt: 1 }}>
                    Nothing pending
                </Typography>
            )}

            <Stack spacing={0} maxHeight={230} sx={{
                overflowY: "auto",
                pr: 0.5,
                // Firefox
                scrollbarWidth: "thin",
                scrollbarColor: "transparent transparent",
                "&:hover": {
                    scrollbarColor: "rgba(0,0,0,0.25) transparent",
                },

                // Chromium / Safari
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "transparent",
                    borderRadius: "10px",
                    transition: "background-color 0.9s ease",
                },
                "&:hover::-webkit-scrollbar-thumb": {
                    backgroundColor: "rgba(0,0,0,0.25)",
                },
            }}>
                {requests.map((req, i) => {
                    const badge = MODULE_BADGE_COLOR[req.module] ?? { bg: "#EEF0F2", fg: essColors.textMuted };
                    return (
                        <Box
                            key={i}
                            sx={{
                                py: 1,
                                borderBottom: i < requests.length - 1 ? `0.5px solid ${essColors.border}` : "none",
                            }}
                        >
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                                <Box sx={{ minWidth: 0 }}>
                                    <Link
                                        component="button"
                                        onClick={() => handleOpen(req)}
                                        underline="hover"
                                        sx={{
                                            fontSize: 12,
                                            fontWeight: 500,
                                            color: essColors.navy,
                                            textAlign: "left",
                                            display: "block",
                                        }}
                                    >
                                        {req.title}
                                    </Link>
                                    <Typography sx={{ fontSize: 11, color: essColors.textFaint, mt: 0.25 }}>
                                        {req.subtitle}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        bgcolor: badge.bg,
                                        color: badge.fg,
                                        borderRadius: "12px",
                                        px: 1,
                                        py: "2px",
                                        fontSize: 10,
                                        fontWeight: 500,
                                        whiteSpace: "nowrap",
                                        flexShrink: 0,
                                    }}
                                >
                                    {req.module}
                                </Box>
                            </Stack>
                        </Box>
                    );
                })}
            </Stack>

            {/* {requests.length > 4 && (
                <Link
                    component="button"
                    onClick={() => navigate("/pending-requests")}
                    underline="none"
                    sx={{ fontSize: 12, color: essColors.amberText, fontWeight: 500, display: "block", mt: 1 }}
                >
                    View all →
                </Link>
            )} */}
        </Paper>
    );
}