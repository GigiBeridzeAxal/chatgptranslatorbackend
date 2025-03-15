const OpenAI = require('openai')
const UserModel = require('../models/UserModel')

const openai = new OpenAI({
  apiKey: process.env.openaikey,
});

const OpenAimod = async(texttotranslate , language) => {
    console.log(process.env.openaikey)
    

    const options = {
      text:texttotranslate,
      translateLanguage:language
    }

    const texttosend = `Translate This Words:${options.text} And Return Only Translated Version if you cant translate just return "I Cant Translate" TranslateLanguage:${options.translateLanguage}`


      const completion = openai.chat.completions.create({
        model: "gpt-4o-mini",
        store: true,
        messages: [
          {"role": "user", "content": texttosend},
        ],
      });
    return completion.then((result) =>  result.choices[0].message)

      
      

}


const OpenAiSuggested = async(userid) => {

  console.log(userid)
  const userallinfo = await UserModel.find({})
  const user = userallinfo.filter(filt => filt._id === userid)
  const userwithoutsender = userallinfo.filter(filt => filt._id !== userid)

  const options ={
    userdetails:user.toString(),
    alluserdata:userwithoutsender.toString(),
    

  }
  
  console.log()
  const texttosend = `${options.userdetails} for this user filter data from this ${options.alluserdata} Return Only Json Format`

  
  const openai = new OpenAI({
    apiKey: process.env.openaikey,
  });
  const completion = openai.chat.completions.create({
    model: "gpt-4o-mini",
    store: true,
    messages: [
      {"role": "user", "content": texttosend},
    ],
  });
return completion.then((result) =>  result.choices[0].message)
  

}


const Audiotranslator = async(audio) => {

  console.log(audio)

  const formData = new FormData();

  // Convert the audio blob into a File (adjust the file name and type as necessary)
  const audioFile = new File([audio.file], "audio.wav", { type: "audio/wav" });
  formData.append("file", audioFile);


  const completion = await openai.chat.completions.create({
  model: "whisper-1",
    store: true,
  messages: [
      {"role": "user", "content": formData},
    ],
  });


  console.log(completion)






}


module.exports = {OpenAimod , Audiotranslator ,OpenAiSuggested}