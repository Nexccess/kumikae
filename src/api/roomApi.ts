// api/roomApi.ts
// POST /upload-photos のクライアント
// 本番: FastAPI / Vercel Serverless に差し替え

export type RoomApiResponse = {
  rooms: {
    room_type: string;
    estimated_area: number;
    width_m: number;
    depth_m: number;
    ceiling_h_m: number;
    layout: string;
  }[];
};

// --- モックデータ（Gemini Vision出力を想定） ---
const MOCK_ROOMS: RoomApiResponse['rooms'] = [
  { room_type: 'living_dining', estimated_area: 25, width_m: 4.5, depth_m: 5.5, ceiling_h_m: 2.4, layout: 'template_A' },
  { room_type: 'bedroom',       estimated_area: 12, width_m: 3.0, depth_m: 4.0, ceiling_h_m: 2.4, layout: 'template_B' },
  { room_type: 'kitchen',       estimated_area: 10, width_m: 2.5, depth_m: 4.0, ceiling_h_m: 2.2, layout: 'template_C' },
];

// --- APIクライアント ---
export async function uploadPhotos(
  userId: string,
  photos: { url: string; room_type: string }[],
  useMock = true  // MVP中はtrueで固定
): Promise<RoomApiResponse> {
  if (useMock) {
    // モック: 300ms遅延でリアリティを演出
    await new Promise((r) => setTimeout(r, 300));
    return { rooms: MOCK_ROOMS };
  }

  // 本番実装（FastAPI / Vercel Serverless）
  const res = await fetch('/api/upload-photos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, photos }),
  });
  if (!res.ok) throw new Error(`upload-photos failed: ${res.status}`);
  return res.json();
}

// --- ルームデータをThreeCanvas形式に変換 ---
export function toRoomDimensions(room: RoomApiResponse['rooms'][0]) {
  return {
    width:  room.width_m,
    depth:  room.depth_m,
    height: room.ceiling_h_m,
  };
}