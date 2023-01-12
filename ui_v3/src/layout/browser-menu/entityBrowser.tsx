import * as React from 'react';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import { useQuery } from 'react-query';
import { fetchEntityBrowser } from '../../data_manager/data_manager';
import { useHistory } from 'react-router-dom';
import { Default } from '../../assets/theme.icon';
import { makeStyles } from '@mui/styles';
import { BROWSER_ICONS } from '../../data_manager/constants';
import CircularProgress from '@mui/material/CircularProgress/CircularProgress';

interface TreeViewerProps {
  type?: 'data' | 'packages' | 'dashboards';
}

const useStyles = makeStyles({
  root: {
    "& .MuiTreeItem-root": {
      "& > .MuiTreeItem-content": {
        marginTop: 8,
        padding: 3
      }
    }
  }
});

const NAVIGATE_URL = {
  connection: "/data/connections/detail",
  table: "/data/all/table-detail",
  application: "/application/detail",
  action: "/application/edit-action",
  dashboard: "/insights/dashboard",
  flow: "/application/edit-workflow",
};


const EntityBrowser: React.FunctionComponent<TreeViewerProps> = ({ type }) => {
  const classes = useStyles();
  const [treeData, setTreeData] = React.useState<any>({})
  const [loader, setLoader] = React.useState<any>({})
  const [expandedNodes, setExpandedNodes] = React.useState<string[]>([])
  let history = useHistory();
  const { data: entityBrowsers, error, isLoading } = useQuery(['entityBrowser', type], () => fetchEntityBrowser(type))

  const fetchNodeData = (path: string, item?: any) => {
    setLoader((prevState: any) => ({
      ...prevState,
      [path]: true,
    }));
    fetchEntityBrowser(path).then((res) => {
      
      res.length === 1 && fetchNodeData(res[0]?.path, res[0])
      
      checkIfExpanded(path)
      
      setLoader((prevState: any) => ({
        ...prevState,
        [path]: false,
      }));
      setTreeData((prevState: any) => ({
        ...prevState,
        [path]: res,
      }));
    });

    if (item) {
      navigate(item);
    }
  };

  const checkIfExpanded = (nodeId: string) => {
    if (expandedNodes.includes(nodeId)) {
      const index = expandedNodes.indexOf(nodeId);
      setExpandedNodes((oldState:any) => oldState.splice(index, 1))
    }
    else {
      setExpandedNodes((oldState:any) => ([...oldState, nodeId]))
    }
  }

  

  const navigate = (item: any, hideparam = false) => {
    if (NAVIGATE_URL.hasOwnProperty(item.type)) {
      const URL = `${NAVIGATE_URL[`${item.type}`]}/${item.type === "table" ? item.name : item.id}${!hideparam ? `?source=browser&name=${item.name}` : ``}`;
      history.push(URL)
    }
  }
  const renderIcon = (item: any) => {
    if (BROWSER_ICONS.hasOwnProperty(item.name)) {
      const Icon = BROWSER_ICONS[item.name]
      return <span><Icon /></span>
    } else return <Default />
  }

  

  const renderTree = (items: any) => {
    return items.map((item: any) => ([
      <TreeItem
        icon={renderIcon(item)}
        key={item.id}
        onClick={() =>
          item.IsExpandable
            ? fetchNodeData(item.path, item)
            : navigate(item, item.type === "dashboard" ? false : true)
        }
        nodeId={item.path}
        label={item.name}
      >
        {item.IsExpandable && treeData[item.path] ? (renderTree(treeData[item.path])
        ) : null}
      </TreeItem>, loader[item.path] && <CircularProgress size={15} />,]
    ));
  };

  return (
    <TreeView
      aria-label="file system navigator"
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ p: 2, pt: 0, flexGrow: 1, overflowY: 'auto' }}
      multiSelect={false}
      expanded={expandedNodes}
    >
      {isLoading && <CircularProgress size={30} />}
      {entityBrowsers && renderTree(entityBrowsers)}
    </TreeView>
  );
}

export default EntityBrowser