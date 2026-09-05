import { Box, Paper, Stack, Typography, Link } from "@mui/material";
import { essColors } from "./theme";

/**
 * @param {{
 *   items: Array<{ icon: React.ReactNode, iconBg: string, iconColor: string, title: string, date: string }>,
 *   onViewAll?: () => void,
 * }} props
 */
export default function CompanyNewsCard({ items = [], onViewAll }) {
  return (
    <Paper elevation={0} sx={{ borderRadius: "10px", p: 2.25, boxShadow: "0 1px 2px rgba(16,28,48,0.06)", height: "100%" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
        <Typography sx={{ fontSize: 15, fontWeight: 500, color: essColors.navy }}>Company Policy</Typography>
        <Link component="button" onClick={onViewAll} underline="none" sx={{ fontSize: 12, color: essColors.textFaint }}>
          View all
        </Link>
      </Stack>

      {items.map((item, i) => (
        <Stack
          key={i}
          direction="row"
          spacing={1.25}
          sx={{
            py: 1.1,
            borderBottom: i < items.length - 1 ? `0.5px solid ${essColors.border}` : "none",
          }}
        >
          <Box
            sx={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              bgcolor: item.iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              "& svg": { width: 13, height: 13, color: item.iconColor },
            }}
          >
            {item.icon}
          </Box>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 500, color: essColors.navy }}>{item.title}</Typography>
            <Typography sx={{ fontSize: 11, color: essColors.textFaint, mt: 0.25 }}>{item.date}</Typography>
          </Box>
        </Stack>
      ))}
    </Paper>
  );
}
