import React from 'react';
import { ThreeCanvas } from './components/ThreeCanvas';
import { PartSelector } from './components/PartSelector';
import { RoomLoader } from './components/RoomLoader';
import { ScorePanel } from './components/ScorePanel';
import { DiagnosisPanel } from './components/DiagnosisPanel';
import { useKumikaeStore } from './store/useKumikaeStore';

export default function App() {
  const isFading = useKumikaeStore((s) => s.isFading);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#ede4d8', position: 'relative' }}>

      {/* 3D空間（フェードトランジション付き） */}
      <div style={{ position: 'absolute', inset: 0, opacity: isFading ? 0 : 1, transition: 'opacity 0.3s ease' }}>
        <ThreeCanvas />
      </div>

      {/* UIレイヤー */}
      <RoomLoader />
      <PartSelector />
      <ScorePanel />
      <DiagnosisPanel />
    </div>
  );
}
