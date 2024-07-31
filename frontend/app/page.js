"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import TipModule from '@/components/shared/TipModule';
import NotConnected from '@/components/shared/NotConnected';
import TipManager from '@/components/TipManager';
import { useAccount, useReadContract } from "wagmi";
import TipForm from '@/components/shared/TipForm';
import { contractAddress, contractABI } from "@/constants";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function Home() {

    const { isConnected, address } = useAccount();
    const [accounts, setAccounts] = useState([]);
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [isOwner, setIsOwner] = useState(false);

    // Lire l'adresse du propriétaire du contrat
    const { data: ownerAddress } = useReadContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'getOwner',
    });

    const { data: friendsList } = useReadContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'getFriends'
    });

    useEffect(() => {
        if (address && ownerAddress) {
            setIsOwner(address.toLowerCase() === ownerAddress.toLowerCase());
        }
    }, [address, ownerAddress]);

    const addAccount = (account) => {
        setAccounts(prevAccounts => ({
            ...prevAccounts,
            [address]: [...(prevAccounts[address] || []), account]
        }));
    };
   
    const currentUserAccounts = accounts[address] || [];

    return (
        <div>
            { isConnected ? (
                <>
                    <TipModule />
                    {isOwner && <TipManager onAddAccount={addAccount} />}
                    {currentUserAccounts.map((account, index) => (
                        <Card key={index} className="my-2">
                            <CardHeader>
                                <CardTitle>{account.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{account.walletAddress}</p>
                            </CardContent>
                            <CardFooter>
                                <button onClick={() => setSelectedWallet(account.walletAddress)}>Envoyer un pourboire</button>
                            </CardFooter>
                        </Card>
                    ))}
                    {selectedWallet && (
                        <>
                            <p>Adresse du portefeuille sélectionné: {selectedWallet}</p>
                            <TipForm selectedWallet={selectedWallet} />
                        </>
                    )}
                    <div>
                        <h2>Amis du propriétaire:</h2>
                        <ul>
                            {friendsList?.map((friend, index) => (
                                <li key={index}>{friend}</li>
                            ))}
                        </ul>
                    </div>
                </>
            ) : (
                <NotConnected />
            )}
        </div>
    );
}
