'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, Star, MessageSquare, Send, Edit, Trash2 } from 'lucide-react';
import { fixObjectEncoding } from '../utils/textUtils';
import { useQuery } from '../contexts/QueryContext';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    alunosCursosId: number;
    courseTitle: string;
}

interface FeedbackData {
    id?: number;
    alunosCursosId: number;
    avaliacao: number;
    comentario: string;
    data_feedback?: string;
}

export default function FeedbackModal({
    isOpen,
    onClose,
    alunosCursosId,
    courseTitle
}: FeedbackModalProps) {
    const [feedback, setFeedback] = useState<FeedbackData>({
        alunosCursosId,
        avaliacao: 5,
        comentario: ''
    });
    const [existingFeedback, setExistingFeedback] = useState<FeedbackData | null>(null);
    const [loading, setLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit' | 'view'>('create');

    const { addQuery } = useQuery();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    const fetchExistingFeedback = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/feedback/aluno-curso/${alunosCursosId}`);
            const data = await response.json();
            const fixedData = fixObjectEncoding(data);
            if (data.executedQuery) addQuery(data.executedQuery, `GET /feedback/aluno-curso/${alunosCursosId}`);

            if (fixedData.rows && fixedData.rows.length > 0) {
                const existingData = fixedData.rows[0];
                setExistingFeedback(existingData);
                setFeedback({
                    ...existingData,
                    comentario: fixedData.rows[0].comentario || ''
                });
                setMode('view');
            } else {
                setExistingFeedback(null);
                setFeedback({
                    alunosCursosId,
                    avaliacao: 5,
                    comentario: ''
                });
                setMode('create');
            }
        } catch (error) {
            console.error('Erro ao buscar feedback existente:', error);
        } finally {
            setLoading(false);
        }
    }, [alunosCursosId, API_URL, addQuery]);

    useEffect(() => {
        if (isOpen && alunosCursosId) {
            fetchExistingFeedback();
        }
    }, [isOpen, alunosCursosId, fetchExistingFeedback]);

    const handleStarClick = (rating: number) => {
        if (mode !== 'view') {
            setFeedback(prev => ({ ...prev, avaliacao: rating }));
        }
    };

    const handleCommentChange = (value: string) => {
        if (mode !== 'view') {
            setFeedback(prev => ({ ...prev, comentario: value }));
        }
    };

    const handleSave = async () => {
        if (!feedback.comentario.trim()) {
            alert('Por favor, adicione um comentário sobre o curso.');
            return;
        }

        try {
            setSaveLoading(true);

            if (mode === 'create') {
                // Criar novo feedback
                const response = await fetch(`${API_URL}/feedback`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        alunosCursosId: feedback.alunosCursosId,
                        avaliacao: feedback.avaliacao,
                        comentario: feedback.comentario
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    const fixedData = fixObjectEncoding(data);
                    if (fixedData.executedQuery) addQuery(fixedData.executedQuery, 'POST /feedback');

                    alert('Feedback enviado com sucesso!');
                    await fetchExistingFeedback(); // Recarregar dados
                }
            } else if (mode === 'edit' && existingFeedback?.id) {
                // Atualizar feedback existente
                const response = await fetch(`${API_URL}/feedback/${existingFeedback.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        avaliacao: feedback.avaliacao,
                        comentario: feedback.comentario
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    const fixedData = fixObjectEncoding(data);
                    if (fixedData.executedQuery) addQuery(fixedData.executedQuery, `PUT /feedback/${existingFeedback.id}`);

                    alert('Feedback atualizado com sucesso!');
                    await fetchExistingFeedback(); // Recarregar dados
                }
            }
        } catch (error) {
            console.error('Erro ao salvar feedback:', error);
            alert('Erro ao salvar feedback. Tente novamente.');
        } finally {
            setSaveLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!existingFeedback?.id) return;

        if (!confirm('Tem certeza que deseja excluir seu feedback? Esta ação não pode ser desfeita.')) {
            return;
        }

        try {
            setSaveLoading(true);
            const response = await fetch(`${API_URL}/feedback/${existingFeedback.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                const data = await response.json();
                if (data.executedQuery) addQuery(data.executedQuery, `DELETE /feedback/${existingFeedback.id}`);
                alert('Feedback excluído com sucesso!');
                setExistingFeedback(null);
                setFeedback({
                    alunosCursosId,
                    avaliacao: 5,
                    comentario: ''
                });
                setMode('create');
            }
        } catch (error) {
            console.error('Erro ao excluir feedback:', error);
            alert('Erro ao excluir feedback. Tente novamente.');
        } finally {
            setSaveLoading(false);
        }
    };

    const handleClose = () => {
        setFeedback({
            alunosCursosId,
            avaliacao: 5,
            comentario: ''
        });
        setMode(existingFeedback ? 'view' : 'create');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-start justify-center p-4 pt-20 min-h-screen overflow-y-auto">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold">
                                {mode === 'create' ? 'Avaliar Curso' : mode === 'edit' ? 'Editar Avaliação' : 'Sua Avaliação'}
                            </h2>
                            <p className="text-purple-100">
                                {courseTitle}
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            title="Fechar"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Carregando...
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Rating Stars */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Avaliação geral do curso *
                                </label>
                                <div className="flex items-center space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => handleStarClick(star)}
                                            className={`p-1 transition-colors ${mode === 'view' ? 'cursor-default' : 'hover:scale-110'
                                                }`}
                                            disabled={mode === 'view'}
                                        >
                                            <Star
                                                className={`h-8 w-8 ${star <= feedback.avaliacao
                                                    ? 'text-yellow-400 fill-current'
                                                    : 'text-gray-300 dark:text-gray-600'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                    <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                                        {feedback.avaliacao === 1 ? 'Muito ruim' :
                                            feedback.avaliacao === 2 ? 'Ruim' :
                                                feedback.avaliacao === 3 ? 'Regular' :
                                                    feedback.avaliacao === 4 ? 'Bom' : 'Excelente'}
                                    </span>
                                </div>
                            </div>

                            {/* Comment */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Comentário sobre o curso *
                                </label>
                                <div className="relative">
                                    <MessageSquare className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                                    <textarea
                                        value={feedback.comentario}
                                        onChange={(e) => handleCommentChange(e.target.value)}
                                        readOnly={mode === 'view'}
                                        className={`w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white resize-none ${mode === 'view' ? 'bg-gray-50 dark:bg-slate-600' : ''
                                            }`}
                                        placeholder={mode === 'view' ? '' : 'Compartilhe sua experiência com o curso, o que mais gostou, sugestões de melhoria...'}
                                        rows={4}
                                        maxLength={1000}
                                    />
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {mode !== 'view' && 'Máximo 1000 caracteres'}
                                    </p>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {feedback.comentario.length}/1000
                                    </span>
                                </div>
                            </div>

                            {/* Data do Feedback (se existir) */}
                            {existingFeedback?.data_feedback && (
                                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        <strong>Avaliação enviada em:</strong> {new Date(existingFeedback.data_feedback).toLocaleString('pt-BR')}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 dark:bg-slate-700 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        {existingFeedback && mode === 'view' && (
                            <>
                                <button
                                    onClick={() => setMode('edit')}
                                    className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                >
                                    <Edit className="h-4 w-4" />
                                    <span>Editar</span>
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={saveLoading}
                                    className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span>Excluir</span>
                                </button>
                            </>
                        )}
                    </div>

                    <div className="flex space-x-3">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                        >
                            {mode === 'view' ? 'Fechar' : 'Cancelar'}
                        </button>

                        {mode !== 'view' && (
                            <button
                                onClick={handleSave}
                                disabled={saveLoading || !feedback.comentario.trim()}
                                className="flex items-center space-x-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                            >
                                {saveLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Salvando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4" />
                                        <span>{mode === 'create' ? 'Enviar Avaliação' : 'Salvar Alterações'}</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
