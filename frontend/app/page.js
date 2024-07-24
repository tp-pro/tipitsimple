"use client";

import TipModule from '@/components/shared/TipModule';
import NotConnected from '@/components/shared/NotConnected';
import { ContractAddress, ContractABI } from '@/constants';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useAccount } from "wagmi";

export default function Home() {

    const { isConnected } = useAccount();

   

    return (
        <div>
            { isConnected ? (
                <TipModule />
            ) : (
                <NotConnected />
            )}
        </div>
    );
}
