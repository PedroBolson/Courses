'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header com botão de toggle */}
      <header className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Teste de Cores - Modo Claro/Escuro
          </h1>
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
          >
            {darkMode ? '🌙 Modo Escuro' : '☀️ Modo Claro'}
          </button>
        </div>
      </header>

      <main className="p-6 max-w-6xl mx-auto">
        {/* Seção de cores primárias */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            Cores Primárias (Azul)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'].map((shade) => (
              <div key={shade} className={`p-4 rounded-lg bg-blue-${shade}`}>
                <p className={`text-sm font-medium ${parseInt(shade) < 400 ? 'text-gray-900' : 'text-white'}`}>
                  blue-{shade}
                </p>
                <p className={`text-xs ${parseInt(shade) < 400 ? 'text-gray-700' : 'text-gray-200'}`}>
                  Texto de exemplo
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Seção de cores secundárias */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            Cores Secundárias (Verde)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'].map((shade) => (
              <div key={shade} className={`p-4 rounded-lg bg-green-${shade}`}>
                <p className={`text-sm font-medium ${parseInt(shade) < 400 ? 'text-gray-900' : 'text-white'}`}>
                  green-{shade}
                </p>
                <p className={`text-xs ${parseInt(shade) < 400 ? 'text-gray-700' : 'text-gray-200'}`}>
                  Texto de exemplo
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Seção de cores de acento */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            Cores de Acento (Vermelho)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'].map((shade) => (
              <div key={shade} className={`p-4 rounded-lg bg-red-${shade}`}>
                <p className={`text-sm font-medium ${parseInt(shade) < 400 ? 'text-gray-900' : 'text-white'}`}>
                  red-{shade}
                </p>
                <p className={`text-xs ${parseInt(shade) < 400 ? 'text-gray-700' : 'text-gray-200'}`}>
                  Texto de exemplo
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Seção de cores de warning */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            Cores de Warning (Amarelo/Laranja)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'].map((shade) => (
              <div key={shade} className={`p-4 rounded-lg bg-yellow-${shade}`}>
                <p className={`text-sm font-medium ${parseInt(shade) < 400 ? 'text-gray-900' : 'text-white'}`}>
                  yellow-{shade}
                </p>
                <p className={`text-xs ${parseInt(shade) < 400 ? 'text-gray-700' : 'text-gray-200'}`}>
                  Texto de exemplo
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Seção de cores neutras */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            Cores Neutras (Cinza)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'].map((shade) => (
              <div key={shade} className={`p-4 rounded-lg bg-gray-${shade}`}>
                <p className={`text-sm font-medium ${parseInt(shade) < 400 ? 'text-gray-900' : 'text-white'}`}>
                  gray-{shade}
                </p>
                <p className={`text-xs ${parseInt(shade) < 400 ? 'text-gray-700' : 'text-gray-200'}`}>
                  Texto de exemplo
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Seção de componentes de exemplo */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            Componentes de Exemplo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
                Card Primário
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Este é um exemplo de card com cores primárias.
              </p>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors">
                Botão Primário
              </button>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">
                Card Secundário
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Este é um exemplo de card com cores secundárias.
              </p>
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors">
                Botão Secundário
              </button>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
                Card de Acento
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Este é um exemplo de card com cores de acento.
              </p>
              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors">
                Botão de Acento
              </button>
            </div>
          </div>
        </section>

        {/* Seção de alertas */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            Alertas e Notificações
          </h2>
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-blue-800 dark:text-blue-200">
                📘 Alerta informativo usando cores primárias
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-green-800 dark:text-green-200">
                ✅ Alerta de sucesso usando cores secundárias
              </p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-yellow-800 dark:text-yellow-200">
                ⚠️ Alerta de warning usando cores de aviso
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200">
                ❌ Alerta de erro usando cores de acento
              </p>
            </div>
          </div>
        </section>

        {/* Seção adicional com cores personalizadas */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            Cores Extras
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-6 rounded-lg bg-purple-500 text-white">
              <h3 className="font-semibold mb-2">Roxo</h3>
              <p className="text-sm">purple-500</p>
            </div>
            <div className="p-6 rounded-lg bg-pink-500 text-white">
              <h3 className="font-semibold mb-2">Rosa</h3>
              <p className="text-sm">pink-500</p>
            </div>
            <div className="p-6 rounded-lg bg-indigo-500 text-white">
              <h3 className="font-semibold mb-2">Índigo</h3>
              <p className="text-sm">indigo-500</p>
            </div>
            <div className="p-6 rounded-lg bg-teal-500 text-white">
              <h3 className="font-semibold mb-2">Teal</h3>
              <p className="text-sm">teal-500</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
