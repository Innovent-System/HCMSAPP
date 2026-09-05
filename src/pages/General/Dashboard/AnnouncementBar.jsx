import { useEffect, useRef, useState } from "react";
import { Box, Paper, Stack, Typography, Link, IconButton, Fade } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { essColors } from "./theme";

const AUTO_ADVANCE_MS = 5000;

/**
 * Single-line rotating announcement bar (payroll completed, policy
 * deadlines, review cycles, etc). Shows one item at a time, auto-advances,
 * pauses on hover, and supports manual next/prev + dot navigation.
 *
 * @param {{items: Array<{icon: React.ReactNode, iconBg: string, iconColor: string, text: string, href?: string}>}} props
 */
export default function AnnouncementBar({ items = [] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timerRef.current);
  }, [paused, items.length]);

  if (!items.length) return null;

  const current = items[index];
  const goTo = (i) => setIndex(((i % items.length) + items.length) % items.length);

  return (
    <Paper
      elevation={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      sx={{
        borderRadius: "10px",
        p: "10px 14px",
        boxShadow: "0 1px 2px rgba(16,28,48,0.06)",
        mb: 2.5,
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      {items.length > 1 && (
        <IconButton size="small" onClick={() => goTo(index - 1)} sx={{ color: essColors.textFaint, flexShrink: 0 }}>
          <ChevronLeftIcon sx={{ fontSize: 16 }} />
        </IconButton>
      )}

      <Fade in key={index} timeout={400}>
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              bgcolor: current.iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              "& svg": { width: 14, height: 14, color: current.iconColor },
            }}
          >
            {current.icon}
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: essColors.navy,
              fontSize: 13,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {current.text}
          </Typography>
          {current.href && (
            <Link
              href={current.href}
              underline="none"
              sx={{ fontSize: 12, fontWeight: 500, color: essColors.teal, flexShrink: 0 }}
            >
              View
            </Link>
          )}
        </Stack>
      </Fade>

      {items.length > 1 && (
        <>
          <IconButton size="small" onClick={() => goTo(index + 1)} sx={{ color: essColors.textFaint, flexShrink: 0 }}>
            <ChevronRightIcon sx={{ fontSize: 16 }} />
          </IconButton>

          <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
            {items.map((_, i) => (
              <Box
                key={i}
                onClick={() => goTo(i)}
                sx={{
                  width: i === index ? 14 : 6,
                  height: 6,
                  borderRadius: "3px",
                  bgcolor: i === index ? essColors.teal : "#E2E6EB",
                  cursor: "pointer",
                  transition: "width 0.2s ease, background-color 0.2s ease",
                }}
              />
            ))}
          </Stack>
        </>
      )}
    </Paper>
  );
}