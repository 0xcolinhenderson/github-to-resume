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
  const [normalText, setNormalText] = useState("");
  const [latexText, setLatexText] = useState("");
  const [activeTab, setActiveTab] = useState("normal");
  const [items, setItems] = useState(4)

  const handleFocus = () => {
    setIsClicked(true);
  };

  const handleBlur = () => {
    setIsClicked(false);
  };

  const handleChange = (e) => {
    setRepoUrl(e.target.value);
  };

  const handleItemChange = (e) => {
    setItems(Number(e.target.value));
  };

  const handleSubmit = async () => {
    
    if(!repoUrl.includes("github.com")){
      setError("Please enter a github link!");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const repoResponse = await fetch("/api/RepoHandler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoUrl }),
      });
  
      const repoResult = await repoResponse.json();
  
      if (!repoResponse.ok || !repoResult.success) {
        throw new Error(repoResult.message || "Failed to fetch repository");
      }
  
      const geminiResponse = await fetch("/api/PromptHandler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeData: repoResult.resumeData, items: items }),
      });
  
      const geminiResult = await geminiResponse.json();
  
      if (geminiResult.status == '500') {
        throw new Error(geminiResult.message || "Failed to generate resume content");
      }
  
      const { normalText, latexText } = parseResponse(geminiResult.resumeEntry);

      setNormalText(normalText);
      setLatexText(latexText);

      setSuccess(true);
    } catch ( ) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  function parseResponse(response) {
    const normalRegex = /NORMAL:\s([\s\S]+?)\s*LaTeX:/;
    const latexRegex = /LaTeX:\s([\s\S]+)/;
  
    const normalMatch = response.match(normalRegex);
    const latexMatch = response.match(latexRegex);
  
    const normalText = normalMatch ? normalMatch[1].trim() : '';
    const latexText = latexMatch ? latexMatch[1].trim() : '';
  
    return {
      normalText,
      latexText,
    };
  }

  const renderLatexText = () => {
    return (
      <pre className="language-latex p-4 bg-gray-800 text-white rounded-md">
        <code dangerouslySetInnerHTML={{ __html: Prism.highlight(latexText, Prism.languages.latex, 'latex') }} />
      </pre>
    );
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="relative w-full min-h-screen">
      <div className="absolute top-0 left-0 w-full h-full bg-[var(--primary-color)]"></div>
      <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-[var(--text-color)] top-[30vh] sm:top-[40vh]">
        <h1 className="text-5xl font-bold">RepoToResume</h1>
        <p className="text-lg text-center max-w-3xl mx-auto mt-2 pb-10 opacity-90">
          Quickly create an automated project card based on a public GitHub repository.
        </p>
      </div>

      <div className="absolute top-[50vh] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl p-4 bg-white rounded-lg"
        style={{
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.7)",
        }}>
        <div className="flex flex-col md:flex-row gap-2">
          
          <input
            type="text"
            className="w-full pl-10 p-3 border rounded-md  bg-[var(--input-bg)] focus:outline-none"
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
            <svg style={{ transform: 'translateY(29px)' }} width="40px" height="25" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.7388 4.26118C17.0572 1.57961 12.7095 1.57961 10.0279 4.26118L9.30707 4.98203C9.01418 5.27492 9.01418 5.7498 9.30707 6.04269C9.59997 6.33558 10.0748 6.33558 10.3677 6.04269L11.0886 5.32184C13.1844 3.22605 16.5823 3.22605 18.6781 5.32184C20.7739 7.41763 20.7739 10.8156 18.6781 12.9114L17.9573 13.6322C17.6644 13.9251 17.6644 14.4 17.9573 14.6929C18.2502 14.9858 18.725 14.9858 19.0179 14.6929L19.7388 13.972C22.4203 11.2905 22.4203 6.94276 19.7388 4.26118Z" />
              <path d="M6.04269 9.30707C6.33558 9.59997 6.33558 10.0748 6.04269 10.3677L5.32184 11.0886C3.22605 13.1844 3.22605 16.5823 5.32184 18.6781C7.41763 20.7739 10.8156 20.7739 12.9114 18.6781L13.6322 17.9573C13.9251 17.6644 14.4 17.6644 14.6929 17.9573C14.9858 18.2501 14.9858 18.725 14.6929 19.0179L13.972 19.7388C11.2905 22.4203 6.94276 22.4203 4.26118 19.7388C1.57961 17.0572 1.57961 12.7095 4.26118 10.0279L4.98203 9.30707C5.27492 9.01418 5.7498 9.01418 6.04269 9.30707Z" />
              <path d="M14.6928 9.30707C14.9857 9.59997 14.9857 10.0748 14.6928 10.3677L10.3677 14.6928C10.0748 14.9857 9.59997 14.9857 9.30707 14.6928C9.01418 14.3999 9.01418 13.9251 9.30707 13.6322L13.6322 9.30707C13.9251 9.01418 14.3999 9.01418 14.6928 9.30707Z" />
            </svg>
          </div>

        <div className="rounded-md pr-4 flex">
          <select
            value={items}
            onChange={handleItemChange}
            className="rounded-md h-full border p-3 ml-1"
            style={{
              marginLeft: "5px",
              color: "var(--highlight)",
              backgroundColor: "var(--input-bg)",
              borderColor: isClicked ? "var(--highlight)" : "var(--input-border-color)",
              boxShadow: "var(--input-shadow)",
            }}
          >
            {Array.from({ length: 7 }, (_, index) => (
              <option key={index + 2} value={index + 2}>
                {index + 2}
              </option>
            ))}
          </select>
          
          <span
            className="pl-3"
            style={{
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              marginTop: '0px',
            }}
          >
            Bullet Points
          </span>
          
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
      
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center w-60">
            <div role="status">
                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin  fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
            </div>
            <p className="mt-2 text-lg">Generating...</p>
          </div>
        </div>
      )}

      {success && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white border-4 rounded-2xl p-6 shadow-lg w-[60%] h-[60%]">
            <button
              className="absolute top-3 right-5 text-[var(--highlight)] text-2xl hover:text-gray-700"
              onClick={() => setSuccess(false)}
            >
              ✕
            </button>
            <h3 className="text-xl text-[var(--highlight)] text-center mt-4 pb-2">Generated Resume</h3>
            <div className="flex-1 p-4 border rounded-lg overflow-auto">
              <div>
                <div className="flex gap-4 mb-4">
                  <button
                    className={`p-2  border rounded-lg ${activeTab === "normal" ? "bg-[var(--highlight)] text-white" : "bg-transparent"}`}
                    onClick={() => setActiveTab("normal")}
                  >
                    Normal
                  </button>
                  <button
                    className={`p-2  border rounded-lg ${activeTab === "latex" ? "bg-[var(--highlight)] text-white" : "bg-transparent"}`}
                    onClick={() => setActiveTab("latex")}
                  >
                    LaTeX
                  </button>
                </div>

                {activeTab === "normal" && (
                  <div className="overflow-hidde">
                    <textarea
                      className="w-full h-60 p-2 border-2 rounded-md overflow-hidden"
                      value={normalText}
                      readOnly
                      style={{
                        background: "#f7f7f7",
                        fontSize: "0.9rem",
                        transform: "scale(1)",
                        transformOrigin: "top left",
                        resize: "none",
                        overflowY: "auto",
                        height: "300px",
                      }}
                    />
                  </div>
                )}

                {activeTab === "latex" && (
                  <div>
                    {renderLatexText()}
                  </div>
                )}
              </div>

              <button className="mt-2 p-1 flex items-center" onClick={() => copyText(activeTab === "normal" ? normalText : latexText)}>
                <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                  <path d="M10 8V7C10 6.05719 10 5.58579 10.2929 5.29289C10.5858 5 11.0572 5 12 5H17C17.9428 5 18.4142 5 18.7071 5.29289C19 5.58579 19 6.05719 19 7V12C19 12.9428 19 13.4142 18.7071 13.7071C18.4142 14 17.9428 14 17 14H16M7 19H12C12.9428 19 13.4142 19 13.7071 18.7071C14 18.4142 14 17.9428 14 17V12C14 11.0572 14 10.5858 13.7071 10.2929C13.4142 10 12.9428 10 12 10H7C6.05719 10 5.58579 10 5.29289 10.2929C5 10.5858 5 11.0572 5 12V17C5 17.9428 5 18.4142 5.29289 18.7071C5.58579 19 6.05719 19 7 19Z" stroke="#464455" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            </div>
          </div>
      )}

      {error && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-3 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}
