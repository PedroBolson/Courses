'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Clock, ChevronRight } from 'lucide-react';
import EnrollmentFlow from './EnrollmentFlow';
import { useQuery } from '@/contexts/QueryContext';
import { fixObjectEncoding } from '@/utils/textUtils';

interface Area {
    id: number;
    nome_area: string;
    descricao: string;
}

interface Professor {
    id: number;
    especialidade: string;
    pessoa: {
        nome: string;
        email: string;
    };
}

interface Curso {
    id: number;
    titulo: string;
    descricao: string;
    duracao_horas: number;
    valor: number;
    professor_id: number;
    area_id: number;
    professor?: Professor;
    area?: Area;
}

export default function CoursesSection() {
    const [areas, setAreas] = useState<Area[]>([]);
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [professores, setProfessores] = useState<Professor[]>([]);
    const [selectedArea, setSelectedArea] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [enrollmentFlow, setEnrollmentFlow] = useState<{ isOpen: boolean; courseName: string; coursePrice: number; courseId: number }>({
        isOpen: false,
        courseName: '',
        coursePrice: 299.90,
        courseId: 1
    });

    const { addQuery } = useQuery();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'; const handleEnrollClick = (curso: Curso) => {
        setEnrollmentFlow({
            isOpen: true,
            courseName: curso.titulo,
            coursePrice: curso.valor || 299.90,
            courseId: curso.id
        });
    };

    const closeEnrollmentFlow = () => {
        setEnrollmentFlow(prev => ({ ...prev, isOpen: false }));
    };

    useEffect(() => {
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

                // Fetch professores
                const professoresResponse = await fetch(`${API_URL}/professores`);
                const professoresData = await professoresResponse.json();
                setProfessores(fixObjectEncoding(professoresData.rows || []));
                if (professoresData.executedQuery) addQuery(professoresData.executedQuery, 'GET /professores');

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }; fetchData();
    }, [API_URL, addQuery]);

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
        ? cursos.filter(curso => curso.area_id === selectedArea)
        : cursos.slice(0, 6);

    const getAreaColor = (index: number) => {
        const colors = [
            'bg-blue-500',
            'bg-green-500',
            'bg-purple-500',
            'bg-orange-500',
            'bg-red-500',
            'bg-teal-500'
        ];
        return colors[index % colors.length];
    };

    if (loading) {
        return (
            <section id="cursos" className="py-20 bg-gray-50 dark:bg-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando cursos...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="cursos" className="py-20 bg-gray-50 dark:bg-slate-800 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Escolha Sua Área de Conhecimento
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Nossos cursos são organizados pelas áreas do ENEM. Selecione as matérias que mais precisa estudar.
                    </p>
                </div>

                {/* Areas Filter */}
                <div className="mb-12">
                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            onClick={() => setSelectedArea(null)}
                            className={`px-6 py-3 rounded-lg font-medium transition-colors ${selectedArea === null
                                ? 'bg-blue-600 text-white'
                                : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-600'
                                }`}
                        >
                            Todas as Áreas
                        </button>
                        {areas.map((area) => (
                            <button
                                key={area.id}
                                onClick={() => setSelectedArea(area.id)}
                                className={`px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2 ${selectedArea === area.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-600'
                                    }`}
                            >
                                <span className="text-lg">{getAreaIcon(area.nome_area)}</span>
                                <span>{area.nome_area}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Courses Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCursos.map((curso, index) => {
                        const area = areas.find(a => a.id === curso.area_id);
                        const professor = professores.find(p => p.id === curso.professor_id);

                        return (
                            <div
                                key={curso.id}
                                className="bg-white dark:bg-slate-700 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
                            >
                                {/* Card Header */}
                                <div className={`h-24 ${getAreaColor(index)} relative`}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20"></div>
                                    <div className="absolute top-4 left-4 text-white">
                                        <span className="text-2xl">{area ? getAreaIcon(area.nome_area) : '📖'}</span>
                                    </div>
                                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                                        <span className="text-white text-sm font-medium">
                                            {area?.nome_area || 'Área'}
                                        </span>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                        {curso.titulo}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                                        {curso.descricao}
                                    </p>

                                    {/* Professor Info */}
                                    {professor && (
                                        <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 dark:bg-slate-600 rounded-lg">
                                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                                                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {professor.pessoa?.nome || 'Professor'}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {professor.especialidade}
                                                </div>
                                            </div>
                                        </div>
                                    )}                                    {/* Course Stats */}
                                    <div className="flex items-center justify-between mb-4 text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center space-x-1">
                                            <BookOpen className="h-4 w-4" />
                                            <span>12 módulos</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Clock className="h-4 w-4" />
                                            <span>{curso.duracao_horas || 40}h</span>
                                        </div>
                                        <div className="text-green-600 dark:text-green-400 font-medium">
                                            R$ {curso.valor ? curso.valor.toFixed(2) : '299,90'}
                                        </div>
                                    </div>{/* CTA Button */}
                                    <button
                                        onClick={() => handleEnrollClick(curso)}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors inline-flex items-center justify-center space-x-2 group-hover:bg-blue-700"
                                    >
                                        <span>Inscrever-se</span>
                                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Show More Button */}
                {!selectedArea && cursos.length > 6 && (
                    <div className="text-center mt-12">
                        <button className="bg-white dark:bg-slate-700 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 px-8 py-3 rounded-lg font-medium transition-colors">
                            Ver Todos os Cursos ({cursos.length})
                        </button>                    </div>
                )}            </div>

            {/* Enrollment Flow */}
            <EnrollmentFlow
                isOpen={enrollmentFlow.isOpen}
                onClose={closeEnrollmentFlow}
                courseName={enrollmentFlow.courseName}
                coursePrice={enrollmentFlow.coursePrice}
                courseId={enrollmentFlow.courseId}
            />
        </section>
    );
}
