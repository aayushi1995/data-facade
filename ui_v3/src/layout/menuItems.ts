import { HomeMaxOutlined } from "@mui/icons-material";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import StorefrontIcon from "@mui/icons-material/Storefront";
import HomeIcon from '@mui/icons-material/Home';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import {
  IconApplication,
  IconCertified,
  IconConnection,
  IconData,
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
    icon: IconData,
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
    icon: IconApplication,
    subMenu: [
      {
        key: "application",
        name: "APP Builder",
        url: "/application/app-builder",
        icon: AddBusinessIcon,
      },
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
