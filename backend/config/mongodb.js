import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on('connected',()=>{
        console.log("DB Connected");
    })
    mongoose.set('strictQuery', true);

    // Use the MONGODB_URI directly without appending database name
    await mongoose.connect(process.env.MONGODB_URI)

}

export default connectDB;