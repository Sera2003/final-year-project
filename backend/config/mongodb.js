import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on('connected',()=>{
        console.log("DB Connected");
    })
    mongoose.set('strictQuery', true);

    const mongoUri = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error("MongoDB connection string is missing. Set MONGODB_URI or MONGODB_ATLAS_URI.");
    }

    await mongoose.connect(mongoUri)

}

export default connectDB;
