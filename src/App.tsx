import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { 
  CheckCircle2, Bell, Package, Activity, Calendar, 
  Settings, Info, LogOut, ChevronLeft, Search,
   Clock, CheckCheck, Loader2,
  Download, User, Building2, TrendingUp,
  BarChart3, Zap, X
} from "lucide-react";
import { BranchDebug } from './components/BranchDebug';
import { SelectBranch } from './views/SelectBranch';
import { invokeCommand } from "./services/api";
// ==================== TYPES ====================
type View = "menu" | "select-branch" | "inbox" | "notifications" | "metrics" | "productivity" | "workload";
type Modal = null | "settings" | "about" | "update-check" | "register-user";

interface Theme {
  name: string;
  displayName: string;
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
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
    secondary: string;
    hover: string;
    glow: string;
    glowStrong: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  divider: string;
  status: {
    online: string;
    onlineGlow: string;
  };
  gradient: {
    primary: string;
    secondary: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  branch_id?: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: "Pending" | "InProgress" | "Done";
  priority: "Low" | "Normal" | "High" | "Urgent";
  assigned_to: string;
  due_date?: string;
  created_at: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

// ==================== THEME ====================
const themes: Record<string, Theme> = {
  darkBlue: {
    name: "darkBlue",
    displayName: "Ocean Deep",
    background: {
      primary: "rgba(15, 23, 42, 0.95)",
      secondary: "rgba(30, 41, 59, 0.6)",
      tertiary: "rgba(51, 65, 85, 0.4)",
      hover: "rgba(96, 165, 250, 0.08)",
      active: "rgba(96, 165, 250, 0.15)",
      modal: "rgba(15, 23, 42, 0.98)",
      modalOverlay: "rgba(0, 0, 0, 0.7)",
    },
    text: {
      primary: "#f1f5f9",
      secondary: "#cbd5e1",
      tertiary: "#94a3b8",
    },
    accent: {
      primary: "#3b82f6",
      secondary: "#60a5fa",
      hover: "#93c5fd",
      glow: "rgba(59, 130, 246, 0.4)",
      glowStrong: "rgba(59, 130, 246, 0.7)",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#06b6d4",
    },
    divider: "rgba(148, 163, 184, 0.1)",
    status: {
      online: "#10b981",
      onlineGlow: "rgba(16, 185, 129, 0.6)",
    },
    gradient: {
      primary: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 197, 253, 0.05) 100%)",
      secondary: "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 197, 253, 0.1) 100%)",
    },
  },
  darkPurple: {
    name: "darkPurple",
    displayName: "Purple Haze",
    background: {
      primary: "rgba(17, 24, 39, 0.95)",
      secondary: "rgba(31, 41, 55, 0.6)",
      tertiary: "rgba(55, 65, 81, 0.4)",
      hover: "rgba(167, 139, 250, 0.08)",
      active: "rgba(167, 139, 250, 0.15)",
      modal: "rgba(17, 24, 39, 0.98)",
      modalOverlay: "rgba(0, 0, 0, 0.7)",
    },
    text: {
      primary: "#f9fafb",
      secondary: "#e5e7eb",
      tertiary: "#d1d5db",
    },
    accent: {
      primary: "#8b5cf6",
      secondary: "#a78bfa",
      hover: "#c4b5fd",
      glow: "rgba(139, 92, 246, 0.4)",
      glowStrong: "rgba(139, 92, 246, 0.7)",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#06b6d4",
    },
    divider: "rgba(209, 213, 219, 0.1)",
    status: {
      online: "#10b981",
      onlineGlow: "rgba(16, 185, 129, 0.6)",
    },
    gradient: {
      primary: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(196, 181, 253, 0.05) 100%)",
      secondary: "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(196, 181, 253, 0.1) 100%)",
    },
  },
};

// ==================== CONTEXT ====================
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
  const [user, setUser] = useState<User | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [branches, setBranches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBranches = async () => {
    try {
      // O nome "get_all_branches" deve ser o mesmo que está no seu main.rs
      const data = await invokeCommand<any[]>("get_all_branches");
      setBranches(data);
      
    } catch (error) {
      console.error("Erro ao carregar filiais:", error);
      
    } 
  };

  useEffect(() => {
    if (currentView === "select-branch") {
      fetchBranches();
    }
  }, [currentView]);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setActiveModal("register-user");
    }
  }, []);

  useEffect(() => {
    checkForUpdates();
  }, []);

  const checkForUpdates = async () => {
    try {
      const response = await fetch(
        "https://api.github.com/repos/xiiiter/Productivity-SystemTray/releases/latest"
      );
      const data = await response.json();
      const latestVersion = data.tag_name;
      const currentVersion = "v0.1.1";
      
      if (latestVersion !== currentVersion) {
        setUpdateAvailable(true);
      }
    } catch (error) {
      console.error("Failed to check for updates:", error);
    }
  };

  const navigateToView = (view: View) => {
    if (view === currentView) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(view);
      setIsTransitioning(false);
    }, 200);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activeModal && activeModal !== "register-user") {
          setActiveModal(null);
        } else if (currentView !== "menu") {
          navigateToView("menu");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModal, currentView]);

  return (

    <div className="app-container" style={{ 
      background: theme.background.primary,
      color: theme.text.primary 
    }}>
      {/* Animated background - Sempre renderiza para não ficar tudo branco */}
      <div className="animated-bg">
        <div className="bg-gradient-1" style={{ background: theme.gradient.primary }} />
        <div className="bg-gradient-2" style={{ background: theme.gradient.secondary }} />
      </div>

      {/* Só mostra o Header se o usuário existir */}
      {user && (
        <div className="header" style={{ borderBottomColor: theme.divider }}>
          <div className="header-left">
            <div className="logo">
              <div className="logo-icon" style={{ background: theme.accent.primary }}>
                <CheckCircle2 size={16} color="#fff" />
              </div>
            </div>
            <span className="header-title" style={{ color: theme.text.primary }}>
              Productivity
            </span>
            <div className="status-badge" style={{ 
              background: `${theme.status.online}15`,
              color: theme.status.online,
              borderColor: `${theme.status.online}40`
            }}>
              <div className="status-dot" style={{ background: theme.status.online }} />
              Online
            </div>
          </div>
          <div className="header-right">
            {updateAvailable && (
              <button 
                className="icon-btn" 
                style={{ color: theme.accent.warning }}
                onClick={() => setActiveModal("update-check")}
                title="Update available"
              >
                <Download size={18} />
              </button>
            )}
            <button className="icon-btn" style={{ color: theme.accent.primary }}>
              <Bell size={18} />
              <span className="notification-badge" style={{ background: theme.accent.primary }}>3</span>
            </button>
            <div className="account-info">
              <div className="account-name" style={{ color: theme.text.primary }}>{user.name}</div>
              <div className="account-role" style={{ color: theme.text.secondary }}>{user.role}</div>
            </div>
            <div className="avatar" style={{ background: theme.gradient.primary }}>
              <span style={{ color: theme.accent.primary }}>
                {user.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Só mostra o conteúdo principal se o usuário existir */}
      {user && (
        <div className={`content-wrapper ${isTransitioning ? "transitioning" : ""}`}>
          {currentView === "menu" ? (
            <MenuView theme={theme} navigateToView={navigateToView} setActiveModal={setActiveModal} />
          ) : (
            <ContentView 
              theme={theme} 
              currentView={currentView} 
              navigateToView={navigateToView}
              user={user}
            />
          )}
        </div>
      )}

      {/* O ModalContainer deve renderizar mesmo sem usuário (para o registro) */}
      {activeModal && (
        <ModalContainer 
          theme={theme} 
          activeModal={activeModal} 
          setActiveModal={setActiveModal}
          user={user}
          setUser={setUser}
          updateAvailable={updateAvailable}
        />
      )}

      <AppStyles />
    </div>
  );
}

function MenuView({ theme, navigateToView, setActiveModal }: any) {
  
  const handleQuit = async () => {
    const appWindow = getCurrentWindow();
    await appWindow.close(); 
  };

  return (
    <div className="menu-content">
      {/* ... (código anterior do header e grid) ... */}
      
      {/* Mantenha o conteúdo do menu-header e menu-grid igual... */}
      <div className="menu-header">
        <h1 style={{ color: theme.text.primary }}>What would you like to do?</h1>
        <p style={{ color: theme.text.secondary }}>Choose an action below to get started</p>
      </div>

      <div className="menu-grid">
         {/* ... Seus MenuCards ... */}
         <MenuCard
          icon={<Building2 size={24} />}
          title="Select Branch"
          description="Choose your working branch"
          onClick={() => navigateToView("select-branch")}
          theme={theme}
        />
        <MenuCard
          icon={<Package size={24} />}
          title="Inbox"
          description="Manage your tasks"
          onClick={() => navigateToView("inbox")}
          theme={theme}
        />
        <MenuCard
          icon={<Bell size={24} />}
          title="Notifications"
          description="View your notifications"
          onClick={() => navigateToView("notifications")}
          theme={theme}
        />
        <MenuCard
          icon={<BarChart3 size={24} />}
          title="View Metrics"
          description="Track your performance"
          onClick={() => navigateToView("metrics")}
          theme={theme}
        />
        <MenuCard
          icon={<Activity size={24} />}
          title="Your Productivity"
          description="See your progress"
          onClick={() => navigateToView("productivity")}
          theme={theme}
        />
        <MenuCard
          icon={<Calendar size={24} />}
          title="View Workload"
          description="Manage your schedule"
          onClick={() => navigateToView("workload")}
          theme={theme}
        />
      </div>

      <div className="menu-footer">
        <div className="separator" style={{ background: theme.divider }}></div>
        <div className="footer-actions">
          <FooterButton
            icon={<Settings size={16} />}
            label="Settings"
            onClick={() => setActiveModal("settings")}
            theme={theme}
          />
          <FooterButton
            icon={<Info size={16} />}
            label="About"
            onClick={() => setActiveModal("about")}
            theme={theme}
          />
          {/* AQUI ESTÁ A ALTERAÇÃO: Usando handleQuit ao invés de window.close direto */}
          <FooterButton
            icon={<LogOut size={16} />}
            label="Quit"
            onClick={handleQuit}
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
}

// ==================== CONTENT VIEW ====================
function ContentView({ theme, currentView, navigateToView, user }: any) {
  return (
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
          <ChevronLeft size={20} />
          <span>Back to Menu</span>
        </button>
      </div>
      <div className="view-body">
        {currentView === "select-branch" && <SelectBranchView theme={theme} user={user} navigateToView={navigateToView} />}
        {currentView === "inbox" && <InboxView theme={theme} user={user} />}
        {currentView === "notifications" && <NotificationsView theme={theme} user={user} />}
        {currentView === "metrics" && <MetricsView theme={theme} user={user} />}
        {currentView === "productivity" && <ProductivityView theme={theme} user={user} />}
        {currentView === "workload" && <WorkloadView theme={theme} user={user} />}
      </div>
    </div>
  );
}

// ==================== INBOX VIEW ====================
function InboxView({ theme, user }: any) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    // Simulate API call - replace with actual Sheets integration
    setTimeout(() => {
      setTasks([
        {
          id: "1",
          title: "Complete project documentation",
          description: "Write comprehensive docs for the new feature",
          status: "InProgress",
          priority: "High",
          assigned_to: user.id,
          due_date: "2026-01-25",
          created_at: "2026-01-20T10:00:00Z"
        },
        {
          id: "2",
          title: "Review pull requests",
          description: "Check and approve pending PRs",
          status: "Pending",
          priority: "Normal",
          assigned_to: user.id,
          due_date: "2026-01-22",
          created_at: "2026-01-20T09:00:00Z"
        },
        {
          id: "3",
          title: "Update dependencies",
          description: "Update all npm packages",
          status: "Done",
          priority: "Low",
          assigned_to: user.id,
          created_at: "2026-01-19T14:00:00Z"
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  console.log(user.id);
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === "all" || task.status === filter;
    const matchesSearch = !searchQuery || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent": return theme.accent.error;
      case "High": return theme.accent.warning;
      case "Normal": return theme.accent.info;
      case "Low": return theme.accent.success;
      default: return theme.text.secondary;
    }
  };

  return (
    <div style={{ padding: '32px 24px', height: '100%', overflow: 'auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{
          color: theme.text.primary,
          fontSize: '32px',
          fontWeight: 800,
          letterSpacing: '-0.04em',
          marginBottom: '6px',
        }}>
          Inbox
        </h2>
        <p style={{ color: theme.text.secondary, fontSize: '15px' }}>
          {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
        </p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <Search size={18} style={{
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: theme.text.secondary,
          opacity: 0.5,
        }} />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '14px 16px 14px 44px',
            borderRadius: '12px',
            border: `2px solid ${theme.divider}`,
            background: theme.background.secondary,
            color: theme.text.primary,
            fontSize: '15px',
            outline: 'none',
          }}
        />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['all', 'Pending', 'InProgress', 'Done'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              background: filter === status 
                ? `linear-gradient(135deg, ${theme.accent.primary} 0%, ${theme.accent.secondary} 100%)`
                : theme.background.secondary,
              color: filter === status ? '#fff' : theme.text.primary,
              border: filter === status ? 'none' : `2px solid ${theme.divider}`,
              borderRadius: '12px',
              padding: '10px 18px',
              fontSize: '14px',
              fontWeight: filter === status ? 700 : 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {status === 'all' ? 'All' : status}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} color={theme.accent.primary} />
        </div>
      ) : filteredTasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: theme.text.secondary }}>
          <Package size={64} style={{ marginBottom: '20px', opacity: 0.3 }} />
          <p style={{ fontSize: '17px', fontWeight: 500 }}>No tasks found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              style={{
                background: theme.background.secondary,
                borderRadius: '16px',
                padding: '20px',
                border: `1px solid ${theme.divider}`,
                transition: 'all 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 8px 24px ${theme.accent.glow}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 600, color: theme.text.primary }}>
                  {task.title}
                </h3>
                <div style={{
                  padding: '4px 12px',
                  borderRadius: '8px',
                  background: `${getPriorityColor(task.priority)}20`,
                  color: getPriorityColor(task.priority),
                  fontSize: '12px',
                  fontWeight: 600,
                }}>
                  {task.priority}
                </div>
              </div>
              <p style={{ fontSize: '14px', color: theme.text.secondary, marginBottom: '12px' }}>
                {task.description}
              </p>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: theme.background.tertiary,
                  color: theme.text.secondary,
                  fontSize: '12px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  {task.status === "Done" ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                  {task.status}
                </div>
                {task.due_date && (
                  <div style={{ fontSize: '13px', color: theme.text.tertiary, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} />
                    Due: {new Date(task.due_date).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==================== NOTIFICATIONS VIEW ====================
function NotificationsView({ theme, user }: any) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setNotifications([
        {
          id: "1",
          title: "New task assigned",
          message: "You have been assigned to 'Complete project documentation'",
          type: "TaskAssigned",
          read: false,
          created_at: "2026-01-20T10:00:00Z"
        },
        {
          id: "2",
          title: "Task completed",
          message: "Task 'Update dependencies' has been completed",
          type: "TaskCompleted",
          read: false,
          created_at: "2026-01-20T09:00:00Z"
        },
        {
          id: "3",
          title: "Reminder",
          message: "Task 'Review pull requests' is due tomorrow",
          type: "Reminder",
          read: true,
          created_at: "2026-01-19T14:00:00Z"
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const filteredNotifications = notifications.filter(n => 
    filter === "all" || (filter === "unread" && !n.read) || n.type === filter
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ padding: '32px 24px', height: '100%', overflow: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h2 style={{
            color: theme.text.primary,
            fontSize: '32px',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}>
            Notifications
            {unreadCount > 0 && (
              <span style={{
                background: `linear-gradient(135deg, ${theme.accent.error} 0%, ${theme.accent.warning} 100%)`,
                color: '#fff',
                borderRadius: '12px',
                padding: '6px 14px',
                fontSize: '15px',
                fontWeight: 800,
              }}>
                {unreadCount}
              </span>
            )}
          </h2>
          <p style={{ color: theme.text.secondary, fontSize: '15px' }}>
            {filteredNotifications.length} {filteredNotifications.length === 1 ? 'notification' : 'notifications'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            style={{
              background: 'transparent',
              color: theme.accent.primary,
              border: `2px solid ${theme.accent.primary}`,
              borderRadius: '12px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = theme.accent.primary;
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = theme.accent.primary;
            }}
          >
            <CheckCheck size={16} />
            Mark all as read
          </button>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['all', 'unread', 'TaskAssigned', 'TaskCompleted', 'Reminder'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            style={{
              background: filter === type 
                ? `linear-gradient(135deg, ${theme.accent.primary} 0%, ${theme.accent.secondary} 100%)`
                : theme.background.secondary,
              color: filter === type ? '#fff' : theme.text.primary,
              border: filter === type ? 'none' : `2px solid ${theme.divider}`,
              borderRadius: '12px',
              padding: '10px 18px',
              fontSize: '14px',
              fontWeight: filter === type ? 700 : 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {type === 'all' ? 'All' : type === 'unread' ? 'Unread' : type}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} color={theme.accent.primary} />
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: theme.text.secondary }}>
          <Bell size={64} style={{ marginBottom: '20px', opacity: 0.3 }} />
          <p style={{ fontSize: '17px', fontWeight: 500 }}>No notifications</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => !notification.read && markAsRead(notification.id)}
              style={{
                background: notification.read ? theme.background.secondary : theme.background.active,
                borderRadius: '16px',
                padding: '20px',
                border: `1px solid ${notification.read ? theme.divider : theme.accent.primary + '40'}`,
                transition: 'all 0.2s',
                cursor: notification.read ? 'default' : 'pointer',
                opacity: notification.read ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!notification.read) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 8px 24px ${theme.accent.glow}`;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: theme.text.primary, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {!notification.read && (
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: theme.accent.primary,
                      boxShadow: `0 0 8px ${theme.accent.primary}`,
                    }} />
                  )}
                  {notification.title}
                </h3>
                <div style={{ fontSize: '12px', color: theme.text.tertiary }}>
                  {new Date(notification.created_at).toLocaleTimeString()}
                </div>
              </div>
              <p style={{ fontSize: '14px', color: theme.text.secondary }}>
                {notification.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SelectBranchView({ theme, navigateToView }: any) {
  return <SelectBranch onBranchSelected={() => navigateToView("menu")} />;
}

function MetricsView({ theme }: any) {
  return (
    <div style={{ padding: '60px', textAlign: 'center' }}>
      <BarChart3 size={64} style={{ marginBottom: '20px', opacity: 0.3 }} color={theme.text.secondary} />
      <h2 style={{ fontSize: '28px', fontWeight: 800, color: theme.text.primary, marginBottom: '12px' }}>
        Performance Metrics
      </h2>
      <p style={{ fontSize: '15px', color: theme.text.secondary }}>
        Metrics dashboard will show real data from Google Sheets
      </p>
    </div>
  );
}

function ProductivityView({ theme }: any) {
  return (
    <div style={{ padding: '60px', textAlign: 'center' }}>
      <TrendingUp size={64} style={{ marginBottom: '20px', opacity: 0.3 }} color={theme.text.secondary} />
      <h2 style={{ fontSize: '28px', fontWeight: 800, color: theme.text.primary, marginBottom: '12px' }}>
        Your Productivity
      </h2>
      <p style={{ fontSize: '15px', color: theme.text.secondary }}>
        Track your progress and achievements
      </p>
    </div>
  );
}

function WorkloadView({ theme }: any) {
  return (
    <div style={{ padding: '60px', textAlign: 'center' }}>
      <Calendar size={64} style={{ marginBottom: '20px', opacity: 0.3 }} color={theme.text.secondary} />
      <h2 style={{ fontSize: '28px', fontWeight: 800, color: theme.text.primary, marginBottom: '12px' }}>
        Workload Management
      </h2>
      <p style={{ fontSize: '15px', color: theme.text.secondary }}>
        Organize your tasks and schedule
      </p>
    </div>
  );
}

// ==================== MODAL CONTAINER ====================
function ModalContainer({ theme, activeModal, setActiveModal, user, setUser, updateAvailable }: any) {
  return (
    <div
      className="modal-overlay"
      onClick={() => activeModal !== "register-user" && setActiveModal(null)}
      style={{ background: theme.background.modalOverlay }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: theme.background.modal,
          borderColor: theme.divider,
        }}
      >
        <div className="modal-header" style={{ borderBottomColor: theme.divider }}>
          <h3 style={{ color: theme.text.primary }}>
            {activeModal === "settings" ? "Settings" : 
             activeModal === "about" ? "About" : 
             activeModal === "update-check" ? "Updates" : "Register User"}
          </h3>
          {activeModal !== "register-user" && (
            <button
              className="modal-close"
              onClick={() => setActiveModal(null)}
              style={{ color: theme.text.secondary }}
            >
              <X size={20} />
            </button>
          )}
        </div>
        <div className="modal-body">
          {activeModal === "settings" && <SettingsContent theme={theme} />}
          {activeModal === "about" && <AboutContent theme={theme} />}
          {activeModal === "update-check" && <UpdateCheckContent theme={theme} updateAvailable={updateAvailable} />}
          {activeModal === "register-user" && <RegisterUserContent theme={theme} setUser={setUser} setActiveModal={setActiveModal} />}
        </div>
      </div>
    </div>
  );
}

// ==================== MODAL CONTENTS ====================
function SettingsContent({ theme }: any) {
  const { setThemeName } = useTheme();
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [notifications, setNotifications] = useState(true);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h4 style={{ fontSize: '16px', fontWeight: 700, color: theme.text.primary, marginBottom: '16px' }}>
          Appearance
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.values(themes).map((t: any) => (
            <div
              key={t.name}
              onClick={() => setThemeName(t.name)}
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: theme.background.secondary,
                border: `1px solid ${theme.divider}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(4px)';
                e.currentTarget.style.borderColor = theme.accent.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.borderColor = theme.divider;
              }}
            >
              <div style={{ fontSize: '15px', fontWeight: 600, color: theme.text.primary }}>
                {t.displayName}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 style={{ fontSize: '16px', fontWeight: 700, color: theme.text.primary, marginBottom: '16px' }}>
          Preferences
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={autoUpdate}
              onChange={(e) => setAutoUpdate(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '15px', color: theme.text.primary }}>
              Automatically check for updates
            </span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '15px', color: theme.text.primary }}>
              Enable desktop notifications
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}

function AboutContent({ theme }: any) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>
        <Zap size={48} color={theme.accent.primary} />
      </div>
      <h4 style={{ fontSize: '18px', fontWeight: 700, color: theme.text.primary, marginBottom: '8px' }}>
        Productivity System
      </h4>
      <p style={{ fontSize: '14px', color: theme.text.secondary, marginBottom: '16px' }}>Version 0.1.1</p>
      <p style={{ fontSize: '14px', color: theme.text.secondary, lineHeight: '1.6' }}>
        A modern productivity application designed to help you manage your work efficiently with Google Sheets integration.
      </p>
    </div>
  );
}

function UpdateCheckContent({ theme, updateAvailable }: any) {
  if (!updateAvailable) {
    return (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <CheckCircle2 size={48} color={theme.accent.success} style={{ marginBottom: '16px' }} />
        <h4 style={{ fontSize: '18px', fontWeight: 700, color: theme.text.primary, marginBottom: '8px' }}>
          You're up to date!
        </h4>
        <p style={{ fontSize: '14px', color: theme.text.secondary }}>
          You have the latest version installed
        </p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <Download size={48} color={theme.accent.primary} style={{ marginBottom: '16px' }} />
      <h4 style={{ fontSize: '18px', fontWeight: 700, color: theme.text.primary, marginBottom: '8px' }}>
        Update Available
      </h4>
      <p style={{ fontSize: '14px', color: theme.text.secondary, marginBottom: '20px' }}>
        A new version is available on GitHub
      </p>
      <button
        onClick={() => window.open('https://github.com/xiiiter/Productivity-SystemTray/releases/latest', '_blank')}
        style={{
          background: `linear-gradient(135deg, ${theme.accent.primary} 0%, ${theme.accent.secondary} 100%)`,
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          padding: '12px 24px',
          fontSize: '15px',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          margin: '0 auto',
        }}
      >
        <Download size={16} />
        Download Update
      </button>
    </div>
  );
}

function RegisterUserContent({ theme, setUser, setActiveModal }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    if (!name || !email || !role) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    
    // Simulate API call to register user in Google Sheets
    setTimeout(() => {
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        role,
      };
      
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      setLoading(false);
      setActiveModal(null);
    }, 1500);
  };

  return (
    <div style={{ padding: '20px 0' }}>
      <p style={{ fontSize: '14px', color: theme.text.secondary, marginBottom: '24px', textAlign: 'center' }}>
        Please register to use the application
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ fontSize: '14px', color: theme.text.secondary, marginBottom: '8px', display: 'block' }}>
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              border: `2px solid ${theme.divider}`,
              background: theme.background.secondary,
              color: theme.text.primary,
              fontSize: '15px',
              outline: 'none',
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '14px', color: theme.text.secondary, marginBottom: '8px', display: 'block' }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              border: `2px solid ${theme.divider}`,
              background: theme.background.secondary,
              color: theme.text.primary,
              fontSize: '15px',
              outline: 'none',
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '14px', color: theme.text.secondary, marginBottom: '8px', display: 'block' }}>
            Role
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Developer"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              border: `2px solid ${theme.divider}`,
              background: theme.background.secondary,
              color: theme.text.primary,
              fontSize: '15px',
              outline: 'none',
            }}
          />
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          style={{
            background: `linear-gradient(135deg, ${theme.accent.primary} 0%, ${theme.accent.secondary} 100%)`,
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '14px 24px',
            fontSize: '15px',
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '8px',
          }}
        >
          {loading ? (
            <>
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              Registering...
            </>
          ) : (
            <>
              <User size={16} />
              Register
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ==================== HELPER COMPONENTS ====================
function MenuCard({ icon, title, description, onClick, theme }: any) {
  return (
    <div
      className="menu-card"
      onClick={onClick}
      style={{
        animation: 'fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div className="card-icon" style={{ background: theme.gradient.primary, color: theme.accent.primary }}>
        {icon}
      </div>
      <div className="card-title" style={{ color: theme.text.primary }}>{title}</div>
      <div className="card-description" style={{ color: theme.text.secondary }}>{description}</div>
    </div>
  );
}

function FooterButton({ icon, label, onClick, theme }: any) {
  return (
    <button
      className="footer-btn"
      onClick={onClick}
      style={{
        background: theme.background.secondary,
        color: theme.text.secondary,
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// ==================== STYLES ====================
function AppStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      html, body, #root {
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .app-container {
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: hidden;
        border-radius: 16px;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .animated-bg {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        pointer-events: none;
        z-index: 0;
      }

      .bg-gradient-1, .bg-gradient-2 {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        opacity: 0.3;
        animation: float 20s ease-in-out infinite;
      }

      .bg-gradient-1 {
        width: 600px;
        height: 600px;
        top: -200px;
        right: -200px;
      }

      .bg-gradient-2 {
        width: 500px;
        height: 500px;
        bottom: -150px;
        left: -150px;
        animation-delay: -10s;
      }

      @keyframes float {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(30px, -30px) scale(1.1); }
        66% { transform: translate(-20px, 20px) scale(0.9); }
      }

      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 24px;
        border-bottom: 1px solid;
        backdrop-filter: blur(20px);
        z-index: 10;
        position: relative;
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .logo {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .logo-icon {
        width: 36px;
        height: 36px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }

      .header-title {
        font-size: 16px;
        font-weight: 600;
        letter-spacing: -0.5px;
      }

      .status-badge {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 600;
        border: 1px solid;
        letter-spacing: -0.2px;
      }

      .status-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        animation: pulse 2s ease-in-out infinite;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(1.2); }
      }

      .header-right {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .icon-btn {
        position: relative;
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
        border-radius: 8px;
        transition: all 0.2s;
      }

      .icon-btn:hover {
        background: rgba(255, 255, 255, 0.05);
        transform: translateY(-2px);
      }

      .notification-badge {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 9px;
        font-weight: 700;
        color: white;
      }

      .account-info {
        text-align: right;
      }

      .account-name {
        font-size: 13px;
        font-weight: 600;
        letter-spacing: -0.3px;
      }

      .account-role {
        font-size: 11px;
        font-weight: 500;
        letter-spacing: -0.2px;
      }

      .avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s;
      }

      .avatar:hover {
        transform: scale(1.1);
      }

      .content-wrapper {
        flex: 1;
        overflow: hidden;
        position: relative;
        z-index: 1;
        transition: opacity 0.2s;
      }

      .content-wrapper.transitioning {
        opacity: 0;
      }

      .menu-content {
        height: 100%;
        padding: 40px 32px;
        overflow-y: auto;
        animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .menu-header {
        margin-bottom: 40px;
      }

      .menu-header h1 {
        font-size: 32px;
        font-weight: 800;
        letter-spacing: -1px;
        margin-bottom: 8px;
      }

      .menu-header p {
        font-size: 15px;
        font-weight: 500;
        letter-spacing: -0.3px;
        opacity: 0.8;
      }

      .menu-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        margin-bottom: 32px;
      }

      .menu-footer {
        margin-top: auto;
      }

      .separator {
        height: 1px;
        margin: 24px 0;
      }

      .footer-actions {
        display: flex;
        gap: 12px;
      }

      .menu-card {
        background: rgba(255, 255, 255, 0.03);
        border-radius: 16px;
        padding: 24px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid rgba(255, 255, 255, 0.05);
        position: relative;
        overflow: hidden;
      }

      .menu-card:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        border-color: rgba(255, 255, 255, 0.15);
      }

      .card-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16px;
        transition: all 0.3s;
      }

      .menu-card:hover .card-icon {
        transform: scale(1.1) rotate(5deg);
      }

      .card-title {
        font-size: 18px;
        font-weight: 700;
        letter-spacing: -0.5px;
        margin-bottom: 6px;
      }

      .card-description {
        font-size: 13px;
        font-weight: 500;
        letter-spacing: -0.2px;
        opacity: 0.7;
      }

      .footer-btn {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px 16px;
        border: none;
        border-radius: 12px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }

      .footer-btn:hover {
        transform: translateY(-2px);
      }

      .view-content {
        height: 100%;
        display: flex;
        flex-direction: column;
        animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      .view-header {
        padding: 20px 24px;
        border-bottom: 1px solid;
        backdrop-filter: blur(20px);
      }

      .back-button {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 18px;
        border: none;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }

      .back-button:hover {
        transform: translateX(-4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }

      .view-body {
        flex: 1;
        overflow-y: auto;
      }

      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        backdrop-filter: blur(12px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      .modal-content {
        border-radius: 20px;
        border: 1px solid;
        width: 90%;
        max-width: 480px;
        max-height: 80vh;
        overflow: hidden;
        animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(40px);
      }

      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.9);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 24px;
        border-bottom: 1px solid;
      }

      .modal-header h3 {
        font-size: 20px;
        font-weight: 700;
        letter-spacing: -0.5px;
      }

      .modal-close {
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
        border-radius: 8px;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .modal-close:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: rotate(90deg);
      }

      .modal-body {
        padding: 24px;
        overflow-y: auto;
        max-height: calc(80vh - 100px);
      }

      ::-webkit-scrollbar {
        width: 8px;
      }

      ::-webkit-scrollbar-track {
        background: transparent;
      }

      ::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    `}</style>
  );
}

export default App;