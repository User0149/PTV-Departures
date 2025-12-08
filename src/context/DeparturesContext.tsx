import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import type { Departure, Run, StateSetter, Stop } from "../types/types";

import { NearestStops, NextDepartures } from "../lib/apiCalls";

import { LocationContext } from "./LocationContext";
import { APIContext } from "./APIContext";
import { DisruptionContext } from "./DisruptionContext";


interface IDeparturesContext {
    stopsListFetched: boolean;
    departuresListFetched: boolean;

    stopsList: Stop[];
    selectedStop: Stop;

    departuresList: Departure[];
    runs: Record<string, Run>;
    selectedRun: Run;

    setSelectedStop: StateSetter<Stop>;
    setSelectedRun: StateSetter<Run>;

    getStops: () => Promise<void>;
    getDeparturesAndDisruptions: () => Promise<void>;
}

interface DeparturesContextProviderProps {
    children: ReactNode;
}

export const DeparturesContext = createContext<IDeparturesContext>({
    stopsListFetched: false,
    departuresListFetched: false,

    stopsList: [],
    selectedStop: {},

    departuresList: [],
    runs: {},
    selectedRun: {},

    setSelectedStop: () => {},
    setSelectedRun: () => {},
    
    getStops: async () => {},
    getDeparturesAndDisruptions: async () => {}
});

export default function DeparturesContextProvider({ children }: DeparturesContextProviderProps) {
    const { pos, posInitialised } = useContext(LocationContext);
    const { devID, devKey } = useContext(APIContext);
    const { setDisruptions } = useContext(DisruptionContext);

    const [stopsListFetched, setStopsListFetched] = useState<boolean>(false);
    const [stopsList, setStopsList] = useState<Stop[]>([]);
    const [selectedStop, setSelectedStop] = useState<Stop>({});

    const [departuresListFetched, setDeparturesListFetched] = useState<boolean>(false);
    const [departuresList, setDeparturesList] = useState<Departure[]>([]);
    const [runs, setRuns] = useState<Record<string, Run>>({});
    const [selectedRun, setSelectedRun] = useState<Run>({});

    const getStops = async () => {
        if (!posInitialised) return;

        const { stops } = await NearestStops(pos[0], pos[1], devID, devKey);
        if (stops === undefined) {
            setStopsListFetched(false);
            throw Error("Error: could not get nearest stops.");
        }
        setStopsListFetched(true);
        setStopsList(stops);

        // if selectedStop hasn't been chosen, default to the closest stop
        if (stops.length >= 1 && Object.keys(selectedStop).length === 0) {
            setSelectedStop(stops[0]);
        }
    };

    const getDeparturesAndDisruptions = async () => {
        if (!stopsListFetched) return;

        const { departures, disruptions, runs } = await NextDepartures(selectedStop, devID, devKey);
        
        if (departures === undefined) {
            setDeparturesListFetched(false);
            throw Error("Error: could not get next departures.");
        }
        if (disruptions === undefined) {
            setDeparturesListFetched(false);
            throw Error("Error: could not get disruptions.");
        }
        if (runs === undefined) {
            setDeparturesListFetched(false);
            throw Error("Error: could not get runs.");
        }

        setDeparturesListFetched(true);
        setDeparturesList(departures);
        setRuns(runs);
        setDisruptions(disruptions);

        if (departures.length >= 1){
            try {
                // if selectedRun isn't chosen or isn't available for this stop, default to next run for this stop
                if (selectedRun?.run_ref === undefined || !(selectedRun.run_ref in runs)) {
                    const newSelectedRun: Run = runs[departures[0].run_ref!];
                    newSelectedRun.scheduled_departure_utc = departures[0].scheduled_departure_utc;
                    setSelectedRun(newSelectedRun);
                }
                // add `scheduled_departure_utc` property to this run because PTV API doesn't provide it
                else {
                    // update properties of `selectedRun` (e.g., `vehicle_position`)
                    const newSelectedRun: Run = runs[selectedRun.run_ref!];
                    newSelectedRun.scheduled_departure_utc = selectedRun.scheduled_departure_utc!;
                    setSelectedRun(newSelectedRun);
                }
            }
            catch (err: any) {
                throw Error(err);
            }
        }
    };

    // get nearest stops every 15 seconds
    useEffect(() => {
        getStops();

        const updateStopsInterval = setInterval(getStops, 15000);
        return () => clearInterval(updateStopsInterval);
    }, [pos, devID, devKey]);
    
    // get departures and disruptions for `selectedStop` every 15 seconds
    useEffect(() => {
        getDeparturesAndDisruptions();

        const updateDeparturesAndDisruptionsInterval = setInterval(getDeparturesAndDisruptions, 15000);
        return () => clearInterval(updateDeparturesAndDisruptionsInterval);
    }, [selectedStop, devID, devKey]);

    const initialDeparturesContext: IDeparturesContext = {
        stopsListFetched,
        departuresListFetched,

        stopsList,
        selectedStop,

        departuresList,
        runs,
        selectedRun,

        setSelectedStop,
        setSelectedRun,
        getStops,
        getDeparturesAndDisruptions
    };

    return (
        <DeparturesContext value={initialDeparturesContext}>
            {children}
        </DeparturesContext>
    );
}
