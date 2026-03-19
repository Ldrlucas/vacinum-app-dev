import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import type { UserProfile } from '../supabase'

interface Props {
  profile: UserProfile
  onLogout: () => void
}

interface AgendamentoAdmin {
  id: number
  data: string
  horario: string
  status: string
  observacoes: string | null
  paciente_id: string
  produto_id: number
  unidade_id: number
  paciente: { nome: string } | null
  produto: { nome: string; icone: string } | null
  unidade: { nome: string; cidade: string } | null
}

interface Produto {
  id: number
  nome: string
  icone: string
  preco: string
  doses: string | null
  tipo: string
  ativo: boolean
}

interface ModalCarteirinha {
  agendamento: AgendamentoAdmin
  dose: string
  lote: string
  profissional: string
  proxima_dose: string
}

const STATUS_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  confirmado: { label: 'Confirmado', color: '#1565c0', bg: '#e3f2fd' },
  pendente: { label: 'Pendente', color: '#e65100', bg: '#fff3e0' },
  realizado: { label: 'Realizado', color: '#2e7d32', bg: '#e8f5e9' },
  cancelado: { label: 'Cancelado', color: '#c62828', bg: '#ffebee' },
}

export default function AdminPanel({ profile, onLogout }: Props) {
  const podeVerFinanceiro = profile.tipo === 'proprietario' || profile.tipo === 'admin'

  const [aba, setAba] = useState<'dashboard' | 'agenda' | 'produtos' | 'financeiro'>('dashboard')
  const [agendamentos, setAgendamentos] = useState<AgendamentoAdmin[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loadingAg, setLoadingAg] = useState(true)
  const [loadingProd, setLoadingProd] = useState(true)
  const [tipoProduto, setTipoProduto] = useState<'vacina' | 'injetavel'>('vacina')
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [precoTemp, setPrecoTemp] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [pinDesbloqueado, setPinDesbloqueado] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [pinErro, setPinErro] = useState(false)
  const [modal, setModal] = useState<ModalCarteirinha | null>(null)
  const [salvandoCarteirinha, setSalvandoCarteirinha] = useState(false)
  const [sucessoCarteirinha, setSucessoCarteirinha] = useState<number | null>(null)

  useEffect(() => {
    carregarAgendamentos()
    carregarProdutos()
  }, [])

  async function carregarAgendamentos() {
    setLoadingAg(true)
    const { data, error } = await supabase
      .from('agendamentos')
      .select(`
        id, data, horario, status, observacoes, paciente_id, produto_id, unidade_id,
        paciente:profiles!agendamentos_paciente_id_fkey(nome),
        produto:produtos!agendamentos_produto_id_fkey(nome, icone),
        unidade:unidades!agendamentos_unidade_id_fkey(nome, cidade)
      `)
      .order('data', { ascending: false })
    if (!error && data) setAgendamentos(data as any)
    setLoadingAg(false)
  }

  async function carregarProdutos() {
    setLoadingProd(true)
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .order('nome')
    if (!error && data) setProdutos(data)
    setLoadingProd(false)
  }

  async function atualizarStatus(id: number, status: string) {
    setAgendamentos(prev => prev.map(a => a.id === id ? { ...a, status } : a))
    await supabase.from('agendamentos').update({ status }).eq('id', id)
  }

  async function salvarPreco(id: number) {
    setSalvando(true)
    const { error } = await supabase.from('produtos').update({ preco: precoTemp }).eq('id', id)
    if (!error) {
      setProdutos(prev => prev.map(p => p.id === id ? { ...p, preco: precoTemp } : p))
      setEditandoId(null)
    }
    setSalvando(false)
  }

  async function registrarCarteirinha() {
    if (!modal) return
    setSalvandoCarteirinha(true)
    const { error } = await supabase.from('carteirinha').insert({
      paciente_id: modal.agendamento.paciente_id,
      produto_id: modal.agendamento.produto_id,
      data_aplicacao: modal.agendamento.data,
      dose: modal.dose,
      lote: modal.lote || null,
      profissional: modal.profissional || null,
      proxima_dose: modal.proxima_dose || null,
    })
    setSalvandoCarteirinha(false)
    if (!error) {
      setSucessoCarteirinha(modal.agendamento.id)
      setModal(null)
      setTimeout(() => setSucessoCarteirinha(null), 3000)
    }
  }

  function verificarPin() {
    const pinCorreto = profile.pin_financeiro || '1234'
    if (pinInput === pinCorreto) { setPinDesbloqueado(true); setPinErro(false) }
    else { setPinErro(true); setPinInput('') }
  }

  const pendentes = agendamentos.filter(a => a.status === 'pendente').length
  const confirmados = agendamentos.filter(a => a.status === 'confirmado').length
  const hoje = new Date().toISOString().split('T')[0]
  const agHoje = agendamentos.filter(a => a.data === hoje).length
  const proximos = agendamentos.filter(a => a.status !== 'cancelado').slice(0, 5)
  const produtosFiltrados = produtos.filter(p => p.tipo === tipoProduto)

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', emoji: '📊' },
    { id: 'agenda', label: 'Agenda', emoji: '📅' },
    { id: 'produtos', label: 'Produtos', emoji: '✏️' },
    ...(podeVerFinanceiro ? [{ id: 'financeiro', label: 'Financeiro', emoji: '💰' }] : []),
  ] as { id: typeof aba; label: string; emoji: string }[]

  return (
    <div style={{ fontFamily: "'Montserrat', sans-serif", minHeight: '100vh', background: '#f0f4f8' }}>

      {/* Modal Carteirinha */}
      {modal && (
        <div onClick={() => setModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '440px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0e3d6b', marginBottom: '6px' }}>📋 Registrar na Carteirinha</h3>
            <p style={{ color: '#888', fontSize: '13px', marginBottom: '20px' }}>
              {modal.agendamento.produto?.icone} {modal.agendamento.produto?.nome} · {modal.agendamento.paciente?.nome}
            </p>
            {[
              { label: 'Dose *', key: 'dose', placeholder: 'Ex: 1ª dose, Dose única, Reforço' },
              { label: 'Lote', key: 'lote', placeholder: 'Ex: FAB2024-001' },
              { label: 'Profissional', key: 'profissional', placeholder: 'Nome do aplicador' },
              { label: 'Próxima dose', key: 'proxima_dose', placeholder: 'Ex: Abril 2026 (opcional)' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{f.label}</div>
                <input
                  value={(modal as any)[f.key]}
                  onChange={e => setModal(prev => prev ? { ...prev, [f.key]: e.target.value } : null)}
                  placeholder={f.placeholder}
style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', fontFamily: "'Montserrat', sans-serif", outline: 'none', boxSizing: 'border-box', color: '#0e3d6b', background: 'white' }}                />
              </div>
            ))}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setModal(null)}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'none', color: '#888', fontWeight: 600, fontSize: '14px', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif" }}>
                Cancelar
              </button>
              <button onClick={registrarCarteirinha} disabled={!modal.dose || salvandoCarteirinha}
                style={{ flex: 2, padding: '12px', borderRadius: '10px', border: 'none', background: !modal.dose ? '#cbd5e1' : 'linear-gradient(135deg, #1a5f9e, #2980b9)', color: 'white', fontWeight: 700, fontSize: '14px', cursor: !modal.dose ? 'not-allowed' : 'pointer', fontFamily: "'Montserrat', sans-serif" }}>
                {salvandoCarteirinha ? 'Salvando...' : '✓ Salvar na Carteirinha'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0e3d6b, #1a5f9e)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="30" height="30" viewBox="0 0 100 100" fill="none">
            <path d="M50 8 L82 33 L67 62 L50 78 L33 62 L18 33 Z" fill="white" opacity="0.95"/>
            <path d="M28 66 Q50 92 72 66" stroke="white" strokeWidth="7" fill="none" strokeLinecap="round"/>
          </svg>
          <div>
            <div style={{ color: 'white', fontWeight: 800, fontSize: '15px', letterSpacing: '2px' }}>VACINUM</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px', letterSpacing: '1.5px' }}>PAINEL ADMIN</div>
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
            {loadingAg ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Carregando...</div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                  {[
                    { label: 'Hoje', value: agHoje, emoji: '📅', color: '#1a5f9e', bg: '#e8f0fe' },
                    { label: 'Confirmados', value: confirmados, emoji: '✅', color: '#2e7d32', bg: '#e8f5e9' },
                    { label: 'Pendentes', value: pendentes, emoji: '⏳', color: '#e65100', bg: '#fff3e0' },
                    { label: 'Total', value: agendamentos.length, emoji: '📈', color: '#6a1b9a', bg: '#f3e5f5' },
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
                  {proximos.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Nenhum agendamento ainda</div>
                  ) : proximos.map((ag, i) => {
                    const st = STATUS_STYLE[ag.status] || STATUS_STYLE.pendente
                    return (
                      <div key={ag.id} style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', borderBottom: i < proximos.length - 1 ? '1px solid #f0f4f8' : 'none' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, color: '#1a2a3a', fontSize: '14px' }}>{ag.paciente?.nome || '—'}</div>
                          <div style={{ color: '#888', fontSize: '12px', marginTop: '2px' }}>
                            {ag.produto?.icone} {ag.produto?.nome} · {ag.horario} · {ag.unidade?.cidade}
                          </div>
                        </div>
                        <span style={{ background: st.bg, color: st.color, fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px' }}>{st.label}</span>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* AGENDA */}
        {aba === 'agenda' && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1a2a3a', marginBottom: '20px' }}>
              Agenda — {agendamentos.length} agendamentos
            </h2>
            {loadingAg ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Carregando...</div>
            ) : agendamentos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
                <div style={{ fontWeight: 700 }}>Nenhum agendamento ainda</div>
              </div>
            ) : (
              <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                {agendamentos.map((ag, i) => {
                  const st = STATUS_STYLE[ag.status] || STATUS_STYLE.pendente
                  const registrado = sucessoCarteirinha === ag.id
                  return (
                    <div key={ag.id} style={{ padding: '16px 20px', borderBottom: i < agendamentos.length - 1 ? '1px solid #f0f4f8' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, color: '#1a2a3a', fontSize: '14px' }}>{ag.paciente?.nome || '—'}</div>
                          <div style={{ color: '#888', fontSize: '12px', marginTop: '3px' }}>
                            {ag.produto?.icone} {ag.produto?.nome} · {new Date(ag.data + 'T00:00:00').toLocaleDateString('pt-BR')} {ag.horario} · {ag.unidade?.cidade}
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
                      {ag.status === 'realizado' && (
                        <div style={{ marginTop: '10px' }}>
                          {registrado ? (
                            <span style={{ fontSize: '12px', color: '#2e7d32', fontWeight: 700 }}>✓ Registrado na carteirinha</span>
                          ) : (
                            <button onClick={() => setModal({ agendamento: ag, dose: '', lote: '', profissional: '', proxima_dose: '' })}
                              style={{ padding: '7px 14px', background: '#e8f5e9', border: 'none', borderRadius: '8px', color: '#2e7d32', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Montserrat', sans-serif" }}>
                              📋 Registrar na Carteirinha
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* PRODUTOS */}
        {aba === 'produtos' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1a2a3a', margin: 0 }}>Produtos</h2>
              <span style={{ color: '#888', fontSize: '13px', fontWeight: 600 }}>{produtos.length} cadastrados</span>
            </div>
            <div style={{ display: 'flex', background: '#f0f4f8', borderRadius: '12px', padding: '4px', marginBottom: '20px', width: 'fit-content' }}>
              {(['vacina', 'injetavel'] as const).map(t => (
                <button key={t} onClick={() => setTipoProduto(t)}
                  style={{ padding: '8px 20px', borderRadius: '10px', border: 'none', background: tipoProduto === t ? 'white' : 'transparent', color: tipoProduto === t ? '#0e3d6b' : '#888', fontWeight: tipoProduto === t ? 700 : 500, fontSize: '13px', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif", boxShadow: tipoProduto === t ? '0 2px 8px rgba(0,0,0,0.08)' : 'none' }}>
                  {t === 'vacina' ? '💉 Vacinas' : '✨ Injetáveis'}
                </button>
              ))}
            </div>
            {loadingProd ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Carregando...</div>
            ) : (
              <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                {produtosFiltrados.map((p, i) => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: i < produtosFiltrados.length - 1 ? '1px solid #f0f4f8' : 'none' }}>
                    <div style={{ fontSize: '26px', marginRight: '14px' }}>{p.icone}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: '#1a2a3a', fontSize: '14px' }}>{p.nome}</div>
                      {p.doses && <div style={{ color: '#888', fontSize: '12px', marginTop: '2px' }}>{p.doses}</div>}
                      {editandoId === p.id ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                          <input value={precoTemp} onChange={e => setPrecoTemp(e.target.value)} autoFocus
                            style={{ padding: '6px 10px', borderRadius: '8px', border: '2px solid #1a5f9e', fontSize: '13px', fontFamily: "'Montserrat', sans-serif", width: '160px', outline: 'none', color: '#0e3d6b' }} />
                          <button onClick={() => salvarPreco(p.id)} disabled={salvando}
                            style={{ padding: '6px 14px', background: '#1a5f9e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Montserrat', sans-serif" }}>
                            {salvando ? '...' : 'Salvar'}
                          </button>
                          <button onClick={() => setEditandoId(null)}
                            style={{ padding: '6px 14px', background: '#f0f4f8', color: '#666', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Montserrat', sans-serif" }}>Cancelar</button>
                        </div>
                      ) : (
                        <div style={{ color: '#1a5f9e', fontWeight: 700, fontSize: '13px', marginTop: '4px' }}>R$ {p.preco}</div>
                      )}
                    </div>
                    {editandoId !== p.id && (
                      <button onClick={() => { setEditandoId(p.id); setPrecoTemp(p.preco) }}
                        style={{ padding: '6px 12px', background: '#f0f4f8', border: 'none', borderRadius: '8px', color: '#0e3d6b', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Montserrat', sans-serif" }}>
                        ✏️ Editar preço
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FINANCEIRO */}
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
                  style={{ textAlign: 'center', fontSize: '28px', letterSpacing: '10px', padding: '14px', border: `2px solid ${pinErro ? '#f44336' : '#e0e8f0'}`, borderRadius: '14px', width: '160px', outline: 'none', fontFamily: "'Montserrat', sans-serif", colorScheme: 'light' }} />
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
                <button onClick={() => setPinDesbloqueado(false)}
                  style={{ padding: '8px 16px', background: '#f0f4f8', border: 'none', borderRadius: '8px', color: '#888', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Montserrat', sans-serif" }}>
                  🔒 Bloquear
                </button>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #0e3d6b, #1a5f9e)', borderRadius: '20px', padding: '28px', marginBottom: '20px', color: 'white' }}>
                <div style={{ fontSize: '13px', opacity: 0.7, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Total de Agendamentos</div>
                <div style={{ fontSize: '40px', fontWeight: 800, marginBottom: '6px' }}>{agendamentos.length}</div>
                <div style={{ opacity: 0.7, fontSize: '14px' }}>
                  {confirmados} confirmados · {pendentes} pendentes · {agendamentos.filter(a => a.status === 'realizado').length} realizados
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {[
                  { label: 'Confirmados', value: confirmados, color: '#1565c0', bg: '#e3f2fd', emoji: '✅' },
                  { label: 'Pendentes', value: pendentes, color: '#e65100', bg: '#fff3e0', emoji: '⏳' },
                  { label: 'Realizados', value: agendamentos.filter(a => a.status === 'realizado').length, color: '#2e7d32', bg: '#e8f5e9', emoji: '💉' },
                  { label: 'Cancelados', value: agendamentos.filter(a => a.status === 'cancelado').length, color: '#c62828', bg: '#ffebee', emoji: '✗' },
                ].map(c => (
                  <div key={c.label} style={{ background: c.bg, borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>{c.emoji}</div>
                    <div style={{ fontSize: '32px', fontWeight: 800, color: c.color }}>{c.value}</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: c.color }}>{c.label}</div>
                  </div>
                ))}
              </div>
              <p style={{ color: '#888', fontSize: '12px', marginTop: '20px', textAlign: 'center' }}>
                Relatório financeiro completo com valores será habilitado após configuração de preços.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  )
}