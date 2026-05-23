// hooks/useScore.ts
// PartSelector の選択状態からリアルタイムスコアを算出
import { useMemo } from 'react';
import { useKumikaeStore } from '../store/useKumikaeStore';

type ScoreResult = {
  microScore: number;      // ミクロ: 建材満足度スコア (0-10)
  macroScore: number;      // マクロ: 空間構成スコア (固定ベース + 加算)
  totalCost: number;       // 選択パーツの合計コスト（万円）
  gapType: 'overconfidence' | 'undervalue' | 'neutral';
  strategy: 'renovation' | 'sell' | 'hybrid';
  ctaVisible: boolean;     // CTA出現条件
};

// 係数（MVP後にログから動的調整予定 — 変数化済み）
const WEIGHTS = {
  floor: 0.35,
  wall:  0.35,
  ceiling: 0.15,
  furniture: 0.15,
};

const BASE_MACRO = 5.0; // 写真解析なしの基礎値

export function useScore(): ScoreResult {
  const selectedParts = useKumikaeStore((s) => s.selectedParts);
  const roomData = useKumikaeStore((s) => s.roomData);

  return useMemo(() => {
    // ミクロスコア: 選択パーツの加重平均
    let weightedSum = 0;
    let weightTotal = 0;
    let totalCost = 0;

    (Object.keys(WEIGHTS) as Array<keyof typeof WEIGHTS>).forEach((cat) => {
      const part = selectedParts[cat];
      if (part) {
        weightedSum += part.satisfaction_score * WEIGHTS[cat];
        weightTotal += WEIGHTS[cat];
        totalCost += part.cost_man_yen;
      }
    });

    const microScore = weightTotal > 0
      ? parseFloat((weightedSum / weightTotal).toFixed(1))
      : 0;

    // マクロスコア: 部屋面積から概算（MVP簡易ロジック）
    const areaBonus = roomData
      ? Math.min(2.0, (roomData.width * roomData.depth - 12) / 20)
      : 0;
    const macroScore = parseFloat(Math.min(10, BASE_MACRO + areaBonus).toFixed(1));

    // Gap分類
    const gap = microScore - macroScore;
    const gapType =
      gap > 1.0 ? 'overconfidence' :
      gap < -1.0 ? 'undervalue' : 'neutral';

    // 戦略判定
    const strategy =
      macroScore > 7 ? 'renovation' :
      macroScore < 5 ? 'sell' : 'hybrid';

    // CTA出現: 2部屋以上選択 + microScore ≥ 6
    const selectedCount = Object.values(selectedParts).filter(Boolean).length;
    const ctaVisible = selectedCount >= 2 && microScore >= 6;

    return { microScore, macroScore, totalCost, gapType, strategy, ctaVisible };
  }, [selectedParts, roomData]);
}