"use client"

import { Button } from '@/components/ui/button';
import { categories } from '@/types';
import { Cpu, Bike, Music, Film, Mic, Shirt, Pizza, Globe, Dumbbell, LifeBuoy, Briefcase, BookOpen, ChevronLeft, ChevronRight, SaveAll, House } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';

export const getIcon = (category: string) => {
    switch (category.toLowerCase()) {
        case "all" : 
            return <House/>;
        case "technology":
            return <Cpu />;
        case "sports":
            return <Bike />;
        case "music":
            return <Music />;
        case "movies":
            return <Film />;
        case "politics":
            return <Mic />;
        case "fashion":
            return <Shirt />;
        case "food":
            return <Pizza />;
        case "travel":
            return <Globe />;
        case "fitness":
            return <Dumbbell />;
        case "lifestyle":
            return <LifeBuoy />;
        case "business":
            return <Briefcase />;
        case "education":
            return <BookOpen />;
        default:
            return null;
    }
};


const CategoryNav = () => {

    const pathame = usePathname()

    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [showLeftArrow, setShowLeftArrow] = useState(false)
    const [showRightArrow, setShowRightArrow] = useState(true)

    const scroll = (direction: "left" | "right") => {
        const container = scrollContainerRef.current
        if (container) {
            const scrollAmount = direction === "left" ? -200 : 200
            container.scrollBy({ left: scrollAmount, behavior: "smooth" })
        }
    }

    const checkScroll = () => {
        const container = scrollContainerRef.current
        if (container) {
            setShowLeftArrow(container.scrollLeft > 0)
            setShowRightArrow(container.scrollLeft < container.scrollWidth - container.clientWidth)
        }
    }

    useEffect(() => {
        const container = scrollContainerRef.current
        if (container) {
            container.addEventListener("scroll", checkScroll)
            checkScroll() // Check initial state
        }
        return () => container?.removeEventListener("scroll", checkScroll)
    }, [scrollContainerRef]) // Added scrollContainerRef to dependencies

    return (
        <div className="relative w-full  mx-auto py-4 px-4">
            {showLeftArrow && (
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
                    onClick={() => scroll("left")}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
            )}
            <div
                ref={scrollContainerRef}
                className="w-[90%] mx-auto flex items-center space-x-2 overflow-x-auto scrollbar-hide scroll-smooth"
            >
                <Link key={"all"} href={`/`} className="flex-shrink-0">
                    <Button
                        variant={pathame === "/" ? "default" : "outline"}
                        className="flex items-center space-x-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                        <span>{getIcon("all")}</span>
                        <span>All</span>
                    </Button>
                </Link>
                {categories.map((cat) => (
                    <Link key={cat} href={`/${cat.toLowerCase()}`} className="flex-shrink-0">
                        <Button
                            variant={pathame === `/${cat.toLowerCase()}` ? "default" : "outline"}
                            className="flex items-center space-x-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                            <span>{getIcon(cat)}</span>
                            <span>{cat}</span>
                        </Button>
                    </Link>
                ))}
            </div>
            {showRightArrow && (
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
                    onClick={() => scroll("right")}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            )}
        </div>
    )
}

export default CategoryNav