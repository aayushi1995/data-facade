/*
Utility Hook to maintain a TextField
*/
import { useState } from "react"

type UseTextInputParams = {
    initialText?: string
}

function useTextInput(props: UseTextInputParams) {
    const [text, setText] = useState<string|undefined>(props?.initialText)

    return [ text, setText ]
}

export default useTextInput;