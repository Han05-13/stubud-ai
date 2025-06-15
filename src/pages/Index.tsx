
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, BookOpen, Brain } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Stubud AI
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Generate AI-powered answers in academic formats. Perfect for 2, 13, and 15 mark questions.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">Enter Your Question</h2>
              </div>

              <Textarea
                placeholder="Type your academic question here..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-32 text-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                disabled={isGenerating}
              />

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Select Answer Format</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {markOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedMarks(option.value)}
                      disabled={isGenerating}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        selectedMarks === option.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm opacity-75">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !question.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg font-medium"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Answer...
                  </>
                ) : (
                  'Generate Answer'
                )}
              </Button>
            </div>
          </Card>

          {/* Answer Section */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Generated Answer</h2>
              {answer && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {selectedMarks} Mark Format
                </Badge>
              )}
            </div>

            <div className="min-h-96 max-h-96 overflow-y-auto">
              {answer ? (
                <div className="prose prose-slate max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {answer}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Your AI-generated answer will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-8">Why Choose Stubud AI?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">AI-Powered</h4>
              <p className="text-gray-600">Using advanced Gemini Flash 2.0 for accurate, contextual answers</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Academic Format</h4>
              <p className="text-gray-600">Tailored for 2, 13, and 15 mark academic question formats</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Fast & Reliable</h4>
              <p className="text-gray-600">Quick response times with consistent, quality answers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
