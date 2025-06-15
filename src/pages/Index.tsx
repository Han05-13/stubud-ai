
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, BookOpen, Brain, Zap, Target, Award, ArrowRight, CheckCircle } from 'lucide-react';
import { generateAnswer } from '@/services/geminiService';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [question, setQuestion] = useState('');
  const [selectedMarks, setSelectedMarks] = useState<2 | 13 | 15>(2);
  const [answer, setAnswer] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const markOptions = [
    { value: 2 as const, label: '2 Mark', description: 'Brief answer' },
    { value: 13 as const, label: '13 Mark', description: 'Detailed explanation' },
    { value: 15 as const, label: '15 Mark', description: 'Comprehensive analysis' }
  ];

  const handleGenerate = async () => {
    if (!question.trim()) {
      toast({
        title: "Question Required",
        description: "Please enter a question to generate an answer.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const generatedAnswer = await generateAnswer(question, selectedMarks);
      setAnswer(generatedAnswer);
    } catch (error) {
      console.error('Error generating answer:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate answer. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to render markdown bold text
  const renderMarkdownText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2);
        return <strong key={index} className="font-bold text-gray-800">{boldText}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 lg:py-16">
        <div className="text-center mb-12 lg:mb-20">
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="p-3 lg:p-4 bg-blue-600 rounded-full shadow-lg">
              <Brain className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Stubud AI
            </h1>
          </div>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed text-justify">
            Transform your academic performance with AI-powered answer generation. Get perfectly structured answers for 2, 13, and 15 mark questions with professional formatting and key concept highlighting.
          </p>
          
          {/* Key Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mt-12 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 p-4 bg-white/70 rounded-lg backdrop-blur-sm">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-sm lg:text-base font-medium text-gray-700">Instant AI Responses</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-4 bg-white/70 rounded-lg backdrop-blur-sm">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-sm lg:text-base font-medium text-gray-700">Academic Format</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-4 bg-white/70 rounded-lg backdrop-blur-sm">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-sm lg:text-base font-medium text-gray-700">Structured Answers</span>
            </div>
          </div>
        </div>

        {/* Main Application */}
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Input Section */}
          <Card className="p-4 lg:p-6 bg-white/90 backdrop-blur-sm border-0 shadow-xl order-2 lg:order-1">
            <div className="space-y-4 lg:space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Enter Your Question</h2>
              </div>

              <Textarea
                placeholder="Type your academic question here..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-24 lg:min-h-32 text-base lg:text-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                disabled={isGenerating}
              />

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Select Answer Format</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {markOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedMarks(option.value)}
                      disabled={isGenerating}
                      className={`p-3 lg:p-4 rounded-lg border-2 transition-all duration-200 text-center ${
                        selectedMarks === option.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <div className="font-medium text-sm lg:text-base">{option.label}</div>
                      <div className="text-xs lg:text-sm opacity-75">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !question.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 lg:py-4 text-base lg:text-lg font-medium"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Answer...
                  </>
                ) : (
                  <>
                    Generate Answer
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Answer Section */}
          <Card className="p-4 lg:p-6 bg-white/90 backdrop-blur-sm border-0 shadow-xl order-1 lg:order-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Generated Answer</h2>
              {answer && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs lg:text-sm">
                  {selectedMarks} Mark Format
                </Badge>
              )}
            </div>

            <div className="min-h-64 lg:min-h-96 max-h-64 lg:max-h-96 overflow-y-auto">
              {answer ? (
                <div className="prose prose-slate max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-sm lg:text-base text-justify">
                    {renderMarkdownText(answer)}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <Brain className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-sm lg:text-base">Your AI-generated answer will appear here</p>
                    <p className="text-xs lg:text-sm mt-2 opacity-75">Start by entering a question above</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16 lg:mt-24 text-center">
          <h3 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-4">Why Choose Stubud AI?</h3>
          <p className="text-gray-600 mb-8 lg:mb-12 max-w-2xl mx-auto text-justify">
            Our advanced AI technology ensures you get the most accurate, well-structured academic answers tailored to your specific marking scheme requirements.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="p-6 lg:p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-3 text-lg lg:text-xl">AI-Powered Intelligence</h4>
              <p className="text-gray-600 text-sm lg:text-base text-justify leading-relaxed">
                Powered by advanced Gemini Flash 2.0 technology for accurate, contextual, and academically sound answers that meet educational standards.
              </p>
            </div>
            
            <div className="p-6 lg:p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 lg:w-8 lg:h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-3 text-lg lg:text-xl">Perfect Academic Format</h4>
              <p className="text-gray-600 text-sm lg:text-base text-justify leading-relaxed">
                Specifically designed for 2, 13, and 15 mark academic questions with proper structure, formatting, and mark allocation guidelines.
              </p>
            </div>
            
            <div className="p-6 lg:p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 lg:w-8 lg:h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-3 text-lg lg:text-xl">Lightning Fast Results</h4>
              <p className="text-gray-600 text-sm lg:text-base text-justify leading-relaxed">
                Get instant, high-quality responses with consistent formatting and comprehensive coverage of your academic topics.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 lg:mt-24 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 lg:p-12 text-white">
          <h3 className="text-2xl lg:text-3xl font-bold mb-4">Ready to Excel in Your Studies?</h3>
          <p className="text-lg lg:text-xl mb-6 opacity-90 max-w-2xl mx-auto text-justify">
            Join thousands of students who are already using Stubud AI to improve their academic performance and get better grades.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              <span className="text-sm lg:text-base">Academic Excellence</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm lg:text-base">Instant Results</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <span className="text-sm lg:text-base">AI-Powered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
