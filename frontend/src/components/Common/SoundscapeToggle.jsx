import React, { useState, useRef, useEffect } from 'react';
import { VolumeHigh, VolumeOff, Music } from '@mynaui/icons-react';

const SoundscapeToggle = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const oscNodesRef = useRef([]);

  const toggleSound = () => {
    if (isPlaying) {
      // Fade out
      if (masterGainRef.current && audioCtxRef.current) {
        masterGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.5);
        setTimeout(() => {
          oscNodesRef.current.forEach(osc => {
            try { osc.stop(); } catch {}
          });
          oscNodesRef.current = [];
          setIsPlaying(false);
        }, 500);
      } else {
        setIsPlaying(false);
      }
    } else {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
        masterGain.gain.setTargetAtTime(0.04, ctx.currentTime, 1.2); // Warm gentle volume
        masterGain.connect(ctx.destination);
        masterGainRef.current = masterGain;

        // Frequencies tuned to traditional Andalusian / Oud D minor harmonic meditation (D, A, F, C)
        const freqs = [146.83, 220.0, 261.63, 349.23, 440.0];
        const oscs = freqs.map((f, i) => {
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = 450 + i * 50;

          osc.type = i % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(f, ctx.currentTime);

          // Subtle harmonic detune for warm analog feel
          osc.detune.setValueAtTime((i - 2) * 4, ctx.currentTime);

          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.value = 0.15 + i * 0.05;
          lfoGain.gain.value = 2.5;
          lfo.connect(osc.frequency);
          lfo.start();

          osc.connect(filter);
          filter.connect(masterGain);
          osc.start();
          return osc;
        });

        oscNodesRef.current = oscs;
        setIsPlaying(true);
      } catch (err) {
        console.error('Soundscape error:', err);
      }
    }
  };

  useEffect(() => {
    return () => {
      oscNodesRef.current.forEach(osc => {
        try { osc.stop(); } catch {}
      });
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch {}
      }
    };
  }, []);

  return (
    <button
      onClick={toggleSound}
      title={isPlaying ? 'Mute Artisan Oud Ambience' : 'Listen to Artisan Oud Ambience'}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
        isPlaying
          ? 'bg-[#BA5B55] text-white shadow-xs'
          : 'bg-white/80 text-gray-700 hover:bg-white border border-gray-200/80 shadow-2xs'
      }`}
    >
      {isPlaying ? (
        <>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          <VolumeHigh size={13} />
          <span className="hidden lg:inline">Ambience Playing</span>
        </>
      ) : (
        <>
          <Music size={13} className="text-[#BA5B55]" />
          <span className="hidden lg:inline">Workshop Ambience</span>
        </>
      )}
    </button>
  );
};

export default SoundscapeToggle;
