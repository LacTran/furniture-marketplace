# API Skeleton — Step 1: Auth

ASP.NET Core 8 minimal API with Identity + JWT auth, EF Core + Postgres (Npgsql).
This is the foundation from the build order — once this is running and you can
register/login/call `/api/auth/me`, we move on to the Posts feature.

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- A free Postgres database from [Neon](https://neon.tech) (sign up, create a project,
  copy the connection string — it looks like
  `postgresql://user:password@ep-xxxx.eu-central-1.aws.neon.tech/dbname?sslmode=require`)

## 1. Install dependencies

```bash
cd Api
dotnet restore
```

## 2. Configure secrets (local dev)

Don't put real secrets in `appsettings.json`. Use the .NET secret manager instead:

```bash
dotnet user-secrets init

# Paste your Neon connection string (convert to Npgsql format — see note below)
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=ep-xxxx.eu-central-1.aws.neon.tech;Database=yourdb;Username=youruser;Password=yourpass;Ssl Mode=Require"

# Generate a random 32+ character string for JWT signing, e.g. via:
#   openssl rand -base64 32
dotnet user-secrets set "Jwt:Key" "PASTE_A_LONG_RANDOM_STRING_HERE"
```

> **Neon connection string format note:** Neon gives you a `postgresql://...` URI.
> Npgsql wants key-value format (`Host=...;Database=...;Username=...;Password=...;Ssl Mode=Require`).
> Map the URI parts across: `postgresql://USER:PASSWORD@HOST/DBNAME` →
> `Host=HOST;Database=DBNAME;Username=USER;Password=PASSWORD;Ssl Mode=Require`.

## 3. Create and apply the initial migration

```bash
dotnet tool install --global dotnet-ef   # if you don't have it already

dotnet ef migrations add InitialIdentity
dotnet ef database update
```

This creates the Identity tables (Users, Roles, etc.) in your Neon database.

## 4. Run it

```bash
dotnet run
```

Swagger UI will be available at `https://localhost:5001/swagger` (or whatever port
the console output shows). Try:

1. `POST /api/auth/register` with `{ "email": "...", "password": "...", "displayName": "..." }`
2. `POST /api/auth/login` with the same credentials → copy the returned `token`
3. `GET /api/auth/me` with `Authorization: Bearer <token>` → should return your user info

If all three work, the foundation is solid and we move to the Posts feature next.

## Deployment note

The included `Dockerfile` builds a runtime image listening on port 8080 — works as-is
on Fly.io, Render, or Azure Container Apps. Remember to set `ConnectionStrings__DefaultConnection`
and `Jwt__Key` as environment variables/secrets on whichever platform you deploy to
(double underscore `__` is how .NET reads nested config keys from env vars).
