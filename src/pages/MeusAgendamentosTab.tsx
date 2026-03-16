import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import type { UserProfile, Agendamento } from '../supabase'

interface Props {
  profile: UserProfile
}

const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  pendente: { bg: '#fff3cd', color: '#856404', label: 'Pendente' },
  confirmado: { bg: '#d1e7dd', color: '#0a3622', label: 'Confirmado' },
  realizado: { bg: '#cfe2ff', color: '#084298', label: 'Realizado' },
  cancelado: { bg: '#f8d7da', color: '#842029', label: 'Cancelado' },
}

export default function MeusAgendamentosTab({ profile }: Props) {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('agendamentos')
      .select('*, produtos(nome, icone), unidades(nome, cidade)')
      .eq('paciente_id', profile.id)
      .order('data', { ascending: false })
      .then(({ data }) => {
        if (data) setAgendamentos(data)
        setLoading(false)
      })
  }, [])

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#999', fontFamily: "'Montserrat', sans-serif" }}>Carregando...</div>

  return (
    <div style={{ padding: '20px 16px', fontFamily: "'Montserrat', sans-serif" }}>
      <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0e3d6b', margin: '0 0 4px' }}>📅 Meus Agendamentos</h2>
      <p style={{ color: '#666', fontSize: '13px', margin: '0 0 20px' }}>Histórico e próximos agendamentos</p>
      {agendamentos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
          <div style={{ fontWeight: '700', marginBottom: '8px' }}>Nenhum agendamento</div>
          <div style={{ fontSize: '13px' }}>Seus agendamentos aparecerão aqui</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {agendamentos.map(ag => {
            const s = STATUS_COLORS[ag.status] || STATUS_COLORS.pendente
            return (
              <div key={ag.id} style={{ background: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f0f4f8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ fontSize: '28px' }}>{ag.produtos?.icone || '💉'}</div>
                    <div>
                      <div style={{ fontWeight: '700', color: '#0e3d6b', fontSize: '14px' }}>{ag.produtos?.nome}</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>{ag.unidades?.nome}</div>
                    </div>
                  </div>
                  <span style={{ background: s.bg, color: s.color, padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>{s.label}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ flex: 1, background: '#f0f4f8', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: '#888', marginBottom: '2px' }}>DATA</div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#0e3d6b' }}>{new Date(ag.data + 'T00:00:00').toLocaleDateString('pt-BR')}</div>
                  </div>
                  <div style={{ flex: 1, background: '#f0f4f8', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: '#888', marginBottom: '2px' }}>HORÁRIO</div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#0e3d6b' }}>{ag.horario}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}