// frontend/views/SelectBranch.tsx

import { useState, useEffect } from 'react';
import { useBranch } from '../hooks/useBranch';
import { useTheme } from '../App'; // Seu ThemeContext existente
import { Branch } from '../types/branch.types';

export function SelectBranch() {
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
    if (isSelecting) return;
    
    try {
      setIsSelecting(true);
      await selectBranch(branch.id);
      // Navegar de volta ao menu ou dashboard
    } catch (error) {
      console.error('Failed to select branch:', error);
      // Mostrar erro ao usuário
    } finally {
      setIsSelecting(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        color: theme.text.secondary,
      }}>
        <div>Loading branches...</div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      height: '100%',
      overflow: 'auto',
    }}>
      <h2 style={{
        color: theme.text.primary,
        fontSize: '18px',
        fontWeight: 500,
        marginBottom: '16px',
      }}>
        Select Branch
      </h2>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {branches.map((branch) => (
          <BranchCard
            key={branch.id}
            branch={branch}
            isSelected={selectedId === branch.id}
            isCurrent={currentBranch?.id === branch.id}
            onSelect={() => handleSelect(branch)}
            disabled={isSelecting}
            theme={theme}
          />
        ))}
      </div>
    </div>
  );
}

function BranchCard({ branch, isSelected, isCurrent, onSelect, disabled, theme }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={disabled ? undefined : onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '16px',
        borderRadius: '12px',
        background: isSelected 
          ? theme.background.active 
          : isHovered 
          ? theme.background.hover 
          : theme.background.secondary,
        border: isCurrent 
          ? `2px solid ${theme.accent.primary}` 
          : '2px solid transparent',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <h3 style={{
            color: theme.text.primary,
            fontSize: '15px',
            fontWeight: 500,
            marginBottom: '4px',
          }}>
            {branch.name}
          </h3>
          <p style={{
            color: theme.text.secondary,
            fontSize: '12px',
          }}>
            Manager: {branch.manager}
          </p>
        </div>

        {isCurrent && (
          <div style={{
            padding: '4px 8px',
            borderRadius: '4px',
            background: theme.accent.primary,
            color: '#fff',
            fontSize: '11px',
            fontWeight: 500,
          }}>
            Current
          </div>
        )}
      </div>
    </div>
  );
}