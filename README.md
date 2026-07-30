# ibrahim-portfolio

Ibrahim Khadraoui's portfolio — a simple, text-first site for an AI / ML systems engineer working on edge inference and embodied AI, built with Next.js and deployed on Vercel.

## Stack

- [Next.js](https://nextjs.org/) (App Router)
- React 19
- TypeScript
- CSS Modules

Content lives in typed data files under `data/` (profile, experience, projects, articles, publications, awards, education) rather than in a CMS, so pages stay static and content changes are plain TypeScript edits.

## Routes

- `/` — home
- `/projects` — project list
- `/projects/[slug]` — individual project
- `/experience` — work experience
- `/articles` — article list
- `/articles/[slug]` — individual article
- `/about` — about, publications, awards, GitHub activity
- `/contact` — contact channels

The site also ships a dark/light theme toggle, persisted per visitor.

## Running the development server

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Other commands

```bash
npm run build   # production build
npm run lint    # lint app, components, data, and types
```

## Next.js Resources

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## License

MIT — see [LICENSE](./LICENSE). Originally based on the [vscode-portfolio](https://github.com/itsnitinr/vscode-portfolio) template by Nitin Ranganath.
