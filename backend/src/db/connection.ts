import mongoose from "mongoose";

const connectToDataBase = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL)
    }catch(err){
      console.log(err)  
      throw new Error("couldn't connect to DB")
    }
   
}


const disconnectFromDataBase = async () => {
  try{

    await mongoose.disconnect();

  }catch(err){

    console.log(err)
    throw new Error("couldn't disconnect from DB")
  }
}

export {connectToDataBase, disconnectFromDataBase};