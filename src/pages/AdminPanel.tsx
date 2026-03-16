import { useState } from 'react'
import type { UserProfile } from '../supabase'

interface Props {
  profile: UserProfile
  onLogout: () => void
}

const AGENDAMENTOS_MOCK = [
  { id: 1, paciente: 'Maria Silva', produto: 'Febre Amarela', horario: '09:00', unidade: 'Toledo', status: 'confirmado', data: '2026-03-20' },
  { id: 2, paciente: 'João Oliveira', produto: 'Influenza', horario: '10:30', unidade: 'Marechal', status: 'pendente', data: '2026-03-20' },
  { id: 3, paciente: 'Ana Costa', produto: 'HPV Nonavalente', horario: '14:00', unidade: 'Toledo', status: 'confirmado', data: '2026-03-21' },
  { id: 4, paciente: 'Pedro Santos', produto: 'Hepatite B', horario: '15:30', unidade: 'Marechal', status: 'cancelado', data: '2026-03-21' },
  { id: 5, paciente: 'Lucia Ferreira', produto: 'QDENGA', horario: '08:30', unidade: 'Toledo', status: 'realizado', data: '2026-03-22' },
  { id: 6, paciente: 'Carlos Mendes', produto: 'Meningo ACWY', horario: '09:30', unidade: 'Toledo', status: 'confirmado', data: '2026-03-22' },
  { id: 7, paciente: 'Fernanda Lima', produto: 'Herpes Zoster', horario: '11:00', unidade: 'Marechal', status: 'confirmado', data: '2026-03-23' },
  { id: 8, paciente: 'Roberto Souza', produto: 'Pneumo 20', horario: '14:30', unidade: 'Toledo', status: 'pendente', data: '2026-03-23' },
]

const VACINAS_MOCK = [
  { id: 1, nome: 'Gripe / Influenza', doses: 'Anual', preco: 'A consultar', icone: '🤧', ativo: true, vendas: 24, receita: 1800 },
  { id: 2, nome: 'Abrysvo (VSR)', doses: 'Dose única', preco: 'A consultar', icone: '🫁', ativo: true, vendas: 8, receita: 1600 },
  { id: 3, nome: 'Beyfortus (Nirsevimabe)', doses: 'Dose única', preco: 'A consultar', icone: '👶', ativo: true, vendas: 5, receita: 1250 },
  { id: 4, nome: 'Hexavalente', doses: '3 doses', preco: 'A consultar', icone: '💊', ativo: true, vendas: 12, receita: 2400 },
  { id: 5, nome: 'Pentavalente', doses: '3 doses', preco: 'A consultar', icone: '🛡️', ativo: true, vendas: 9, receita: 1800 },
  { id: 6, nome: 'DTPa / DTPa + Pólio', doses: 'Reforço', preco: 'A consultar', icone: '⚡', ativo: true, vendas: 7, receita: 980 },
  { id: 7, nome: 'Rotavírus Pentavalente', doses: '3 doses', preco: 'A consultar', icone: '🍼', ativo: true, vendas: 6, receita: 840 },
  { id: 8, nome: 'Meningo B', doses: '2-3 doses', preco: 'A consultar', icone: '🧠', ativo: true, vendas: 11, receita: 2200 },
  { id: 9, nome: 'Meningo ACWY', doses: 'Dose única', preco: 'A consultar', icone: '🧬', ativo: true, vendas: 8, receita: 1600 },
  { id: 10, nome: 'Pneumo 15 / Pneumo 20', doses: '1-2 doses', preco: 'A consultar', icone: '🫀', ativo: true, vendas: 14, receita: 2100 },
  { id: 11, nome: 'QDENGA (Dengue)', doses: '2 doses', preco: 'A consultar', icone: '🦟', ativo: true, vendas: 16, receita: 3200 },
  { id: 12, nome: 'Herpes Zoster (Shingrix)', doses: '2 doses', preco: 'A consultar', icone: '🔥', ativo: true, vendas: 14, receita: 2800 },
  { id: 13, nome: 'HPV Nonavalente', doses: '2-3 doses', preco: 'A consultar', icone: '🩺', ativo: true, vendas: 10, receita: 2990 },
  { id: 14, nome: 'Tríplice Viral (SCR)', doses: '2 doses', preco: 'A consultar', icone: '🦠', ativo: false, vendas: 3, receita: 450 },
  { id: 15, nome: 'Febre Amarela', doses: 'Dose única', preco: 'A consultar', icone: '🌡️', ativo: true, vendas: 9, receita: 1080 },
  { id: 16, nome: 'Hepatite A e B', doses: '2-3 doses', preco: 'A consultar', icone: '🫶', ativo: true, vendas: 7, receita: 1260 },
]

