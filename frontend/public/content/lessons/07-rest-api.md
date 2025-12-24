# REST API Calls with Invoke-RestMethod

Modern applications communicate via REST APIs. PowerShell's `Invoke-RestMethod` makes it easy to interact with web services.

## Basic GET Request

```powershell
# Simple GET request
$response = Invoke-RestMethod -Uri "https://api.github.com/users/github"
Write-Host "Name: $($response.name)"
Write-Host "Company: $($response.company)"
```

## HTTP Methods

### GET - Retrieve Data
```powershell
$users = Invoke-RestMethod -Uri "https://jsonplaceholder.typicode.com/users"
$users | Select-Object -First 3 name, email
```

### POST - Create Data
```powershell
$body = @{
    title = "New Post"
    body = "This is the content"
    userId = 1
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "https://jsonplaceholder.typicode.com/posts" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

### PUT - Update Data
```powershell
$body = @{
    id = 1
    title = "Updated Post"
    body = "Updated content"
    userId = 1
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "https://jsonplaceholder.typicode.com/posts/1" `
    -Method Put `
    -Body $body `
    -ContentType "application/json"
```

### DELETE - Remove Data
```powershell
Invoke-RestMethod -Uri "https://jsonplaceholder.typicode.com/posts/1" `
    -Method Delete
```

## Headers

Add custom headers to requests:

```powershell
$headers = @{
    "Authorization" = "Bearer <YOUR_TOKEN_HERE>"
    "Accept" = "application/json"
}

$response = Invoke-RestMethod -Uri "https://api.example.com/data" `
    -Headers $headers
```

## Query Parameters

```powershell
# Method 1: In URL
$response = Invoke-RestMethod -Uri "https://api.example.com/users?page=1&limit=10"

# Method 2: Using parameters
$params = @{
    Uri = "https://api.example.com/users"
    Method = "Get"
    Body = @{
        page = 1
        limit = 10
    }
}
$response = Invoke-RestMethod @params
```

## Error Handling

```powershell
try {
    $response = Invoke-RestMethod -Uri "https://api.example.com/data" `
        -ErrorAction Stop
    Write-Host "Success: $($response.message)"
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "Error $statusCode: $($_.Exception.Message)"
}
```

## Working with JSON Responses

```powershell
# Most APIs return JSON automatically parsed by Invoke-RestMethod
$todo = Invoke-RestMethod -Uri "https://jsonplaceholder.typicode.com/todos/1"

# Access properties directly
Write-Host "Title: $($todo.title)"
Write-Host "Completed: $($todo.completed)"

# Process collections
$todos = Invoke-RestMethod -Uri "https://jsonplaceholder.typicode.com/todos"
$completedTodos = $todos | Where-Object completed -eq $true
Write-Host "Completed: $($completedTodos.Count)"
```

## Authentication

### Basic Authentication
```powershell
$username = "user"
$password = "pass"
$base64Auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${username}:${password}"))

$headers = @{
    "Authorization" = "Basic $base64Auth"
}

$response = Invoke-RestMethod -Uri "https://api.example.com/data" -Headers $headers
```

### Bearer Token
```powershell
$token = "<YOUR_API_TOKEN>"
$headers = @{
    "Authorization" = "Bearer $token"
}

$response = Invoke-RestMethod -Uri "https://api.example.com/data" -Headers $headers
```

## Practical Examples

### Example 1: GitHub API
```powershell
# Get repository information
$repo = Invoke-RestMethod -Uri "https://api.github.com/repos/PowerShell/PowerShell"
Write-Host "Stars: $($repo.stargazers_count)"
Write-Host "Forks: $($repo.forks_count)"
Write-Host "Open Issues: $($repo.open_issues_count)"
```

### Example 2: Weather API
```powershell
# Note: This is a mock example
$city = "Seattle"
$response = Invoke-RestMethod -Uri "https://api.openweathermap.org/data/2.5/weather?q=$city&appid=YOUR_API_KEY"
Write-Host "Temperature: $($response.main.temp)"
Write-Host "Weather: $($response.weather[0].description)"
```

### Example 3: JSONPlaceholder (Testing API)
```powershell
# Get posts by specific user
$userId = 1
$posts = Invoke-RestMethod -Uri "https://jsonplaceholder.typicode.com/posts?userId=$userId"
Write-Host "User has $($posts.Count) posts"

# Display titles
$posts | ForEach-Object { Write-Host "- $($_.title)" }
```

## Best Practices

1. **Always handle errors** with try-catch
2. **Use HTTPS** for secure communication
3. **Don't hardcode credentials** - use secure storage
4. **Respect rate limits** - add delays if needed
5. **Validate responses** before processing
6. **Set timeouts** for long-running requests
7. **Use proper HTTP methods** (GET, POST, PUT, DELETE)

## Advanced Features

### Custom Timeout
```powershell
$response = Invoke-RestMethod -Uri "https://api.example.com/data" `
    -TimeoutSec 30
```

### Follow Redirects
```powershell
$response = Invoke-RestMethod -Uri "https://api.example.com/data" `
    -MaximumRedirection 5
```

### Proxy Support
```powershell
$response = Invoke-RestMethod -Uri "https://api.example.com/data" `
    -Proxy "http://proxy.example.com:8080"
```

## Common APIs for Practice

- **JSONPlaceholder**: https://jsonplaceholder.typicode.com (Free fake API)
- **GitHub API**: https://api.github.com (No auth required for public data)
- **REQ|RES**: https://reqres.in (Test API with sample users)
- **Cat Facts**: https://catfact.ninja/fact (Fun cat facts API)

## Try It!

Practice making API calls in the exercises below!
