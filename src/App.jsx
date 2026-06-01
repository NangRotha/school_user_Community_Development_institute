// frontend-user/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Gallery from './pages/Gallery';
import Teachers from './pages/Teachers';
import Students from './pages/Students';
import Results from './pages/Results';
import Register from './pages/Register';
import Contact from './pages/Contact';

function App() {
  return (
    <LanguageProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="courses" element={<Courses />} />
            <Route path="news" element={<News />} />
            <Route path="news/:id" element={<NewsDetail />} />
            <Route path="events" element={<Events />} />
            <Route path="events/:id" element={<EventDetail />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="students" element={<Students />} />
            <Route path="results" element={<Results />} />
            <Route path="register" element={<Register />} />
            <Route path="contact" element={<Contact />} />
          </Route>
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;