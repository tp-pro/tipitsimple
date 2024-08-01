import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { contractAddress, contractABI } from "@/constants";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

import Informations from "./shared/Informations";

const TipManager = () => {
    const [friendAddress, setFriendAddress] = useState('');

    const { address } = useAccount();

    const { data: hash, isPending, error, writeContract } = useWriteContract();

    const handleAddFriend = async () => {
        if (friendAddress) {
            writeContract({
                address: contractAddress,
                abi: contractABI,
                functionName: 'addFriend',
                args: [friendAddress],
                overrides: {
                    from: address
                }
            })
        }
    }

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

    return (
        <div>
            <div className="mb-2">
                <Label htmlFor="friendAddress">Adresse de l'ami</Label>
                <Input 
                    type="text" 
                    id="friendAddress" 
                    placeholder="Ex: 0x1234..." 
                    value={friendAddress} 
                    onChange={(e) => setFriendAddress(e.target.value)}
                />
            </div>
            <Button 
                className="mt-2" 
                variant="outline" 
                disabled={isPending} 
                onClick={handleAddFriend}
            >
                {isPending ? 'Ajout en cours...' : 'Ajouter un ami'}
            </Button>
            <Informations 
                className="mt-10" 
                hash={hash} 
                isConfirming={isConfirming} 
                isConfirmed={isConfirmed} 
                error={error} 
            />
        </div>
    )
}

export default TipManager;