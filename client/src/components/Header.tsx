'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon, User, LogIn, Menu, X } from 'lucide-react';
import StudentLogin from './StudentLogin';

interface HeaderProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
}

export default function Header({ darkMode, toggleDarkMode }: HeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [showStudentLogin, setShowStudentLogin] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [activeSection, setActiveSection] = useState('inicio');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);

            // Detectar seção ativa
            const sections = ['inicio', 'areas-cursos', 'palestras', 'avaliacoes'];
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 100 && rect.bottom >= 100) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (section: string) => activeSection === section;

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
            ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-lg border-b border-gray-200 dark:border-gray-700'
            : 'bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <div className="bg-blue-600 text-white rounded-lg p-2 font-bold text-xl">
                            E
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                            ENEM Pro
                        </span>
                    </div>                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <a
                            href="#inicio"
                            className={`relative py-2 transition-colors ${isActive('inicio')
                                ? 'text-blue-600 dark:text-blue-400 font-medium'
                                : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                                }`}
                        >
                            Início
                            {isActive('inicio') && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                            )}
                        </a>
                        <a
                            href="#areas-cursos"
                            className={`relative py-2 transition-colors ${isActive('areas-cursos')
                                ? 'text-blue-600 dark:text-blue-400 font-medium'
                                : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                                }`}
                        >
                            Áreas & Cursos
                            {isActive('areas-cursos') && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                            )}
                        </a>
                        <a
                            href="#palestras"
                            className={`relative py-2 transition-colors ${isActive('palestras')
                                ? 'text-blue-600 dark:text-blue-400 font-medium'
                                : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                                }`}
                        >
                            Palestras
                            {isActive('palestras') && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                            )}
                        </a>
                        <a
                            href="#avaliacoes"
                            className={`relative py-2 transition-colors ${isActive('avaliacoes')
                                ? 'text-blue-600 dark:text-blue-400 font-medium'
                                : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                                }`}
                        >
                            Avaliações
                            {isActive('avaliacoes') && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                            )}
                        </a>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {darkMode ? (
                                <Sun className="h-5 w-5 text-yellow-500" />
                            ) : (
                                <Moon className="h-5 w-5 text-gray-600" />
                            )}
                        </button>                        {/* Student Login */}
                        <button
                            onClick={() => setShowStudentLogin(true)}
                            className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            <User className="h-4 w-4" />
                            <span>Portal do Aluno</span>
                        </button>

                        {/* Mobile Login */}                        <button
                            onClick={() => setShowStudentLogin(true)}
                            className="sm:hidden p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            <LogIn className="h-5 w-5" />
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            {showMobileMenu ? (
                                <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                            ) : (
                                <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                            )}
                        </button>
                    </div>                </div>
            </div>

            {/* Mobile Menu */}
            {showMobileMenu && (
                <div className="md:hidden bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-700">                    <div className="px-4 py-4 space-y-3">
                    <a
                        href="#inicio"
                        className={`block transition-colors ${isActive('inicio')
                            ? 'text-blue-600 dark:text-blue-400 font-medium'
                            : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                            }`}
                        onClick={() => setShowMobileMenu(false)}
                    >
                        Início
                    </a>
                    <a
                        href="#areas-cursos"
                        className={`block transition-colors ${isActive('areas-cursos')
                            ? 'text-blue-600 dark:text-blue-400 font-medium'
                            : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                            }`}
                        onClick={() => setShowMobileMenu(false)}
                    >
                        Áreas & Cursos
                    </a>
                    <a
                        href="#palestras"
                        className={`block transition-colors ${isActive('palestras')
                            ? 'text-blue-600 dark:text-blue-400 font-medium'
                            : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                            }`}
                        onClick={() => setShowMobileMenu(false)}
                    >
                        Palestras
                    </a>
                    <a
                        href="#avaliacoes"
                        className={`block transition-colors ${isActive('avaliacoes')
                            ? 'text-blue-600 dark:text-blue-400 font-medium'
                            : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                            }`}
                        onClick={() => setShowMobileMenu(false)}
                    >
                        Avaliações
                    </a>
                    <button
                        onClick={() => {
                            setShowStudentLogin(true);
                            setShowMobileMenu(false);
                        }}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        <User className="h-4 w-4" />
                        <span>Portal do Aluno</span>
                    </button>
                </div>
                </div>
            )}

            {/* Student Login Modal */}
            <StudentLogin
                isOpen={showStudentLogin}
                onClose={() => setShowStudentLogin(false)}
            />
        </header>
    );
}
