
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

    console.log('Received request:', method, pathname)

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

    // POST /warehouse-api/simulate-data - Enhanced simulation for consistent vehicle generation
    if (pathname === '/warehouse-api/simulate-data' && method === 'POST') {
      console.log('Running enhanced simulation...')
      
      // Comprehensive license plate arrays for variety
      const licensePlates = [
        'ABC-123', 'XYZ-789', 'DEF-456', 'GHI-321', 'JKL-654',
        'MNO-987', 'PQR-258', 'STU-741', 'VWX-963', 'YZA-147',
        'BMW-100', 'FORD-99', 'TESLA-X', 'AUDI-88', 'MERC-77',
        'VOLVO-1', 'HONDA-2', 'TOYO-33', 'NISS-44', 'CHEV-55',
        'TRUCK-1', 'VAN-001', 'CAR-999', 'LIFT-42', 'HAUL-23',
        'DELIVERY-001', 'CARGO-777', 'SUPPLY-99', 'FLEET-42'
      ];
      
      const vehicleTypes = ['truck', 'van', 'car', 'forklift'];
      const locations = ['Gate A', 'Gate B', 'Loading Dock 1', 'Loading Dock 2'];
      const cameras = ['CAM-001', 'CAM-002', 'CAM-003', 'CAM-004'];
      
      // Simulate goods detection
      const goodsData = {
        item_name: `Package-${Math.floor(Math.random() * 1000)}`,
        quantity: Math.floor(Math.random() * 5) + 1,
        location: ['Receiving Bay A', 'Storage Zone B', 'Packing Station'][Math.floor(Math.random() * 3)],
        camera_id: cameras[Math.floor(Math.random() * cameras.length)],
        confidence_score: 90 + Math.random() * 10
      }

      try {
        const { error: goodsError } = await supabaseClient.from('goods').insert([goodsData])
        if (goodsError) {
          console.error('Error inserting goods:', goodsError)
        } else {
          console.log('Goods inserted successfully:', goodsData)
        }
      } catch (e) {
        console.error('Exception inserting goods:', e)
      }

      // GUARANTEED vehicle generation - always add 1-2 vehicles per cycle
      const vehicleCount = Math.random() > 0.4 ? 2 : 1; // 60% chance of 2 vehicles, 40% chance of 1
      console.log(`Generating ${vehicleCount} vehicles this cycle`)
      
      for (let i = 0; i < vehicleCount; i++) {
        const vehicleData = {
          license_plate: licensePlates[Math.floor(Math.random() * licensePlates.length)],
          vehicle_type: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
          location: locations[Math.floor(Math.random() * locations.length)],
          camera_id: cameras[Math.floor(Math.random() * cameras.length)],
          confidence_score: 85 + Math.random() * 15, // 85-100% confidence
          status: 'active'
        }

        try {
          const { data: vehicleResult, error: vehicleError } = await supabaseClient
            .from('vehicles')
            .insert([vehicleData])
            .select()
            .single()

          if (vehicleError) {
            console.error(`Error inserting vehicle ${i + 1}:`, vehicleError)
          } else {
            console.log(`Vehicle ${i + 1} inserted successfully:`, vehicleResult)
            
            // Log activity for vehicle detection
            await supabaseClient
              .from('activities')
              .insert([{
                activity_type: 'detection',
                description: `Vehicle detected: ${vehicleData.license_plate} (${vehicleData.vehicle_type})`,
                camera_id: vehicleData.camera_id,
                location: vehicleData.location
              }])
          }
        } catch (e) {
          console.error(`Exception inserting vehicle ${i + 1}:`, e)
        }
      }

      console.log('Enhanced simulation completed successfully')

      return new Response(
        JSON.stringify({ 
          message: 'Simulation data added successfully',
          vehicles_added: vehicleCount,
          goods_added: 1
        }),
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
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
