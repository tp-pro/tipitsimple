// components/TipsList.jsx
'use client';

import { useReadContract, useAccount } from "wagmi";
import { contractAddress, contractABI } from "@/constants";

const TipsList = ({ isSent }) => {
    const { address } = useAccount();
    const { data: tips, isLoading, isError } = useReadContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'getTips',
    });

    if (isLoading) return <div>Chargement des pourboires...</div>;
    if (isError) return <div>Erreur lors du chargement des pourboires.</div>;

    const filteredTips = tips?.filter(tip => isSent ? tip.from === address : tip.to === address) || [];

    return (
        <ul>
            {filteredTips.map((tip, index) => (
                <li key={index} className="md:border-b md:border-zinc-100 md:pb-6 md:pt-6 md:dark:border-zinc-700/40">
                    <p>{isSent ? `Envoyé à ${tip.name}` : `Reçu de ${tip.name}`}</p> 
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{isSent ? `Envoyé à ${tip.to}` : `Reçu de ${tip.from}`}</p> 
                    <p>{tip.amount} ETH</p>
                    <p>Message: {tip.message}</p>
                </li>
            ))}
        </ul>
    );
};

export default TipsList;