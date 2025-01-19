const { GoogleGenerativeAI } = require("@google/generative-ai");

async function askGemini(events, emotions) {
    try {
        const genAI = new GoogleGenerativeAI("AIzaSyBeKx1KioTFlKyEWeR2pFTZSCmtE5SuJpk");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "Given the calendar events of a user:" +JSON.stringify(events)+" and their logged emotions for a day:" +JSON.stringify(emotions)+", could you create suggestions for activities that the user could do in their free time that would make the user feel better? Specifically say what activity and the reason for suggesting that activity. Please provide your answer in the following format:{\"date\": \"\",\"endtime\": \"\",\"name\": \"AI suggested activity: \",\"starttime\": \"\"}. Here is an example output:[{\"date\": \"20-01-2025\", \"endtime\": \"14:35\", \"name\": \"AI suggested activity: Go for a walk, it will make you feel less anxious\", \"starttime\": \"12:55\"}].Please do NOT include '```json' at start and '```' at the end of the output.";

        const result = await model.generateContent([prompt]);
       return result.response.text();
    } catch (error) {
        return 'Error generating content:'+ error;
    }
}
