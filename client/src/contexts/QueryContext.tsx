'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Query {
    query: string;
    timestamp: string;
    endpoint?: string;
}

interface QueryContextType {
    queries: Query[];
    addQuery: (query: string, endpoint?: string) => void;
    clearQueries: () => void;
}

const QueryContext = createContext<QueryContextType | undefined>(undefined);

export function QueryProvider({ children }: { children: ReactNode }) {
    const [queries, setQueries] = useState<Query[]>([]);

    const addQuery = useCallback((query: string, endpoint?: string) => {
        const newQuery: Query = {
            query,
            timestamp: new Date().toLocaleTimeString(),
            endpoint
        };
        setQueries(prev => [...prev, newQuery]);
    }, []);

    const clearQueries = useCallback(() => {
        setQueries([]);
    }, []);

    return (
        <QueryContext.Provider value={{ queries, addQuery, clearQueries }}>
            {children}
        </QueryContext.Provider>
    );
}

export function useQuery() {
    const context = useContext(QueryContext);
    if (context === undefined) {
        throw new Error('useQuery must be used within a QueryProvider');
    }
    return context;
}
