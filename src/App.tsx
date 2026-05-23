import React from 'react'
import { ThreeCanvas } from './components/ThreeCanvas'
import { PartSelector } from './components/PartSelector'
import { RoomLoader } from './components/RoomLoader'
import { ScorePanel } from './components/ScorePanel'
import { DiagnosisPanel } from './components/DiagnosisPanel'

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#1a1e2a', position: 'relative' }}>
      <ThreeCanvas />
      <RoomLoader />
      <PartSelector />
      <ScorePanel />
      <DiagnosisPanel />
    </div>
  )
}