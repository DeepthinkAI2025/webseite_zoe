
export interface FaproClientOptions {
  baseUrl?: string;
  token?: string; // Direkt verwendeter Service Token
  timeoutMs?: number;
}

export interface LeadPayload {
  name: string;
  email: string;
  message: string;
  plz?: string;
  source?: string;
  utm?: Record<string,string|undefined>;
  meta?: Record<string, any>;
}

class FaproClient {
  private base: string;
  private token?: string;
  private timeout: number;

  constructor(opts: FaproClientOptions = {}){
    this.base = opts.baseUrl || process.env.FAPRO_BASE_URL || 'https://kundenservice.zukunftsorientierte-energie.de/api';
    this.token = opts.token || process.env.FAPRO_API_TOKEN;
    this.timeout = opts.timeoutMs || +(process.env.FAPRO_TIMEOUT_MS || 8000);
  }

  private async request<T=any>(endpoint: string, init: RequestInit = {}): Promise<T>{
    if(!this.token) throw new Error('FAPRO Token fehlt (FAPRO_API_TOKEN)');
    const ctrl = new AbortController();
    const t = setTimeout(()=> ctrl.abort(), this.timeout);
    try {
      const res = await fetch(this.base + endpoint, {
        ...init,
        headers: {
          'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
            ...(init.headers||{})
        },
        signal: ctrl.signal
      });
      if(!res.ok){
        const txt = await res.text();
        throw new Error(`FAPRO ${res.status}: ${txt}`);
      }
      const ct = res.headers.get('content-type') || '';
      if(ct.includes('application/json')) return await res.json();
      // @ts-ignore
      return undefined;
    } finally { clearTimeout(t); }
  }

  async createLead(payload: LeadPayload){
    return this.request('/customer/leads', { method:'POST', body: JSON.stringify(payload) });
  }

  async networkOperatorLookup(plz: string){
    return this.request(`/network-operator/lookup?plz=${encodeURIComponent(plz)}`);
  }

  async networkOperatorGeo(city: string, zip: string){
    return this.request(`/network-operator/geo-lookup?city=${encodeURIComponent(city)}&zip=${encodeURIComponent(zip)}`);
  }

  async sendMetrics(batch: any){
    return this.request('/analytics/metrics', { method:'POST', body: JSON.stringify(batch) });
  }

  async health(){
    return this.request('/health');
  }
}

export const faproClient = new FaproClient();
