// Utilitário para corrigir caracteres com acentos vindos do banco de dados
export function fixEncoding(text: string): string {
    if (!text) return text;

    // Mapeamento de caracteres corrompidos para caracteres corretos
    const charMap: { [key: string]: string } = {
        // Redação e escrita
        'Reda��o': 'Redação',
        'reda��o': 'redação',
        'argumenta��o': 'argumentação',
        'interpreta��o': 'interpretação',
        'resolu��o': 'resolução',
        'contextualiza��o': 'contextualização',
        'urbaniza��o': 'urbanização',

        // Matemática
        'Matem�tica': 'Matemática',
        'matem�tica': 'matemática',
        '�lgebra': 'Álgebra',
        'estat�stica': 'estatística',
        'fun��es': 'funções',
        'r�pida': 'rápida',
        'avan�ado': 'avançado',

        // Português e Linguagens
        'Portugu�s': 'Português',
        'portugu�s': 'português',
        'gram�tica': 'gramática',

        // Ciências
        'F�sica': 'Física',
        'Qu�mica': 'Química',
        'qu�mica': 'química',
        'Org�nica': 'Orgânica',
        'org�nica': 'orgânica',
        'Inorg�nica': 'Inorgânica',
        'inorg�nica': 'inorgânica',
        'f�sico-qu�mica': 'físico-química',
        'mec�nica': 'mecânica',
        'termodin�mica': 'termodinâmica',

        // História e Geografia
        'Hist�ria': 'História',
        'hist�ria': 'história',
        'per�odo': 'período',
        'Geopol�tica': 'Geopolítica',
        'geopol�tica': 'geopolítica',
        'gr�ficos': 'gráficos',

        // Geral
        'Ci�ncias': 'Ciências',
        'ci�ncias': 'ciências',
        'Fen�menos': 'Fenômenos',
        'fen�menos': 'fenômenos',
        'Audit�rio': 'Auditório',
        'audit�rio': 'auditório',
        'Laborat�rio': 'Laboratório',
        'laborat�rio': 'laboratório',
        'Confer�ncias': 'Conferências',
        'confer�ncias': 'conferências',
        'An�lise': 'Análise',
        'an�lise': 'análise',

        // Técnicas e práticas
        't�cnicas': 'técnicas',
        'avan�adas': 'avançadas',
        'quest�es': 'questões',
        'dif�ceis': 'difíceis',
        'estrat�gias': 'estratégias',
        'exerc�cios': 'exercícios',

        // Nomes
        'Jo�o': 'João',

        // Verbos
        'compartilhar�': 'compartilhará',
        'demonstrar�': 'demonstrará',

        // Outros
        'ci�ncia': 'ciência',
        'tr�s': 'trás'
    };

    let fixedText = text;

    // Aplicar todas as correções do mapeamento
    Object.entries(charMap).forEach(([corrupted, correct]) => {
        const regex = new RegExp(corrupted, 'gi');
        fixedText = fixedText.replace(regex, correct);
    });

    // Correções genéricas para caracteres Unicode corrompidos
    fixedText = fixedText
        .replace(/��o/g, 'ção')  // -ção 
        .replace(/��es/g, 'ções') // -ções
        .replace(/�tica/g, 'ática') // -ática
        .replace(/�ncia/g, 'ência') // -ência
        .replace(/�rio/g, 'ário') // -ário
        .replace(/�gico/g, 'ógico') // -ógico
        .replace(/�fico/g, 'ífico') // -ífico
        .replace(/�mica/g, 'ímica') // -ímica
        .replace(/�sica/g, 'ísica') // -ísica
        .replace(/�ncias/g, 'ências') // -ências
        .replace(/�rios/g, 'ários') // -ários
        .replace(/�nicas/g, 'ânicas') // -ânicas
        .replace(/�meno/g, 'ômeno') // -ômeno
        .replace(/�menos/g, 'ômenos') // -ômenos
        .replace(/�/g, 'ã'); // ã genérico como fallback

    return fixedText;
}

// Função para corrigir objetos recursivamente
export function fixObjectEncoding<T>(obj: T): T {
    if (typeof obj === 'string') {
        return fixEncoding(obj) as T;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => fixObjectEncoding(item)) as T;
    }

    if (obj && typeof obj === 'object') {
        const fixedObj: Record<string, unknown> = {};
        Object.entries(obj).forEach(([key, value]) => {
            fixedObj[key] = fixObjectEncoding(value);
        });
        return fixedObj as T;
    }

    return obj;
}
