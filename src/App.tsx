import { useState, useEffect } from 'react';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';

function App() {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Garantir que a janela não seja transparente
    const setup = async () => {
      const window = getCurrentWebviewWindow();
      await window.setDecorations(false);
    };
    setup();
  }, []);

  const handleClose = async () => {
    const window = getCurrentWebviewWindow();
    await window.hide();
  };

  const handleOptionClick = (option: string) => {
    setIsAnimating(true);
    console.log(`Opção selecionada: ${option}`);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="w-full h-screen flex items-start justify-end p-2 bg-transparent">
      <div className="bg-white rounded-2xl shadow-2xl w-72 overflow-hidden animate-slideDown border border-gray-200">
        {/* Duas opções principais */}
        <div className="p-2 space-y-1">
          {/* Opção 1: Select Branch */}
          <button
            onClick={() => handleOptionClick('Select Branch')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-all duration-200 rounded-lg group"
            disabled={isAnimating}
          >
            <span className="text-gray-800 font-normal text-sm">
              Select Branch
            </span>
            <span className="text-gray-400 text-sm font-normal">
              ⌘O
            </span>
          </button>

          {/* Opção 2: View Metrics */}
          <button
            onClick={() => handleOptionClick('View Metrics')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-all duration-200 rounded-lg group"
            disabled={isAnimating}
          >
            <span className="text-gray-800 font-normal text-sm">
              View metrics
            </span>
            <span className="text-gray-400 text-sm font-normal">
              ⌘M
            </span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }

        button:active {
          transform: scale(0.98);
        }

        button:disabled {
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

export default App;