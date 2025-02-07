const mongoose = require('mongoose')

const ConnectDB = async() => {


    try{
      const con = await mongoose.connect(process.env.DB)
      if(con){
        console.log("Server Succesfuly Connected To Database")
      }else{
        console.log("Server Cant Connect Database Please Try Again")
      }

    }catch(err){
        console.log(err)
    }


}

module.exports = ConnectDB