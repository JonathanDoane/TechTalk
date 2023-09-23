const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

require('./config/mongoose.config');
require('dotenv').config();


app.use(cookieParser());
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json(), express.urlencoded({ extended: true }));
// const payload = {
//     id: user._id,
// }

// const userToken = jwt.sign(payload, process.env.SECRET_KEY);


const AllMyUserRoutes = require('./routes/users.routes');
const AllMyPostRoutes = require('./routes/post.routes');
const AllMyCommentRoutes = require('./routes/comment.routes')

AllMyPostRoutes(app);
AllMyUserRoutes(app);
AllMyCommentRoutes(app);

app.listen(8000, () => console.log("The server is all fired up on port 8000"));
