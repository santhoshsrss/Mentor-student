import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { ObjectId } from "mongodb";
import { MongoClient } from "mongodb";

const app = express();
const PORT = process.env.PORT

const MONGO_URL = process.env.MONGO_URL;
const client = new MongoClient(MONGO_URL);
await client.connect();
console.log("MongoDB Started Running Successfully");


app.use(express.json())

app.get("/", function (request, response) {
  response.send("<center><h2>Mentor and Student Assigning with Database</h2></center>");
  
});

//1 . create mentor
app.post("/mentor", express.json(), async function (request, response) {
    const data = request.body;
    const mentor = await client.db("b42wd2").collection("mentor").insertOne(data);
    response.send(mentor);
  });
  
  //2 . create student
  
  app.post("/student", express.json(), async function (request, response) {
    const data = request.body;
    const student = await client
      .db("b42wd2")
      .collection("student")
      .insertOne(data);
    response.send(student);
  });
  
  //3 . create assign student
  app.post("/assigned", express.json(), async function (request, response) {
    const data = request.body;
  
    if (
      await client.db("b42wd2").collection("student").find({ available: "yes" })
    ) {
      const assigned = await client
        .db("b42wd2")
        .collection("assigned")
        .insertOne(data);
      response.send(assigned);
    } else {
      response.send({ message: "student not available" });
    }
  });
  
  //5.get students for particular mentor
  app.get("/students", async function (request, response) {
    const students = await client
      .db("b42wd2")
      .collection("assigned")
      .find({}, { students: 1 })
      .toArray();
    response.send(students);
  });
  
  app.put("/alter", async function (request, response) {
    const alter = await client
      .db("b42wd2")
      .collection("assigned")
      .updateOne(
        { _id: ObjectId },
        {
          $pull: { students: { name: "Ram" } },
          $push: { students2: { name: "Raj" } },
        }
      );
    response.send(alter);
  });


app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
