import React, { useState } from "react";
import PropTypes from "prop-types";
import { HelpOutline, PictureAsPdf, Close, OpenInNew } from "../deps/ui/icons";
import {
  IconButton, Tooltip, Menu, MenuItem, ListItemIcon, ListItemText,
  Dialog, DialogTitle, DialogContent, Stack, Typography,
} from "../deps/ui";
import { styled } from "@mui/material/styles";

const HelpIconBtn = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  width: 28,
  height: 28,
  borderRadius: theme.spacing(1),
  transition: "background 0.15s, color 0.15s",
  "&:hover": {
    background: theme.palette.action.hover,
    color: theme.palette.primary.main,
  },
}));

export default function HelpButton({ files = [], tooltip = "Help" }) {
  const [anchor, setAnchor] = useState(null);
  const [selected, setSelected] = useState(null); // { title, url }
  const list = files.filter((f) => f?.url);

  if (!list.length) return null;

  const openFile = (file) => {
    setAnchor(null);
    setSelected(file);
  };

  const handleClick = (e) => {
    if (list.length === 1) openFile(list[0]);
    else setAnchor(e.currentTarget);
  };

  return (
    <>
      <Tooltip title={tooltip} placement="bottom" arrow>
        <HelpIconBtn size="small" onClick={handleClick} aria-label="help">
          <HelpOutline fontSize="small" />
        </HelpIconBtn>
      </Tooltip>

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {list.map((f) => (
          <MenuItem key={f.url} onClick={() => openFile(f)}>
            <ListItemIcon><PictureAsPdf fontSize="small" /></ListItemIcon>
            <ListItemText primary={f.title ?? "Help"} />
          </MenuItem>
        ))}
      </Menu>

      <Dialog
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        fullWidth
        maxWidth="lg"
        PaperProps={{ sx: { height: "88vh" } }}
      >
        <DialogTitle sx={{ py: 1, px: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
              {selected?.title ?? "Help"}
            </Typography>
            <Stack direction="row" gap={0.5}>
              <Tooltip title="Open in new tab" arrow>
                <IconButton
                  size="small"
                  component="a"
                  href={selected?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <OpenInNew fontSize="small" />
                </IconButton>
              </Tooltip>
              <IconButton size="small" onClick={() => setSelected(null)} aria-label="close">
                <Close fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ p: 0, overflow: "hidden" }}>
          {selected && (
            <iframe
              title={selected.title ?? "Help"}
              src={selected.url}
              style={{ width: "100%", height: "100%", border: 0 }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

HelpButton.propTypes = {
  files: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    url: PropTypes.string.isRequired,
  })),
  tooltip: PropTypes.string,
};