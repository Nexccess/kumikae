// components/ScorePanel.tsx
import React from 'react';
import { useScore } from '../hooks/useScore';

const GAP_LABELS = {
  overconfidence: '理想先行型',
  undervalue:     '過小評価型',
  neutral:        'バランス型',
};

const STRATEGY_CONFIG = {
  renovation: { label: 'リノベ実行', color: '#1e6b38', bg: '#e6f4ea' },
  sell:       { label: '売却 / 買替', color: '#8a3c00', bg: '#fff0e6' },
  hybrid:     { label: 'ハイブリッド検討', color: '#7a5c00', bg: '#fef9e6' },
};

export const ScorePanel: React.FC = () => {
  const { microScore, macroScore, totalCost, gapType, strategy, ctaVisible } = useScore();
  const strat = STRATEGY_CONFIG[strategy];

  return (
    <div style={styles.container}>

      {/* ヘッダー */}
      <div style={styles.header}>住居ステータス</div>

      {/* ミクロ / マクロ スコア */}
      <div style={styles.scoreRow}>
        <ScoreGauge label="満足度 HP" value={microScore} color="#2a4a8a" />
        <ScoreGauge label="空間評価" value={macroScore} color="#1e6b38" />
      </div>

      {/* コスト */}
      <div style={styles.costRow}>
        <span style={styles.costLabel}>累計コスト</span>
        <span style={styles.costValue}>
          {totalCost > 0 ? `¥${totalCost}万` : '—'}
        </span>
      </div>

      <hr style={styles.divider} />

      {/* Gap分類 */}
      <div style={styles.gapBadge}>
        タイプ: <strong>{GAP_LABELS[gapType]}</strong>
      </div>

      {/* 戦略ラベル */}
      <div style={{ ...styles.stratBadge, color: strat.color, background: strat.bg }}>
        推奨ルート：{strat.label}
      </div>

      {/* CTA（条件達成時に出現） */}
      {ctaVisible && (
        <button
          style={styles.ctaBtn}
          onClick={() => alert('専門家への相談フォームへ遷移（実装予定）')}
        >
          専門家に相談する →
        </button>
      )}
    </div>
  );
};

// --- ゲージサブコンポーネント ---
const ScoreGauge: React.FC<{ label: string; value: number; color: string }> = ({
  label,
  value,
  color,
}) => (
  <div style={gStyles.wrap}>
    <div style={gStyles.label}>{label}</div>
    <div style={gStyles.numRow}>
      <span style={{ ...gStyles.num, color }}>{value.toFixed(1)}</span>
      <span style={gStyles.denom}>/10</span>
    </div>
    <div style={gStyles.track}>
      <div
        style={{
          ...gStyles.fill,
          width: `${(value / 10) * 100}%`,
          background: color,
          opacity: value === 0 ? 0.2 : 1,
        }}
      />
    </div>
  </div>
);

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    left: 16,
    bottom: 16,
    width: 200,
    background: 'rgba(255,255,255,0.94)',
    backdropFilter: 'blur(10px)',
    borderRadius: 14,
    padding: '14px 14px',
    boxShadow: '0 4px 28px rgba(0,0,0,0.13)',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    zIndex: 100,
  },
  header: {
    fontSize: 10,
    fontWeight: 700,
    color: '#6878a0',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
  },
  scoreRow: {
    display: 'flex',
    gap: 8,
  },
  costRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 11,
  },
  costLabel: { color: '#8090b0' },
  costValue: { fontWeight: 700, color: '#1a2f5a', fontSize: 13 },
  divider: {
    border: 'none',
    borderTop: '1px solid #e8eef5',
    margin: '2px 0',
  },
  gapBadge: {
    fontSize: 11,
    color: '#3d5080',
    background: '#f0f4f9',
    borderRadius: 6,
    padding: '4px 8px',
  },
  stratBadge: {
    fontSize: 11,
    fontWeight: 700,
    borderRadius: 6,
    padding: '5px 8px',
    border: '1px solid rgba(0,0,0,0.06)',
  },
  ctaBtn: {
    marginTop: 2,
    padding: '9px 12px',
    background: '#1a2f5a',
    color: '#fff',
    border: 'none',
    borderRadius: 9,
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: '0.03em',
    transition: 'opacity 0.15s',
  },
};

const gStyles: Record<string, React.CSSProperties> = {
  wrap: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  label: { fontSize: 9, color: '#8090b0', fontWeight: 600 },
  numRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 1,
  },
  num: { fontSize: 20, fontWeight: 700, lineHeight: 1 },
  denom: { fontSize: 10, color: '#b0bcd0' },
  track: {
    height: 4,
    background: '#e8eef5',
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
    transition: 'width 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
  },
};