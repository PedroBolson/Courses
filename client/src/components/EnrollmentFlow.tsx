'use client';

import React, { useState } from 'react';
import { CreditCard, User, Lock, CheckCircle, ArrowRight, ArrowLeft, DollarSign, X, Smartphone, FileText } from 'lucide-react';
import { useQuery } from '@/contexts/QueryContext';
import { fixObjectEncoding } from '@/utils/textUtils';

interface EnrollmentFlowProps {
    isOpen: boolean;
    onClose: () => void;
    courseName?: string;
    coursePrice?: number;
    courseId?: number;
}

interface PersonData {
    nome: string;
    email: string;
    telefone: string;
    cpf: string;
}

interface PaymentData {
    cardNumber: string;
    cardName: string;
    expiryDate: string;
    cvv: string;
}

type Step = 'personal' | 'payment' | 'processing' | 'success';
type PaymentMethod = 'cartao_credito' | 'pix' | 'boleto';

export default function EnrollmentFlow({
    isOpen,
    onClose,
    courseName = "Curso ENEM",
    coursePrice = 299.90,
    courseId = 1
}: EnrollmentFlowProps) {
    const [currentStep, setCurrentStep] = useState<Step>('personal');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cartao_credito');
    const [personData, setPersonData] = useState<PersonData>({
        nome: '',
        email: '',
        telefone: '',
        cpf: ''
    });
    const [paymentData, setPaymentData] = useState<PaymentData>({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: ''
    });
    const [createdIds, setCreatedIds] = useState<{
        pessoaId?: number;
        alunoId?: number;
        pagamentoId?: number;
    }>({});

    const { addQuery } = useQuery();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    const steps = [
        { id: 'personal', title: 'Dados Pessoais', icon: User },
        { id: 'payment', title: 'Pagamento', icon: CreditCard },
        { id: 'processing', title: 'Processando', icon: Lock },
        { id: 'success', title: 'Concluído', icon: CheckCircle }
    ];

    const getCurrentStepIndex = () => steps.findIndex(step => step.id === currentStep);

    const handlePersonDataChange = (field: keyof PersonData, value: string) => {
        setPersonData(prev => ({ ...prev, [field]: value }));
    };

    const handlePaymentDataChange = (field: keyof PaymentData, value: string) => {
        setPaymentData(prev => ({ ...prev, [field]: value }));
    };

    const validatePersonalData = () => {
        return personData.nome && personData.email && personData.telefone && personData.cpf;
    }; const validatePaymentData = () => {
        if (paymentMethod === 'cartao_credito') {
            return paymentData.cardNumber && paymentData.cardName && paymentData.expiryDate && paymentData.cvv;
        }
        // PIX e Boleto não precisam de dados adicionais
        return true;
    };

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    const formatCPF = (value: string) => {
        const v = value.replace(/\D/g, '');
        return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }; const processEnrollment = async () => {
        try {
            setCurrentStep('processing');

            // Simular delay de processamento
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Debug: verificar dados antes de enviar
            const cpfLimpo = personData.cpf.replace(/\D/g, '');
            console.log('Dados da pessoa:', {
                nome: personData.nome,
                email: personData.email,
                telefone: personData.telefone,
                cpf: cpfLimpo,
                cpfLength: cpfLimpo.length
            });

            // 1. Criar pessoa
            const pessoaResponse = await fetch(`${API_URL}/pessoas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: personData.nome,
                    email: personData.email,
                    telefone: personData.telefone,
                    cpf: cpfLimpo
                })
            });            if (!pessoaResponse.ok) {
                const errorData = await pessoaResponse.text();
                if (pessoaResponse.status === 409 || errorData.includes('already exists') || errorData.includes('duplicate')) {
                    throw new Error('Já existe um usuário cadastrado com esses dados. Verifique se você já possui uma conta.');
                }
                throw new Error('Erro ao criar pessoa');
            }

            const pessoaData = await pessoaResponse.json();
            const fixedPessoaData = fixObjectEncoding(pessoaData);
            const pessoaId = fixedPessoaData.rows[0].id;

            addQuery(fixedPessoaData.executedQuery, 'POST /pessoas');

            // 2. Criar aluno
            const alunoResponse = await fetch(`${API_URL}/alunos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pessoa_id: pessoaId,
                    senha: 'tempPassword123' // Senha temporária que o aluno pode alterar depois
                })
            });

            if (!alunoResponse.ok) {
                throw new Error('Erro ao criar aluno');
            }

            const alunoData = await alunoResponse.json();
            const fixedAlunoData = fixObjectEncoding(alunoData);
            const alunoId = fixedAlunoData.rows[0].id;

            addQuery(fixedAlunoData.executedQuery, 'POST /alunos');            // 3. Criar pagamento
            const pagamentoResponse = await fetch(`${API_URL}/pagamentos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    aluno_id: alunoId,
                    valor: coursePrice,
                    forma_pagamento: paymentMethod
                })
            });

            if (!pagamentoResponse.ok) {
                throw new Error('Erro ao processar pagamento');
            }

            const pagamentoData = await pagamentoResponse.json();
            const fixedPagamentoData = fixObjectEncoding(pagamentoData);
            const pagamentoId = fixedPagamentoData.rows[0].id;

            addQuery(fixedPagamentoData.executedQuery, 'POST /pagamentos');            // 4. Inscrever aluno no curso (se courseId foi fornecido)
            if (courseId) {
                const inscricaoResponse = await fetch(`${API_URL}/alunos-cursos`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        aluno_id: alunoId,
                        curso_id: courseId
                    })
                });

                if (inscricaoResponse.ok) {
                    const inscricaoData = await inscricaoResponse.json();
                    const fixedInscricaoData = fixObjectEncoding(inscricaoData);
                    addQuery(fixedInscricaoData.executedQuery, 'POST /alunos-cursos');
                }
            }

            setCreatedIds({
                pessoaId,
                alunoId,
                pagamentoId
            });

            setCurrentStep('success');
        } catch (error) {
            console.error('Erro no processo de matrícula:', error); alert('Erro ao processar matrícula. Tente novamente.');
            setCurrentStep('payment');
        }
    };

    const handleNext = () => {
        if (currentStep === 'personal' && validatePersonalData()) {
            setCurrentStep('payment');
        } else if (currentStep === 'payment' && validatePaymentData()) {
            processEnrollment();
        }
    };

    const handleBack = () => {
        if (currentStep === 'payment') {
            setCurrentStep('personal');
        }
    }; const handleClose = () => {
        setCurrentStep('personal');
        setPaymentMethod('cartao_credito');
        setPersonData({ nome: '', email: '', telefone: '', cpf: '' });
        setPaymentData({ cardNumber: '', cardName: '', expiryDate: '', cvv: '' });
        setCreatedIds({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold">Matrícula no {courseName}</h2>
                            <p className="text-blue-100">Complete sua inscrição em 3 passos simples</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm text-blue-100">Valor</p>
                                <p className="text-2xl font-bold">R$ {coursePrice.toFixed(2)}</p>
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
                </div>

                {/* Progress Steps */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-slate-700">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => {
                            const StepIcon = step.icon;
                            const isActive = index === getCurrentStepIndex();
                            const isCompleted = index < getCurrentStepIndex();

                            return (
                                <div key={step.id} className="flex items-center">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${isActive ? 'bg-blue-600 border-blue-600 text-white' :
                                        isCompleted ? 'bg-green-600 border-green-600 text-white' :
                                            'bg-gray-200 border-gray-300 text-gray-400'
                                        }`}>
                                        <StepIcon className="h-5 w-5" />
                                    </div>
                                    <span className={`ml-2 text-sm font-medium ${isActive ? 'text-blue-600' :
                                        isCompleted ? 'text-green-600' :
                                            'text-gray-400'
                                        }`}>
                                        {step.title}
                                    </span>
                                    {index < steps.length - 1 && (
                                        <ArrowRight className="h-4 w-4 mx-4 text-gray-300" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {currentStep === 'personal' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Seus dados pessoais
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Nome completo *
                                    </label>
                                    <input
                                        type="text"
                                        value={personData.nome}
                                        onChange={(e) => handlePersonDataChange('nome', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                                        placeholder="Digite seu nome completo"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        CPF *
                                    </label>
                                    <input
                                        type="text"
                                        value={personData.cpf}
                                        onChange={(e) => handlePersonDataChange('cpf', formatCPF(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                                        placeholder="000.000.000-00"
                                        maxLength={14}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        value={personData.email}
                                        onChange={(e) => handlePersonDataChange('email', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                                        placeholder="seu@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Telefone *
                                    </label>
                                    <input
                                        type="tel"
                                        value={personData.telefone}
                                        onChange={(e) => handlePersonDataChange('telefone', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                                        placeholder="(11) 99999-9999"
                                    />
                                </div>
                            </div>
                        </div>
                    )}                    {currentStep === 'payment' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Escolha a forma de pagamento
                            </h3>

                            {/* Payment Method Selection */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <button
                                    onClick={() => setPaymentMethod('cartao_credito')}
                                    className={`p-4 border-2 rounded-lg transition-all ${paymentMethod === 'cartao_credito'
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                                        }`}
                                >
                                    <CreditCard className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">Cartão de Crédito</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Aprovação imediata</div>
                                </button>

                                <button
                                    onClick={() => setPaymentMethod('pix')}
                                    className={`p-4 border-2 rounded-lg transition-all ${paymentMethod === 'pix'
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                                        }`}
                                >
                                    <Smartphone className="h-8 w-8 mx-auto mb-2 text-green-600" />
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">PIX</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Aprovação em minutos</div>
                                </button>

                                <button
                                    onClick={() => setPaymentMethod('boleto')}
                                    className={`p-4 border-2 rounded-lg transition-all ${paymentMethod === 'boleto'
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                                        }`}
                                >
                                    <FileText className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">Boleto</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Até 3 dias úteis</div>
                                </button>
                            </div>

                            {/* Payment Method Specific Content */}
                            {paymentMethod === 'cartao_credito' && (
                                <>
                                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white mb-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className="text-blue-100 text-sm">Cartão de Crédito</p>
                                                <p className="text-xl font-mono">
                                                    {paymentData.cardNumber || '**** **** **** ****'}
                                                </p>
                                            </div>
                                            <CreditCard className="h-8 w-8" />
                                        </div>
                                        <div className="flex justify-between">
                                            <div>
                                                <p className="text-blue-100 text-sm">Nome no cartão</p>
                                                <p className="font-medium">
                                                    {paymentData.cardName || 'SEU NOME'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-blue-100 text-sm">Válido até</p>
                                                <p className="font-medium">
                                                    {paymentData.expiryDate || 'MM/AA'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Número do cartão *
                                            </label>
                                            <input
                                                type="text"
                                                value={paymentData.cardNumber}
                                                onChange={(e) => handlePaymentDataChange('cardNumber', formatCardNumber(e.target.value))}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white font-mono"
                                                placeholder="1234 5678 9012 3456"
                                                maxLength={19}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Nome no cartão *
                                            </label>
                                            <input
                                                type="text"
                                                value={paymentData.cardName}
                                                onChange={(e) => handlePaymentDataChange('cardName', e.target.value.toUpperCase())}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                                                placeholder="NOME COMO NO CARTÃO"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Validade *
                                            </label>
                                            <input
                                                type="text"
                                                value={paymentData.expiryDate}
                                                onChange={(e) => {
                                                    let value = e.target.value.replace(/\D/g, '');
                                                    if (value.length >= 2) {
                                                        value = value.substring(0, 2) + '/' + value.substring(2, 4);
                                                    }
                                                    handlePaymentDataChange('expiryDate', value);
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white font-mono"
                                                placeholder="MM/AA"
                                                maxLength={5}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                CVV *
                                            </label>
                                            <input
                                                type="text"
                                                value={paymentData.cvv}
                                                onChange={(e) => handlePaymentDataChange('cvv', e.target.value.replace(/\D/g, ''))}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white font-mono"
                                                placeholder="123"
                                                maxLength={4}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {paymentMethod === 'pix' && (
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <Smartphone className="h-8 w-8 text-green-600" />
                                        <div>
                                            <h4 className="font-semibold text-green-800 dark:text-green-400">Pagamento via PIX</h4>
                                            <p className="text-sm text-green-600 dark:text-green-300">Aprovação instantânea</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-sm text-green-700 dark:text-green-300">
                                            🎯 <strong>Como funciona:</strong>
                                        </p>
                                        <ul className="text-sm text-green-700 dark:text-green-300 space-y-1 ml-4">
                                            <li>• Você receberá um QR Code para pagamento</li>
                                            <li>• Escaneie com seu app do banco</li>
                                            <li>• Confirme o pagamento</li>
                                            <li>• Sua matrícula será liberada automaticamente</li>
                                        </ul>
                                        <div className="bg-white dark:bg-slate-800 p-3 rounded border border-green-300 dark:border-green-600">
                                            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                                                O QR Code será gerado após confirmar seus dados
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {paymentMethod === 'boleto' && (
                                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <FileText className="h-8 w-8 text-orange-600" />
                                        <div>
                                            <h4 className="font-semibold text-orange-800 dark:text-orange-400">Boleto Bancário</h4>
                                            <p className="text-sm text-orange-600 dark:text-orange-300">Vencimento em 3 dias úteis</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-sm text-orange-700 dark:text-orange-300">
                                            📋 <strong>Instruções:</strong>
                                        </p>
                                        <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1 ml-4">
                                            <li>• Você receberá o boleto por email</li>
                                            <li>• Pague em qualquer banco, casa lotérica ou app</li>
                                            <li>• Prazo para pagamento: 3 dias úteis</li>
                                            <li>• Sua matrícula será liberada em até 2 dias úteis após o pagamento</li>
                                        </ul>
                                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-600 p-3 rounded">
                                            <p className="text-xs text-yellow-700 dark:text-yellow-300">
                                                ⚠️ <strong>Atenção:</strong> Após o vencimento, será necessário gerar um novo boleto
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {currentStep === 'processing' && (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Processando sua matrícula...
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Aguarde enquanto criamos sua conta e processamos o pagamento
                            </p>
                        </div>
                    )}

                    {currentStep === 'success' && (
                        <div className="text-center py-8">
                            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Matrícula realizada com sucesso! 🎉
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Bem-vindo(a) ao {courseName}! Sua conta foi criada e o pagamento foi aprovado.
                            </p>

                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                                <h4 className="font-semibold text-green-800 dark:text-green-400 mb-2">
                                    Dados da sua matrícula:
                                </h4>
                                <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
                                    <p><strong>Nome:</strong> {personData.nome}</p>
                                    <p><strong>Email:</strong> {personData.email}</p>
                                    <p><strong>ID do Aluno:</strong> #{createdIds.alunoId}</p>
                                    <p><strong>ID do Pagamento:</strong> #{createdIds.pagamentoId}</p>
                                    <p><strong>Senha temporária:</strong> tempPassword123</p>
                                </div>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                    💡 <strong>Próximos passos:</strong> Você receberá um email com instruções para
                                    acessar a plataforma e alterar sua senha.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 dark:bg-slate-700 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        {currentStep !== 'processing' && currentStep !== 'success' && (
                            <>
                                <DollarSign className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    Total: R$ {coursePrice.toFixed(2)}
                                </span>
                            </>
                        )}
                    </div>

                    <div className="flex space-x-3">
                        {currentStep === 'success' ? (
                            <button
                                onClick={handleClose}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Fechar
                            </button>
                        ) : currentStep !== 'processing' ? (
                            <>
                                {currentStep !== 'personal' && (
                                    <button
                                        onClick={handleBack}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors flex items-center space-x-2"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        <span>Voltar</span>
                                    </button>
                                )}                                <button
                                    onClick={currentStep === 'personal' ? handleNext : currentStep === 'payment' ? handleNext : handleClose}
                                    disabled={
                                        (currentStep === 'personal' && !validatePersonalData()) ||
                                        (currentStep === 'payment' && !validatePaymentData())
                                    }
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                                >
                                    <span>
                                        {currentStep === 'personal' ? 'Continuar' :
                                            currentStep === 'payment' ?
                                                (paymentMethod === 'pix' ? 'Gerar QR Code PIX' :
                                                    paymentMethod === 'boleto' ? 'Gerar Boleto' :
                                                        'Finalizar com Cartão') : 'Fechar'}
                                    </span>
                                    {(currentStep === 'personal' || currentStep === 'payment') && <ArrowRight className="h-4 w-4" />}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
