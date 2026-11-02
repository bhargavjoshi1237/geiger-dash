// A refusal the caller can act on; its message is safe to return. Anything else is reported as a generic failure.
export class PostsError extends Error {
  constructor(code, message) {
    super(message)
    this.code = code
  }
}
