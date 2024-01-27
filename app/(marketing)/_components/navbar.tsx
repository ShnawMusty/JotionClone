'use client'
import useScrollTop from "@/hooks/useScrollTop"
import { cn } from "@/lib/utils";
import Logo from "./logo";
import { ModeToggle } from "@/components/mode-toggle";
import {useConvexAuth} from 'convex/react'
import {SignInButton, UserButton} from '@clerk/clerk-react'
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import Link from "next/link";


const Navbar = () => {
    const {isAuthenticated, isLoading} = useConvexAuth();

    const scrolled = useScrollTop();

  return (
    <div className={cn("z-50 bg-background flex items-center w-full p-4 dark:bg-[#1F1F1F]", scrolled && "border-b shadow-sm")}>
        <Logo/>
        <div className="md:ml-auto flex items-center w-full justify-between md:justify-end gap-x-2">
            {isLoading && <Spinner/>}
            {!isAuthenticated && !isLoading && (
              <>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">Log in</Button>
              </SignInButton>
              <SignInButton mode="modal">
                <Button size="sm">Get Jotion free</Button>
              </SignInButton>
              </>
            )}
            {isAuthenticated && !isLoading && (
              <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/documents">Enter Jotion</Link>
              </Button>
              <UserButton afterSignOutUrl="/" />
              </>
            )}
            <ModeToggle/>
        </div>
    </div>
  )
}

export default Navbar