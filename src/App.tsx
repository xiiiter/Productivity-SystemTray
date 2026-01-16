import { useState, useEffect } from "react";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";

type View = "menu" | "select-branch" | "metrics" | "productivity" | "workload";
type Modal = null | "settings" | "about";

function App() {
  const [currentView, setCurrentView] = useState<View>("menu");
  const [activeModal, setActiveModal] = useState<Modal>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const setup = async () => {
      const window = getCurrentWebviewWindow();
      await window.setDecorations(false);
    };
    setup();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activeModal) {
          setActiveModal(null);
        } else if (currentView !== "menu") {
          navigateToView("menu");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModal, currentView]);

  const navigateToView = (view: View) => {
    if (view === currentView) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(view);
      setIsTransitioning(false);
    }, 150);
  };

  const handleClose = async () => {
    const window = getCurrentWebviewWindow();
    await window.hide();
  };

  const handleCheckUpdates = () => {
    console.log("Checking for updates...");
  };

  return (
    <div className="app-container">
      <div className="header">
        <div className="header-left">
          <div className="logo">
            <img src="/logo.png" alt="Logo" />
          </div>
          <span className="header-title">Productivity</span>
        </div>
        <div className="header-right">
          <svg className="header-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <svg className="header-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="16" rx="2"></rect>
            <polyline points="3,8 12,13 21,8"></polyline>
          </svg>
          <div className="account-info">
            <div className="account-row">
              <div className="account-name">account.name</div>
              <div className="status-dot"></div>
            </div>
            <div className="account-row">
              <div className="account-role">account.role</div>
              <div className="status-dot"></div>
            </div>
          </div>
        </div>
      </div>

      <div className={`content-wrapper ${isTransitioning ? "transitioning" : ""}`}>
        {currentView === "menu" ? (
          <div className="menu-content">
            <div className="menu-section">
              <div className="menu-item" onClick={() => navigateToView("select-branch")}>
                <span className="menu-label">Select Branch</span>
                <span className="menu-shortcut">⌘ O</span>
              </div>
              <div className="menu-item" onClick={() => navigateToView("metrics")}>
                <span className="menu-label">View metrics</span>
                <span className="menu-shortcut">⌘ M</span>
              </div>
              <div className="menu-item" onClick={() => navigateToView("productivity")}>
                <span className="menu-label">Your productivity</span>
                <span className="menu-shortcut">⌘ P</span>
              </div>
              <div className="menu-item" onClick={() => navigateToView("workload")}>
                <span className="menu-label">View WorkLoad</span>
                <span className="menu-shortcut">⌘ H</span>
              </div>
            </div>

            <div className="separator"></div>

            <div className="menu-section">
              <div className="menu-item" onClick={handleCheckUpdates}>
                <span className="menu-label">Check for updates</span>
              </div>
              <div className="menu-item" onClick={() => setActiveModal("about")}>
                <span className="menu-label">About Evolux</span>
              </div>
            </div>

            <div className="separator"></div>

            <div className="menu-section">
              <div className="menu-item" onClick={() => setActiveModal("settings")}>
                <span className="menu-label">Settings</span>
                <span className="menu-shortcut">⌘ /</span>
              </div>
              <div className="menu-item" onClick={handleClose}>
                <span className="menu-label">Quit</span>
                <span className="menu-shortcut">⌘ Q</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="view-content">
            <div className="view-header">
              <button className="back-button" onClick={() => navigateToView("menu")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                <span>Back</span>
              </button>
            </div>
            <div className="view-body">
              {currentView === "select-branch" && <SelectBranchView />}
              {currentView === "metrics" && <MetricsView />}
              {currentView === "productivity" && <ProductivityView />}
              {currentView === "workload" && <WorkloadView />}
            </div>
          </div>
        )}
      </div>

      {activeModal && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{activeModal === "settings" ? "Settings" : "About Evolux"}</h3>
              <button className="modal-close" onClick={() => setActiveModal(null)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              {activeModal === "settings" ? <SettingsContent /> : <AboutContent />}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;500&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .app-container {
          width: 100%;
          min-height: 100vh;
          background-color: rgba(35, 35, 35, 0.85);
          backdrop-filter: blur(20px);
          animation: slideDown 0.15s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid #353534;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo {
          width: 24px;
          height: 24px;
        }

        .logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }

        .header-title {
          font-size: 14px;
          font-weight: 300;
          color: #e5e7eb;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-icon {
          color: #9ca3af;
          cursor: pointer;
          transition: color 0.15s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .header-icon:hover {
          color: #e5e7eb;
        }

        .account-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .account-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .account-name {
          font-size: 12px;
          font-weight: 300;
          color: #e5e7eb;
        }

        .account-role {
          font-size: 10px;
          font-weight: 300;
          color: #9ca3af;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 4px rgba(16, 185, 129, 0.6);
        }

        .content-wrapper {
          transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .content-wrapper.transitioning {
          opacity: 0;
        }

        .menu-content {
          animation: fadeIn 0.15s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .menu-section {
          padding: 2px 0;
        }

        .menu-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px 16px;
          cursor: pointer;
          transition: background 0.12s cubic-bezier(0.4, 0, 0.2, 1);
          user-select: none;
          position: relative;
        }

        .menu-item:hover {
          background: rgba(255, 255, 255, 0.06);
        }

        .menu-item:hover .menu-label {
          font-weight: 500;
          color: transparent;
          background: linear-gradient(90deg, #e5e7eb 0%, #ffffff 50%, #e5e7eb 100%);
          background-size: 200% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          animation: shimmer 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.25);
          transform: translateX(2px);
        }

        @keyframes shimmer {
          0% {
            background-position: 100% 0;
          }
          100% {
            background-position: -100% 0;
          }
        }

        .menu-item:active {
          transform: translateY(1px);
        }

        .menu-label {
          font-size: 13px;
          font-weight: 300;
          color: #e5e7eb;
          transition: all 0.12s cubic-bezier(0.4, 0, 0.2, 1);
          line-height: 1.4;
        }

        .menu-shortcut {
          font-size: 12px;
          font-weight: 300;
          color: #6b7280;
          opacity: 0.7;
        }

        .separator {
          height: 1px;
          background: #353534;
          margin: 7px 0;
        }

        .view-content {
          animation: viewSlideIn 0.18s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes viewSlideIn {
          from {
            opacity: 0;
            transform: translateX(8px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .view-header {
          padding: 12px 16px;
          border-bottom: 1px solid #353534;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.04);
          border: none;
          border-radius: 6px;
          color: #e5e7eb;
          font-size: 13px;
          font-weight: 300;
          cursor: pointer;
          transition: all 0.12s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.08);
          font-weight: 500;
          transform: translateX(-2px);
        }

        .back-button:active {
          transform: translateX(-2px) translateY(1px);
        }

        .view-body {
          padding: 16px;
          min-height: 200px;
        }

        .view-placeholder {
          color: #9ca3af;
          font-size: 14px;
          font-weight: 300;
          text-align: center;
          padding: 40px 20px;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeInOverlay 0.15s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes fadeInOverlay {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .modal-content {
          background: rgba(45, 45, 45, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 12px;
          width: 280px;
          max-height: 400px;
          overflow: hidden;
          animation: modalSlideIn 0.18s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(-8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          border-bottom: 1px solid #353534;
        }

        .modal-header h3 {
          font-size: 15px;
          font-weight: 500;
          color: #e5e7eb;
        }

        .modal-close {
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.12s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .modal-close:hover {
          background: rgba(255, 255, 255, 0.06);
          color: #e5e7eb;
        }

        .modal-body {
          padding: 16px;
          color: #d1d5db;
          font-size: 13px;
          font-weight: 300;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}

function SelectBranchView() {
  return (
    <div className="view-placeholder">
      <h3 style={{ color: '#e5e7eb', marginBottom: '8px', fontSize: '15px', fontWeight: 600 }}>Select Branch</h3>
      <p>Branch selection interface</p>
    </div>
  );
}

function MetricsView() {
  return (
    <div className="view-placeholder">
      <h3 style={{ color: '#e5e7eb', marginBottom: '8px', fontSize: '15px', fontWeight: 600 }}>Metrics</h3>
      <p>Analytics and metrics dashboard</p>
    </div>
  );
}

function ProductivityView() {
  return (
    <div className="view-placeholder">
      <h3 style={{ color: '#e5e7eb', marginBottom: '8px', fontSize: '15px', fontWeight: 600 }}>Your Productivity</h3>
      <p>Personal productivity insights</p>
    </div>
  );
}

function WorkloadView() {
  return (
    <div className="view-placeholder">
      <h3 style={{ color: '#e5e7eb', marginBottom: '8px', fontSize: '15px', fontWeight: 600 }}>WorkLoad</h3>
      <p>Current workload overview</p>
    </div>
  );
}

function SettingsContent() {
  return (
    <div>
      <h4 style={{ color: '#e5e7eb', fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Preferences</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <input type="checkbox" style={{ accentColor: '#667eea' }} />
          Start at login
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <input type="checkbox" defaultChecked style={{ accentColor: '#667eea' }} />
          Show notifications
        </label>
      </div>
    </div>
  );
}

function AboutContent() {
  return (
    <div>
      <h4 style={{ color: '#e5e7eb', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Evolux Productivity</h4>
      <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '12px' }}>Version 0.1.0</p>
      <p style={{ fontSize: '13px', lineHeight: '1.6' }}>
        A modern productivity application built with Tauri and React.
      </p>
    </div>
  );
}

export default App;