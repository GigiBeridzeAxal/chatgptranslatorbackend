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


module.exports = {OpenAimod , OpenAiSuggested}