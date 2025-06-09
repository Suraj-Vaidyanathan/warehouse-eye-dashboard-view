
import { supabase } from "@/integrations/supabase/client";

export const dataService = {
  // Goods management
  async addGoods(goods: {
    item_name: string;
    quantity: number;
    location: string;
    camera_id?: string;
    batch_id?: string;
    confidence_score?: number;
  }) {
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
  async addVehicle(vehicle: {
    license_plate: string;
    vehicle_type: string;
    location: string;
    camera_id?: string;
    driver_name?: string;
    confidence_score?: number;
  }) {
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
    const { data, error } = await supabase
      .from('cameras')
      .update({ 
        detection_count: supabase.rpc('increment_detection_count', { camera_id: cameraId }),
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
  async createAlert(alert: {
    alert_type: string;
    title: string;
    description: string;
    camera_id?: string;
    location?: string;
  }) {
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
  async logActivity(activity: {
    activity_type: string;
    description: string;
    camera_id?: string;
    location?: string;
    metadata?: any;
  }) {
    const { data, error } = await supabase
      .from('activities')
      .insert([activity])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Analytics data
  async addAnalyticsData(data: {
    metric_type: string;
    hour_timestamp: string;
    value: number;
    location?: string;
    camera_id?: string;
  }) {
    const { data: analyticsData, error } = await supabase
      .from('analytics_data')
      .insert([data])
      .select()
      .single();
    
    if (error) throw error;
    return analyticsData;
  }
};
