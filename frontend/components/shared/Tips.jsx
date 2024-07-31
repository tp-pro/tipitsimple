import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
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
    const { data, isError, isLoading, error } = useReadContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'getTips'
    });
  
    const [tips, setTips] = useState([]);
  
    useEffect(() => {
      if (data) {
        // Vérifiez si data est un tableau
        const tipsArray = Array.isArray(data) ? data : [data];
        
        const formattedTips = tipsArray.map(tip => {
          // Vérifiez si tip est un objet ou un tableau
          const tipData = Array.isArray(tip) ? {
            from: tip[0],
            timestamp: tip[1],
            name: tip[2],
            message: tip[3]
          } : tip;

          // Vérification du type et conversion
          let timestamp = tipData.timestamp;
          if (typeof timestamp === 'string' || typeof timestamp === 'number') {
            timestamp = BigInt(timestamp);
          }
          
          return {
            from: tipData.from,
            // Utilisez BigInt pour gérer les grands nombres
            timestamp: Number(timestamp) * 1000,
            name: tipData.name,
            message: tipData.message,
            selectedWallet: tipData.selectedWallet
          };
        });

        const sortedTips = formattedTips.sort((a, b) => b.timestamp - a.timestamp);

        setTips(sortedTips);
      }
    }, [data]);
  
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