import { useContext, useEffect, useState } from "react";
import { APIContext } from "../context/APIContext";

export default function TopBar() {
    const { devID, devKey, setDevIDAndUpdateLocalStorage, setDevKeyAndUpdateLocalStorage } = useContext(APIContext);

    const [curTime, setCurTime] = useState<string>(new Date().toLocaleTimeString());

    useEffect(() => {
        const clockInterval = setInterval(() => {
            setCurTime(new Date().toLocaleTimeString());
        }, 500);
        return () => clearInterval(clockInterval);
    }, []);

    return (
        <>
            <div className="top-bar flex-center white-text position-relative z-index-1k">
                <div className="center">Current time: {curTime}</div>
            </div>
            <div id="settings_elem_box" className="visibility-hidden z-index-1k white-text position-fixed-right" style={{width: "200px", top: "0px"}}>
                <div id="settings_icon_box" className="flex-center visibility-visible" style={{height: "30px", width: "25px", marginLeft: "auto", marginRight: "15px"}}>
                    <img src="img/settings.svg" alt="settings" height="15px"/>
                </div>
                <div id="settings_elem" className="z-index-1k black-background padding-15px">
                    <div>Developer ID</div>
                    <input type="text" value={devID} onChange={(e) => {
                        setDevIDAndUpdateLocalStorage((e.target as HTMLInputElement).value);
                    }} style={{width: "162px"}}></input>
                    <div>Developer key</div>
                    <input type="text" value={devKey} onChange={(e) => {
                        setDevKeyAndUpdateLocalStorage((e.target as HTMLInputElement).value);
                    }} style={{width: "162px"}}></input>
                </div>
            </div>
        </>
    );
}