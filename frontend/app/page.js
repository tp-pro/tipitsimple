"use client";

import { ContractAddress, ContractABI } from '@/constants';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

export default function Home() {
    // Component state
    const [currentAccount, setCurrentAccount] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [tips, setTips] = useState([]);

    const onNameChange = (event) => {
        setName(event.target.value);
    }

    const onMessageChange = (event) => {
        setMessage(event.target.value);
    }

    const buyCoffee = async () => {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.BrowserProvider(window.ethereum);
              
            const signer = provider.getSigner();
            const tipItSimple = new ethers.Contract(
                ContractAddress,
                ContractABI,
                signer
            );

            console.log('buying coffee..');
            const coffeeTxn = await tipItSimple.buyCoffee(
                name ? name : 'anon',
                message ? message : 'Enjoy your coffee!',
                { value: ethers.utils.parseEther('0.001') }
            );

            await coffeeTxn.wait();
            console.log('mined', coffeeTxn.hash);
            console.log('coffee purchased!');

            setName('');
            setMessage('');
        } catch (error) {
            console.log(error);
        }
    };

    const getTips = async () => {
        try {
            const { ethereum } = window;
            if (!ethereum) {
                console.log('Metamask is not connected');
                return;
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
              

            const signer = provider.getSigner();
            const tipItSimple = new ethers.Contract(
                ContractAddress,
                ContractABI,
                signer
            );

            console.log('fetching tips from the blockchain..');
            const tipsFromBlockchain = await tipItSimple.getTips();
            console.log('fetched!');
            setTips(tipsFromBlockchain.map(tip => ({
                address: tip.from,
                timestamp: new Date(tip.timestamp * 1000),
                name: tip.name,
                message: tip.message
            })));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const options = { method: 'GET', headers: { accept: 'application/json' } };
        const apiKey = 'UhoaaYxCWnnFTDH3kfofjnO0KIddISux'; // Remplacez par votre clé API
        const url = `https://polygon-amoy.g.alchemy.com/nft/v3/${apiKey}/getNFTMetadata?contractAddress=0x8fFBF17AC46f37ed9ddD90442E811AC2857fC3b8&tokenId=0&refreshCache=false`;
        
        fetch(url, options)
        .then(response => response.json())
        .then(response => {
            if (response.image && response.image.originalUrl) {
                setImgURL(response.image.originalUrl);
            }
        })
        .catch(err => console.error(err));
        
        getTips();

        const onNewTip = (from, timestamp, name, message) => {
            console.log('Tip received:', from, timestamp, name, message);
            setTips(prevState => [
                ...prevState,
                { address: from, timestamp: new Date(timestamp * 1000), name, message }
            ]);
        };

        const { ethereum } = window;

        if (typeof window !== 'undefined' && window.ethereum) {
            // const provider = new ethers.Web3Provider(window.ethereum);
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = provider.getSigner();
            const tipItSimple = new ethers.Contract(
                ContractAddress,
                ContractABI,
                signer
            );
    
            const onNewTip = (from, timestamp, name, message) => {
                console.log('Tip received:', from, timestamp, name, message);
                setTips(prevTips => [
                    ...prevTips,
                    { address: from, timestamp: new Date(timestamp * 1000), name, message }
                ]);
            };
    
            tipItSimple.on('NewTip', onNewTip);
            
            return () => tipItSimple.off('NewTip', onNewTip);
        }
    }, []);

    return (
        <div>
            <h1>Welcome to Coffee Tip!</h1>
            <p>Account: {currentAccount || 'Not connected'}</p>
            <input value={name} onChange={onNameChange} placeholder="Your name" />
            <textarea value={message} onChange={onMessageChange} placeholder="Your message" />
            <button onClick={buyCoffee}>Buy Coffee</button>
            <div>
                {tips.map((tip, index) => (
                    <div key={index}>
                        <p>{tip.name} said "{tip.message}" from {tip.address} at {tip.timestamp.toString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
