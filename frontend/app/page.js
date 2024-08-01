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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  
import { Button } from '@/components/ui/button';

export default function Home() {

    const { isConnected, address } = useAccount();
    // const [accounts, setAccounts] = useState([]);
    const [selectedWallet, setSelectedWallet] = useState({ addr: null, name: null });
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

    // console.log(friendsList);

    // const addAccount = (account) => {
    //     setAccounts(prevAccounts => ({
    //         ...prevAccounts,
    //         [address]: [...(prevAccounts[address] || []), account]
    //     }));
    // };
   
    // const currentUserAccounts = accounts[address] || [];

    return (
        <div>
            { isConnected ? (
                <>
                    <TipModule />
                    {isOwner && <TipManager />}
                    <div>
                        <h2>Amis du propriétaire:</h2>
                        <ul>
                            {friendsList?.map((friend, index) => (
                                <li key={index} className="flex items-center justify-between mb-2">
                                <span>{friend.name} ({friend.addr})</span>
                                <AlertDialog>
                                    <AlertDialogTrigger onClick={() => setSelectedWallet({ addr: friend.addr, name: friend.name })}>Open</AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Envoyer un pourboire à {selectedWallet.name}</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                <TipForm selectedWallet={selectedWallet.addr} />
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction>Continue</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </li>
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
