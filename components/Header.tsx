import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-4 border-b-2 border-[#FF0000] flex items-center justify-between">
          <div className="flex items-center">
            <img src="/morich2.png" alt="morich logo" className="h-8 mr-3" />
            <h1 className="text-3xl font-black tracking-tight text-[#FF0000]"> {/* ここを変更 */}
              morich Recommender Pro
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