const INJETAVEIS_MOCK = [
  { id: 101, nome: 'L-Lisina', preco: 'A consultar', icone: '✨', ativo: true, vendas: 8, receita: 640 },
  { id: 102, nome: 'L-Teanina', preco: 'A consultar', icone: '🧘', ativo: true, vendas: 6, receita: 480 },
  { id: 103, nome: 'Complexo B', preco: 'A consultar', icone: '⚡', ativo: true, vendas: 12, receita: 960 },
  { id: 104, nome: 'Pool Cognitivo', preco: 'A consultar', icone: '🧠', ativo: true, vendas: 5, receita: 600 },
  { id: 105, nome: 'Pill Food', preco: 'A consultar', icone: '💆', ativo: true, vendas: 7, receita: 700 },
  { id: 106, nome: 'Vitamina B12', preco: 'A consultar', icone: '💪', ativo: true, vendas: 10, receita: 800 },
]

const STATUS_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  confirmado: { label: 'Confirmado', color: '#1565c0', bg: '#e3f2fd' },
  pendente: { label: 'Pendente', color: '#e65100', bg: '#fff3e0' },
  realizado: { label: 'Realizado', color: '#2e7d32', bg: '#e8f5e9' },
  cancelado: { label: 'Cancelado', color: '#c62828', bg: '#ffebee' },
}

const PIN_CORRETO = '1234'

