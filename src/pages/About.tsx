
import { Card } from '@/components/ui/card';
import { Brain, Users, Award, Shield, BookOpen, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 lg:py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="p-3 bg-blue-600 rounded-full shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              About Stubud AI
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Empowering students worldwide with AI-powered academic assistance
          </p>
        </div>

        {/* Navigation */}
        <div className="mb-8 text-center">
          <Link to="/" className="text-blue-600 hover:text-blue-800 underline">
            ← Back to Home
          </Link>
        </div>

        {/* Mission Section */}
        <Card className="p-8 mb-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed text-justify mb-4">
            At Stubud AI, we believe that every student deserves access to high-quality academic assistance. Our mission is to democratize education by providing AI-powered tools that help students understand complex concepts, generate well-structured answers, and excel in their academic pursuits.
          </p>
          <p className="text-gray-600 leading-relaxed text-justify">
            We leverage cutting-edge artificial intelligence technology to create personalized learning experiences that adapt to different academic requirements and marking schemes.
          </p>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-800">Academic Excellence</h3>
            </div>
            <p className="text-gray-600 text-justify">
              Our AI generates answers that follow proper academic structure and formatting, ensuring students learn the correct way to approach different types of questions.
            </p>
          </Card>

          <Card className="p-6 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-800">Instant Results</h3>
            </div>
            <p className="text-gray-600 text-justify">
              Get comprehensive answers in seconds, allowing students to learn efficiently and focus on understanding concepts rather than spending hours on research.
            </p>
          </Card>

          <Card className="p-6 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-semibold text-gray-800">Multiple Formats</h3>
            </div>
            <p className="text-gray-600 text-justify">
              Support for 2, 13, and 15 mark questions with appropriate depth and structure for each format, matching real academic requirements.
            </p>
          </Card>

          <Card className="p-6 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-red-600" />
              <h3 className="text-xl font-semibold text-gray-800">Reliable Technology</h3>
            </div>
            <p className="text-gray-600 text-justify">
              Powered by Google's advanced Gemini 2.0 Flash technology, ensuring accurate, contextual, and educationally sound responses.
            </p>
          </Card>
        </div>

        {/* Technology Section */}
        <Card className="p-8 mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <h2 className="text-2xl font-bold mb-4">Our Technology</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">AI-Powered Engine</h3>
              <p className="text-blue-100 text-justify">
                Built on Google's Gemini 2.0 Flash model, our system understands context, maintains academic standards, and provides consistent, high-quality responses.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Smart Rate Limiting</h3>
              <p className="text-blue-100 text-justify">
                Advanced rate limiting ensures fair usage while maintaining service quality for all users with 80,000 tokens per day allocation.
              </p>
            </div>
          </div>
        </Card>

        {/* Contact Section */}
        <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-6">
            Have questions, suggestions, or need support? We'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="text-center">
              <div className="text-sm text-gray-500">Email</div>
              <div className="font-medium text-blue-600">support@stubud.ai</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">Follow Us</div>
              <div className="font-medium text-blue-600">@StubudAI</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default About;
