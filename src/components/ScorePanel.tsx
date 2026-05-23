import React, { useEffect, useRef, useState } from 'react';
import { useScore } from '../hooks/useScore';

const GAP_LABELS = {
  overconfidence: '理想先行型',
  undervalue:     '過小評価型',
  neutral:        'バランス型',
};

const STRATEGY_CONFIG = {
  renovation: { label: 'リノベ実行',       color: '#1e6b38', bg: '#e6f4ea' },
  sell:       { label: '売却 / 買替',      color: '#8a3c00', bg: '#fff0e6' },
  hybrid:     { label: 'ハイブリッド検討', color: '#7a5c00', bg: '#fef9e6' },
};

// 数値カウントアップフック
function useCountUp(target: number, duration = 600) {
  const [display, setDisplay] = useState(target);
  const prev = useRef(target);
  const raf = useRef<number>();

  useEffect(() => {
    const start = prev.current;
    const diff = target - start;
    if (diff === 0) return;

    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(parseFloat((start + diff * ease).toFixed(1)));
      if (progress < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        prev.current = target;
      }
    };

    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, duration]);

  return display;
}

export const ScorePanel: React.FC = () => {
  const { microScore, macroScore, totalCost, gapType, strategy, ctaVisible } = useScore();
  const strat = STRATEGY_CONFIG[strategy];

  return (
    <div style={{ position:'fixed', left:16, bottom:16, width:200, background:'rgba(255,255,255,0.94)', backdropFilter:'blur(10px)', borderRadius:14, padding:'14px 14px', boxShadow:'0 4px 28px rgba(0,0,0,0.13)', display:'flex', flexDirection:'column', gap:8, zIndex:100 }}>

      <div style={{ fontSize:10, fontWeight:700, color:'#6878a0', textTransform:'uppercase' as const, letterSpacing:'0.08em' }}>
        住居ステータス
      </div>

      <div style={{ display:'flex', gap:8 }}>
        <ScoreGauge label="満足度 HP" value={microScore} color="#2a4a8a" />
        <ScoreGauge label="空間評価" value={macroScore} color="#1e6b38" />
      </div>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:11 }}>
        <span style={{ color:'#8090b0' }}>累計コスト</span>
        <span style={{ fontWeight:700, color:'#1a2f5a', fontSize:13 }}>
          {totalCost > 0 ? `¥${totalCost}万` : '—'}
        </span>
      </div>

      <hr style={{ border:'none', borderTop:'1px solid #e8eef5', margin:'2px 0' }} />

      <div style={{ fontSize:11, color:'#3d5080', background:'#f0f4f9', borderRadius:6, padding:'4px 8px' }}>
        タイプ: <strong>{GAP_LABELS[gapType]}</strong>
      </div>

      <div style={{ fontSize:11, fontWeight:700, borderRadius:6, padding:'5px 8px', border:'1px solid rgba(0,0,0,0.06)', color: strat.color, background: strat.bg }}>
        推奨ルート：{strat.label}
      </div>

      {ctaVisible && (
        <button
          style={{ marginTop:2, padding:'9px 12px', background:'#1a2f5a', color:'#fff', border:'none', borderRadius:9, fontSize:12, fontWeight:700, cursor:'pointer', letterSpacing:'0.03em' }}
          onClick={() => alert('専門家への相談フォームへ遷移（実装予定）')}
        >
          専門家に相談する →
        </button>
      )}
    </div>
  );
};

const ScoreGauge: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => {
  const displayed = useCountUp(value, 600);

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', gap:3 }}>
      <div style={{ fontSize:9, color:'#8090b0', fontWeight:600 }}>{label}</div>
      <div style={{ display:'flex', alignItems:'baseline', gap:1 }}>
        <span style={{ fontSize:20, fontWeight:700, lineHeight:1, color, transition:'color 0.3s' }}>
          {displayed.toFixed(1)}
        </span>
        <span style={{ fontSize:10, color:'#b0bcd0' }}>/10</span>
      </div>
      <div style={{ height:4, background:'#e8eef5', borderRadius:2, overflow:'hidden' }}>
        <div style={{
          height:'100%', borderRadius:2,
          width:`${(value / 10) * 100}%`,
          background: color,
          transition:'width 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        }} />
      </div>
    </div>
  );
};
