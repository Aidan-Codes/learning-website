# Error Handling

Proper error handling makes your scripts robust and reliable. PowerShell provides several mechanisms for handling errors.

## Types of Errors

### Terminating Errors
Errors that stop script execution:
```powershell
throw "This is a terminating error"
```

### Non-Terminating Errors
Errors that allow script to continue:
```powershell
Get-Item "nonexistent.txt"  # Displays error but continues
```

## Try-Catch-Finally

The primary error handling mechanism:

```powershell
try {
    # Code that might fail
    Get-Item "nonexistent.txt" -ErrorAction Stop
} catch {
    # Handle the error
    Write-Host "Error occurred: $($_.Exception.Message)"
} finally {
    # Always executes (cleanup code)
    Write-Host "Cleanup complete"
}
```

## Error Action Preference

Control how errors are handled:

```powershell
# Stop on error
Get-Item "file.txt" -ErrorAction Stop

# Continue silently
Get-Item "file.txt" -ErrorAction SilentlyContinue

# Continue with warning
Get-Item "file.txt" -ErrorAction Continue

# Inquire (ask user)
Get-Item "file.txt" -ErrorAction Inquire
```

## The $Error Variable

PowerShell stores errors in the `$Error` array:

```powershell
# View last error
$Error[0]

# View all errors
$Error

# Clear errors
$Error.Clear()
```

## Exception Details

Access detailed error information:

```powershell
try {
    1 / 0
} catch {
    Write-Host "Type: $($_.Exception.GetType().FullName)"
    Write-Host "Message: $($_.Exception.Message)"
    Write-Host "Stack: $($_.ScriptStackTrace)"
}
```

## Catching Specific Exceptions

```powershell
try {
    [int]"not a number"
} catch [System.InvalidCastException] {
    Write-Host "Cannot convert to integer"
} catch {
    Write-Host "Other error occurred"
}
```

## Throw Custom Errors

```powershell
function Divide-Numbers {
    param(
        [int]$Numerator,
        [int]$Denominator
    )
    
    if ($Denominator -eq 0) {
        throw "Cannot divide by zero"
    }
    
    return $Numerator / $Denominator
}
```

## Error Records

Create custom error records:

```powershell
$errorRecord = [System.Management.Automation.ErrorRecord]::new(
    [Exception]::new("Custom error"),
    "ErrorId",
    [System.Management.Automation.ErrorCategory]::InvalidOperation,
    $null
)
$PSCmdlet.WriteError($errorRecord)
```

## Best Practices

1. **Always use Try-Catch** for risky operations
2. **Specify -ErrorAction Stop** when you want to catch errors
3. **Log errors** appropriately
4. **Provide meaningful error messages**
5. **Clean up resources** in Finally blocks
6. **Don't swallow errors** - handle them properly

## Common Patterns

### File Operations
```powershell
try {
    $content = Get-Content "file.txt" -ErrorAction Stop
    # Process content
} catch [System.IO.FileNotFoundException] {
    Write-Host "File not found"
} catch {
    Write-Host "Error reading file: $($_.Exception.Message)"
}
```

### Network Operations
```powershell
try {
    $response = Invoke-RestMethod -Uri "https://api.example.com" -ErrorAction Stop
} catch [System.Net.WebException] {
    Write-Host "Network error: $($_.Exception.Message)"
} catch {
    Write-Host "Unexpected error"
}
```

## Practice

Try implementing error handling in the exercises below!
