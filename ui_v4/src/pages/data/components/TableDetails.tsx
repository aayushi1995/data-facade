import { useRetreiveData } from "@/api/dataManager";
import { ReactQueryWrapper } from "@/components/ReactQueryWrapper/ReactQueryWrapper";
import { labels } from "@/helpers/constant";
import React, { useState } from "react";
import { generatePath, Route, useNavigation, useMatch, Routes } from "react-router-dom";
import TableRowExpanded from "./TableRowExpanded";

// import ColumnDetails from "../column_details/ColumnDetails";
// import ActionInstances from "../customizations/components/ActionInstances";

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



interface MatchParams {
  TableName: string,
}

const TableDetailsView = () => {
  const match = useMatch("/data/:tableName");

  const result = useRetreiveData(labels.entities.TableProperties, {
    filter: {
      UniqueName: match?.params.tableName,
    }
  });

  const data = result.data;
  return (
      <React.Fragment>
        <div>
          <div>
            <ReactQueryWrapper {...result}>
                <div>
                  {data &&
                    <TableRowExpanded
                      TableId={data[0] && data[0].Id}
                    />
                  }
                </div>
            </ReactQueryWrapper>
            
          </div> 
        </div>
      </React.Fragment>
  );
};

const TableDetails = () => {
  const match = useMatch("/data/:tableName");
  return (
    <>
    <Routes>
      <Route path={":tableName"} element={<TableDetailsView/>} />
    </Routes>
    </>
  );
};

export default TableDetails;
