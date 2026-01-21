// src/views/SelectBranch.tsx - Design Profissional

import { useState, useEffect } from 'react';
import { useBranch } from '../hooks/useBranch';
import { useTheme } from '../App';
import { Branch } from '../types/branch_types';

// Ícones SVG Profissionais
const Icons = {
  Building: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
      <path d="M9 22v-4h6v4"/>
      <path d="M8 6h.01"/>
      <path d="M16 6h.01"/>
      <path d="M12 6h.01"/>
      <path d="M12 10h.01"/>
      <path d="M12 14h.01"/>
      <path d="M16 10h.01"/>
      <path d="M16 14h.01"/>
      <path d="M8 10h.01"/>
      <path d="M8 14h.01"/>
    </svg>
  ),
  User: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Clock: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  AlertCircle: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  Loader: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spinner">
      <line x1="12" y1="2" x2="12" y2="6"/>
      <line x1="12" y1="18" x2="12" y2="22"/>
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
      <line x1="2" y1="12" x2="6" y2="12"/>
      <line x1="18" y1="12" x2="22" y2="12"/>
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
    </svg>
  ),
};

export function SelectBranch({ onBranchSelected }: { onBranchSelected?: () => void }) {
  const { theme } = useTheme();
  const { branches, currentBranch, selectBranch, loading } = useBranch();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    if (currentBranch) {
      setSelectedId(currentBranch.id);
    }
  }, [currentBranch]);

  const handleSelect = async (branch: Branch) => {
    if (isSelecting || !branch.active) return;
    
    try {
      setIsSelecting(true);
      setSelectedId(branch.id);
      await selectBranch(branch.id);
      
      setTimeout(() => {
        if (onBranchSelected) {
          onBranchSelected();
        }
      }, 300);
    } catch (error) {
      console.error('Failed to select branch:', error);
      alert('Failed to select branch. Please try again.');
      setSelectedId(currentBranch?.id || null);
    } finally {
      setIsSelecting(false);
    }
  };

  if (loading) {
    return (
      <div
        className="fade-in"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          gap: '20px',
        }}
      >
        <div style={{ color: theme.accent.primary }}>
          <Icons.Loader />
        </div>
        <div style={{ 
          color: theme.text.secondary, 
          fontSize: '15px',
          fontWeight: 500,
          letterSpacing: '-0.02em',
        }}>
          Loading branches...
        </div>
      </div>
    );
  }

  return (
    <div
      className="fade-in"
      style={{
        padding: '32px 24px',
        height: '100%',
        overflow: 'auto',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2
          style={{
            color: theme.text.primary,
            fontSize: '28px',
            fontWeight: 700,
            marginBottom: '8px',
            letterSpacing: '-0.03em',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div style={{ color: theme.accent.primary }}>
            <Icons.Building />
          </div>
          Select Your Branch
        </h2>
        <p
          style={{
            color: theme.text.secondary,
            fontSize: '15px',
            fontWeight: 400,
            letterSpacing: '-0.01em',
            lineHeight: '1.5',
          }}
        >
          Choose the branch you want to work with
        </p>
      </div>

      {/* Empty State */}
      {branches.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '80px 20px',
            color: theme.text.secondary,
          }}
        >
          <div style={{ 
            marginBottom: '20px', 
            opacity: 0.3,
            display: 'flex',
            justifyContent: 'center',
          }}>
            <div style={{ color: theme.text.tertiary, transform: 'scale(3)' }}>
              <Icons.AlertCircle />
            </div>
          </div>
          <div style={{ 
            fontSize: '17px',
            fontWeight: 600,
            color: theme.text.primary,
            marginBottom: '8px',
          }}>
            No branches available
          </div>
          <div style={{ 
            fontSize: '14px',
            color: theme.text.tertiary,
          }}>
            Contact your administrator to get access
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {branches.map((branch, index) => (
            <BranchCard
              key={branch.id}
              branch={branch}
              isSelected={selectedId === branch.id}
              isCurrent={currentBranch?.id === branch.id}
              onSelect={() => handleSelect(branch)}
              disabled={isSelecting || !branch.active}
              theme={theme}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface BranchCardProps {
  branch: Branch;
  isSelected: boolean;
  isCurrent: boolean;
  onSelect: () => void;
  disabled: boolean;
  theme: any;
  index: number;
}

function BranchCard({
  branch,
  isSelected,
  isCurrent,
  onSelect,
  disabled,
  theme,
  index,
}: BranchCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="slide-in card-hover"
      onClick={disabled ? undefined : onSelect}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '20px',
        borderRadius: '16px',
        background: isSelected
          ? `linear-gradient(135deg, ${theme.background.active} 0%, ${theme.background.secondary} 100%)`
          : theme.background.secondary,
        border: isCurrent
          ? `2px solid ${theme.accent.primary}`
          : `1px solid ${theme.divider}`,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: disabled ? 0.5 : 1,
        transform: isHovered && !disabled 
          ? 'translateY(-4px) scale(1.01)' 
          : 'translateY(0) scale(1)',
        boxShadow: isHovered && !disabled
          ? `0 12px 32px -8px ${theme.accent.glow}, 0 4px 16px -4px ${theme.accent.glow}`
          : isCurrent 
          ? `0 4px 16px -4px ${theme.accent.glow}`
          : '0 2px 8px rgba(0, 0, 0, 0.1)',
        animationDelay: `${index * 0.08}s`,
        backdropFilter: 'blur(20px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        {/* Left Section */}
        <div style={{ flex: 1 }}>
          {/* Branch Name + Status */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            marginBottom: '12px',
          }}>
            <h3
              style={{
                color: theme.text.primary,
                fontSize: '17px',
                fontWeight: 600,
                letterSpacing: '-0.02em',
              }}
            >
              {branch.name}
            </h3>
            {!branch.active && (
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: '8px',
                  background: 'rgba(255, 59, 48, 0.15)',
                  color: '#FF3B30',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Icons.AlertCircle />
                Inactive
              </span>
            )}
          </div>

          {/* Branch Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Manager */}
            <div
              style={{
                color: theme.text.secondary,
                fontSize: '14px',
                fontWeight: 400,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ opacity: 0.6, display: 'flex' }}>
                <Icons.User />
              </span>
              <span>
                Manager: <span style={{ fontWeight: 500 }}>{branch.manager}</span>
              </span>
            </div>

            {/* Working Hours */}
            {branch.config && (
              <div
                style={{
                  color: theme.text.tertiary,
                  fontSize: '13px',
                  fontWeight: 400,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ opacity: 0.6, display: 'flex' }}>
                  <Icons.Clock />
                </span>
                <span>
                  {branch.config.working_hours.start} - {branch.config.working_hours.end}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Status Badges */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'flex-end', 
          gap: '8px',
        }}>
          {isCurrent && (
            <div
              className="scale-in"
              style={{
                padding: '6px 14px',
                borderRadius: '10px',
                background: theme.accent.primary,
                color: '#fff',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.01em',
                boxShadow: `0 4px 12px ${theme.accent.glow}`,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Icons.Check />
              Current
            </div>
          )}

          {isSelected && !isCurrent && (
            <div
              className="scale-in"
              style={{
                padding: '6px 14px',
                borderRadius: '10px',
                background: theme.accent.primary + '30',
                color: theme.accent.primary,
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.01em',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Icons.Check />
              Selected
            </div>
          )}

          {/* Chevron Indicator */}
          {!disabled && (
            <div
              style={{
                color: theme.text.tertiary,
                opacity: isHovered ? 1 : 0.5,
                transition: 'all 0.2s ease',
                transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
              }}
            >
              <Icons.ChevronRight />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}