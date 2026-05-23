export type DiagnosisInput = {
  microScore: number;
  macroScore: number;
  gapType: string;
  strategy: string;
  totalCost: number;
  selectedParts: { category: string; name: string; satisfaction_score: number }[];
};

export type DiagnosisResult = {
  feature: string;
  analysis: string;
  judgment: string;
};

export async function fetchDiagnosis(input: DiagnosisInput): Promise<DiagnosisResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const prompt = `あなたは住宅診断の専門家です。以下の情報を基に分析し、必ず下記のJSONフォーマットのみで返答してください。前置き・説明文・コードブロック記号は一切不要です。

入力情報:
満足度スコア: ${input.microScore}/10
空間評価スコア: ${input.macroScore}/10
スコア傾向: ${input.gapType}
推奨戦略: ${input.strategy}
累計コスト: ${input.totalCost}万円
選択建材: ${input.selectedParts.map(p => `${p.name}(${p.category})`).join('、')}

返答フォーマット（このJSONのみ。他の文字列は禁止）:
{"feature":"ユーザーの価値観を1文で","analysis":"判断根拠を2文で","judgment":"投資視点と生活視点の違いを踏まえた最終判断を1文で"}`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 400 },
        }),
      }
    );

    const data = await res.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    // バッククォート・改行・制御文字を除去してJSONを抽出
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('JSON not found');

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      feature:  parsed.feature  ?? '解析できませんでした',
      analysis: parsed.analysis ?? raw,
      judgment: parsed.judgment ?? '再試行してください',
    };
  } catch (e) {
    return {
      feature:  'エラーが発生しました',
      analysis: String(e),
      judgment: 'APIキーまたはネットワークを確認してください',
    };
  }
}