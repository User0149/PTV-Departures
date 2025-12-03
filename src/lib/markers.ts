import L from 'leaflet';

import type { routeTypeType } from "../types/types";

export const iconRed = new L.Icon({
    iconUrl: "markers/red-marker.png",
    iconRetinaUrl: "markers/red-marker.png",
    iconSize: [20, 35],
    iconAnchor:   [10, 35]
});

export function iconRoute(type: routeTypeType, size: number) {
    return new L.Icon({
        iconUrl: `markers/route_type_${type}.svg`,
        iconRetinaUrl: `markers/route_type_${type}.svg`,
        popupAnchor:  [0, 0],
        iconSize: [size, size]
    });
}
