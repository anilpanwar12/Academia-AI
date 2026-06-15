import React, { useState } from 'react';
import { 
  Sparkles, 
  Download, 
  Save, 
  FileText, 
  Loader2, 
  Copy,
  Check
} from 'lucide-react';
import { Card, Button } from '../components/UI';
import { ai, MODELS } from '../lib/gemini';
import ReactMarkdown from 'react-markdown';
import { jsPDF } from 'jspdf';

export function NotesGen() {
  const [topic, setTopic] = useState('');
  const [course, setCourse] = useState('');
  const [week, setWeek] = useState('1');
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);

  const generateNotes = async () => {
    if (!topic || !course) return;
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: MODELS.FLASH,
        contents: `Generate structured lecture notes for the topic: "${topic}" in the course "${course}" for week ${week}. 
        Include: 
        1. Learning Objectives
        2. Introduction
        3. Key Concepts (with detailed explanations)
        4. Examples/Case Studies
        5. Summary
        6. Review Questions.
        Format the output in clean Markdown.`,
      });
      setNotes(response.text || 'Failed to generate notes.');
    } catch (error) {
      console.error(error);
      setNotes('Error generating notes. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(notes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPDF = () => {
    if (!notes) return;
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxLineWidth = pageWidth - margin * 2;
    
    // Header
    doc.setFontSize(18);
    doc.setTextColor(79, 70, 229); // Indigo 600
    doc.text(`${course}`, margin, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`${topic} | Week ${week}`, margin, 28);
    doc.setDrawColor(226, 232, 240); // Slate 200
    doc.line(margin, 32, pageWidth - margin, 32);
    
    // Content with pagination
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59); // Slate 800
    let cursorY = 40;
    const lineHeight = 6;

    // Split raw text by newlines first, then wrap each
    const paragraphs = notes.split('\n');
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
    
    doc.save(`${course.replace(/\s+/g, '_')}_Notes.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Notes Generation</h1>
          <p className="text-slate-500">Automatically generate structured lecture notes based on your topics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 h-fit" title="Input Details">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Course Title</label>
              <input 
                type="text" 
                placeholder="e.g. Data Structures" 
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Lecture Topic</label>
              <input 
                type="text" 
                placeholder="e.g. Binary Search Trees" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Week Number</label>
              <select 
                value={week}
                onChange={(e) => setWeek(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {Array.from({ length: 15 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>Week {num}</option>
                ))}
              </select>
            </div>
            <Button 
              className="w-full mt-4" 
              icon={loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
              onClick={generateNotes}
              disabled={loading || !topic || !course}
            >
              {loading ? 'Generating...' : 'Generate Notes'}
            </Button>
          </div>
        </Card>

        <Card 
          className="lg:col-span-2 min-h-[500px] flex flex-col" 
          title="Generated Notes"
          headerAction={
            notes && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" icon={copied ? <Check className="text-emerald-500" /> : <Copy />} onClick={copyToClipboard}>
                  {copied ? 'Copied' : 'Copy'}
                </Button>
                <Button variant="outline" size="sm" icon={<Download />} onClick={downloadPDF}>PDF</Button>
              </div>
            )
          }
        >
          {notes ? (
            <div className="prose prose-slate max-w-none prose-sm prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600">
              <ReactMarkdown>{notes}</ReactMarkdown>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-slate-400">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <p className="text-sm font-medium">No notes generated yet.</p>
              <p className="text-xs max-w-[200px] mt-1">Fill in the details on the left and click generate to start.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

