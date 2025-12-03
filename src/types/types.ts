export type setState<T> = React.Dispatch<React.SetStateAction<T>>;

export type positionType = [latitude: number, longitude: number];

export type routeTypeType = 0 | 1 | 2 | 3 | 4;

export type disruptionType = {
    title?: string,
    description?: string,
    url?: string
};

export type runType = {
    run_ref?: string,
    route_type?: routeTypeType,
    destination_name?: string,
    scheduled_departure_utc?: string,
    vehicle_position?: {
        latitude?: number,
        longitude?: number
    }
};

export type routeType = {
    route_name?: string,
    route_number?: string,
    route_type?: routeTypeType,
    route_id?: number
};

export type stopType = {
    disruption_ids?: number[],
    stop_distance?: number,
    stop_name?: string,
    stop_id?: number,
    routes?: routeType[],
    route_type?: routeTypeType,
    stop_latitude?: number,
    stop_longitude?: number
};

export type departureType = {
    stop_id?: number,
    route_id?: number,
    run_ref?: string,
    disruption_ids?: number[],
    scheduled_departure_utc?: string,
    estimated_departure_utc?: string | null,
    platform_number?: string
};