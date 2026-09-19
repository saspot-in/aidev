# pydantic-settings

**Role:** typed configuration and environment access for the Python API.
**Version:** <verify against installed docs>

## Where it lives
- `app/config.py`: `Settings(BaseSettings)` and `get_settings()` (cached). The only module that reads the environment.
- Consumers receive settings through `Depends(get_settings)` or as a constructor/function argument, never by importing a global.

## Conventions
```python
class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    database_url: str
    aws_region: str = "us-east-1"
    api_token: SecretStr

@lru_cache
def get_settings() -> Settings:
    return Settings()
```
- Every value is typed. Secrets are `SecretStr` with no default; the app fails fast at startup when one is missing.
- Field names snake_case, matching UPPER_SNAKE env vars automatically. Use `env_prefix` if names could collide.
- `.env` is for local development only and is git-ignored; ship a `.env.example` with names and no secrets.
- Forbidden: `os.environ` / `os.getenv` outside `config.py`, reading settings at import time in feature modules.

## Testing
Override with `app.dependency_overrides[get_settings] = lambda: Settings(...)`. No env mutation in tests.

## Invariants emitted
- "Configuration only via app/config.py."
