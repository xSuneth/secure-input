# Publishing to NPM

## Prerequisites

1. **NPM Account**: Create an account at https://www.npmjs.com/
2. **NPM Login**: Run `npm login` to authenticate
3. **Scope Access**: If using `@secure-input` scope:
   - Create an organization at https://www.npmjs.com/org/create
   - OR use your username: `@yourusername/package-name`

## Pre-Publishing Checklist

### 1. Update Package Metadata

Edit the following in ALL package.json files:

```json
{
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/secure-input.git"
  }
}
```

Files to update:

- `packages/wasm/package.json`
- `packages/core/package.json`
- `packages/react/package.json`

### 2. Choose Package Names

**Option A: Use your own scope**

```json
{
  "name": "@yourusername/secure-input-wasm",
  "name": "@yourusername/secure-input-core",
  "name": "@yourusername/secure-input-react"
}
```

**Option B: Use unscoped names**

```json
{
  "name": "secure-input-wasm",
  "name": "secure-input-core",
  "name": "secure-input-react"
}
```

### 3. Final Build

```powershell
# Clean and rebuild everything
pnpm clean
.\build.ps1
```

### 4. Test the Build

```powershell
# Test in the demo
cd packages\examples\react-demo
pnpm dev
```

## Publishing Steps

### Step 1: Login to NPM

```powershell
npm login
```

### Step 2: Version the Packages

```powershell
# This will update versions based on the changeset
pnpm changeset version
```

### Step 3: Build for Production

```powershell
.\build.ps1
```

### Step 4: Publish

**Option A: Publish all packages at once**

```powershell
pnpm release
```

**Option B: Publish individually**

```powershell
# Publish WASM package first
cd packages\wasm
npm publish --access public

# Then core
cd ..\core
npm publish --access public

# Finally react
cd ..\react
npm publish --access public
```

### Step 5: Verify Publication

```powershell
# Check on NPM
npm view @secure-input/core
npm view @secure-input/react
npm view @secure-input/wasm
```

## Usage After Publishing

Users can install your packages:

```bash
# Install React package (includes all dependencies)
npm install @secure-input/react

# Or install core only for other frameworks
npm install @secure-input/core
```

## Updating Versions

For future updates:

1. Make your changes
2. Create a changeset:
   ```powershell
   pnpm changeset
   ```
3. Select packages and bump type (patch/minor/major)
4. Version and publish:
   ```powershell
   pnpm changeset version
   .\build.ps1
   pnpm release
   ```

## Troubleshooting

### "403 Forbidden" Error

- You don't have permission to publish to that scope
- Solution: Use `@yourusername/` or create an organization

### "Package name already exists"

- Someone already published that name
- Solution: Use a different name or scope

### "Missing README"

- Add README.md to each package
- Already included in this project

### Workspace Dependencies Not Resolving

- Make sure you've published dependencies first
- Publish order: wasm → core → react

## GitHub Repository (Optional)

To enable automatic publishing on release:

1. Push to GitHub:

   ```powershell
   git remote add origin https://github.com/yourusername/secure-input.git
   git push -u origin master
   ```

2. Add NPM token to GitHub Secrets:

   - Generate token: `npm token create`
   - Add to: Settings → Secrets → `NPM_TOKEN`

3. Create a release on GitHub to trigger automatic publishing

## Quick Publish Script

```powershell
# One-command publish (after initial setup)
.\build.ps1 && pnpm changeset version && pnpm release
```
