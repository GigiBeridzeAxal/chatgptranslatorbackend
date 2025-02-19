const {OpenAimod} = require('../services/OpenAi')



const translatetext = async(req,res) => {

    const {texttotranslate , language} = req.body

    res.status(200).send(await OpenAimod(texttotranslate , language).then((result) => result.content))

}

module.exports = {translatetext}