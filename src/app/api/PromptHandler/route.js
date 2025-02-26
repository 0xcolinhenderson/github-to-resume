import dotenv from 'dotenv';
dotenv.config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

export async function POST(request) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", { month: "long", year: "numeric" });
  };

  const parseResponse = (response) => {
    const cleanedResponse = response.replace(/\*/g, '');

    const normalRegex = /NORMAL:\s([\s\S]+?)\s*LaTeX:/;
    const latexRegex = /LaTeX:\s([\s\S]+)/;

    const normalMatch = cleanedResponse.match(normalRegex);
    const latexMatch = cleanedResponse.match(latexRegex);

    return {
      normalText: normalMatch ? normalMatch[1].trim() : '',
      latexText: latexMatch ? latexMatch[1].trim() : '',
    };
  };

  try {
    const requestBody = await request.json();

    const { resumeData, items } = requestBody;
    if (!resumeData) {
      console.error("resumeData is missing");
      return new Response(JSON.stringify({ message: "resumeData is missing" }), { status: 400 });
    }

    const {
      name,
      description,
      created_at,
      updated_at,
      languages,
      files,
    } = resumeData;

    const startMonth = formatDate(created_at);
    const lastUpdatedMonth = formatDate(updated_at);

    const formattedFiles = files
      .map(
        (file) =>
          `${Object.keys(file)[0]}:\n${Object.values(file)[0]
            .split("\n")
            .slice(0, 10)
            .join("\n")}\n...`
      )
      .join("\n\n");

    const prompt = `
    Repository: ${name}
    Description: ${description || "No description provided"}
    Languages: ${languages}
    Created at: ${startMonth}
    Last Updated: ${lastUpdatedMonth}

    Code Samples:
    ${formattedFiles || "No relevant code samples available"}

    Generate ${items} resume-style bullet points describing this project.
    Use optional numbers (percentages or regular numbers) when relevant (talking about metrics).
    Bullet points should be detailed, professional, and articulate (they should be around one long sentence each).
    They should focus on features & technologies that are relevant, but not go too deep into the exact specification of the code.
    If you do not have enough information about the project, feel free to make minor assumptions about the project (if necessary)
    Avoid including vague or unnecessary details about the project, or insignificant things such as minor utility or components.

    You will not bold or italicize anything.
    List bullet points with "-".

    You will then write the exact same thing, but in LaTeX in the format specified below.

    An example of a bullet point you might generate could look something like this. DO NOT COPY THESE

    Developed an innovative _ application that utilizes _ to _, providing  _ using _ , obtaining an accuracy of _%
    Engineered _ that provides personalized _ for different _, resulting in a _% increase in _ and an overall satisfaction rate of _ from beta testers
    Integrated intuitive UI utilizing _, allowing for seamless transitions between _ and _.

      The LaTeX part should be formatted to be used in a LaTeX document.

    Format it in this style (DO NOT BOLD OR ITALICIZE ANYTHING):
    NORMAL:
    [Project Name] | [Languages, Frameworks]
    [Start Month (abbreviated) + Year] - [Last Updated Month (abbreviated) + Year]
    [Bullet points]

    LaTeX:
    [Project Name] | [Languages, Frameworks]
    [Start Month (abbreviated) + Year] - [Last Updated Month (abbreviated) + Year]
    [Bullet points]
    `;


    const geminiResponse = await model.generateContent(prompt);

    if (!geminiResponse || !geminiResponse.response || !geminiResponse.response.candidates || !geminiResponse.response.candidates[0]) {
      throw new Error("Failed to generate resume content");
    }

    const geminiText = geminiResponse.response.text();
    const { normalText, latexText } = parseResponse(geminiText);

    return new Response(JSON.stringify({ normalText, latexText }), { status: 200 });
  } catch (error) {
    console.error("Error occurred:", error);
    return new Response(
      JSON.stringify({ message: "Failed to generate project resume entry", error: error.message }),
      { status: 500 }
    );
  }
}