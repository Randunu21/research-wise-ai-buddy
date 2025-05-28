import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [summary, setSummary] = useState<any>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Upload file
      const uploadResponse = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });
      const uploadResult = await uploadResponse.json();

      // Get summary
      const summarizeResponse = await fetch(
        `http://127.0.0.1:8000/summarize?filepath=${encodeURIComponent(
          uploadResult.filepath
        )}`
      );
      const summaryResult = await summarizeResponse.json();
      setSummary(summaryResult);
      // Store both paths
      localStorage.setItem("filepath", uploadResult.filepath);
      localStorage.setItem("vectorPath", uploadResult.vector_path);
    } catch (error) {
      console.error("Upload or summarization failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                ResearchAI
              </span>
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 hover:scale-105 transform"
              >
                Home
              </Link>
              <Link to="/upload" className="text-blue-600 font-medium">
                Upload
              </Link>
              <Link
                to="/chat"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 hover:scale-105 transform"
              >
                Chat
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Upload & Analyze Your Research Paper
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload your PDF research paper and get an AI-generated structured
            summary with key insights.
          </p>
        </div>

        {/* Upload Section */}
        <Card
          className="mb-8 hover:shadow-lg transition-all duration-300 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload PDF Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors duration-300">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-blue-100 rounded-full p-4 hover:bg-blue-200 transition-colors duration-200">
                    <Upload className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      Choose a PDF file
                    </p>
                    <p className="text-gray-500">or drag and drop it here</p>
                  </div>
                </div>
              </label>
            </div>

            {selectedFile && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200 animate-fade-in">
                <p className="text-green-800 font-medium">
                  Selected: {selectedFile.name}
                </p>
                <p className="text-green-600 text-sm">
                  Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105 transform disabled:hover:scale-100"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Generate Summary"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Summary Section */}
        {summary && (
          <div
            className="space-y-6 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Research Summary
            </h2>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-blue-600">Title & Authors</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-xl font-semibold mb-2">{summary.title}</h3>
                <div className="text-gray-600 whitespace-pre-line">
                  {summary.authors}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-green-600">Abstract</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{summary.abstract}</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-purple-600">
                  Problem Statement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{summary.problemStatement}</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-orange-600">Methodology</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{summary.methodology}</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-red-600">Key Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{summary.keyResults}</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-indigo-600">Conclusion</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{summary.conclusion}</p>
              </CardContent>
            </Card>

            <div className="text-center mt-8">
              <Link to="/chat">
                <Button className="bg-green-600 hover:bg-green-700 transition-all duration-200 hover:scale-105 transform">
                  Ask Questions About This Paper
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
