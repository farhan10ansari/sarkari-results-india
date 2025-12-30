
import { GoogleGenAI } from "@google/genai";
import { JobPostDraft } from "../types";

export const parseJobDescriptionWithAI = async (rawText: string): Promise<JobPostDraft> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  // Always use the named parameter 'apiKey' when initializing GoogleGenAI.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    You are a data entry expert for a government job portal (like Sarkari Result).
    I will provide raw text from a job notification. 
    You must extract the data and structure it into a JSON format suitable for the frontend application.

    The structure must be a JSON object with:
    - title: string
    - slug: string (kebab-case)
    - shortDescription: string (2-3 sentences)
    - lastDate: string (ISO date or text)
    - sections: Array of Section objects.

    Definitions:
    
    BlockType = "KEY_VALUE" | "TABLE" | "MARKDOWN" | "LINKS" | "DATES"

    ContentBlock = {
      id: string (uuid),
      type: BlockType,
      key: string (optional, for KV, DATES, LINKS),
      value: string (optional, for KV, DATES, LINKS, MARKDOWN),
      tableData: { "columns": string[], "rows": Array<object> } (optional, for TABLE)
    }

    SubSection = {
      id: string (uuid),
      type: "SUB_SECTION",
      title: string,
      children: Array of ContentBlock
    }

    Section = {
      id: string (uuid),
      type: "SECTION",
      title: string,
      children: Array of (ContentBlock OR SubSection)
    }

    Rules:
    - Group related data into Sections.
    - Each "ContentBlock" must represent only ONE item. For example, if there are 3 important dates, create 3 separate ContentBlock objects of type "DATES".
    - "DATES" type: key is the date label (e.g. "Last Date"), value is the date.
    - "KEY_VALUE" type: key is the field name (e.g. "Post Name"), value is the data.
    - "LINKS" type: key is link text, value is URL.
    - "MARKDOWN" type: value contains the text.
    - "TABLE" type: tableData contains columns and rows.

    Raw Text:
    ${rawText}
  `;

  // Fix: Use 'gemini-3-flash-preview' for text processing tasks.
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json'
    }
  });

  // Access the generated text via the .text property (not a method).
  const text = response.text;
  if (!text) throw new Error("No response from AI");

  try {
    const data = JSON.parse(text);
    return data as JobPostDraft;
  } catch (e) {
    console.error("Failed to parse AI response", e);
    throw new Error("AI generated invalid JSON");
  }
};
