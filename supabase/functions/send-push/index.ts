import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import webpush from 'npm:web-push@3.6.7'

const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY')!
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!

webpush.setVapidDetails(
  'mailto:contato@vacinum.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    })
  }

  try {
    const { subscription, title, body } = await req.json()

    console.log('send-push recebido:', { title, endpoint: subscription?.endpoint?.substring(0, 60) })

    if (!subscription?.endpoint) {
      return new Response(JSON.stringify({ error: 'Subscription inválida' }), { status: 400 })
    }

    const payload = JSON.stringify({ title, body, icon: '/icons/icon-192x192.png' })

    const result = await webpush.sendNotification(subscription, payload)
    console.log('Push enviado com sucesso:', result.statusCode)

    return new Response(JSON.stringify({ ok: true, status: result.statusCode }), { status: 200 })
  } catch (err: any) {
    console.error('Erro send-push:', err?.statusCode, err?.body, String(err))
    return new Response(
      JSON.stringify({ error: String(err), statusCode: err?.statusCode, body: err?.body }),
      { status: 500 }
    )
  }
})