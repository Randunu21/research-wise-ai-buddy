
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, MessageCircle, Zap, Upload } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">ResearchAI</span>
            </div>
            <div className="hidden md:flex space-x-6">
              <Link to="/" className="text-blue-600 font-medium">Home</Link>
              <Link to="/upload" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 hover:scale-105 transform">Upload</Link>
              <Link to="/chat" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 hover:scale-105 transform">Chat</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
              AI-powered
              <span className="text-blue-600 block">Research Assistant</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fade-in" style={{animationDelay: '0.2s'}}>
              Upload your research papers and get instant AI-generated summaries, 
              ask questions, and gain deeper insights into your academic work.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{animationDelay: '0.4s'}}>
              <Link to="/upload">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 transform">
                  <Upload className="mr-2 h-5 w-5" />
                  Get Started
                </Button>
              </Link>
              <Link to="/chat">
                <Button variant="outline" size="lg" className="px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 transform">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Try Chat
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Transform how you interact with research papers using cutting-edge AI technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 transform animate-fade-in" style={{animationDelay: '0.1s'}}>
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 hover:bg-blue-200 transition-colors duration-200">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Upload</h3>
                <p className="text-gray-600">
                  Simply upload your PDF research papers and our AI will automatically process and analyze the content
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 transform animate-fade-in" style={{animationDelay: '0.2s'}}>
              <CardContent className="p-6 text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 hover:bg-green-200 transition-colors duration-200">
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Structured Summaries</h3>
                <p className="text-gray-600">
                  Get organized summaries with key sections: methodology, results, conclusions, and more
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 transform animate-fade-in" style={{animationDelay: '0.3s'}}>
              <CardContent className="p-6 text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 hover:bg-purple-200 transition-colors duration-200">
                  <MessageCircle className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Interactive Q&A</h3>
                <p className="text-gray-600">
                  Ask natural language questions about your papers and get intelligent, context-aware answers
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to revolutionize your research workflow?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join researchers worldwide who are saving hours of time with AI-powered analysis
          </p>
          <Link to="/upload">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 transform">
              <Zap className="mr-2 h-5 w-5" />
              Start Analyzing Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <FileText className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-semibold">ResearchAI</span>
          </div>
          <p className="text-gray-400">
            Empowering researchers with AI-driven insights
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
