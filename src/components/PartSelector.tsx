import React from 'react';
import { useKumikaeStore } from '../store/useKumikaeStore';
import { PARTS_CATALOG, Part, PartCategory } from '../store/useKumikaeStore';

const CATEGORY_LABELS: Record<PartCategory, string> = {
  floor:'床', wall:'壁', ceiling:'天井', furniture:'家具',
};
const CATEGORIES: PartCategory[] = ['floor', 'wall'];

export const PartSelector: React.FC = () => {
  const { selectedParts, setPart } = useKumikaeStore();
  return (
    <div style={{position:'fixed',right:16,top:'50%',transform:'translateY(-50%)',width:180,background:'rgba(255,255,255,0.92)',backdropFilter:'blur(8px)',borderRadius:12,padding:'12px 10px',boxShadow:'0 4px 24px rgba(0,0,0,0.12)',display:'flex',flexDirection:'column',gap:14,zIndex:100}}>
      {CATEGORIES.map((category) => {
        const parts = PARTS_CATALOG.filter((p) => p.category === category);
        const selected = selectedParts[category];
        return (
          <div key={category}>
            <div style={{fontSize:10,fontWeight:700,color:'#6878a0',textTransform:'uppercase' as const,letterSpacing:'0.08em',marginBottom:6}}>
              {CATEGORY_LABELS[category]}
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:5}}>
              {parts.map((part) => {
                const isSelected = selected?.id === part.id;
                return (
                  <button key={part.id} onClick={() => setPart(category, part)}
                    style={{display:'flex',flexDirection:'column',alignItems:'flex-start',gap:4,padding:'6px 8px',borderRadius:8,border:'none',cursor:'pointer',outline:isSelected?'2px solid #2a4a8a':'2px solid transparent',background:isSelected?'#eef3ff':'#fff',transition:'all 0.15s'}}>
                    <div style={{width:28,height:28,borderRadius:6,background:part.color,border:'1px solid rgba(0,0,0,0.08)'}} />
                    <div style={{display:'flex',justifyContent:'space-between',width:'100%'}}>
                      <span style={{fontSize:11,fontWeight:600,color:'#1a2f5a'}}>{part.name}</span>
                      <span style={{fontSize:10,color:'#8090b0'}}>¥{part.cost_man_yen}万</span>
                    </div>
                    <div style={{width:'100%',height:3,background:'#e8eef5',borderRadius:2,overflow:'hidden'}}>
                      <div style={{height:'100%',borderRadius:2,transition:'width 0.3s',width:`${(part.satisfaction_score/10)*100}%`,background:isSelected?'#2a4a8a':'#b0bcd0'}} />
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