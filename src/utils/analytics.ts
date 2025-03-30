interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
}

class Analytics {
  private static instance: Analytics;
  private isEnabled: boolean = process.env.NODE_ENV === 'production';
  private userId: string | null = null;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.setupGoogleAnalytics();
    }
  }

  public static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  private setupGoogleAnalytics(): void {
    if (!this.isEnabled) return;

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_ANALYTICS_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    (window as any).gtag = gtag;
    gtag('js', new Date());
    gtag('config', process.env.NEXT_PUBLIC_ANALYTICS_ID!);
  }

  public setUserId(id: string): void {
    this.userId = id;
    if (this.isEnabled && (window as any).gtag) {
      (window as any).gtag('set', 'user_id', id);
    }
  }

  public trackEvent(event: AnalyticsEvent): void {
    if (!this.isEnabled) return;

    const { category, action, label, value, properties } = event;

    // Track with Google Analytics
    if ((window as any).gtag) {
      (window as any).gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
        ...properties,
      });
    }

    // Track with custom analytics service
    this.trackWithCustomService(event);
  }

  private trackWithCustomService(event: AnalyticsEvent): void {
    // Implement custom analytics service tracking here
    console.log('Tracking event:', event);
  }

  public trackPageView(path: string): void {
    if (!this.isEnabled) return;

    if ((window as any).gtag) {
      (window as any).gtag('config', process.env.NEXT_PUBLIC_ANALYTICS_ID!, {
        page_path: path,
      });
    }
  }

  public trackError(error: Error, context?: Record<string, any>): void {
    if (!this.isEnabled) return;

    this.trackEvent({
      category: 'Error',
      action: error.name,
      label: error.message,
      properties: {
        stack: error.stack,
        ...context,
      },
    });
  }

  public trackUserAction(action: string, properties?: Record<string, any>): void {
    if (!this.isEnabled) return;

    this.trackEvent({
      category: 'User Action',
      action,
      properties,
    });
  }

  public trackTransaction(
    transactionId: string,
    value: number,
    currency: string = 'USD',
    properties?: Record<string, any>
  ): void {
    if (!this.isEnabled) return;

    this.trackEvent({
      category: 'Transaction',
      action: 'Purchase',
      label: transactionId,
      value,
      properties: {
        currency,
        ...properties,
      },
    });
  }

  public enable(): void {
    this.isEnabled = true;
  }

  public disable(): void {
    this.isEnabled = false;
  }
}

export const analytics = Analytics.getInstance();

// Example usage:
/*
// Track page view
analytics.trackPageView('/marketplace');

// Track user action
analytics.trackUserAction('click', {
  button: 'submit',
  form: 'checkout',
});

// Track error
try {
  // Some code that might throw
} catch (error) {
  analytics.trackError(error, {
    component: 'CheckoutForm',
    userId: '123',
  });
}

// Track transaction
analytics.trackTransaction('tx-123', 99.99, 'USD', {
  items: ['item-1', 'item-2'],
  paymentMethod: 'credit_card',
});

// Set user ID
analytics.setUserId('user-123');
*/ 