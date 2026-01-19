import type { Departure, Disruption, RouteType, Run, Stop } from "../types/types";

async function APIQuery(path: string) {
    try {
        const response = await fetch(`/api/${path}`);
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


export async function NearestStops(lat: number, long: number) {
    const res: {stops?: Stop[]} = await APIQuery(`v3/stops/location/${lat},${long}?max_distance=1000&max_results=1000`);
    return res;
}

export async function NextDepartures(selectedStop: Stop) {
    if (selectedStop.route_type === undefined || selectedStop.stop_id === undefined) return {};

    const route_type: RouteType = selectedStop.route_type;
    const stop_id: number = selectedStop.stop_id;

    const res: {
        departures?: Departure[],
        disruptions?: Record<string, Disruption>,
        runs?: Record<string, Run>
    } = await APIQuery(`v3/departures/route_type/${route_type}/stop/${stop_id}?max_results=10&expand=0`);
    return res;
}
