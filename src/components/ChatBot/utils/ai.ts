import OpenAI from 'openai';
import { SearchResult } from '../types';

// Validate API key format and presence
function validateApiKey(key: string | undefined): string {
  if (!key) {
    throw new Error('OpenAI API key not found in environment variables');
  }
  
  const trimmedKey = key.trim();
  if (!trimmedKey) {
    throw new Error('OpenAI API key cannot be empty');
  }
  
  return trimmedKey;
}

const apiKey = validateApiKey(import.meta.env.VITE_OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true
});

export async function processWithAI(
  query: string,
  localResults: SearchResult[]
): Promise<string> {
  try {
    const prompt = generatePrompt(query, localResults);
    
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4',
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
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return 'Erro de configuração da API. Por favor, contate o suporte técnico.';
      }
      if (error.message.includes('Rate limit')) {
        return 'Sistema temporariamente ocupado. Por favor, tente novamente em alguns segundos.';
      }
      if (error.message.includes('insufficient_quota')) {
        return 'Limite de uso atingido. Por favor, tente novamente mais tarde.';
      }
    }
    
    return 'Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente em alguns momentos.';
  }
}

function generatePrompt(query: string, localResults: SearchResult[]): string {
  let prompt = `Você é um assistente turístico especializado em Portugal, especificamente na região Centro. 
Analise a seguinte consulta em português: "${query}"\n\n`;
  
  if (localResults.length > 0) {
    prompt += "Locais encontrados baseados na sua pesquisa:\n\n";
    localResults.forEach((result, index) => {
      prompt += `${index + 1}. ${result.name}\n`;
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
3. Mencione a localização exata
4. Forneça links para mais informações quando disponíveis
5. Se houver múltiplos locais ou categorias na consulta, organize a resposta por seção
6. Sugira combinações ou roteiros quando apropriado
7. Mantenha um tom amigável e conversacional

Se não houver resultados específicos para algum critério da busca, sugira alternativas próximas ou similares.
Formate a resposta de maneira clara e organizada, usando marcadores ou números quando apropriado.

Importante: Inclua os links fornecidos na sua resposta para que os usuários possam obter mais informações.`;

  return prompt;
}