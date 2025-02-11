const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyD1z08FY3VRI9Sp3xpicZWrjsOOsqmjwyQ");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(request) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", { month: "long", year: "numeric" });
  };

  const getCurrentMonth = () => {
    const currentDate = new Date();
    return currentDate.toLocaleString("en-US", { month: "long", year: "numeric" });
  };

  try {
    const requestBody = await request.json();

    const { resumeData, items } = requestBody;
    if (!resumeData) {
      return new Response(JSON.stringify({ message: "resumeData is missing" }), { status: 400 });
    }

    const currentMonth = getCurrentMonth();

    const {
      name,
      description,
      stars,
      forks,
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
    Current Month: ${currentMonth}

    Code Samples:
    ${formattedFiles || "No relevant code samples available"}

    Generate ${items} resume-style bullet points describing this project.
    Use optional numbers (percentages or regular numbers) when relavent (talking about metrics).
    Bullet points should be detailed, professional, and articulate (although they should be one sentence each).
    They should focus on features & technologies that are relavent, but not go too deep into the exact specification of the code.
    If you do not have enough information about the project, feel free to make minor assumptions about the project (if necessary)
    Avoid including vague or unnecessary details about project, or insignifacnt things such as minor libraries/utility or components.

    You will not bold or italicize anything.
    List bullet points with "-".

    You will then write the exact same thing, but in LaTeX in the format specified below.

    Format it in this style:
    NORMAL:
    [Project Name] | [Languages, Frameworks]
    [Start Month (abreviated if necessary)] - [Last Updated Month (or "Current" if is current month)]
    [Bullet points]

    LaTeX:
    [Project Name] | [Languages, Frameworks]
    [Start Month] - [Last Updated Month]
    [Bullet points]
    `;

    const geminiResponse = await model.generateContent(prompt);
    const formattedDescription = geminiResponse.response.text() || "Failed to generate a description.";

    return new Response(
      JSON.stringify({ resumeEntry: formattedDescription }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Failed to generate project resume entry" }),
      { status: 500 }
    );
  }
}
