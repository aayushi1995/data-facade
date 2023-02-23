import { getUniqueId } from "./getUniqueId"
import { userSettingsSingleton } from "@settings/userSettingsSingleton";

export const  getDefaultRequestQuery = () => {
    var emailQuery = `?email=${userSettingsSingleton.userEmail}`
    var requestId = `&requestId=${getUniqueId()}`
    return emailQuery + requestId
}
