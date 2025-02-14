# Node.js - Express.js REST API with Typescript

## Load Template with [`template-use`](https://github.com/template-use/template-use)
```bash
npx template-use express-ts
```

## Installation
```bash
npm install
```

OR

```bash
npm install express body-parser cookie-parser cors morgan
npm install --save-dev typescript ts-node nodemon @types/express @types/node @types/morgan @types/cors @types/cookie-parser
```

## Usage with Vercel
- Install `@vercel/node`
```bash
npm install @vercel/node
```

- Add `vercel.json`
```json
{
    "version": 2,
    "builds": [
        {
        "src": "src/index.ts",
        "use": "@vercel/node"
        }
    ],
    "routes": [
        {
        "src": "/(.*)",
        "dest": "/src/index.ts"
        }
    ]
}
```

- Update `scripts` of `package.json`
```json
{
    "scripts": {
        "dev": "",
        "build": "tsc",
        "start": "node dist/server.js"
    }
}
```

- Vercel Deployment Configuration
    - Root directory: Leave it empty (or set it to `/`).
    - Build command: `npm run build`
    - Output directory: `dist` (if applicable, but Vercel auto-detects it)
    - Install command: `npm install`
    - Click "Deploy".