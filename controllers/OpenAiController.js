const formidable = require('formidable')
const {OpenAimod, Audiotranslator} = require('../services/OpenAi')



const translatetext = async(req,res) => {

    const {texttotranslate , language} = req.body

    res.status(200).send(await OpenAimod(texttotranslate , language).then((result) => result.content))

}


const translateauido = async(req,res) => {

    const form = new formidable.IncomingForm();


    form.parse(req , async(err , fields , files) => {  


        try{

            const response = await Audiotranslator(fields)


        }catch(err){
            console.log(err)
        }


        
    })



    
}

module.exports = {translatetext , translateauido}