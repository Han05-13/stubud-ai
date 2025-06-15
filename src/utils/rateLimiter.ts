
interface RateLimitState {
  requestsThisMinute: number;
  requestsToday: number;
  tokensToday: number;
  lastRequestTime: number;
  lastResetMinute: number;
  lastResetDay: string;
}

const RATE_LIMITS = {
  requestsPerMinute: 30,
  requestsPerDay: 1400,
  tokensPerDay: 60000,
  cooldownSeconds: 2 // minimum 2 seconds between requests
};

class RateLimiter {
  private state: RateLimitState;

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): RateLimitState {
    const saved = localStorage.getItem('rateLimitState');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse rate limit state from localStorage');
      }
    }
    
    return {
      requestsThisMinute: 0,
      requestsToday: 0,
      tokensToday: 0,
      lastRequestTime: 0,
      lastResetMinute: Date.now(),
      lastResetDay: new Date().toDateString()
    };
  }

  private saveState(): void {
    localStorage.setItem('rateLimitState', JSON.stringify(this.state));
  }

  private resetCountersIfNeeded(): void {
    const now = Date.now();
    const currentDay = new Date().toDateString();
    
    // Reset daily counters if it's a new day
    if (this.state.lastResetDay !== currentDay) {
      this.state.requestsToday = 0;
      this.state.tokensToday = 0;
      this.state.lastResetDay = currentDay;
    }
    
    // Reset minute counter if a minute has passed
    if (now - this.state.lastResetMinute >= 60000) {
      this.state.requestsThisMinute = 0;
      this.state.lastResetMinute = now;
    }
  }

  canMakeRequest(): { allowed: boolean; reason?: string; waitTime?: number } {
    this.resetCountersIfNeeded();
    
    const now = Date.now();
    const timeSinceLastRequest = now - this.state.lastRequestTime;
    
    // Check cooldown
    if (timeSinceLastRequest < RATE_LIMITS.cooldownSeconds * 1000) {
      return {
        allowed: false,
        reason: 'Cooldown active',
        waitTime: RATE_LIMITS.cooldownSeconds * 1000 - timeSinceLastRequest
      };
    }
    
    // Check per-minute limit
    if (this.state.requestsThisMinute >= RATE_LIMITS.requestsPerMinute) {
      const timeUntilReset = 60000 - (now - this.state.lastResetMinute);
      return {
        allowed: false,
        reason: 'Per-minute limit exceeded',
        waitTime: timeUntilReset
      };
    }
    
    // Check per-day limit
    if (this.state.requestsToday >= RATE_LIMITS.requestsPerDay) {
      return {
        allowed: false,
        reason: 'Daily request limit exceeded'
      };
    }
    
    // Check token limit (rough estimate)
    if (this.state.tokensToday >= RATE_LIMITS.tokensPerDay) {
      return {
        allowed: false,
        reason: 'Daily token limit exceeded'
      };
    }
    
    return { allowed: true };
  }

  recordRequest(estimatedTokens: number = 1000): void {
    const now = Date.now();
    this.resetCountersIfNeeded();
    
    this.state.requestsThisMinute++;
    this.state.requestsToday++;
    this.state.tokensToday += estimatedTokens;
    this.state.lastRequestTime = now;
    
    this.saveState();
  }

  getRemainingLimits(): {
    requestsThisMinute: number;
    requestsToday: number;
    tokensToday: number;
  } {
    this.resetCountersIfNeeded();
    
    return {
      requestsThisMinute: RATE_LIMITS.requestsPerMinute - this.state.requestsThisMinute,
      requestsToday: RATE_LIMITS.requestsPerDay - this.state.requestsToday,
      tokensToday: RATE_LIMITS.tokensPerDay - this.state.tokensToday
    };
  }
}

export const rateLimiter = new RateLimiter();
