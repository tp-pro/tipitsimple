'use client';
import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { contractAddress, contractABI } from "@/constants";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

import { parseEther } from "viem";

import Informations from "./Informations";

const TipModule = () => {
    const [tipName, setTipName] = useState('');
    const [tipMessage, setTipMessage] = useState('');
    const [tipPrice, setTipPrice] = useState('');

    const { address } = useAccount();

    const { data: hash, isPending, error, writeContract } = useWriteContract();

    const handleTip = async() => {
        writeContract({
            address: contractAddress,
            abi: contractABI,
            functionName: 'tip',
            args: [tipName, tipMessage],
            value: parseEther(tipPrice),
            account: address,
        })
    }

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

    return (
        <div>
            <Informations hash={hash} isConfirming={isConfirming} isConfirmed={isConfirmed} error={error} />
            <div>
                <Label htmlFor="tipName">Nom</Label>
                <Input type="text" id="tipName" placeholder="Ex: John Doe" onChange={(e) => setTipName(e.target.value)}></Input>
            </div>
            <div>
                <Label htmlFor="tipMessage">Message</Label>
                <Input type="text" id="tipMessage" placeholder="Ex: Merci pour le coup de pouce" onChange={(e) => setTipMessage(e.target.value)}></Input>
            </div>
            <div>
                <Label htmlFor="tipPrice">Montant</Label>
                <Input type="text" id="tipPrice" placeholder="Ex: 0.001" onChange={(e) => setTipPrice(e.target.value)}></Input>
            </div>
            <Button variant="outline" disabled={isPending} onClick={handleTip}>{isPending ? 'Envoie en cours...' : 'Envoyer le pourboir' }</Button>
        </div>
    )
}

export default TipModule
