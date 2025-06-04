'use client';

import React, { useState, useEffect } from 'react';
import { X, Users, BookOpen, Calendar, DollarSign, BarChart3, Settings } from 'lucide-react';
import { useQuery } from '@/contexts/QueryContext';
import { fixObjectEncoding } from '@/utils/textUtils';

interface AdminDashboardProps {
    isOpen: boolean;
    onClose: () => void;
}

interface DashboardStats {
    totalAlunos: number;
    totalCursos: number;
    totalPalestras: number;
    totalPagamentos: number;
}

export default function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
    const [stats, setStats] = useState<DashboardStats>({
        totalAlunos: 0,
        totalCursos: 0,
        totalPalestras: 0,
        totalPagamentos: 0
    });
    const [loading, setLoading] = useState(true);
    const { addQuery } = useQuery(); useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch all data
                const [alunosRes, cursosRes, palestrasRes, pagamentosRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/alunos`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/cursos`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/palestras`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/pagamentos`)
                ]); const [alunosData, cursosData, palestrasData, pagamentosData] = await Promise.all([
                    alunosRes.json(),
                    cursosRes.json(),
                    palestrasRes.json(),
                    pagamentosRes.json()
                ].map(promise => promise.then(data => fixObjectEncoding(data))));

                // Add queries to context
                if (alunosData.executedQuery) addQuery(alunosData.executedQuery);
                if (cursosData.executedQuery) addQuery(cursosData.executedQuery);
                if (palestrasData.executedQuery) addQuery(palestrasData.executedQuery);
                if (pagamentosData.executedQuery) addQuery(pagamentosData.executedQuery); setStats({
                    totalAlunos: alunosData.rows?.length || 0,
                    totalCursos: cursosData.rows?.length || 0,
                    totalPalestras: palestrasData.rows?.length || 0,
                    totalPagamentos: pagamentosData.rows?.length || 0
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        }; if (isOpen) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]); // Removido addQuery para evitar loop infinito

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                            <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Painel Administrativo
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Gerencie seus cursos e alunos
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando dados...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total de Alunos</p>
                                            <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{stats.totalAlunos}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                                            <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-green-600 dark:text-green-400">Total de Cursos</p>
                                            <p className="text-2xl font-bold text-green-900 dark:text-green-300">{stats.totalCursos}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                                            <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total de Palestras</p>
                                            <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">{stats.totalPalestras}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
                                            <DollarSign className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Total de Pagamentos</p>
                                            <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-300">{stats.totalPagamentos}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Ações Rápidas
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <button className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors">
                                        <Users className="h-5 w-5" />
                                        <span>Gerenciar Alunos</span>
                                    </button>
                                    <button className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors">
                                        <BookOpen className="h-5 w-5" />
                                        <span>Gerenciar Cursos</span>
                                    </button>
                                    <button className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium transition-colors">
                                        <Settings className="h-5 w-5" />
                                        <span>Configurações</span>
                                    </button>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    📊 Dados do Sistema
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Base de dados conectada</span>
                                        <span className="text-green-600 dark:text-green-400 font-medium">✓ Ativo</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">API Backend</span>
                                        <span className="text-green-600 dark:text-green-400 font-medium">✓ Funcionando</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Queries SQL executadas</span>
                                        <span className="text-blue-600 dark:text-blue-400 font-medium">Visível no painel</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
