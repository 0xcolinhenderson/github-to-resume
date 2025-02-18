/** @type {import('next').NextConfig} */
import dotenv from 'dotenv';
dotenv.config();

const nextConfig = {
  env: {
    GOOGLE_GENERATIVE_AI_KEY: process.env.GOOGLE_GENERATIVE_AI_KEY,
    GITHUB_API_TOKEN: process.env.GITHUB_API_TOKEN,
  },
};

export default nextConfig;