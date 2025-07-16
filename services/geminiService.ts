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
- 以下の「出力フォーマット例」に寸分たがわず従い、推薦文の本文のみを出力してください。文章は人間らしく、自然な日本語で書いてください。
- 文章は、クライアント企業の採用担当者が「この人に会いたい」と思うような内容にしてください。
- 文字数は、300文字以上800文字以内を目安にしてください。
- 文章は、ダラダラと長くせず、要点を絞って簡潔にまとめてください。特に実績はひと言でまとめ、補足も短めにしてください。
- 文章の内容は、候補者の実績や人物像を具体的に記述し、クライアント企業の採用担当者が候補者に会いたいと思うような内容にしてください。
- 文章のトーンは、クライアント企業の採用担当者が「この人に会いたい」と思うような、前向きで魅力的なものにしてください。
- 候補者情報から氏名、年齢、学歴、現職、年収などの情報が読み取れる場合は、その情報を記載してください。不明な場合は「〇〇様」「〇〇歳」「〇〇大学卒業」「株式会社〇〇」「〇〇〇〇万円」のようにダミー情報を補完してください。
- 出力例にある「（実績）」「（人物像）」のような括弧付きの見出しは、必要に応じて含めてください。
- 出力例の「略歴」「スキル（文章ではなくKeyWordで抽出」「推薦ポイント」は必須。名前の前の前文「○○候補として推薦します」なども短めに必ず書いて。自然な日本語でお願い。

# 候補者情報（職務経歴書・面談メモ）
${resume}
${positionInfoText}

---
# 出力フォーマット例

CFO候補としてご推薦します！
管理部門の実務に精通し、これまでIPOやM&A、組織改革を通じて企業価値の向上を力強く牽引してこられた方です。
経営の現場を深く理解し、自ら手を動かしながら成長を支えてこられた実践的なリーダーです。

◆〇〇太郎様（まるまるたろう）／45歳
（〇〇大学〇〇学部卒業）
現職：（株）morich／管理部長
現年収：1000万円
希望年収：1200万円

【略歴】
大手監査法人で公認会計士としてキャリアをスタートし、上場企業の経理・財務責任者を経て、現在は成長ベンチャーのCFO。IPO準備から資金調達、M&Aまで幅広い実績を有し、内部統制・組織体制の構築にも注力。企業価値向上にコミットする実行力が強み。・・・・・・・・・

【実績】
・実務に根差した管理部門体制構築とIPO、市場変更の完遂
→ﾘｰﾏﾝｼｮｯｸ時には・・・・・・

【スキル】
・公認会計士
・IPO準備
・M&A
・組織改革
・内部統制構築
・資金調達

【キャラクター】
・経営陣としての高い視座
→経営陣として高い視座を持ちつつも、管理部門の実務を深く理解しているため、現場の課題を素早く見抜き、地に足のついた解決策を実行できます。・・・・・・・

【推薦ポイント】
・管理部門の実務に精通し、経営者としての視点を持つ
・IPOやM&A、組織改革の経験が豊富
・実行力があり、企業価値向上に貢献できる

【転職理由】
・現職ではIPOを達成したものの、さらなる成長を目指す企業で自らの経験を活かしたいと考え、転職を決意されました。特に、成長フェーズにある企業でのCFOとしての挑戦を希望されています。
`;
};

export const generateRecommendation = async (resume: string, positionInfo: string): Promise<string> => {
  const prompt = buildPrompt(resume, positionInfo);

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite-preview-06-17',
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
