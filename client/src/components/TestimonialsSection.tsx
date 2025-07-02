'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { useQuery } from '@/contexts/QueryContext';
import { fixObjectEncoding } from '@/utils/textUtils';

interface FeedbackData {
    id: number;
    aluno_nome: string;
    curso_titulo: string;
    avaliacao: number;
    comentario: string;
    data_feedback: string;
    area_nome?: string;
}

interface TestimonialCardProps {
    feedback: FeedbackData;
    renderStars: (rating: number) => React.ReactElement[];
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ feedback, renderStars }) => (
    <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 relative">
        {/* Quote Icon */}
        <div className="absolute top-4 right-4">
            <Quote className="h-6 w-6 text-blue-600/30 dark:text-blue-400/30" />
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-4">
            {renderStars(feedback.avaliacao)}
        </div>

        {/* Content */}
        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed line-clamp-4">
            &ldquo;{feedback.comentario}&rdquo;
        </p>

        {/* Student Info */}
        <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                    {feedback.aluno_nome}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Aluno do curso
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    {feedback.curso_titulo}
                </div>
            </div>
        </div>

        {/* Data */}
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            {new Date(feedback.data_feedback).toLocaleDateString('pt-BR')}
        </div>
    </div>
);

export default function TestimonialsSection() {
    const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

    const { addQuery } = useQuery();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    // Buscar feedbacks reais do banco
    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                setLoading(true);

                console.log('Iniciando busca de feedbacks...');

                // Buscar todos os feedbacks com JOIN completo
                const response = await fetch(`${API_URL}/feedback`);

                console.log('Status da resposta:', response.status);
                console.log('Response OK:', response.ok);

                if (!response.ok) {
                    console.log('Erro na resposta:', response.statusText);
                    setFeedbacks([]);
                    setLoading(false);
                    return;
                }

                const data = await response.json();
                console.log('Dados brutos da API:', data);

                const fixedData = fixObjectEncoding(data);
                console.log('Dados após encoding fix:', fixedData);

                if (data.executedQuery) {
                    addQuery(data.executedQuery, 'GET /feedback');
                }

                if (fixedData.rows && fixedData.rows.length > 0) {
                    console.log(`Encontrados ${fixedData.rows.length} feedbacks para processar`);

                    // Mapear os dados diretamente - o servidor já retorna tudo via JOIN
                    const feedbacksProcessed = fixedData.rows.map((feedback: {
                        id: number;
                        nome_aluno: string;
                        nome_curso: string;
                        avaliacao: number;
                        comentario: string;
                        data_feedback: string;
                    }) => {
                        console.log('Processando feedback raw:', feedback);

                        // Garantir que não há valores nulos/undefined para evitar erros de renderização
                        return {
                            id: feedback.id || 0,
                            aluno_nome: feedback.nome_aluno || 'Aluno',
                            curso_titulo: feedback.nome_curso || 'Curso',
                            avaliacao: Number(feedback.avaliacao) || 5, // Valor padrão 5 estrelas se não vier avaliação
                            comentario: feedback.comentario || 'Ótimo curso!',
                            data_feedback: feedback.data_feedback || new Date().toISOString(),
                            area_nome: 'Curso'
                        };
                    });

                    console.log('Feedbacks processados:', feedbacksProcessed);

                    // Filtrar feedbacks válidos e ordenar por data
                    const validFeedbacks = feedbacksProcessed
                        .filter((f: FeedbackData) => {
                            // Verificar dados obrigatórios
                            const isValid = f.id && f.aluno_nome && f.curso_titulo && f.comentario;
                            if (!isValid) {
                                console.warn('Feedback inválido ignorado:', f);
                            }
                            return isValid;
                        })
                        .sort((a: FeedbackData, b: FeedbackData) => {
                            try {
                                return new Date(b.data_feedback).getTime() - new Date(a.data_feedback).getTime();
                            } catch (e) {
                                console.warn('Erro ao ordenar por data:', e);
                                return 0;
                            }
                        });

                    console.log('Feedbacks válidos:', validFeedbacks);
                    setFeedbacks(validFeedbacks);
                } else {
                    console.log('Nenhum feedback encontrado nos dados retornados');
                    setFeedbacks([]);
                }
            } catch (error) {
                console.error('Erro ao buscar feedbacks:', error);
                setFeedbacks([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, [API_URL, addQuery]);

    // Agrupar feedbacks em grupos de 3 para exibição
    const groupedFeedbacks = [];
    for (let i = 0; i < feedbacks.length; i += 3) {
        groupedFeedbacks.push(feedbacks.slice(i, i + 3));
    }

    // Auto-play do carrossel - só ativar se houver mais de 1 grupo
    useEffect(() => {
        if (isAutoPlaying && groupedFeedbacks.length > 1) {
            autoPlayRef.current = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % groupedFeedbacks.length);
            }, 5000); // Aumentei para 5 segundos
        } else if (autoPlayRef.current) {
            clearInterval(autoPlayRef.current);
        }

        return () => {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
            }
        };
    }, [isAutoPlaying, groupedFeedbacks.length]);

    // Reset currentIndex se ultrapassar o número de grupos
    useEffect(() => {
        if (currentIndex >= groupedFeedbacks.length && groupedFeedbacks.length > 0) {
            setCurrentIndex(0);
        }
    }, [currentIndex, groupedFeedbacks.length]);

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

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % groupedFeedbacks.length);
        setIsAutoPlaying(false);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + groupedFeedbacks.length) % groupedFeedbacks.length);
        setIsAutoPlaying(false);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
        setIsAutoPlaying(false);
    };

    if (loading) {
        return (
            <section className="py-20 bg-white dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando avaliações...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (feedbacks.length === 0) {
        return (
            <section className="py-20 bg-white dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Avaliações dos Nossos Alunos
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Ainda não temos avaliações disponíveis. Seja o primeiro a avaliar nossos cursos!
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    const avgRating = feedbacks.reduce((acc, feedback) => acc + feedback.avaliacao, 0) / feedbacks.length;

    return (
        <section id="avaliacoes" className="py-20 bg-white dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Avaliações dos Nossos Alunos
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Veja o que nossos alunos estão dizendo sobre os cursos.
                        Feedbacks reais de quem está estudando conosco!
                    </p>

                    {/* Stats reais baseados nos feedbacks */}
                    <div className="flex justify-center items-center space-x-8 mt-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                                {feedbacks.length}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Avaliações</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                {avgRating.toFixed(1)}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Média de Avaliação</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                {feedbacks.filter(f => f.avaliacao === 5).length}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">5 Estrelas</div>
                        </div>
                    </div>
                </div>

                {/* Carrossel */}
                <div className="relative">
                    {/* Botões de navegação - só mostrar se houver mais de 1 grupo */}
                    {groupedFeedbacks.length > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-full p-3 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors"
                                aria-label="Avaliação anterior"
                            >
                                <ChevronLeft className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-full p-3 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors"
                                aria-label="Próxima avaliação"
                            >
                                <ChevronRight className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                            </button>
                        </>
                    )}

                    {/* Container do carrossel */}
                    <div className="overflow-hidden">
                        {groupedFeedbacks.length > 1 ? (
                            /* Carrossel ativo com múltiplos grupos */
                            <div
                                className="flex transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                            >
                                {groupedFeedbacks.map((group, groupIndex) => (
                                    <div
                                        key={groupIndex}
                                        className="w-full flex-shrink-0 grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                                    >
                                        {group.map((feedback) => (
                                            <TestimonialCard key={feedback.id} feedback={feedback} renderStars={renderStars} />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* Layout estático para poucos feedbacks */
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {feedbacks.map((feedback) => (
                                    <TestimonialCard key={feedback.id} feedback={feedback} renderStars={renderStars} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Indicadores - só mostrar se houver mais de 1 grupo */}
                    {groupedFeedbacks.length > 1 && (
                        <div className="flex justify-center space-x-2 mt-8">
                            {groupedFeedbacks.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-colors ${
                                        index === currentIndex
                                            ? 'bg-blue-600 dark:bg-blue-400'
                                            : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                                    }`}
                                    aria-label={`Ir para grupo ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* CTA Section */}
                <div className="text-center mt-16">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                        <h3 className="text-2xl font-bold mb-4">
                            Seja Você o Próximo a Avaliar! 🎯
                        </h3>
                        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                            Junte-se aos nossos alunos e compartilhe sua experiência.
                            Comece hoje mesmo sua jornada de aprendizado!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="#areas-cursos"
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
