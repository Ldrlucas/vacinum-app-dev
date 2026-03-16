import type { UserProfile, Unidade } from '../supabase'

const UNIDADES_MOCK: Unidade[] = [
  { id: 1, nome: 'Toledo', cidade: 'Toledo', endereco: 'Rua exemplo, 123 — Centro', telefone: '(45) 99999-9999', horario: 'Seg-Sex 8h–18h • Sáb 8h–12h', ativo: true },
  { id: 2, nome: 'Mal. Cândido Rondon', cidade: 'Marechal Cândido Rondon', endereco: 'Rua exemplo, 456 — Centro', telefone: '(45) 99999-8888', horario: 'Seg-Sex 8h–18h • Sáb 8h–12h', ativo: true },
]

interface Props {
  profile: UserProfile
  onSelect: (unidade: Unidade) => void
  onLogout: () => void
}

export default function UnidadePage({ profile, onSelect, onLogout }: Props) {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0e3d6b 0%, #1a5f9e 50%, #2980b9 100%)', fontFamily: "'Montserrat', sans-serif", padding: '48px 20px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '680px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
              <path d="M50 8 L82 33 L67 62 L50 78 L33 62 L18 33 Z" fill="white" opacity="0.95"/>
              <path d="M28 66 Q50 92 72 66" stroke="white" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.9"/>
            </svg>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 800, fontSize: '22px', color: 'white', letterSpacing: '4px' }}>VACINUM</div>
              <div style={{ fontWeight: 400, fontSize: '9px', color: 'rgba(255,255,255,0.7)', letterSpacing: '2.5px' }}>CLÍNICA DE VACINAS</div>
            </div>
          </div>
          <div style={{ color: 'white', fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>
            Olá, {profile.nome.split(' ')[0]}! 👋
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Em qual unidade deseja ser atendido?</div>
          <button onClick={onLogout} style={{ marginTop: '14px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '20px', color: 'rgba(255,255,255,0.7)', padding: '6px 18px', fontSize: '13px', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif" }}>
            ← Trocar conta
          </button>
        </div>

        {/* Cards unidades */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {UNIDADES_MOCK.map(u => (
            <button key={u.id} onClick={() => onSelect(u)}
              style={{ background: 'white', border: 'none', borderRadius: '20px', padding: '24px 28px', cursor: 'pointer', textAlign: 'left', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.18)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.12)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #e8f0fe, #c5d8f8)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>🏥</div>
                <div>
                  <div style={{ fontWeight: 800, color: '#0e3d6b', fontSize: '17px', marginBottom: '3px' }}>{u.nome}</div>
                  <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '10px' }}>PR</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ color: '#64748b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#e53e3e' }}>📍</span> {u.endereco}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>📞</span> {u.telefone}
                    </div>
                  </div>
                  <div style={{ marginTop: '12px', background: '#f0f9ff', borderRadius: '10px', padding: '8px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '12px' }}>🕐</span>
                    <span style={{ color: '#0369a1', fontSize: '12px', fontWeight: 600 }}>{u.horario}</span>
                  </div>
                </div>
              </div>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #1a5f9e, #2980b9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '18px', flexShrink: 0 }}>›</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}