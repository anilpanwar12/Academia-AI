import React, { useState } from 'react';
import { 
  Sparkles, 
  Download, 
  FileQuestion, 
  Loader2, 
  Copy, 
  Check, 
  Settings2 
} from 'lucide-react';
import { Card, Button } from '../components/UI';
import { ai, MODELS } from '../lib/gemini';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import { jsPDF } from 'jspdf';

export function QuestionPaper() {
  const [topic, setTopic] = useState('');
  const [examType, setExamType] = useState('mid-term');
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState('');
  const [copied, setCopied] = useState(false);

  const generateQuestions = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: MODELS.FLASH,
        contents: `Generate a ${examType} question paper for the topic: "${topic}". 
        Difficulty level: ${difficulty}.
        Include:
        1. Section A: Multiple Choice Questions (5 questions)
        2. Section B: Short Answer Questions (3 questions)
        3. Section C: Long Answer/Problem Solving (2 questions)
        Provide the answer key at the end.
        Format the output in clean Markdown with clear headings and numbering.`,
      });
      setQuestions(response.text || 'Failed to generate questions.');
    } catch (error) {
      console.error(error);
      setQuestions('Error generating questions. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(questions);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPDF = () => {
    if (!questions) return;
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxLineWidth = pageWidth - margin * 2;
    
    // Header
    doc.setFontSize(18);
    doc.setTextColor(79, 70, 229);
    doc.text(`${examType.toUpperCase()} Question Paper`, margin, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Topic: ${topic.substring(0, 50)}`, margin, 28);
    doc.text(`Difficulty: ${difficulty}`, margin, 34);
    doc.line(margin, 38, pageWidth - margin, 38);
    
    // Content with pagination
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    let cursorY = 45;
    const lineHeight = 6;

    // Split raw text by newlines first, then wrap each
    const paragraphs = questions.split('\n');
    paragraphs.forEach((para) => {
      const wrappedLines = doc.splitTextToSize(para, maxLineWidth);
      wrappedLines.forEach((line: string) => {
        if (cursorY > pageHeight - margin) {
          doc.addPage();
          cursorY = margin + 10; // offset a little for page margin on new page
        }
        doc.text(line, margin, cursorY);
        cursorY += lineHeight;
      });
      // Add a little paragraph break
      if (para.trim() === '') {
        cursorY += 2;
      }
    });
    
    doc.save(`${examType}_${topic.substring(0, 10).replace(/\s+/g, '_')}_Paper.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Question Paper Generator</h1>
          <p className="text-slate-500">Create high-quality exam papers in seconds using AI.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 h-fit" title="Exam Configuration">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Topics/Chapters</label>
              <textarea 
                placeholder="e.g. Linked Lists, Stacks, Queues" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Exam Type</label>
              <select 
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="quiz">Quiz / Class Test</option>
                <option value="mid-term">Mid-Term Exam</option>
                <option value="final">Final Examination</option>
                <option value="assignment">Assignment</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Difficulty</label>
              <div className="grid grid-cols-3 gap-2">
                {['easy', 'medium', 'hard'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={cn(
                      "py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all",
                      difficulty === level 
                        ? "bg-indigo-600 border-indigo-600 text-white" 
                        : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <Button 
              className="w-full mt-4" 
              icon={loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
              onClick={generateQuestions}
              disabled={loading || !topic}
            >
              {loading ? 'Generating...' : 'Generate Paper'}
            </Button>
          </div>
        </Card>

        <Card 
          className="lg:col-span-2 min-h-[500px] flex flex-col" 
          title="Question Paper Preview"
          headerAction={
            questions && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" icon={copied ? <Check className="text-emerald-500" /> : <Copy />} onClick={copyToClipboard}>
                  {copied ? 'Copied' : 'Copy'}
                </Button>
                <Button variant="outline" size="sm" icon={<Download />} onClick={downloadPDF}>PDF</Button>
              </div>
            )
          }
        >
          {questions ? (
            <div className="prose prose-slate max-w-none prose-sm prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600">
              <ReactMarkdown>{questions}</ReactMarkdown>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-slate-400">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <FileQuestion className="w-8 h-8" />
              </div>
              <p className="text-sm font-medium">No questions generated yet.</p>
              <p className="text-xs max-w-[200px] mt-1">Configure your exam on the left and click generate.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

