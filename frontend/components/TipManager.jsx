import { useState } from 'react';

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
            <input
                type="text"
                placeholder="Nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Adresse Wallet Metamask"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                required
            />
            <button type="submit">Ajouter un compte</button>
        </form>
    );
}

export default TipManager;
