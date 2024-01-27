'use client'

import { SignOutButton, useUser } from "@clerk/clerk-react";
import { ChevronsLeftRight } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const UserItem = () => {
    const {user} = useUser();
 
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <div role="button" className="flex items-center text-sm p-3 w-full hover:bg-primary/5">
                <div className="flex items-center max-w-[200px] gap-x-2">
                    <Avatar className="h-5 w-5">
                        <AvatarImage src={user?.imageUrl}/>
                    </Avatar>
                    <span className="text-start font-medium line-clamp-1">{user?.username || user?.username}&apos;s Jotion</span>
                </div>
                <ChevronsLeftRight className="rotate-90 h-4 w-4 ml-2 " />
            </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start' alignOffset={10} className="w-80" forceMount>
            <div className="flex flex-col space-y-4 p-2">
                <p className="text-sm font-medium leading-none text-muted-foreground">{user?.emailAddresses[0].emailAddress}</p>
                <div className="flex items-center gap-x-2">
                    <div className="rounded-3xl bg-secondary p-1">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.imageUrl}/>
                        </Avatar>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm line-clamp-1">{user?.username}&apos;s Jotion</p>
                    </div>
                </div>
            </div>
        <DropdownMenuSeparator/>
        <DropdownMenuItem asChild className="w-full cursor-pointer text-muted-foreground">
            <SignOutButton>
                Log out
            </SignOutButton>
        </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserItem