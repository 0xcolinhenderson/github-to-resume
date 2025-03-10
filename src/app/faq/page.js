import React from 'react';
import Navbar from '../components/Navbar';

const FAQ = () => {
  return (
    <div className="w-full">
      <Navbar />
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h1>
        <div className="space-y-6">
          <div>
            <h2 className="text-[var(--highlight)] font-bold text-2xl">What is RepoToResume?</h2>
            <p className="text-gray-800 text-xl">
              RepoToResume is a tool that converts GitHub repositories into professional resume cards.
            </p>
          </div>
          <div>
            <h2 className="text-[var(--highlight)] font-bold text-2xl">How does it work?</h2>
            <p className="text-gray-800 text-xl">
              You provide a GitHub repository, and RepoToResume generates a resume based on the repository's content.
              It extracts key files and metadata from your repository to query Google's Gemini API (flash 2.0) to 
              generate an accurate and professional item.
            </p>
          </div>
          <div>
            <h2 className="text-[var(--highlight)] font-bold text-2xl">Is it free to use?</h2>
            <p className="text-gray-800 text-xl">Yes, RepoToResume is free to use. This project is just a fun tool I made for myself,
              and is completely open-source!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;