export default function AdminPanel({ profile, onLogout }: Props) {
  const podeVerFinanceiro = profile.tipo === 'proprietario' || profile.tipo === 'admin'

  const [aba, setAba] = useState<'dashboard' | 'agenda' | 'produtos' | 'financeiro'>('dashboard')
  const [agendamentos, setAgendamentos] = useState(AGENDAMENTOS_MOCK)
  const [vacinas, setVacinas] = useState(VACINAS_MOCK)
  const [injetaveis, setInjetaveis] = useState(INJETAVEIS_MOCK)
  const [tipoProduto, setTipoProduto] = useState<'vacina' | 'injetavel'>('vacina')
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [precoTemp, setPrecoTemp] = useState('')
  const [pinDesbloqueado, setPinDesbloqueado] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [pinErro, setPinErro] = useState(false)
  const [periodoFin, setPeriodoFin] = useState<'hoje' | 'mes'>('mes')

  const confirmados = agendamentos.filter(a => a.status === 'confirmado').length
  const pendentes = agendamentos.filter(a => a.status === 'pendente').length
  const proximos = agendamentos.filter(a => a.status !== 'cancelado').slice(0, 5)
  const receitaTotal = 18750
  const metaTotal = 25000
  const receitaHoje = 1240
  const progresso = Math.round((receitaTotal / metaTotal) * 100)
  const produtosPorReceita = [...vacinas].sort((a, b) => b.receita - a.receita).slice(0, 6)

  function atualizarStatus(id: number, status: string) {
    setAgendamentos(prev => prev.map(a => a.id === id ? { ...a, status } : a))
  }

  function salvarPreco(id: number, tipo: 'vacina' | 'injetavel') {
    if (tipo === 'vacina') setVacinas(prev => prev.map(v => v.id === id ? { ...v, preco: precoTemp } : v))
    else setInjetaveis(prev => prev.map(i => i.id === id ? { ...i, preco: precoTemp } : i))
    setEditandoId(null)
  }

  function verificarPin() {
    if (pinInput === PIN_CORRETO) { setPinDesbloqueado(true); setPinErro(false) }
    else { setPinErro(true); setPinInput('') }
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', emoji: '📊' },
    { id: 'agenda', label: 'Agenda', emoji: '📅' },
    { id: 'produtos', label: 'Produtos', emoji: '✏️' },
    ...(podeVerFinanceiro ? [{ id: 'financeiro', label: 'Financeiro', emoji: '💰' }] : []),
  ] as { id: typeof aba; label: string; emoji: string }[]

  return (
    <div style={{ fontFamily: "'Montserrat', sans-serif", minHeight: '100vh', background: '#f0f4f8' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0e3d6b, #1a5f9e)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="30" height="30" viewBox="0 0 100 100" fill="none">
            <path d="M50 8 L82 33 L67 62 L50 78 L33 62 L18 33 Z" fill="white" opacity="0.95"/>
            <path d="M28 66 Q50 92 72 66" stroke="white" strokeWidth="7" fill="none" strokeLinecap="round"/>
          </svg>
          <div>
            <div style={{ color: 'white', fontWeight: 800, fontSize: '15px', letterSpacing: '2px' }}>VACINUM</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px', letterSpacing: '1.5px' }}>CLÍNICA DE VACINAS</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: 600 }}>{profile.nome.split(' ')[0]}</span>
          <button onClick={onLogout} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', color: 'white', padding: '7px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, fontFamily: "'Montserrat', sans-serif" }}>Sair</button>
        </div>
      </div>

      {/* Nav */}
      <div style={{ background: 'white', borderBottom: '1px solid #e0e8f0', display: 'flex', padding: '0 24px', overflowX: 'auto' }}>
        {navItems.map(n => (
          <button key={n.id} onClick={() => setAba(n.id)}
            style={{ padding: '14px 20px', border: 'none', background: 'none', borderBottom: aba === n.id ? '3px solid #1a5f9e' : '3px solid transparent', color: aba === n.id ? '#0e3d6b' : '#888', fontWeight: aba === n.id ? 700 : 500, fontSize: '14px', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif", display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
            {n.emoji} {n.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>

        {/* DASHBOARD */}
        {aba === 'dashboard' && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1a2a3a', marginBottom: '20px' }}>Visão Geral</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
              {[
                { label: 'Hoje', value: 8, emoji: '📅', color: '#1a5f9e', bg: '#e8f0fe' },
                { label: 'Confirmados', value: confirmados, emoji: '✅', color: '#2e7d32', bg: '#e8f5e9' },
                { label: 'Pendentes', value: pendentes, emoji: '⏳', color: '#e65100', bg: '#fff3e0' },
                { label: 'Mês', value: 127, emoji: '📈', color: '#6a1b9a', bg: '#f3e5f5' },
              ].map(s => (
                <div key={s.label} style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.emoji}</div>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: s.color, marginBottom: '4px' }}>{s.value}</div>
                  <div style={{ fontSize: '13px', color: '#888', fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1a2a3a', marginBottom: '14px' }}>Próximos Agendamentos</h3>
            <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
              {proximos.map((ag, i) => {
                const st = STATUS_STYLE[ag.status]
                return (
                  <div key={ag.id} style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', borderBottom: i < proximos.length - 1 ? '1px solid #f0f4f8' : 'none' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: '#1a2a3a', fontSize: '14px' }}>{ag.paciente}</div>
                      <div style={{ color: '#888', fontSize: '12px', marginTop: '2px' }}>{ag.produto} · {ag.horario} · {ag.unidade}</div>
                    </div>
                    <span style={{ background: st.bg, color: st.color, fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px' }}>{st.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* AGENDA */}
        {aba === 'agenda' && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1a2a3a', marginBottom: '20px' }}>Agenda — {agendamentos.length} agendamentos</h2>
            <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
              {agendamentos.map((ag, i) => {
                const st = STATUS_STYLE[ag.status]
                return (
                  <div key={ag.id} style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: i < agendamentos.length - 1 ? '1px solid #f0f4f8' : 'none' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: '#1a2a3a', fontSize: '14px' }}>{ag.paciente}</div>
                      <div style={{ color: '#888', fontSize: '12px', marginTop: '3px' }}>
                        {ag.produto} · {new Date(ag.data + 'T00:00:00').toLocaleDateString('pt-BR')} {ag.horario} · {ag.unidade}
                      </div>
                    </div>
                    <select value={ag.status} onChange={e => atualizarStatus(ag.id, e.target.value)}
                      style={{ fontSize: '12px', fontWeight: 700, padding: '6px 10px', borderRadius: '20px', border: 'none', background: st.bg, color: st.color, fontFamily: "'Montserrat', sans-serif", cursor: 'pointer' }}>
                      <option value="pendente">Pendente</option>
                      <option value="confirmado">Confirmado</option>
                      <option value="realizado">Realizado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* PRODUTOS */}
        {aba === 'produtos' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1a2a3a', margin: 0 }}>Produtos</h2>
              <span style={{ color: '#888', fontSize: '13px', fontWeight: 600 }}>
                {vacinas.filter(v => v.ativo).length + injetaveis.filter(i => i.ativo).length} ativos
              </span>
            </div>
            <div style={{ display: 'flex', background: '#f0f4f8', borderRadius: '12px', padding: '4px', marginBottom: '20px', width: 'fit-content' }}>
              {(['vacina', 'injetavel'] as const).map(t => (
                <button key={t} onClick={() => setTipoProduto(t)}
                  style={{ padding: '8px 20px', borderRadius: '10px', border: 'none', background: tipoProduto === t ? 'white' : 'transparent', color: tipoProduto === t ? '#0e3d6b' : '#888', fontWeight: tipoProduto === t ? 700 : 500, fontSize: '13px', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif", boxShadow: tipoProduto === t ? '0 2px 8px rgba(0,0,0,0.08)' : 'none' }}>
                  {t === 'vacina' ? '💉 Vacinas' : '✨ Injetáveis'}
                </button>
              ))}
            </div>
            <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
              {(tipoProduto === 'vacina' ? vacinas : injetaveis).map((p, i, arr) => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: i < arr.length - 1 ? '1px solid #f0f4f8' : 'none' }}>
                  <div style={{ fontSize: '26px', marginRight: '14px' }}>{p.icone}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: p.ativo ? '#1a2a3a' : '#999', fontSize: '14px' }}>{p.nome}</div>
                    {'doses' in p && (p as any).doses && <div style={{ color: '#888', fontSize: '12px', marginTop: '2px' }}>{(p as any).doses}</div>}
                    {editandoId === p.id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                        <input value={precoTemp} onChange={e => setPrecoTemp(e.target.value)} autoFocus
                          style={{ padding: '6px 10px', borderRadius: '8px', border: '2px solid #1a5f9e', fontSize: '13px', fontFamily: "'Montserrat', sans-serif", width: '160px', outline: 'none' }} />
                        <button onClick={() => salvarPreco(p.id, tipoProduto)}
                          style={{ padding: '6px 14px', background: '#1a5f9e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Montserrat', sans-serif" }}>Salvar</button>
                        <button onClick={() => setEditandoId(null)}
                          style={{ padding: '6px 14px', background: '#f0f4f8', color: '#666', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Montserrat', sans-serif" }}>Cancelar</button>
                      </div>
                    ) : (
                      <div style={{ color: '#1a5f9e', fontWeight: 700, fontSize: '13px', marginTop: '4px' }}>{p.preco}</div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ background: p.ativo ? '#e8f5e9' : '#ffebee', color: p.ativo ? '#2e7d32' : '#c62828', fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px' }}>
                      {p.ativo ? '✓ Ativo' : '○ Inativo'}
                    </span>
                    {editandoId !== p.id && (
                      <button onClick={() => { setEditandoId(p.id); setPrecoTemp(p.preco) }}
                        style={{ padding: '6px 12px', background: '#f0f4f8', border: 'none', borderRadius: '8px', color: '#0e3d6b', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Montserrat', sans-serif" }}>
                        ✏️ Editar preço
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FINANCEIRO — só proprietário/admin */}
        {aba === 'financeiro' && podeVerFinanceiro && (
          !pinDesbloqueado ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
              <div style={{ textAlign: 'center', background: 'white', borderRadius: '24px', padding: '48px 40px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', maxWidth: '340px', width: '100%' }}>
                <div style={{ fontSize: '52px', marginBottom: '16px' }}>🔐</div>
                <h3 style={{ color: '#1a2a3a', fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>Área restrita</h3>
                <p style={{ color: '#888', fontSize: '14px', marginBottom: '28px' }}>Digite o PIN financeiro</p>
                <input type="password" inputMode="numeric" maxLength={4} value={pinInput}
                  onChange={e => setPinInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && verificarPin()}
                  placeholder="• • • •"
                  style={{ textAlign: 'center', fontSize: '28px', letterSpacing: '10px', padding: '14px', border: `2px solid ${pinErro ? '#f44336' : '#e0e8f0'}`, borderRadius: '14px', width: '160px', outline: 'none', fontFamily: "'Montserrat', sans-serif" }} />
                {pinErro && <p style={{ color: '#f44336', fontSize: '13px', marginTop: '10px' }}>PIN incorreto</p>}
                <br />
                <button onClick={verificarPin}
                  style={{ marginTop: '20px', padding: '13px 40px', background: 'linear-gradient(135deg, #0e3d6b, #1a5f9e)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 700, fontFamily: "'Montserrat', sans-serif", cursor: 'pointer' }}>
                  Acessar
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1a2a3a', margin: 0 }}>💰 Financeiro</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button style={{ padding: '8px 16px', background: '#f0f4f8', border: 'none', borderRadius: '8px', color: '#0e3d6b', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Montserrat', sans-serif" }}>⬇ Exportar CSV</button>
                  <button onClick={() => setPinDesbloqueado(false)} style={{ padding: '8px 16px', background: '#f0f4f8', border: 'none', borderRadius: '8px', color: '#888', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Montserrat', sans-serif" }}>🔒 Bloquear</button>
                </div>
              </div>
              <div style={{ display: 'flex', background: '#f0f4f8', borderRadius: '12px', padding: '4px', marginBottom: '20px', width: '300px' }}>
                {(['hoje', 'mes'] as const).map(p => (
                  <button key={p} onClick={() => setPeriodoFin(p)}
                    style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: periodoFin === p ? 'white' : 'transparent', color: periodoFin === p ? '#0e3d6b' : '#888', fontWeight: periodoFin === p ? 700 : 500, fontSize: '14px', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif", boxShadow: periodoFin === p ? '0 2px 8px rgba(0,0,0,0.08)' : 'none' }}>
                    {p === 'hoje' ? 'Hoje' : 'Este mês'}
                  </button>
                ))}
              </div>
              <div style={{ background: 'linear-gradient(135deg, #0e3d6b, #1a5f9e)', borderRadius: '20px', padding: '28px', marginBottom: '20px', color: 'white', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ fontSize: '13px', opacity: 0.7, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {periodoFin === 'hoje' ? 'Faturamento de Hoje' : 'Faturamento do Mês'}
                </div>
                <div style={{ fontSize: '40px', fontWeight: 800, marginBottom: '6px' }}>
                  R$ {periodoFin === 'hoje' ? receitaHoje.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                {periodoFin === 'mes' && (
                  <>
                    <div style={{ opacity: 0.7, fontSize: '14px', marginBottom: '14px' }}>Meta: R$ {metaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                    <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '10px', height: '8px', marginBottom: '8px' }}>
                      <div style={{ width: `${progresso}%`, background: 'white', borderRadius: '10px', height: '100%' }} />
                    </div>
                    <div style={{ fontSize: '13px', opacity: 0.8 }}>{progresso}% da meta atingida</div>
                  </>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
                {[
                  { label: 'Pagos', value: 89, emoji: '✅', color: '#2e7d32', bg: '#e8f5e9' },
                  { label: 'Pendentes', value: 14, emoji: '⏳', color: '#e65100', bg: '#fff3e0' },
                  { label: 'Cancelados', value: 5, emoji: '✗', color: '#c62828', bg: '#ffebee' },
                ].map(c => (
                  <div key={c.label} style={{ background: c.bg, borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>{c.emoji}</div>
                    <div style={{ fontSize: '32px', fontWeight: 800, color: c.color }}>{c.value}</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: c.color }}>{c.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1a2a3a', marginBottom: '16px' }}>Receita por produto</h3>
                {produtosPorReceita.map(p => (
                  <div key={p.id} style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#1a2a3a' }}>{p.nome}</span>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#1a5f9e' }}>R$ {p.receita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div style={{ background: '#f0f4f8', borderRadius: '6px', height: '6px' }}>
                      <div style={{ width: `${(p.receita / produtosPorReceita[0].receita) * 100}%`, background: 'linear-gradient(90deg, #1a5f9e, #2980b9)', borderRadius: '6px', height: '100%' }} />
                    </div>
                    <div style={{ fontSize: '11px', color: '#888', marginTop: '3px', textAlign: 'right' }}>{p.vendas} aplic.</div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}