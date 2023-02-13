const setLocalStorage = (key: string, value: string) => {
    localStorage.setItem(key, value)
}

const getLocalStorage = (key:string) => {
    return localStorage.getItem(key)
}

export { setLocalStorage,getLocalStorage }