import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { 
  Dashboard, 
  Schedule, 
  Attendance, 
  NotesGen, 
  QuestionPaper, 
  Grading, 
  Announcements, 
  Settings 
} from './pages';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/notes" element={<NotesGen />} />
          <Route path="/questions" element={<QuestionPaper />} />
          <Route path="/grading" element={<Grading />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}
