// src/components/DiagnosisPanel.tsx
import React, { useState } from 'react';
import { useKumikaeStore } from '../store/useKumikaeStore';
import { useScore } from '../hooks/useScore';
import { fetchDiagnosis, DiagnosisResult } from '../api/diagnosisApi';
import { logToSheets } from '../api/sheetsApi';

export const DiagnosisPanel: React.FC = () => {
  const selectedParts = useKumikaeStore((s) => s.selectedParts);
  const { microScore, macroScore, gapType, strategy, totalCost, ctaVisible } = useScore();
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(false);

  if (!ctaVisible) return null;

  const handleDiagnosis = async () => {
    setLoading(true);
    try {
      const parts = Object.entries(selectedParts)
        .filter(([, p]) => p)
        .map(([cat, p]) => ({
          category: cat,
          name: p!.name,
          satisfaction_score: p!.satisfaction_score,
        }));

      const res = await fetchDiagnosis({
        microScore, macroScore, gapType, strategy, totalCost,
        selectedParts: parts,
      });
      setResult(res);
      await logToSheets({
        user_id: 'demo-user',
        micro_score: microScore,
        macro_score: macroScore,
        gap_type: gapType,
        strategy: strategy,
        total_cost: totalCost,
        selected_parts: parts.map(p => p.name).join('、'),
        diagnosis_feature: res.feature,
        diagnosis_judgment: res.judgment,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{position:'fixed',bottom:16,left:'50%',transform:'translateX(-50%)',width:420,maxWidth:'90vw',background:'rgba(255,255,255,0.96)',backdropFilter:'blur(12px)',borderRadius:14,padding:'16px 18px',boxShadow:'0 8px 32px rgba(0,0,0,0.18)',zIndex:200}}>
      {!result ? (
        <button onClick={handleDiagnosis} disabled={loading}
          style={{width:'100%',padding:'11px 0',background:'#1a2f5a',color:'#fff',border:'none',borderRadius:9,fontSize:13,fontWeight:700,cursor:loading?'wait':'pointer',letterSpacing:'0.04em'}}>
          {loading ? 'AI診断中...' : '🏠 AI住宅診断を実行する'}
        </button>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          <div style={{fontSize:10,fontWeight:700,color:'#6878a0',textTransform:'uppercase',letterSpacing:'0.08em'}}>AI診断結果</div>
          <div style={{background:'#f0f4f9',borderRadius:8,padding:'10px 12px'}}>
            <div style={{fontSize:10,color:'#8090b0',fontWeight:600,marginBottom:3}}>特徴</div>
            <div style={{fontSize:12,color:'#1a2f5a'}}>{result.feature}</div>
          </div>
          <div style={{background:'#f0f4f9',borderRadius:8,padding:'10px 12px'}}>
            <div style={{fontSize:10,color:'#8090b0',fontWeight:600,marginBottom:3}}>分析</div>
            <div style={{fontSize:12,color:'#1a2f5a'}}>{result.analysis}</div>
          </div>
          <div style={{background:'#1a2f5a',borderRadius:8,padding:'10px 12px'}}>
            <div style={{fontSize:10,color:'#a0b8d8',fontWeight:600,marginBottom:3}}>判断</div>
            <div style={{fontSize:12,color:'#fff',fontWeight:600}}>{result.judgment}</div>
          </div>
          <button onClick={() => setResult(null)}
            style={{fontSize:11,color:'#8090b0',background:'none',border:'none',cursor:'pointer',textAlign:'right'}}>
            再診断する
          </button>
        </div>
      )}
    </div>
  );
};