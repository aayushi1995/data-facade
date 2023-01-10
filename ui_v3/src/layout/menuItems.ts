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
import HubIcon from "@mui/icons-material/Hub";
import StorefrontIcon from "@mui/icons-material/Storefront";
import {
  IconApplication,
  IconCertified,
  IconConnection,
  IconHistory,
  IconHome,
  IconInsights,
  IconJob,
  IconPackage,
  IconScheduled,
  IconTable,
} from "../assets/theme.icon";
const items = [
  {
    key: "/",
    name: "Home",
    icon: IconHome,
    url: "/",
  },
  {
    key: "data",
    name: "Data",
    url: "/data",
    icon: StorageOutlinedIcon,
    subMenu: [
      {
        key: "data",
        name: "Connections",
        url: "/data/connections",
        icon: IconConnection,
      },
      {
        key: "data",
        name: "All Tables",
        url: "/data/all",
        icon: IconTable,
      },
      {
        key: "data",
        name: "Certified",
        url: "/data/certified",
        icon: IconCertified,
      },
    ],
  },
  {
    key: "application",
    name: "Applications",
    url: "/application",
    icon: IconApplication,
    subMenu: [
      {
        key: "application",
        name: "Packages",
        url: "/application",
        icon: IconPackage,
      },
      {
        key: "application",
        name: "Scheduled",
        url: "/application/scheduled",
        icon: IconScheduled,
      },
      {
        key: "application",
        name: "History",
        url: "/application/execution-history",
        icon: IconHistory,
      },
      {
        key: "application",
        name: "Jobs &Logs ",
        url: "/application/jobs",
        icon: IconJob,
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
    icon: IconInsights,
    url: "/insights",
  },
];

export default items;
