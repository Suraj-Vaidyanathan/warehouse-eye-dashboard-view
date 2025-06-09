
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Tables = Database['public']['Tables'];

export const dataService = {
  // Goods management
  async addGoods(goods: Tables['goods']['Insert']) {
    const { data, error } = await supabase
      .from('goods')
      .insert([goods])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateGoodsStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('goods')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Vehicle management
  async addVehicle(vehicle: Tables['vehicles']['Insert']) {
    const { data, error } = await supabase
      .from('vehicles')
      .insert([vehicle])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateVehicleStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('vehicles')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Camera management
  async updateCameraDetectionCount(cameraId: string) {
    // First get current detection count
    const { data: currentData } = await supabase
      .from('cameras')
      .select('detection_count')
      .eq('id', cameraId)
      .single();

    const newCount = (currentData?.detection_count || 0) + 1;

    const { data, error } = await supabase
      .from('cameras')
      .update({ 
        detection_count: newCount,
        last_detection: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', cameraId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Alert management
  async createAlert(alert: Tables['alerts']['Insert']) {
    const { data, error } = await supabase
      .from('alerts')
      .insert([alert])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async dismissAlert(id: string) {
    const { data, error } = await supabase
      .from('alerts')
      .update({ status: 'dismissed' })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Activity logging
  async logActivity(activity: Tables['activities']['Insert']) {
    const { data, error } = await supabase
      .from('activities')
      .insert([activity])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Analytics data
  async addAnalyticsData(analyticsData: Tables['analytics_data']['Insert']) {
    const { data, error } = await supabase
      .from('analytics_data')
      .insert([analyticsData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
