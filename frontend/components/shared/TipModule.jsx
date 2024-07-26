'use client';

import TipForm from "./TipForm";
import Tips from "./Tips";

const TipModule = () => {
    return (
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-8 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:pt-32 px-4 pb-16 pt-20">
            <TipForm />
            <Tips />
        </div>
    )
}

export default TipModule
