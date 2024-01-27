'use client'
import { cn } from '@/lib/utils'
import { ChevronsLeft, MenuIcon, PlusCircle, Search, Settings, Trash } from 'lucide-react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import React, { ElementRef, useRef, useState, useEffect } from 'react'
import { useMediaQuery } from 'usehooks-ts'
import UserItem from './UserItem'
import {useMutation} from 'convex/react';
import { api } from '@/convex/_generated/api'
import { Item } from './Item'
import { toast } from 'sonner'
import DocumentList from './DocumentList'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import TrashBox from './TrashBox'
import { useSearch } from '@/hooks/useSearch'
import { useSettings } from '@/hooks/useSettings'
import DocumentNavbar from './DocumentNavbar'

const Navigation = () => {

  const createDocument = useMutation(api.documents.create);

  const router = useRouter()
  const params = useParams();
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const search = useSearch();
  const settings = useSettings();

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? "100%" : "240px"
      navbarRef.current.style.setProperty("width", isMobile ? "0" : "calc(100% - 240px)");
      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
      setTimeout(() => {
        setIsResetting(false)
      }, 300);
    }
  };

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  
  }, [isMobile])

  useEffect(() => {

    if (isMobile) collapse();

  }, [isMobile, pathname])
  

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = event.clientX;

    if (newWidth < 240) newWidth = 240
    if (newWidth > 480) newWidth = 480

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`)
      navbarRef.current.style.setProperty("width", `calc(100% - ${newWidth}px)`)
    }
  }

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  };

  const collapse = () => {

    if (sidebarRef.current && navbarRef.current) {

      setIsCollapsed(true);
      setIsResetting(true);
    
      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");
      setTimeout(() => {
        setIsResetting(false)
      }, 300);
    }
  }

  const handleCreate = () => {
    const promise = createDocument({ title: "Untitled"})
    .then((documentId) => router.push(`/documents/${'%5E'+ documentId}`))
    
    toast.promise(promise, {
      loading: 'Creating a new note...',
      success: 'New note created',
      error: 'Failed to create a new note.'
    })
  }

  return (
    <>
    <aside ref={sidebarRef} className={cn(' group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[9999]', isResetting && "transition-all ease-in-out duration-300", isMobile && "w-0")}>
        <div onClick={collapse} role='button' className={cn('h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition', isMobile && "opacity-100")}>
            <ChevronsLeft className='h-6 w-6'/>
        </div>
        <div>
            <UserItem/>
            <Item label='Search' icon={Search} isSearch onClick={search.onOpen} />
            <Item label='Settings' icon={Settings} onClick={settings.onOpen} />
            <Item onClick={handleCreate} label='New Page' icon={PlusCircle} />
        </div>
        <div className='mt-4'>
            <DocumentList/>
            <Item onClick={handleCreate} icon={PlusCircle} label='Add page' />
            <Popover>
              <PopoverTrigger className='w-full mt-4'>
                <Item icon={Trash} label='Trash' />
              </PopoverTrigger>
              <PopoverContent side={isMobile ? 'bottom' : 'right'} align='start'>
                <TrashBox/>
              </PopoverContent>
            </Popover>
        </div>
        <div onMouseDown={handleMouseDown} onClick={resetWidth} className='opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute top-0 right-0 w-1 h-full bg-primary/10'/>
    </aside>
    <div ref={navbarRef} className={cn('absolute left-80 top-0 w-[calc(100% - 240px)] z-[999]', isResetting && "transition-all ease-in-out duration-300", isMobile && "w-full left-0")}>
        {!!params.documentId ? (
          <DocumentNavbar isCollapsed={isCollapsed} onResetWidth={resetWidth} />
        ) : (
          <nav className='bg-transparent px-3 py-2 w-full'>
            {isCollapsed && <MenuIcon onClick={resetWidth} role='button' className='h-6 w-6 text-muted-foreground'/>}
          </nav>
        )}

    </div>
    </>
  )
}

export default Navigation