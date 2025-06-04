// Test script to verify character encoding fixes
function fixEncoding(text) {
    if (!text) return text;

    // Mapeamento de caracteres corrompidos para caracteres corretos
    const charMap = {
        'Reda��o': 'Redação',
        'Matem�tica': 'Matemática',
        'matem�tica': 'matemática',
        'F�sica': 'Física',
        'Qu�mica': 'Química',
        'quest�es': 'questões',
        'avan�ada': 'avançada',
        'exerc�cios': 'exercícios',
        'pr�ticos': 'práticos'
    };

    let fixedText = text;

    // Aplicar todas as correções do mapeamento
    Object.entries(charMap).forEach(([corrupted, correct]) => {
        const regex = new RegExp(corrupted, 'gi');
        fixedText = fixedText.replace(regex, correct);
    });

    // Correções genéricas para caracteres Unicode corrompidos
    fixedText = fixedText
        .replace(/��o/g, 'ção')
        .replace(/��es/g, 'ções')
        .replace(/�tica/g, 'ática')
        .replace(/�ncia/g, 'ência')
        .replace(/�rio/g, 'ário');

    return fixedText;
}

// Teste dos casos
const testCases = [
    'Matem�tica e Reda��o com quest�es de F�sica',
    'Curso de matem�tica avan�ada',
    'Exerc�cios pr�ticos de Qu�mica'
];

console.log('=== TESTE DE CORREÇÃO DE CARACTERES ===\n');

testCases.forEach((test, index) => {
    console.log(`Teste ${index + 1}:`);
    console.log(`Original: ${test}`);
    console.log(`Corrigido: ${fixEncoding(test)}`);
    console.log('---');
});
