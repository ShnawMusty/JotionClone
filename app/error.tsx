'use client'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Error = () => {
  return (
    <div className='h-full w-full flex items-center justify-center flex-col gap-3'>
      <Image src='/error.png' alt="Error" width={300} height={300} className='dark:hidden' />
      <Image src='/error-dark.png' alt='Error' width={300} height={300} className='hidden dark:block' />
      <h2 className='text-xl font-medium'>Something went wrong!</h2>
      <Button asChild>
        <Link href='/documents'>
          &larr; Go back
        </Link>
      </Button>
    </div>
  )
}

export default Error