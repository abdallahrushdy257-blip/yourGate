---
name: error-handling-patterns
description: >-
  Use this skill to diagnose applications, build resilient architectures, and implement robust error handling patterns, debugging workflows, and health verification strategies.
---

# Error Handling Patterns & Application Diagnostics

Build resilient applications with robust error handling strategies that gracefully handle failures and provide excellent debugging experiences.

## When to Use This Skill
- Implementing error handling in new features
- Designing error-resilient APIs
- Debugging production or local issues and running health diagnostics
- Improving application reliability and fault tolerance
- Creating better error messages for users and developers
- Implementing retry, timeout, and circuit breaker patterns
- Handling async/concurrent errors and promise rejections
- Building fault-tolerant distributed systems

---

## Core Concepts

### 1. Error Handling Philosophies
- **Exceptions vs Result Types**:
  - **Exceptions**: Traditional try-catch, disrupts normal control flow. Best for unexpected errors and exceptional conditions.
  - **Result Types**: Explicit success/failure (`Result<T, E>`), functional approach. Best for expected domain errors and validation failures.
  - **Error Codes**: C-style / numeric codes; requires discipline and consistent mapping.
  - **Option/Maybe Types**: Explicitly handle nullable values without throwing errors.
- **When to Use Each**:
  - **Exceptions**: Unexpected system failures, network outages, unhandled external exceptions.
  - **Result Types**: Expected business rules, form validation errors, parsing failures.
  - **Panics / Crashes / Fail-Fast**: Unrecoverable system errors, memory exhaustion, programming contract violations (e.g. invariant assertions).

### 2. Error Categories
- **Recoverable Errors**:
  - Network timeouts and transient disconnections
  - Missing non-critical files / caches
  - Invalid user input or form validation
  - API rate limits (429 Too Many Requests)
- **Unrecoverable Errors**:
  - Out of memory (OOM)
  - Stack overflow
  - Fundamental programming bugs (null pointer, undefined property access)

---

## Application Diagnostics & Verification Workflow

When diagnosing an application to ensure its health and correctness:

1. **Verify Environment & Services**:
   - Check if runtime servers (backend API, dev server, database) are active and responding.
   - Test connectivity endpoints (`/health`, `/api/ping`).
2. **Examine Network & API Boundaries**:
   - Inspect HTTP status codes (4xx client errors vs 5xx server errors).
   - Verify payload shapes, headers, and token authentication.
   - Ensure CORS and proxy configurations are properly set.
3. **Inspect Runtime Logs & Stack Traces**:
   - Search console logs, terminal output, and error logs for uncaught exceptions or unhandled promise rejections.
   - Trace the exact origin (file, line number, stack trace).
4. **Reproduce & Isolate**:
   - Replicate the failure with minimal input.
   - Differentiate whether the failure originates from client-side state, API transmission, or database constraints.
5. **Verify Edge Cases**:
   - Test empty states, null/undefined payloads, malformed JSON, and timeout scenarios.

---

## Best Practices
- **Fail Fast**: Validate inputs early (at boundaries), fail quickly before mutating state.
- **Preserve Context**: Always preserve original stack traces, include metadata, request IDs, and timestamps.
- **Meaningful Messages**: Explain clearly what happened and provide actionable steps to resolve it.
- **Log Appropriately**:
  - Unexpected or unrecoverable error -> log with stack trace (`logger.error` / `logger.exception`).
  - Expected domain failure (e.g. invalid password) -> do not pollute error logs with full stack traces.
- **Handle at the Right Level**: Catch errors only where you can meaningfully recover, log, or present them to the user.
- **Clean Up Resources**: Always release resources using `finally`, `defer`, using/disposable statements, or AbortControllers.
- **Don't Swallow Errors**: Never use empty catch blocks. Always log, rethrow, or translate to a user-facing notification.
- **Type-Safe Errors**: Define custom error hierarchies or typed error classes for domain-specific failures.

---

## Worked Example

### Comprehensive Error Handling Pattern (Python)
```python
from typing import Optional, Dict, Any

class ApplicationError(Exception):
    """Base application exception."""
    def __init__(self, message: str, code: str = "INTERNAL_ERROR", details: Optional[Dict[str, Any]] = None):
        super().__init__(message)
        self.code = code
        self.details = details or {}

class ValidationError(ApplicationError):
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(message, code="VALIDATION_ERROR", details=details)

class NotFoundError(ApplicationError):
    def __init__(self, resource: str, resource_id: str):
        super().__init__(f"{resource} '{resource_id}' was not found", code="NOT_FOUND")

class ExternalServiceError(ApplicationError):
    def __init__(self, message: str, service: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(message, code="EXTERNAL_SERVICE_ERROR", details={"service": service, **(details or {})})

def process_order(order_id: str) -> Order:
    """Process order with comprehensive error handling."""
    try:
        # 1. Validate input early (Fail Fast)
        if not order_id:
            raise ValidationError("Order ID is required")

        # 2. Fetch order
        order = db.get_order(order_id)
        if not order:
            raise NotFoundError("Order", order_id)

        # 3. Process payment with boundary protection
        try:
            payment_result = payment_service.charge(order.total)
        except PaymentServiceError as e:
            logger.error(f"Payment failed for order {order_id}: {e}")
            raise ExternalServiceError(
                "Payment processing failed",
                service="payment_service",
                details={"order_id": order_id, "amount": order.total}
            ) from e

        # 4. Update order state
        order.status = "completed"
        order.payment_id = payment_result.id
        db.save(order)

        return order

    except ApplicationError:
        # Re-raise known domain errors
        raise
    except Exception as e:
        # Catch unexpected errors, log full context, and wrap
        logger.exception(f"Unexpected error processing order {order_id}")
        raise ApplicationError(
            "Order processing failed due to an unexpected error",
            code="INTERNAL_ERROR"
        ) from e
```

---

## Detailed References
For in-depth implementations of Circuit Breakers, Retry policies with Exponential Backoff, and frontend error boundaries, see [references/details.md](./references/details.md).

---

## Common Pitfalls
- **Catching Too Broadly**: Catching `Exception` or `catch (e)` at a low level without rethrowing hides underlying bugs.
- **Empty Catch Blocks**: Silently ignoring exceptions makes bugs nearly impossible to diagnose.
- **Logging and Re-throwing**: Creates redundant, noisy log chains across multiple layers.
- **Not Cleaning Up**: Forgetting to release database connections, file handles, or abort pending HTTP requests.
- **Poor Error Messages**: Vague messages like "Error occurred" or "Something went wrong" without context.
- **Ignoring Async Errors**: Missing `.catch()` or unhandled promise rejections in frontend and async backend code.
