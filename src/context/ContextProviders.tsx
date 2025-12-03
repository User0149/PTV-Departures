import type { ReactNode } from "react";

import APIContextProvider from "./APIContext";
import LocationContextProvider from "./LocationContext";
import DeparturesContextProvider from "./DeparturesContext";
import DisruptionContextProvider from "./DisruptionContext";
import ModalContextProvider from "./ModalContext";

interface ContextProvidersProps {
    children: ReactNode;
};

export default function ContextProviders({ children }: ContextProvidersProps) {
    return (
        <APIContextProvider>
            <LocationContextProvider>
                <DisruptionContextProvider>
                    <DeparturesContextProvider>
                        <ModalContextProvider>
                            {children}
                        </ModalContextProvider>
                    </DeparturesContextProvider>
                </DisruptionContextProvider>
            </LocationContextProvider>
        </APIContextProvider>
    );
}