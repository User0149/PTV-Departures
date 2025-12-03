import { useContext } from "react";

import type { stopType } from "../types/types";

import { DeparturesContext } from "../context/DeparturesContext";
import { LocationContext } from "../context/LocationContext";
import { APIContext } from "../context/APIContext";

interface StopItemProps {
    stop: stopType;
}

function StopItem({ stop }: StopItemProps) {
    const { selectedStop, setSelectedStop } = useContext(DeparturesContext);

    const isSelected = (stop.stop_id === selectedStop.stop_id && stop.route_type === selectedStop.route_type);

    return (
        <div id={`${stop.route_type},${stop.stop_id}`} className={`flex h-30 w-full border-b border-[gray] hover:bg-[#d5d5d5] cursor-pointer ${isSelected ? "bg-[#d5d5d5]" : ""}`} onClick={() => setSelectedStop(stop)}>
            {/* route type icon */}
            <div className="p-4 flex items-center">
                <img src={`img/route_type_${String(stop.route_type)}.svg`} alt={`img/route_type_${String(stop.route_type)}.svg`} className="w-12"/>
            </div>

            <div className="flex flex-col w-full h-full text-sm space-y-3">
                <div className="flex w-full pt-2">
                    <p className="font-bold">{stop.stop_name}</p>
                    <p className="flex-1 mr-3 text-right">{Math.round(stop.stop_distance!)} m</p>
                </div>
                
                <div className="flex flex-1 pb-1 overflow-auto no-scrollbar">
                    <div className="flex-1 overflow-auto no-scrollbar space-x-2">
                        {
                            stop.routes!.map(route => {
                                const borderColour=["border-[#008cce]", "border-[#71be46]", "border-[#ff8200]", "border-[#7d4296]", "border-[#ff8200]"];

                                return (
                                    <div key={String(stop.stop_id) + "," + String(route.route_id) + "," + String(stop.route_type) + "," + String(route.route_type)} className={`inline-block px-[5px] py-[1px] mb-1 flex items-center justify-center text-center rounded-full border-[1.5px] ${borderColour[route.route_type!]}`}>
                                        <span>
                                            {(route.route_number ? route.route_number : route.route_name)}
                                        </span>
                                    </div>
                                );
                            })
                        }
                    </div>

                    <div className="mt-4 mr-2">
                        <img src="img/right-arrow.svg" alt="right-arrow" className="w-4"/>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StopsListElem() {
    const { devID, devKey } = useContext(APIContext);
    const { stopsList, stopsListFetched } = useContext(DeparturesContext);

    if (devID === "" || devKey === "") {
        return (
            <p className="text-center text-2xl text-[red] p-4">Please configure your PTV developer ID and key in the settings.</p>
        );
    }
    if (!stopsListFetched) {
        return (
            <p className="text-center p-2">Loading…</p>
        );
    }

    if (stopsList.length === 0) {
        return (
            <p className="text-center p-2">There are no stops within 1000 metres of your location.</p>
        );
    }

    return (
        <div>
            {
                stopsList.map(stop =>
                    <StopItem key={String(stop.stop_id!) + String(stop.route_type!)} stop={stop}/>
                )
            }
        </div>
    );
}

export default function NearestStopsElem() {
    const { getLocation } = useContext(LocationContext);
    const { getStops } = useContext(DeparturesContext);

    return (
        <div className="flex flex-col border-r border-[gray] w-3/10">
            <div className="relative p-3 bg-[#45484a] text-white text-lg text-center">
                <div>Stops within 1000 metres</div>
                <div className="absolute right-1 bottom-1 h-9 w-9 flex justify-center items-center rounded-full cursor-pointer hover:bg-[gray]" onClick={async () => {
                    await getLocation();
                    await getStops();
                }}>
                    <img alt="update" src="img/refresh.svg" width="20" height="20"></img>
                </div>
            </div>
            
            <div className="flex-1 overflow-auto no-scrollbar">
                <StopsListElem />
            </div>
        </div>
    );
}