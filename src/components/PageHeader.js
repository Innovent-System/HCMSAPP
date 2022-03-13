import React, { useState, useEffect } from 'react'
import { GridView as GridViewIcon, ExpandMore as ExpandMoreIcon, FilterList as FilterListIcon } from '../deps/ui/icons';
import PropTypes from 'prop-types';
import Controls from './controls/Controls';
import { Paper, Typography, Grid, Drawer, Box, Accordion, AccordionSummary, IconButton, AccordionDetails, TextField } from '../deps/ui'
import CommonDropDown from './CommonDropDown';
import { useDispatch } from 'react-redux';
import { SET_FILTERBAR, CLEAR_COMMON_DD_IDS } from '../store/actions/types'

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

export default function PageHeader(props) {
  const { title, subTitle, icon, handleUpload, applyFilter, resetFilter, enableFilter } = props;
  const dispatch = useDispatch();
  const [drawer, setDrawer] = useState(false);
  const [reset, setReset] = useState(false);
  const handleReset = () => {
    setReset(!reset);
    dispatch({ type: SET_FILTERBAR, payload: { isApply: false, isReset: true } });
    dispatch({ type: CLEAR_COMMON_DD_IDS });
  }
  const handleApply = () => {
    setReset(false);
    dispatch({ type: SET_FILTERBAR, payload: { isApply: true, isReset: false } })
  }
  useEffect(() => {

    return () => {
      dispatch({ type: CLEAR_COMMON_DD_IDS });
      dispatch({ type: SET_FILTERBAR, payload: { isApply: false, isReset: false } });
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
            {enableFilter && <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel11a-content"
                id="panel1a-header">
                <GridViewIcon />
                <Typography> Filter:</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <CommonDropDown reset={reset} />
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
          <Controls.Button text='Apply' onClick={handleApply} />
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
