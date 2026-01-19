import { useEffect, useState } from "react";

export default function TopBar() {
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
            </div>
        </div>
    );
}
