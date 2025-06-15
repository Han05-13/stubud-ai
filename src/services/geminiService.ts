
import { GoogleGenerativeAI } from '@google/generative-ai';
import { rateLimiter } from '@/utils/rateLimiter';

const API_KEY = 'AIzaSyDkbEjn21-DvyI795K4fR1N5irLt1Is2H0';
const genAI = new GoogleGenerativeAI(API_KEY);

export const generateAnswer = async (question: string, marks: 2 | 13 | 15): Promise<string> => {
  // Check rate limits before making request
  const rateLimitCheck = rateLimiter.canMakeRequest();
  if (!rateLimitCheck.allowed) {
    if (rateLimitCheck.waitTime) {
      const waitSeconds = Math.ceil(rateLimitCheck.waitTime / 1000);
      throw new Error(`Rate limit exceeded. Please wait ${waitSeconds} seconds before trying again.`);
    } else {
      throw new Error(`Rate limit exceeded: ${rateLimitCheck.reason}. Please try again later.`);
    }
  }

  try {
    // Get the model - using gemini-2.0-flash-exp as it's the closest to "gemini 2.0 flash lite"
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        maxOutputTokens: 2000,
        temperature: 0.7,
      }
    });

    const formatInstructions = {
      2: "Provide ONLY the most essential points in 2-3 short sentences. Focus strictly on the core concept and key definition. No examples or elaboration. This should be direct and concise for a 2-mark question.",
      13: "Provide a structured answer with 4-6 key points only. Include essential concepts, one brief example, and critical details that directly answer the question. Avoid unnecessary elaboration. Use clear headings like '**1. Key Concept (2 marks)**' and be precise. Total content should merit exactly 13 marks - no more, no less.",
      15: "Provide a comprehensive but focused answer with 5-7 main sections covering: introduction, core concepts, key applications/examples, analysis, and conclusion. Each section should contain only the most important information. Use clear headings like '**1. Introduction (2 marks)**' and ensure every point directly contributes to the answer. Avoid redundancy and filler content."
    };

    const prompt = `
Question: ${question}

Please provide a focused academic answer suitable for a ${marks}-mark question.

CRITICAL INSTRUCTIONS: ${formatInstructions[marks]}

FORMATTING REQUIREMENTS:
- Use **bold text** for section headers (e.g., **1. Introduction (2 marks)**)
- Use **bold text** for key terms and concepts only
- Use bullet points sparingly and only when necessary
- Keep content concise and directly relevant
- Every sentence must add value to the answer
- Avoid repetition and unnecessary explanations

QUALITY STANDARDS:
- Prioritize accuracy over length
- Include only information that directly answers the question
- Ensure each point justifies its mark allocation
- Remove any filler or overly general statements

Generate a precise, academic-quality answer that maximizes value within the ${marks}-mark constraint.
`;

    console.log('Generating focused answer with Gemini AI...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Estimate tokens used (rough calculation)
    const estimatedTokens = Math.ceil((prompt.length + text.length) / 4);
    
    // Record the successful request
    rateLimiter.recordRequest(estimatedTokens);
    
    console.log('Focused answer generated successfully');
    return text;
    
  } catch (error) {
    console.error('Error generating answer with Gemini AI:', error);
    throw new Error('Failed to generate answer. Please try again.');
  }
};

export const getRateLimitStatus = () => {
  return rateLimiter.getRemainingLimits();
};
