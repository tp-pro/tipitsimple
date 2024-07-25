import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { contractAddress, contractABI } from "@/constants";

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
            <div key={index}>
              <p>{tip.name}: {tip.message} - {tip.timestamp}</p>
            </div>
          ))
        )}
      </div>
    );
};

export default Tips;