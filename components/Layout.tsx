
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500">
      <nav className="sticky top-0 z-50 glass-card px-4 py-3 border-b shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19c.7 0 1.3-.2 1.8-.7s.7-1.1.7-1.8c0-1.3-1.1-2.4-2.4-2.4-.1 0-.2 0-.4.1C16.8 11.2 14.3 9 11.2 9c-2.8 0-5.2 2-5.7 4.7-.1 0-.2 0-.3 0-1.7 0-3 1.3-3 3s1.3 3 3 3h12.7Z"/></svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
              MeteoGemini
            </h1>
          </div>
          <div className="hidden md:block text-sm text-slate-500 font-medium">
            AI Powered Weather Assistant
          </div>
        </div>
      </nav>
      <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-8">
        {children}
      </main>
      <footer className="py-6 border-t border-slate-200 text-center text-slate-400 text-xs">
        &copy; {new Date().getFullYear()} MeteoGemini. Alimentato da Google Gemini.
      </footer>
    </div>
  );
};

export default Layout;
