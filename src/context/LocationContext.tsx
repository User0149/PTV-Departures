import { createContext, useEffect, useState, type ReactNode } from "react";

import type { Position, StateSetter } from "../types/types";

interface ILocationContext {
    posInitialised: boolean;
    pos: Position;
    setPos: StateSetter<Position>;
    setUseMapPos: StateSetter<boolean>;
    getRealLocation: () => Promise<Position>;
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
    getRealLocation: async () => [0, 0],
    getLocation: async () => {}
});

export default function LocationContextProvider({ children  }: LocationContextProviderProps) {
    const [useMapPos, setUseMapPos] = useState<boolean>(false);
    const [pos, setPos] = useState<Position>([0, 0]);

    const [posInitialised, setPosInitialised] = useState<boolean>(false);

    const getRealLocation = async () => {
        const curPos: GeolocationPosition = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, (err) => {
                throw Error(`Could not get location: ${err}`)
            });
        });

        // we don't want to register position changes by a very tiny amount
        const [lat, long] = [Math.round(curPos.coords.latitude * 1e6) / 1e6, Math.round(curPos.coords.longitude * 1e6) / 1e6];
        return [lat, long] as Position;
    }

    const getLocation = async () => {
        if (!useMapPos) {
            const [lat, long] = await getRealLocation();
            setPos([lat, long]);
        }

        setPosInitialised(true);
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
        getRealLocation,
        getLocation
    };

    return (
        <LocationContext value={initialLocationContext}>
            {children}
        </LocationContext>
    );
}