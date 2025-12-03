import { useContext } from "react";

import { DisruptionContext } from "../context/DisruptionContext";

import ModalBox from "./ModalBox";

export default function DisruptionsBox() {
    const { showDisruptions, disruptionIDs, disruptions } = useContext(DisruptionContext);

    if (!showDisruptions) return <></>;
    
    return (
        <ModalBox>
            <div className="divide-solid divide-y divide-[gray]">
                {
                    disruptionIDs.map(id =>
                        <div key={id} className="space-y-2 py-4">
                            <p className="font-bold">{disruptions[id].title}</p>
                            <p>{disruptions[id].description}</p>
                            <p><a href={disruptions[id].url} rel="noopener noreferrer" target="_blank" className="underline text-blue-800 visited:text-purple-600">More Information</a></p>
                        </div>
                    )
                }
            </div>
        </ModalBox>
    );
}