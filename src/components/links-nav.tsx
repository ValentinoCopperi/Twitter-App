"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils';

const LinksNav = () => {
    const pathname = usePathname()
    const [isScrolling, setIsScrolling] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolling(window.scrollY > 0)
        }

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    const showLinkNav = () => {

        return pathname === '/' || pathname === '/following'

    }

    return (
        <div className={cn(" ustify-between items-center bg-white dark:bg-black w-full", showLinkNav() ? 'flex' : 'hidden')}>
            <div className={cn("w-1/2 py-3 border-b border-r border-border flex", pathname === '/' && 'border-b-primary')}>
                <Link href='/' className='w-full'>
                    <h1 className={cn('text-center', pathname === '/' ? 'text-primary font-semibold' : '')}>
                        All
                    </h1>
                </Link>
            </div>

            <div className={cn("w-1/2 py-3 border-b border-border flex", pathname === '/following' && 'border-b-primary')}>
                <Link href='/following' className='w-full'>
                    <h1 className={cn('text-center', pathname === '/following' ? 'text-primary font-semibold' : '')}>
                        Following
                    </h1>
                </Link>
            </div>
            <AnimatePresence>
                {isScrolling && (
                    <motion.div
                        className="absolute -bottom-10 left-[45%] transform -translate-x-1/2"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        <Badge
                            onClick={scrollToTop}
                            className="cursor-pointer hover:bg-primary/90 transition-colors flex items-center gap-1"
                        >
                            <ChevronUp className="w-4 h-4" />
                            <span>Go to top</span>
                        </Badge>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default LinksNav