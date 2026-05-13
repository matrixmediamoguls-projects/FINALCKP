import React, { useCallback, useEffect, useState } from 'react';

const FX_TTL = 1180;

export function useFXController() {
  const [events, setEvents] = useState([]);

  const triggerFX = useCallback((type, payload = {}) => {
    const event = {
      id: `${type}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      type,
      payload,
      createdAt: Date.now(),
    };

    setEvents((previous) => [...previous.slice(-7), event]);
    window.setTimeout(() => {
      setEvents((previous) => previous.filter((item) => item.id !== event.id));
    }, FX_TTL);
  }, []);

  return { events, triggerFX };
}

export default function FXController({ events = [], audio, color = '#ff5a34' }) {
  const latest = events[events.length - 1];
  const energy = audio?.energy || audio?.averageVolume || 0;

  useEffect(() => {
    if (!latest) return;
    document.documentElement.style.setProperty('--latest-fx', latest.type);
  }, [latest]);

  return (
    <div
      className="fx-controller"
      aria-hidden="true"
      style={{
        '--fx-color': color,
        '--fx-energy': energy,
      }}
    >
      <div className="fx-energy-field" />
      {events.map((event) => (
        <span
          key={event.id}
          className={`fx-event fx-${event.type}`}
          style={{ '--fx-seed': Math.max(0.35, energy) }}
        />
      ))}
    </div>
  );
}
