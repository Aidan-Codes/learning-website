# Functions

Functions allow you to encapsulate reusable code blocks. They make your scripts modular and easier to maintain.

## Basic Function Syntax

```powershell
function Get-Greeting {
    "Hello, World!"
}

Get-Greeting  # Call the function
```

## Parameters

Functions can accept parameters:

```powershell
function Get-Greeting {
    param(
        [string]$Name
    )
    "Hello, $Name!"
}

Get-Greeting -Name 'Alice'
```

## Advanced Parameters

### Mandatory Parameters
```powershell
function Get-Greeting {
    param(
        [Parameter(Mandatory=$true)]
        [string]$Name
    )
    "Hello, $Name!"
}
```

### Default Values
```powershell
function Get-Greeting {
    param(
        [string]$Name = 'Guest'
    )
    "Hello, $Name!"
}
```

### Multiple Parameters
```powershell
function Add-Numbers {
    param(
        [int]$First,
        [int]$Second
    )
    return $First + $Second
}

$result = Add-Numbers -First 5 -Second 10
Write-Host "Sum: $result"
```

## Return Values

Functions automatically return the last value:

```powershell
function Get-Square {
    param([int]$Number)
    $Number * $Number
}

$square = Get-Square -Number 5  # Returns 25
```

Or use explicit return:

```powershell
function Get-Square {
    param([int]$Number)
    return $Number * $Number
}
```

## Advanced Functions

Advanced functions support common parameters like `-Verbose`:

```powershell
function Get-Data {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)]
        [string]$Path
    )
    
    Write-Verbose "Loading data from $Path"
    # Function logic here
}
```

## Pipeline Input

Functions can accept pipeline input:

```powershell
function Get-Double {
    [CmdletBinding()]
    param(
        [Parameter(ValueFromPipeline=$true)]
        [int]$Number
    )
    
    process {
        $Number * 2
    }
}

1..5 | Get-Double
```

## Best Practices

1. Use approved verbs (Get, Set, New, Remove, etc.)
2. Name functions with Verb-Noun pattern
3. Add comment-based help
4. Validate parameters
5. Handle errors appropriately

## Example: Complete Function

```powershell
function Get-FileInfo {
    <#
    .SYNOPSIS
        Gets file information
    .PARAMETER Path
        Path to the file
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)]
        [string]$Path
    )
    
    if (Test-Path $Path) {
        Get-Item $Path | Select-Object Name, Length, LastWriteTime
    } else {
        Write-Error "File not found: $Path"
    }
}
```

## Practice

Create your own functions in the exercises below!
