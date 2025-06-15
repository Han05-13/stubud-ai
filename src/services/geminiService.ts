
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyDkbEjn21-DvyI795K4fR1N5irLt1Is2H0';
const genAI = new GoogleGenerativeAI(API_KEY);

export const generateAnswer = async (question: string, marks: 2 | 13 | 15): Promise<string> => {
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
      2: "Provide a brief, concise answer in 2-3 sentences. Focus on the key points only. This should be suitable for a 2-mark academic question.",
      13: "Provide a detailed explanation with multiple points, examples, and clear structure. Include relevant details and explanations that would merit 13 marks in an academic setting. Use bullet points, numbered lists, and clear sections. Format section headers like '**1. Introduction (2 marks)**' in bold using markdown.",
      15: "Provide a comprehensive, well-structured answer with introduction, detailed explanation, examples, analysis, and conclusion. This should be thorough enough to merit full 15 marks in an academic examination. Include multiple sections, detailed analysis, and comprehensive coverage of the topic. Format all section headers like '**1. Introduction & Motivation (1 Mark)**' or '**2. Main Concepts (3 Marks)**' in bold using markdown formatting."
    };

    const prompt = `
Question: ${question}

Please provide an answer in the format suitable for a ${marks}-mark academic question.

Instructions: ${formatInstructions[marks]}

IMPORTANT FORMATTING RULES:
- Use **bold text** for section headers (e.g., **1. Introduction & Motivation (1 Mark)**)
- Use **bold text** for important terms and key concepts
- Use bullet points and numbered lists for clarity
- Structure your response with clear sections
- Make sure to use markdown formatting for bold text

Please structure your response clearly and provide a comprehensive answer that demonstrates deep understanding of the topic.
`;

    console.log('Generating answer with Gemini AI...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Answer generated successfully');
    return text;
    
  } catch (error) {
    console.error('Error generating answer with Gemini AI:', error);
    throw new Error('Failed to generate answer. Please try again.');
  }
};
