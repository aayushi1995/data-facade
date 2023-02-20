const setLocalStorage = (key: string, value: any) => {
    localStorage.setItem(key, value)
}

const removeLocalStorage = (key: string) => {
    localStorage.removeItem(key)
}

const getLocalStorage = (key:string) => {
    return localStorage.getItem(key)
}

export { setLocalStorage,getLocalStorage,removeLocalStorage }
