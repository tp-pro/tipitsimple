import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { tipManagerAddress, tipManagerABI } from "@/constants";

import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

import { parseEther } from "viem";

import Informations from "./Informations";

const TipForm = ({ selectedWallet }) => {
    const [tipName, setTipName] = useState('');
    const [tipMessage, setTipMessage] = useState('');
    const [tipPrice, setTipPrice] = useState('');

    const { address } = useAccount();

    const { data: hash, isPending, error, writeContract } = useWriteContract();

    const resetForm = () => {
        setTipName('');
        setTipMessage('');
        setTipPrice('');
    };

    const handleTip = async () => {
        if (selectedWallet) { 
            try {
                await writeContract({
                    address: tipManagerAddress,
                    abi: tipManagerABI,
                    functionName: 'tip',
                    args: [tipName, tipMessage, selectedWallet, false],
                    value: parseEther(tipPrice),
                    overrides: {
                       from: address
                    }
                });
            } catch (error) {
                console.error("Failed to send tip:", error);
                alert(`Error sending tip: ${error.message}`);
            }
        }
    }

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

    useEffect(() => {
        if (isConfirmed) {
            resetForm();
        }
    }, [isConfirmed]);

    return (
        <>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-5">{selectedWallet}</p>
            {/* <div className="mb-2">
                <Label htmlFor="tipName">Nom</Label>
                <Input type="text" id="tipName" placeholder="Ex: John Doe" value={tipName} onChange={(e) => setTipName(e.target.value)}></Input>
            </div> */}
            <div className="my-2">
                <Label htmlFor="tipMessage">Message</Label>
                <Textarea id="tipMessage" placeholder="Ex: Merci pour le coup de pouce" value={tipMessage} onChange={(e) => setTipMessage(e.target.value)} />
            </div>
            <div className="my-2">
                <Label htmlFor="tipPrice">Montant en ETH</Label>
                <Input type="text" id="tipPrice" placeholder="Ex: 0.001" value={tipPrice} onChange={(e) => setTipPrice(e.target.value)}></Input>
            </div>
            <Button className="mt-2" variant="outline" disabled={isPending} onClick={handleTip}>{isPending ? 'Envoie en cours...' : 'Envoyer le pourboir' }</Button>
            <Informations className="mt-10" hash={hash} isConfirming={isConfirming} isConfirmed={isConfirmed} error={error} />
        </>
    )
}

export default TipForm
