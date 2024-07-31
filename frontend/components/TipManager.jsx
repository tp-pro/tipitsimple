import { useState } from 'react';
import { useWriteContract, useWalletClient } from 'wagmi';
import { ethers } from 'ethers';
import { contractAddress, contractABI } from '@/constants';

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

function TipManager({ onAddAccount }) {
    const [name, setName] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const { data: signer } = useWalletClient();

    const { write: addFriend, isError, isLoading, error } = useWriteContract({
        addressOrName: contractAddress,
        contractInterface: contractABI,
        functionName: 'addFriend',
        signer,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!walletAddress) {
            console.error('Wallet address is required');
            return;
        }
    
        try {
            const transactionResponse = await addFriend({ args: [walletAddress] });
            const receipt = await transactionResponse.wait(); // Wait for the transaction to be mined
            console.log('Transaction confirmed:', receipt);
            // Here you might want to clear the form or handle the UI response
        } catch (error) {
            console.error('Failed to add friend:', error.message);
        }
    };

    if (isLoading) return <div>Sending transaction...</div>;
    if (isError) return <div>Error: {error?.message}</div>;

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-2">
                <Label htmlFor="tipName">Nom</Label>
                <Input
                    type="text"
                    placeholder="Nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className="mb-2">
                <Label htmlFor="tipName">Adresse Wallet</Label>
                <Input
                    type="text"
                    placeholder="Adresse Wallet Metamask"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    required
                />
            </div>
            <Button className="mt-2" variant="outline" type="submit" disabled={isLoading}>Ajouter un compte</Button>
        </form>
    );
}

export default TipManager;
