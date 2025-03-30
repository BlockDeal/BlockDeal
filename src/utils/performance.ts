interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private isEnabled: boolean = process.env.NODE_ENV === 'production';

  private constructor() {
    if (typeof window !== 'undefined') {
      this.setupPerformanceObserver();
    }
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private setupPerformanceObserver(): void {
    if (!this.isEnabled) return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'largest-contentful-paint') {
          this.recordMetric('LCP', entry.startTime);
        } else if (entry.entryType === 'first-input') {
          this.recordMetric('FID', entry.processingStart - entry.startTime);
        } else if (entry.entryType === 'layout-shift') {
          this.recordMetric('CLS', (entry as LayoutShift).value);
        }
      });
    });

    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
  }

  public recordMetric(name: string, value: number): void {
    if (!this.isEnabled) return;

    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
    };

    this.metrics.push(metric);
    this.reportMetric(metric);
  }

  private reportMetric(metric: PerformanceMetric): void {
    // Send to analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance_metric', {
        metric_name: metric.name,
        value: metric.value,
        timestamp: metric.timestamp,
      });
    }
  }

  public getMetrics(): PerformanceMetric[] {
    return this.metrics;
  }

  public clearMetrics(): void {
    this.metrics = [];
  }

  public enable(): void {
    this.isEnabled = true;
  }

  public disable(): void {
    this.isEnabled = false;
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();

// Example usage:
/*
// Record custom metric
performanceMonitor.recordMetric('page_load', 1200);

// Get all metrics
const metrics = performanceMonitor.getMetrics();

// Clear metrics
performanceMonitor.clearMetrics();
*/ 