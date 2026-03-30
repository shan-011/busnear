import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ScheduleTable({ routes }) {
  const navigate = useNavigate();

  const handleRowClick = (routeNo) => {
    navigate(`/map?route=${routeNo}`);
  };

  const thStyle = {
    padding: '12px 16px',
    textAlign: 'left',
    color: '#a0aec0',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid rgba(255,255,255,0.1)'
  };

  const tdStyle = {
    padding: '12px 16px',
    color: '#fff',
    fontSize: '14px',
    borderBottom: '1px solid rgba(255,255,255,0.08)'
  };

  const timingStyle = {
    display: 'inline-block',
    marginRight: '8px',
    marginBottom: '4px',
    padding: '4px 8px',
    borderRadius: '6px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.08)',
    fontSize: '11px',
    color: '#a0aec0'
  };

  return (
    <div style={{
      overflowX: 'auto',
      background: 'rgba(255,255,255,0.04)',
      borderRadius: '16px',
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>Route</th>
            <th style={thStyle}>From</th>
            <th style={thStyle}>To</th>
            <th style={thStyle}>Type</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Next Departures</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <tr
              key={route.route_no}
              onClick={() => handleRowClick(route.route_no)}
              style={{ cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <td style={{ ...tdStyle, fontWeight: '700', color: '#e94560' }}>{route.route_no}</td>
              <td style={tdStyle}>{route.from}</td>
              <td style={tdStyle}>{route.to}</td>
              <td style={tdStyle}>
                <span style={{
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: route.type === 'A/C' ? 'rgba(66,153,225,0.2)' : 'rgba(237,137,54,0.2)',
                  color: route.type === 'A/C' ? '#63b3ed' : '#f6ad55',
                  border: `1px solid ${route.type === 'A/C' ? 'rgba(66,153,225,0.3)' : 'rgba(237,137,54,0.3)'}`
                }}>
                  {route.type}
                </span>
              </td>
              <td style={tdStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: '#4ade80', boxShadow: '0 0 8px #4ade80',
                    animation: 'pulse 1.5s infinite'
                  }} />
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#4ade80', textTransform: 'uppercase' }}>Live</span>
                </div>
              </td>
              <td style={tdStyle}>
                {route.timings_array?.slice(0, 3).map((t) => (
                  <span key={t} style={timingStyle}>{t}</span>
                ))}
                {route.timings_array?.length > 3 && <span style={{ fontSize: '11px', color: '#a0aec0' }}>+ more</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}