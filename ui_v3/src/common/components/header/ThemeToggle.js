import useSettings from "../../../data_manager/useSettings";
import {THEMES} from "../../../data_manager/constants";
import {Switch} from "@mui/material";

export const ThemeToggle = () => {
  const {settings, saveSettings} = useSettings();
  return <Switch
      color="primary"
      edge="start"
      name="isPublic"
      selected
      value={settings.theme}
      onClick={()=>{
        const themeNew = settings.theme === THEMES.LIGHT? THEMES.NATURE: THEMES.LIGHT;
        saveSettings({...settings, theme: themeNew});
      }}
  />
};