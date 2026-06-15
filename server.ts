import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import { GoogleGenAI, Type } from "@google/genai";

let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;

console.log("GEMINI KEY =", apiKey ? "FOUND" : "NOT FOUND");
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined. Please configure secrets in Settings.");
    }
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // SQLite initialization
  const db = new Database("academia.db");

  // Create tables with correct schema types
  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      student_id TEXT PRIMARY KEY,
      student_name TEXT,
      roll_no TEXT UNIQUE,
      semester TEXT,
      section TEXT
    );

    CREATE TABLE IF NOT EXISTS lectures (
      lecture_id TEXT PRIMARY KEY,
      lecture_name TEXT,
      subject_code TEXT,
      semester TEXT,
      section TEXT,
      faculty_name TEXT
    );

    CREATE TABLE IF NOT EXISTS teachers (
      id TEXT PRIMARY KEY,
      name TEXT,
      dept TEXT,
      role TEXT
    );

    CREATE TABLE IF NOT EXISTS attendance (
      attendance_id TEXT PRIMARY KEY,
      student_id TEXT,
      lecture_id TEXT,
      attendance_date TEXT,
      status TEXT,
      created_at TEXT,
      UNIQUE(student_id, lecture_id, attendance_date)
    );
  `);

  // Seed default students if empty
  const studentCount = db.prepare("SELECT COUNT(*) as count FROM students").get() as { count: number };
  if (studentCount.count === 0) {
    const insertStudent = db.prepare("INSERT INTO students (student_id, student_name, roll_no, semester, section) VALUES (?, ?, ?, ?, ?)");
    const defaultStudents = [
      ["s1", "Rahul Sharma", "CS2026001", "4", "A"],
      ["s2", "Priya Patel", "CS2026002", "4", "A"],
      ["s3", "Amit Verma", "CS2026003", "4", "A"],
      ["s4", "Sneha Reddy", "CS2026004", "4", "A"],
      ["s5", "Rohan Gupta", "CS2026005", "4", "A"],
      ["s6", "Deepak Kumar", "CS2026006", "4", "A"],
      ["s7", "Divya Iyer", "CS2026007", "3", "B"],
      ["s8", "Karan Malhotra", "CS2026008", "3", "B"],
      ["s9", "Anjali Desai", "CS2026009", "3", "B"],
      ["s10", "Vikram Singh", "CS2026010", "5", "A"]
    ];
    db.transaction(() => {
      for (const st of defaultStudents) {
        insertStudent.run(...st);
      }
    })();
  }

  // Seed default lectures if empty
  const lectureCount = db.prepare("SELECT COUNT(*) as count FROM lectures").get() as { count: number };
  if (lectureCount.count === 0) {
    const insertLecture = db.prepare("INSERT INTO lectures (lecture_id, lecture_name, subject_code, semester, section, faculty_name) VALUES (?, ?, ?, ?, ?, ?)");
    const defaultLectures = [
      ["l1", "Web Technology", "CS401", "4", "A", "Anil Panwar"],
      ["l2", "Data Structures", "CS301", "3", "B", "Dr. Sarah Chen"],
      ["l3", "Computer Networks", "CS501", "5", "A", "Anil Panwar"]
    ];
    db.transaction(() => {
      for (const lec of defaultLectures) {
        insertLecture.run(...lec);
      }
    })();
  }

  // Seed default teachers if empty
  const teacherCount = db.prepare("SELECT COUNT(*) as count FROM teachers").get() as { count: number };
  if (teacherCount.count === 0) {
    const insertTeacher = db.prepare("INSERT INTO teachers (id, name, dept, role) VALUES (?, ?, ?, ?)");
    const defaultTeachers = [
      ["t1", "Dr. Sarah Chen", "Computer Science", "Senior Professor"],
      ["t2", "Prof. Michael Ross", "Mathematics", "Associate Professor"],
      ["t3", "Anil Panwar", "Computer Science", "Assistant Professor"]
    ];
    db.transaction(() => {
      for (const t of defaultTeachers) {
        insertTeacher.run(...t);
      }
    })();
  }

  // Seed default attendance records if empty
  const attendanceCount = db.prepare("SELECT COUNT(*) as count FROM attendance").get() as { count: number };
  if (attendanceCount.count === 0) {
    const insertAttendance = db.prepare("INSERT INTO attendance (attendance_id, student_id, lecture_id, attendance_date, status, created_at) VALUES (?, ?, ?, ?, ?, ?)");
    const defaultAttendance = [
      ["a1", "s1", "l1", "2026-05-26", "Present", "2026-05-26T10:00:00Z"],
      ["a2", "s2", "l1", "2026-05-26", "Present", "2026-05-26T10:00:00Z"],
      ["a3", "s3", "l1", "2026-05-26", "Absent", "2026-05-26T10:00:00Z"],
      ["a4", "s4", "l1", "2026-05-26", "Present", "2026-05-26T10:00:00Z"],
      ["a5", "s5", "l1", "2026-05-26", "Present", "2026-05-26T10:00:00Z"],
      ["a6", "s6", "l1", "2026-05-26", "Present", "2026-05-26T10:00:00Z"],

      ["a7", "s1", "l1", "2026-05-27", "Present", "2026-05-27T10:00:00Z"],
      ["a8", "s2", "l1", "2026-05-27", "Absent", "2026-05-27T10:00:00Z"],
      ["a9", "s3", "l1", "2026-05-27", "Present", "2026-05-27T10:00:00Z"],
      ["a10", "s4", "l1", "2026-05-27", "Present", "2026-05-27T10:00:00Z"],
      ["a11", "s5", "l1", "2026-05-27", "Present", "2026-05-27T10:00:00Z"],
      ["a12", "s6", "l1", "2026-05-27", "Present", "2026-05-27T10:00:00Z"],

      ["a13", "s1", "l1", "2026-05-28", "Present", "2026-05-28T10:00:00Z"],
      ["a14", "s2", "l1", "2026-05-28", "Present", "2026-05-28T10:00:00Z"],
      ["a15", "s3", "l1", "2026-05-28", "Present", "2026-05-28T10:00:00Z"],
      ["a16", "s4", "l1", "2026-05-28", "Present", "2026-05-28T10:00:00Z"],
      ["a17", "s5", "l1", "2026-05-28", "Absent", "2026-05-28T10:00:00Z"],
      ["a18", "s6", "l1", "2026-05-28", "Present", "2026-05-28T10:00:00Z"],

      ["a19", "s7", "l2", "2026-05-26", "Present", "2026-05-26T11:00:00Z"],
      ["a20", "s8", "l2", "2026-05-26", "Absent", "2026-05-26T11:00:00Z"],
      ["a21", "s9", "l2", "2026-05-26", "Present", "2026-05-26T11:00:00Z"],

      ["a22", "s7", "l2", "2026-05-27", "Present", "2026-05-27T11:00:00Z"],
      ["a23", "s8", "l2", "2026-05-27", "Present", "2026-05-27T11:00:00Z"],
      ["a24", "s9", "l2", "2026-05-27", "Absent", "2026-05-27T11:00:00Z"],

      ["a25", "s7", "l2", "2026-05-28", "Present", "2026-05-28T11:00:00Z"],
      ["a26", "s8", "l2", "2026-05-28", "Present", "2026-05-28T11:00:00Z"],
      ["a27", "s9", "l2", "2026-05-28", "Present", "2026-05-28T11:00:00Z"]
    ];
    db.transaction(() => {
      for (const row of defaultAttendance) {
        insertAttendance.run(...row);
      }
    })();
  }

  // API Endpoints
  app.get("/api/students", (req, res) => {
    try {
      const students = db.prepare("SELECT * FROM students").all();
      res.json(students);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/students", (req, res) => {
    try {
      const { student_id, student_name, roll_no, semester, section } = req.body;
      if (!student_name || !roll_no) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      db.prepare(`
        INSERT INTO students (student_id, student_name, roll_no, semester, section)
        VALUES (?, ?, ?, ?, ?)
      `).run(student_id, student_name, roll_no, semester, section);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/lectures", (req, res) => {
    try {
      const lectures = db.prepare("SELECT * FROM lectures").all();
      res.json(lectures);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/lectures", (req, res) => {
    try {
      const { lecture_id, lecture_name, subject_code, semester, section, faculty_name } = req.body;
      if (!lecture_name || !subject_code) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      db.prepare(`
        INSERT INTO lectures (lecture_id, lecture_name, subject_code, semester, section, faculty_name)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(lecture_id, lecture_name, subject_code, semester, section, faculty_name);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/teachers", (req, res) => {
    try {
      const teachers = db.prepare("SELECT * FROM teachers").all();
      res.json(teachers);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/teachers", (req, res) => {
    try {
      const { id, name, dept, role } = req.body;
      if (!name || !dept) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      db.prepare(`
        INSERT INTO teachers (id, name, dept, role)
        VALUES (?, ?, ?, ?)
      `).run(id, name, dept, role);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/teachers/:id", (req, res) => {
    try {
      const { id } = req.params;
      db.prepare("DELETE FROM teachers WHERE id = ?").run(id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/evaluate", async (req, res) => {
    try {
      const { question, modelAnswer, maxMarks, studentAnswer } = req.body;
      if (!question || !modelAnswer || !studentAnswer) {
        return res.status(400).json({ error: "Missing required fields (question, modelAnswer, or studentAnswer)" });
      }

      const client = getGeminiClient();
      const prompt = `
You are an expert university examiner.

Your task is to evaluate a student's answer sheet fairly and accurately.

Question:
${question}

Model Answer:
${modelAnswer}

Maximum Marks:
${maxMarks || 10}

Student Answer:
${studentAnswer}

Evaluation Rules:

1. Compare the student answer with the model answer.
2. Identify correct concepts.
3. Identify missing concepts.
4. Identify incorrect statements.
5. Award marks proportionally.
6. Do not give full marks unless all major points are present.
7. Be strict but fair.
8. Consider wording variations if the meaning is correct.
9. Calculate percentage.

Structure your evaluations precisely and output JSON as specified by the schema constraints.
`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              marksAwarded: {
                type: Type.NUMBER,
                description: "The marks awarded to the student based on correct and missing points, out of maximum marks."
              },
              maxMarks: {
                type: Type.NUMBER,
                description: "The maximum marks possible for this question."
              },
              percentage: {
                type: Type.NUMBER,
                description: "The calculated percentage, ranging from 0 to 100."
              },
              correctPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of correct concepts identified in the student's answer."
              },
              missingPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of missing concepts or incorrect statements found."
              },
              feedback: {
                type: Type.STRING,
                description: "A professional, constructive exam feedback block for the student detailing why the score was awarded."
              }
            },
            required: ["marksAwarded", "maxMarks", "percentage", "correctPoints", "missingPoints", "feedback"]
          }
        }
      });

      const text = response.text || "{}";
      res.json(JSON.parse(text));
    } catch (e: any) {
      console.error("Gemini evaluation server-side error:", e);
      res.status(500).json({ error: e.message || "Failed to grade student answer due to server-side error." });
    }
  });

  app.get("/api/attendance", (req, res) => {
    try {
      const logs = db.prepare("SELECT * FROM attendance").all();
      res.json(logs);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/attendance", (req, res) => {
    try {
      const records = req.body;
      if (!Array.isArray(records)) {
        return res.status(400).json({ error: "Body must be an array of records" });
      }

      const insertOrReplace = db.prepare(`
        INSERT OR REPLACE INTO attendance (attendance_id, student_id, lecture_id, attendance_date, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      db.transaction(() => {
        for (const record of records) {
          insertOrReplace.run(
            record.attendance_id,
            record.student_id,
            record.lecture_id,
            record.attendance_date,
            record.status,
            record.created_at
          );
        }
      })();

      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Serve static UI / single-page application fallback
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
