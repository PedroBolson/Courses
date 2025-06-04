'use client';

import React, { useState } from 'react';
import { Code, Database, EyeOff, Clock } from 'lucide-react';
import { fixEncoding } from '@/utils/textUtils';

interface Query {
    query: string;
    timestamp: string;
    endpoint?: string;
}

interface QueryDisplayProps {
    queries: Query[];
    title?: string;
}

export default function QueryDisplay({ queries, title = "SQL Queries Executadas" }: QueryDisplayProps) {
    const [isVisible, setIsVisible] = useState(false);

    if (queries.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Toggle Button */}
            <button
                onClick={() => setIsVisible(!isVisible)}
                className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 mb-2"
                title="Ver queries SQL executadas"
            >
                <Database className="h-5 w-5" />
            </button>

            {/* Query Panel */}
            {isVisible && (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-w-md w-96 max-h-96 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Code className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                {title}
                            </h3>
                        </div>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <EyeOff className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Query List */}
                    <div className="max-h-80 overflow-y-auto">
                        {queries.map((query, index) => (
                            <div
                                key={index}
                                className="p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                        <Clock className="h-3 w-3 text-gray-400" />
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {query.timestamp}
                                        </span>
                                    </div>
                                    {query.endpoint && (
                                        <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                                            {query.endpoint}
                                        </span>
                                    )}
                                </div>                                <div className="bg-gray-50 dark:bg-gray-900 rounded p-2">
                                    <code className="text-xs text-gray-800 dark:text-gray-200 font-mono break-all">
                                        {fixEncoding(query.query)}
                                    </code>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            {queries.length} {queries.length === 1 ? 'query executada' : 'queries executadas'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
