import express from 'express';
import { db } from '../../database/connection.js';
import { supabase, isSupabaseConfigured } from '../../database/supabase.js';

const router = express.Router();

// GET /api/university
router.get('/', async (req, res) => {
  try {
    if (isSupabaseConfigured()) {
      const { data: courses, error } = await supabase
        .from('courses')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      return res.json({ courses });
    }

    // Fallback SQLite
    const courses = db.prepare('SELECT * FROM courses ORDER BY id ASC').all();
    res.json({ courses });
  } catch (err) {
    console.error('University courses error:', err);
    res.status(500).json({ error: 'Failed to fetch courses.' });
  }
});

// POST /api/university/enroll
router.post('/enroll', async (req, res) => {
  try {
    const { course_id, student_name, student_email } = req.body;
    if (!course_id || !student_name || !student_email) {
      return res.status(400).json({ error: 'Course ID, student name, and email are required.' });
    }

    if (isSupabaseConfigured()) {
      const { data: course, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', course_id)
        .single();

      if (error || !course) {
        return res.status(404).json({ error: 'Course not found.' });
      }

      await supabase
        .from('courses')
        .update({ students_count: (course.students_count || 0) + 1 })
        .eq('id', course_id);

      return res.status(200).json({
        message: `Enrolled successfully in ${course.title}! Check your email for syllabus and access credentials.`,
        course_id,
        student_name
      });
    }

    // Fallback SQLite
    const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(course_id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    db.prepare('UPDATE courses SET students_count = students_count + 1 WHERE id = ?').run(course_id);

    res.status(200).json({
      message: `Enrolled successfully in ${course.title}! Check your email for syllabus and access credentials.`,
      course_id,
      student_name
    });
  } catch (err) {
    console.error('Enroll error:', err);
    res.status(500).json({ error: 'Failed to enroll in course.' });
  }
});

export default router;
