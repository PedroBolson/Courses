'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
    id: number;
    question: string;
    answer: string;
    category: 'geral' | 'cursos' | 'pagamento' | 'tecnologia';
}

export default function FAQSection() {
    const [openItems, setOpenItems] = useState<number[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('geral');

    const faqData: FAQItem[] = [
        // Geral
        {
            id: 1,
            category: 'geral',
            question: 'Como funciona o ENEM Pro?',
            answer: 'O ENEM Pro é uma plataforma completa de preparação para o ENEM. Oferecemos cursos organizados por áreas de conhecimento, com videoaulas, material didático, simulados e acompanhamento personalizado. Você pode estudar no seu próprio ritmo e acessar o conteúdo 24/7.'
        },
        {
            id: 2,
            category: 'geral',
            question: 'Qual é a taxa de aprovação dos alunos?',
            answer: 'Nossa taxa de aprovação é de 95% entre os alunos que completam pelo menos 80% do curso. Isso se deve à metodologia diferenciada, professores especialistas e acompanhamento personalizado que oferecemos.'
        },
        {
            id: 3,
            category: 'geral',
            question: 'Por quanto tempo tenho acesso ao conteúdo?',
            answer: 'O acesso ao conteúdo é válido por 12 meses a partir da data de matrícula. Durante esse período, você pode assistir às aulas quantas vezes quiser e acompanhar todas as atualizações do material.'
        },

        // Cursos
        {
            id: 4,
            category: 'cursos',
            question: 'Posso me inscrever em mais de um curso?',
            answer: 'Sim! Você pode se inscrever em quantos cursos desejar. Oferecemos inclusive pacotes promocionais para quem quer estudar todas as áreas do ENEM. Entre em contato para conhecer as opções disponíveis.'
        },
        {
            id: 5,
            category: 'cursos',
            question: 'Os cursos incluem material didático?',
            answer: 'Sim, todos os cursos incluem material didático completo em PDF, listas de exercícios, resumos e mapas mentais. O material pode ser baixado e impresso para facilitar seus estudos.'
        },
        {
            id: 6,
            category: 'cursos',
            question: 'Há simulados e provas práticas?',
            answer: 'Sim! Cada curso inclui simulados semanais, provas por área de conhecimento e um simulado geral completo no estilo ENEM. Você receberá feedback detalhado sobre seu desempenho.'
        },

        // Pagamento
        {
            id: 7,
            category: 'pagamento',
            question: 'Quais formas de pagamento vocês aceitam?',
            answer: 'Aceitamos cartão de crédito (até 12x sem juros), PIX (com 10% de desconto), boleto bancário e transferência bancária. Também oferecemos planos especiais para pagamento à vista.'
        },
        {
            id: 8,
            category: 'pagamento',
            question: 'Posso cancelar minha assinatura?',
            answer: 'Sim, você pode cancelar sua assinatura a qualquer momento. Oferecemos 7 dias de garantia total - se não ficar satisfeito, devolvemos 100% do valor pago.'
        },
        {
            id: 9,
            category: 'pagamento',
            question: 'Há desconto para estudar em grupo?',
            answer: 'Sim! Oferecemos descontos especiais para grupos de 3 ou mais pessoas. Entre em contato conosco para conhecer as condições e valores promocionais.'
        },

        // Tecnologia
        {
            id: 10,
            category: 'tecnologia',
            question: 'Preciso de algum software especial?',
            answer: 'Não! Nossa plataforma funciona em qualquer navegador moderno (Chrome, Firefox, Safari, Edge). Você pode acessar pelo computador, tablet ou smartphone, online ou offline.'
        },
        {
            id: 11,
            category: 'tecnologia',
            question: 'Posso baixar as aulas para assistir offline?',
            answer: 'Sim! Nossa plataforma permite baixar as videoaulas para assistir offline. Ideal para quem tem internet limitada ou quer estudar em qualquer lugar.'
        },
        {
            id: 12,
            category: 'tecnologia',
            question: 'E se eu tiver problemas técnicos?',
            answer: 'Temos uma equipe de suporte técnico disponível 24/7 para ajudar com qualquer problema. Você pode entrar em contato via chat, email ou WhatsApp.'
        }
    ];

    const categories = [
        { id: 'geral', label: 'Geral', icon: '❓' },
        { id: 'cursos', label: 'Cursos', icon: '📚' },
        { id: 'pagamento', label: 'Pagamento', icon: '💳' },
        { id: 'tecnologia', label: 'Tecnologia', icon: '⚙️' }
    ];

    const toggleItem = (id: number) => {
        setOpenItems(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const filteredFAQs = faqData.filter(faq => faq.category === activeCategory);

    return (
        <section className="py-20 bg-gray-50 dark:bg-slate-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-6">
                        <HelpCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Perguntas Frequentes
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Tire suas dúvidas sobre nossos cursos, plataforma e metodologia.
                        Se não encontrar sua resposta, entre em contato conosco!
                    </p>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2 ${activeCategory === category.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-600'
                                }`}
                        >
                            <span>{category.icon}</span>
                            <span>{category.label}</span>
                        </button>
                    ))}
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {filteredFAQs.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white dark:bg-slate-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden"
                        >
                            <button
                                onClick={() => toggleItem(item.id)}
                                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                            >
                                <span className="font-medium text-gray-900 dark:text-white pr-4">
                                    {item.question}
                                </span>
                                {openItems.includes(item.id) ? (
                                    <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                )}
                            </button>
                            {openItems.includes(item.id) && (
                                <div className="px-6 pb-4">
                                    <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {item.answer}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="text-center mt-12">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Ainda tem dúvidas?
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Nossa equipe está sempre pronta para ajudar! Entre em contato conosco.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                                Chat ao Vivo
                            </button>
                            <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                                Enviar Email
                            </button>
                            <button className="border border-green-600 text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors">
                                WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
