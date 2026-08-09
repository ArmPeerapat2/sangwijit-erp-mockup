# Minimal dependency-free static file server for the Sangwijit mockup workspace.
# Uses raw TcpListener on 127.0.0.1 so it needs NO Python, NO Node, NO admin/urlacl.
param(
  [int]$Port = 8099,
  [string]$Root
)

if (-not $Root -or $Root -eq "") {
  # default: the workspace root = parent of the .claude folder this script lives in
  $Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
}
$Root = (Resolve-Path $Root).Path

$mime = @{
  ".html"="text/html; charset=utf-8"; ".htm"="text/html; charset=utf-8";
  ".css"="text/css; charset=utf-8"; ".js"="application/javascript; charset=utf-8";
  ".mjs"="application/javascript; charset=utf-8"; ".json"="application/json; charset=utf-8";
  ".pdf"="application/pdf"; ".png"="image/png"; ".jpg"="image/jpeg"; ".jpeg"="image/jpeg";
  ".gif"="image/gif"; ".svg"="image/svg+xml"; ".ico"="image/x-icon"; ".webp"="image/webp";
  ".woff"="font/woff"; ".woff2"="font/woff2"; ".ttf"="font/ttf";
  ".txt"="text/plain; charset=utf-8"; ".map"="application/json; charset=utf-8"
}

$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)
$listener.Start()
Write-Host "Serving $Root at http://localhost:$Port/  (Ctrl+C to stop)"

while ($true) {
  $client = $null
  try {
    $client = $listener.AcceptTcpClient()
    $stream = $client.GetStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $requestLine = $reader.ReadLine()
    if ($requestLine) {
      $parts = $requestLine.Split(' ')
      $rawUrl = if ($parts.Length -ge 2) { $parts[1] } else { "/" }
      $pathPart = $rawUrl.Split('?')[0]
      $rel = [System.Uri]::UnescapeDataString($pathPart.TrimStart('/'))
      if ([string]::IsNullOrEmpty($rel)) { $rel = "index.html" }
      $rel = $rel -replace '/', '\'
      $path = Join-Path $Root $rel
      if ((Test-Path $path) -and ((Get-Item $path).PSIsContainer)) { $path = Join-Path $path "index.html" }

      if (Test-Path $path -PathType Leaf) {
        $bytes = [System.IO.File]::ReadAllBytes($path)
        $ext = [System.IO.Path]::GetExtension($path).ToLower()
        $ct = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { "application/octet-stream" }
        $header = "HTTP/1.1 200 OK`r`nContent-Type: $ct`r`nContent-Length: $($bytes.Length)`r`nCache-Control: no-cache`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
        $hb = [System.Text.Encoding]::ASCII.GetBytes($header)
        $stream.Write($hb, 0, $hb.Length)
        $stream.Write($bytes, 0, $bytes.Length)
      } else {
        $body = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $rel")
        $header = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain; charset=utf-8`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
        $hb = [System.Text.Encoding]::ASCII.GetBytes($header)
        $stream.Write($hb, 0, $hb.Length)
        $stream.Write($body, 0, $body.Length)
      }
      $stream.Flush()
    }
  } catch {
    # ignore per-connection errors, keep serving
  } finally {
    if ($client) { $client.Close() }
  }
}
