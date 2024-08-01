'use client';

import TipForm from "./TipForm";
import TipsList from "./TipsList";

const TipModule = () => {
    return (
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-8 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:pt-32 px-4 pb-16 pt-20">
            <div>
                <h2>Pourboires Reçus</h2>
                <TipsList isSent={false} />
            </div>
            <div>
                <h2>Pourboires Envoyés</h2>
                <TipsList isSent={true} />
            </div>
        </div>
    )
}

export default TipModule;
