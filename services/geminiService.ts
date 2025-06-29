import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY) {
  throw new Error("VITE_API_KEY is not defined in environment variables. Please set it in your Vercel project settings.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const buildPrompt = (resume: string, positionInfo: string): string => {
  const positionInfoText = positionInfo.trim()
    ? `
# 募集ポジション情報
${positionInfo}
`
    : `
# 募集ポジション情報
なし。候補者の経験がどのような企業で価値を発揮できるかを汎用的に記述してください。
`;

  return `あなたは、日本トップクラスのキャリアエージェントです。提供された「候補者情報（職務経歴書・面談メモ）」と、もしあれば「募集ポジション情報」を元に、クライアント企業の採用担当者の心を掴み、「この人に会いたい」と思わせる、コピー＆ペーストしてそのまま使える最高の推薦文を作成してください。

# 厳格な指示
- **絶対に、AIとしての前置きや挨拶（「はい、承知いたしました」など）、太字のセクションタイトル（例：「**人物像**」）、番号付きリスト（例：「1.」）は含めないでください。**
- 以下の「出力フォーマット例」に寸分たがわず従い、推薦文の本文のみを出力してください。
- 候補者情報から氏名、年齢、学歴、現職、年収などの情報が読み取れる場合は、その情報を記載してください。不明な場合は「〇〇様」「〇〇歳」「〇〇大学卒業」「株式会社〇〇」「〇〇〇〇万円」のようにダミー情報を補完してください。
- 出力例にある「（実績）」「（人物像）」のような括弧付きの見出しは、必要に応じて含めてください。

# 候補者情報（職務経歴書・面談メモ）
${resume}
${positionInfoText}

---
# 出力フォーマット例

CFO候補〇〇様をご推薦します！
管理部門の実務を深く理解し、IPO、M&A、組織改革を通じて企業価値向上を牽引してきた「実務家経営者」です。

〇〇太郎様（まるまるたろう）45歳
〇〇大学卒業
現職：（株）morich／管理部長
現年収：1000万円

〇〇様は、管理部門の実務を深く理解した上で、取締役CFOとして経営全般に関与し、企業価値向上に大きく貢献されてきました。特に、IPO・市場変更を成功させ、・・・・・・・・・

（実績）
・実務に根差した管理部門体制構築とIPO、市場変更の完遂
→ﾘｰﾏﾝｼｮｯｸ時には・・・・・・

（人物像）
・経営陣としての高い視座
→経営陣として高い視座を持ちつつも、管理部門の実務を深く理解しているため、現場の課題を素早く見抜き、地に足のついた解決策を実行できます。・・・・・・・

〇〇様は、実務で培った強固な管理部門基盤と、M&Aや組織改革で培った経営者としての視点・実行力を兼ね備えており、貴社の更なる成長・企業価値向上に大きく貢献できるポテンシャルを持っています。
`;
};

export const generateRecommendation = async (resume: string, positionInfo: string): Promise<string> => {
  const prompt = buildPrompt(resume, positionInfo);

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17',
      contents: prompt,
    });
    
    const responseText = response.text;
    if (typeof responseText !== 'string' || !responseText.trim()) {
      console.error("Invalid response from Gemini API:", response);
      throw new Error("AIから有効な応答がありませんでした。入力内容を変えて再度お試しください。");
    }
    
    let text = responseText.trim();
    // AIが応答をマークダウンブロックで囲むことがあるため、その場合は中身だけを取り出す
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = text.match(fenceRegex);
    if (match && match[2]) {
        text = match[2].trim();
    }
    return text;
  } catch (error) {
    console.error("Error generating recommendation from Gemini:", error);
    // Rethrow a user-friendly error to be caught by the UI component
    if (error instanceof Error && error.message.includes("AIから")) {
        throw error;
    }
    throw new Error("推薦文の生成中にエラーが発生しました。時間をおいて再度お試しください。");
  }
};