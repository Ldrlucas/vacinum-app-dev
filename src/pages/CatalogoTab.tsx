import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import type { Produto } from '../supabase'

const CATEGORIAS = ['Todas', 'Respiratória', 'Infantil', 'Meningite', 'Viral']

interface Props {
  onAgendar: (produto: Produto) => void
}

export default function CatalogoTab({ onAgendar }: Props) {
  const [tipo, setTipo] = useState<'vacina' | 'injetavel' | 'combo'>('vacina')
  const [categoria, setCategoria] = useState('Todas')
  const [busca, setBusca] = useState('')
  const [modal, setModal] = useState<Produto | null>(null)
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregar() {
      setLoading(true)
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('nome')
      if (!error && data) setProdutos(data)
      setLoading(false)
    }
    carregar()
  }, [])

  const lista = produtos.filter(p =>
    p.tipo === tipo &&
    (tipo !== 'vacina' || categoria === 'Todas' || p.categoria === categoria) &&
    p.nome.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div style={{ fontFamily: "'Montserrat', sans-serif", background: '#f0f4f8', minHeight: '100%' }}>

      {modal && (
        <div onClick={() => setModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '24px 24px 0 0', padding: '12px 24px 32px', width: '100%', maxWidth: '480px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ width: '40px', height: '4px', background: '#e2e8f0', borderRadius: '2px', margin: '0 auto 20px' }} />
            <div style={{ fontSize: '44px', marginBottom: '12px' }}>{modal.icone}</div>
            <div style={{ fontWeight: 800, color: '#0e3d6b', fontSize: '22px', marginBottom: '4px' }}>{modal.nome}</div>
            {modal.doses && <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '16px' }}>{modal.doses}</div>}
            <p style={{ color: '#475569', fontSize: '15px', lineHeight: '1.7', marginBottom: '24px' }}>{modal.descricao}</p>

            {/* Tabela de preços */}
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #f1f5f9', marginBottom: '20px' }}>
              <div style={{ background: '#f8fafc', padding: '10px 16px', fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Formas de Pagamento
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderTop: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b', fontSize: '14px' }}>À Vista / Pix</span>
                <span style={{ color: '#1a5f9e', fontWeight: 800, fontSize: '16px' }}>R$ {modal.preco}</span>
              </div>
              {(modal as any).preco_3x && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#64748b', fontSize: '14px' }}>Parcelado em 3x</span>
                  <span style={{ color: '#475569', fontWeight: 700, fontSize: '15px' }}>R$ {(modal as any).preco_3x}</span>
                </div>
              )}
              {(modal as any).preco_6x && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#64748b', fontSize: '14px' }}>Parcelado em 6x</span>
                  <span style={{ color: '#475569', fontWeight: 700, fontSize: '15px' }}>R$ {(modal as any).preco_6x}</span>
                </div>
              )}
            </div>

            <button onClick={() => { onAgendar(modal); setModal(null) }}
              style={{ width: '100%', padding: '15px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #1a5f9e, #2980b9)', color: 'white', fontWeight: 700, fontSize: '15px', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif", marginBottom: '10px' }}>
              📅 Ver Horários Disponíveis
            </button>
            <button onClick={() => setModal(null)}
              style={{ width: '100%', padding: '13px', borderRadius: '14px', border: '1px solid #e2e8f0', background: 'none', color: '#64748b', fontWeight: 600, fontSize: '14px', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif" }}>
              Fechar
            </button>
          </div>
        </div>
      )}

      <div style={{ padding: '20px 16px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0e3d6b', margin: '0 0 4px' }}>Serviços</h2>
        <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 16px' }}>Agende vacinas e injetáveis com facilidade</p>

        {/* Toggle Vacinas / Injetáveis / Combos */}
        <div style={{ display: 'flex', background: 'white', borderRadius: '14px', padding: '4px', marginBottom: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          {([
            { id: 'vacina', label: '💉 Vacinas' },
            { id: 'injetavel', label: '✨ Injetáveis' },
            { id: 'combo', label: '🎁 Combos' },
          ] as const).map(t => (
            <button key={t.id} onClick={() => { setTipo(t.id); setCategoria('Todas'); setBusca('') }}
              style={{ flex: 1, padding: '11px 6px', border: 'none', borderRadius: '11px', background: tipo === t.id ? 'linear-gradient(135deg, #1a5f9e, #2980b9)' : 'transparent', color: tipo === t.id ? 'white' : '#94a3b8', fontWeight: tipo === t.id ? 700 : 500, fontSize: '12px', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif", transition: 'all 0.2s' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Busca */}
        <div style={{ position: 'relative', marginBottom: '12px' }}>
          <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>🔍</span>
          <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar..."
            style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '14px', fontFamily: "'Montserrat', sans-serif", outline: 'none', boxSizing: 'border-box', background: 'white', color: '#0e3d6b' }} />
        </div>

        {/* Categorias — só vacinas */}
        {tipo === 'vacina' && (
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '16px' }}>
            {CATEGORIAS.map(c => (
              <button key={c} onClick={() => setCategoria(c)}
                style={{ flexShrink: 0, padding: '7px 16px', borderRadius: '20px', border: 'none', background: categoria === c ? '#0e3d6b' : 'white', color: categoria === c ? 'white' : '#64748b', fontWeight: categoria === c ? 700 : 500, fontSize: '13px', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif", boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                {c}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: '#94a3b8' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
            <div style={{ fontWeight: 600 }}>Carregando...</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {lista.map(p => (
              <div key={p.id} style={{ background: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '36px', flexShrink: 0, lineHeight: 1 }}>{p.icone}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ fontWeight: 700, fontSize: '15px', color: '#0e3d6b' }}>{p.nome}</div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#1a5f9e', flexShrink: 0 }}>R$ {p.preco}</div>
                    </div>
                    {p.doses && <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{p.doses}</div>}
                    {p.resumo && <div style={{ fontSize: '13px', color: '#64748b', marginTop: '6px', lineHeight: '1.4' }}>{p.resumo}</div>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setModal(p)}
                    style={{ flex: 1, padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: '10px', color: '#0e3d6b', fontWeight: 600, fontSize: '13px', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif" }}>
                    Ver mais
                  </button>
                  <button onClick={() => onAgendar(p)}
                    style={{ flex: 2, padding: '10px', background: 'linear-gradient(135deg, #1a5f9e, #2980b9)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif" }}>
                    📅 Ver Horários
                  </button>
                </div>
              </div>
            ))}
            {lista.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px 20px', color: '#94a3b8' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
                <div style={{ fontWeight: 600 }}>Nenhum resultado encontrado</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}