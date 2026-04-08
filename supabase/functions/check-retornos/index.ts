import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import webpush from 'npm:web-push@3.6.7'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY')!
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!

webpush.setVapidDetails(
  'mailto:contato@vacinum.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
)

serve(async (_req) => {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    const hoje = new Date()
    const em7dias = new Date(hoje)
    em7dias.setDate(hoje.getDate() + 7)
    const em2dias = new Date(hoje)
    em2dias.setDate(hoje.getDate() + 2)

    const fmt = (d: Date) => d.toISOString().split('T')[0]
    const em7diasStr = fmt(em7dias)
    const em2diasStr = fmt(em2dias)

    console.log(`Buscando proxima_dose em: ${em7diasStr} ou ${em2diasStr}`)

    const { data: retornos7 } = await supabase
      .from('carteirinha')
      .select('paciente_id, proxima_dose, produtos(nome), profiles(nome)')
      .gte('proxima_dose', `${em7diasStr}T00:00:00`)
      .lte('proxima_dose', `${em7diasStr}T23:59:59`)

    const { data: retornos2 } = await supabase
      .from('carteirinha')
      .select('paciente_id, proxima_dose, produtos(nome), profiles(nome)')
      .gte('proxima_dose', `${em2diasStr}T00:00:00`)
      .lte('proxima_dose', `${em2diasStr}T23:59:59`)

    const retornos = [
      ...(retornos7 || []).map(r => ({ ...r, dias: 7 })),
      ...(retornos2 || []).map(r => ({ ...r, dias: 2 })),
    ]

    console.log(`Total retornos: ${retornos.length}`)

    let enviados = 0

    for (const retorno of retornos) {
      const { data: subData } = await supabase
        .from('push_subscriptions')
        .select('subscription')
        .eq('paciente_id', retorno.paciente_id)
        .single()

      if (!subData?.subscription) {
        console.log(`Sem subscription para ${retorno.paciente_id}`)
        continue
      }

      const nomePaciente = (retorno.profiles as any)?.nome?.split(' ')[0] || 'Paciente'
      const nomeProduto = (retorno.produtos as any)?.nome || 'vacina'
      const title = `Lembrete Vacinum 💉`
      const body = retorno.dias === 7
        ? `${nomePaciente}, sua próxima dose de ${nomeProduto} está em 7 dias. Agende agora!`
        : `${nomePaciente}, sua próxima dose de ${nomeProduto} é em 2 dias. Não esqueça!`

      console.log(`Enviando push para ${retorno.paciente_id}: ${body}`)

      try {
        const result = await webpush.sendNotification(
          subData.subscription,
          JSON.stringify({ title, body, icon: '/icons/icon-192x192.png' })
        )
        console.log(`Push OK: ${result.statusCode}`)
        enviados++
      } catch (pushErr: any) {
        console.error(`Push ERRO: ${pushErr?.statusCode} - ${pushErr?.body} - ${String(pushErr)}`)
      }
    }

    return new Response(JSON.stringify({ ok: true, enviados }), { status: 200 })
  } catch (err) {
    console.error('Erro geral:', String(err))
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})