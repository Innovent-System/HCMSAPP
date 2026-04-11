import React, { useState, useEffect } from "react";
import {
  FilterList as FilterListIcon,
  CloudUpload, FileCopy, Close, RestartAlt,
} from "../deps/ui/icons";
import PropTypes from "prop-types";
import Controls from "./controls/Controls";
import {
  Paper, Typography, Grid, Drawer, Box,
  IconButton, Input, Tooltip, Divider, Stack, Badge,
} from "../deps/ui";
import { alpha, styled } from "@mui/material/styles";
import CommonDropDown from "./CommonDropDown";
import {
  clearDropDownIdsAction, builderQueryAction,
  enableFilterAction, resetAction,
} from "../store/actions/httpactions";
import QueryBuilder, {
  defultValue, loadTree, mapToQueryBuilderFormat,
} from "./QueryBuilder";
import { useAppDispatch, useAppSelector } from "../store/storehook";

// ─── Styled Header Bar ────────────────────────────────────────────────────────

const HeaderBar = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(0.5, 1.5),
  marginBottom: theme.spacing(0.5),
  minHeight: 48,
  borderRadius: theme.spacing(0.5),
  background: theme.palette.secondary.main,
  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

// ─── Styled Header Icon Button ────────────────────────────────────────────────

const HeaderIconBtn = styled(IconButton)(({ theme }) => ({
  color: alpha(theme.palette.secondary.contrastText, 0.85),
  width: 28,
  height: 28,
  borderRadius: theme.spacing(1),
  transition: 'background 0.15s, color 0.15s',
  '&:hover': {
    background: alpha(theme.palette.secondary.contrastText, 0.12),
    color: theme.palette.secondary.contrastText,
  },
}));

// ─── Drawer Header ────────────────────────────────────────────────────────────

const DrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0.75, 1.5),
  background: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  position: 'sticky',
  top: 0,
  zIndex: 1,
}));

// ─── Breakpoints ─────────────────────────────────────────────────────────────

