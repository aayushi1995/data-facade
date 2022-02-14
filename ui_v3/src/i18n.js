import i18n from "i18next";
import Backend from "i18next-xhr-backend";
import {initReactI18next} from "react-i18next";

i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
        lng: "en",
        fallbackLng: "en",
        debug: true,
        backend: {
            loadPath: "/translations/{{lng}}.json",
        },
        ns: ["translations"],
        preload: ["en", "de"],
        defaultNS: "translations",
        keySeparator: false,
        interpolation: {
            escapeValue: false
        },
        react: {
            wait: true,
        },
    });

export default i18n;