import { useContext, type ReactNode } from "react";

import { ModalContext } from "../context/ModalContext";

interface ModalBoxProps {
    children: ReactNode;
}

export default function ModalBox({ children }: ModalBoxProps) {
    const { hideModals } = useContext(ModalContext);
    
    return (
        <div className="fixed inset-0 h-full w-full bg-black/75 z-1000" onClick={hideModals}>
            <div className="h-3/4 max-w-300 mx-auto my-20 p-4 overflow-auto no-scrollbar bg-white z-1001" onClick={(e) => {
                e.stopPropagation();
            }}>
                <span className="float-right text-4xl text-[lightgray] hover:text-[gray] cursor-pointer" onClick={hideModals}>&times;</span>
                {children}
            </div>
        </div>
    );
}
