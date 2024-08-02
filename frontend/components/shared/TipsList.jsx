// components/TipsList.jsx
'use client';

import { useState, useEffect } from 'react';
import { useReadContract, useAccount } from "wagmi";
import { contractAddress, contractABI } from "@/constants";

import { ethers } from 'ethers';

const TipsList = ({ isSent }) => {
    const { address } = useAccount();
    const [friendsMap, setFriendsMap] = useState({});

    const { data: tips, isLoading: tipsLoading, isError: tipsError } = useReadContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'getTips',
    });

    const { data: friends, isLoading: friendsLoading, isError: friendsError } = useReadContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'getFriends',
    });

    useEffect(() => {
        if (friends) {
            const map = {};
            friends.forEach(friend => {
                map[friend.addr.toLowerCase()] = friend.name;
            });
            setFriendsMap(map);
        }
    }, [friends]);

    if (tipsLoading || friendsLoading) return <div>Chargement des données...</div>;
    if (tipsError || friendsError) return <div>Erreur lors du chargement des données.</div>;

    const filteredTips = tips?.filter(tip => 
        isSent ? tip.from.toLowerCase() === address.toLowerCase() : tip.to.toLowerCase() === address.toLowerCase()
    ) || [];

    const getNameOrAddress = (addr) => {
        return friendsMap[addr.toLowerCase()] || addr;
    };

    return (
        <ul>
            {filteredTips.map((tip, index) => (
                <li key={index} className="md:border-b md:border-zinc-100 md:pb-6 md:pt-6 md:dark:border-zinc-700/40">
                    <p>{isSent ? `Envoyé à ${getNameOrAddress(tip.to)}` : `Reçu de ${getNameOrAddress(tip.from)}`}</p> 
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{isSent ? tip.to : tip.from}</p> 
                    <p>{ethers.formatEther(tip.amount.toString())} ETH</p>
                    <p>Message: {tip.message}</p>
                </li>
            ))}
        </ul>
    );
};

export default TipsList;