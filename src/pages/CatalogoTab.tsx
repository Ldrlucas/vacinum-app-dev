import { useState } from 'react'
import type { Produto } from '../supabase'

const VACINAS: Produto[] = [
  { id: '1', nome: 'Gripe / Influenza', resumo: 'Proteção contra vírus da gripe (cepas A e B).', descricao: 'Protege contra a infecção pelos vírus da gripe (cepas A e B). Fundamental para reduzir complicações respiratórias graves, hospitalizações e óbitos, especialmente em crianças, idosos e gestantes.', preco: 'A consultar', doses: 'Anual', icone: '🤧', categoria: 'Respiratória', tipo: 'vacina', ativo: true },
  { id: '2', nome: 'Abrysvo (VSR)', resumo: 'Vacina contra o Vírus Sincicial Respiratório.', descricao: 'Indicada para gestantes (para proteger o bebê via placenta até os 6 meses) e idosos, prevenindo doenças graves do trato respiratório inferior, como a bronquiolite.', preco: 'A consultar', doses: 'Dose única', icone: '🫁', categoria: 'Respiratória', tipo: 'vacina', ativo: true },
  { id: '3', nome: 'Beyfortus (Nirsevimabe)', resumo: 'Anticorpo monoclonal de proteção imediata contra VSR.', descricao: 'Não é uma vacina comum, mas um anticorpo monoclonal de ação imediata. Oferece proteção direta aos recém-nascidos e lactentes contra bronquiolite e pneumonia causadas pelo VSR.', preco: 'A consultar', doses: 'Dose única', icone: '👶', categoria: 'Respiratória', tipo: 'vacina', ativo: true },
  { id: '4', nome: 'Hexavalente', resumo: '"6 em 1" para bebês — cobertura completa.', descricao: 'Protege contra Difteria, Tétano, Coqueluche, Haemophilus influenzae tipo b, Poliomielite (VIP) e Hepatite B em uma única aplicação.', preco: 'A consultar', doses: '3 doses', icone: '💊', categoria: 'Infantil', tipo: 'vacina', ativo: true },
  { id: '5', nome: 'Pentavalente', resumo: '"5 em 1" — proteção abrangente para bebês.', descricao: 'Protege contra Difteria, Tétano, Coqueluche, Haemophilus influenzae tipo b e Poliomielite.', preco: 'A consultar', doses: '3 doses', icone: '🛡️', categoria: 'Infantil', tipo: 'vacina', ativo: true },
  { id: '6', nome: 'DTPa / DTPa + Pólio', resumo: 'Previne Difteria, Tétano e Coqueluche.', descricao: 'Versão acelular com menos reações. Muito usada como reforço e em gestantes para proteger o recém-nascido contra coqueluche nos primeiros meses de vida.', preco: 'A consultar', doses: 'Reforço', icone: '⚡', categoria: 'Infantil', tipo: 'vacina', ativo: true },
  { id: '7', nome: 'Rotavírus Pentavalente', resumo: 'Vacina oral contra diarreias graves em bebês.', descricao: 'Vacina oral que protege bebês contra diarreias graves e gastroenterites causadas por cinco sorotipos de rotavírus, evitando a desidratação infantil.', preco: 'A consultar', doses: '3 doses', icone: '🍼', categoria: 'Infantil', tipo: 'vacina', ativo: true },
  { id: '8', nome: 'Meningo B', resumo: 'Proteção contra meningite do sorogrupo B.', descricao: 'Protege especificamente contra a meningite bacteriana e a sepse causadas pelo meningococo do sorogrupo B.', preco: 'A consultar', doses: '2-3 doses', icone: '🧠', categoria: 'Meningite', tipo: 'vacina', ativo: true },
  { id: '9', nome: 'Meningo ACWY', resumo: 'Proteção contra 4 sorogrupos de meningococo.', descricao: 'Protege contra quatro sorogrupos da bactéria meningococo (A, C, W e Y), principais causas de meningite bacteriana grave em crianças e adolescentes.', preco: 'A consultar', doses: 'Dose única / reforço', icone: '🧬', categoria: 'Meningite', tipo: 'vacina', ativo: true },
  { id: '10', nome: 'Pneumo 15 / Pneumo 20', resumo: 'Proteção ampla contra pneumococo.', descricao: 'Vacinas pneumocócicas conjugadas que protegem contra diversos sorotipos da bactéria pneumococo, causadora de pneumonia, meningite e otites.', preco: 'A consultar', doses: '1-2 doses', icone: '🫀', categoria: 'Meningite', tipo: 'vacina', ativo: true },
  { id: '11', nome: 'QDENGA (Dengue)', resumo: 'Vacina contra os 4 sorotipos da dengue.', descricao: 'Pode ser aplicada em quem já teve ou nunca teve a doença, reduzindo drasticamente o risco de dengue grave e hospitalização.', preco: 'A consultar', doses: '2 doses', icone: '🦟', categoria: 'Viral', tipo: 'vacina', ativo: true },
  { id: '12', nome: 'Herpes Zoster (Shingrix)', resumo: 'Previne o cobreiro e a neuralgia pós-herpética.', descricao: 'Previne o "cobreiro" e sua complicação mais dolorosa, a neuralgia pós-herpética. Recomendada para adultos acima de 50 anos ou imunossuprimidos.', preco: 'A consultar', doses: '2 doses', icone: '🔥', categoria: 'Viral', tipo: 'vacina', ativo: true },
  { id: '13', nome: 'HPV Nonavalente', resumo: 'Proteção contra 9 tipos do vírus HPV.', descricao: 'Protege contra 9 tipos do vírus HPV, prevenindo cânceres do colo do útero, ânus, vulva, vagina, orofaringe e verrugas genitais.', preco: 'A consultar', doses: '2-3 doses', icone: '🩺', categoria: 'Viral', tipo: 'vacina', ativo: true },
  { id: '14', nome: 'Tríplice Viral (SCR)', resumo: 'Proteção contra Sarampo, Caxumba e Rubéola.', descricao: 'Essencial para o bloqueio dessas doenças altamente contagiosas. Indicada para crianças, adultos não vacinados e profissionais de saúde.', preco: 'A consultar', doses: '2 doses', icone: '🦠', categoria: 'Viral', tipo: 'vacina', ativo: true },
  { id: '15', nome: 'Febre Amarela', resumo: 'Prevenção da febre amarela — áreas endêmicas.', descricao: 'Previne a infecção pelo vírus da febre amarela, doença grave transmitida por mosquitos. Essencial para residentes ou viajantes de áreas endêmicas.', preco: 'A consultar', doses: 'Dose única', icone: '🌡️', categoria: 'Viral', tipo: 'vacina', ativo: true },
  { id: '16', nome: 'Hepatite A e B', resumo: 'Proteção hepática contra hepatites A e B.', descricao: 'Protegem o fígado contra as infecções virais dos tipos A (transmissão fecal-oral) e B (transmissão sanguínea/sexual), prevenindo cirrose e câncer hepático.', preco: 'A consultar', doses: '2-3 doses', icone: '🫶', categoria: 'Viral', tipo: 'vacina', ativo: true },
]

