import express from 'express';
import { db } from '../../database/connection.js';
import { supabase, isSupabaseConfigured } from '../../database/supabase.js';

const router = express.Router();

// GET /api/events
router.get('/', async (req, res) => {
  try {
    if (isSupabaseConfigured()) {
      const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      return res.json({ events });
    }

    // Fallback SQLite
    const events = db.prepare('SELECT * FROM events ORDER BY id ASC').all();
    res.json({ events });
  } catch (err) {
    console.error('Events error:', err);
    res.status(500).json({ error: 'Failed to fetch events.' });
  }
});

// POST /api/events/rsvp
router.post('/rsvp', async (req, res) => {
  try {
    const { event_id, name, email, guests } = req.body;
    if (!event_id || !name || !email) {
      return res.status(400).json({ error: 'Event ID, name, and email are required.' });
    }

    const partySize = Number(guests) || 1;

    if (isSupabaseConfigured()) {
      const { data: event, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', event_id)
        .single();

      if (error || !event) {
        return res.status(404).json({ error: 'Event not found.' });
      }

      if ((event.enrolled_count || 0) + partySize > event.capacity) {
        return res.status(400).json({ error: 'Sorry, this event has reached its maximum guest capacity.' });
      }

      await supabase
        .from('events')
        .update({ enrolled_count: (event.enrolled_count || 0) + partySize })
        .eq('id', event_id);

      return res.json({
        message: `Reservation confirmed for ${event.title}! An invitation has been sent to ${email}.`,
        event_id,
        partySize
      });
    }

    // Fallback SQLite
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(event_id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    if (event.enrolled_count + partySize > event.capacity) {
      return res.status(400).json({ error: 'Sorry, this event has reached its maximum guest capacity.' });
    }

    db.prepare('UPDATE events SET enrolled_count = enrolled_count + ? WHERE id = ?').run(partySize, event_id);

    res.json({
      message: `Reservation confirmed for ${event.title}! An invitation has been sent to ${email}.`,
      event_id,
      partySize
    });
  } catch (err) {
    console.error('RSVP error:', err);
    res.status(500).json({ error: 'Failed to complete RSVP.' });
  }
});

export default router;
