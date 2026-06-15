# --- Build stage ---
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY Api.csproj ./
RUN dotnet restore

COPY . .
RUN dotnet publish -c Release -o /app

# --- Runtime stage ---
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app .

# Render (and many other platforms) inject a $PORT env var at runtime and
# expect the app to listen on it. Default to 8080 for local `docker run`.
EXPOSE 8080
ENV PORT=8080

# Using a shell entrypoint so we can read $PORT at container start time
# (ENV substitution doesn't work inside ASPNETCORE_URLS otherwise).
ENTRYPOINT ["sh", "-c", "ASPNETCORE_URLS=http://+:${PORT} dotnet Api.dll"]