const INJETAVEIS: Produto[] = [
  { id: '101', nome: 'L-Lisina', resumo: 'Escudo contra Herpes e aliada da beleza.', descricao: 'Atua na prevenção e tratamento de crises recorrentes de herpes labial e genital. É essencial para o crescimento muscular, saúde óssea e produção de colágeno.', preco: 'A consultar', icone: '✨', tipo: 'injetavel', ativo: true },
  { id: '102', nome: 'L-Teanina', resumo: 'Mente calma e foco total, sem sonolência.', descricao: 'Proporciona relaxamento profundo sem causar sonolência, mantendo o estado de alerta. Ideal para reduzir o estresse e a ansiedade, melhorar o aprendizado e aliviar sintomas da TPM.', preco: 'A consultar', icone: '🧘', tipo: 'injetavel', ativo: true },
  { id: '103', nome: 'Complexo B', resumo: 'Recarga de energia e bom humor.', descricao: 'Atua como o motor do corpo, transformando alimentos em energia e otimizando o metabolismo. Melhora a disposição, combate o cansaço mental e físico.', preco: 'A consultar', icone: '⚡', tipo: 'injetavel', ativo: true },
  { id: '104', nome: 'Pool Cognitivo', resumo: 'Turbo na memória e concentração.', descricao: 'Formulado com Colina, L-Carnitina e D-Pantenol para acelerar a mente. Estimula a produção de acetilcolina, neurotransmissor chave para o foco e clareza mental.', preco: 'A consultar', icone: '🧠', tipo: 'injetavel', ativo: true },
  { id: '105', nome: 'Pill Food', resumo: 'Cuidado integrado para cabelos, unhas e pele.', descricao: 'Blend completo que acelera o crescimento capilar, combate a queda, fortalece unhas quebradiças e garante hidratação e viço à pele.', preco: 'A consultar', icone: '💆', tipo: 'injetavel', ativo: true },
  { id: '106', nome: 'Vitamina B12', resumo: 'Vitalidade e proteção cerebral.', descricao: 'Nutriente crucial para manter altos níveis de disposição e prevenir a anemia. Garante a saúde do cérebro e do sistema nervoso.', preco: 'A consultar', icone: '💪', tipo: 'injetavel', ativo: true },
]

