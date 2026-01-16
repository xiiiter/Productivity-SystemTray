import { useState, useEffect } from 'react';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';

function App() {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
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
    <div 
      className="w-full h-screen flex items-start justify-end p-2"
      style={{
        backgroundColor: '#232323',
      }}
    >
      <div className="w-72 animate-slideDown">
        <div className="p-6 flex flex-col gap-1">
          {/* Label 1: Select Branch */}
          <div
            onClick={() => handleOptionClick('Select Branch')}
            className="animated-label"
          >
            <span className="label-text">
              Select Branch
            </span>
            <span className="label-shortcut">
              ⌘O
            </span>
          </div>

          {/* Label 2: View Metrics */}
          <div
            onClick={() => handleOptionClick('View Metrics')}
            className="animated-label"
          >
            <span className="label-text">
              View Metrics
            </span>
            <span className="label-shortcut">
              ⌘M
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

        * {
          font-family: 'Poppins', sans-serif;
        }

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

        .animated-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 0;
          cursor: pointer;
          user-select: none;
          position: relative;
        }

        .label-text {
          font-size: 14px;
          font-weight: 400;
          color: #d1d5db;
          position: relative;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          background: linear-gradient(90deg, #5c5cff 0%, #5c5cff 100%);
          background-clip: text;
          -webkit-background-clip: text;
          background-size: 0% 100%;
          background-repeat: no-repeat;
          background-position: left center;
          filter: drop-shadow(0 0 0px transparent);
        }

        .animated-label:hover .label-text {
          background-size: 100% 100%;
          -webkit-text-fill-color: transparent;
          transform: scale(1.05);
          letter-spacing: 0.3px;
          filter: drop-shadow(0 0 8px rgba(92, 92, 255, 0.6)) 
                  drop-shadow(0 0 12px rgba(92, 92, 255, 0.4));
        }

        .animated-label:active .label-text {
          transform: scale(1.02);
        }

        .label-shortcut {
          font-size: 12px;
          color: #6b7280;
          transition: all 0.3s ease;
          opacity: 0.6;
        }

        .animated-label:hover .label-shortcut {
          opacity: 1;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}

export default App;