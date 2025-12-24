# Variables and Data Types

Variables are containers for storing data values. In PowerShell, variables start with the `$` symbol.

## Creating Variables

```powershell
$name = 'Alice'
$age = 30
$isStudent = $true
```

## Variable Naming Rules

- Start with `$`
- Can contain letters, numbers, and underscores
- Case insensitive (but conventionally use camelCase or PascalCase)

## Data Types

PowerShell automatically determines data types, but you can specify them:

```powershell
[string]$name = 'Bob'
[int]$age = 25
[bool]$active = $true
[double]$price = 19.99
```

## String Interpolation

Use double quotes for variable expansion:

```powershell
$name = 'PowerShell'
Write-Host "I am learning $name"  # Output: I am learning PowerShell
```

Use single quotes for literal strings:

```powershell
Write-Host 'Cost: $10'  # Output: Cost: $10
```

## Basic Operations

### Arithmetic
```powershell
$sum = 10 + 5      # 15
$product = 4 * 3   # 12
$quotient = 20 / 4 # 5
$remainder = 7 % 3 # 1
```

### String Operations
```powershell
$greeting = 'Hello' + ' ' + 'World'  # Hello World
$repeated = 'Ha' * 3                  # HaHaHa
```

## Variable Scope

Variables exist in different scopes:
- `$local:variable` - Current scope
- `$script:variable` - Script scope
- `$global:variable` - Global scope

## Practice Exercise

Try creating variables and performing operations with them in the exercises below!
