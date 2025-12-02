import { useContext } from "react";
import { DeparturesContext } from "../context/DeparturesContext";
import type { departureType, runType } from "../types/types";
import { DisruptionContext } from "../context/DisruptionContext";

interface DepartureItemProps {
    departure: departureType;
    run: runType;
}

function DepartureItem({ departure, run }: DepartureItemProps) {
    const { selectedStop, selectedRun, setSelectedRun } = useContext(DeparturesContext);
    const { setDisruptionIDs, setShowDisruptions } = useContext(DisruptionContext);

    const scheduled_departure_utc = new Date(departure.scheduled_departure_utc!);
    const estimated_departure_utc = (departure.estimated_departure_utc !== undefined ? new Date(departure.estimated_departure_utc) : null);

    const route_id = departure.route_id;
    const platform_number = departure.platform_number;
    let [route_number, route_name] = ["", ""];

    const route_type = selectedStop.route_type;

    for (const route of selectedStop.routes!) {
        if (route.route_id === route_id) {
            [route_number, route_name] = [route.route_number!, route.route_name!];
        }
    }

    // I like 24-hour time
    const scheduled_string = scheduled_departure_utc.toLocaleTimeString("fr-FR").slice(0,5);
    const scheduled_string_extended = (scheduled_departure_utc.toDateString() === (new Date()).toDateString() ? "" : `${scheduled_departure_utc.toDateString().slice(0,3)} `) + scheduled_string;

    const estimated_string = (estimated_departure_utc ? (estimated_departure_utc.getTime() === scheduled_departure_utc.getTime() ? scheduled_string : estimated_departure_utc.toLocaleTimeString("fr-FR")) : scheduled_string);

    return (
        <div className="width100 departure_box flex" style={((run.run_ref === selectedRun.run_ref && run.route_type === selectedRun.route_type) ? {backgroundColor: "#d5d5d5"} : {})} onClick={() => {
            const newSelectedRun = run;
            newSelectedRun.scheduled_departure_utc = departure.scheduled_departure_utc;
            setSelectedRun(newSelectedRun);
        }}>
            <div style={{width: "calc(100% - 100px)", marginLeft: "10px"}}>
                <div className="flex">
                    <div className="margin-top-10px" style={{minWidth: "75px", paddingRight: "15px"}}>
                        {scheduled_string_extended}
                    </div>
                    <div className="margin-top-10px">
                        to {run.destination_name}
                    </div>
                </div>

                <div style={{fontSize: "small", color: "#555555", marginTop: "5px"}}>
                    {platform_number ? `Platform ${platform_number}` : ""}
                </div>

                <div className="flex" style={{marginTop: "15px", marginBottom: "10px", alignItems: "center"}}>
                    <div className="flex" style={{minWidth: "90px", alignItems: "center"}}>
                        <div className="small_route_button" style={{border: `1.5px solid ${["#008cce","#71be46","#ff8200","#7d4296","#ff8200"][route_type!]}`, fontSize: "0.9em"}}>
                            {(route_number ? route_number : route_name)}
                        </div>
                    </div>

                    {departure.disruption_ids!.length >= 1 && <img alt="disruption" src="img/exclamation_mark.svg" height="23px" className="clickable" onClick={() => {
                        setDisruptionIDs(departure.disruption_ids!);
                        setShowDisruptions(true);
                    }}></img>}
                </div>
            </div>
            <div className="float-right-10 flex-center">
                <div>
                    {
                        (estimated_string !== scheduled_string ?
                            <p className="text-align-center" style={{color: "gray", fontSize: "small", marginBottom: "2px"}}>live</p>
                            :
                            <p className="text-align-center" style={{color: "gray", fontSize: "small", marginBottom: "2px"}}>scheduled</p>
                        )
                    }
                    <p className="estimated_button" style={{marginTop: "0px", backgroundColor: `${(estimated_string === scheduled_string ? "#ffffa8" : "#aaffaa")}`}}>
                        {estimated_string ? estimated_string : scheduled_string}
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
            <div className="height100 text-align-center">
                <p>There are no departures from this stop.</p>
            </div>
        );
    }
    return (
        <div className="overflow" style={{height: "calc(100% - 54px)"}}>
            {
                departuresList.map(departure => {
                    return (
                        <DepartureItem key={String(departure.run_ref) +","+ String(selectedStop.stop_id)+","+departure.scheduled_departure_utc!}departure={departure} run={runs[departure.run_ref!]} />
                    );
                })
            }
        </div>
    );
}

export default function NextDeparturesElem() {
    const { getDeparturesAndDisruptions } = useContext(DeparturesContext);

    return (
        <div className="border-right height100" style={{width: "30%"}}>
            <div className="position-relative background-grey font-x-large text-align-center padding-15px font-large">
                <div>Next Departures</div>
                <div id="refresh_icon_box" className="rounded_h flex-center position-absolute" style={{height: "35px", width: "35px", right: "0px", bottom: "0px"}} onClick={getDeparturesAndDisruptions}>
                    <img alt="update" src="img/refresh.svg" width="20px" height="20px"></img>
                </div>
            </div>
            
            <DeparturesListElem />
        </div>
    );
}