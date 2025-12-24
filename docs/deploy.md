# Deployment Guide

This guide covers deploying the PowerShell Learning Website to Azure using Azure Static Web Apps and Azure Functions.

## Prerequisites

- Azure account with an active subscription
- Azure CLI installed (`az` command)
- Node.js 20+ and npm
- PowerShell 7+ (for the backend to work)
- Git

## Architecture

The application consists of two main components:

1. **Frontend**: React + Vite app hosted on Azure Static Web Apps
2. **Backend**: Azure Functions (Node.js with TypeScript) for PowerShell execution

## Deployment Options

### Option 1: Azure Static Web Apps (Recommended)

Azure Static Web Apps provides integrated hosting for both the frontend and the API.

#### Step 1: Create Azure Static Web App

```bash
# Login to Azure
az login

# Create a resource group (if you don't have one)
az group create --name powershell-learning-rg --location eastus

# Create the Static Web App
az staticwebapp create \
  --name powershell-learning \
  --resource-group powershell-learning-rg \
  --source https://github.com/<YOUR_USERNAME>/learning-website \
  --branch main \
  --app-location "/frontend" \
  --api-location "/api" \
  --output-location "dist" \
  --login-with-github
```

#### Step 2: Configure GitHub Integration

The Static Web Apps creation will automatically:
- Create a GitHub Actions workflow in your repository
- Configure CI/CD for automatic deployments
- Set up the API backend

The workflow file will be created at `.github/workflows/azure-static-web-apps-<generated-name>.yml`

#### Step 3: Environment Variables

Set environment variables in the Azure portal:

1. Go to Azure Portal → Your Static Web App → Configuration
2. Add the following application settings:
   - `FUNCTIONS_WORKER_RUNTIME`: `node`
   - `EXECUTION_TIMEOUT_MS`: `10000`
   - `MAX_SCRIPT_LENGTH`: `10000`
   - `ALLOWED_ORIGINS`: `*` (or your specific domain)
   - `APPINSIGHTS_INSTRUMENTATIONKEY`: (optional, for monitoring)

#### Step 4: Install PowerShell in Container

For Azure Functions to execute PowerShell, you need to configure the function app:

Create a `Dockerfile` in the `api` directory:

```dockerfile
FROM mcr.microsoft.com/azure-functions/node:4-node20

# Install PowerShell
RUN apt-get update && \
    apt-get install -y wget apt-transport-https software-properties-common && \
    wget -q https://packages.microsoft.com/config/debian/11/packages-microsoft-prod.deb && \
    dpkg -i packages-microsoft-prod.deb && \
    apt-get update && \
    apt-get install -y powershell && \
    rm packages-microsoft-prod.deb

# Copy function app files
COPY . /home/site/wwwroot

WORKDIR /home/site/wwwroot

RUN npm ci && npm run build
```

Update `api/host.json` to enable custom container:

```json
{
  "version": "2.0",
  "logging": {
    "applicationInsights": {
      "samplingSettings": {
        "isEnabled": true
      }
    }
  },
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[4.*, 5.0.0)"
  },
  "customHandler": {
    "description": {
      "defaultExecutablePath": "node"
    }
  }
}
```

### Option 2: Separate Deployments

#### Deploy Frontend to Azure Static Web Apps

```bash
# Build the frontend
cd frontend
npm install
npm run build

# Deploy (requires Azure CLI and Static Web Apps CLI)
npx @azure/static-web-apps-cli deploy \
  --app-location ./dist \
  --output-location . \
  --deployment-token <YOUR_DEPLOYMENT_TOKEN>
```

#### Deploy API to Azure Functions

```bash
# Install Azure Functions Core Tools
npm install -g azure-functions-core-tools@4

# Create Function App
az functionapp create \
  --resource-group powershell-learning-rg \
  --consumption-plan-location eastus \
  --runtime node \
  --runtime-version 20 \
  --functions-version 4 \
  --name powershell-learning-api \
  --storage-account <STORAGE_ACCOUNT_NAME>

# Deploy the functions
cd api
npm install
npm run build
func azure functionapp publish powershell-learning-api
```

## Custom Domain Setup (aidans.cloud)

### For Azure Static Web Apps

1. **Add Custom Domain in Azure Portal**:
   - Navigate to your Static Web App
   - Go to "Custom domains"
   - Click "Add" → "Custom domain on Azure DNS" or "Custom domain on other DNS"

2. **DNS Configuration**:

   For root domain (aidans.cloud):
   ```
   Type: A or ALIAS (depending on DNS provider)
   Name: @ or aidans.cloud
   Value: <static-web-app-ip-address>
   ```

   For subdomain (www.aidans.cloud or learn.aidans.cloud):
   ```
   Type: CNAME
   Name: www or learn
   Value: <your-static-web-app>.azurestaticapps.net
   ```

