'use client';

import React, { useState } from 'react';
import { Check, Star, Zap, Crown, Users } from 'lucide-react';

interface PricingPlan {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    period: string;
    features: string[];
    highlighted?: boolean;
    icon: React.ReactNode;
    badge?: string;
}

export default function PricingSection() {
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

    const plans: PricingPlan[] = [
        {
            id: 'basic',
            name: 'Plano Básico',
            description: 'Ideal para quem está começando a estudar para o ENEM',
            price: billingPeriod === 'monthly' ? 199 : 1590,
            originalPrice: billingPeriod === 'monthly' ? 299 : 2388,
            period: billingPeriod === 'monthly' ? '/mês' : '/ano',
            features: [
                'Acesso a 2 áreas de conhecimento',
                'Videoaulas em HD',
                'Material didático em PDF',
                'Simulados mensais',
                'Suporte via chat',
                'Acesso por 6 meses'
            ],
            icon: <Star className="h-6 w-6" />,
        },
        {
            id: 'pro',
            name: 'Plano Pro',
            description: 'Completo para quem quer se preparar com tudo',
            price: billingPeriod === 'monthly' ? 299 : 2390,
            originalPrice: billingPeriod === 'monthly' ? 449 : 3588,
            period: billingPeriod === 'monthly' ? '/mês' : '/ano',
            features: [
                'Acesso a todas as áreas',
                'Videoaulas em 4K',
                'Material didático completo',
                'Simulados semanais',
                'Aulas ao vivo mensais',
                'Suporte prioritário',
                'Mentoria individual',
                'Acesso por 12 meses',
                'Garantia de 30 dias'
            ],
            highlighted: true,
            icon: <Zap className="h-6 w-6" />,
            badge: 'Mais Popular'
        },
        {
            id: 'premium',
            name: 'Plano Premium',
            description: 'Para quem busca a excelência e aprovação garantida',
            price: billingPeriod === 'monthly' ? 499 : 3990,
            originalPrice: billingPeriod === 'monthly' ? 699 : 5588,
            period: billingPeriod === 'monthly' ? '/mês' : '/ano',
            features: [
                'Tudo do Plano Pro',
                'Aulas particulares semanais',
                'Correção de redação ilimitada',
                'Simulados personalizados',
                'Grupo VIP no WhatsApp',
                'Suporte 24/7',
                'Cronograma personalizado',
                'Acesso vitalício',
                'Certificado de conclusão',
                'Garantia de aprovação*'
            ],
            icon: <Crown className="h-6 w-6" />,
            badge: 'Premium'
        }
    ];

    const discountPercentage = billingPeriod === 'yearly' ? 33 : 33;

    return (
        <section className="py-20 bg-white dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Escolha Seu Plano de Estudos
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                        Planos flexíveis para todos os perfis de estudantes.
                        Comece hoje mesmo sua jornada rumo à aprovação!
                    </p>

                    {/* Billing Toggle */}
                    <div className="inline-flex bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
                        <button
                            onClick={() => setBillingPeriod('monthly')}
                            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${billingPeriod === 'monthly'
                                    ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                        >
                            Mensal
                        </button>
                        <button
                            onClick={() => setBillingPeriod('yearly')}
                            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors relative ${billingPeriod === 'yearly'
                                    ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                        >
                            Anual
                            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                -{discountPercentage}%
                            </span>
                        </button>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative rounded-2xl p-8 ${plan.highlighted
                                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl scale-105'
                                    : 'bg-gray-50 dark:bg-slate-800 shadow-lg hover:shadow-xl transition-shadow'
                                }`}
                        >
                            {/* Badge */}
                            {plan.badge && (
                                <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full text-sm font-medium ${plan.highlighted
                                        ? 'bg-yellow-400 text-gray-900'
                                        : 'bg-blue-600 text-white'
                                    }`}>
                                    {plan.badge}
                                </div>
                            )}

                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${plan.highlighted
                                        ? 'bg-white/20 text-white'
                                        : 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                                    }`}>
                                    {plan.icon}
                                </div>
                                <h3 className={`text-xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-gray-900 dark:text-white'
                                    }`}>
                                    {plan.name}
                                </h3>
                                <p className={`text-sm ${plan.highlighted ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'
                                    }`}>
                                    {plan.description}
                                </p>
                            </div>

                            {/* Pricing */}
                            <div className="text-center mb-8">
                                <div className="flex items-center justify-center space-x-2">
                                    <span className={`text-3xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900 dark:text-white'
                                        }`}>
                                        R$ {plan.price}
                                    </span>
                                    <span className={`text-sm ${plan.highlighted ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                                        }`}>
                                        {plan.period}
                                    </span>
                                </div>
                                {plan.originalPrice && (
                                    <div className="flex items-center justify-center space-x-2 mt-1">
                                        <span className={`text-sm line-through ${plan.highlighted ? 'text-blue-200' : 'text-gray-400 dark:text-gray-500'
                                            }`}>
                                            R$ {plan.originalPrice}
                                        </span>
                                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                            -{Math.round((1 - plan.price / plan.originalPrice) * 100)}%
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-start space-x-3">
                                        <Check className={`h-5 w-5 mt-0.5 flex-shrink-0 ${plan.highlighted ? 'text-green-300' : 'text-green-500'
                                            }`} />
                                        <span className={`text-sm ${plan.highlighted ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'
                                            }`}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            <button className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${plan.highlighted
                                    ? 'bg-white text-blue-600 hover:bg-gray-100'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}>
                                Começar Agora
                            </button>
                        </div>
                    ))}
                </div>

                {/* Trust Signals */}
                <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-8">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full mx-auto mb-4">
                                <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Garantia de 30 Dias
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Não gostou? Devolvemos 100% do seu dinheiro sem perguntas.
                            </p>
                        </div>
                        <div>
                            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full mx-auto mb-4">
                                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                50.000+ Alunos
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Junte-se a milhares de estudantes que já conquistaram seus sonhos.
                            </p>
                        </div>
                        <div>
                            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900/50 rounded-full mx-auto mb-4">
                                <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Avaliação 4.9/5
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Mais de 10.000 avaliações positivas de nossos alunos.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Special Offer */}
                <div className="text-center mt-12">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
                        <h3 className="text-2xl font-bold mb-2">
                            🔥 Oferta Especial por Tempo Limitado!
                        </h3>
                        <p className="text-orange-100 mb-4">
                            Primeira semana GRÁTIS + Desconto de 50% no primeiro mês para novos alunos
                        </p>
                        <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                            Aproveitar Oferta
                        </button>
                        <p className="text-xs text-orange-200 mt-2">
                            * Válido apenas para os primeiros 100 alunos
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
