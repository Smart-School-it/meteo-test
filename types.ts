
export interface GroundingSource {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
  };
}

export interface WeatherData {
  city: string;
  content: string;
  sources: GroundingSource[];
  timestamp: string;
}

export interface HistoryItem {
  city: string;
  timestamp: string;
}
