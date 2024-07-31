import { useState, useEffect } from 'react';
import { useReadContract, useAccount } from 'wagmi';
import { contractAddress, contractABI } from "@/constants";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../ui/card';

const Tips = () => {
    const { address } = useAccount();
    const { data, isError, isLoading, error } = useReadContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'getTips'
    });
  
    const [tips, setTips] = useState([]);
  
    useEffect(() => {
      if (data && address) {
        // Vérifiez si data est un tableau
        const tipsArray = Array.isArray(data) ? data : [data];
        
        const formattedTips = tipsArray.map(tip => ({
            from: tip.from,
            to: tip.to,
            timestamp: Number(tip.timestamp) * 1000,
            name: tip.name,
            message: tip.message,
            amount: tip.amount
        }));

        const filteredTips = formattedTips.filter(tip => 
            tip.to && tip.to.toLowerCase() === address.toLowerCase()
        );
  
        const sortedTips = filteredTips.sort((a, b) => b.timestamp - a.timestamp);
  
        setTips(sortedTips);
      }
    }, [data, address]);
  
    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading tips: {error?.message}</div>;
  
    return (
      <div>
        {tips.length === 0 ? (
          <p>No tips available.</p>
        ) : (
          tips.map((tip, index) => (
            <Card key={index} className="my-2">
                <CardHeader>
                    <CardTitle>{tip.name}</CardTitle>
                    <CardDescription>{tip.from}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>{tip.message}</p>
                    <p>{tip.selectedWallet}</p>
                    <p>Amount: {tip.amount.toString()} wei</p>
                </CardContent>
                <CardFooter>
                    <small className="text-sm font-medium leading-none">{new Date(tip.timestamp).toLocaleString()}</small>
                </CardFooter>
            </Card>
          ))
        )}
      </div>
    );
};

export default Tips;