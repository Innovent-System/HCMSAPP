import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import {
  GridView as GridViewIcon,
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterListIcon,
  CloudUpload, FileCopy,
  Close
} from "../deps/ui/icons";
import PropTypes from "prop-types";
import Controls from "./controls/Controls";
import {
  Paper, Typography, Grid, Drawer, Box, Accordion, AccordionSummary,
  IconButton, AccordionDetails, Input, Tooltip
} from "../deps/ui";
import CommonDropDown from "./CommonDropDown";
import {
  clearDropDownIdsAction,
  builderQueryAction,
  enableFilterAction,
  resetAction,
  showDropDownFilterAction,
} from "../store/actions/httpactions";
import QueryBuilder, {
  defultValue,
  loadTree,
  queryValue,
} from "./QueryBuilder";
import { useAppDispatch, useAppSelector } from "../store/storehook";

const useStyles = makeStyles((theme) => ({
  Root: {
    padding: theme.spacing(1, 2),
    marginBottom: theme.spacing(2),
    background: theme.palette.secondary.main + "!important",
    "& .left": {
      textAlign: "left",
      "& h1": {
        color: theme.palette.secondary.contrastText,
        fontWeight: 'bold',
        fontSize: 20
      }
    },
    "& .right": {
      textAlign: "right",
      '& button': {
        color: theme.palette.secondary.contrastText,
      }
    },
    '& .MuiIconButton-root:hover': {
      boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
      borderRadius: 5
    }
  },
  Drawer: {
    "& .MuiAccordion-root": {
      margin: theme.spacing(0.5),
      "& .MuiAccordionSummary-root": {
        "&.Mui-expanded": {
          minHeight: 0,
          color: theme.palette.secondary.contrastText,
          backgroundColor: theme.palette.secondary.main,
          "& .MuiAccordionSummary-expandIconWrapper": {
            color: theme.palette.secondary.contrastText,
          },
        },
        "& .MuiAccordionSummary-content": {
          "&.Mui-expanded": {
            margin: "15px 0",
          },
          "& svg": {
            marginRight: "5px",
          },
        },
      },
      "& .MuiAccordionDetails-root": {
        padding: 0,
        "& .MuiList-root": {
          padding: 0,
          "& .MuiListItemIcon-root": {
            minWidth: "30px",
          },
        },
      },
    },
  },
}));

function trigger(eventType, data) {
  const event = new CustomEvent(eventType, { detail: data });
  document.dispatchEvent(event);
}

export default function PageHeader(props) {
  const classes = useStyles();
  const { title, subTitle, icon, handleUpload, handleTemplate, enableFilter, showQueryFilter = true } = props;
  const dispatch = useAppDispatch();
  const [drawer, setDrawer] = useState(false);

  const fields = useAppSelector((e) => e.appdata.query?.fields ?? {});
  const setEnableFilter = useAppSelector(
    (e) => enableFilter ?? e.appdata.enableFilter
  );

  const upload = useAppSelector(e => handleUpload ?? e.appdata.fileConfig.upload)
  const template = useAppSelector(e => handleTemplate ?? e.appdata.fileConfig.template)

  const [query, setQuery] = useState(() => defultValue());

  const handleReset = () => {
    setDrawer(false);
    setQuery({ ...query, tree: loadTree(queryValue) });
    dispatch(builderQueryAction({}));
    dispatch(resetAction(true));
  };

  useEffect(() => {
    return () => {
      dispatch(clearDropDownIdsAction());
      dispatch(enableFilterAction(false));
      dispatch(builderQueryAction({}));

      // dispatch(showDropDownFilterAction({
      //   company: true,
      //   country: false,
      //   state: false,
      //   city: false,
      //   area: false,
      //   department: false,
      //   group: false,
      //   designation: false,
      //   employee: false
      // }))
    };
  }, []);

  return (
    <>
      <Grid
        component={Paper}
        evaluation={0}
        container
        justifyContent="space-between"
        alignItems="center"
        className={`${classes.Root} page-heading`}>
        <Grid item className="left">
          <Typography variant="h1"> {title} </Typography>
        </Grid>
        <Grid item className="right">

          {typeof upload === "function" && (
            <Tooltip title="Upload Template" placement="top" arrow>
              <label htmlFor="icon-button-excel-file">
                <Input style={{ display: 'none' }} onClick={function (e) { e.target.value = null }} onChange={upload} accept="image/*" id="icon-button-excel-file" type="file" />
                <IconButton sx={{ color: "#fff" }} size='small' aria-label="upload picture" component="span">
                  <CloudUpload />
                </IconButton>
              </label>
            </Tooltip>
          )}

          {typeof template === "function" && (
            <Tooltip title="Download Template" placement="top" arrow>
              <IconButton sx={{ color: "#fff" }} onClick={template} size='small' aria-label="Download Template" component="span">
                <FileCopy fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {showQueryFilter && (
            <Tooltip title="Filter" placement="top" arrow>
              <IconButton size="small" onClick={() => setDrawer(true)}>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          )}


        </Grid>
      </Grid>
      <Drawer
        className={classes.Drawer}
        anchor={"right"}
        keepMounted
        open={drawer}

        onClose={() => setDrawer(!drawer)}>
        <Box role="presentation" p={1} width={400}>
          {/* <IconButton size="small">
            <Close />
          </IconButton> */}
          {setEnableFilter && (
            // <Accordion  elevation={0}>
            //   <AccordionSummary
            //     expandIcon={<ExpandMoreIcon />}
            //     aria-controls="panel11a-content"
            //     id="panel1a-header">

            //     <Typography> Filter</Typography>
            //   </AccordionSummary>
            //   <AccordionDetails sx={{ padding: 5 }} >
            //   </AccordionDetails>
            // </Accordion>
            <CommonDropDown>
              <Grid item sm={12} md={12} lg={12}>
                <QueryBuilder query={query} setQuery={setQuery} fields={fields} />
              </Grid>
              <Grid item sm={12}  md={12} lg={12}>
                <Controls.Button
                  color="inherit"
                  fullWidth={true}
                  onClick={handleReset}
                  text="Cancel"
                />
              </Grid>

            </CommonDropDown>
          )}

        </Box>
        {/* <Controls.Button text='Apply' onClick={handleApply} /> */}

      </Drawer>
    </>
  );
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  icon: PropTypes.node,
  handleAdd: PropTypes.func,
  handleUpload: PropTypes.func,
  handleTemplate: PropTypes.func,
  enableFilter: PropTypes.bool,
  showQueryFilter: PropTypes.bool,
};
