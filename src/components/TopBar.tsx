import { useContext, useEffect, useState } from "react";

import { APIContext } from "../context/APIContext";

export default function TopBar() {
    const { showSettings, devID, devKey, setShowSettings, setDevIDAndUpdateLocalStorage, setDevKeyAndUpdateLocalStorage } = useContext(APIContext);

    const [curTime, setCurTime] = useState<string>(new Date().toLocaleTimeString());

    useEffect(() => {
        const clockInterval = setInterval(() => {
            setCurTime(new Date().toLocaleTimeString());
        }, 500);
        return () => clearInterval(clockInterval);
    }, []);

    return (
        <div>
            <div className="flex items-center relative h-8 bg-black text-white">
                <div className="m-auto text-center">Current time: {curTime}</div>
                <div className="absolute right-4 h-full w-6 flex items-center justify-center hover:bg-[gray] cursor-pointer" onMouseEnter={() => setShowSettings(true)} onMouseLeave={() => setShowSettings(false)}>
                    <img src="img/settings.svg" alt="settings" width="16"/>
                </div>
            </div>

            <div className={`fixed top-8 right-0 w-50 px-4 pb-4 z-1000 bg-black transition-all duration-1000 ${showSettings ? "visible opacity-100" : "invisible opacity-0"}`} onMouseEnter={() => setShowSettings(true)} onMouseLeave={() => setShowSettings(false)}>
                <div className="text-white">
                    <label htmlFor="dev-id-field">Developer ID</label>
                </div>
                <input id="dev-id-field" type="text" value={devID} className="w-40 px-[2px] py-[1px] text-sm bg-white" onChange={(e) => {
                    setDevIDAndUpdateLocalStorage((e.target as HTMLInputElement).value);
                }}></input>

                <div className="text-white">
                    <label htmlFor="dev-key-field">Developer key</label>
                </div>
                <input id="dev-key-field" type="text" value={devKey} className="w-40 px-[2px] py-[1px] text-sm bg-white" onChange={(e) => {
                    setDevKeyAndUpdateLocalStorage((e.target as HTMLInputElement).value);
                }}></input>
            </div>
        </div>
    );
}