const breakPoints6 = { size: { xs: 6, md: 6 } };
const breakPoints12 = { size: { xs: 12, md: 12 } };

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PageHeader(props) {
  const {
    title, subTitle,
    icon,
    handleUpload, handleApply, handleTemplate,
    enableFilter, showQueryFilter = true,
  } = props;

  const dispatch = useAppDispatch();
  const [drawer, setDrawer] = useState(false);
  const [hasFilters, setHasFilters] = useState(false);  // badge on filter icon

  const fields = useAppSelector((e) => e.appdata.query?.fields);
  const setEnableFilter = useAppSelector((e) => enableFilter ?? e.appdata.enableFilter);
  const upload = useAppSelector((e) => handleUpload ?? e.appdata.fileConfig.upload);
  const template = useAppSelector((e) => handleTemplate ?? e.appdata.fileConfig.template);
  const applyFunc = useAppSelector((e) => handleApply ?? e.appdata.pageHeaderOption.apply);

  const [query, setQuery] = useState(() => defultValue());

  const handleReset = () => {
    setDrawer(false);
    setHasFilters(false);
    setQuery({ ...query, tree: loadTree(mapToQueryBuilderFormat(fields)) });
    dispatch(builderQueryAction({}));
    dispatch(resetAction(true));
  };

  const handleApplyFilter = () => {
    setHasFilters(true);
    setDrawer(false);
    applyFunc?.();
  };

  useEffect(() => {
    return () => {
      dispatch(clearDropDownIdsAction());
      dispatch(enableFilterAction(false));
      dispatch(builderQueryAction({}));
    };
  }, []);

  return (
    <>
      {/* ── Header Bar ── */}
      <HeaderBar elevation={0}>

        {/* Left — Title */}
        <Stack direction="row" alignItems="center" gap={1}>
          {/* {icon && (
            <Box sx={{
              color: 'secondary.contrastText',
              opacity: 0.85,
              display: 'flex',
              mt: 0.25,
            }}>
              {icon}
            </Box>
          )} */}
          <Box>
            <Typography sx={{
              color: 'secondary.contrastText',
              fontWeight: 700,
              fontSize: '0.9rem',
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
            }}>
              {title}
            </Typography>
            {subTitle && (
              <Typography sx={{
                color: alpha('#fff', 0.65),
                fontSize: '0.68rem',
                mt: 0.1,
              }}>
                {subTitle}
              </Typography>
            )}
          </Box>
        </Stack>

        {/* Right — Actions */}
        <Stack direction="row" alignItems="center" gap={0.5}>

          {typeof upload === "function" && (
            <Tooltip title="Upload Template" placement="bottom" arrow>
              <label htmlFor="icon-button-excel-file">
                <Input
                  style={{ display: 'none' }}
                  onClick={(e) => { e.target.value = null; }}
                  onChange={upload}
                  accept="image/*"
                  id="icon-button-excel-file"
                  type="file"
                />
                <HeaderIconBtn size="small" component="span" aria-label="upload">
                  <CloudUpload fontSize="small" />
                </HeaderIconBtn>
              </label>
            </Tooltip>
          )}

          {typeof template === "function" && (
            <Tooltip title="Download Template" placement="bottom" arrow>
              <HeaderIconBtn size="small" onClick={template} aria-label="download template">
                <FileCopy fontSize="small" />
              </HeaderIconBtn>
            </Tooltip>
          )}

          {(showQueryFilter && setEnableFilter) && (
            <Tooltip title="Filters" placement="bottom" arrow>
              <HeaderIconBtn size="small" onClick={() => setDrawer(true)}>
                <Badge
                  color="warning"
                  variant="dot"
                  invisible={!hasFilters}
                >
                  <FilterListIcon fontSize="small" />
                </Badge>
              </HeaderIconBtn>
            </Tooltip>
          )}

        </Stack>
      </HeaderBar>

      {/* ── Filter Drawer ── */}
      <Drawer
        anchor="right"
        keepMounted
        open={drawer}
        onClose={() => setDrawer(false)}
        sx={{
          zIndex: 'modal',
          '& .MuiDrawer-paper': {
            width: 360,
            boxShadow: '-4px 0 24px rgba(0,0,0,0.1)',
            border: 'none',
          },
        }}
      >
        <Box role="presentation" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

          {/* Drawer Header */}
          <DrawerHeader>
            <Stack direction="row" alignItems="center" gap={1}>
              <FilterListIcon fontSize="small" />
              <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                Filters
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" gap={0.5}>
              {hasFilters && (
                <Tooltip title="Reset filters" arrow>
                  <IconButton size="small" onClick={handleReset} sx={{ color: alpha('#fff', 0.75), '&:hover': { color: '#fff' } }}>
                    <RestartAlt fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              <IconButton size="small" onClick={() => setDrawer(false)} sx={{ color: alpha('#fff', 0.75), '&:hover': { color: '#fff' } }}>
                <Close fontSize="small" />
              </IconButton>
            </Stack>
          </DrawerHeader>

          {/* Drawer Body */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 1 }}>
            {setEnableFilter && (
              <CommonDropDown key="common-drop-down">
                <Grid item size={{ xs: 12, md: 12 }}>
                  <Divider sx={{ mb: 0.5, mt: 0.5 }} />
                </Grid>
                <Grid item size={{ xs: 12, md: 12 }}>
                  <QueryBuilder query={query} setQuery={setQuery} fields={fields} />
                </Grid>
              </CommonDropDown>
            )}
          </Box>

          {/* Drawer Footer — sticky action buttons */}
          <Box sx={{
            p: 1,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'grey.50',
            position: 'sticky',
            bottom: 0,
          }}>
            <Grid container spacing={1}>
              {applyFunc && (
                <Grid item {...breakPoints6}>
                  <Controls.Button
                    color="primary"
                    fullWidth
                    onClick={handleApplyFilter}
                    text="Apply"
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      boxShadow: '0 2px 6px rgba(25,118,210,0.25)',
                    }}
                  />
                </Grid>
              )}
              <Grid item {...(applyFunc ? breakPoints6 : breakPoints12)}>
                <Controls.Button
                  color="inherit"
                  fullWidth
                  onClick={handleReset}
                  text="Reset"
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    bgcolor: 'white',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                />
              </Grid>
            </Grid>
          </Box>

        </Box>
      </Drawer>
    </>
  );
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  icon: PropTypes.node,
  handleUpload: PropTypes.func,
  handleTemplate: PropTypes.func,
  handleApply: PropTypes.func,
  enableFilter: PropTypes.bool,
  showQueryFilter: PropTypes.bool,
};