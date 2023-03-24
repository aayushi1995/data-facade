
import useSlackInstallURL from "./useSlackInstallURL";

function SlackInstallButton() {
    const { url } = useSlackInstallURL()

    return url ? <a href={url}>Connect Slack</a> : <>Loading...</>
    
}

export default SlackInstallButton;