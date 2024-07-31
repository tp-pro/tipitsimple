"use client";

import { useState } from 'react';
import TipModule from '@/components/shared/TipModule';
import NotConnected from '@/components/shared/NotConnected';
import TipManager from '@/components/TipManager';
import { useAccount } from "wagmi";
import TipForm from '@/components/shared/TipForm';

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
    const [selectedWallet, setSelectedWallet] = useState(null);

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
                </>
            ) : (
                <NotConnected />
            )}
        </div>
    );
}
