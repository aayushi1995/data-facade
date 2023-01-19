import ActionParameterDefinitionAttribute from '../enums/ActionParameterDefinitionAttribute.js'
import ActionParameterDefinitionDatatype from '../enums/ActionParameterDefinitionDatatype.js'
import ActionParameterDefinitionInputType from '../enums/ActionParameterDefinitionInputType.js'
import ActionParameterDefinitionTag from '../enums/ActionParameterDefinitionTag.js'
import ActionParameterDefinitionType from '../enums/ActionParameterDefinitionType.js'
import TemplateLanguage from '../enums/TemplateLanguage.js'

const InputMap = {
    [TemplateLanguage.PYTHON]: {
        [ActionParameterDefinitionInputType.STRING]: {
            [ActionParameterDefinitionAttribute.TAG]: ActionParameterDefinitionTag.OTHER,
            [ActionParameterDefinitionAttribute.DATATYPE]: ActionParameterDefinitionDatatype.STRING,
        },
        [ActionParameterDefinitionInputType.BOOLEAN]: {
            [ActionParameterDefinitionAttribute.TAG]: ActionParameterDefinitionTag.OTHER,
            [ActionParameterDefinitionAttribute.DATATYPE]: ActionParameterDefinitionDatatype.BOOLEAN,
        },
        [ActionParameterDefinitionInputType.INTEGER]: {
            [ActionParameterDefinitionAttribute.TAG]: ActionParameterDefinitionTag.OTHER,
            [ActionParameterDefinitionAttribute.DATATYPE]: ActionParameterDefinitionDatatype.INT,
        },
        [ActionParameterDefinitionInputType.DECIMAL]: {
            [ActionParameterDefinitionAttribute.TAG]: ActionParameterDefinitionTag.OTHER,
            [ActionParameterDefinitionAttribute.DATATYPE]: ActionParameterDefinitionDatatype.FLOAT,
        },
        [ActionParameterDefinitionInputType.COLUMN_NAME]: {
            [ActionParameterDefinitionAttribute.TAG]: ActionParameterDefinitionTag.COLUMN_NAME,
            [ActionParameterDefinitionAttribute.DATATYPE]: ActionParameterDefinitionDatatype.STRING,
        },
        [ActionParameterDefinitionInputType.TABLE_NAME]: {
            [ActionParameterDefinitionAttribute.TAG]: ActionParameterDefinitionTag.DATA,
            [ActionParameterDefinitionAttribute.DATATYPE]: ActionParameterDefinitionDatatype.PANDAS_DATAFRAME,
        },
        [ActionParameterDefinitionInputType.COLUMN_LIST]: {
            [ActionParameterDefinitionAttribute.TAG]: ActionParameterDefinitionTag.OTHER,
            [ActionParameterDefinitionAttribute.DATATYPE]: ActionParameterDefinitionDatatype.COLUMN_NAMES_LIST,
        }
    },
    [TemplateLanguage.SQL]: {
        [ActionParameterDefinitionInputType.STRING]: {
            [ActionParameterDefinitionAttribute.TAG]: ActionParameterDefinitionTag.OTHER,
            [ActionParameterDefinitionAttribute.TYPE]: ActionParameterDefinitionType.COMPILE_TIME,
            [ActionParameterDefinitionAttribute.DATATYPE]: ActionParameterDefinitionDatatype.STRING,
        },
        [ActionParameterDefinitionInputType.BOOLEAN]: {
            [ActionParameterDefinitionAttribute.TAG]: ActionParameterDefinitionTag.OTHER,
            [ActionParameterDefinitionAttribute.TYPE]: ActionParameterDefinitionType.COMPILE_TIME,
            [ActionParameterDefinitionAttribute.DATATYPE]: ActionParameterDefinitionDatatype.BOOLEAN,
        },
        [ActionParameterDefinitionInputType.INTEGER]: {
            [ActionParameterDefinitionAttribute.TAG]: ActionParameterDefinitionTag.OTHER,
            [ActionParameterDefinitionAttribute.TYPE]: ActionParameterDefinitionType.COMPILE_TIME,
            [ActionParameterDefinitionAttribute.DATATYPE]: ActionParameterDefinitionDatatype.INT,
        },
        [ActionParameterDefinitionInputType.DECIMAL]: {
            [ActionParameterDefinitionAttribute.TAG]: ActionParameterDefinitionTag.OTHER,
            [ActionParameterDefinitionAttribute.TYPE]: ActionParameterDefinitionType.COMPILE_TIME,
            [ActionParameterDefinitionAttribute.DATATYPE]: ActionParameterDefinitionDatatype.FLOAT,
        },
        [ActionParameterDefinitionInputType.COLUMN_NAME]: {
            [ActionParameterDefinitionAttribute.TAG]: ActionParameterDefinitionTag.COLUMN_NAME,
            [ActionParameterDefinitionAttribute.TYPE]: ActionParameterDefinitionType.COMPILE_TIME,
            [ActionParameterDefinitionAttribute.DATATYPE]: ActionParameterDefinitionDatatype.STRING,
        },
        [ActionParameterDefinitionInputType.TABLE_NAME]: {
            [ActionParameterDefinitionAttribute.TAG]: ActionParameterDefinitionTag.TABLE_NAME,
            [ActionParameterDefinitionAttribute.TYPE]: ActionParameterDefinitionType.COMPILE_TIME,
            [ActionParameterDefinitionAttribute.DATATYPE]: ActionParameterDefinitionDatatype.STRING,
        },
        [ActionParameterDefinitionInputType.COLUMN_LIST]: {
            [ActionParameterDefinitionAttribute.TAG]: ActionParameterDefinitionTag.OTHER,
            [ActionParameterDefinitionAttribute.DATATYPE]: ActionParameterDefinitionDatatype.COLUMN_NAMES_LIST,
        }
    }
}

const getInputTypeFromAttributes = (language, tag, type, datatype) => {
    if (language in InputMap) {
        for (const [key, value] of Object.entries(InputMap[language])) {
            if (value[ActionParameterDefinitionAttribute.TAG] === tag &  value[ActionParameterDefinitionAttribute.DATATYPE] === datatype) {
                return key;
            }
        }
    }
    return ActionParameterDefinitionInputType.STRING
}

const getInputTypeFromAttributesNew = (language, tag, type, datatype) => {
    if (language in InputMap) {
        for (const [key, value] of Object.entries(InputMap[language])) {
            const tagsToBecomeOther = [ActionParameterDefinitionTag.OPTION_SET_MULTIPLE, ActionParameterDefinitionTag.OPTION_SET_SINGLE, ActionParameterDefinitionTag.SLACK_CHANNEL_SINGLE, ActionParameterDefinitionTag.SLACK_CHANNEL_MULTIPLE]
            const finalTag = tagsToBecomeOther.includes(tag) ? ActionParameterDefinitionTag.OTHER : tag
            if (value[ActionParameterDefinitionAttribute.TAG] === finalTag & value[ActionParameterDefinitionAttribute.DATATYPE] === datatype) {
                return key;
            }
        }
    }
    return ActionParameterDefinitionInputType.STRING
}

const getAttributesFromInputType = (inputType, language) => {
    if(language in InputMap && inputType in InputMap[language]){
        return InputMap[language][inputType]
    }
    return InputMap[TemplateLanguage.PYTHON][ActionParameterDefinitionInputType.STRING]
}

export {
    InputMap,
    getAttributesFromInputType,
    getInputTypeFromAttributes,
    getInputTypeFromAttributesNew
}
