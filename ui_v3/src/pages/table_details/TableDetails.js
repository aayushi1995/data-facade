import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { Box, Divider, Grid, Tab, Tabs } from "@material-ui/core";
import ColumnView from "./components/ColumnView";
import ColumnDetails from "./../column_details/ColumnDetails";
import Checks, { useTablePropertiesWithChecksQuery } from "./components/Checks";
import QuickStatsNewTemp, {
  useTablePropertiesWithProfilingActionsQuery,
} from "./components/QuickStatsNewTemp";
import DataCleanActions, {
  useActionInstanceWithDetailQuery,
} from "./components/DataCleanActions";
import QuickView, {
  useActionExecution1000RowsQuery,
} from "./components/QuickView.tsx";
import ActionInstances from "../customizations/components/ActionInstances";
import labels from "./../../labels/labels";
import { useRetreiveData } from "./../../data_manager/data_manager";
import useStyles from "./../../css/table_details/TableDetails";
import TableRowExpanded from "../table_browser/components/TableRowExpanded";
import { PageHeader } from "../../common/components/header/PageHeader";
import { TableWrapper } from "../../common/components/TableWrapper";
import IntermediaryTables from "./components/IntermediaryTables";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
};

const a11yProps = (index) => {
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
export const INTERMIDIARY_TABLES = 7;
const TableDetailsView = (props) => {
  const classes = useStyles();
  const match = useRouteMatch();
  const initialTabState =
    props.location !== undefined &&
    props.location.state !== undefined &&
    props.location.state.tabIndex !== undefined
      ? props.location.state.tabIndex
      : TABLE_SUMMARY;

  const [tabState, setTabState] = React.useState(initialTabState);

  const handleTabChange = (event, newValue) => {
    setTabState(newValue);
  };

  const result = useRetreiveData(labels.entities.TableProperties, {
    filter: {
      UniqueName: match.params.tableUniqueName,
    },
    withTableDetail: true,
  });
  const data = result.data;
  const tableUniqueName = data?.[0]?.TableProperties?.UniqueName;
  const tableId = data?.[0]?.TableProperties?.Id;
  useActionExecution1000RowsQuery(tableId);
  useTablePropertiesWithProfilingActionsQuery(tableId);
  useTablePropertiesWithChecksQuery(tableId);
  useActionInstanceWithDetailQuery(tableId);
  return (
    <React.Fragment>
      <Grid container spacing={0}>
        <Grid item xs={12} className={classes.grid_root}>
          <Tabs
            indicatorColor="primary"
            scrollButtons="auto"
            textColor="primary"
            variant="scrollable"
            onChange={handleTabChange}
            value={tabState}
          >
            <Tab label="Summary" {...a11yProps(0)} />
            <Tab label="Columns" {...a11yProps(1)} />
            <Tab label="Quick View" {...a11yProps(2)} />
            <Tab label="Quick stats" {...a11yProps(3)} />
            <Tab label="Checks" {...a11yProps(4)} />
            <Tab label="Data Clean Actions" {...a11yProps(5)} />
            <Tab label="Action Instances" {...a11yProps(6)} />
            <Tab label="Intermediary Tables" {...a11yProps(7)}/>
          </Tabs>
          <Divider />
        </Grid>
      
      <Grid item xs={12} className={classes.grid_root}>
      <TableWrapper {...result}>
        {() => (
          <Box sx={{ mt: 3 }}>
            <Grid>
              <Grid item xs={12}>
                <TabPanel value={tabState} index={TABLE_SUMMARY}>
                  <TableRowExpanded
                    table={data[0].TableProperties}
                    TableId={data[0].TableProperties.Id}
                    TableName={data[0].TableProperties.UniqueName}
                    TableProviderInstanceId={
                      data[0].TableProperties.ProviderInstanceID
                    }
                  />
                </TabPanel>
                <TabPanel value={tabState} index={TABLE_COLUMN_VIEW}>
                  <ColumnView tableData={data[0]} />
                </TabPanel>
                <TabPanel value={tabState} index={TABLE_QUICK_VIEW}>
                  <QuickView
                    tableUniqueName={data[0].TableProperties.UniqueName}
                    tableId={data[0].TableProperties.Id}
                  />
                </TabPanel>
                <TabPanel value={tabState} index={TABLE_QUICK_STATS}>
                  <QuickStatsNewTemp tableId={data[0].TableProperties.Id} />
                </TabPanel>
                <TabPanel value={tabState} index={TABLE_CHECKS}>
                  <Checks tableId={data[0].TableProperties.Id} />
                </TabPanel>
                <TabPanel value={tabState} index={TABLE_CLEAN_ACTIONS}>
                  <DataCleanActions tableId={data[0].TableProperties.Id} />
                </TabPanel>
                <TabPanel value={tabState} index={TABLE_ACTION_INSTANCES}>
                  <ActionInstances tableId={data[0].TableProperties.Id} />
                </TabPanel>
                <TabPanel value={tabState} index={INTERMIDIARY_TABLES}>
                    <IntermediaryTables table={data[0].TableProperties}/>
                </TabPanel>

              </Grid>
            </Grid>
          </Box>
        )}
      </TableWrapper>
      </Grid>
      </Grid>
    </React.Fragment>
  );
};

const TableDetails = () => {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route
        path={`${match.path}/:columnUniqueName`}
        component={ColumnDetails}
      />
      <Route path={`${match.path}`} component={TableDetailsView} />
    </Switch>
  );
};

export default TableDetails;
