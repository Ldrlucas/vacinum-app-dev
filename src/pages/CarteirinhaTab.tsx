import { useState } from 'react'
import type { UserProfile } from '../supabase'

const CARTEIRINHA_MOCK = [
  { vacina: 'Febre Amarela', data: '15/01/2024', dose: 'Única', lote: 'FAB2024-001', profissional: 'Dra. Ana Lima', proxima: null },
  { vacina: 'Influenza', data: '10/04/2025', dose: '1ª dose', lote: 'INF2025-042', profissional: 'Enf. Carlos Souza', proxima: 'Abril 2026' },
  { vacina: 'Hepatite B', data: '05/03/2023', dose: '3ª dose', lote: 'HBV2023-017', profissional: 'Dra. Ana Lima', proxima: null },
]

interface Props { profile: UserProfile }

export default function CarteirinhaTab({ profile }: Props) {
  const [expandida, setExpandida] = useState<number | null>(null)
  const pendentes = CARTEIRINHA_MOCK.filter(v => v.proxima).length

  return (
    <div style={{ fontFamily: "'Montserrat', sans-serif", padding: '20px 16px', background: '#f0f4f8', minHeight: '100%', width: '100%', boxSizing: 'border-box' as const }}>

      {/* Card carteirinha digital */}
      <div style={{ background: 'linear-gradient(135deg, #0e3d6b 0%, #1a5f9e 60%, #2980b9 100%)', borderRadius: '20px', padding: '24px', marginBottom: '28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'absolute', bottom: '-30px', right: '40px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
          <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
            <path d="M50 8 L82 33 L67 62 L50 78 L33 62 L18 33 Z" fill="white" opacity="0.5"/>
            <path d="M28 66 Q50 92 72 66" stroke="white" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.4"/>
          </svg>
        </div>
        <div style={{ fontSize: '11px', letterSpacing: '2px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>CARTEIRINHA DIGITAL</div>
        <div style={{ fontWeight: 800, fontSize: '24px', color: 'white', marginBottom: '4px' }}>{profile.nome}</div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '20px' }}>Paciente Vacinum</div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.5px' }}>VACINAS</div>
            <div style={{ fontWeight: 700, fontSize: '22px', color: 'white' }}>{CARTEIRINHA_MOCK.length}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.5px' }}>PENDENTES</div>
            <div style={{ fontWeight: 700, fontSize: '22px', color: '#fbbf24' }}>{pendentes}</div>
          </div>
        </div>
      </div>

      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0e3d6b', marginBottom: '14px' }}>Histórico de Vacinação</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {CARTEIRINHA_MOCK.map((v, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div onClick={() => setExpandida(expandida === i ? null : i)}
              style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>💉</div>
                <div>
                  <div style={{ fontWeight: 700, color: '#0e3d6b', fontSize: '15px' }}>{v.vacina}</div>
                  <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>{v.data} · {v.dose}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {v.proxima && (
                  <span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>
                    Reforço: {v.proxima}
                  </span>
                )}
                <span style={{ color: '#94a3b8', fontSize: '16px' }}>{expandida === i ? '▲' : '▼'}</span>
              </div>
            </div>
            {expandida === i && (
              <div style={{ padding: '0 18px 16px', borderTop: '1px solid #f1f5f9' }}>
                {[['Lote', v.lote], ['Profissional', v.profissional], ['Próxima dose', v.proxima || 'Não necessária']].map(([k, val]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f8fafc' }}>
                    <span style={{ color: '#94a3b8', fontSize: '13px' }}>{k}</span>
                    <span style={{ color: '#334155', fontWeight: 600, fontSize: '13px' }}>{val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}