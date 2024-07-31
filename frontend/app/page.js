"use client";

import { useState } from 'react';
import TipModule from '@/components/shared/TipModule';
import NotConnected from '@/components/shared/NotConnected';
import TipManager from '@/components/TipManager';
import { useAccount } from "wagmi";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function Home() {

    const { isConnected } = useAccount();
    const [accounts, setAccounts] = useState([]);

    const addAccount = (account) => {
        setAccounts([...accounts, account]);
    };
   

    return (
        <div>
            { isConnected ? (
                <>
                    <TipModule />
                    <TipManager onAddAccount={addAccount} />
                    {accounts.map((account, index) => (
                        <Card key={index} className="my-2">
                            <CardHeader>
                                <CardTitle>{account.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{account.walletAddress}</p>
                            </CardContent>
                            <CardFooter>
                                <button>Envoyer un tips</button>
                            </CardFooter>
                        </Card>
                    ))}
                </>
            ) : (
                <NotConnected />
            )}
        </div>
    );
}
