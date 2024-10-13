# Get-There

An app to help you get to your financial destination

## Getting Started

First, install all dependencies:

```bash
pnpm install
```

### Create .env.local file

Copy the `.env.example` file to `.env.local` and fill in the values or
contact an admin for the content of the file

### Generate JWT

1. Generate key using
   ```bash
   pnpm run generateKey
   ```
   The output of this command will be in your clipboard
2. Paste the result into your .env.local file with the prefix
   JWT_SIGNING_PRIVATE_KEY=

   it should look something like
   `javascript
JWT_SIGNING_PRIVATE_KEY={"kty":"oct","kid":"kidddddddddddddddddd","alg":"HS512","k":"kkkkkkkkkkkkkkkkkk"}
`

For more info see https://next-auth.js.org/warnings#jwt_auto_generated_signing_key

### Run

Then, run the development server:

```bash

pnpm dlx prisma migrate reset
pnpm dev
```
