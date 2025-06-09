
-- Create goods tracking table
CREATE TABLE public.goods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_transit' CHECK (status IN ('in_transit', 'stored', 'shipped', 'damaged')),
  detected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  camera_id TEXT,
  confidence_score DECIMAL(5,2) DEFAULT 95.0,
  batch_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vehicles tracking table
CREATE TABLE public.vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  license_plate TEXT NOT NULL,
  vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('truck', 'van', 'car', 'forklift')),
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'parked', 'departed')),
  detected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  camera_id TEXT,
  confidence_score DECIMAL(5,2) DEFAULT 95.0,
  driver_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create analytics data table for storing hourly metrics
CREATE TABLE public.analytics_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('throughput', 'accuracy', 'vehicles', 'goods')),
  hour_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  location TEXT,
  camera_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alerts table
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('warning', 'error', 'info')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  camera_id TEXT,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'dismissed', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create activity timeline table
CREATE TABLE public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('detection', 'processing', 'alert', 'system')),
  description TEXT NOT NULL,
  camera_id TEXT,
  location TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cameras table for camera management
CREATE TABLE public.cameras (
  id TEXT NOT NULL PRIMARY KEY,
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'offline')),
  detection_count INTEGER NOT NULL DEFAULT 0,
  last_detection TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create KPI snapshots table for storing daily KPI data
CREATE TABLE public.kpi_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  goods_transported INTEGER NOT NULL DEFAULT 0,
  vehicles_detected INTEGER NOT NULL DEFAULT 0,
  detection_accuracy DECIMAL(5,2) NOT NULL DEFAULT 98.7,
  system_uptime DECIMAL(5,2) NOT NULL DEFAULT 99.94,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert initial camera data
INSERT INTO public.cameras (id, location, status, detection_count) VALUES
('CAM-001', 'Receiving Bay A', 'active', 147),
('CAM-002', 'Storage Zone B', 'active', 89),
('CAM-003', 'Packing Station', 'active', 203),
('CAM-004', 'Shipping Dock', 'maintenance', 76);

-- Insert sample KPI data
INSERT INTO public.kpi_snapshots (goods_transported, vehicles_detected) VALUES (12847, 234);

-- Insert sample alerts
INSERT INTO public.alerts (alert_type, title, description, camera_id, created_at) VALUES
('warning', 'Low Detection Accuracy', 'CAM-003 accuracy dropped to 94.2%', 'CAM-003', NOW() - INTERVAL '5 minutes'),
('error', 'Camera Offline', 'CAM-004 connection lost', 'CAM-004', NOW() - INTERVAL '15 minutes'),
('info', 'Scheduled Maintenance', 'System backup initiated', NULL, NOW() - INTERVAL '30 minutes');

-- Insert sample activities
INSERT INTO public.activities (activity_type, description, camera_id, created_at) VALUES
('detection', 'Package detected and processed', 'CAM-001', NOW() - INTERVAL '2 minutes'),
('processing', 'Batch processing completed - 47 items', NULL, NOW() - INTERVAL '5 minutes'),
('detection', 'Forklift movement tracked', 'CAM-002', NOW() - INTERVAL '8 minutes'),
('alert', 'Camera calibration alert resolved', 'CAM-003', NOW() - INTERVAL '12 minutes'),
('system', 'System health check completed', NULL, NOW() - INTERVAL '15 minutes');

-- Create indexes for better performance
CREATE INDEX idx_goods_detected_at ON public.goods(detected_at DESC);
CREATE INDEX idx_vehicles_detected_at ON public.vehicles(detected_at DESC);
CREATE INDEX idx_analytics_metric_hour ON public.analytics_data(metric_type, hour_timestamp DESC);
CREATE INDEX idx_alerts_status_created ON public.alerts(status, created_at DESC);
CREATE INDEX idx_activities_created_at ON public.activities(created_at DESC);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE public.goods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cameras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_snapshots ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is a warehouse monitoring system)
CREATE POLICY "Allow public read access" ON public.goods FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.goods FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.goods FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON public.vehicles FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.vehicles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.vehicles FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON public.analytics_data FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.analytics_data FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access" ON public.alerts FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.alerts FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON public.activities FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.activities FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access" ON public.cameras FOR SELECT USING (true);
CREATE POLICY "Allow public update access" ON public.cameras FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON public.kpi_snapshots FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.kpi_snapshots FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.kpi_snapshots FOR UPDATE USING (true);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.goods;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vehicles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.analytics_data;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activities;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cameras;
ALTER PUBLICATION supabase_realtime ADD TABLE public.kpi_snapshots;

-- Set replica identity for realtime updates
ALTER TABLE public.goods REPLICA IDENTITY FULL;
ALTER TABLE public.vehicles REPLICA IDENTITY FULL;
ALTER TABLE public.analytics_data REPLICA IDENTITY FULL;
ALTER TABLE public.alerts REPLICA IDENTITY FULL;
ALTER TABLE public.activities REPLICA IDENTITY FULL;
ALTER TABLE public.cameras REPLICA IDENTITY FULL;
ALTER TABLE public.kpi_snapshots REPLICA IDENTITY FULL;