3. **Validation**:
   - Add the TXT record provided by Azure for domain verification
   ```
   Type: TXT
   Name: _dnsauth or _dnsauth.www
   Value: <verification-code>
   ```

4. **SSL Certificate**:
   - Azure Static Web Apps automatically provisions and manages SSL certificates
   - Wait 24-48 hours for DNS propagation and certificate issuance

### DNS Provider Examples

#### Cloudflare
1. Log in to Cloudflare
2. Select your domain
3. Go to DNS settings
4. Add CNAME record:
   - Name: `learn` or `@`
   - Target: `<your-app>.azurestaticapps.net`
   - Proxy status: DNS only (or Proxied for CDN)

#### Azure DNS
```bash
# Create DNS zone
az network dns zone create \
  --resource-group powershell-learning-rg \
  --name aidans.cloud

# Add CNAME record
az network dns record-set cname set-record \
  --resource-group powershell-learning-rg \
  --zone-name aidans.cloud \
  --record-set-name learn \
  --cname <your-app>.azurestaticapps.net
```

## Environment Variables for Production

### Frontend (.env.production)
```
VITE_API_URL=https://your-app.azurestaticapps.net/api
```

### Backend (Azure Function App Settings)
```
FUNCTIONS_WORKER_RUNTIME=node
EXECUTION_TIMEOUT_MS=10000
MAX_SCRIPT_LENGTH=10000
ALLOWED_ORIGINS=https://aidans.cloud,https://www.aidans.cloud
APPINSIGHTS_INSTRUMENTATIONKEY=<your-key>
```

## Monitoring and Logging

### Application Insights Setup

1. Create Application Insights resource:
```bash
az monitor app-insights component create \
  --app powershell-learning-insights \
  --location eastus \
  --resource-group powershell-learning-rg
```

2. Get Instrumentation Key:
```bash
az monitor app-insights component show \
  --app powershell-learning-insights \
  --resource-group powershell-learning-rg \
  --query instrumentationKey
```

3. Add to Function App configuration:
```bash
az functionapp config appsettings set \
  --name powershell-learning-api \
  --resource-group powershell-learning-rg \
  --settings "APPINSIGHTS_INSTRUMENTATIONKEY=<your-key>"
```

## Security Considerations

1. **Rate Limiting**: The API implements basic in-memory rate limiting (20 requests/minute per IP)
2. **Command Filtering**: Dangerous PowerShell commands are blocked
3. **Timeouts**: Scripts are terminated after 10 seconds
4. **CORS**: Configure allowed origins appropriately
5. **Container Isolation**: Each execution runs in an isolated environment

## Troubleshooting

### Issue: PowerShell not found in Azure Functions

**Solution**: Ensure PowerShell 7 is installed in the container. Use a custom Dockerfile or add installation steps.

### Issue: CORS errors

**Solution**: 
- Check `ALLOWED_ORIGINS` environment variable
- Ensure the frontend URL is included
- Verify the API is returning proper CORS headers

### Issue: Timeouts during execution

**Solution**:
- Increase `EXECUTION_TIMEOUT_MS` (but keep reasonable limits)
- Optimize PowerShell scripts for performance
- Check Azure Function plan scaling

### Issue: DNS not resolving

**Solution**:
- Verify DNS records are correct
- Wait for DNS propagation (24-48 hours)
- Use `nslookup` or `dig` to test DNS resolution
- Check domain registrar's nameservers

## Cost Estimation

### Azure Static Web Apps
- **Free tier**: Includes 100 GB bandwidth/month, 2 custom domains
- **Standard tier**: $9/month, includes 100 GB bandwidth, unlimited custom domains

### Azure Functions (Consumption Plan)
- **First 1 million executions**: Free
- **Additional**: $0.20 per million executions
- **Execution time**: $0.000016/GB-s

### Estimated Monthly Cost
- **Low traffic** (1000 users/month): ~$0-5
- **Medium traffic** (10,000 users/month): ~$10-20
- **High traffic** (100,000 users/month): ~$50-100

## Continuous Deployment

The GitHub Actions workflow automatically deploys on push to the main branch:

1. Lint and build frontend
2. Lint and build API
3. Deploy to Azure Static Web Apps
4. Run smoke tests

To manually trigger deployment:
```bash
git push origin main
```

## Backup and Recovery

1. **Code**: Stored in GitHub repository
2. **Content**: Versioned in the repository under `/content`
3. **User Progress**: Stored in browser localStorage (consider adding backend storage for persistence)

## Scaling Considerations

- Azure Static Web Apps scales automatically
- Azure Functions scale based on demand (Consumption plan)
- For very high traffic, consider Premium plan for better performance
- Implement caching for lesson content
- Consider CDN for global content delivery

## Support

For issues or questions:
- GitHub Issues: https://github.com/Aidan-Codes/learning-website/issues
- Azure Documentation: https://docs.microsoft.com/azure
