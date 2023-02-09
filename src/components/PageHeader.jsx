import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import {
  GridView as GridViewIcon,
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterListIcon,
  CloudUpload
} from "../deps/ui/icons";
import PropTypes from "prop-types";
import Controls from "./controls/Controls";
import {
  Paper, Typography, Grid, Drawer, Box, Accordion, AccordionSummary,
  IconButton, AccordionDetails, Input, Tooltip
} from "../deps/ui";
import CommonDropDown from "./CommonDropDown";
import { useSelector, useDispatch } from "react-redux";
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
  const { title, subTitle, icon, handleUpload, handleTemplate, enableFilter } = props;
  const dispatch = useDispatch();
  const [drawer, setDrawer] = useState(false);

  const fields = useSelector((e) => e.appdata.query.fields ?? {});
  const setEnableFilter = useSelector(
    (e) => enableFilter ?? e.appdata.enableFilter
  );

  const [query, setQuery] = useState(() => defultValue());

  const handleReset = () => {
    setQuery({ ...query, tree: loadTree(queryValue) });
    dispatch(builderQueryAction({}));
    dispatch(resetAction(true));
  };

  useEffect(() => {
    return () => {
      dispatch(clearDropDownIdsAction);
      dispatch(enableFilterAction(false));
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

          {typeof handleUpload === "function" && (
            <Tooltip title="Upload Template" placement="top" arrow>
              <label htmlFor="icon-button-excel-file">
                <Input style={{ display: 'none' }} onChange={handleUpload} accept="image/*" id="icon-button-excel-file" type="file" />
                <IconButton size='small' aria-label="upload picture" component="span">
                  <CloudUpload />
                </IconButton>
              </label>
            </Tooltip>
          )}
          <Tooltip title="Filter" placement="top" arrow>
            <IconButton size="small" onClick={() => setDrawer(true)}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>

        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item>
          <Drawer
            className={classes.Drawer}
            anchor={"right"}
            open={drawer}
            onClose={() => setDrawer(!drawer)}>
            <Box role="presentation" width={600}>
              {setEnableFilter && (
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel11a-content"
                    id="panel1a-header">
                    <GridViewIcon />
                    <Typography> Filter:</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <CommonDropDown />
                  </AccordionDetails>
                </Accordion>
              )}

              <QueryBuilder query={query} setQuery={setQuery} fields={fields} />
            </Box>
            {/* <Controls.Button text='Apply' onClick={handleApply} /> */}
            <Controls.Button
              color="primary"
              onClick={handleReset}
              text="Reset"
            />
          </Drawer>
        </Grid>
      </Grid>
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
};
