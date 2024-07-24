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

    const tipThank = async () => {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.BrowserProvider(window.ethereum, "any");
              
            const signer = provider.getSigner();
            const tipItSimple = new ethers.Contract(
                ContractAddress,
                ContractABI,
                signer
            );

            console.log('tip..');
            const tipTransaction = await tipItSimple.tipThank(
                name ? name : 'anon',
                message ? message : 'Enjoy your coffee!',
                { value: ethers.utils.parseEther('0.001') }
            );

            await tipTransaction.wait();
            console.log('mined', tipTransaction.hash);
            console.log('coffee purchased!');

            setName('');
            setMessage('');
        } catch (error) {
            console.log(error);
        }
    };

    const getTips = async () => {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
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
            setTips(tips);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        let tipItSimple;
        getTips();

        const onNewTip = (from, timestamp, name, message) => {
            console.log('Tip received:', from, timestamp, name, message);
            setTips(prevState => [
                ...prevState,
                { address: from, timestamp: new Date(timestamp * 1000), name, message }
            ]);
        };

        if (typeof window !== 'undefined' && window.ethereum) {
            // const provider = new ethers.Web3Provider(window.ethereum);
            const provider = new ethers.BrowserProvider(window.ethereum, "any");
            const signer = provider.getSigner();
            tipItSimple = new ethers.Contract(
                ContractAddress,
                ContractABI,
                signer
            );
    
            tipItSimple.on('NewTip', onNewTip);
        }
            
        return () => {
            if (tipItSimple) {
              tipItSimple.off("NewTip", onNewTip);
            }
        }
    }, []);

    return (
        <div>
            <h1>Welcome to Coffee Tip!</h1>
            <p>Account: {currentAccount || 'Not connected'}</p>
            <input value={name} onChange={onNameChange} placeholder="Your name" />
            <textarea value={message} onChange={onMessageChange} placeholder="Your message" />
            <button onClick={tipThank}>Buy Coffee</button>
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
