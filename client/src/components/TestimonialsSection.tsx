'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
    id: number;
    name: string;
    role: string;
    photo: string;
    rating: number;
    content: string;
    course: string;
}

export default function TestimonialsSection() {
    const testimonials: Testimonial[] = [
        {
            id: 1,
            name: "Maria Silva",
            role: "Estudante aprovada USP",
            photo: "👩‍🎓",
            rating: 5,
            content: "O curso de Matemática do ENEM Pro foi fundamental para minha aprovação! Os professores são excelentes e o material é muito didático. Consegui aumentar minha nota em 200 pontos!",
            course: "Matemática Completa"
        },
        {
            id: 2,
            name: "João Santos",
            role: "Aprovado em Medicina",
            photo: "👨‍⚕️",
            rating: 5,
            content: "Estudei todos os módulos de Ciências da Natureza e foi incrível! O método de ensino é muito eficaz e me ajudou a passar no vestibular dos meus sonhos. Recomendo para todos!",
            course: "Ciências da Natureza"
        },
        {
            id: 3,
            name: "Ana Carolina",
            role: "Estudante de Direito",
            photo: "👩‍💼",
            rating: 5,
            content: "As palestras sobre redação foram um diferencial enorme! Aprendi técnicas que me fizeram tirar nota máxima na redação do ENEM. Plataforma muito completa!",
            course: "Redação ENEM"
        },
        {
            id: 4,
            name: "Pedro Costa",
            role: "Engenheiro aprovado",
            photo: "👨‍🔬",
            rating: 5,
            content: "O portal do aluno é muito bem organizado e os professores sempre disponíveis para tirar dúvidas. Consegui me organizar melhor nos estudos e alcançar meus objetivos.",
            course: "Física Moderna"
        },
        {
            id: 5,
            name: "Beatriz Lima",
            role: "Estudante de Psicologia",
            photo: "👩‍🏫",
            rating: 5,
            content: "Adorei o curso de Ciências Humanas! O conteúdo é muito bem estruturado e as aulas são dinâmicas. Me senti muito mais preparada para o ENEM depois dos estudos aqui.",
            course: "Ciências Humanas"
        },
        {
            id: 6,
            name: "Lucas Oliveira",
            role: "Aprovado em TI",
            photo: "👨‍💻",
            rating: 5,
            content: "A flexibilidade de estudar no meu próprio ritmo foi fundamental. O material é atualizado e os professores são muito qualificados. Valeu cada minuto estudado!",
            course: "Linguagens e Códigos"
        }
    ];

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                className={`h-4 w-4 ${index < rating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300 dark:text-gray-600'
                    }`}
            />
        ));
    };

    return (
        <section className="py-20 bg-white dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Avaliações dos Nossos Alunos
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Milhares de estudantes já conquistaram seus sonhos com nossos cursos.
                        Veja os depoimentos de quem já foi aprovado!
                    </p>

                    {/* Success Stats */}
                    <div className="flex justify-center items-center space-x-8 mt-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400">95%</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Taxa de Aprovação</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">50k+</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Alunos Aprovados</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">4.9</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Avaliação Média</div>
                        </div>
                    </div>
                </div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="bg-gray-50 dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
                        >
                            {/* Quote Icon */}
                            <div className="absolute top-4 right-4">
                                <Quote className="h-6 w-6 text-blue-600/30 dark:text-blue-400/30" />
                            </div>

                            {/* Rating */}
                            <div className="flex items-center space-x-1 mb-4">
                                {renderStars(testimonial.rating)}
                            </div>

                            {/* Content */}                            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                                &ldquo;{testimonial.content}&rdquo;
                            </p>

                            {/* Student Info */}
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-2xl">
                                    {testimonial.photo}
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900 dark:text-white">
                                        {testimonial.name}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {testimonial.role}
                                    </div>
                                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                        {testimonial.course}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="text-center mt-16">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                        <h3 className="text-2xl font-bold mb-4">
                            Seja Você o Próximo Aprovado! 🎯
                        </h3>
                        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                            Junte-se a milhares de estudantes que já conquistaram suas vagas nos melhores vestibulares do país.
                            Comece hoje mesmo sua jornada rumo à aprovação!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="#cursos"
                                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Ver Cursos Disponíveis
                            </a>
                            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                                Falar com Consultor
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
