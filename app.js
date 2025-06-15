// Stubud AI - Academic Answer Generator
// Main application logic

class RateLimiter {
    constructor() {
        this.state = this.loadState();
        this.limits = {
            requestsPerMinute: 30,
            requestsPerDay: 1400,
            tokensPerDay: 80000,
            cooldownSeconds: 2
        };
    }

    loadState() {
        const saved = localStorage.getItem('rateLimitState');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.warn('Failed to parse rate limit state from localStorage');
            }
        }
        
        return {
            requestsThisMinute: 0,
            requestsToday: 0,
            tokensToday: 0,
            lastRequestTime: 0,
            lastResetMinute: Date.now(),
            lastResetDay: new Date().toDateString()
        };
    }

    saveState() {
        localStorage.setItem('rateLimitState', JSON.stringify(this.state));
    }

    resetCountersIfNeeded() {
        const now = Date.now();
        const currentDay = new Date().toDateString();
        
        // Reset daily counters if it's a new day
        if (this.state.lastResetDay !== currentDay) {
            this.state.requestsToday = 0;
            this.state.tokensToday = 0;
            this.state.lastResetDay = currentDay;
        }
        
        // Reset minute counter if a minute has passed
        if (now - this.state.lastResetMinute >= 60000) {
            this.state.requestsThisMinute = 0;
            this.state.lastResetMinute = now;
        }
    }

    canMakeRequest() {
        this.resetCountersIfNeeded();
        
        const now = Date.now();
        const timeSinceLastRequest = now - this.state.lastRequestTime;
        
        // Check cooldown
        if (timeSinceLastRequest < this.limits.cooldownSeconds * 1000) {
            return {
                allowed: false,
                reason: 'Cooldown active',
                waitTime: this.limits.cooldownSeconds * 1000 - timeSinceLastRequest
            };
        }
        
        // Check per-minute limit
        if (this.state.requestsThisMinute >= this.limits.requestsPerMinute) {
            const timeUntilReset = 60000 - (now - this.state.lastResetMinute);
            return {
                allowed: false,
                reason: 'Per-minute limit exceeded',
                waitTime: timeUntilReset
            };
        }
        
        // Check per-day limit
        if (this.state.requestsToday >= this.limits.requestsPerDay) {
            return {
                allowed: false,
                reason: 'Daily request limit exceeded'
            };
        }
        
        // Check token limit
        if (this.state.tokensToday >= this.limits.tokensPerDay) {
            return {
                allowed: false,
                reason: 'Daily token limit exceeded'
            };
        }
        
        return { allowed: true };
    }

    recordRequest(estimatedTokens = 1000) {
        const now = Date.now();
        this.resetCountersIfNeeded();
        
        this.state.requestsThisMinute++;
        this.state.requestsToday++;
        this.state.tokensToday += estimatedTokens;
        this.state.lastRequestTime = now;
        
        this.saveState();
    }

    getRemainingLimits() {
        this.resetCountersIfNeeded();
        
        return {
            requestsThisMinute: this.limits.requestsPerMinute - this.state.requestsThisMinute,
            requestsToday: this.limits.requestsPerDay - this.state.requestsToday,
            tokensToday: this.limits.tokensPerDay - this.state.tokensToday
        };
    }
}

class GeminiService {
    constructor() {
        this.apiKey = 'AIzaSyDkbEjn21-DvyI795K4fR1N5irLt1Is2H0';
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
    }

    async generateAnswer(question, marks) {
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

        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                maxOutputTokens: 2000,
                temperature: 0.7,
            }
        };

        const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Invalid response format from API');
        }

        return data.candidates[0].content.parts[0].text;
    }
}

class StubudApp {
    constructor() {
        this.rateLimiter = new RateLimiter();
        this.geminiService = new GeminiService();
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateRateLimitDisplay();
        
        // Update rate limit display every 10 seconds
        setInterval(() => {
            this.updateRateLimitDisplay();
        }, 10000);
    }

    bindEvents() {
        const generateBtn = document.getElementById('generate-btn');
        const questionInput = document.getElementById('question');
        
        generateBtn.addEventListener('click', () => this.generateAnswer());
        
        // Allow Enter key to generate (with Ctrl/Cmd for multiline)
        questionInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.generateAnswer();
            }
        });
    }

    updateRateLimitDisplay() {
        const limits = this.rateLimiter.getRemainingLimits();
        
        document.getElementById('requests-minute').textContent = limits.requestsThisMinute;
        document.getElementById('requests-day').textContent = limits.requestsToday;
        document.getElementById('tokens-day').textContent = limits.tokensToday;
    }

    async generateAnswer() {
        const questionInput = document.getElementById('question');
        const marksSelect = document.getElementById('marks');
        const generateBtn = document.getElementById('generate-btn');
        const loadingSection = document.getElementById('loading-section');
        const answerSection = document.getElementById('answer-section');
        const answerContent = document.getElementById('answer-content');

        const question = questionInput.value.trim();
        const marks = parseInt(marksSelect.value);

        // Validation
        if (!question) {
            alert('Please enter a question before generating an answer.');
            questionInput.focus();
            return;
        }

        // Check rate limits
        const rateLimitCheck = this.rateLimiter.canMakeRequest();
        if (!rateLimitCheck.allowed) {
            if (rateLimitCheck.waitTime) {
                const waitSeconds = Math.ceil(rateLimitCheck.waitTime / 1000);
                alert(`Rate limit exceeded. Please wait ${waitSeconds} seconds before trying again.`);
            } else {
                alert(`Rate limit exceeded: ${rateLimitCheck.reason}. Please try again later.`);
            }
            return;
        }

        // Show loading state
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';
        loadingSection.classList.remove('hidden');
        answerSection.classList.add('hidden');

        try {
            console.log('Generating answer with Gemini AI...');
            const answer = await this.geminiService.generateAnswer(question, marks);
            
            // Estimate tokens used
            const estimatedTokens = Math.ceil((question.length + answer.length) / 4);
            
            // Record the successful request
            this.rateLimiter.recordRequest(estimatedTokens);
            
            // Display the answer
            answerContent.innerHTML = this.formatAnswer(answer);
            answerSection.classList.remove('hidden');
            
            // Scroll to answer
            answerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            console.log('Answer generated successfully');
            this.updateRateLimitDisplay();
            
        } catch (error) {
            console.error('Error generating answer:', error);
            alert('Failed to generate answer. Please try again.');
        } finally {
            // Reset UI state
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate Answer';
            loadingSection.classList.add('hidden');
        }
    }

    formatAnswer(text) {
        // Convert markdown-style formatting to HTML
        let formatted = text
            // Bold text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Line breaks
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');
        
        // Wrap in paragraphs
        formatted = '<p>' + formatted + '</p>';
        
        // Clean up empty paragraphs
        formatted = formatted.replace(/<p><\/p>/g, '');
        
        return formatted;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StubudApp();
});
