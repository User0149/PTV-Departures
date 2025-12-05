import { HmacSHA1 } from "crypto-js";

import type { Departure, Disruption, RouteType, Run, Stop } from "../types/types";

function hmacSHA1(message: string, key: string) {
    return HmacSHA1(message, key).toString();
}

async function APIQuery(requestPath: string, devID: string, devKey: string) {
    const baseURL = "https://timetableapi.ptv.vic.gov.au";
    const requestURLWithID = `${requestPath}${requestPath.includes('?') ? '&' : '?'}devid=${devID}`;
    const fullRequestURL = `${baseURL}${requestURLWithID}&signature=${hmacSHA1(requestURLWithID, devKey)}`;

    try {
        const response = await fetch(fullRequestURL);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    }
    catch (err: any) {
        throw Error(err.message);
    }
}


export async function NearestStops(lat: number, long: number, devID: string, devKey: string) {
    const res: {stops?: Stop[]} = await APIQuery(`/v3/stops/location/${lat},${long}?max_distance=1000&max_results=1000`, devID, devKey);
    return res;
}

export async function NextDepartures(selectedStop: Stop, devID: string, devKey: string) {
    if (selectedStop.route_type === undefined || selectedStop.stop_id === undefined) return {};

    const route_type: RouteType = selectedStop.route_type;
    const stop_id: number = selectedStop.stop_id;

    const res: {
        departures?: Departure[],
        disruptions?: Record<string, Disruption>,
        runs?: Record<string, Run>
    } = await APIQuery(`/v3/departures/route_type/${route_type}/stop/${stop_id}?max_results=10&expand=0`, devID, devKey);
    return res;
}