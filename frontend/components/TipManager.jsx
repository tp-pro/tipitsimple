import { useState } from 'react';

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

function TipManager({ onAddAccount }) {
    const [name, setName] = useState('');
    const [walletAddress, setWalletAddress] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddAccount({ name, walletAddress });
        setName('');
        setWalletAddress('');
    };

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
            <Button className="mt-2" variant="outline" type="submit">Ajouter un compte</Button>
        </form>
    );
}

export default TipManager;
