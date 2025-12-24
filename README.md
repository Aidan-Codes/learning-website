# PowerShell Learning Website

An interactive, end-to-end PowerShell learning platform with an in-browser IDE and sandboxed execution environment. Learn PowerShell from basics to advanced topics through hands-on exercises.

🌐 **Live Demo**: [Coming soon at aidans.cloud]

## Features

- 🎓 **Structured Learning Path**: From basics to advanced topics
- 💻 **Interactive IDE**: Monaco Editor with PowerShell syntax highlighting
- ▶️ **Live Execution**: Run PowerShell code in a sandboxed environment
- 📝 **Rich Content**: Markdown lessons with code examples
- 🏋️ **Hands-on Exercises**: Practice with real coding challenges
- 💡 **Hints & Solutions**: Get help when you need it
- 📊 **Progress Tracking**: Track your learning journey
- 🌓 **Dark/Light Mode**: Comfortable coding in any environment
- 📱 **Responsive Design**: Works on desktop and mobile

## Course Content

### Getting Started
1. **Introduction to PowerShell** - Learn the basics and your first commands
2. **Variables and Data Types** - Work with data and perform operations

### Core Concepts
3. **Pipelines and Objects** - Master PowerShell's object-oriented pipeline
4. **Functions** - Create reusable code blocks
5. **Error Handling** - Write robust scripts with proper error handling

### Advanced Topics
6. **Files and JSON** - Read, write, and process data
7. **REST API Calls** - Interact with web services using Invoke-RestMethod

## Architecture

### Frontend
- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Editor**: Monaco Editor
- **Markdown**: react-markdown with GitHub Flavored Markdown

### Backend
- **Platform**: Azure Functions (Node.js 20)
- **Language**: TypeScript
- **Execution**: PowerShell 7 in sandboxed container
- **Security**: Rate limiting, command filtering, timeouts

### Content
- **Format**: Markdown files + JSON manifest
- **Location**: `/content` directory
- **Structure**: Sections → Lessons → Exercises

## Getting Started

### Prerequisites

- Node.js 20 or higher
- PowerShell 7 or higher (for API)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aidan-Codes/learning-website.git
   cd learning-website
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install API Dependencies**
   ```bash
   cd ../api
   npm install
   ```

### Development

#### Run Frontend (Development Server)

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

#### Run API (Azure Functions)

In a separate terminal:

```bash
cd api
npm start
```

The API will be available at `http://localhost:7071`

**Note**: Make sure PowerShell 7+ is installed and available in your PATH as `pwsh`.

#### Verify PowerShell Installation

```bash
pwsh --version
```

If not installed, visit: https://docs.microsoft.com/powershell/scripting/install/installing-powershell

### Building for Production

#### Build Frontend

```bash
cd frontend
npm run build
```

Output will be in `frontend/dist/`

#### Build API

```bash
cd api
npm run build
```

Output will be in `api/dist/`

## Project Structure

```
learning-website/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── types/         # TypeScript type definitions
│   │   ├── utils/         # Utility functions
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   ├── public/            # Static assets
│   └── package.json
├── api/                   # Azure Functions backend
│   ├── run/               # PowerShell execution endpoint
│   │   ├── function.json  # Function configuration
│   │   └── index.ts       # Function implementation
│   ├── host.json          # Functions host configuration
│   └── package.json
├── content/               # Course content
│   ├── lessons/           # Markdown lesson files
│   │   ├── 01-intro.md
│   │   ├── 02-variables.md
│   │   └── ...
│   └── manifest.json      # Course structure
├── docs/                  # Documentation
│   └── deploy.md          # Deployment guide
└── .github/
    └── workflows/
        └── ci.yml         # CI/CD pipeline
```

## API Endpoints

### POST /api/run

Execute PowerShell code in a sandboxed environment.

**Request:**
```json
{
  "script": "Write-Host 'Hello, PowerShell!'"
}
```

**Response:**
```json
{
  "stdout": "Hello, PowerShell!",
  "stderr": "",
  "exitCode": 0,
  "durationMs": 45
}
```

## Security

The sandbox environment includes multiple security measures:

- ✅ **Command Filtering**: Blocks dangerous operations (Remove-Item -Recurse, Format-, etc.)
- ✅ **Execution Timeout**: Scripts terminate after 10 seconds
- ✅ **Rate Limiting**: 20 requests per minute per IP
- ✅ **Script Length Limit**: Maximum 10,000 characters
- ✅ **Isolated Execution**: Each script runs in isolation
- ✅ **Limited Environment**: Restricted access to system resources
- ⚠️ **Outbound HTTP Allowed**: For learning REST API calls (as requested)

### Safety Disclaimer

This is a **learning environment**. While we implement security measures, users should:
- Not attempt to bypass security restrictions
- Not execute malicious code
- Use only for educational purposes
- Not rely on this for production workloads

## Development Scripts

### Frontend

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### API

```bash
npm start            # Start Azure Functions locally
npm run build        # Compile TypeScript
npm run watch        # Watch mode for development
```

## Linting and Code Quality

### ESLint (Frontend)

```bash
cd frontend
npm run lint
```

### Prettier (Both Frontend and API)

```bash
# Format code
npx prettier --write .

# Check formatting
npx prettier --check .
```

## Testing

Currently, no automated tests are included. To manually test:

1. Start both frontend and API
2. Navigate through lessons
3. Run code examples
4. Complete exercises
5. Verify output displays correctly

## Deployment

See [docs/deploy.md](docs/deploy.md) for detailed deployment instructions to Azure.

### Quick Deploy to Azure

1. **Prerequisites**: Azure account and Azure CLI installed

2. **Create Static Web App**:
   ```bash
   az staticwebapp create \
     --name powershell-learning \
     --resource-group your-rg \
     --source https://github.com/Aidan-Codes/learning-website \
     --branch main \
     --app-location "/frontend" \
     --api-location "/api" \
     --output-location "dist"
   ```

3. **Configure Environment Variables** in Azure Portal

4. **Set up Custom Domain** (aidans.cloud) - see deployment guide

## CI/CD

GitHub Actions workflow automatically:
- Lints frontend and API code
- Builds both applications
- Runs on push to main and PR branches

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and build
5. Submit a pull request

## License

MIT License - feel free to use this for your own learning projects!

## Acknowledgments

- PowerShell Team for the amazing scripting language
- Monaco Editor for the excellent code editor
- Azure for hosting infrastructure
- The open-source community

## Support

- 📝 **Issues**: [GitHub Issues](https://github.com/Aidan-Codes/learning-website/issues)
- 📧 **Email**: [Add your email]
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Aidan-Codes/learning-website/discussions)

---

Made with ❤️ for PowerShell learners everywhere
