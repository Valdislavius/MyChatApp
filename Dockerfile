FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Копируем файлы проекта
COPY DevOpsChatApp.csproj ./
RUN dotnet restore

# Копируем весь проект
COPY . ./

# Публикуем под Linux x64
RUN dotnet publish -c Release -o /app/publish --runtime linux-x64 --self-contained false

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 80
ENTRYPOINT ["dotnet", "DevOpsChatApp.dll"]
