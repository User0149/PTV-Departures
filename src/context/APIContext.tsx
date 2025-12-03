import { createContext, useState, type ReactNode } from "react";
import type { setState } from "../types/types";

interface IAPIContext {
    showSettings: boolean;
    devID: string;
    devKey: string;
    setShowSettings: setState<boolean>;
    setDevIDAndUpdateLocalStorage: (newDevID: string) => void;
    setDevKeyAndUpdateLocalStorage: (newDevKey: string) => void;
}

interface APIContextProviderProps {
    children: ReactNode;
}

export const APIContext = createContext<IAPIContext>({
    showSettings: false,
    devID: "",
    devKey: "",
    setShowSettings: () => {},
    setDevIDAndUpdateLocalStorage: () => {},
    setDevKeyAndUpdateLocalStorage: () => {}
});

export default function APIContextProvider({ children }: APIContextProviderProps) {
    const [showSettings, setShowSettings] = useState<boolean>(false);

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
        showSettings,
        devID,
        devKey,
        setShowSettings,
        setDevIDAndUpdateLocalStorage,
        setDevKeyAndUpdateLocalStorage
    };

    return (
        <APIContext value={initialAPIContext}>
            {children}
        </APIContext>
    );
}
