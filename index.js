const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const client = new MongoClient(
   'mongodb+srv://simple_crud_server:VTvM0OzMSCif0r9J@cluster0.mvh6hdg.mongodb.net/?appName=Cluster0',
); // MongoClient instance তৈরি করছি

const run = async () => {
   try {
      await client.connect(); // Cluster এ connect করার চেষ্টা
      const db = client.db('simpleCrud');
      const userCollection = db.collection('users');

      //all-users
      app.get('/users', async (req, res) => {
         const cursor = userCollection.find();
         const users = await cursor.toArray();
         res.send(users);
      });

      //single-user
      app.get('/users/:id', async (req, res) => {
         const id = req.params.id;
         const query = {
            _id: new ObjectId(id),
         };
         const user = await userCollection.findOne(query);
         res.send(user);
      });

      //single-user-delete
      app.delete('/users/:id', async (req, res) => {
         const id = req.params.id;
         const query = {
            _id: new ObjectId(id),
         };
         const result = await userCollection.deleteOne(query);
         console.log('data after delete:', result);
         res.send(result);
      });

      //add-user
      app.post('/users', async (req, res) => {
         const newUser = req.body;
         const result = await userCollection.insertOne(newUser);
         console.log('data after insert:', result);
         res.send(result);
      });

      console.log('You successfully connected to MongoDB!'); // সফল হলে console এ message দেখাবে
   } catch (err) {
      console.dir(err); // Error হলে পুরো object tree-style এ দেখাবে
   }
};

run(); // Function call করছি যাতে connection establish হয়

app.get('/', (req, res) => {
   res.send('welcome to our simple crud server');
});

app.listen(port, () => {
   console.log(`server is running on port ${port}`);
});
