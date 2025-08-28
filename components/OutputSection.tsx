import React, { useState, useEffect } from 'react';
import Spinner from './Spinner';

interface OutputSectionProps {
  generatedText: string;
  isLoading: boolean;
  error: string | null;
}

const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-300 transition-colors"
    >
      {copied ? 'コピーしました！' : 'テキストをコピー'}
    </button>
  );
};


const OutputSection: React.FC<OutputSectionProps> = ({ generatedText, isLoading, error }) => {
  const hasContent = generatedText && !isLoading && !error;

  return (
    <div className="flex flex-col h-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        生成された推薦文
      </label>
      <div className="relative flex-grow border border-gray-300 rounded-md bg-gray-50 p-4 overflow-y-auto"
           style={{ maxHeight: 'calc(100vh - 200px)' }} // ← この行を追加または調整
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <Spinner />
          </div>
        )}
        {error && !isLoading && (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        )}
        {!isLoading && !error && !generatedText && (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-center">ここに推薦文が生成されます。</p>
          </div>
        )}
        {hasContent && (
            <>
                <CopyButton textToCopy={generatedText} />
                <pre className="whitespace-pre-wrap font-sans text-base text-black">{generatedText}</pre>
            </>
        )}
      </div>
    </div>
  );
};

export default OutputSection;
