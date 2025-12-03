import { useContext, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Circle, Tooltip } from "react-leaflet";

import { iconRoute, iconRed } from "../lib/markers";

import { LocationContext } from "../context/LocationContext";
import { DeparturesContext } from "../context/DeparturesContext";

export default function MapElem() {
    const { pos, setPos, setUseMapPos, getRealLocation } = useContext(LocationContext);
    const { stopsList, stopsListFetched, selectedStop, setSelectedStop, selectedRun } = useContext(DeparturesContext);

    const [map, setMap] = useState<any>(null);

    // intialise map center to `pos`
    useEffect(() => {
        if (map && ((map.getCenter().lat === 0  && map.getCenter().lng === 0)  || (map.getCenter().lat === -37.8136  && map.getCenter().lng === 144.9631))) {
            map.setView(pos, 15);
        }
    }, [pos, map]);
    
    if (!stopsListFetched) {
        return (
            <div className="w-2/5"></div>
        );
    }

    return (
        <div className="w-2/5 relative">
            <MapContainer center={[-37.8136, 144.9631]} zoom={15} scrollWheelZoom={true} ref={setMap} style={{width: "100%", height: "100%"}}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* indicate current location and range of 1 km radius */}
                <Marker position={pos} icon={iconRed} zIndexOffset={1000} />
                <Circle center={pos} pathOptions={{color: "green", fill: false, dashArray: "15"}} radius={1000} />

                {/* stop icons */}
                {
                    stopsList.map(stop => {
                        const isSelected = (stop.stop_id === selectedStop.stop_id && stop.route_type === selectedStop.route_type);
                        return (
                            <Marker 
                                key={String(stop.stop_id) + String(stop.route_type) + "_marker"}
                                position={[stop.stop_latitude!, stop.stop_longitude!]} 
                                icon={iconRoute(stop.route_type!, isSelected ? 40 : 30)} 
                                opacity={isSelected ? 1.0 : 0.9} 
                                zIndexOffset={(isSelected ? 1500 : 0) + (stop.route_type === 0 ? 1 : 0)}
                                eventHandlers={{
                                    mouseover: () => document.getElementById(`${stop.route_type},${stop.stop_id}`)!.style.backgroundColor="#d5d5d5", 
                                    mouseout: () => {
                                        if (isSelected) {
                                            document.getElementById(`${stop.route_type},${stop.stop_id}`)!.style.backgroundColor = "#d5d5d5";
                                        }
                                        else {
                                            document.getElementById(`${stop.route_type},${stop.stop_id}`)!.style.removeProperty("background-color");
                                        }
                                    },
                                    click: () => {setSelectedStop(stop)}
                                }}>
                                <Tooltip>{stop.stop_name}</Tooltip>
                            </Marker>
                        );
                    })
                }

                {/* Vehicle position of `selectedRun` */}
                {
                    (selectedRun && selectedRun.vehicle_position && <Marker position={[selectedRun.vehicle_position.latitude!, selectedRun.vehicle_position.longitude!]} icon={iconRoute(selectedRun.route_type!, 40)}>
                        <Tooltip>Vehicle position</Tooltip>
                    </Marker>)
                }
            </MapContainer>
            
            {/* mark the center of the map with a crosshair */}
            <img alt="dot" src="img/crosshair.svg" width="20" height="20" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-1000 pointer-events-none"/>

            {/* map actions menu */}
            <div className="absolute right-0 bottom-0 z-1000 text-white text-center divide-y divide-[gray] divide-solid">
                <div className="opacity-70 bg-black p-3 cursor-pointer hover:opacity-80" onClick={() => {
                    setPos([map.getCenter().lat, map.getCenter().lng]);
                    setUseMapPos(true);
                }}>
                    Set location
                </div>

                <div className="opacity-70 bg-black p-3 cursor-pointer hover:opacity-80" onClick={async () => {
                    setUseMapPos(false);

                    const newPos = await getRealLocation();
                    map.setView(newPos, 15);
                }}>
                    Go to current location
                </div>

                {
                    (selectedRun && selectedRun.vehicle_position && 
                        <div className="opacity-70 bg-black p-3 cursor-pointer hover:opacity-80" onClick={() => {
                            map.setView([selectedRun.vehicle_position!.latitude!, selectedRun.vehicle_position!.longitude!], 14);
                        }}>
                            Go to vehicle position
                        </div>
                    )
                }
            </div>
        </div>
    );
}