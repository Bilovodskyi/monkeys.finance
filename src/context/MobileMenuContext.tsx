"use client";

import React, { createContext, useContext, useState } from "react";

interface MobileMenuContextType {
    isOpen: boolean;
    toggleMenu: () => void;
    closeMenu: () => void;
}

const MobileMenuContext = createContext<MobileMenuContextType | undefined>(
    undefined
);

export function MobileMenuProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen((prev) => !prev);
    const closeMenu = () => setIsOpen(false);

    return (
        <MobileMenuContext.Provider value={{ isOpen, toggleMenu, closeMenu }}>
            {children}
        </MobileMenuContext.Provider>
    );
}

export function useMobileMenu() {
    const context = useContext(MobileMenuContext);
    if (context === undefined) {
        throw new Error("useMobileMenu must be used within a MobileMenuProvider");
    }
    return context;
}
