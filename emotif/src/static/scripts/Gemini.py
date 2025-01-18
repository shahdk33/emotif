import google.generativeai as genai

genai.configure(api_key="AIzaSyBeKx1KioTFlKyEWeR2pFTZSCmtE5SuJpk")
model = genai.GenerativeModel("gemini-1.5-flash")
emotion = '{[null,{"date": "20-01-2025","emotion": "joy","level": 5,"time": "10:47"},{"date": "20-01-2025","emotion": "anxiety","level": 4,"time": "12:55"}]}'
events ='{[null,{"date": "20-01-2025","endtime": "19:00","name": "WiTS meeting","starttime": "18:00"},{"date": "20-01-2025","endtime": "12:25","name": "CSCI4147 Class","starttime": "11:35"},{"date": "20-01-2025","endtime": "15:55","name": "CSCI 4176","starttime": "14:35"},{"date": "20-01-2025","endtime": "10:30","name": "Gym","starttime": "9:30"}]}'
response = model.generate_content("Given the calendar events of a user:"+events+" and their logged emotions for a day:"+emotion+", could you create suggestions for activities that the user could do in their free time that would make the user feel better?Please provide your answer in the following format:{\"date\": \"\",\"endtime\": \"\",\"name\": \"\",\"starttime\": \"\"}")
print(response.text)