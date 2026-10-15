class DataStoreError(RuntimeError):
    """Raised when required local JSON data cannot be loaded."""

class NotFoundError(LookupError):
    """Raised when a requested employee or project does not exist."""
