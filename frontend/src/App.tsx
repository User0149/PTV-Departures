import ContextProviders from "./context/ContextProviders";

import NearestStopsElem from "./components/NearestStopsElem";
import NextDeparturesElem from "./components/NextDeparturesElem";
import MapElem from "./components/MapElem";
import TopBar from "./components/TopBar";
import DisruptionsBox from "./components/DisruptionsBox";

function App() {
    return (
        <ContextProviders>
            <div className="flex flex-col h-full w-full">
                <TopBar />
                <div className="flex flex-1 overflow-auto no-scrollbar">
                    <NearestStopsElem />
                    <NextDeparturesElem />
                    <MapElem />
                </div>
            </div>

            <DisruptionsBox />
        </ContextProviders>
    );
}

export default App;
