import React, { useState } from 'react';
import { 
  Upload, 
  CheckCircle, 
  FileText, 
  Loader2, 
  AlertCircle,
  BarChart3,
  MessageSquare,
  Sparkles,
  Award,
  BookOpen,
  Check,
  AlertTriangle,
  RotateCcw,
  Zap
} from 'lucide-react';
import { Card, Button } from '../components/UI';
import ReactMarkdown from 'react-markdown';
import * as pdfjsLib from "pdfjs-dist";
// @ts-ignore
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

interface EvaluationResult {
  marksAwarded: number;
  maxMarks: number;
  percentage: number;
  correctPoints: string[];
  missingPoints: string[];
  feedback: string;
}

interface GradingPreset {
  name: string;
  question: string;
  modelAnswer: string;
  maxMarks: number;
  studentAnswer: string;
}

const PRESETS: GradingPreset[] = [
  {
    name: "Binary Search Tree Properties",
    question: "Define Binary Search Tree (BST) and state its three core properties.",
    modelAnswer: "A Binary Search Tree is a hierarchical node-based data structure where each node has at most two children.\n1. The left subtree of a node contains only keys lesser than the node's key.\n2. The right subtree of a node contains only keys greater than the node's key.\n3. The left and right subtrees must each also be a binary search tree.",
    maxMarks: 10,
    studentAnswer: "A Binary Search Tree is a hierarchical node-based data structure where each node has left and right children. The left subtree of a node contains only nodes with keys lesser than the node's key. The right subtree of a node contains only nodes with keys greater than the node's key. In this tree structure, each node can have at most two branching subtrees."
  },
  {
    name: "HTTP vs HTTPS Protocols",
    question: "Explain the key differences between HTTP and HTTPS protocols. Why is HTTPS preferred?",
    modelAnswer: "HTTP (Hypertext Transfer Protocol) transmits data in unencrypted plain text. HTTPS (HTTP Secure) uses TLS/SSL to encrypt traffic. HTTPS is preferred because it guarantees:\n1. Confidentiality (Data encryption to prevent eavesdropping)\n2. Integrity (Detects/prevents transfer tampering)\n3. Authentication (Verifies website identity using digital certificates)",
    maxMarks: 10,
    studentAnswer: "HTTP stands for Hypertext Transfer Protocol and sends data in standard plain text format. HTTPS is secure because it has SSL certificates which make the data highly encrypted. HTTPS is preferred by modern search engines and browsers because it runs faster using header optimization, and it hosts on port 80 or port 443."
  },
  {
    name: "Database Normalization",
    question: "What is database normalization? Explain 1NF and 2NF briefly.",
    modelAnswer: "Database normalization organizes tables to reduce redundancy and improve data integrity.\n- 1NF (First Normal Form) requires attributes to hold atomic (indivisible) values with no repeating groups.\n- 2NF (Second Normal Form) requires the table to be in 1NF and all non-key columns must be fully dependent on the primary key, avoiding partial dependencies.",
    maxMarks: 10,
    studentAnswer: "Database normalization is the process of structuring relational databases to clean up duplicate records. 1NF means row elements must be unique and separate. 2NF means we have a primary key and everything depends on it."
  }
];

