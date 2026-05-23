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
  const setFading = useKumikaeStore((s) => s.setFading);

  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);

  const handleLoad = async () => {
    setLoading(true);
    try {
      const res = await uploadPhotos('demo-user', [], true);
      setRooms(res.rooms);
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
    setFading(true);
    setTimeout(() => {
      setRoomData(toRoomDimensions(room));
      setActiveRoom(room.room_type);
      resetParts();
      setFading(false);
    }, 300);
  };

  return (
    <div style={{ position: 'fixed', left: 16, top: 16, zIndex: 100, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {rooms.length === 0 ? (
        <button onClick={handleLoad} disabled={loading}
          style={{ padding: '10px 20px', background: '#1a2f5a', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.04em', boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
          {loading ? '解析中...' : '🏠 空間を召喚'}
        </button>
      ) : (
        <div style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '10px', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', display: 'flex', flexDirection: 'column', gap: 5, minWidth: 180 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#6878a0', textTransform: 'uppercase' as const, letterSpacing: '0.08em', paddingLeft: 4, marginBottom: 2 }}>部屋を選択</div>
          {rooms.map((room) => (
            <button key={room.room_type} onClick={() => handleSelectRoom(room)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', borderRadius: 8, border: '1px solid #c5d3e8', cursor: 'pointer', fontSize: 12, transition: 'all 0.15s', background: activeRoom === room.room_type ? '#1a2f5a' : '#fff', color: activeRoom === room.room_type ? '#fff' : '#1a2f5a' }}>
              <span style={{ fontWeight: 600 }}>{ROOM_LABELS[room.room_type] ?? room.room_type}</span>
              <span style={{ fontSize: 10, opacity: 0.7 }}>{room.estimated_area}㎡</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
