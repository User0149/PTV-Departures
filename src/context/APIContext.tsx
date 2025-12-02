import { createContext, useState, type ReactNode } from "react";
import type { setState } from "../types/types";

interface IAPIContext {
    devID: string;
    devKey: string;
    setDevIDAndUpdateLocalStorage: (newDevID: string) => void;
    setDevKeyAndUpdateLocalStorage: (newDevKey: string) => void;
}

interface APIContextProviderProps {
    children: ReactNode;
}

export const APIContext = createContext<IAPIContext>({
    devID: "",
    devKey: "",
    setDevIDAndUpdateLocalStorage: () => {},
    setDevKeyAndUpdateLocalStorage: () => {}
});

export default function APIContextProvider({ children }: APIContextProviderProps) {
    const [devID, setDevID] = useState<string>(localStorage.getItem("devID") !== null ? localStorage.getItem("devID")! : "");
    const [devKey, setDevKey] = useState<string>(localStorage.getItem("devKey") !== null ? localStorage.getItem("devKey")! : "");

    const setDevIDAndUpdateLocalStorage = (newDevID: string) => {
        setDevID(newDevID);
        localStorage.setItem("devID", newDevID);
    };

    const setDevKeyAndUpdateLocalStorage = (newDevKey: string) => {
        setDevKey(newDevKey);
        localStorage.setItem("devKey", newDevKey);
    };
    
    const initialAPIContext: IAPIContext = {
        devID,
        devKey,
        setDevIDAndUpdateLocalStorage,
        setDevKeyAndUpdateLocalStorage
    };

    return (
        <APIContext value={initialAPIContext}>
            {children}
        </APIContext>
    );
}
