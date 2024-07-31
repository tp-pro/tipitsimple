"use client";

import { useState } from 'react';
import TipModule from '@/components/shared/TipModule';
import NotConnected from '@/components/shared/NotConnected';
import TipManager from '@/components/TipManager';
import { useAccount } from "wagmi";

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
                            <div key={index}>
                                Nom: {account.name}, Wallet: {account.walletAddress}
                            </div>
                        ))}
                </>
            ) : (
                <NotConnected />
            )}
        </div>
    );
}
