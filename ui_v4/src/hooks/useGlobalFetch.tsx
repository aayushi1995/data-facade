import { userSettingsSingleton } from "@/settings/userSettingsSingleton";

const accessToken = userSettingsSingleton.token;
const globalFetch = (url: string, method = "GET", data = {}) => {
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
    };

    const options: any = {
        method,
        headers,
    };

    if (method === "POST" || method === "PUT") {
        options.body = JSON.stringify(data);
    }

    return fetch(url, options).then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    });
};

export default globalFetch


