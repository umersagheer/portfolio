"use client";

import { cn } from "@heroui/react";
import { motion, MotionProps, useScroll } from "framer-motion";
import React from "react";
interface ScrollProgressProps
    extends Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps> { }

export const ScrollProgress = React.forwardRef<
    HTMLDivElement,
    ScrollProgressProps
>(({ className, ...props }, ref) => {
    const { scrollYProgress } = useScroll();

    return (
        <motion.div
            ref={ref}
            className={cn(
                "fixed inset-x-0 top-0 z-50 h-px origin-left bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 rounded-full",
                className,
            )}
            style={{
                scaleX: scrollYProgress,
            }}
            {...props}
        />
    );
});

ScrollProgress.displayName = "ScrollProgress";
