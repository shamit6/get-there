Get There

## Getting Started

### Generate auth key

This update requires the next steps

1. generate key using `yarn run generateKey`
2. copy paste the resulte into your `.env.local` file with the prefix

```
JWT_SIGNING_PRIVATE_KEY=
```

it should look something like

```
JWT_SIGNING_PRIVATE_KEY={"kty":"oct","kid":"kidddddddddddddddddd","alg":"HS512","k":"kkkkkkkkkkkkkkkkkk"}
```

For more info see https://next-auth.js.org/warnings#jwt_auto_generated_signing_key

### Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.tsx`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.
