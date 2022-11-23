import { TabContext, TabPanel } from "@mui/lab";
import { Box, Divider, Tab, Tabs } from "@mui/material";
import React from "react";
import { generatePath, Redirect, Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import { DATA_COLUMN_VIEW, DATA_TABLE_TAB, DATA_TABLE_TAB_ACTION_INSTANCES, DATA_TABLE_TAB_COLUMN_VIEW, DATA_TABLE_TAB_DEFAULT, DATA_TABLE_TAB_SUMMARY, DATA_TABLE_TAB_TABLE_VIEW, DATA_TABLE_VIEW } from "../../common/components/header/data/DataRoutesConfig";
import { ReactQueryWrapper } from "../../common/components/ReactQueryWrapper";
import useStyles from "../../css/table_details/TableDetails";
import { useRetreiveData } from "../../data_manager/data_manager";
import labels from "../../labels/labels";
import ColumnDetails from "../column_details/ColumnDetails";
import ActionInstances from "../customizations/components/ActionInstances";
import TableRowExpanded from "../table_browser/components/TableRowExpanded";
import ColumnView from "./components/ColumnView";
import TableView from "./components/TableView";

export const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

export const TABLE_SUMMARY = 0;
export const TABLE_COLUMN_VIEW = 1;
export const TABLE_QUICK_VIEW = 2;
export const TABLE_QUICK_STATS = 3;
export const TABLE_CHECKS = 4;
export const TABLE_CLEAN_ACTIONS = 5;
export const TABLE_ACTION_INSTANCES = 6;
// export const INTERMIDIARY_TABLES = 7;

const URL_TAB_INFO = [
  {
    TabLabel: "Summary",
    ViewName: DATA_TABLE_TAB_SUMMARY
  },
  {
    TabLabel: "Table View",
    ViewName: DATA_TABLE_TAB_TABLE_VIEW
  },
  {
    TabLabel: "Column View",
    ViewName: DATA_TABLE_TAB_COLUMN_VIEW
  },

  // **** Action Instance And Intermediary Tabs are comnt out for temporary bcz these are not required now
  {
    TabLabel: "Recent Usages",
    ViewName: DATA_TABLE_TAB_ACTION_INSTANCES
  },
  // {
  //   TabLabel: "Intermediary Tables",
  //   ViewName: DATA_TABLE_TAB_INTERMEDIARY_TABLES
  // }
]

interface MatchParams {
  TableName: string,
  ViewName: string
}

const TableDetailsView = () => {
  const classes = useStyles();
  const match = useRouteMatch<MatchParams>();
  const history = useHistory()
  const tabState = URL_TAB_INFO.find(info => info.ViewName === match.params.ViewName)?.ViewName!

  const handleTabChange = (event: React.SyntheticEvent<Element, Event>, newValue: any) => {
    history.replace(generatePath(DATA_TABLE_TAB, { ...match.params, ViewName: newValue }))
  };

  const result = useRetreiveData(labels.entities.TableProperties, {
    filter: {
      UniqueName: match.params.TableName,
    }
  });

  const data = result.data;

  return (
    <TabContext value={tabState}>
      <React.Fragment>
        <Box sx={{ display: "flex", flexDirection: "column"}}>
          <Box className={classes.grid_root}>
            <Tabs
              indicatorColor="primary"
              scrollButtons="auto"
              textColor="primary"
              variant="scrollable"
              onChange={handleTabChange}
              value={tabState}
            >
              {
                URL_TAB_INFO.map((info, index) => <Tab key={info.ViewName} value={info.ViewName} label={info.TabLabel} {...a11yProps(index)} />)
              }
            </Tabs>
            <Divider />
          </Box>
          <Box className={classes.grid_root}>
            <ReactQueryWrapper {...result}>
              {() => (
                <Box sx={{ mt: 3 }}>
                  <TabPanel value={DATA_TABLE_TAB_SUMMARY}>
                    <TableRowExpanded
                      TableId={data[0].Id}
                    />
                  </TabPanel>
                  <TabPanel value={DATA_TABLE_TAB_TABLE_VIEW}>
                    <TableView TableId={data[0].Id}/>
                  </TabPanel>
                  <TabPanel value={DATA_TABLE_TAB_COLUMN_VIEW}>
                    <ColumnView TableId={data[0].Id} />
                  </TabPanel>
                  {/* **** Action Instance And Intermediary Tabs are comnt out for temporary bcz these are not required now */}
                  <TabPanel value={DATA_TABLE_TAB_ACTION_INSTANCES}>
                    <ActionInstances TableId={data[0].Id} />
                  </TabPanel>
                  {/* <TabPanel value={DATA_TABLE_TAB_INTERMEDIARY_TABLES}>
                      <IntermediaryTables TableId={data[0].Id}/>
                  </TabPanel> */}
                </Box>
              )}
            </ReactQueryWrapper>
          </Box>
        </Box>
      </React.Fragment>
    </TabContext>
  );
};

const TableDetails = () => {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={DATA_COLUMN_VIEW} component={ColumnDetails}/>
      <Redirect exact from={DATA_TABLE_VIEW} to={DATA_TABLE_TAB_DEFAULT}/>
      <Route path={DATA_TABLE_TAB} component={TableDetailsView} />
    </Switch>
  );
};

export default TableDetails;