const CATEGORIAS = ['Todas', 'Respiratória', 'Infantil', 'Meningite', 'Viral']

interface Props {
  onAgendar: (produto: Produto) => void
}

export default function CatalogoTab({ onAgendar }: Props) {
  const [tipo, setTipo] = useState<'vacina' | 'injetavel'>('vacina')
  const [categoria, setCategoria] = useState('Todas')
  const [busca, setBusca] = useState('')
  const [modal, setModal] = useState<Produto | null>(null)

  const lista = (tipo === 'vacina' ? VACINAS : INJETAVEIS).filter(p =>
    (tipo === 'injetavel' || categoria === 'Todas' || p.categoria === categoria) &&
    p.nome.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div style={{ fontFamily: "'Montserrat', sans-serif", background: '#f0f4f8', minHeight: '100%' }}>

      {/* Modal Ver Mais */}
      {modal && (
        <div onClick={() => setModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '24px 24px 0 0', padding: '12px 24px 32px', width: '100%', maxWidth: '480px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ width: '40px', height: '4px', background: '#e2e8f0', borderRadius: '2px', margin: '0 auto 20px' }} />
            <div style={{ fontSize: '44px', marginBottom: '12px' }}>{modal.icone}</div>
            <div style={{ fontWeight: 800, color: '#0e3d6b', fontSize: '22px', marginBottom: '4px' }}>{modal.nome}</div>
            {modal.doses && <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '16px' }}>{modal.doses}</div>}
            <p style={{ color: '#475569', fontSize: '15px', lineHeight: '1.7', marginBottom: '24px' }}>{modal.descricao}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderTop: '1px solid #f1f5f9', marginBottom: '16px' }}>
              <span style={{ color: '#64748b', fontSize: '14px' }}>Valor</span>
              <span style={{ color: '#1a5f9e', fontWeight: 800, fontSize: '16px' }}>{modal.preco}</span>
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
        {/* Título */}
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0e3d6b', margin: '0 0 4px' }}>Serviços</h2>
        <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 16px' }}>Agende vacinas e injetáveis com facilidade</p>

        {/* Toggle Vacinas / Injetáveis */}
        <div style={{ display: 'flex', background: 'white', borderRadius: '14px', padding: '4px', marginBottom: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          {(['vacina', 'injetavel'] as const).map(t => (
            <button key={t} onClick={() => { setTipo(t); setCategoria('Todas'); setBusca('') }}
              style={{ flex: 1, padding: '11px', border: 'none', borderRadius: '11px', background: tipo === t ? 'linear-gradient(135deg, #1a5f9e, #2980b9)' : 'transparent', color: tipo === t ? 'white' : '#94a3b8', fontWeight: tipo === t ? 700 : 500, fontSize: '14px', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif", transition: 'all 0.2s' }}>
              {t === 'vacina' ? '💉 Vacinas' : '✨ Injetáveis'}
            </button>
          ))}
        </div>

        {/* Busca */}
        <div style={{ position: 'relative', marginBottom: '12px' }}>
          <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>🔍</span>
          <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar..."
            style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '14px', fontFamily: "'Montserrat', sans-serif", outline: 'none', boxSizing: 'border-box', background: 'white' }} />
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

        {/* Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {lista.map(p => (
            <div key={p.id} style={{ background: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                <div style={{ fontSize: '36px', flexShrink: 0, lineHeight: 1 }}>{p.icone}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: '#0e3d6b' }}>{p.nome}</div>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#1a5f9e', flexShrink: 0 }}>{p.preco}</div>
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
      </div>
    </div>
  )
}