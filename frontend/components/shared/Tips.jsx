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
          
          return {
            from: tipData.from,
            // Utilisez BigInt pour gérer les grands nombres
            timestamp: new Date(Number(BigInt(tipData.timestamp))).toLocaleString(),
            name: tipData.name,
            message: tipData.message
          };
        });
        setTips(formattedTips);
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
                </CardContent>
                <CardFooter>
                    <small className="text-sm font-medium leading-none">{tip.timestamp}</small>
                </CardFooter>
            </Card>
          ))
        )}
      </div>
    );
};

export default Tips;