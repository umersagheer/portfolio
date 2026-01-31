"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, Tooltip } from "@heroui/react";
import { LucideIcon } from "lucide-react";
import { TablerIcon } from "@tabler/icons-react";

interface Tab {
    title: string;
    icon: TablerIcon | LucideIcon;
    href: string;
    type?: never;
}

interface Separator {
    type: "separator";
    title?: never;
    icon?: never;
    href?: never;
}

type TabItem = Tab | Separator;

interface ExpandableTabsProps {
    tabs: TabItem[];
    className?: string;
    activeColor?: string;
    onChange?: (index: number | null) => void;
}

const buttonVariants = {
    initial: {
        gap: 0,
        paddingLeft: ".5rem",
        paddingRight: ".5rem",
    },
    animate: (isSelected: boolean) => ({
        gap: isSelected ? ".5rem" : 0,
        paddingLeft: isSelected ? "1rem" : ".5rem",
        paddingRight: isSelected ? "1rem" : ".5rem",
    }),
};

const spanVariants = {
    initial: { width: 0, opacity: 0 },
    animate: { width: "auto", opacity: 1 },
    exit: { width: 0, opacity: 0 },
};

const transition = { delay: 0.1, type: "spring", bounce: 0, duration: 0.6 };

export function ExpandableTabs({
    tabs,
    className,
    activeColor = "text-primary",
    onChange,
}: ExpandableTabsProps) {
    const pathname = usePathname();

    // Determine selected index based on current route
    const selectedIndex = React.useMemo(() => {
        return tabs.findIndex((tab) => {
            if (tab.type === "separator") return false;
            return pathname === tab.href;
        });
    }, [pathname, tabs]);

    const handleSelect = (index: number) => {
        onChange?.(index);
    };

    const Separator = () => (
        <div className="mx-1 h-[24px] w-[1.2px] bg-border" aria-hidden="true" />
    );

    return (
        <div
            className={cn(
                "relative flex flex-wrap items-center gap-1 rounded-medium border-medium border-default-200 bg-transparent p-1 shadow-sm backdrop-blur-lg",
                className
            )}
        >
            {tabs.map((tab, index) => {
                if (tab.type === "separator") {
                    return <Separator key={`separator-${index}`} />;
                }

                const Icon = tab.icon;
                const isSelected = selectedIndex === index;

                return (
                    <Tooltip key={tab.title} content={tab.title} size="sm">
                        <Link href={tab.href}>
                            <motion.button
                                variants={buttonVariants}
                                initial={false}
                                animate="animate"
                                custom={isSelected}
                                onClick={() => handleSelect(index)}
                                transition={transition}
                                className={cn(
                                    "relative flex h-7 items-center rounded-small px-3 py-1 text-tiny font-medium transition-colors duration-300",
                                    isSelected
                                        ? activeColor
                                        : "text-default-500 hover:text-default-600"
                                )}
                            >
                                {/* Shared layout cursor - only rendered on selected tab */}
                                {isSelected && (
                                    <motion.div
                                        layoutId="active-tab-cursor"
                                        className="absolute inset-0 rounded-small bg-default-100"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10">
                                    <Icon size={16} />
                                </span>
                                <AnimatePresence initial={false}>
                                    {isSelected && (
                                        <motion.span
                                            variants={spanVariants}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                            transition={transition}
                                            className="relative z-10 overflow-hidden"
                                        >
                                            {tab.title}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </Link>
                    </Tooltip>
                );
            })}
        </div>
    );
}