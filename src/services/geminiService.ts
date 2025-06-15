
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyCoUh-LCZ8LKoGpqgSfI8Uue_ydN-wM_jQ';

if (!API_KEY) {
  throw new Error('GEMINI_API_KEY is required');
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Rate limiting state
let requestCount = 0;
let dailyRequestCount = 0;
let dailyTokenCount = 0;
let lastRequestTime = 0;
let lastResetTime = Date.now();

const RATE_LIMITS = {
  requestsPerMinute: 30,
  requestsPerDay: 1400,
  tokensPerDay: 80000,
  minInterval: 2000 // 2 seconds between requests
};

export const getRateLimitStatus = () => {
  const now = Date.now();
  
  // Reset daily counters at midnight
  if (now - lastResetTime > 24 * 60 * 60 * 1000) {
    dailyRequestCount = 0;
    dailyTokenCount = 0;
    lastResetTime = now;
  }
  
  // Reset per-minute counter
  if (now - lastRequestTime > 60 * 1000) {
    requestCount = 0;
  }
  
  return {
    requestsThisMinute: requestCount,
    requestsToday: dailyRequestCount,
    tokensToday: dailyTokenCount
  };
};

const checkRateLimit = () => {
  const now = Date.now();
  
  // Check daily limits
  if (dailyRequestCount >= RATE_LIMITS.requestsPerDay) {
    throw new Error('Daily request limit exceeded. Please try again tomorrow.');
  }
  
  if (dailyTokenCount >= RATE_LIMITS.tokensPerDay) {
    throw new Error('Daily token limit exceeded. Please try again tomorrow.');
  }
  
  // Check per-minute limit
  if (requestCount >= RATE_LIMITS.requestsPerMinute) {
    throw new Error('Rate limit exceeded. Please wait a minute before making another request.');
  }
  
  // Check minimum interval between requests
  if (now - lastRequestTime < RATE_LIMITS.minInterval) {
    const waitTime = Math.ceil((RATE_LIMITS.minInterval - (now - lastRequestTime)) / 1000);
    throw new Error(`Please wait ${waitTime} seconds before making another request.`);
  }
};

const updateRateLimitCounters = (tokensUsed: number = 150) => {
  const now = Date.now();
  
  // Reset per-minute counter if needed
  if (now - lastRequestTime > 60 * 1000) {
    requestCount = 0;
  }
  
  requestCount++;
  dailyRequestCount++;
  dailyTokenCount += tokensUsed;
  lastRequestTime = now;
};

export const generateAnswer = async (question: string, marks: 2 | 13 | 15): Promise<string> => {
  try {
    checkRateLimit();
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const prompts = {
      2: `You are an academic writing assistant. Provide a brief, structured answer for a 2-mark question.
      
Question: ${question}

Requirements:
- Write a concise answer (50-80 words)
- Use clear, academic language
- Structure with 1-2 main points
- Bold key terms using **text** format
- Focus on essential information only

Format your response as a direct answer without meta-commentary.`,

      13: `You are an academic writing assistant. Provide a detailed answer for a 13-mark question.

Question: ${question}

Requirements:
- Write a comprehensive answer (300-400 words)
- Use proper academic structure with clear paragraphs
- Include 4-6 main points with explanations
- Bold key terms and concepts using **text** format
- Provide examples where relevant
- Use formal academic tone
- Ensure logical flow between ideas

Format your response as a direct answer without meta-commentary.`,

      15: `You are an academic writing assistant. Provide a comprehensive answer for a 15-mark question.

Question: ${question}

Requirements:
- Write an extensive answer (400-500 words)
- Use clear academic structure with introduction, main body, and conclusion
- Include 6-8 detailed points with thorough explanations
- Bold key terms, concepts, and important phrases using **text** format
- Provide specific examples and evidence
- Use formal academic language
- Demonstrate critical analysis
- Ensure excellent flow and coherence

Format your response as a direct answer without meta-commentary.`
    };

    const result = await model.generateContent(prompts[marks]);
    const response = await result.response;
    const text = response.text();
    
    // Estimate tokens used (rough approximation)
    const estimatedTokens = Math.ceil(text.length / 4) + Math.ceil(prompts[marks].length / 4);
    updateRateLimitCounters(estimatedTokens);
    
    if (!text || text.trim().length === 0) {
      throw new Error('Empty response received from AI service');
    }
    
    return text.trim();
  } catch (error) {
    console.error('Error generating answer:', error);
    
    if (error instanceof Error) {
      // Re-throw rate limit and API errors with original message
      if (error.message.includes('Rate limit') || 
          error.message.includes('limit exceeded') ||
          error.message.includes('wait') ||
          error.message.includes('SAFETY')) {
        throw error;
      }
      
      // Handle quota exceeded errors
      if (error.message.includes('quota exceeded') || error.message.includes('RESOURCE_EXHAUSTED')) {
        throw new Error('API quota exceeded. Please try again later or check your API usage.');
      }
    }
    
    // Generic error for other cases
    throw new Error('Failed to generate answer. Please check your connection and try again.');
  }
};
