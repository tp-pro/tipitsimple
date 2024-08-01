'use client';

import TipsList from "./TipsList";

const TipModule = () => {
    return (
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-8 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:pt-32 px-4 pb-16 pt-20">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-800 sm:text-3xl dark:text-zinc-100 mb-4">💰 Pourboires Reçus</h2>
                <TipsList isSent={false} />
            </div>
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-800 sm:text-3xl dark:text-zinc-100 mb-4">🚀 Pourboires Envoyés</h2>
                <TipsList isSent={true} />
            </div>
        </div>
    )
}

export default TipModule;
