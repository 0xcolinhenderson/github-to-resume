"use client";

import { useState, useEffect } from "react";

import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-latex.min.js";


export default function Home() {
  const [isClicked, setIsClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [expandSuccess, setExpandSuccess] = useState(false);
  const [normalText, setNormalText] = useState("Example resume text with normal formatting.");
  const [latexText, setLatexText] = useState("\\textbf{Example resume text with LaTeX formatting.}");

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setExpandSuccess(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleFocus = () => {
    setIsClicked(true);
  };

  const handleBlur = () => {
    setIsClicked(false);
  };

  const handleChange = (e) => {
    setRepoUrl(e.target.value);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setExpandSuccess(false);

    try {
      const response = await fetch("/api/RepoHandler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoUrl }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Something went wrong");
      } else if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message || "Failed to fetch repository");
      }
    } catch (err) {
      setError("An error occurred while checking the repository");
    } finally {
      setIsLoading(false);
    }
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="relative w-full min-h-screen">
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-[var(--primary-color)]"></div>
      <div className="absolute top-[50vh] left-0 w-full min-h-[50vh] bg-[var(--secondary-color)]"></div>
      <div className="absolute top-[25vh] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-[var(--text-color)]">
        <h1 className="text-5xl font-bold">GitHub To Resume</h1>
        <p className="text-lg text-center max-w-3xl mx-auto mt-2 opacity-90">
          Quickly create an automated project item based on a GitHub repository.
        </p>
      </div>

      <div className="absolute top-[50vh] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl p-4 bg-white rounded-lg"
        style={{
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.7)",
        }}>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            className="w-full pl-10 p-3 border rounded-md mb-3 bg-[var(--input-bg)] focus:outline-none h-full"
            placeholder="Enter GitHub Repository URL"
            value={repoUrl}
            onChange={handleChange}
            style={{
              backgroundColor: "var(--input-bg)",
              borderColor: isClicked ? "var(--highlight)" : "var(--input-border-color)",
              boxShadow: "var(--input-shadow)",
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <div className="absolute left-3 transform -translate-y-4 translate-x-2" style={{
            fill: isClicked ? "var(--highlight)" : "var(--input-border-color)",
          }}>
            <svg style={{ transform: 'translateY(27px)' }} width="40px" height="25" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.7388 4.26118C17.0572 1.57961 12.7095 1.57961 10.0279 4.26118L9.30707 4.98203C9.01418 5.27492 9.01418 5.7498 9.30707 6.04269C9.59997 6.33558 10.0748 6.33558 10.3677 6.04269L11.0886 5.32184C13.1844 3.22605 16.5823 3.22605 18.6781 5.32184C20.7739 7.41763 20.7739 10.8156 18.6781 12.9114L17.9573 13.6322C17.6644 13.9251 17.6644 14.4 17.9573 14.6929C18.2502 14.9858 18.725 14.9858 19.0179 14.6929L19.7388 13.972C22.4203 11.2905 22.4203 6.94276 19.7388 4.26118Z" />
              <path d="M6.04269 9.30707C6.33558 9.59997 6.33558 10.0748 6.04269 10.3677L5.32184 11.0886C3.22605 13.1844 3.22605 16.5823 5.32184 18.6781C7.41763 20.7739 10.8156 20.7739 12.9114 18.6781L13.6322 17.9573C13.9251 17.6644 14.4 17.6644 14.6929 17.9573C14.9858 18.2501 14.9858 18.725 14.6929 19.0179L13.972 19.7388C11.2905 22.4203 6.94276 22.4203 4.26118 19.7388C1.57961 17.0572 1.57961 12.7095 4.26118 10.0279L4.98203 9.30707C5.27492 9.01418 5.7498 9.01418 6.04269 9.30707Z" />
              <path d="M14.6928 9.30707C14.9857 9.59997 14.9857 10.0748 14.6928 10.3677L10.3677 14.6928C10.0748 14.9857 9.59997 14.9857 9.30707 14.6928C9.01418 14.3999 9.01418 13.9251 9.30707 13.6322L13.6322 9.30707C13.9251 9.01418 14.3999 9.01418 14.6928 9.30707Z" />
            </svg>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full md:w-auto p-3 rounded-md font-bold h-full"
            style={{
              backgroundColor: "var(--highlight)",
              color: "var(--button-text)",
              borderColor: "var(--border-color)",
            }}
          >
            Generate
          </button>
        </div>
      </div>
      
      {success && !isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className={`relative bg-white border-4 rounded-2xl p-6 shadow-lg transition-all duration-500 ${expandSuccess ? 'w-[60%] h-[60%]' : 'w-80'}`}>
            {expandSuccess && (
              <button 
                className="absolute top-3 right-5 text-[var(--highlight)] text-2xl hover:text-gray-700" 
                onClick={() => setSuccess(false)}
              >
                ✕
              </button>
            )}
            {!expandSuccess ? (
              <div className="flex items-center justify-center mb-4">
                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin  fill-[var(--highlight)] m-1 p-1" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                  <div className="text-black text-lg">Loading...</div>
              </div>
            ) : (
              <div className="flex flex-col items-center w-full">
              <h2 className="text-xl font-bold text-center mt-4">Example Resume Project</h2>

              <div className="flex flex-col md:flex-row gap-4 mt-6 w-full flex-grow">
                <div className="flex-1 p-4 border-1 rounded-lg">
                  <h3 className="text-lg font-thin mb-2">Normal Formatting</h3>
                  <div className="w-full h-60">
                    <textarea
                      className="w-full h-full p-2 border-2 rounded-md"
                      value={normalText || ""}
                      readOnly
                    />
                  </div>
                  <button
                    className="mt-2 p-1"
                    onClick={() => copyText(normalText)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6" style={{ color: 'grey' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                    </svg>
                  </button>
                </div>
                <div className="flex-1 p-4 border-1 rounded-lg">
                  <h3 className="text-lg font-thin mb-2">LaTeX Formatting</h3>
                  <div
                    contentEditable={false}
                    className="w-full h-60 p-2 border-2 rounded-md bg-white"
                    onInput={handleChange}
                    dangerouslySetInnerHTML={{
                      __html: Prism.highlight(latexText, Prism.languages.latex, "latex"),
                    }}
                  />
                  <button
                    className="mt-2 p-1"
                    onClick={() => copyText(latexText)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6" style={{ color: 'grey' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-lg"></div>
        </div>
      )}

      {error && !isLoading && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg">
          <div role="alert" className="w-full">
            <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
              Error
            </div>
            <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
