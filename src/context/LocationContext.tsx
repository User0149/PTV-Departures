import { createContext, useEffect, useState, type ReactNode } from "react";

import type { positionType, setState } from "../types/types";

interface ILocationContext {
    posInitialised: boolean;
    pos: positionType;
    setPos: setState<positionType>;
    setUseMapPos: setState<boolean>;
    getLocation: () => Promise<void>;
}

interface LocationContextProviderProps {
    children: ReactNode;
}

export const LocationContext = createContext<ILocationContext>({
    posInitialised: false,
    pos: [0, 0],
    setPos: () => {},
    setUseMapPos: () => {},
    getLocation: async () => {}
});

export default function LocationContextProvider({ children  }: LocationContextProviderProps) {
    const [useMapPos, setUseMapPos] = useState<boolean>(false);
    const [pos, setPos] = useState<positionType>([0, 0]);
    const [posInitialised, setPosInitialised] = useState<boolean>(false);

    const getLocation = async () => {
        if (!useMapPos) {
            const curPos: GeolocationPosition = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, (err) => {
                    throw Error(`Could not get location: ${err}`)
                });
            });

            const [lat, long] = [Math.round(curPos.coords.latitude*1e6)/1e6, Math.round(curPos.coords.longitude*1e6)/1e6];

            setPos([lat, long]);
            setPosInitialised(true);
        }
        else {
            setPosInitialised(true);
        }
    };

    useEffect(() => {
        getLocation();

        const updateLocationInterval = setInterval(getLocation, 15000);
        return () => clearInterval(updateLocationInterval);
    }, [useMapPos]);

    const initialLocationContext: ILocationContext = {
        posInitialised,
        pos,
        setPos,
        setUseMapPos,
        getLocation
    };

    return (
        <LocationContext value={initialLocationContext}>
            {children}
        </LocationContext>
    );
}