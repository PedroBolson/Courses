'use client';

import React, { useState } from 'react';
import { X, Calendar, MapPin, Users, Mail, User, CheckCircle, Loader2 } from 'lucide-react';
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
    convidado?: Pessoa;
    area?: Area;
}

interface PalestraRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    palestra: Palestra | null;
    convidado?: Pessoa;
    area?: Area;
}

export default function PalestraRegistrationModal({
    isOpen,
    onClose,
    palestra,
    convidado,
    area
}: PalestraRegistrationModalProps) {
    const [formData, setFormData] = useState({
        nome: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const { addQuery } = useQuery();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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

    const validateForm = () => {
        if (!formData.nome.trim()) {
            setError('Nome é obrigatório');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Email é obrigatório');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Email inválido');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm() || !palestra) return;

        try {
            setLoading(true);

            const response = await fetch(`${API_URL}/inscricoes-palestras`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    palestra_id: palestra.id,
                    nome: formData.nome.trim(),
                    email: formData.email.trim()
                })
            });

            if (response.ok) {
                const data = await response.json();
                const fixedData = fixObjectEncoding(data);
                if (fixedData.executedQuery) {
                    addQuery(fixedData.executedQuery, 'POST /inscricoes-palestras');
                }
                setSuccess(true);
            } else {
                const errorData = await response.json();
                if (response.status === 400 && errorData.message?.includes('já está inscrito')) {
                    setError('Este email já está inscrito nesta palestra');
                } else {
                    setError('Erro ao processar inscrição. Tente novamente.');
                }
            }
        } catch (error) {
            console.error('Erro ao inscrever na palestra:', error);
            setError('Erro de conexão. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ nome: '', email: '' });
        setError('');
        setSuccess(false);
        onClose();
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (error) setError('');
    };

    if (!isOpen || !palestra) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
                {!success ? (
                    <>
                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold">Inscrição na Palestra</h2>
                                    <p className="text-purple-100 text-sm">Preencha seus dados para se inscrever</p>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="text-white hover:text-purple-200 p-1"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* Palestra Info */}
                            <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                                    {palestra.titulo}
                                </h3>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                                        <Calendar className="h-4 w-4 text-blue-500" />
                                        <span>{formatDate(palestra.data_hora)}</span>
                                    </div>

                                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                                        <MapPin className="h-4 w-4 text-green-500" />
                                        <span>{palestra.local}</span>
                                    </div>

                                    {convidado && (
                                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                                            <Users className="h-4 w-4 text-purple-500" />
                                            <span>{convidado.nome}</span>
                                        </div>
                                    )}

                                    {area && (
                                        <div className="inline-block bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-xs font-medium mt-2">
                                            {area.nome_area}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Nome completo *
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={formData.nome}
                                            onChange={(e) => handleInputChange('nome', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                                            placeholder="Digite seu nome completo"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Email *
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                                            placeholder="Digite seu email"
                                            required
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                                    </div>
                                )}

                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 font-medium transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span>Inscrevendo...</span>
                                            </>
                                        ) : (
                                            <span>Confirmar Inscrição</span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </>
                ) : (
                    /* Success Screen */
                    <div className="p-6 text-center">
                        <div className="mb-6">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Inscrição Confirmada!
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                Sua inscrição na palestra foi realizada com sucesso.
                            </p>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                Próximos passos:
                            </h3>
                            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 text-left">
                                <li>• Você receberá um email de confirmação em breve</li>
                                <li>• O link para assistir a palestra online será enviado por email</li>
                                <li>• Data e hora: <strong>{formatDate(palestra.data_hora)}</strong></li>
                                <li>• Local: <strong>{palestra.local}</strong></li>
                            </ul>
                        </div>

                        <button
                            onClick={handleClose}
                            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Fechar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
