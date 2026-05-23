// components/RoomLoader.tsx
// 写真アップロード → APIコール → Zustand更新 → ThreeCanvas自動変形
import React, { useState } from 'react';
import { useKumikaeStore } from '../store/useKumikaeStore';
import { uploadPhotos, toRoomDimensions, RoomApiResponse } from '../api/roomApi';

type RoomItem = RoomApiResponse['rooms'][0];

const ROOM_LABELS: Record<string, string> = {
  living_dining: 'リビング・ダイニング',
  bedroom: 'ベッドルーム',
  kitchen: 'キッチン',
};

export const RoomLoader: React.FC = () => {
  const setRoomData = useKumikaeStore((s) => s.setRoomData);
  const resetParts = useKumikaeStore((s) => s.resetParts);

  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);

  const handleLoad = async () => {
    setLoading(true);
    try {
      const res = await uploadPhotos('demo-user', [], true); // モック使用
      setRooms(res.rooms);
      // 最初の部屋を自動選択
      const first = res.rooms[0];
      if (first) {
        setRoomData(toRoomDimensions(first));
        setActiveRoom(first.room_type);
        resetParts();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRoom = (room: RoomItem) => {
    setRoomData(toRoomDimensions(room));
    setActiveRoom(room.room_type);
    resetParts(); // 部屋切替時にパーツ選択をリセット
  };

  return (
    <div style={styles.container}>
      {rooms.length === 0 ? (
        <button onClick={handleLoad} disabled={loading} style={styles.loadBtn}>
          {loading ? '解析中...' : '🏠 空間を召喚'}
        </button>
      ) : (
        <div style={styles.roomList}>
          <div style={styles.label}>部屋を選択</div>
          {rooms.map((room) => (
            <button
              key={room.room_type}
              onClick={() => handleSelectRoom(room)}
              style={{
                ...styles.roomBtn,
                background: activeRoom === room.room_type ? '#1a2f5a' : '#fff',
                color: activeRoom === room.room_type ? '#fff' : '#1a2f5a',
              }}
            >
              <span style={styles.roomName}>
                {ROOM_LABELS[room.room_type] ?? room.room_type}
              </span>
              <span style={styles.roomArea}>{room.estimated_area}㎡</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    left: 16,
    top: 16,
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  loadBtn: {
    padding: '10px 20px',
    background: '#1a2f5a',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: '0.04em',
  },
  roomList: {
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(8px)',
    borderRadius: 12,
    padding: '10px 10px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    minWidth: 180,
  },
  label: {
    fontSize: 10,
    fontWeight: 700,
    color: '#6878a0',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    paddingLeft: 4,
    marginBottom: 2,
  },
  roomBtn: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '7px 10px',
    borderRadius: 8,
    border: '1px solid #c5d3e8',
    cursor: 'pointer',
    fontSize: 12,
    transition: 'all 0.15s',
  },
  roomName: { fontWeight: 600 },
  roomArea: { fontSize: 10, opacity: 0.7 },
};