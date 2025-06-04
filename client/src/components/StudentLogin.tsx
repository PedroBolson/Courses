'use client';

import React, { useState } from 'react';
import { X, User, Lock, GraduationCap, BookOpen, Calendar, Award } from 'lucide-react';

interface StudentLoginProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function StudentLogin({ isOpen, onClose }: StudentLoginProps) {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPortal, setShowPortal] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate login process
        setTimeout(() => {
            setLoading(false);
            setShowPortal(true);
        }, 1500);
    };

    const mockStudentData = {
        name: 'Ana Silva',
        email: 'ana.silva@email.com',
        enrolledCourses: [
            { id: 1, title: 'Matemática Completa', progress: 75, nextClass: '2024-01-15' },
            { id: 2, title: 'Português e Literatura', progress: 60, nextClass: '2024-01-16' },
            { id: 3, title: 'Física Moderna', progress: 45, nextClass: '2024-01-17' }
        ],
        upcomingTests: [
            { id: 1, subject: 'Matemática', date: '2024-01-20', type: 'Simulado' },
            { id: 2, subject: 'Português', date: '2024-01-22', type: 'Prova' }
        ],
        achievements: [
            { id: 1, title: 'Primeira Prova', description: 'Completou sua primeira avaliação', icon: '🏆' },
            { id: 2, title: 'Estudante Dedicado', description: '30 dias consecutivos de estudo', icon: '📚' },
            { id: 3, title: 'Matemático', description: 'Excelência em Matemática', icon: '🔢' }
        ]
    };

    if (!isOpen) return null;

    if (showPortal) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                            <GraduationCap className="h-8 w-8 text-blue-600" />
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Portal do Aluno
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Bem-vinda, {mockStudentData.name}!
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setShowPortal(false);
                                onClose();
                                setCredentials({ email: '', password: '' });
                            }}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="p-6">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                            Cursos Inscritos
                                        </p>
                                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                            {mockStudentData.enrolledCourses.length}
                                        </p>
                                    </div>
                                    <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>

                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-green-600 dark:text-green-400">
                                            Progresso Médio
                                        </p>
                                        <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                                            {Math.round(mockStudentData.enrolledCourses.reduce((acc, course) => acc + course.progress, 0) / mockStudentData.enrolledCourses.length)}%
                                        </p>
                                    </div>
                                    <Award className="h-8 w-8 text-green-600 dark:text-green-400" />
                                </div>
                            </div>

                            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                                            Próximas Provas
                                        </p>
                                        <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                                            {mockStudentData.upcomingTests.length}
                                        </p>
                                    </div>
                                    <Calendar className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* My Courses */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Meus Cursos
                                </h3>
                                <div className="space-y-4">
                                    {mockStudentData.enrolledCourses.map((course) => (
                                        <div key={course.id} className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium text-gray-900 dark:text-white">
                                                    {course.title}
                                                </h4>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {course.progress}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${course.progress}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                Próxima aula: {new Date(course.nextClass).toLocaleDateString('pt-BR')}
                                            </p>
                                            <button className="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                                                Continuar Estudando
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                {/* Upcoming Tests */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Próximas Avaliações
                                    </h3>
                                    <div className="space-y-3">
                                        {mockStudentData.upcomingTests.map((test) => (
                                            <div key={test.id} className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900 dark:text-white">
                                                            {test.subject}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                                            {test.type}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                                                            {new Date(test.date).toLocaleDateString('pt-BR')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Achievements */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Conquistas
                                    </h3>
                                    <div className="space-y-3">
                                        {mockStudentData.achievements.map((achievement) => (
                                            <div key={achievement.id} className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                                                <div className="flex items-start space-x-3">
                                                    <span className="text-2xl">{achievement.icon}</span>
                                                    <div>
                                                        <h4 className="font-medium text-gray-900 dark:text-white">
                                                            {achievement.title}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                                            {achievement.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 max-w-md w-full mx-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <GraduationCap className="h-8 w-8 text-blue-600" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Portal do Aluno
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                value={credentials.email}
                                onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                                placeholder="seu@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Senha
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="password"
                                value={credentials.password}
                                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                Lembrar-me
                            </span>
                        </label>
                        <button
                            type="button"
                            className="text-sm text-blue-600 hover:text-blue-500"
                        >
                            Esqueci a senha
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Entrando...</span>
                            </>
                        ) : (
                            <span>Entrar</span>
                        )}
                    </button>
                </form>

                {/* Demo credentials hint */}
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-xs text-blue-600 dark:text-blue-400 text-center">
                        💡 Demo: Use qualquer email e senha para acessar o portal
                    </p>
                </div>
            </div>
        </div>
    );
}
