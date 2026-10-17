# ============================================================
# CF-Company Auto Git Push Watcher
# Watches for file changes and automatically commits + pushes
# ============================================================

param(
    [string]$WatchPath = $PSScriptRoot,
    [int]$DebounceSeconds = 5
)

Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "  CF-Company Auto Git Push Watcher" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "  Watching: $WatchPath" -ForegroundColor Yellow
Write-Host "  Debounce: $DebounceSeconds seconds" -ForegroundColor Yellow
Write-Host "  Press Ctrl+C to stop" -ForegroundColor Red
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Create FileSystemWatcher
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $WatchPath
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

# Ignore these folders/files
$ignoredPaths = @('.git', 'node_modules', '.agents')

$global:lastChangeTime = [datetime]::MinValue
$global:pendingPush = $false
$global:timerRunning = $false

function Should-Ignore($path) {
    foreach ($ignored in $ignoredPaths) {
        if ($path -like "*\$ignored\*" -or $path -like "*\$ignored") {
            return $true
        }
    }
    return $false
}

function Start-PushTimer {
    if ($global:timerRunning) { return }
    $global:timerRunning = $true

    $job = Start-Job -ScriptBlock {
        param($repoPath, $debounce)
        Start-Sleep -Seconds $debounce
        Set-Location $repoPath

        $status = git status --porcelain
        if ($status) {
            $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            git add .
            git commit -m "auto: changes at $timestamp"
            git push origin main
            Write-Output "PUSHED"
        } else {
            Write-Output "NO_CHANGES"
        }
    } -ArgumentList $WatchPath, $DebounceSeconds

    return $job
}

$changeAction = {
    $path = $Event.SourceEventArgs.FullPath
    $changeType = $Event.SourceEventArgs.ChangeType

    if (Should-Ignore $path) { return }
    if ($path -like "*.tmp" -or $path -like "*.swp") { return }

    $global:lastChangeTime = [datetime]::Now
    $global:pendingPush = $true

    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Change detected: $changeType -> $($path.Replace($WatchPath, '.'))" -ForegroundColor Green
}

# Register events
$handlers = @()
$handlers += Register-ObjectEvent $watcher Changed -Action $changeAction
$handlers += Register-ObjectEvent $watcher Created -Action $changeAction
$handlers += Register-ObjectEvent $watcher Deleted -Action $changeAction
$handlers += Register-ObjectEvent $watcher Renamed -Action $changeAction

Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Watcher started. Waiting for changes..." -ForegroundColor Green

# Main loop
$activeJob = $null
try {
    while ($true) {
        Start-Sleep -Milliseconds 500

        # Process pending events
        Get-Event | ForEach-Object { Remove-Event $_.EventIdentifier -ErrorAction SilentlyContinue }

        # Check if we should start a push
        if ($global:pendingPush -and -not $global:timerRunning) {
            $secondsSinceChange = ([datetime]::Now - $global:lastChangeTime).TotalSeconds
            if ($secondsSinceChange -ge $DebounceSeconds) {
                $global:pendingPush = $false
                $global:timerRunning = $true

                Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Committing and pushing changes..." -ForegroundColor Yellow

                Set-Location $WatchPath
                $status = git status --porcelain
                if ($status) {
                    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
                    git add .
                    $commitMsg = "auto: changes at $timestamp"
                    git commit -m $commitMsg
                    $pushResult = git push origin main 2>&1
                    if ($LASTEXITCODE -eq 0) {
                        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] ✅ Pushed successfully!" -ForegroundColor Green
                    } else {
                        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] ❌ Push failed: $pushResult" -ForegroundColor Red
                    }
                } else {
                    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] No changes to push." -ForegroundColor Gray
                }
                $global:timerRunning = $false
            }
        }
    }
} finally {
    Write-Host ""
    Write-Host "Stopping watcher..." -ForegroundColor Red
    $handlers | ForEach-Object { Unregister-Event -SourceIdentifier $_.Name -ErrorAction SilentlyContinue }
    $watcher.Dispose()
    Write-Host "Watcher stopped." -ForegroundColor Red
}
