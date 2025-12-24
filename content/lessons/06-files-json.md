# Working with Files and JSON

PowerShell provides powerful cmdlets for working with files and data formats like JSON.

## File Operations

### Reading Files
```powershell
# Read entire file
$content = Get-Content "file.txt"

# Read as single string
$text = Get-Content "file.txt" -Raw

# Read first 10 lines
$lines = Get-Content "file.txt" -TotalCount 10
```

### Writing Files
```powershell
# Write to file (overwrites)
"Hello World" | Out-File "output.txt"

# Append to file
"New line" | Out-File "output.txt" -Append

# Set content
Set-Content "file.txt" -Value "New content"
```

### File Management
```powershell
# List files
Get-ChildItem

# Create directory
New-Item -ItemType Directory -Path "NewFolder"

# Copy files
Copy-Item "source.txt" "destination.txt"

# Remove files
Remove-Item "file.txt"

# Test if file exists
Test-Path "file.txt"
```

## Working with JSON

JSON is the standard format for data exchange in modern applications.

### Converting to JSON

```powershell
# Create a PowerShell object
$person = @{
    Name = "Alice"
    Age = 30
    Email = "alice@example.com"
    Skills = @("PowerShell", "Python", "Azure")
}

# Convert to JSON
$json = $person | ConvertTo-Json
Write-Host $json
```

Output:
```json
{
  "Skills": ["PowerShell", "Python", "Azure"],
  "Name": "Alice",
  "Email": "alice@example.com",
  "Age": 30
}
```

### Converting from JSON

```powershell
$jsonString = @"
{
    "name": "Bob",
    "age": 25,
    "city": "Seattle"
}
"@

$object = $jsonString | ConvertFrom-Json
Write-Host "Name: $($object.name)"
Write-Host "Age: $($object.age)"
```

### Reading JSON Files

```powershell
# Read JSON from file
$config = Get-Content "config.json" -Raw | ConvertFrom-Json

# Access properties
Write-Host $config.database.server
```

### Writing JSON Files

```powershell
$data = @{
    Version = "1.0"
    Settings = @{
        Theme = "dark"
        Language = "en"
    }
}

$data | ConvertTo-Json -Depth 3 | Out-File "settings.json"
```

## Working with CSV

```powershell
# Export to CSV
$processes = Get-Process | Select-Object Name, CPU, Memory
$processes | Export-Csv "processes.csv" -NoTypeInformation

# Import from CSV
$data = Import-Csv "data.csv"
```

## Hashtables and Custom Objects

### Hashtables
```powershell
$user = @{
    Username = "alice"
    Email = "alice@example.com"
    Active = $true
}

# Access values
$user.Username
$user["Email"]
```

### Custom Objects
```powershell
$user = [PSCustomObject]@{
    Username = "alice"
    Email = "alice@example.com"
    Active = $true
}

# Access properties
$user.Username
```

## Practical Examples

### Example 1: Configuration Management
```powershell
# Read config
$config = Get-Content "config.json" -Raw | ConvertFrom-Json

# Update config
$config.settings.theme = "light"

# Save config
$config | ConvertTo-Json | Set-Content "config.json"
```

### Example 2: Data Processing
```powershell
# Load data
$users = Get-Content "users.json" -Raw | ConvertFrom-Json

# Filter active users
$activeUsers = $users | Where-Object { $_.active -eq $true }

# Export results
$activeUsers | ConvertTo-Json | Out-File "active_users.json"
```

## Best Practices

1. Use `-Depth` parameter with `ConvertTo-Json` for nested objects
2. Use `-Raw` with `Get-Content` when reading JSON files
3. Validate JSON structure before processing
4. Handle file I/O errors with try-catch
5. Use proper encoding for international characters

## Practice

Complete the exercises below to work with JSON data!
