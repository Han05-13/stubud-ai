
import { Card } from '@/components/ui/card';
import { Shield, Eye, Lock, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 lg:py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="p-3 bg-blue-600 rounded-full shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your data.
          </p>
        </div>

        {/* Navigation */}
        <div className="mb-8 text-center">
          <Link to="/" className="text-blue-600 hover:text-blue-800 underline">
            ← Back to Home
          </Link>
        </div>

        {/* Last Updated */}
        <Card className="p-6 mb-8 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <p className="text-sm text-gray-500 text-center">
            <strong>Last updated:</strong> December 2024
          </p>
        </Card>

        {/* Privacy Sections */}
        <div className="space-y-6">
          <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Information We Collect</h2>
            </div>
            <div className="space-y-4 text-gray-600">
              <p className="text-justify">
                <strong>Questions and Content:</strong> We collect the academic questions you submit to generate answers. This information is processed by our AI service to provide you with relevant responses.
              </p>
              <p className="text-justify">
                <strong>Usage Data:</strong> We track basic usage statistics such as the number of requests made and tokens used to ensure fair access to our service and maintain quality.
              </p>
              <p className="text-justify">
                <strong>Technical Data:</strong> We may collect technical information such as your IP address, browser type, and device information for security and service improvement purposes.
              </p>
            </div>
          </Card>

          <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">How We Use Your Information</h2>
            </div>
            <div className="space-y-4 text-gray-600">
              <ul className="list-disc list-inside space-y-2">
                <li>To generate AI-powered academic answers based on your questions</li>
                <li>To monitor and enforce rate limits to ensure fair usage</li>
                <li>To improve our service quality and user experience</li>
                <li>To prevent abuse and maintain system security</li>
                <li>To analyze usage patterns for service optimization</li>
              </ul>
            </div>
          </Card>

          <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-800">Data Security & Retention</h2>
            </div>
            <div className="space-y-4 text-gray-600">
              <p className="text-justify">
                <strong>Security Measures:</strong> We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction.
              </p>
              <p className="text-justify">
                <strong>Data Retention:</strong> Questions and generated answers are processed in real-time and are not permanently stored on our servers. Usage statistics are retained for service improvement purposes.
              </p>
              <p className="text-justify">
                <strong>Third-Party Services:</strong> We use Google's Gemini AI service to process your questions. Your data is subject to Google's privacy policies when processed by their systems.
              </p>
            </div>
          </Card>

          <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Rights</h2>
            <div className="space-y-4 text-gray-600">
              <p className="text-justify">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Know what personal information we collect and how it's used</li>
                <li>Request access to your personal information</li>
                <li>Request correction of inaccurate personal information</li>
                <li>Request deletion of your personal information</li>
                <li>Object to processing of your personal information</li>
                <li>Withdraw consent for data processing</li>
              </ul>
            </div>
          </Card>

          <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Cookies & Local Storage</h2>
            <div className="space-y-4 text-gray-600">
              <p className="text-justify">
                Our service may use local storage in your browser to save your preferences and improve user experience. This data remains on your device and is not transmitted to our servers.
              </p>
            </div>
          </Card>

          <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Changes to This Policy</h2>
            <div className="space-y-4 text-gray-600">
              <p className="text-justify">
                We may update this privacy policy from time to time. When we make changes, we will update the "Last updated" date at the top of this policy. We encourage you to review this policy periodically.
              </p>
            </div>
          </Card>

          <Card className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="mb-4 text-blue-100">
              If you have any questions about this privacy policy or our data practices, please contact us:
            </p>
            <div className="space-y-2">
              <p className="font-medium">Email: privacy@stubud.ai</p>
              <p className="font-medium">Subject: Privacy Policy Inquiry</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
