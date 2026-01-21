// src/TestBranches.tsx
// Use este componente TEMPORÁRIO para testar

import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

export function TestBranches() {
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const test = async () => {
      try {
        console.log('=== TESTE INICIADO ===');
        const result = await invoke('get_all_branches');
        console.log('Resultado RAW:', result);
        console.log('Tipo:', typeof result);
        console.log('É array?', Array.isArray(result));
        console.log('JSON:', JSON.stringify(result, null, 2));
        
        if (Array.isArray(result)) {
          setBranches(result);
        } else {
          setError('Resposta não é um array');
        }
      } catch (e: any) {
        console.error('ERRO:', e);
        setError(e.toString());
      } finally {
        setLoading(false);
      }
    };
    
    test();
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Carregando...</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>Erro: {error}</div>;

  return (
    <div style={{ padding: 20, background: '#1a1a1a', color: 'white', minHeight: '100vh' }}>
      <h1>🧪 Teste de Branches</h1>
      <p>Total de branches: {branches.length}</p>
      
      <div style={{ marginTop: 20 }}>
        {branches.length === 0 ? (
          <p style={{ color: 'yellow' }}>⚠️ Nenhuma branch retornada!</p>
        ) : (
          branches.map((branch, index) => (
            <div 
              key={index} 
              style={{ 
                background: '#2a2a2a', 
                padding: 15, 
                marginBottom: 10, 
                borderRadius: 8,
                border: branch.active ? '2px solid green' : '2px solid red'
              }}
            >
              <h3>Branch {index + 1}</h3>
              <pre style={{ fontSize: 12, overflow: 'auto' }}>
                {JSON.stringify(branch, null, 2)}
              </pre>
              <div style={{ marginTop: 10 }}>
                <strong>Active:</strong> {String(branch.active)} (tipo: {typeof branch.active})
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}