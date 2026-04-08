import { useState, useEffect } from 'react'
import { useAuth } from './hooks/useAuth'
import { supabase } from './supabase'
import type { Produto, Unidade } from './supabase'
import LoginPage from './pages/LoginPage'
import UnidadePage from './pages/UnidadePage'
import CatalogoTab from './pages/CatalogoTab'
import AgendamentoPage from './pages/AgendamentoPage'
import CarteirinhaTab from './pages/CarteirinhaTab'
import MeusAgendamentosTab from './pages/MeusAgendamentosTab'
import AdminPanel from './pages/AdminPanel'

type Aba = 'vacinas' | 'agendamentos' | 'carteirinha' | 'assistente'

const VAPID_PUBLIC_KEY = 'gMsLkScTrnotHFw8FLf4L40FhCXCLRVuy4s83ZI0IZK7zK5vFYDVeddkh_abmBGbkD4cN1ugaE1iw5BSIogcBQ'

const RESPOSTAS: Record<string, string> = {
  'febre amarela': 'A vacina de Febre Amarela oferece proteção vitalícia com dose única. Temos disponibilidade essa semana! 🌡️',
  'gripe': 'Nossa vacina contra Influenza é renovada anualmente. Ideal aplicar antes do inverno! 🤧',
  'horario': 'Atendemos de segunda a sexta, das 8h às 18h, e sábados das 8h às 12h. Unidades em Toledo e Marechal Cândido Rondon. 🏥',
  'preco': 'Os valores estão disponíveis na aba Vacinas. Acesse e confira cada produto! 💰',
  'agendamento': 'Para agendar, acesse a aba Vacinas, escolha a vacina e clique em "Ver Horários". É rápido e fácil! 📅',
  'carteirinha': 'Sua carteirinha digital está na aba Carteirinha. Lá você vê todas as vacinas tomadas e datas de reforço. 📋',
}

function encontrarResposta(texto: string) {
  const t = texto.toLowerCase()
  for (const [chave, resp] of Object.entries(RESPOSTAS)) {
    if (t.includes(chave)) return resp
  }
  return 'Para informações mais específicas, nossa equipe está disponível de segunda a sexta das 8h às 18h. O que mais posso ajudar? 😊'
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  return new Uint8Array([...rawData].map(char => char.charCodeAt(0)))
}

