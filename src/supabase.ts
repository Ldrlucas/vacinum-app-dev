import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zztpugxtkpsakbjbjzaf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6dHB1Z3h0a3BzYWtiamJqemFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMTk2NzksImV4cCI6MjA4ODg5NTY3OX0.-GosE7pBV7NeVLjw62eCxuyO87QIOqD6wWEv9KgwrHI'

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
  doses?: string
  icone?: string
  categoria?: string
  tipo: 'vacina' | 'injetavel'
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
  unidade_id?: number
  produtos?: Produto
  unidades?: Unidade
}