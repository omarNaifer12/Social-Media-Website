const express =require( "express");
const cors = require('cors');
const conn=require("./db/db")
const path=require("path");
const postRoute=require("./routes/postRoute");
conn();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.use('/api/posts',postRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});