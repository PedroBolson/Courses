'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, Users, BookOpen, Trophy } from 'lucide-react';
import { useQuery } from '@/contexts/QueryContext';
import { fixObjectEncoding } from '@/utils/textUtils';
import EnrollmentFlow from './EnrollmentFlow';
import CourseSelector from './CourseSelector';

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

export default function Hero() {
    const [stats, setStats] = useState({
        alunos: 0,
        cursos: 0,
        aprovacao: 95
    });
    const [activeUsers, setActiveUsers] = useState([
        { id: 1, name: 'Maria S.', course: 'Matemática', status: 'online' },
        { id: 2, name: 'João P.', course: 'Física', status: 'studying' },
        { id: 3, name: 'Ana L.', course: 'Química', status: 'online' },
        { id: 4, name: 'Pedro M.', course: 'Biologia', status: 'studying' },
        { id: 5, name: 'Carla F.', course: 'História', status: 'online' }
    ]);
    const [courseSelectorOpen, setCourseSelectorOpen] = useState(false);
    const [enrollmentFlow, setEnrollmentFlow] = useState({
        isOpen: false,
        courseName: 'Curso ENEM Preparatório',
        coursePrice: 299.90,
        courseId: 1
    });
    const { addQuery } = useQuery(); const handleChooseCourse = () => {
        setCourseSelectorOpen(true);
    };

    const handleCourseSelect = (curso: Curso) => {
        setEnrollmentFlow({
            isOpen: true,
            courseName: curso.titulo,
            coursePrice: curso.valor || 299.90,
            courseId: curso.id
        });
    };

    const handleCloseEnrollment = () => {
        setEnrollmentFlow(prev => ({ ...prev, isOpen: false }));
    }; useEffect(() => {
        const fetchStats = async () => {
            try {                // Fetch alunos count
                const alunosResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/alunos`);
                const alunosData = fixObjectEncoding(await alunosResponse.json());

                // Fetch cursos count
                const cursosResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cursos`);
                const cursosData = fixObjectEncoding(await cursosResponse.json()); if (alunosData.executedQuery) addQuery(alunosData.executedQuery, 'GET /alunos');
                if (cursosData.executedQuery) addQuery(cursosData.executedQuery, 'GET /cursos');

                setStats({
                    alunos: alunosData.rows?.length || 0,
                    cursos: cursosData.rows?.length || 0,
                    aprovacao: 95
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();

        // Simulate active users updates
        const interval = setInterval(() => {
            setActiveUsers(prev => prev.map(user => ({
                ...user,
                status: Math.random() > 0.7 ? (user.status === 'online' ? 'studying' : 'online') : user.status
            })));
        }, 3000);

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Intencionalmente não incluindo addQuery para evitar loop infinito
    return (
        <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-16">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium">
                                <Star className="h-4 w-4" />
                                <span>Curso #1 em Aprovações no ENEM</span>
                            </div>

                            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                                Passe no{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                    ENEM
                                </span>{' '}
                                com Confiança
                            </h1>

                            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                                Prepare-se para o ENEM com nossos cursos especializados por área do conhecimento.
                                Professores experientes, material atualizado e metodologia comprovada.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg mx-auto mb-2">
                                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.alunos > 0 ? stats.alunos : '5000+'}+</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Alunos Aprovados</div>
                            </div>

                            <div className="text-center">
                                <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg mx-auto mb-2">
                                    <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.cursos > 0 ? stats.cursos : '50+'}+</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Cursos Disponíveis</div>
                            </div>

                            <div className="text-center">
                                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg mx-auto mb-2">
                                    <Trophy className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.aprovacao}%</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Taxa de Aprovação</div>
                            </div>                        </div>

                        {/* Active Users Demo */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {activeUsers.length} usuários estudando agora
                                    </span>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Tempo real</span>
                            </div>
                            <div className="space-y-3">
                                {activeUsers.slice(0, 3).map((user) => (
                                    <div key={user.id} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {user.name}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {user.course}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <div className={`w-2 h-2 rounded-full ${user.status === 'online' ? 'bg-green-500' : 'bg-blue-500'
                                                }`}></div>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {user.status === 'online' ? 'Online' : 'Estudando'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button onClick={handleChooseCourse} className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl">
                                <span>Escolher Meu Curso</span>
                                <ArrowRight className="h-5 w-5" />
                            </button>

                            <button className="inline-flex items-center justify-center space-x-2 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-8 py-4 rounded-lg font-semibold transition-colors">
                                <span>Ver Demonstração</span>
                            </button>
                        </div>
                    </div>

                    {/* Image/Illustration */}
                    <div className="relative">
                        <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 shadow-2xl">
                            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                </div>

                                <div className="space-y-3">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                    <div className="h-4 bg-blue-200 dark:bg-blue-700 rounded w-5/6"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/50 rounded-lg p-4">
                                    <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
                                        Área de Conhecimento: Matemática
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="flex-1 bg-blue-200 dark:bg-blue-700 rounded-full h-2">
                                            <div className="bg-blue-600 h-2 rounded-full w-4/5"></div>
                                        </div>
                                        <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">80%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                            ⭐ Novo!
                        </div>
                        <div className="absolute -bottom-4 -left-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                            ✓ Aprovado
                        </div>
                    </div>
                </div>
            </div>            {/* Enrollment Flow Component */}
            <EnrollmentFlow
                isOpen={enrollmentFlow.isOpen}
                onClose={handleCloseEnrollment}
                courseName={enrollmentFlow.courseName}
                coursePrice={enrollmentFlow.coursePrice}
                courseId={enrollmentFlow.courseId}
            />

            {/* Course Selector Modal */}
            <CourseSelector
                isOpen={courseSelectorOpen}
                onClose={() => setCourseSelectorOpen(false)}
                onSelectCourse={handleCourseSelect}
            />
        </section>
    );
}
