import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

const Header = () => {
    return (
        <header className="fixed top-0 left-0 right-0 border-b bg-background">
            <nav className="flex h-16 items-center px-4">
                <div className="grow">
                    <Link href="/" className="text-1xl font-bold tracking-tight text-zinc-800 sm:text-2xl dark:text-zinc-100">TipItSimple</Link>
                </div>
                <div>
                    <ConnectButton />
                </div>
            </nav>
        </header>
    )
}

export default Header