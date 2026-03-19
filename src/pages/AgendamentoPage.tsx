import { useState } from 'react'
import { supabase } from '../supabase'
import { useAuth } from '../hooks/useAuth'
import type { Produto, Unidade } from '../supabase'

interface Props {
  produto: Produto
  unidade: Unidade
  onVoltar: () => void
  onSucesso: () => void
}

const HORARIOS = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30']

export default function AgendamentoPage({ produto, unidade, onVoltar, onSucesso }: Props) {
  const { user } = useAuth()
  const [unidadeSel, setUnidadeSel] = useState<'Toledo' | 'Marechal'>(unidade.cidade === 'Toledo' ? 'Toledo' : 'Marechal')
  const [data, setData] = useState('')
  const [horario, setHorario] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const hoje = new Date().toISOString().split('T')[0]

  function isDomingo(dateStr: string) {
    if (!dateStr) return false
    return new Date(dateStr + 'T00:00:00').getDay() === 0
  }

  async function confirmar() {
    if (!data) { setErro('Selecione uma data'); return }
    if (isDomingo(data)) { setErro('Não atendemos aos domingos'); return }
    if (!horario) { setErro('Selecione um horário'); return }
    if (!user) { setErro('Usuário não autenticado'); return }

    setLoading(true)
    setErro('')

    const unidadeId = unidadeSel === 'Toledo' ? 1 : 2

    const { error } = await supabase.from('agendamentos').insert({
      paciente_id: user.id,
      produto_id: produto.id,
      unidade_id: unidadeId,
      data,
      horario,
      status: 'pendente'
    })

    setLoading(false)

    if (error) {
      setErro('Erro ao agendar. Tente novamente.')
      console.error(error)
      return
    }

    onSucesso()
  }

  return (
    <div style={{ fontFamily: "'Montserrat', sans-serif", minHeight: '100vh', background: '#f0f4f8' }}>

      <div style={{ background: 'linear-gradient(135deg, #0e3d6b, #1a5f9e)', padding: '14px 20px', position: 'sticky', top: 0, zIndex: 100 }}>
        <button onClick={onVoltar} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Montserrat', sans-serif", padding: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
          ← Voltar
        </button>
      </div>

      <div style={{ padding: '20px 16px 100px' }}>

        <div style={{ background: 'linear-gradient(135deg, #0e3d6b, #1a5f9e)', borderRadius: '16px', padding: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ fontSize: '40px' }}>{produto.icone || '💉'}</div>
          <div>
            <div style={{ color: 'white', fontWeight: 800, fontSize: '17px' }}>{produto.nome}</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginTop: '3px' }}>
              {produto.preco}{produto.doses ? ` · ${produto.doses}` : ''}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>UNIDADE</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {(['Toledo', 'Marechal'] as const).map(u => (
              <button key={u} onClick={() => setUnidadeSel(u)}
                style={{ padding: '14px', borderRadius: '12px', border: `2px solid ${unidadeSel === u ? '#1a5f9e' : '#e2e8f0'}`, background: unidadeSel === u ? '#eff6ff' : 'white', color: unidadeSel === u ? '#0e3d6b' : '#64748b', fontWeight: unidadeSel === u ? 700 : 500, fontSize: '14px', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.15s' }}>
                🏥 {u}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>DATA</div>
          <input type="date" value={data} onChange={e => { setData(e.target.value); setHorario(''); setErro('') }}
            min={hoje}
            style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px', fontFamily: "'Montserrat', sans-serif", outline: 'none', boxSizing: 'border-box', background: 'white', color: '#0e3d6b' }} />
          {data && isDomingo(data) && (
            <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px' }}>Não atendemos aos domingos. Escolha outro dia.</p>
          )}
        </div>

        {data && !isDomingo(data) && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>HORÁRIOS DISPONÍVEIS</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {HORARIOS.map(h => (
                <button key={h} onClick={() => { setHorario(h); setErro('') }}
                  style={{ padding: '12px 4px', borderRadius: '10px', border: `2px solid ${horario === h ? '#1a5f9e' : '#e2e8f0'}`, background: horario === h ? '#0e3d6b' : 'white', color: horario === h ? 'white' : '#334155', fontSize: '13px', fontWeight: horario === h ? 700 : 500, fontFamily: "'Montserrat', sans-serif", cursor: 'pointer', transition: 'all 0.15s' }}>
                  {h}
                </button>
              ))}
            </div>
          </div>
        )}

        {erro && <p style={{ color: '#ef4444', fontSize: '13px', textAlign: 'center', marginBottom: '12px' }}>{erro}</p>}

        <button onClick={confirmar} disabled={!data || !horario || loading || isDomingo(data)}
          style={{ width: '100%', padding: '16px', borderRadius: '14px', border: 'none', background: (!data || !horario || isDomingo(data)) ? '#cbd5e1' : 'linear-gradient(135deg, #1a5f9e, #2980b9)', color: 'white', fontWeight: 700, fontSize: '15px', cursor: (!data || !horario) ? 'not-allowed' : 'pointer', fontFamily: "'Montserrat', sans-serif", transition: 'all 0.2s' }}>
          {loading ? 'Agendando...' : 'Confirmar agendamento'}
        </button>
      </div>
    </div>
  )
}