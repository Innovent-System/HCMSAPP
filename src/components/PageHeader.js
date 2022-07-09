import React, { useState, useEffect } from 'react'
import { GridView as GridViewIcon, ExpandMore as ExpandMoreIcon, FilterList as FilterListIcon } from '../deps/ui/icons';
import PropTypes from 'prop-types';
import Controls from './controls/Controls';
import { Paper, Typography, Grid, Drawer, Box, Accordion, AccordionSummary, IconButton, AccordionDetails, TextField } from '../deps/ui'
import CommonDropDown from './CommonDropDown';
import { useSelector, useDispatch } from 'react-redux';
import { clearDropDownIdsAction, builderQueryAction,enableFilterAction,resetAction } from '../store/actions/httpactions'
import QueryBuilder, { defultValue, loadTree, queryValue } from './QueryBuilder'

const DrawerStyle = {
  Drawer: {
    "& .MuiAccordion-root": {
      boxShadow: "none",
      "&.Mui-expanded": {
        margin: 0,
      },
      "& .MuiAccordionSummary-root": {
        "&.Mui-expanded": {
          minHeight: 0,
          backgroundColor: "#eee",
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
};

function trigger(eventType, data) {
  const event = new CustomEvent(eventType, { detail: data });
  document.dispatchEvent(event);
}

export default function PageHeader(props) {
  const { title, subTitle, icon, handleUpload, enableFilter } = props;
  const dispatch = useDispatch()
  const [drawer, setDrawer] = useState(false);

  const fields = useSelector(e => e.appdata.query.fields ?? {});
  const setEnableFilter = useSelector(e => enableFilter ?? e.appdata.enableFilter);

  const [query, setQuery] = useState(() => defultValue());

  const handleReset = () => {
    setQuery({ ...query, tree: loadTree(queryValue) });
    dispatch(builderQueryAction({}));
    dispatch(resetAction(true));
  }

  useEffect(() => {

    return () => {
      dispatch(clearDropDownIdsAction);
      dispatch(enableFilterAction(false));
    }
  }, [])


  return (
    <>
      <Grid component={Paper} evaluation={5} container justifyContent="space-between" alignItems="center" className='page-heading'>
        <Grid item className='left' ><Typography variant="h1"> {title} </Typography></Grid>
        <Grid item className='right'>
          {typeof handleUpload === "function" && <Controls.Button onClick={handleUpload} text="+ Upload" />}
          <IconButton onClick={() => setDrawer(true)}>
            <FilterListIcon />
          </IconButton>
        </Grid>

      </Grid>
      <div className="filterbar">
        <Drawer
          sx={DrawerStyle.Drawer}
          anchor={"right"}
          open={drawer}
          onClose={() => setDrawer(!drawer)}>
          <Box
            sx={{ width: 250, mb: 'auto' }}
            role="presentation"
            //onClick={toggleSidebar("right", false)}
            onKeyDown={() => setDrawer(!drawer)}>
            {setEnableFilter && <Accordion>
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
            </Accordion>}
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel12a-content"
                id="panel2a-header">
                <GridViewIcon />
                <Typography> Amount</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div style={{ padding: 15 }}>
                  <TextField
                    label="From"
                    id="outlined-size-small"
                    defaultValue="4200"
                    size="small"
                    style={{ marginBottom: 15 }}
                  />
                  <TextField
                    label="To"
                    id="outlined-size-small"
                    defaultValue="4600"
                    size="small"
                  />
                </div>
              </AccordionDetails>
            </Accordion>
          </Box>
          <QueryBuilder query={query} setQuery={setQuery} fields={fields} />
          {/* <Controls.Button text='Apply' onClick={handleApply} /> */}
          <Controls.Button color='secondary' onClick={handleReset} text='Reset' />
        </Drawer>
      </div>
    </>
  )
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  icon: PropTypes.node,
  handleAdd: PropTypes.func,
  enableFilter: PropTypes.bool
};