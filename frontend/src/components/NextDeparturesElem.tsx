import { useContext } from "react";

import type { Departure, Route, RouteType, Run } from "../types/types";

import { DeparturesContext } from "../context/DeparturesContext";
import { DisruptionContext } from "../context/DisruptionContext";

interface DepartureItemProps {
    departure: Departure;
    run: Run;
}

function DepartureItem({ departure, run }: DepartureItemProps) {
    const { selectedStop, selectedRun, setSelectedRun } = useContext(DeparturesContext);
    const { setDisruptionIDs, setShowDisruptions } = useContext(DisruptionContext);

    const scheduledDepartureUTC: Date = new Date(departure.scheduled_departure_utc!);
    const estimatedDepartureUTC: Date | null = (departure.estimated_departure_utc ? new Date(departure.estimated_departure_utc) : null);

    const platformNumber: string | undefined = departure.platform_number;

    const routeID: number = departure.route_id!;
    const routeType: RouteType = selectedStop.route_type!;

    const route: Route | undefined = selectedStop.routes?.find(r => r.route_id === routeID);
    const [routeNumber, routeName] = [route?.route_number, route?.route_name];

    // I like 24-hour time
    const scheduledTimeString = scheduledDepartureUTC.toLocaleTimeString("fr-FR").slice(0,5);
    const scheduledTimeStringExtended = (scheduledDepartureUTC.toDateString() === (new Date()).toDateString() ? "" : `${scheduledDepartureUTC.toDateString().slice(0,3)} `) + scheduledTimeString; // includes day of week if not today

    // if the estimated time is the same as the scheduled time or doesn't exist, display the scheduled time instead
    const estimatedTimeString = (estimatedDepartureUTC && estimatedDepartureUTC.getTime() !== scheduledDepartureUTC.getTime()) ? estimatedDepartureUTC.toLocaleTimeString("fr-FR") : scheduledTimeString;

    const isSelected = (run.run_ref === selectedRun.run_ref && run.route_type === selectedRun.route_type);

    
    const borderColour=["border-[#008cce]", "border-[#71be46]", "border-[#ff8200]", "border-[#7d4296]", "border-[#ff8200]"];

    return (
        <div className={`flex w-full min-h-30 border-b border-[gray] hover:bg-[#d5d5d5] cursor-pointer ${isSelected ? "bg-[#d5d5d5]" : ""}`} onClick={() => {
            const newSelectedRun = {
                ...run,
                scheduled_departure_utc: departure.scheduled_departure_utc
            }
            
            setSelectedRun(newSelectedRun);
        }}>
            <div className="flex-1 p-2 space-y-3">
                <div className="flex">
                    <div className="min-w-20 mr-4">
                        {scheduledTimeStringExtended}
                    </div>
                    <div>
                        to {run.destination_name}
                    </div>
                </div>

                <div className="mt-1 text-sm text-[#555555]">
                    {platformNumber ? `Platform ${platformNumber}` : ""}
                </div>

                <div className="flex items-center mb-2">
                    <div className="flex items-center min-w-20 mr-4">
                        <div className={`inline-block px-[5px] py-[1px] text-sm text-center rounded-full border-[1.5px] ${borderColour[routeType!]}`}>
                            {(routeNumber ? routeNumber : routeName)}
                        </div>
                    </div>

                    {departure.disruption_ids!.length >= 1 && <img alt="disruption" src="img/exclamation_mark.svg" width="24" className="cursor-pointer" onClick={() => {
                        setDisruptionIDs(departure.disruption_ids!);
                        setShowDisruptions(true);
                    }}/>}
                </div>
            </div>

            <div className="ml-auto mr-3 flex items-center">
                <div>
                    <p className="text-center text-[gray] text-sm mb-[2px]">{(estimatedTimeString !== scheduledTimeString ? "live" : "scheduled")}</p>
                    <p className={`border rounded-full text-center text-lg p-1 ${(estimatedTimeString === scheduledTimeString ? "bg-[#ffffa8]" : "bg-[#aaffaa]")}`}>
                        {estimatedTimeString}
                    </p>
                </div>
            </div>
        </div>
    );
}

function DeparturesListElem() {
    const { selectedStop, departuresList, departuresListFetched, runs } = useContext(DeparturesContext);

    if (!departuresListFetched) {
        return (
            <></>
        );
    }

    if (departuresList.length === 0) {
        return (
            <p className="text-center p-2">There are no departures from this stop.</p>
        );
    }

    return (
        <div>
            {
                departuresList.map(departure => 
                    <DepartureItem key={String(departure.run_ref!) + "," + String(selectedStop.stop_id) + "," + departure.scheduled_departure_utc!} departure={departure} run={runs[departure.run_ref!]} />
                )
            }
        </div>
    );
}

export default function NextDeparturesElem() {
    const { getDeparturesAndDisruptions } = useContext(DeparturesContext);

    return (
        <div className="flex flex-col border-r border-[gray] w-3/10">
            <div className="relative p-3 bg-[#45484a] text-white text-lg text-center">
                <div>Next Departures</div>
                <div className="absolute right-1 bottom-1 h-9 w-9 flex justify-center items-center rounded-full cursor-pointer hover:bg-[gray]" onClick={getDeparturesAndDisruptions}>
                    <img alt="update" src="img/refresh.svg" width="20" height="20"></img>
                </div>
            </div>
            
            <div className="flex-1 overflow-auto no-scrollbar">
                <DeparturesListElem />
            </div>
        </div>
    );
}
