'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { useQuery } from '@/contexts/QueryContext';
import { fixObjectEncoding } from '@/utils/textUtils';

interface Pessoa {
    id: number;
    nome: string;
    email: string;
    telefone?: string;
}

interface Area {
    id: number;
    nome_area: string;
    descricao: string;
}

interface Palestra {
    id: number;
    titulo: string;
    descricao: string;
    data_hora: string;
    local: string;
    convidado_id: number;
    area_id: number;
    convidado?: Pessoa; area?: Area;
}

export default function PalestrasSection() {
    const [palestras, setPalestras] = useState<Palestra[]>([]);
    const [pessoas, setPessoas] = useState<Pessoa[]>([]);
    const [areas, setAreas] = useState<Area[]>([]);
    const [loading, setLoading] = useState(true);
    const { addQuery } = useQuery(); useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);                // Fetch palestras
                const palestrasResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/palestras`);
                const palestrasData = await palestrasResponse.json();
                setPalestras(fixObjectEncoding(palestrasData.rows || []));
                addQuery(palestrasData.executedQuery || 'SELECT * FROM catalogo.Palestras', '/palestras');

                // Fetch pessoas
                const pessoasResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pessoas`);
                const pessoasData = await pessoasResponse.json();
                setPessoas(fixObjectEncoding(pessoasData.rows || []));
                addQuery(pessoasData.executedQuery || 'SELECT * FROM catalogo.Pessoas', '/pessoas');

                // Fetch areas
                const areasResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/areas`);
                const areasData = await areasResponse.json();
                setAreas(fixObjectEncoding(areasData.rows || []));
                addQuery(areasData.executedQuery || 'SELECT * FROM catalogo.Areas', '/areas');

            } catch (error) {
                console.error('Error fetching palestras:', error);
            } finally {
                setLoading(false);
            }
        }; fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Intencionalmente não incluindo addQuery para evitar loop infinito

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    if (loading) {
        return (
            <section id="palestras" className="py-20 bg-white dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando palestras...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="palestras" className="py-20 bg-white dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Palestras e Eventos
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Participe de palestras exclusivas com especialistas em cada área do conhecimento.
                    </p>
                </div>                {/* Palestras Grid */}
                {palestras.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {palestras.slice(0, 6).map((palestra) => {
                            const convidado = pessoas.find(p => p.id === palestra.convidado_id);
                            const area = areas.find(a => a.id === palestra.area_id);

                            return (
                                <div
                                    key={palestra.id}
                                    className="bg-gray-50 dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                                >
                                    {/* Card Header */}
                                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-32 relative">
                                        <div className="absolute inset-0 bg-black/20"></div>
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <h3 className="text-lg font-bold line-clamp-2">{palestra.titulo}</h3>
                                        </div>
                                        {area && (
                                            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                                                <span className="text-white text-sm font-medium">{area.nome_area}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-6">
                                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                                            {palestra.descricao}
                                        </p>

                                        {/* Event Details */}
                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                                                <Calendar className="h-4 w-4 text-blue-500" />
                                                <span>{formatDate(palestra.data_hora)}</span>
                                            </div>

                                            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                                                <MapPin className="h-4 w-4 text-green-500" />
                                                <span>{palestra.local}</span>
                                            </div>

                                            {convidado && (
                                                <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                                                    <Users className="h-4 w-4 text-purple-500" />
                                                    <span>{convidado.nome}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* CTA Button */}
                                        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                                            Inscrever-se na Palestra
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📅</div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Nenhuma palestra disponível
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Em breve teremos palestras incríveis para você!
                        </p>
                    </div>
                )}

                {/* Show More Button */}
                {palestras.length > 6 && (
                    <div className="text-center mt-12">
                        <button className="bg-white dark:bg-slate-700 border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 px-8 py-3 rounded-lg font-medium transition-colors">
                            Ver Todas as Palestras
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
