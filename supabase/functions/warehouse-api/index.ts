
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const url = new URL(req.url)
    const pathname = url.pathname
    const method = req.method

    // GET /warehouse-api/goods - Get all goods
    if (pathname === '/warehouse-api/goods' && method === 'GET') {
      const { data, error } = await supabaseClient
        .from('goods')
        .select('*')
        .order('detected_at', { ascending: false })

      if (error) throw error

      return new Response(
        JSON.stringify(data),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // POST /warehouse-api/goods - Add new goods
    if (pathname === '/warehouse-api/goods' && method === 'POST') {
      const body = await req.json()
      
      const { data, error } = await supabaseClient
        .from('goods')
        .insert([body])
        .select()
        .single()

      if (error) throw error

      // Log activity
      await supabaseClient
        .from('activities')
        .insert([{
          activity_type: 'detection',
          description: `New goods detected: ${body.item_name}`,
          camera_id: body.camera_id,
          location: body.location
        }])

      return new Response(
        JSON.stringify(data),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201,
        }
      )
    }

    // GET /warehouse-api/vehicles - Get all vehicles
    if (pathname === '/warehouse-api/vehicles' && method === 'GET') {
      const { data, error } = await supabaseClient
        .from('vehicles')
        .select('*')
        .order('detected_at', { ascending: false })

      if (error) throw error

      return new Response(
        JSON.stringify(data),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // POST /warehouse-api/vehicles - Add new vehicle
    if (pathname === '/warehouse-api/vehicles' && method === 'POST') {
      const body = await req.json()
      
      const { data, error } = await supabaseClient
        .from('vehicles')
        .insert([body])
        .select()
        .single()

      if (error) throw error

      // Log activity
      await supabaseClient
        .from('activities')
        .insert([{
          activity_type: 'detection',
          description: `Vehicle detected: ${body.license_plate}`,
          camera_id: body.camera_id,
          location: body.location
        }])

      return new Response(
        JSON.stringify(data),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201,
        }
      )
    }

    // POST /warehouse-api/alerts - Create new alert
    if (pathname === '/warehouse-api/alerts' && method === 'POST') {
      const body = await req.json()
      
      const { data, error } = await supabaseClient
        .from('alerts')
        .insert([body])
        .select()
        .single()

      if (error) throw error

      // Log activity
      await supabaseClient
        .from('activities')
        .insert([{
          activity_type: 'alert',
          description: `Alert created: ${body.title}`,
          camera_id: body.camera_id,
          location: body.location
        }])

      return new Response(
        JSON.stringify(data),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201,
        }
      )
    }

    // GET /warehouse-api/analytics/{type} - Get analytics data
    if (pathname.startsWith('/warehouse-api/analytics/') && method === 'GET') {
      const metricType = pathname.split('/').pop()
      
      const { data, error } = await supabaseClient
        .from('analytics_data')
        .select('*')
        .eq('metric_type', metricType)
        .gte('hour_timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('hour_timestamp', { ascending: true })

      if (error) throw error

      return new Response(
        JSON.stringify(data),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // POST /warehouse-api/simulate-data - Simulate new detections for testing
    if (pathname === '/warehouse-api/simulate-data' && method === 'POST') {
      // Simulate goods detection
      const goodsData = {
        item_name: `Package-${Math.floor(Math.random() * 1000)}`,
        quantity: Math.floor(Math.random() * 5) + 1,
        location: ['Receiving Bay A', 'Storage Zone B', 'Packing Station'][Math.floor(Math.random() * 3)],
        camera_id: `CAM-00${Math.floor(Math.random() * 4) + 1}`,
        confidence_score: 90 + Math.random() * 10
      }

      await supabaseClient.from('goods').insert([goodsData])

      // Simulate vehicle detection
      if (Math.random() > 0.7) {
        const vehicleData = {
          license_plate: `ABC-${Math.floor(Math.random() * 999)}`,
          vehicle_type: ['truck', 'van', 'car', 'forklift'][Math.floor(Math.random() * 4)],
          location: ['Gate A', 'Gate B', 'Loading Dock 1', 'Loading Dock 2'][Math.floor(Math.random() * 4)],
          camera_id: `CAM-00${Math.floor(Math.random() * 4) + 1}`,
          confidence_score: 90 + Math.random() * 10
        }

        await supabaseClient.from('vehicles').insert([vehicleData])
      }

      return new Response(
        JSON.stringify({ message: 'Simulation data added successfully' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Not Found' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
