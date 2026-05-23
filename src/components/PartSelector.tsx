import React, { useState } from 'react';
import { useKumikaeStore, PARTS_CATALOG, PartCategory } from '../store/useKumikaeStore';

const CATEGORY_LABELS: Record<PartCategory, string> = {
  floor: '床', wall: '壁', ceiling: '天井', furniture: '家具',
};
const CATEGORIES: PartCategory[] = ['floor', 'wall'];

const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  React.useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
};

export const PartSelector: React.FC = () => {
  const { selectedParts, setPart } = useKumikaeStore();
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<PartCategory>('floor');

  if (isMobile) {
    return (
      <>
        {/* ドロワートリガー */}
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          style={{
            position: 'fixed', bottom: 24, right: 16, zIndex: 200,
            background: '#1a2f5a', color: '#fff', border: 'none',
            borderRadius: 30, padding: '12px 20px', fontSize: 13,
            fontWeight: 700, boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            cursor: 'pointer',
          }}
        >
          {drawerOpen ? '✕ 閉じる' : '🪵 建材を選ぶ'}
        </button>

        {/* ドロワー本体 */}
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 150,
          background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)',
          borderRadius: '16px 16px 0 0',
          boxShadow: '0 -4px 24px rgba(0,0,0,0.15)',
          transform: drawerOpen ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
          maxHeight: '60vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        }}>
          {/* ハンドル */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 6px' }}>
            <div style={{ width: 36, height: 4, background: '#c5d3e8', borderRadius: 2 }} />
          </div>

          {/* カテゴリタブ */}
          <div style={{ display: 'flex', gap: 8, padding: '0 16px 10px' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                style={{
                  flex: 1, padding: '8px 0', borderRadius: 8, border: 'none',
                  fontWeight: 700, fontSize: 13, cursor: 'pointer',
                  background: activeCategory === cat ? '#1a2f5a' : '#f0f4f9',
                  color: activeCategory === cat ? '#fff' : '#6878a0',
                  transition: 'all 0.15s',
                }}>
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          {/* パーツリスト */}
          <div style={{ overflowY: 'auto', padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {PARTS_CATALOG.filter(p => p.category === activeCategory).map(part => {
              const isSelected = selectedParts[activeCategory]?.id === part.id;
              return (
                <button key={part.id} onClick={() => { setPart(activeCategory, part); setDrawerOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                    outline: isSelected ? '2px solid #1a2f5a' : '2px solid transparent',
                    background: isSelected ? '#eef3ff' : '#f8faff',
                    transition: 'all 0.15s',
                  }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: part.color, flexShrink: 0, border: '1px solid rgba(0,0,0,0.08)' }} />
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1a2f5a' }}>{part.name}</div>
                    <div style={{ fontSize: 11, color: '#8090b0' }}>¥{part.cost_man_yen}万 · 満足度 {part.satisfaction_score}/10</div>
                  </div>
                  {isSelected && <span style={{ color: '#1a2f5a', fontWeight: 700 }}>✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  // デスクトップ（既存UI）
  return (
    <div style={{ position: 'fixed', right: 16, top: '50%', transform: 'translateY(-50%)', width: 180, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '12px 10px', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column', gap: 14, zIndex: 100 }}>
      {CATEGORIES.map((category) => {
        const parts = PARTS_CATALOG.filter((p) => p.category === category);
        const selected = selectedParts[category];
        return (
          <div key={category}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#6878a0', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 6 }}>
              {CATEGORY_LABELS[category]}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {parts.map((part) => {
                const isSelected = selected?.id === part.id;
                return (
                  <button key={part.id} onClick={() => setPart(category, part)}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, padding: '6px 8px', borderRadius: 8, border: 'none', cursor: 'pointer', outline: isSelected ? '2px solid #2a4a8a' : '2px solid transparent', background: isSelected ? '#eef3ff' : '#fff', transition: 'all 0.15s' }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: part.color, border: '1px solid rgba(0,0,0,0.08)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#1a2f5a' }}>{part.name}</span>
                      <span style={{ fontSize: 10, color: '#8090b0' }}>¥{part.cost_man_yen}万</span>
                    </div>
                    <div style={{ width: '100%', height: 3, background: '#e8eef5', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 2, transition: 'width 0.3s', width: `${(part.satisfaction_score / 10) * 100}%`, background: isSelected ? '#2a4a8a' : '#b0bcd0' }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