export default function App() {
  const { user, profile, loading, signIn, signUp, signOut } = useAuth()
  const [unidade, setUnidade] = useState<Unidade | null>(null)
  const [aba, setAba] = useState<Aba>('vacinas')
  const [produtoSel, setProdutoSel] = useState<Produto | null>(null)
  const [agendamentoSucesso, setAgendamentoSucesso] = useState(false)
  const [msgs, setMsgs] = useState([
    { de: 'bot', texto: 'Olá! 👋 Sou a assistente virtual da Vacinum. Posso tirar dúvidas sobre vacinas, verificar sua carteirinha ou ajudar com agendamentos. Como posso te ajudar?' }
  ])
  const [inputChat, setInputChat] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [notifAtivada, setNotifAtivada] = useState(false)

  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }, [])

  useEffect(() => {
    if (!user || !profile || profile.tipo !== 'paciente') return
    if (!('Notification' in window)) return
    if (Notification.permission === 'granted') {
      salvarSubscription()
    }
  }, [user, profile])

  async function salvarSubscription() {
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      })
      const { error } = await supabase.from('push_subscriptions').upsert({
        paciente_id: user!.id,
        subscription: sub.toJSON()
      }, { onConflict: 'paciente_id' })

      if (!error) {
        setNotifAtivada(true)
      } else {
        console.error('Erro ao salvar subscription no Supabase:', error)
      }
    } catch (err) {
      console.error('Erro ao salvar subscription:', err)
    }
  }

  async function ativarNotificacoes() {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      alert('Seu navegador não suporta notificações.')
      return
    }
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      await salvarSubscription()
    }
  }

  async function enviarChat(texto?: string) {
    const msg = texto || inputChat
    if (!msg.trim()) return
    setMsgs(prev => [...prev, { de: 'usuario', texto: msg }])
    setInputChat('')
    setChatLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setMsgs(prev => [...prev, { de: 'bot', texto: encontrarResposta(msg) }])
    setChatLoading(false)
  }

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0a2540, #0e3d6b)', fontFamily: "'Montserrat', sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>💉</div>
        <div style={{ color: 'white', fontWeight: 700, fontSize: '18px' }}>Vacinum</div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '8px' }}>Carregando...</div>
      </div>
    </div>
  )

  if (!user || !profile) return <LoginPage onSignIn={signIn} onSignUp={signUp} />

  const isAdmin = profile.tipo === 'admin' || profile.tipo === 'proprietario' || profile.tipo === 'funcionario'
  if (isAdmin) return <AdminPanel profile={profile} onLogout={signOut} />

  if (!unidade) return <UnidadePage profile={profile} onSelect={setUnidade} onLogout={signOut} />

  if (produtoSel) {
    if (agendamentoSucesso) return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a2540, #0e3d6b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Montserrat', sans-serif", padding: '20px', textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: '72px', marginBottom: '20px' }}>✅</div>
          <h2 style={{ color: 'white', fontSize: '26px', fontWeight: 800, marginBottom: '12px' }}>Agendamento Confirmado!</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', marginBottom: '8px', lineHeight: 1.6 }}>
            <strong>{produtoSel.nome}</strong> agendado com sucesso na unidade <strong>{unidade.cidade}</strong>.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '32px' }}>Você receberá uma confirmação pelo WhatsApp.</p>
          <button onClick={() => { setProdutoSel(null); setAgendamentoSucesso(false); setAba('vacinas') }}
            style={{ padding: '14px 36px', background: 'white', color: '#0e3d6b', border: 'none', borderRadius: '14px', fontSize: '15px', fontWeight: 700, fontFamily: "'Montserrat', sans-serif", cursor: 'pointer' }}>
            Novo Agendamento
          </button>
        </div>
      </div>
    )

    return (
      <AgendamentoPage
        produto={produtoSel}
        unidade={unidade}
        onVoltar={() => setProdutoSel(null)}
        onSucesso={() => setAgendamentoSucesso(true)}
      />
    )
  }

  const navItems: { id: Aba; emoji: string; label: string }[] = [
    { id: 'vacinas', emoji: '💉', label: 'Vacinas' },
    { id: 'agendamentos', emoji: '📅', label: 'Agendamentos' },
    { id: 'carteirinha', emoji: '📋', label: 'Carteirinha' },
    { id: 'assistente', emoji: '💬', label: 'Assistente' },
  ]

  return (
    <div style={{ fontFamily: "'Montserrat', sans-serif", minHeight: '100vh', width: '100%', background: 'linear-gradient(135deg, #0a2540 0%, #0e3d6b 40%, #1a5f9e 100%)', display: 'flex', alignItems: 'stretch', flexDirection: 'row' }}>

      <div className="desktop-sidebar" style={{ flex: 1 }} />

      <div style={{ width: '100%', maxWidth: '480px', minHeight: '100vh', overflowY: 'scroll', background: '#f0f4f8', position: 'relative', flexShrink: 0, boxShadow: '0 0 60px rgba(0,0,0,0.3)' }}>

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #0e3d6b, #1a5f9e)', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 200 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="30" height="30" viewBox="0 0 100 100" fill="none">
              <path d="M50 8 L82 33 L67 62 L50 78 L33 62 L18 33 Z" fill="white" opacity="0.95"/>
              <path d="M28 66 Q50 92 72 66" stroke="white" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.9"/>
            </svg>
            <div>
              <div style={{ fontWeight: 800, fontSize: '14px', color: 'white', letterSpacing: '3px' }}>VACINUM</div>
              <div style={{ fontWeight: 400, fontSize: '8px', color: 'rgba(255,255,255,0.65)', letterSpacing: '2px' }}>CLÍNICA DE VACINAS</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={() => setUnidade(null)}
              style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '20px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
              <span style={{ fontSize: '11px' }}>📍</span>
              <span style={{ color: 'white', fontSize: '12px', fontWeight: 700, fontFamily: "'Montserrat', sans-serif" }}>{unidade.cidade}</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>▾</span>
            </button>
            {!notifAtivada && 'Notification' in window && Notification.permission !== 'denied' && (
              <button onClick={ativarNotificacoes}
                style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', color: 'white', padding: '6px 10px', cursor: 'pointer', fontSize: '16px' }}
                title="Ativar notificações">
                🔔
              </button>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '14px' }}>
                {profile.nome.charAt(0).toUpperCase()}
              </div>
              <button onClick={signOut}
                style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', color: 'white', padding: '6px 12px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: "'Montserrat', sans-serif" }}>
                Sair
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div style={{ paddingBottom: '72px', width: '100%' }}>
          {aba === 'vacinas' && <CatalogoTab onAgendar={p => { setProdutoSel(p); setAgendamentoSucesso(false) }} />}
          {aba === 'agendamentos' && <MeusAgendamentosTab profile={profile} />}
          {aba === 'carteirinha' && <CarteirinhaTab profile={profile} />}
          {aba === 'assistente' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px - 72px)' }}>
              <div style={{ background: 'white', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderBottom: '1px solid #f0f4f8' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #0e3d6b, #1a5f9e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🤖</div>
                <div>
                  <div style={{ fontWeight: 700, color: '#0e3d6b', fontSize: '15px' }}>Assistente Vacinum</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', color: '#22c55e' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} /> Online agora
                  </div>
                </div>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#f0f4f8' }}>
                {msgs.map((m, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: m.de === 'usuario' ? 'flex-end' : 'flex-start' }}>
                    <div style={{ maxWidth: '78%', padding: '13px 16px', borderRadius: m.de === 'usuario' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: m.de === 'usuario' ? '#1a5f9e' : 'white', color: m.de === 'usuario' ? 'white' : '#334155', fontSize: '14px', lineHeight: 1.5, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
                      {m.texto}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{ padding: '13px 16px', borderRadius: '18px 18px 18px 4px', background: 'white', color: '#94a3b8', fontSize: '14px' }}>Digitando...</div>
                  </div>
                )}
              </div>
              <div style={{ background: 'white', padding: '10px 14px', borderTop: '1px solid #f0f4f8' }}>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px' }}>
                  {['Horários', 'Preços', 'Febre Amarela', 'Agendamento'].map(s => (
                    <button key={s} onClick={() => enviarChat(s)}
                      style={{ flexShrink: 0, padding: '6px 14px', borderRadius: '20px', border: '1px solid #e2e8f0', background: 'white', color: '#0e3d6b', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Montserrat', sans-serif" }}>
                      {s}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input value={inputChat} onChange={e => setInputChat(e.target.value)} onKeyDown={e => e.key === 'Enter' && enviarChat()} placeholder="Digite sua dúvida..."
                    style={{ flex: 1, padding: '11px 16px', borderRadius: '24px', border: '1px solid #e2e8f0', fontSize: '14px', fontFamily: "'Montserrat', sans-serif", outline: 'none', background: '#f8fafc', color: '#0e3d6b' }} />
                  <button onClick={() => enviarChat()}
                    style={{ width: '42px', height: '42px', borderRadius: '50%', border: 'none', background: 'linear-gradient(135deg, #1a5f9e, #2980b9)', color: 'white', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    ›
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Nav */}
        <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '480px', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', padding: '8px 0 12px', boxShadow: '0 -4px 20px rgba(0,0,0,0.08)', zIndex: 200 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setAba(item.id)}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
              <span style={{ fontSize: '22px' }}>{item.emoji}</span>
              <span style={{ fontSize: '10px', fontWeight: aba === item.id ? 700 : 500, color: aba === item.id ? '#1a5f9e' : '#94a3b8', fontFamily: "'Montserrat', sans-serif" }}>{item.label}</span>
              {aba === item.id && <div style={{ width: '20px', height: '3px', background: '#1a5f9e', borderRadius: '2px' }} />}
            </button>
          ))}
        </div>

      </div>

      <div className="desktop-sidebar" style={{ flex: 1 }} />

    </div>
  )
}
