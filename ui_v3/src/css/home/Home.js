import { makeStyles } from "@mui/styles";
import loginBG from "../../assets/images/login_bg.png";
import COLORS from "../../assets/theme.color";

console.log(loginBG);

const useStyles = makeStyles(() => ({
  particles: {
    height: "100vh",
  },

  leftBanner: {
    width: "100%",
    height: "100vh",
    left: 0,
    top: 0,
    background: `linear-gradient(180deg, rgba(49, 49, 49, 0.3) -4.74%, rgba(0, 0, 0, 0.55) 103.32%), url(${loginBG})`,
    backgroundSize: "cover",
  },
  bannerText: {
    color: COLORS.WHITE,
    fontSize: 27,
    lineHeight: 33,
    letterSpacing: "0.01em",
  },
  socialBar: {
    position: "absolute",
    bottom: 20,
    left: 125,
  },
  socialIcon: {
    fontSize: 15,
    marginLeft: 10,
    color: COLORS.WHITE,
  },
  linkText: {
    color: "#303468",
    fontSize: 16,
    fontWeight: 500,
    textDecoration:'none'
  },
  welcome_header: {
    position: "fixed",
    display: "flex",
    justifyContent: "center",
    width: "100vw",
    height: "100vh",
    zIndex: 5,
    fontSize: 30,
    letterSpacing: 0.3,
    fontWeight: 400,
  },
  sub_heading: {
    fontSize: 18,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    color: "#444444",
  },
  button_div: {
    display: "block",
    justify: "center",
  },
  login_button: {
    paddingTop: 20,
    paddingBottom: 20,
  },
}));

export default useStyles;
