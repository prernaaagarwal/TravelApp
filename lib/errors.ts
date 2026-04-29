export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ValidationError"
  }
}

export class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} not found`)
    this.name = "NotFoundError"
  }
}

/**
 * Safely extracts a string message from an unknown caught value.
 * Use this in catch blocks where the error type is unknown.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === "string") return error
  return "An unexpected error occurred"
}
