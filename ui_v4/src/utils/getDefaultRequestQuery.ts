import { userSettingsSingleton } from "@settings/userSettingsSingleton";

export const  getDefaultRequestQuery = () => {
    var emailQuery = `?email=${userSettingsSingleton.userEmail}`
    return emailQuery
}
