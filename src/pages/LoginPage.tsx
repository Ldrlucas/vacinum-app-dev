import { useState } from 'react'

interface Props {
  onSignIn: (email: string, password: string) => Promise<{ error: any }>
  onSignUp: (email: string, password: string, nome: string, telefone: string) => Promise<{ error: any }>
}

export default function LoginPage({ onSignIn, onSignUp }: Props) {
  const [modo, setModo] = useState<'login' | 'cadastro'>('login')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [loading, setLoading] = useState(false)
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [lembrar, setLembrar] = useState(false)

  const inp: React.CSSProperties = {
    width: '100%', padding: '13px 16px', borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.2)', fontSize: '14px',
    fontFamily: "'Montserrat', sans-serif", outline: 'none',
    boxSizing: 'border-box', color: 'white',
    background: 'rgba(255,255,255,0.08)',
    marginBottom: '12px', display: 'block'
  }

  async function handleEntrar() {
    if (!email || !senha) { setErro('Preencha email e senha'); return }
    setLoading(true); setErro('')
    const { error } = await onSignIn(email, senha)
    if (error) setErro('Email ou senha incorretos')
    setLoading(false)
  }

  async function handleCadastrar() {
    if (!nome || !email || !senha) { setErro('Preencha todos os campos obrigatórios'); return }
    if (senha.length < 6) { setErro('Senha deve ter pelo menos 6 caracteres'); return }
    setLoading(true); setErro('')
    const { error } = await onSignUp(email, senha, nome, telefone)
    if (error) setErro(error.message || 'Erro ao criar conta')
    else { setSucesso('Conta criada! Verifique seu email e faça login.'); setModo('login'); setEmail(''); setSenha('') }
    setLoading(false)
  }

  return (
    <>
      <style>{`input::placeholder { color: rgba(255,255,255,0.55) !important; }`}</style>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0e3d6b 0%, #1a5f9e 50%, #2980b9 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'Montserrat', sans-serif" }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
              <svg width="48" height="48" viewBox="0 0 100 100" fill="none">
                <path d="M50 8 L82 33 L67 62 L50 78 L33 62 L18 33 Z" fill="white" opacity="0.95"/>
                <path d="M28 66 Q50 92 72 66" stroke="white" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.9"/>
              </svg>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 800, fontSize: '26px', color: 'white', letterSpacing: '4px' }}>VACINUM</div>
                <div style={{ fontWeight: 400, fontSize: '10px', color: 'rgba(255,255,255,0.7)', letterSpacing: '2.5px' }}>CLÍNICA DE VACINAS</div>
              </div>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px' }}>Toledo • Marechal Cândido Rondon</div>
          </div>

          {/* Card */}
          <div style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.12)', padding: '32px' }}>

            {/* Toggle */}
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '4px', marginBottom: '28px' }}>
              {(['login', 'cadastro'] as const).map(m => (
                <button key={m} onClick={() => { setModo(m); setErro(''); setSucesso('') }}
                  style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '9px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, fontFamily: "'Montserrat', sans-serif", transition: 'all 0.2s', background: modo === m ? 'white' : 'transparent', color: modo === m ? '#0e3d6b' : 'rgba(255,255,255,0.6)' }}>
                  {m === 'login' ? 'Login' : 'Cadastrar'}
                </button>
              ))}
            </div>

            {modo === 'login' && (
              <>
                <input placeholder="E-mail" type="email" value={email} onChange={e => setEmail(e.target.value)} style={inp} />

                {/* Campo senha com mostrar/ocultar */}
                <div style={{ position: 'relative', marginBottom: '12px' }}>
                  <input
                    placeholder="Senha"
                    type={mostrarSenha ? 'text' : 'password'}
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleEntrar()}
                    style={{ ...inp, marginBottom: 0, paddingRight: '48px' }}
                  />
                  <button
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'rgba(255,255,255,0.6)', padding: 0 }}>
                    {mostrarSenha ? '🙈' : '👁️'}
                  </button>
                </div>

                {/* Lembrar senha */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '4px' }}>
                  <input
                    type="checkbox"
                    checked={lembrar}
                    onChange={e => setLembrar(e.target.checked)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'white' }}
                  />
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontFamily: "'Montserrat', sans-serif" }}>Lembrar minha senha</span>
                </label>

                {erro && <p style={{ color: '#fca5a5', fontSize: '13px', margin: '10px 0 0', textAlign: 'center' }}>{erro}</p>}
                {sucesso && <p style={{ color: '#86efac', fontSize: '13px', margin: '10px 0 0', textAlign: 'center' }}>{sucesso}</p>}
                <button onClick={handleEntrar} disabled={loading}
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: 'white', color: '#0e3d6b', fontWeight: 700, fontSize: '15px', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif", marginTop: '20px' }}>
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>
              </>
            )}

            {modo === 'cadastro' && (
              <>
                <input placeholder="Nome completo *" value={nome} onChange={e => setNome(e.target.value)} style={inp} />
                <input placeholder="Telefone (opcional)" value={telefone} onChange={e => setTelefone(e.target.value)} style={inp} />
                <input placeholder="E-mail *" type="email" value={email} onChange={e => setEmail(e.target.value)} style={inp} />

                {/* Campo senha cadastro com mostrar/ocultar */}
                <div style={{ position: 'relative', marginBottom: '0' }}>
                  <input
                    placeholder="Senha (mín. 6 caracteres) *"
                    type={mostrarSenha ? 'text' : 'password'}
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                    style={{ ...inp, marginBottom: 0, paddingRight: '48px' }}
                  />
                  <button
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'rgba(255,255,255,0.6)', padding: 0 }}>
                    {mostrarSenha ? '🙈' : '👁️'}
                  </button>
                </div>

                {erro && <p style={{ color: '#fca5a5', fontSize: '13px', margin: '10px 0 0', textAlign: 'center' }}>{erro}</p>}
                <button onClick={handleCadastrar} disabled={loading}
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: 'white', color: '#0e3d6b', fontWeight: 700, fontSize: '15px', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif", marginTop: '20px' }}>
                  {loading ? 'Criando...' : 'Criar conta'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}