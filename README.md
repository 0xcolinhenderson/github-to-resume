RepoToResume

A web application that fetches GitHub repositories using the GitHub API, extracts key information, and formats it into a professional resume card using the Gemini API. Users can choose between a standard format or LaTeX output.

Features

Fetch GitHub Repositories: Uses GitHub API to retrieve public repositories of a user.

Extract Key Information: Parses relevant details like repository name, description, technologies used, and contributions.

Format Resume Card: Utilizes the Gemini API to format extracted details into a professional resume.

Multiple Output Formats: Supports standard resume formatting and LaTeX output.

Modern UI: Built with Next.js, Tailwind CSS, and React for a sleek and responsive design.

Deployment on Vercel: Hosted on Vercel for seamless performance and scalability.

Tech Stack

Frontend: Next.js, React, Tailwind CSS

Backend/API: GitHub API, Gemini API

Hosting: Vercel

Getting Started
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
