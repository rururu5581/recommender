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

  return `あなたは、日本トップクラスのキャリアエージェントです。提供された「候補者情報（職務経歴書・面談メモ）」と、もしあれば「募集ポジション情報」を元に、クライアント企業の採用担当者の心を掴み、「この人に会いたい」と思わせる最高の推薦文を作成してください。

# 推薦文の構成ルール
以下のひな型に厳密に従い、各項目を記述してください。
全体の文字数は600～800字程度で、簡潔かつ説得力のある文章を心がけてください。

---
**件名：【〇〇株式会社様】貴社の成長を加速させる[役職]候補、[氏名]様のご推薦**
- [役職]と[氏名]は、候補者情報から最も適切と思われるものを抽出して記載してください。氏名が不明な場合は「〇〇様」としてください。

**1. キャッチコピー（心を掴む一文）**
- 候補者の価値が最も伝わる、インパクトのある一行を作成してください。
- （例）「事業の成長痛」を即座に見抜き、組織と事業を次のステージへと導く「攻めと守りの経営参謀」をご紹介いたします。

**2. 候補者概要**
- 候補者情報から以下の項目を抽出し、簡潔にまとめてください。不明な項目は「不明」と記載してください。
- **氏名：** 〇〇 〇〇（ふりがな）様 ／ 〇〇歳
- **学歴：** 〇〇大学〇〇学部 卒業
- **現職：** 株式会社〇〇 ／ 役職
- **現年収：** 〇〇〇〇万円

**3. 推薦の核心（なぜ「今」「貴社に」推薦するのか）**
- 最も重要なパートです。エージェントとしての「見立て」を明確に伝えてください。
- 「募集ポジション情報」がある場合は、その企業の課題と候補者の強みがどう合致するかを結論から先に述べてください。
- 「募集ポジション情報」がない場合は、候補者の経験がどのような企業で価値を発揮できるかを汎用的に記述してください。
- （例）現在、IPO準備室を立ち上げ、管理部門の強化を急務とされている貴社にとって、〇〇様はまさに最適な人材であると確信しております。彼は、IPOをゼロから成功させた経験はもとより、急成長企業が直面する組織的な課題を「自分事」として捉え、ハンズオンで解決してきた稀有な実績をお持ちです。

**4. 具体的な実績（箇条書きとストーリーで語る）**
- 単なるスキルの羅列ではなく、具体的な数字やエピソードを交えて、候補者の提供価値を立体的に伝えてください。
- 最もインパクトのある実績は、短いストーリー仕立てで語ってください。
- （例）
    - **IPOおよびM&Aにおける卓越した実績：** 現職では、わずか2年でIPOを達成。主幹事証券との折衝から内部統制の構築まで、すべてを主導しました。
    - **急成長企業の組織課題を解決する実行力：** 前職の急成長期には、労務問題が頻発していました。〇〇様は、まず現場のヒアリングを徹底。その上で、勤怠システムの刷新と評価制度の再構築を断行し、離職率を15%から7%へと改善しました。

**5. 人物像（共に働きたいと思わせる魅力）**
- スキルや実績だけでなく、その人柄や仕事へのスタンスが伝わるように、具体的な言葉で記述してください。
- 第三者からの評価や、候補者の言葉を引用する形も有効です。
- （例）経営者としての高い視座を持ちながらも、決して現場を見下ろすことはありません。課題があれば自ら現場に飛び込み、若手社員の意見にも真摯に耳を傾ける誠実な姿勢は、社内の多くのメンバーから絶大な信頼を得ています。冷静な分析力と、目標達成への静かで熱い情熱を併せ持つリーダーです。

**6. 結び（行動を促す）**
- 改めて、この候補者が企業にもたらす価値を強調し、面談への期待感を高めて締めくくってください。
- （例）〇〇様が貴社に参画されれば、経営者の右腕として事業の更なる飛躍に大きく貢献できるものと、心から期待しております。ぜひ一度、直接お会いいただく機会をいただけますと幸いです。
---

# 候補者情報（職務経歴書・面談メモ）
${resume}
${positionInfoText}
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