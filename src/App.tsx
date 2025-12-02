import "./App.css";
import "./styles/utilities.css";

import ContextProviders from "./context/ContextProviders";

import NearestStopsElem from "./components/NearestStopsElem";
import NextDeparturesElem from "./components/NextDeparturesElem";
import MapElem from "./components/MapElem";
import TopBar from "./components/TopBar";
import Disruption from "./components/Disruption";

function App() {
    return (
        <ContextProviders>
            <TopBar />
            <div className="flex" style={{height: "calc(100vh - 30px)"}}>
                <NearestStopsElem />
                <NextDeparturesElem />
                <MapElem />
            </div>

            <Disruption />
        </ContextProviders>
    );
}

export default App;
