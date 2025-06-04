'use client';

import React from 'react';
import { Shield, Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
    onAdminClick: () => void;
}

export default function Footer({ onAdminClick }: FooterProps) {
    return (
        <footer className="bg-gray-900 dark:bg-black text-white">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="bg-blue-600 text-white rounded-lg p-2 font-bold text-xl">
                                E
                            </div>
                            <span className="text-xl font-bold">ENEM Pro</span>
                        </div>
                        <p className="text-gray-400 mb-6">
                            Seu sucesso no ENEM começa aqui. Cursos especializados por área do conhecimento
                            com professores experientes e metodologia comprovada.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Cursos */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Áreas de Conhecimento</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Matemática e suas Tecnologias</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Linguagens e Códigos</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Ciências da Natureza</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Ciências Humanas</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Redação</a></li>
                        </ul>
                    </div>

                    {/* Links Úteis */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Links Úteis</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Sobre Nós</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Metodologia</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Resultados</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Depoimentos</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                        </ul>
                    </div>

                    {/* Contato */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Contato</h3>
                        <div className="space-y-3 text-gray-400">
                            <div className="flex items-center space-x-3">
                                <Mail className="h-4 w-4" />
                                <span>contato@enempro.com.br</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="h-4 w-4" />
                                <span>(11) 9999-9999</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <MapPin className="h-4 w-4" />
                                <span>São Paulo - SP</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-gray-400 text-sm mb-4 md:mb-0">
                            © 2025 ENEM Pro. Todos os direitos reservados.
                        </div>

                        {/* Admin Access */}
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-500 text-sm">Trabalho de Banco de Dados</span>
                            <button
                                onClick={onAdminClick}
                                className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                <Shield className="h-4 w-4" />
                                <span>Admin</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
