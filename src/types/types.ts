export type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;

export type Position = [latitude: number, longitude: number];

export type RouteType = 0 | 1 | 2 | 3 | 4;

export type Disruption = {
    title?: string,
    description?: string,
    url?: string
};

export type Run = {
    run_ref?: string,
    route_type?: RouteType,
    destination_name?: string,
    scheduled_departure_utc?: string,
    vehicle_position?: {
        latitude?: number,
        longitude?: number
    }
};

export type Route = {
    route_name?: string,
    route_number?: string,
    route_type?: RouteType,
    route_id?: number
};

export type Stop = {
    disruption_ids?: number[],
    stop_distance?: number,
    stop_name?: string,
    stop_id?: number,
    routes?: Route[],
    route_type?: RouteType,
    stop_latitude?: number,
    stop_longitude?: number
};

export type Departure = {
    stop_id?: number,
    route_id?: number,
    run_ref?: string,
    disruption_ids?: number[],
    scheduled_departure_utc?: string,
    estimated_departure_utc?: string | null,
    platform_number?: string
};