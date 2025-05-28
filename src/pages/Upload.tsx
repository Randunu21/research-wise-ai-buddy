
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Upload as UploadIcon, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive"
      });
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    
    // Simulate API call - replace with actual backend integration
    setTimeout(() => {
      setSummary({
        title: "Deep Learning Approaches for Natural Language Processing",
        authors: "Dr. Jane Smith, Dr. John Doe, Dr. Sarah Wilson",
        abstract: "This paper presents a comprehensive analysis of modern deep learning techniques applied to natural language processing tasks. We explore transformer architectures, attention mechanisms, and their applications in various NLP domains.",
        problemStatement: "Current NLP models struggle with understanding context and maintaining coherence across long sequences of text, particularly in complex reasoning tasks.",
        methodology: "We implemented a novel transformer-based architecture with enhanced attention mechanisms, trained on a curated dataset of 10M research papers using distributed computing infrastructure.",
        keyResults: "Our model achieved 94.2% accuracy on benchmark tasks, outperforming previous state-of-the-art by 7.3%. Processing speed improved by 40% while maintaining interpretability.",
        conclusion: "The proposed approach demonstrates significant improvements in both accuracy and efficiency for NLP tasks, opening new possibilities for real-world applications."
      });
      setIsUploading(false);
      toast({
        title: "Summary generated!",
        description: "Your research paper has been successfully analyzed"
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">ResearchAI</span>
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
              <Link to="/upload" className="text-blue-600 font-medium">Upload</Link>
              <Link to="/chat" className="text-gray-700 hover:text-blue-600 transition-colors">Chat</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="space-y-8">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UploadIcon className="h-6 w-6" />
                <span>Upload Research Paper</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <UploadIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Upload your PDF</h3>
                  <p className="text-gray-600">Select a research paper in PDF format</p>
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" className="mt-4 cursor-pointer">
                    Choose File
                  </Button>
                </label>
                {file && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">Selected: {file.name}</p>
                  </div>
                )}
              </div>
              {file && !summary && (
                <div className="mt-6 text-center">
                  <Button 
                    onClick={handleUpload} 
                    disabled={isUploading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating Summary...
                      </>
                    ) : (
                      <>
                        <UploadIcon className="h-4 w-4 mr-2" />
                        Generate Summary
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary Display */}
          {summary && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-6 w-6" />
                  <span>Research Paper Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="title-authors">
                    <AccordionTrigger className="text-left">Title & Authors</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">{summary.title}</h3>
                        <p className="text-gray-600">{summary.authors}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="abstract">
                    <AccordionTrigger>Abstract</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-gray-700 leading-relaxed">{summary.abstract}</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="problem">
                    <AccordionTrigger>Problem Statement</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-gray-700 leading-relaxed">{summary.problemStatement}</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="methodology">
                    <AccordionTrigger>Methodology</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-gray-700 leading-relaxed">{summary.methodology}</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="results">
                    <AccordionTrigger>Key Results</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-gray-700 leading-relaxed">{summary.keyResults}</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="conclusion">
                    <AccordionTrigger>Conclusion</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-gray-700 leading-relaxed">{summary.conclusion}</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="mt-6 text-center">
                  <Link to="/chat">
                    <Button className="bg-green-600 hover:bg-green-700">
                      Ask Questions About This Paper
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;
