const app = require("./src/app");

const mongoose = require("mongoose")

function connectDB(){
    mongoose.connect("mongodb+srv://prince45tri_db_user:JZivjBxAQzfTLoKN@cluster0.yf7fnkl.mongodb.net/day6")
    .then(()=>{
        console.log("connected to database successfully")
    })
}
connectDB()

app.listen(3000, () => {
    console.log("server is running on port 3000")
}); 