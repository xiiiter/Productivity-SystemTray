import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { invoke } from "@tauri-apps/api/core";

// Import view components
import { SelectBranch } from "./views/SelectBranch";
import { ViewMetrics } from "./views/ViewMetrics";
import { YourProductivity } from "./views/YourProductivity";
import { ViewWorkload } from "./views/ViewWorkload";

type View = "menu" | "select-branch" | "metrics" | "productivity" | "workload";
type Modal = null | "settings" | "about" | "update-check";

interface Theme {
  name: string;
  displayName: string;
  background: {
    primary: string;
    secondary: string;
    hover: string;
    active: string;
    modal: string;
    modalOverlay: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  accent: {
    primary: string;
    hover: string;
    glow: string;
    glowStrong: string;
  };
  divider: string;
  status: {
    online: string;
    onlineGlow: string;
  };
}

const themes: Record<string, Theme> = {
  darkBlue: {
    name: "darkBlue",
    displayName: "Dark Blue",
    background: {
      primary: "rgba(26, 31, 43, 0.85)",
      secondary: "rgba(96, 165, 250, 0.08)",
      hover: "rgba(96, 165, 250, 0.12)",
      active: "rgba(96, 165, 250, 0.18)",
      modal: "rgba(26, 31, 43, 0.95)",
      modalOverlay: "rgba(0, 0, 0, 0.6)",
    },
    text: {
      primary: "#e5e7eb",
      secondary: "#9ca3af",
      tertiary: "#6b7280",
    },
    accent: {
      primary: "#60a5fa",
      hover: "#93c5fd",
      glow: "rgba(96, 165, 250, 0.3)",
      glowStrong: "rgba(96, 165, 250, 0.6)",
    },
    divider: "#353534",
    status: {
      online: "#60a5fa",
      onlineGlow: "rgba(96, 165, 250, 0.6)",
    },
  },
  darkNeutral: {
    name: "darkNeutral",
    displayName: "Dark Neutral",
    background: {
      primary: "rgba(28, 28, 30, 0.85)",
      secondary: "rgba(255, 255, 255, 0.06)",
      hover: "rgba(255, 255, 255, 0.08)",
      active: "rgba(255, 255, 255, 0.12)",
      modal: "rgba(28, 28, 30, 0.95)",
      modalOverlay: "rgba(0, 0, 0, 0.6)",
    },
    text: {
      primary: "#f5f5f7",
      secondary: "#98989d",
      tertiary: "#636366",
    },
    accent: {
      primary: "#f5f5f7",
      hover: "#ffffff",
      glow: "rgba(255, 255, 255, 0.2)",
      glowStrong: "rgba(255, 255, 255, 0.4)",
    },
    divider: "#38383a",
    status: {
      online: "#30d158",
      onlineGlow: "rgba(48, 209, 88, 0.6)",
    },
  },
  darkPurple: {
    name: "darkPurple",
    displayName: "Dark Purple",
    background: {
      primary: "rgba(24, 18, 43, 0.85)",
      secondary: "rgba(167, 139, 250, 0.08)",
      hover: "rgba(167, 139, 250, 0.12)",
      active: "rgba(167, 139, 250, 0.18)",
      modal: "rgba(24, 18, 43, 0.95)",
      modalOverlay: "rgba(0, 0, 0, 0.6)",
    },
    text: {
      primary: "#ede9fe",
      secondary: "#c4b5fd",
      tertiary: "#a78bfa",
    },
    accent: {
      primary: "#a78bfa",
      hover: "#c4b5fd",
      glow: "rgba(167, 139, 250, 0.35)",
      glowStrong: "rgba(167, 139, 250, 0.65)",
    },
    divider: "#3b2f5f",
    status: {
      online: "#a78bfa",
      onlineGlow: "rgba(167, 139, 250, 0.6)",
    },
  },
  darkGreen: {
    name: "darkGreen",
    displayName: "Dark Green",
    background: {
      primary: "rgba(16, 28, 24, 0.85)",
      secondary: "rgba(52, 211, 153, 0.08)",
      hover: "rgba(52, 211, 153, 0.12)",
      active: "rgba(52, 211, 153, 0.18)",
      modal: "rgba(16, 28, 24, 0.95)",
      modalOverlay: "rgba(0, 0, 0, 0.6)",
    },
    text: {
      primary: "#ecfdf5",
      secondary: "#a7f3d0",
      tertiary: "#6ee7b7",
    },
    accent: {
      primary: "#34d399",
      hover: "#6ee7b7",
      glow: "rgba(52, 211, 153, 0.35)",
      glowStrong: "rgba(52, 211, 153, 0.65)",
    },
    divider: "#1f3d34",
    status: {
      online: "#34d399",
      onlineGlow: "rgba(52, 211, 153, 0.6)",
    },
  },
  darkRed: {
    name: "darkRed",
    displayName: "Dark Red",
    background: {
      primary: "rgba(32, 18, 18, 0.85)",
      secondary: "rgba(239, 68, 68, 0.08)",
      hover: "rgba(239, 68, 68, 0.12)",
      active: "rgba(239, 68, 68, 0.18)",
      modal: "rgba(32, 18, 18, 0.95)",
      modalOverlay: "rgba(0, 0, 0, 0.6)",
    },
    text: {
      primary: "#fee2e2",
      secondary: "#fca5a5",
      tertiary: "#f87171",
    },
    accent: {
      primary: "#ef4444",
      hover: "#f87171",
      glow: "rgba(239, 68, 68, 0.35)",
      glowStrong: "rgba(239, 68, 68, 0.65)",
    },
    divider: "#4b1f1f",
    status: {
      online: "#ef4444",
      onlineGlow: "rgba(239, 68, 68, 0.6)",
    },
  },
  darkAmber: {
    name: "darkAmber",
    displayName: "Dark Amber",
    background: {
      primary: "rgba(33, 26, 14, 0.85)",
      secondary: "rgba(245, 158, 11, 0.08)",
      hover: "rgba(245, 158, 11, 0.12)",
      active: "rgba(245, 158, 11, 0.18)",
      modal: "rgba(33, 26, 14, 0.95)",
      modalOverlay: "rgba(0, 0, 0, 0.6)",
    },
    text: {
      primary: "#fffbeb",
      secondary: "#fde68a",
      tertiary: "#fcd34d",
    },
    accent: {
      primary: "#f59e0b",
      hover: "#fbbf24",
      glow: "rgba(245, 158, 11, 0.35)",
      glowStrong: "rgba(245, 158, 11, 0.65)",
    },
    divider: "#4a3a17",
    status: {
      online: "#f59e0b",
      onlineGlow: "rgba(245, 158, 11, 0.6)",
    },
  },
};

interface ThemeMeta {
  title: string;
  description: string;
}

const themeMeta: Record<string, ThemeMeta> = {
  darkBlue: {
    title: "Dark Blue",
    description: "Professional dark theme with blue accents focused on clarity and focus.",
  },
  darkNeutral: {
    title: "Dark Neutral",
    description: "Minimalist neutral palette designed for long sessions and reduced eye strain.",
  },
  darkPurple: {
    title: "Dark Purple",
    description: "Creative dark theme with subtle purple highlights for a modern aesthetic.",
  },
  darkGreen: {
    title: "Dark Green",
    description: "Calm and balanced theme with green accents inspired by productivity tools.",
  },
  darkRed: {
    title: "Dark Red",
    description: "Bold dark theme with red accents for high-contrast environments.",
  },
  darkAmber: {
    title: "Dark Amber",
    description: "Warm dark theme with amber highlights, ideal for night-time usage.",
  },
};

interface ThemeContextType {
  theme: Theme;
  themeName: string;
  setThemeName: (name: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<string>("darkBlue");
  const theme = themes[themeName];

  return (
    <ThemeContext.Provider value={{ theme, themeName, setThemeName }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { theme } = useTheme();
  const [currentView, setCurrentView] = useState<View>("menu");
  const [activeModal, setActiveModal] = useState<Modal>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Decorations já está configurado no tauri.conf.json
    // Não precisa fazer nada aqui no setup

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

  const handleQuit = async () => {
    try {
      await invoke("quit_app");
    } catch (error) {
      console.error("Error quitting:", error);
    }
  };

  const handleCheckUpdates = () => {
    setActiveModal("update-check");
  };

  return (
    <div className="app-container" style={{ 
      backgroundColor: theme.background.primary,
      color: theme.text.primary 
    }}>
      <div className="header" style={{ borderBottomColor: theme.divider }}>
        <div className="header-left">
          <div className="logo">
            <img src="/logo.png" alt="Logo" />
          </div>
          <span className="header-title" style={{ color: theme.text.primary }}>
            Productivity
          </span>
        </div>
        <div className="header-right">
          <svg
            className="header-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke={theme.accent.primary}
            strokeWidth="2"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <svg
            className="header-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke={theme.accent.primary}
            strokeWidth="2"
          >
            <rect x="3" y="4" width="18" height="16" rx="2"></rect>
            <polyline points="3,8 12,13 21,8"></polyline>
          </svg>
          <div className="account-info">
            <div className="account-row">
              <div className="account-name" style={{ color: theme.text.primary }}>
                account.name
              </div>
              <div
                className="status-dot"
                style={{
                  background: theme.status.online,
                  boxShadow: `0 0 6px ${theme.status.onlineGlow}`,
                }}
              ></div>
            </div>
            <div className="account-row">
              <div className="account-role" style={{ color: theme.text.secondary }}>
                account.role
              </div>
              <div
                className="status-dot"
                style={{
                  background: theme.status.online,
                  boxShadow: `0 0 6px ${theme.status.onlineGlow}`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className={`content-wrapper ${isTransitioning ? "transitioning" : ""}`}>
        {currentView === "menu" ? (
          <div className="menu-content">
            <div className="menu-section">
              <MenuItem
                label="Select Branch"
                shortcut="⌘ O"
                onClick={() => navigateToView("select-branch")}
              />
              <MenuItem label="View metrics" shortcut="⌘ M" onClick={() => navigateToView("metrics")} />
              <MenuItem
                label="Your productivity"
                shortcut="⌘ P"
                onClick={() => navigateToView("productivity")}
              />
              <MenuItem label="View WorkLoad" shortcut="⌘ H" onClick={() => navigateToView("workload")} />
            </div>

            <div className="separator" style={{ background: theme.divider }}></div>

            <div className="menu-section">
              <MenuItem label="Check for updates" onClick={handleCheckUpdates} />
              <MenuItem label="About Evolux" onClick={() => setActiveModal("about")} />
            </div>

            <div className="separator" style={{ background: theme.divider }}></div>

            <div className="menu-section">
              <MenuItem label="Settings" shortcut="⌘ /" onClick={() => setActiveModal("settings")} />
              <MenuItem label="Quit" shortcut="⌘ Q" onClick={handleQuit} />
            </div>
          </div>
        ) : (
          <div className="view-content">
            <div className="view-header" style={{ borderBottomColor: theme.divider }}>
              <button
                className="back-button"
                onClick={() => navigateToView("menu")}
                style={{
                  background: theme.background.secondary,
                  color: theme.accent.primary,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                <span>Back</span>
              </button>
            </div>
            <div className="view-body">
              {currentView === "select-branch" && <SelectBranch />}
              {currentView === "metrics" && <ViewMetrics />}
              {currentView === "productivity" && <YourProductivity />}
              {currentView === "workload" && <ViewWorkload />}
            </div>
          </div>
        )}
      </div>

      {activeModal && (
        <div
          className="modal-overlay"
          onClick={() => setActiveModal(null)}
          style={{ background: theme.background.modalOverlay }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: theme.background.modal,
              borderColor: `${theme.accent.primary}1a`,
            }}
          >
            <div className="modal-header" style={{ borderBottomColor: theme.divider }}>
              <h3 style={{ color: theme.text.primary }}>
                {activeModal === "settings" ? "Settings" : activeModal === "about" ? "About Evolux" : "Check for Updates"}
              </h3>
              <button
                className="modal-close"
                onClick={() => setActiveModal(null)}
                style={{ color: theme.text.secondary }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body" style={{ color: theme.text.primary }}>
              {activeModal === "settings" && <SettingsContent />}
              {activeModal === "about" && <AboutContent />}
              {activeModal === "update-check" && <UpdateCheckContent />}
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

        html, body, #root {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .app-container {
          width: 100%;
          height: 100vh;
          background: #1a1f2b; /* Fallback background */
          animation: slideDown 0.15s cubic-bezier(0.25, 0.1, 0.25, 1);
          transition: background-color 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border-radius: 12px;
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
          border-bottom: 1px solid;
          transition: border-color 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
          flex-shrink: 0;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .header-title {
          font-size: 14px;
          font-weight: 300;
          transition: color 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-icon {
          cursor: pointer;
          transition: all 0.15s cubic-bezier(0.25, 0.1, 0.25, 1);
        }

        .header-icon:hover {
          filter: brightness(1.2) drop-shadow(0 0 6px currentColor);
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
          transition: color 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
        }

        .account-role {
          font-size: 10px;
          font-weight: 300;
          transition: color 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
        }

        .content-wrapper {
          flex: 1;
          overflow: hidden;
          transition: opacity 0.15s cubic-bezier(0.25, 0.1, 0.25, 1);
        }

        .content-wrapper.transitioning {
          opacity: 0;
        }

        .menu-content {
          animation: fadeIn 0.15s cubic-bezier(0.25, 0.1, 0.25, 1);
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .menu-content::-webkit-scrollbar {
          display: none;
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

        .separator {
          height: 1px;
          margin: 7px 0;
          transition: background 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
        }

        .view-content {
          animation: viewSlideIn 0.18s cubic-bezier(0.25, 0.1, 0.25, 1);
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
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
          border-bottom: 1px solid;
          transition: border-color 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
          flex-shrink: 0;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 300;
          cursor: pointer;
          transition: all 0.15s cubic-bezier(0.25, 0.1, 0.25, 1);
        }

        .back-button:hover {
          opacity: 0.8;
          transform: translateX(-2px);
        }

        .back-button:active {
          transform: translateX(-2px) scale(0.98);
        }

        .view-body {
          flex: 1;
          overflow: hidden;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeInOverlay 0.15s cubic-bezier(0.25, 0.1, 0.25, 1);
          transition: background 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
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
          backdrop-filter: blur(20px);
          border-radius: 12px;
          border: 1px solid;
          width: 90%;
          max-width: 400px;
          max-height: 80vh;
          overflow: hidden;
          animation: modalSlideIn 0.18s cubic-bezier(0.25, 0.1, 0.25, 1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
          transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
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
          border-bottom: 1px solid;
          transition: border-color 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
          flex-shrink: 0;
        }

        .modal-header h3 {
          font-size: 15px;
          font-weight: 500;
          transition: color 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
        }

        .modal-close {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.15s cubic-bezier(0.25, 0.1, 0.25, 1);
        }

        .modal-close:hover {
          opacity: 0.7;
        }

        .modal-body {
          padding: 16px;
          font-size: 13px;
          font-weight: 300;
          line-height: 1.6;
          transition: color 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
          max-height: calc(80vh - 65px);
          overflow-y: auto;
          overflow-x: hidden;
        }

        .modal-body::-webkit-scrollbar {
          width: 6px;
        }

        .modal-body::-webkit-scrollbar-track {
          background: transparent;
        }

        .modal-body::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        .modal-body::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes checkmark {
          0% {
            stroke-dashoffset: 50;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}

function MenuItem({
  label,
  shortcut,
  onClick,
  active = false,
}: {
  label: string;
  shortcut?: string;
  onClick: () => void;
  active?: boolean;
}) {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="menu-item"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: active
          ? theme.background.active
          : isHovered
          ? theme.background.hover
          : "transparent",
        padding: "4px 16px",
        cursor: "pointer",
        transition: "all 0.15s cubic-bezier(0.25, 0.1, 0.25, 1)",
        userSelect: "none",
        position: "relative",
        borderRadius: "6px",
        margin: "0 8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span
        style={{
          fontSize: "13px",
          fontWeight: active || isHovered ? 500 : 300,
          color: active || isHovered ? theme.accent.primary : theme.text.primary,
          textShadow: active || isHovered ? `0 0 8px ${theme.accent.glow}` : "none",
          transition: "all 0.15s cubic-bezier(0.25, 0.1, 0.25, 1)",
          lineHeight: "1.4",
        }}
      >
        {label}
      </span>
      {shortcut && (
        <span
          style={{
            fontSize: "12px",
            fontWeight: 300,
            color: isHovered ? theme.accent.primary : theme.text.tertiary,
            opacity: isHovered ? 0.8 : 0.7,
            transition: "all 0.15s cubic-bezier(0.25, 0.1, 0.25, 1)",
          }}
        >
          {shortcut}
        </span>
      )}
    </div>
  );
}

function UpdateCheckContent() {
  const { theme } = useTheme();
  const [status, setStatus] = useState<"checking" | "up-to-date" | "available" | "error">("checking");
  const [updateInfo, setUpdateInfo] = useState<any>(null);

  useEffect(() => {
    checkForUpdates();
  }, []);

  const checkForUpdates = async () => {
    try {
      setStatus("checking");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await fetch("https://api.github.com/repos/xiiiter/Productivity-SystemTray/releases/latest");
      const data = await response.json();
      
      const currentVersion = "0.1.0";
      const latestVersion = data.tag_name?.replace("v", "") || "0.1.0";
      
      if (latestVersion > currentVersion) {
        setUpdateInfo({
          version: latestVersion,
          url: data.html_url,
          notes: data.body,
        });
        setStatus("available");
      } else {
        setStatus("up-to-date");
      }
    } catch (error) {
      console.error("Error checking updates:", error);
      setStatus("error");
    }
  };

  const openUpdateURL = () => {
    if (updateInfo?.url) {
      window.open(updateInfo.url, "_blank");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", padding: "20px 0" }}>
      {status === "checking" && (
        <>
          <div
            style={{
              width: "64px",
              height: "64px",
              border: `3px solid ${theme.background.secondary}`,
              borderTop: `3px solid ${theme.accent.primary}`,
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <div style={{ textAlign: "center" }}>
            <h4 style={{ color: theme.text.primary, fontSize: "14px", fontWeight: 500, marginBottom: "8px" }}>
              Checking for updates...
            </h4>
            <p style={{ color: theme.text.secondary, fontSize: "12px" }}>
              Please wait while we check for the latest version
            </p>
          </div>
        </>
      )}

      {status === "up-to-date" && (
        <>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: `${theme.accent.primary}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke={theme.accent.primary}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 50,
                animation: "checkmark 0.5s ease-in-out",
              }}
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div style={{ textAlign: "center" }}>
            <h4 style={{ color: theme.text.primary, fontSize: "14px", fontWeight: 500, marginBottom: "8px" }}>
              You're up to date!
            </h4>
            <p style={{ color: theme.text.secondary, fontSize: "12px" }}>
              You have the latest version installed (v0.1.0)
            </p>
          </div>
        </>
      )}

      {status === "available" && updateInfo && (
        <>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: `${theme.accent.primary}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke={theme.accent.primary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ animation: "pulse 2s ease-in-out infinite" }}
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>
          <div style={{ textAlign: "center", width: "100%" }}>
            <h4 style={{ color: theme.text.primary, fontSize: "14px", fontWeight: 500, marginBottom: "8px" }}>
              Update available!
            </h4>
            <p style={{ color: theme.text.secondary, fontSize: "12px", marginBottom: "16px" }}>
              Version {updateInfo.version} is now available
            </p>
            <button
              onClick={openUpdateURL}
              style={{
                background: theme.accent.primary,
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "10px 20px",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.15s cubic-bezier(0.25, 0.1, 0.25, 1)",
                boxShadow: `0 4px 12px ${theme.accent.glow}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 6px 16px ${theme.accent.glowStrong}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = `0 4px 12px ${theme.accent.glow}`;
              }}
            >
              Download Update
            </button>
          </div>
        </>
      )}

      {status === "error" && (
        <>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "rgba(239, 68, 68, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div style={{ textAlign: "center" }}>
            <h4 style={{ color: theme.text.primary, fontSize: "14px", fontWeight: 500, marginBottom: "8px" }}>
              Unable to check for updates
            </h4>
            <p style={{ color: theme.text.secondary, fontSize: "12px" }}>
              Please check your internet connection and try again
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function SettingsContent() {
  const { theme, themeName, setThemeName } = useTheme();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h4 style={{ color: theme.text.primary, fontSize: "14px", fontWeight: 500, marginBottom: "12px" }}>
          Appearance
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {Object.values(themes).map((t) => (
            <ThemeOption
              key={t.name}
              theme={t}
              isSelected={themeName === t.name}
              onSelect={() => setThemeName(t.name)}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          height: "1px",
          background: theme.divider,
        }}
      ></div>

      <div>
        <h4 style={{ color: theme.text.primary, fontSize: "14px", fontWeight: 500, marginBottom: "12px" }}>
          Preferences
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              color: theme.text.primary,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              style={{
                accentColor: theme.accent.primary,
                width: "16px",
                height: "16px",
                cursor: "pointer",
              }}
            />
            Start at login
          </label>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              color: theme.text.primary,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              defaultChecked
              style={{
                accentColor: theme.accent.primary,
                width: "16px",
                height: "16px",
                cursor: "pointer",
              }}
            />
            Show notifications
          </label>
        </div>
      </div>
    </div>
  );
}

function ThemeOption({
  theme: t,
  isSelected,
  onSelect,
}: {
  theme: Theme;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px 12px",
        background: isSelected ? theme.background.active : isHovered ? theme.background.hover : "transparent",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "all 0.15s cubic-bezier(0.25, 0.1, 0.25, 1)",
        border: isSelected ? `1px solid ${theme.accent.primary}33` : "1px solid transparent",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "32px",
          borderRadius: "6px",
          background: t.background.primary,
          backdropFilter: "blur(20px)",
          border: `1px solid ${t.divider}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "10px",
          color: t.accent.primary,
          fontWeight: 500,
          flexShrink: 0,
        }}
      >
        Aa
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: "13px",
            fontWeight: isSelected ? 500 : 300,
            color: isSelected ? theme.accent.primary : theme.text.primary,
            marginBottom: "2px",
            transition: "all 0.15s cubic-bezier(0.25, 0.1, 0.25, 1)",
          }}
        >
          {t.displayName}
        </div>
        <div style={{ fontSize: "11px", color: theme.text.secondary }}>
          {themeMeta[t.name]?.description}
        </div>
      </div>
      {isSelected && (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={theme.accent.primary}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      )}
    </div>
  );
}

function AboutContent() {
  const { theme } = useTheme();
  return (
    <div>
      <h4 style={{ color: theme.text.primary, fontSize: "14px", fontWeight: 500, marginBottom: "8px" }}>
        Evolux Productivity
      </h4>
      <p style={{ fontSize: "12px", color: theme.text.secondary, marginBottom: "12px" }}>Version 0.1.0</p>
      <p style={{ fontSize: "13px", lineHeight: "1.6", color: theme.text.primary }}>
        A modern productivity application built with Tauri and React.
      </p>
    </div>
  );
}

export default App;