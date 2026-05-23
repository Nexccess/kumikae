// components/ThreeCanvas.tsx — Zustand連携版
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrthographicCamera, OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useKumikaeStore } from '../store/useKumikaeStore';

// --- 個別メッシュ：Zustandからマテリアルを購読 ---

const Floor: React.FC<{ width: number; depth: number }> = ({ width, depth }) => {
  const floorPart = useKumikaeStore((s) => s.selectedParts.floor);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[width, depth]} />
      <meshStandardMaterial
        color={floorPart?.color ?? '#e8ddd0'}
        roughness={floorPart?.roughness ?? 0.8}
        metalness={floorPart?.metalness ?? 0.0}
      />
    </mesh>
  );
};

const BackWall: React.FC<{ width: number; depth: number; height: number }> = ({
  width,
  depth,
  height,
}) => {
  const wallPart = useKumikaeStore((s) => s.selectedParts.wall);

  return (
    <mesh position={[0, height / 2, -(depth / 2)]} receiveShadow>
      <boxGeometry args={[width, height, 0.08]} />
      <meshStandardMaterial
        color={wallPart?.color ?? '#f5f2ee'}
        roughness={wallPart?.roughness ?? 0.9}
        metalness={wallPart?.metalness ?? 0.0}
      />
    </mesh>
  );
};

const LeftWall: React.FC<{ width: number; depth: number; height: number }> = ({
  width,
  depth,
  height,
}) => {
  const wallPart = useKumikaeStore((s) => s.selectedParts.wall);

  return (
    <mesh position={[-(width / 2), height / 2, 0]} receiveShadow>
      <boxGeometry args={[0.08, height, depth]} />
      <meshStandardMaterial
        color={wallPart ? shadeColor(wallPart.color, -8) : '#ede9e3'}
        roughness={wallPart?.roughness ?? 0.9}
        metalness={wallPart?.metalness ?? 0.0}
      />
    </mesh>
  );
};

// 左壁に僅かな陰影差をつけるためのカラーシェーダー
function shadeColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + percent));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + percent));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + percent));
  return `rgb(${r},${g},${b})`;
}

// --- メインキャンバス ---

export const ThreeCanvas: React.FC = () => {
  const roomData = useKumikaeStore((s) => s.roomData);
  const { width = 4, depth = 6, height = 2.4 } = roomData ?? {};
  const camDist = Math.max(width, depth) * 2.2;

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas shadows>
        <OrthographicCamera
          makeDefault
          position={[camDist, camDist * 0.8, camDist]}
          zoom={55}
          near={0.1}
          far={300}
        />
        <OrbitControls
          enableRotate={false}
          enablePan={true}
          enableZoom={true}
          zoomSpeed={0.5}
        />

        <ambientLight intensity={0.55} />
        <directionalLight
          position={[10, 14, 8]}
          intensity={1.1}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <Environment preset="apartment" />

        <Floor width={width} depth={depth} />
        <BackWall width={width} depth={depth} height={height} />
        <LeftWall width={width} depth={depth} height={height} />
      </Canvas>
    </div>
  );
};