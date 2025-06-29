import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import OutputSection from './components/OutputSection';
import { generateRecommendation } from './services/geminiService';

const App: React.FC = () => {
  const [resume, setResume] = useState<string>('');
  const [positionInfo, setPositionInfo] = useState<string>('');
  const [generatedText, setGeneratedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!resume.trim()) {
      setError('職務経歴書または面談メモを入力してください。');
      setGeneratedText('');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedText('');

    try {
      const result = await generateRecommendation(resume, positionInfo);
      setGeneratedText(result);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : '予期せぬエラーが発生しました。';
      setError(errorMessage);
      setGeneratedText('');
    } finally {
      setIsLoading(false);
    }
  }, [resume, positionInfo]);

  return (
    <div className="flex flex-col h-screen font-sans bg-white text-black">
      <Header />
      <main className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-8 overflow-hidden">
        <InputSection
          resume={resume}
          setResume={setResume}
          positionInfo={positionInfo}
          setPositionInfo={setPositionInfo}
          onGenerate={handleGenerate}
          isLoading={isLoading}
        />
        <OutputSection
          generatedText={generatedText}
          isLoading={isLoading}
          error={error}
        />
      </main>
    </div>
  );
};

export default App;