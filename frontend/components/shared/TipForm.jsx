import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { contractAddress, contractABI } from "@/constants";

import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

import { parseEther } from "viem";

import Informations from "./Informations";

const TipForm = () => {
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
            <div className="mb-2">
                <Label htmlFor="tipName">Nom</Label>
                <Input type="text" id="tipName" placeholder="Ex: John Doe" onChange={(e) => setTipName(e.target.value)}></Input>
            </div>
            <div className="my-2">
                <Label htmlFor="tipMessage">Message</Label>
                <Textarea id="tipMessage" placeholder="Ex: Merci pour le coup de pouce" onChange={(e) => setTipMessage(e.target.value)} />
            </div>
            <div className="my-2">
                <Label htmlFor="tipPrice">Montant</Label>
                <Input type="text" id="tipPrice" placeholder="Ex: 0.001" onChange={(e) => setTipPrice(e.target.value)}></Input>
            </div>
            <Button className="mt-2" variant="outline" disabled={isPending} onClick={handleTip}>{isPending ? 'Envoie en cours...' : 'Envoyer le pourboir' }</Button>
            <Informations className="mt-10" hash={hash} isConfirming={isConfirming} isConfirmed={isConfirmed} error={error} />
        </div>
    )
}

export default TipForm
