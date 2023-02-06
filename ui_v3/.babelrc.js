const plugins = [
    [
   "babel-plugin-import",
      {
   libraryName: "@mui/material",
   libraryDirectory: "",
   camel2DashComponentName: false,
      },
   "core",
    ],
    [
   "babel-plugin-direct-import",
      { modules: ["@mui/material", "@mui/icons-material"] },
    ],
    [
   "babel-plugin-import",
      {
   libraryName: "@mui/icons-material",
   libraryDirectory: "",
   camel2DashComponentName: false,
      },
   "icons",
    ],
    ["import", {
   "libraryName": "echarts",
   "libraryDirectory": "src/components"
    }],
    ["import", {
   "libraryName": "xlsx",
   "libraryDirectory": "",
   "camel2DashComponentName": false
    }],
   "equire"
  ];
  
  module.exports = { plugins };