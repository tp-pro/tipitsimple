"use client";

import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from "wagmi";
import { tipItSimpleAddress, tipItSimpleABI, friendManagerAddress, friendManagerABI } from "@/constants";

import TipModule from '@/components/shared/TipModule';
import NotConnected from '@/components/shared/NotConnected';
import TipForm from '@/components/shared/TipForm';
import TipManager from '@/components/TipManager';

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

export default function Home() {

    const { isConnected, address } = useAccount();
    
    const [selectedWallet, setSelectedWallet] = useState({ addr: null, name: null });
    const [isOwner, setIsOwner] = useState(false);

    const { data: ownerAddress } = useReadContract({
        address: tipItSimpleAddress,
        abi: tipItSimpleABI,
        functionName: 'getOwner',
    });

    const { data: friendsList } = useReadContract({
        address: friendManagerAddress,
        abi: friendManagerABI,
        functionName: 'getFriends'
    });

    useEffect(() => {
        if (address && ownerAddress) {
            setIsOwner(address.toLowerCase() === ownerAddress.toLowerCase());
        }
    }, [address, ownerAddress]);

    useEffect(() => {
        console.log('friendsList:', friendsList);
    }, [friendsList]);

    const filteredFriendsList = friendsList?.filter(friend => friend.addr.toLowerCase() !== address?.toLowerCase()) || [];

    return (
        <div>
            { isConnected ? (
                <>
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 lg:pt-32 px-4 pt-20">
                        {isOwner && <TipManager />}
                        <h2 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100 mb-7">🤝  Amis du propriétaire</h2>
                        <ul className="grid lg:grid-cols-3 grid-cols-1 gap-x-8">
                            {filteredFriendsList?.map((friend, index) => (
                            <li key={index}>
                                <p>{friend.name}</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">{friend.addr}</p>
                                <AlertDialog>
                                    <AlertDialogTrigger onClick={() => setSelectedWallet({ addr: friend.addr, name: friend.name })} className="mt-3">Envoyer un pourboire</AlertDialogTrigger>
                                    <AlertDialogContent className="w-auto sm:w-auto max-w-100">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>🚀 Envoyer un pourboire à {selectedWallet.name}</AlertDialogTitle>
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
                    <TipModule />
                </>
            ) : (
                <NotConnected />
            )}
        </div>
    );
}
