import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import InsertChartOutlinedSharpIcon from "@mui/icons-material/InsertChartOutlinedSharp";
import CollectionsIcon from "@mui/icons-material/Collections";
import TableViewIcon from "@mui/icons-material/TableView";
import PivotTableChartIcon from "@mui/icons-material/PivotTableChart";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import LockClockIcon from "@mui/icons-material/LockClock";
import HistoryIcon from "@mui/icons-material/History";
import HubIcon from '@mui/icons-material/Hub';
import StorefrontIcon from '@mui/icons-material/Storefront';
const items = [
  {
    key: "/",
    name: "Home",
    icon: HomeOutlinedIcon,
    url: "/",
  },
  {
    key: "data",
    name: "Data",
    icon: StorageOutlinedIcon,
    subMenu: [
      {
        key: "data",
        name: "Connections",
        url: "/data/connections",
        icon: CollectionsIcon,
      },
      {
        key: "data",
        name: "All Tables",
        url: "/data/all",
        icon: TableViewIcon,
      },
      {
        key: "data",
        name: "Certified",
        url: "/data/certified",
        icon: PivotTableChartIcon,
      },
    ],
  },
  {
    key: "application",
    name: "Applications",
    icon: GridViewOutlinedIcon,
    subMenu: [
      {
        key: "application",
        name: "Packages",
        url: "/application",
        icon: AccountTreeIcon,
      },
      {
        key: "application",
        name: "Scheduled",
        url: "/application/scheduled",
        icon: LockClockIcon,
      },
      {
        key: "application",
        name: "History",
        url: "/application/execution-history",
        icon: HistoryIcon,
      },
      {
        key: "application",
        name: "Jobs &Logs ",
        url: "/application/jobs",
        icon: HubIcon,
      },
      {
        key: "application",
        name: "Marketplace",
        url: "/application/marketplace",
        icon: StorefrontIcon,
      },
    ],
  },

  {
    key: "insights",
    name: "Insights",
    icon: InsertChartOutlinedSharpIcon,
    url: "/insights",
  },
];

export default items;
