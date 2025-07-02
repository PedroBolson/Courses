'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, X, ChevronDown } from 'lucide-react';
import { useQuery } from '@/contexts/QueryContext';
import { fixObjectEncoding } from '@/utils/textUtils';

interface Area {
    id: number;
    nome_area: string;
    descricao: string;
}

interface Curso {
    id: number;
    titulo: string;
    descricao: string;
    duracao_horas: number;
    valor: number;
    professor_id: number;
    area_id: number;
    nome_professor?: string;
    nome_area?: string;
}

interface CourseSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectCourse: (course: Curso) => void;
    enrolledCourseIds?: number[]; // IDs dos cursos em que o aluno já está matriculado
}

export default function CourseSelector({ isOpen, onClose, onSelectCourse, enrolledCourseIds = [] }: CourseSelectorProps) {
    const [areas, setAreas] = useState<Area[]>([]);
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [selectedArea, setSelectedArea] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    const { addQuery } = useQuery();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'; useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch areas
                const areasResponse = await fetch(`${API_URL}/areas`);
                const areasData = await areasResponse.json();
                setAreas(fixObjectEncoding(areasData.rows || []));
                if (areasData.executedQuery) addQuery(areasData.executedQuery, 'GET /areas');

                // Fetch cursos
                const cursosResponse = await fetch(`${API_URL}/cursos`);
                const cursosData = await cursosResponse.json();
                setCursos(fixObjectEncoding(cursosData.rows || []));
                if (cursosData.executedQuery) addQuery(cursosData.executedQuery, 'GET /cursos');

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchData();
        }
    }, [isOpen, API_URL, addQuery]);

    const getAreaIcon = (areaName: string) => {
        const name = areaName.toLowerCase();
        if (name.includes('matemática') || name.includes('matematica')) return '🔢';
        if (name.includes('português') || name.includes('linguagens')) return '📚';
        if (name.includes('ciências') || name.includes('natureza')) return '🔬';
        if (name.includes('humanas') || name.includes('história')) return '🌍';
        if (name.includes('redação')) return '✍️';
        return '📖';
    };

    const filteredCursos = selectedArea
        ? cursos.filter(curso => curso.area_id === selectedArea && !enrolledCourseIds.includes(curso.id))
        : cursos.filter(curso => !enrolledCourseIds.includes(curso.id));

    const handleSelectCourse = (curso: Curso) => {
        onSelectCourse(curso);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[70] flex items-start justify-center p-4 pt-20 min-h-screen overflow-y-auto">
            <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Escolha Seu Curso</h2>
                            <p className="text-blue-100">Selecione o curso que deseja fazer</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando cursos...</p>
                    </div>
                ) : (
                    <div className="p-6">
                        {/* Area Filter */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Filtrar por Área
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedArea || ''}
                                    onChange={(e) => setSelectedArea(e.target.value ? Number(e.target.value) : null)}
                                    className="w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 pr-10 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                >
                                    <option value="">Todas as Áreas</option>
                                    {areas.map((area) => (
                                        <option key={area.id} value={area.id}>
                                            {area.nome_area}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Courses List */}
                        <div className="max-h-96 overflow-y-auto space-y-4">
                            {filteredCursos.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    {enrolledCourseIds.length > 0 ? (
                                        <div>
                                            <p className="mb-2">Você já está matriculado em todos os cursos disponíveis!</p>
                                            <p className="text-sm">Parabéns pelo seu progresso nos estudos! 🎉</p>
                                        </div>
                                    ) : (
                                        <p>Nenhum curso encontrado nesta área.</p>
                                    )}
                                </div>
                            ) : (
                                filteredCursos.map((curso) => {
                                    const area = areas.find(a => a.id === curso.area_id);
                                    return (
                                        <div
                                            key={curso.id}
                                            onClick={() => handleSelectCourse(curso)}
                                            className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 hover:bg-blue-50 dark:hover:bg-slate-600 cursor-pointer transition-colors border border-transparent hover:border-blue-200 dark:hover:border-blue-700"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <span className="text-lg">
                                                            {area ? getAreaIcon(area.nome_area) : '📖'}
                                                        </span>
                                                        <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                                                            {area?.nome_area || 'Área'}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                        {curso.titulo}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                                                        {curso.descricao}
                                                    </p>
                                                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                                                        <span>{curso.duracao_horas || 40}h de duração</span>
                                                        <span>•</span>
                                                        <span className="text-green-600 dark:text-green-400 font-medium">
                                                            R$ {curso.valor ? curso.valor.toFixed(2) : '299,90'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                                                        Selecionar
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
