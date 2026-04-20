import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UserProfile = {
  id: string
  nome: string
  telefone?: string
  tipo: 'paciente' | 'funcionario' | 'proprietario' | 'admin'
  pin_financeiro?: string
  created_at: string
}

export type Unidade = {
  id: number
  nome: string
  cidade: string
  endereco?: string
  telefone?: string
  horario?: string
  ativo: boolean
}

export type Produto = {
  id: string
  nome: string
  resumo?: string
  descricao?: string
  preco: string
  preco_3x?: string
  preco_6x?: string
  doses?: string
  icone?: string
  categoria?: string
  tipo: 'vacina' | 'injetavel' | 'combo'
  ativo: boolean
}

export type Agendamento = {
  id: number
  paciente_id: string
  produto_id: string
  unidade_id: number
  data: string
  horario: string
  status: 'pendente' | 'confirmado' | 'cancelado' | 'realizado'
  observacoes?: string
  created_at: string
  produtos?: Produto
  unidades?: Unidade
}

export type ItemCarteirinha = {
  id: number
  paciente_id: string
  produto_id: string
  data_aplicacao: string
  dose?: string
  lote?: string
  profissional?: string
  proxima_dose?: string
  produtos?: Produto
  unidades?: Unidade
}