# Vercel Environment Variables Setup Script
# Run this manually in the Vercel dashboard or use vercel env add

# Generate a new Django secret key (PowerShell-friendly)
python -c "import secrets; import string; chars = string.ascii_letters + string.digits + '-_'; print(''.join(secrets.choice(chars) for _ in range(50)))"

# Environment Variables to Add to Vercel Dashboard:
# Go to https://vercel.com/your-username/sawa-platform/settings/environment-variables

Write-Host "=== VERCEL ENVIRONMENT VARIABLES ==="
Write-Host ""
Write-Host "Add these in Vercel Dashboard (Production environment):"
Write-Host ""

Write-Host "1. DATABASE_URL"
Write-Host "Value: postgresql://neondb_owner:npg_f1miNsyE7FTe@ep-curly-morning-a2gqilg5-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"
Write-Host ""

Write-Host "2. POSTGRES_URL"
Write-Host "Value: postgresql://neondb_owner:npg_f1miNsyE7FTe@ep-curly-morning-a2gqilg5-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"
Write-Host ""

Write-Host "3. POSTGRES_USER"
Write-Host "Value: neondb_owner"
Write-Host ""

Write-Host "4. POSTGRES_HOST"
Write-Host "Value: ep-curly-morning-a2gqilg5-pooler.eu-central-1.aws.neon.tech"
Write-Host ""

Write-Host "5. POSTGRES_PASSWORD"
Write-Host "Value: npg_f1miNsyE7FTe"
Write-Host ""

Write-Host "6. POSTGRES_DATABASE"
Write-Host "Value: neondb"
Write-Host ""

Write-Host "7. DJANGO_SECRET_KEY"
Write-Host "Value: (see generated key above)"
Write-Host ""

Write-Host "8. DJANGO_DEBUG"
Write-Host "Value: False"
Write-Host ""

Write-Host "9. DJANGO_SETTINGS_MODULE"
Write-Host "Value: config.settings"
Write-Host ""

Write-Host "10. PYTHONPATH"
Write-Host "Value: backend"
Write-Host ""

Write-Host "11. ALLOWED_HOSTS"
Write-Host "Value: .vercel.app,.now.sh,localhost,127.0.0.1"
Write-Host ""

Write-Host "12. CORS_ALLOWED_ORIGINS"
Write-Host "Value: https://sawa-platform-8luzua1tj-tanvirs-projects-19ee2d72.vercel.app"
Write-Host ""

Write-Host "=== INSTRUCTIONS ==="
Write-Host "1. Go to: https://vercel.com/tanvirs-projects-19ee2d72/sawa-platform/settings/environment-variables"
Write-Host "2. Click 'Add New'"
Write-Host "3. Add each variable above"
Write-Host "4. Select 'Production' environment"
Write-Host "5. Click 'Save'"
Write-Host "6. Redeploy: vercel --prod"
