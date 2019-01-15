import express from "express";
import expressGraphQL from "express-graphql";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";

import schema from "./graphql/";

const app = express();
const PORT = process.env.PORT || "5000";
const db = "mongodb://admin:shop#123@ds115350.mlab.com:15350/shopdb";

const allowedMethods = ['GET','POST'];

function onrequest(req, res) {
  if (!allowedMethods.includes(req.method)) {
    	return res.end(405, 'Method Not Allowed');
	}
}

// Testing GraphQL

mongoose
  .connect(
    db,
    {
      useCreateIndex: true,
      useNewUrlParser: true
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

console.log("Checkpoint 1")
app.use(
  "/graphql",
  cors(),
  bodyParser.json(),
  expressGraphQL({
    schema,
    graphiql: false
  })
);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