export function Grading() {
  const [question, setQuestion] = useState(PRESETS[0].question);
  const [modelAnswer, setModelAnswer] = useState(PRESETS[0].modelAnswer);
  const [maxMarks, setMaxMarks] = useState<number>(PRESETS[0].maxMarks);
  const [studentAnswer, setStudentAnswer] = useState(PRESETS[0].studentAnswer);

  const [loading, setLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [file, setFile] = useState<File | null>(null);

  // Text extraction states
  const [extractedAnswer, setExtractedAnswer] = useState<string>('');
  const [extractionMessage, setExtractionMessage] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);

  // Stats markers
  const [totalGraded, setTotalGraded] = useState(8);
  const [averageScore, setAverageScore] = useState(72);

  const extractPdfText = async (targetFile: File): Promise<string> => {
    const arrayBuffer = await targetFile.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let textOut = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      textOut += pageText + '\n';
    }
    return textOut.trim();
  };

  const extractDocxText = async (targetFile: File): Promise<string> => {
    // @ts-ignore
    const mammoth = await import('mammoth');
    const arrayBuffer = await targetFile.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.trim();
  };

  const extractTxtText = async (targetFile: File): Promise<string> => {
    return (await targetFile.text()).trim();
  };

  const applyPreset = (preset: GradingPreset) => {
    setQuestion(preset.question);
    setModelAnswer(preset.modelAnswer);
    setMaxMarks(preset.maxMarks);
    setStudentAnswer(preset.studentAnswer);
    setEvaluation(null);
    setErrorStatus(null);
    setFile(null);
    setExtractedAnswer('');
    setExtractionMessage(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsExtracting(true);
    setEvaluation(null);
    setErrorStatus(null);
    setExtractionMessage(null);
    setExtractedAnswer('');

    try {
      let extractedText = '';
      const extension = selectedFile.name.split('.').pop()?.toLowerCase();

      if (extension === 'pdf') {
        extractedText = await extractPdfText(selectedFile);
        setExtractionMessage("PDF processed successfully");
      } else if (extension === 'docx') {
        extractedText = await extractDocxText(selectedFile);
        setExtractionMessage("DOCX processed successfully");
      } else if (extension === 'txt') {
        extractedText = await extractTxtText(selectedFile);
        setExtractionMessage("TXT processed successfully");
      } else {
        throw new Error("Unsupported file format. Please upload PDF, DOCX, or TXT.");
      }

      setStudentAnswer(extractedText);
      setExtractedAnswer(extractedText);
    } catch (err: any) {
      console.error("Text extraction failed:", err);
      setErrorStatus(`Text extraction failed: ${err.message || err.toString()}`);
      setExtractedAnswer('');
      setStudentAnswer('');
      setFile(null);
    } finally {
      setIsExtracting(false);
    }
  };

  const evaluateAnswer = async () => {
    const finalStudentAnswer = file ? extractedAnswer : studentAnswer;
    if (!question.trim() || !modelAnswer.trim() || !finalStudentAnswer.trim()) {
      setErrorStatus("Please provide a valid question, model answer, and student response.");
      return;
    }

    setLoading(true);
    setErrorStatus(null);
    setEvaluation(null);

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question,
          modelAnswer,
          maxMarks,
          studentAnswer: finalStudentAnswer
        })
      });

      if (!response.ok) {
        const errInfo = await response.json();
        throw new Error(errInfo.error || "Server failed to process academic sheet.");
      }

      const result = await response.json() as EvaluationResult;
      setEvaluation(result);
      
      // Update local stat trends
      setTotalGraded(prev => prev + 1);
      setAverageScore(prev => Math.round((prev * 8 + result.percentage) / 9));
    } catch (err: any) {
      console.error("Evaluation error:", err);
      setErrorStatus(err.message || "Failed to establish a link with our AI evaluation engine.");
    } finally {
      setLoading(false);
    }
  };

  const resetFields = () => {
    setQuestion('');
    setModelAnswer('');
    setMaxMarks(10);
    setStudentAnswer('');
    setEvaluation(null);
    setErrorStatus(null);
    setFile(null);
    setExtractedAnswer('');
    setExtractionMessage(null);
  };

  // Score color helper
  const getScoreTheme = (pct: number) => {
    if (pct >= 80) return { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', text: 'text-emerald-700', fill: 'bg-emerald-500' };
    if (pct >= 50) return { bg: 'bg-amber-50 text-amber-800 border-amber-200', text: 'text-amber-700', fill: 'bg-amber-500' };
    return { bg: 'bg-rose-50 text-rose-800 border-rose-200', text: 'text-rose-700', fill: 'bg-rose-500' };
  };

  const scoreTheme = evaluation ? getScoreTheme(evaluation.percentage) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-7 h-7 text-indigo-600" />
            AI Grading Assistant
          </h1>
          <p className="text-slate-500">Expert university examiner evaluation based on rigid academic rubrics and model sheets.</p>
        </div>
      </div>

      {/* Preset Pickers */}
      <div className="flex flex-wrap items-center gap-2 p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-amber-500" /> Preloads:
        </span>
        {PRESETS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 transition font-medium rounded-lg text-xs"
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Form fields */}
        <div className="lg:col-span-5 space-y-6">
          <Card title="Answer Sheet Details">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Question</label>
                <textarea 
                  rows={2}
                  placeholder="Paste the final exam question here..." 
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Maximum Marks</label>
                  <input 
                    type="number"
                    min={1}
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(Number(e.target.value))}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">File Upload (Optional)</label>
                  <div 
                    className="border border-dashed border-slate-200 bg-slate-50/50 rounded-lg p-2 text-center hover:bg-slate-50 cursor-pointer transition flex items-center justify-center gap-2"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <input 
                      type="file" 
                      id="file-upload" 
                      className="hidden" 
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileUpload}
                    />
                    {isExtracting ? (
                      <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 text-slate-400" />
                    )}
                    <span className="text-xs font-semibold text-slate-700 truncate max-w-[120px]">
                      {isExtracting ? "Extracting..." : file ? file.name : "Attach Sheet"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Extracted Answer Preview Panel */}
              {file && (
                <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg space-y-1.5 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" /> Extracted Preview ({file.name.split('.').pop()?.toUpperCase()})
                    </span>
                    {extractionMessage && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        {extractionMessage}
                      </span>
                    )}
                  </div>
                  <div className="max-h-32 overflow-y-auto p-2.5 bg-white border border-indigo-100/50 rounded text-xs text-slate-600 font-mono whitespace-pre-wrap leading-relaxed shadow-inner">
                    {isExtracting ? (
                      <span className="text-slate-400 italic">Processing document content...</span>
                    ) : (
                      extractedAnswer || <span className="text-slate-400 italic">No text extracted.</span>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Expected Model Answer (Rubric)</label>
                <textarea 
                  rows={4}
                  placeholder="Define points or paragraphs containing reference answers..." 
                  value={modelAnswer}
                  onChange={(e) => setModelAnswer(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Student's Actual Answer {file ? '(Extracted from uploaded file)' : ''}
                </label>
                <textarea 
                  rows={5}
                  placeholder="Candidate's actual written text..." 
                  value={studentAnswer}
                  onChange={(e) => setStudentAnswer(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono text-xs"
                />
              </div>

              {errorStatus && (
                <div className="flex items-start gap-2.5 p-3.5 bg-red-50 text-red-800 rounded-lg border border-red-100 text-xs text-left">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p>{errorStatus}</p>
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <Button 
                  variant="outline"
                  className="w-1/3"
                  onClick={resetFields}
                  disabled={loading || isExtracting}
                  icon={<RotateCcw />}
                >
                  Clear
                </Button>
                <Button 
                  className="w-2/3" 
                  disabled={loading || isExtracting || !question.trim() || !modelAnswer.trim() || !(file ? extractedAnswer.trim() : studentAnswer.trim())}
                  onClick={evaluateAnswer}
                  icon={loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                >
                  {loading ? 'Evaluating...' : 'Evaluate Answer'}
                </Button>
              </div>
            </div>
          </Card>

          <Card title="Evaluation Overview Stats">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Gradings Processed This Session</span>
                <span className="text-sm font-bold text-slate-900">{totalGraded}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Average Performance Metric</span>
                <span className="text-sm font-bold text-indigo-600">{averageScore}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full transition-all duration-500" style={{ width: `${averageScore}%` }}></div>
              </div>
              <p className="text-[10px] text-slate-400 text-center italic">AI grades are suggestions under model directives. Lecturers review before submission.</p>
            </div>
          </Card>
        </div>

        {/* Right Column: Dynamic Evaluation Report */}
        <div className="lg:col-span-7">
          <Card 
            className="min-h-[500px]" 
            title="Academic Evaluation Assessment"
            headerAction={
              evaluation && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" icon={<BarChart3 />} onClick={() => window.print()}>Print / Export</Button>
                  <Button variant="outline" size="sm" icon={<MessageSquare />} onClick={() => alert("Feedback logged with student's profile successfully!")}>Log Score</Button>
                </div>
              )
            }
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center p-24 text-slate-500">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                <p className="text-sm font-semibold text-slate-700">Analyzing Answer Sheet...</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm text-center">Comparing correct concepts, identifying gaps, and constructing fair examiner feedback.</p>
              </div>
            ) : evaluation && scoreTheme ? (
              <div className="space-y-6">
                {/* Score Banner */}
                <div className={`p-6 rounded-xl border ${scoreTheme.bg} flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left`}>
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Calculated Score</h4>
                    <p className="text-3xl font-extrabold text-slate-900 mt-1">
                      {evaluation.marksAwarded} <span className="text-lg font-medium text-slate-500">/ {evaluation.maxMarks} Marks</span>
                    </p>
                  </div>
                  <div>
                    <span className="text-3xl font-extrabold">{evaluation.percentage}%</span>
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Overall Ratio</p>
                  </div>
                </div>

                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className={`h-full ${scoreTheme.fill} transition-all duration-700`} style={{ width: `${evaluation.percentage}%` }}></div>
                </div>

                {/* Bullet Strengths / Gaps Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Correct Points */}
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-5">
                    <h4 className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      Correct Concepts Identified
                    </h4>
                    {evaluation.correctPoints && evaluation.correctPoints.length > 0 ? (
                      <ul className="space-y-2">
                        {evaluation.correctPoints.map((point, index) => (
                          <li key={index} className="text-xs text-slate-700 flex items-start gap-1.5">
                            <span className="text-emerald-500 font-bold shrink-0">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-500 italic">No major matching concepts found.</p>
                    )}
                  </div>

                  {/* Missing Points / Incorrect state */}
                  <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-5">
                    <h4 className="text-xs font-extrabold text-amber-800 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      Discrepancies / Gaps
                    </h4>
                    {evaluation.missingPoints && evaluation.missingPoints.length > 0 ? (
                      <ul className="space-y-2">
                        {evaluation.missingPoints.map((point, index) => (
                          <li key={index} className="text-xs text-slate-700 flex items-start gap-1.5">
                            <span className="text-amber-500 font-bold shrink-0">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-500 italic">No major concept discrepancies logged.</p>
                    )}
                  </div>
                </div>

                {/* Professional Examiner Feedback rendering ReactMarkdown cleanly */}
                <div className="border border-slate-100 rounded-xl p-5 bg-slate-50">
                  <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    University Examiner Feedback
                  </h4>
                  <div className="markdown-body prose prose-slate max-w-none prose-xs text-slate-600 leading-relaxed">
                    <ReactMarkdown>{evaluation.feedback}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-slate-400">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                  <AlertCircle className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-sm font-semibold text-slate-700">No Assessment Loaded Yet</p>
                <div className="text-xs max-w-sm mt-2 text-slate-500 space-y-2 leading-relaxed">
                  <p>Choose a sample preload from the top list, or enter custom details and click **Evaluate Answer** to review student scripts.</p>
                  <p className="font-semibold text-indigo-600">The expert examiner adheres rigidly to these evaluation rules:</p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 text-left max-w-md bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Compare with rubric concepts
                  </div>
                  <div className="text-[10px] text-slate-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Identify missing gaps
                  </div>
                  <div className="text-[10px] text-slate-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Award marks proportionally
                  </div>
                  <div className="text-[10px] text-slate-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Fair wording considerations
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
