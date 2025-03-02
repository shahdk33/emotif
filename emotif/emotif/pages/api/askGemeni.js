// pages/api/askGemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";  // import the required package

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { events, emotions } = req.body;  // Receive events and emotions in the body

    try {
      const genAI = new GoogleGenerativeAI("AIzaSyBeKx1KioTFlKyEWeR2pFTZSCmtE5SuJpk");  // Initialize Google Generative AI
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });  // Get the specific model
      const prompt = `Given the calendar events of a user:${JSON.stringify(events)} and their logged emotions for a day:${JSON.stringify(emotions)}, could you create ONE suggestion for an activity that the user could do in their free time that would make the user feel better? Specifically say what activity and the reason for suggesting that activity. Please provide your answer in the following format without the json keyword or the three backticks at the begining or end, JUST plain text as this format: [{"date": "", "endtime": "", "name": "AI suggested activity: ", "starttime": ""}]. Please do not include any other text, JUST the json format of the recommended activities.`;

      // Generate the response from the AI model
      const result = await model.generateContent([prompt]);
      const responseText =  result.response.text().replace(/^```json\n|\n```$/g, '').trim(); 
      
      //todo: result is returned as string like this: "```json "
      res.status(200).json({ suggestedActivities: responseText });  // Return the suggested activities
      console.log(res.status(200).json({ suggestedActivities: responseText }));

    } catch (error) {
      res.status(500).json({ error: 'Error generating content: ' + error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });  // Handle incorrect HTTP methods
  }
}
