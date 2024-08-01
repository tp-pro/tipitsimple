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
                <li key={index}>
                    {isSent ? `Envoyé à ${tip.to}` : `Reçu de ${tip.from}`}: 
                    {tip.amount} ETH - 
                    Message: {tip.message}
                </li>
            ))}
        </ul>
    );
};

export default TipsList;