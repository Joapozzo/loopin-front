"use client";

import React, { createContext, useContext, useState } from 'react';

interface UserSidebarContextType {
    isExpanded: boolean;
    setIsExpanded: (expanded: boolean) => void;
    toggleSidebar: () => void;
}

const UserSidebarContext = createContext<UserSidebarContextType | undefined>(undefined);

export const UserSidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <UserSidebarContext.Provider value={{ isExpanded, setIsExpanded, toggleSidebar }}>
            {children}
        </UserSidebarContext.Provider>
    );
};

export const useUserSidebar = () => {
    const context = useContext(UserSidebarContext);
    if (context === undefined) {
        throw new Error('useUserSidebar must be used within a UserSidebarProvider');
    }
    return context;
};
