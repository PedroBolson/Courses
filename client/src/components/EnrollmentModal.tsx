'use client';

import React, { useState } from 'react';
import { X, User, Mail, CreditCard, BookOpen, CheckCircle } from 'lucide-react';

interface Curso {
    id: number;
    titulo: string;
    descricao: string;
    area_id: number;
}

interface EnrollmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    curso: Curso | null;
}

interface StudentData {
    nome: string;
    email: string;
    telefone: string;
    cpf: string;
    endereco: string;
    cidade: string;
    estado: string;
    cep: string;
}

export default function EnrollmentModal({ isOpen, onClose, curso }: EnrollmentModalProps) {
    const [step, setStep] = useState(1);
    const [studentData, setStudentData] = useState<StudentData>({
        nome: '',
        email: '',
        telefone: '',
        cpf: '',
        endereco: '',
        cidade: '',
        estado: '',
        cep: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('');
    const [loading, setLoading] = useState(false);
    const [enrolled, setEnrolled] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    const handleInputChange = (field: keyof StudentData, value: string) => {
        setStudentData(prev => ({ ...prev, [field]: value }));
    };

    const handleNextStep = () => {
        if (step < 3) setStep(step + 1);
    };

    const handlePrevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleEnrollment = async () => {
        setLoading(true);
        try {
            // First create the student
            const studentResponse = await fetch(`${API_URL}/pessoas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: studentData.nome,
                    email: studentData.email,
                    telefone: studentData.telefone,
                    endereco: studentData.endereco,
                    cidade: studentData.cidade,
                    estado: studentData.estado,
                    cep: studentData.cep
                }),
            });

            if (studentResponse.ok) {
                const studentResult = await studentResponse.json();

                // Then create the student record
                const alunoResponse = await fetch(`${API_URL}/alunos`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        pessoa_id: studentResult.data.id,
                        cpf: studentData.cpf
                    }),
                });

                if (alunoResponse.ok) {
                    setEnrolled(true);
                    setTimeout(() => {
                        onClose();
                        setEnrolled(false);
                        setStep(1);
                        setStudentData({
                            nome: '',
                            email: '',
                            telefone: '',
                            cpf: '',
                            endereco: '',
                            cidade: '',
                            estado: '',
                            cep: ''
                        });
                    }, 3000);
                }
            }
        } catch (error) {
            console.error('Error enrolling student:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    if (enrolled) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-8 max-w-md w-full mx-4 text-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Inscrição Realizada!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Sua inscrição no curso <strong>{curso?.titulo}</strong> foi realizada com sucesso!
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Você receberá um email com as instruções para acessar o portal do aluno.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Inscrição no Curso
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {curso?.titulo}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Progress Steps */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                        {[1, 2, 3].map((num) => (
                            <div key={num} className="flex items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= num
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                                        }`}
                                >
                                    {num}
                                </div>
                                {num < 3 && (
                                    <div
                                        className={`w-12 h-1 mx-2 ${step > num
                                                ? 'bg-blue-600'
                                                : 'bg-gray-200 dark:bg-gray-600'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>Dados Pessoais</span>
                        <span>Endereço</span>
                        <span>Pagamento</span>
                    </div>
                </div>

                {/* Step 1: Personal Data */}
                {step === 1 && (
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                            <User className="h-5 w-5 mr-2" />
                            Dados Pessoais
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Nome Completo *
                                </label>
                                <input
                                    type="text"
                                    value={studentData.nome}
                                    onChange={(e) => handleInputChange('nome', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                                    placeholder="Seu nome completo"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    CPF *
                                </label>
                                <input
                                    type="text"
                                    value={studentData.cpf}
                                    onChange={(e) => handleInputChange('cpf', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                                    placeholder="000.000.000-00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={studentData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                                    placeholder="seu@email.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Telefone *
                                </label>
                                <input
                                    type="tel"
                                    value={studentData.telefone}
                                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                                    placeholder="(11) 99999-9999"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Address */}
                {step === 2 && (
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                            <Mail className="h-5 w-5 mr-2" />
                            Endereço
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Endereço Completo *
                                </label>
                                <input
                                    type="text"
                                    value={studentData.endereco}
                                    onChange={(e) => handleInputChange('endereco', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                                    placeholder="Rua, número, complemento"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Cidade *
                                </label>
                                <input
                                    type="text"
                                    value={studentData.cidade}
                                    onChange={(e) => handleInputChange('cidade', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                                    placeholder="São Paulo"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Estado *
                                </label>
                                <select
                                    value={studentData.estado}
                                    onChange={(e) => handleInputChange('estado', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                                >
                                    <option value="">Selecione</option>
                                    <option value="SP">São Paulo</option>
                                    <option value="RJ">Rio de Janeiro</option>
                                    <option value="MG">Minas Gerais</option>
                                    <option value="RS">Rio Grande do Sul</option>
                                    <option value="PR">Paraná</option>
                                    <option value="SC">Santa Catarina</option>
                                    <option value="GO">Goiás</option>
                                    <option value="ES">Espírito Santo</option>
                                    <option value="BA">Bahia</option>
                                    <option value="PE">Pernambuco</option>
                                    <option value="CE">Ceará</option>
                                    <option value="DF">Distrito Federal</option>
                                    <option value="AM">Amazonas</option>
                                    <option value="PA">Pará</option>
                                    <option value="MT">Mato Grosso</option>
                                    <option value="MS">Mato Grosso do Sul</option>
                                    <option value="RO">Rondônia</option>
                                    <option value="AC">Acre</option>
                                    <option value="RR">Roraima</option>
                                    <option value="AP">Amapá</option>
                                    <option value="TO">Tocantins</option>
                                    <option value="MA">Maranhão</option>
                                    <option value="PI">Piauí</option>
                                    <option value="AL">Alagoas</option>
                                    <option value="SE">Sergipe</option>
                                    <option value="PB">Paraíba</option>
                                    <option value="RN">Rio Grande do Norte</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    CEP *
                                </label>
                                <input
                                    type="text"
                                    value={studentData.cep}
                                    onChange={(e) => handleInputChange('cep', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                                    placeholder="00000-000"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Payment */}
                {step === 3 && (
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                            <CreditCard className="h-5 w-5 mr-2" />
                            Forma de Pagamento
                        </h3>

                        {/* Course Summary */}
                        <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 mb-6">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                                <BookOpen className="h-4 w-4 mr-2" />
                                Resumo do Curso
                            </h4>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                <p className="font-medium">{curso?.titulo}</p>
                                <p className="mt-1">{curso?.descricao}</p>
                            </div>
                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                                <span className="font-medium text-gray-900 dark:text-white">Total:</span>
                                <span className="text-xl font-bold text-green-600 dark:text-green-400">R$ 299,00</span>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="space-y-3">
                            <div>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="credit"
                                        checked={paymentMethod === 'credit'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="text-blue-600"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300">
                                        Cartão de Crédito (até 12x sem juros)
                                    </span>
                                </label>
                            </div>
                            <div>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="pix"
                                        checked={paymentMethod === 'pix'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="text-blue-600"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300">
                                        PIX (desconto de 10% - R$ 269,10)
                                    </span>
                                </label>
                            </div>
                            <div>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="boleto"
                                        checked={paymentMethod === 'boleto'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="text-blue-600"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300">
                                        Boleto Bancário (à vista)
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
                    <div>
                        {step > 1 && (
                            <button
                                onClick={handlePrevStep}
                                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                            >
                                Voltar
                            </button>
                        )}
                    </div>
                    <div>
                        {step < 3 ? (
                            <button
                                onClick={handleNextStep}
                                disabled={
                                    (step === 1 && (!studentData.nome || !studentData.email || !studentData.telefone || !studentData.cpf)) ||
                                    (step === 2 && (!studentData.endereco || !studentData.cidade || !studentData.estado || !studentData.cep))
                                }
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Próximo
                            </button>
                        ) : (
                            <button
                                onClick={handleEnrollment}
                                disabled={!paymentMethod || loading}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Processando...</span>
                                    </>
                                ) : (
                                    <span>Finalizar Inscrição</span>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
