import {app} from './app.js';
import dotenv from 'dotenv';
import conDb from './database/index.js';

dotenv.config({
    path : "./.env"
})

const PORT = process.env.PORT || 8000;


conDb()
.then(() =>{
    app.listen(PORT , () => {
    console.log(`Server Running on ${PORT}`);
})
})
.catch((e) => {
    console.log("MongoDB connection Error !!", e);
})