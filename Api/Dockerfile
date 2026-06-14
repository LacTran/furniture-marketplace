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

# Cloud platforms (Fly.io, Render, Azure Container Apps) typically inject PORT;
# ASP.NET Core listens on ASPNETCORE_URLS.
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "Api.dll"]
