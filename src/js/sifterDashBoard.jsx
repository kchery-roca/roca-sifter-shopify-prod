import React, { useState, useEffect, useRef, useCallback } from 'react';

const STATS_URL =
  document.getElementById('sifter-dashboard')?.dataset?.statsUrl ||
  'https://sifter-worker-local.kchery.workers.dev/';

const formatValue = (key, value) => {
  if (key === 'totalRevenue')
    return `$${parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (key === 'siftersPerOrder') return parseFloat(value).toFixed(2);
  return parseInt(value, 10).toLocaleString('en-US');
};

const CARD_CONFIG = [
  {
    key: 'totalOrders',
    label: 'Total Orders',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="tw-w-7 tw-h-7"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
    accent: '#0835DB',
    gradient: 'linear-gradient(135deg, #0835DB22 0%, #0835DB08 100%)',
  },
  {
    key: 'totalRevenue',
    label: 'Total Revenue',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="tw-w-7 tw-h-7"
      >
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    accent: '#10b981',
    gradient: 'linear-gradient(135deg, #10b98122 0%, #10b98108 100%)',
  },
  {
    key: 'totalSifters',
    label: 'Total Sifters',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="tw-w-7 tw-h-7"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    accent: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf622 0%, #8b5cf608 100%)',
  },
  {
    key: 'siftersPerOrder',
    label: 'Sifters / Order',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="tw-w-7 tw-h-7"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    accent: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b22 0%, #f59e0b08 100%)',
  },
];

const useCountUp = (target, duration = 1200) => {
  const [display, setDisplay] = useState(target);
  const prevRef = useRef(target);
  const rafRef = useRef(null);

  useEffect(() => {
    const start = prevRef.current;
    const end = parseFloat(target);
    if (isNaN(end) || start === end) {
      setDisplay(end);
      prevRef.current = end;
      return;
    }
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;
      setDisplay(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplay(end);
        prevRef.current = end;
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return display;
};

const StatCard = ({ config, rawValue, isLoading }) => {
  const numericTarget = isLoading ? 0 : parseFloat(rawValue) || 0;
  const animated = useCountUp(numericTarget);

  const formatAnimated = (key, val) => {
    if (key === 'totalRevenue')
      return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (key === 'siftersPerOrder') return val.toFixed(2);
    return Math.round(val).toLocaleString('en-US');
  };

  return (
    <div
      style={{
        background: config.gradient,
        border: `1px solid ${config.accent}33`,
        borderRadius: '16px',
        padding: '28px 24px',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = `0 12px 32px ${config.accent}22`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Decorative circle */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: `${config.accent}0f`,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            color: config.accent,
            background: `${config.accent}18`,
            borderRadius: '10px',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {config.icon}
        </div>
        <div
          style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: config.accent,
            background: `${config.accent}18`,
            borderRadius: '20px',
            padding: '4px 10px',
          }}
        >
          LIVE
        </div>
      </div>

      <div
        style={{
          fontSize: '13px',
          color: '#6b7280',
          fontWeight: 500,
          marginBottom: '6px',
          letterSpacing: '0.3px',
        }}
      >
        {config.label}
      </div>

      <div
        style={{
          fontSize: '30px',
          fontWeight: 700,
          color: '#111827',
          lineHeight: 1.1,
          letterSpacing: '-1px',
          fontVariantNumeric: 'tabular-nums',
          minHeight: '44px',
          transition: 'opacity 0.3s',
          opacity: isLoading ? 0.3 : 1,
        }}
      >
        {isLoading ? '—' : formatAnimated(config.key, animated)}
      </div>
    </div>
  );
};

const minutesAgo = (date) => {
  if (!date) return null;
  const diff = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diff === 0) return 'just now';
  if (diff === 1) return '1 minute ago';
  return `${diff} minutes ago`;
};

const SifterDashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);
  const [ticker, setTicker] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setIsSpinning(true);
    try {
      const res = await fetch(STATS_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setStats(data);
      setLastFetched(new Date());
    } catch (err) {
      setError(err.message || 'Failed to load stats');
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsSpinning(false), 600);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const pollId = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(pollId);
  }, [fetchStats]);

  // Tick the "minutes ago" label every 30s
  useEffect(() => {
    const id = setInterval(() => setTicker((t) => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '48px auto',
        padding: '0 20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '26px',
              fontWeight: 700,
              color: '#111827',
              margin: 0,
              letterSpacing: '-0.5px',
            }}
          >
            Sifter Analytics
          </h1>
          <p style={{ margin: '4px 0 0', color: '#9ca3af', fontSize: '14px' }}>
            {lastFetched ? `Last refreshed ${minutesAgo(lastFetched)}` : 'Loading data…'}
          </p>
        </div>

        <button
          onClick={fetchStats}
          disabled={isLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: isLoading ? '#e5e7eb' : '#0835DB',
            color: isLoading ? '#9ca3af' : '#fff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 600,
            fontSize: '14px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            letterSpacing: '0.3px',
            transition: 'background 0.2s, transform 0.15s',
          }}
          onMouseEnter={(e) => {
            if (!isLoading) e.currentTarget.style.background = '#0626b8';
          }}
          onMouseLeave={(e) => {
            if (!isLoading) e.currentTarget.style.background = '#0835DB';
          }}
          onMouseDown={(e) => {
            if (!isLoading) e.currentTarget.style.transform = 'scale(0.97)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              width: '16px',
              height: '16px',
              animation: isSpinning ? 'sifter-spin 0.6s linear' : 'none',
            }}
          >
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          {isLoading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            borderRadius: '12px',
            padding: '16px 20px',
            color: '#dc2626',
            marginBottom: '24px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: '18px', height: '18px', flexShrink: 0 }}
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      {/* Stat Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
        }}
      >
        {CARD_CONFIG.map((config) => (
          <StatCard
            key={config.key}
            config={config}
            rawValue={stats ? stats[config.key] : 0}
            isLoading={isLoading || !stats}
          />
        ))}
      </div>

      {/* Footer timestamp */}
      {lastFetched && (
        <p
          style={{
            marginTop: '24px',
            textAlign: 'right',
            fontSize: '12px',
            color: '#d1d5db',
            letterSpacing: '0.2px',
          }}
        >
          Data as of {lastFetched.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      )}

      <style>{`
        @keyframes sifter-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SifterDashboard;
