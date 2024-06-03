import React from "react";

/**
 * 
 * @param {string} key  the key to set in sessionStorage for this value
 * @param {object} defaultValue the value to use if it is not already in sessionStorage
 */

function useSessionStorageState(key:string, defaultValue:any=""){

    const [state, setState] = React.useState(() => {
    const valueInSessionStorage = window.sessionStorage.getItem(key);
    if(valueInSessionStorage){
        return JSON.parse(valueInSessionStorage)
    }
       return defaultValue;
    });

    const prevKeyRef = React.useRef(key);

    React.useEffect(()=>{
        const prevKey = prevKeyRef.current;
        if(prevKey !== key){
            window.sessionStorage.removeItem(prevKey)
        }
        prevKeyRef.current = key;
        window.sessionStorage.setItem(key, JSON.stringify(state))
    },[key, state])

    return [state, setState]
}

export default useSessionStorageState