import OpenAI from 'openai';
import { SearchResult } from '../types';

function validateApiKey(key: string | undefined): string {
  if (!key) {
    throw new Error('OpenAI API key not configured properly');
  }
  
  const trimmedKey = key.trim();
  if (!trimmedKey) {
    throw new Error('OpenAI API key cannot be empty');
  }
  
  if (!trimmedKey.startsWith('sk-')) {
    throw new Error('Invalid OpenAI API key format');
  }
  
  return trimmedKey;
}

const apiKey = validateApiKey(import.meta.env.VITE_OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true // Required for client-side usage
});

const rateLimiter = {
  tokens: 3,
  interval: 60000,
  lastReset: Date.now(),
  lastRequestTime: 0,
};

function resetRateLimiter() {
  const now = Date.now();
  if (now - rateLimiter.lastReset >= rateLimiter.interval) {
    rateLimiter.tokens = 3;
    rateLimiter.lastReset = now;
  }
}

function canMakeRequest(): boolean {
  resetRateLimiter();
  return rateLimiter.tokens > 0;
}

function formatDistance(distance: number | undefined): string {
  if (typeof distance !== 'number') return '';
  
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
}

function generateLocalResponse(query: string, results: SearchResult[]): string {
  if (results.length === 0) {
    return 'Desculpe, não encontrei resultados específicos para sua busca. Por favor, tente reformular sua pergunta ou explore o mapa para descobrir pontos de interesse próximos.';
  }

  let response = 'Com base nos dados locais disponíveis, aqui estão os resultados:\n\n';
  
  // Group results by category and query context
  const groupedResults = results.reduce((acc, result) => {
    const category = result.category || 'Outros';
    const context = result.queryContext || 'Geral';
    const key = `${category}:${context}`;
    
    if (!acc[key]) {
      acc[key] = {
        category,
        context,
        items: []
      };
    }
    acc[key].items.push(result);
    return acc;
  }, {} as Record<string, { category: string; context: string; items: SearchResult[] }>);

  // Generate response by category and context
  Object.values(groupedResults).forEach(({ category, context, items }) => {
    const foundCount = items.length;
    const contextStr = context !== 'Geral' ? ` (${context})` : '';
    
    response += `${category.toUpperCase()}${contextStr}:\n`;
    
    if (foundCount === 0) {
      response += `Nenhum resultado encontrado para esta categoria.\n\n`;
    } else {
      items.forEach((result, index) => {
        response += `${index + 1}. ${result.name}`;
        if (result.distance !== undefined) {
          response += ` (${formatDistance(result.distance)} de distância)`;
        }
        response += '\n';
        
        if (result.description) {
          // Limit description length
          const shortDesc = result.description.length > 100 
            ? result.description.substring(0, 100) + '...'
            : result.description;
          response += `   ${shortDesc}\n`;
        }
        if (result.location) response += `   📍 ${result.location}\n`;
        if (result.url) response += `   🔗 ${result.url}\n`;
        response += '\n';
      });
    }
  });

  response += '\nClique nos marcadores no mapa para mais detalhes sobre cada local.';
  
  // Add suggestions if few results
  if (results.length < 3) {
    response += '\n\nDica: Tente expandir sua busca para outras áreas próximas ou categorias similares.';
  }

  return response;
}

export async function processWithAI(
  query: string,
  localResults: SearchResult[]
): Promise<string> {
  try {
    if (!canMakeRequest()) {
      return generateLocalResponse(query, localResults) +
        '\n\n(Resposta gerada localmente devido ao limite de requisições. Por favor, aguarde um momento antes de fazer mais perguntas.)';
    }

    rateLimiter.tokens--;
    rateLimiter.lastRequestTime = Date.now();

    const prompt = generatePrompt(query, localResults);
    
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      max_tokens: 800
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response received from OpenAI');
    }

    return response;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return generateLocalResponse(query, localResults) +
          '\n\n(Resposta gerada localmente devido a um erro de configuração da API.)';
      }
      if (error.message.includes('Rate limit')) {
        return generateLocalResponse(query, localResults) +
          '\n\n(Resposta gerada localmente devido ao limite de requisições. Por favor, aguarde um momento.)';
      }
      if (error.message.includes('insufficient_quota')) {
        return generateLocalResponse(query, localResults) +
          '\n\n(Resposta gerada localmente devido ao limite de quota da API.)';
      }
      if (error.message.includes('model_not_found')) {
        return generateLocalResponse(query, localResults) +
          '\n\n(Resposta gerada localmente devido a um erro de configuração do modelo AI.)';
      }
    }
    
    return generateLocalResponse(query, localResults) +
      '\n\n(Resposta gerada localmente devido a um erro temporário no serviço AI.)';
  }
}

function generatePrompt(query: string, localResults: SearchResult[]): string {
  let prompt = `Você é um assistente turístico especializado em Portugal, especificamente na região Centro. 
Analise a seguinte consulta em português: "${query}"\n\n`;
  
  if (localResults.length > 0) {
    prompt += "Locais encontrados baseados na sua pesquisa:\n\n";
    localResults.forEach((result, index) => {
      prompt += `${index + 1}. ${result.name}`;
      if (result.distance !== undefined) {
        prompt += ` (${formatDistance(result.distance)} de distância)`;
      }
      prompt += '\n';
      
      if (result.category) prompt += `   Categoria: ${result.category}\n`;
      if (result.description) prompt += `   Descrição: ${result.description}\n`;
      if (result.location) prompt += `   Localização: ${result.location}\n`;
      if (result.url) prompt += `   Mais informações: ${result.url}\n`;
      if (result.coordinates) prompt += `   Coordenadas: ${result.coordinates.join(', ')}\n`;
      if (result.image) prompt += `   Imagem: ${result.image}\n`;
      prompt += '\n';
    });
  }

  prompt += `
Por favor, forneça uma resposta detalhada em português que:
1. Apresente sugestões específicas para cada local ou categoria mencionada na pergunta
2. Inclua uma breve descrição de cada lugar sugerido
3. Mencione a localização exata e a distância (quando disponível)
4. Forneça links para mais informações quando disponíveis
5. Se houver múltiplos locais ou categorias na consulta, organize a resposta por seção
6. Sugira combinações ou roteiros quando apropriado
7. Mantenha um tom amigável e conversacional

Se não houver resultados específicos para algum critério da busca, sugira alternativas próximas ou similares.
Formate a resposta de maneira clara e organizada, usando marcadores ou números quando apropriado.

Importante: 
- Inclua os links fornecidos na sua resposta para que os usuários possam obter mais informações
- Quando disponível, mencione a distância até o local
- Se a consulta mencionar uma quantidade específica de lugares, respeite esse número nas sugestões
- Se não houver resultados suficientes para uma categoria, explique isso claramente`;

  return prompt;
}