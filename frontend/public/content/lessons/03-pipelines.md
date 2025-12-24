# Pipelines and Objects

The pipeline is one of PowerShell's most powerful features. It allows you to chain commands together, passing objects from one command to another.

## Understanding the Pipeline

Unlike traditional shells that pass text, PowerShell passes **objects** through the pipeline.

```powershell
Get-Process | Where-Object CPU -gt 100 | Select-Object Name, CPU
```

This command:
1. Gets all processes
2. Filters those using more than 100 CPU
3. Selects only Name and CPU properties

## Common Pipeline Cmdlets

### Where-Object (Filtering)
```powershell
Get-ChildItem | Where-Object Length -gt 1KB
```

### Select-Object (Selecting Properties)
```powershell
Get-Process | Select-Object -First 5 Name, Id, CPU
```

### Sort-Object (Sorting)
```powershell
Get-ChildItem | Sort-Object Length -Descending
```

### ForEach-Object (Iteration)
```powershell
1..5 | ForEach-Object { $_ * 2 }
```

## The Pipeline Variable $_

Inside a pipeline, `$_` represents the current object:

```powershell
Get-Process | ForEach-Object { "Process: $($_.Name)" }
```

## Object Properties and Methods

View object properties:
```powershell
$process = Get-Process -Name 'pwsh' | Select-Object -First 1
$process | Get-Member
```

## Practical Examples

### Example 1: File Management
```powershell
Get-ChildItem -Filter *.txt | 
    Where-Object Length -lt 10KB | 
    Sort-Object Name
```

### Example 2: Working with Collections
```powershell
$numbers = 1..10
$numbers | Where-Object { $_ % 2 -eq 0 }  # Get even numbers
```

## Best Practices

- Use full cmdlet names in scripts (not aliases)
- Format pipeline for readability (one command per line)
- Filter early in the pipeline for better performance

## Try It Out!

Practice using pipelines in the exercises below.
