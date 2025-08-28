import React from 'react';

interface InputSectionProps {
  resume: string;
  setResume: (value: string) => void;
  positionInfo: string;
  setPositionInfo: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({
  resume,
  setResume,
  positionInfo,
  setPositionInfo,
  onGenerate,
  isLoading,
}) => {
  // クリアボタンのハンドラー
  const handleClearResume = () => {
    setResume('');
  };

  const handleClearPositionInfo = () => {
    setPositionInfo('');
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex-1 flex flex-col">
        <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
          職務経歴書 または 面談メモ
        </label>
        <textarea
          id="resume"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          disabled={isLoading}
          className="w-full flex-grow p-3 border border-gray-300 rounded-md shadow-sm focus:ring-[#FF0000] focus:border-[#FF0000] transition-shadow resize-none disabled:bg-gray-100"
          placeholder="ここに職務経歴書や面談メモのテキストを貼り付けてください。PDFの内容をコピー＆ペーストすることも可能です。"
        />
        {/* クリアボタンの追加 - 職務経歴書 */}
        <button
          onClick={handleClearResume}
          disabled={isLoading || !resume} // resumeが空の場合は無効にする
          className="mt-2 ml-auto py-1 px-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          クリア
        </button>
      </div>
      <div className="flex-1 flex flex-col">
        <label htmlFor="position-info" className="block text-sm font-medium text-gray-700 mb-1">
          募集ポジション情報（任意）
        </label>
        <textarea
          id="position-info"
          value={positionInfo}
          onChange={(e) => setPositionInfo(e.target.value)}
          disabled={isLoading}
          className="w-full flex-grow p-3 border border-gray-300 rounded-md shadow-sm focus:ring-[#FF0000] focus:border-[#FF0000] transition-shadow resize-none disabled:bg-gray-100"
          placeholder="推薦先のポジション情報を貼り付けてください（求人票のテキスト、Web URLなど）。空欄の場合は、汎用的な推薦文を生成します。"
        />
        {/* クリアボタンの追加 - 募集ポジション情報 */}
        <button
          onClick={handleClearPositionInfo}
          disabled={isLoading || !positionInfo} // positionInfoが空の場合は無効にする
          className="mt-2 ml-auto py-1 px-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          クリア
        </button>
      </div>
      <div>
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full bg-[#FF0000] text-white font-bold py-3 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? '生成中...' : '推薦文を生成する'}
        </button>
      </div>
    </div>
  );
};

export default InputSection;
