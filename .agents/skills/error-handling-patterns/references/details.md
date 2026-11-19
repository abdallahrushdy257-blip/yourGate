# Detailed Patterns and Worked Examples

## 1. Retry with Exponential Backoff and Jitter
Use this pattern for recoverable errors (e.g. transient network blips, HTTP 429 / 503).

```typescript
interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffFactor?: number;
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelayMs = 500,
    maxDelayMs = 5000,
    backoffFactor = 2,
  } = options;

  let attempt = 0;
  let delay = initialDelayMs;

  while (true) {
    try {
      return await fn();
    } catch (error: any) {
      attempt++;
      if (attempt > maxRetries || error?.status === 400 || error?.status === 401 || error?.status === 403) {
        throw error;
      }
      const jitter = Math.random() * 100;
      const sleepTime = Math.min(delay + jitter, maxDelayMs);
      await new Promise((resolve) => setTimeout(resolve, sleepTime));
      delay *= backoffFactor;
    }
  }
}
```

---

## 2. Circuit Breaker Pattern
Prevents repeated calls to failing downstream services, giving them time to recover.

```javascript
class CircuitBreaker {
  constructor(action, { failureThreshold = 5, recoveryTimeoutMs = 10000 } = {}) {
    this.action = action;
    this.failureThreshold = failureThreshold;
    this.recoveryTimeoutMs = recoveryTimeoutMs;
    this.state = 'CLOSED'; // 'CLOSED' | 'OPEN' | 'HALF_OPEN'
    this.failureCount = 0;
    this.nextAttempt = Date.now();
  }

  async execute(...args) {
    if (this.state === 'OPEN') {
      if (Date.now() > this.nextAttempt) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN. Service temporarily unavailable.');
      }
    }

    try {
      const result = await this.action(...args);
      this.reset();
      return result;
    } catch (err) {
      this.recordFailure();
      throw err;
    }
  }

  recordFailure() {
    this.failureCount++;
    if (this.failureCount >= this.failureThreshold || this.state === 'HALF_OPEN') {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.recoveryTimeoutMs;
    }
  }

  reset() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }
}
```

---

## 3. Frontend React Error Boundary
Gracefully catches runtime render errors and shows a fallback UI instead of crashing the whole app.

```jsx
import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h3>حدث خطأ غير متوقع أثناء عرض هذه الصفحة</h3>
          <p>{this.state.error?.message || "يرجى المحاولة مرة أخرى لاحقاً"}</p>
          <button onClick={() => window.location.reload()}>إعادة تحميل الصفحة</button>
        </div>
      );
    }
    return this.props.children;
  }
}
```
