const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectID;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const password = 'WcMheqw2ZPYyMYKu';

const uri =
  'mongodb+srv://myDbUser:WcMheqw2ZPYyMYKu@cluster0.shsop.mongodb.net/myDbUser?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

client.connect((err) => {
  const productCollection = client.db('myDbUser').collection('products');
  console.log('database connected successfully');

  app.get('/products', (req, res) => {
    productCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post('/addProduct', (req, res) => {
    const product = req.body;
    productCollection.insertOne(product).then((result) => {
      console.log('data added successfully');
      // res.send('success');
      res.redirect('/');
    });
  });

  app.patch(`/update/:id`, (req, res) => {
    console.log(req.body.price);
    productCollection
      .updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: { price: req.body.price, quantity: req.body.quantity },
        }
      )
      .then((result) => {
        // console.log(result);
        res.send(result.modifiedCount > 0);
      });
  });

  app.delete(`/delete/:id`, (req, res) => {
    productCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        // console.log(result);
        res.send(result.deletedCount > 0);
      });
  });

  app.get(`/product/:id`, (req, res) => {
    productCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });
});

app.listen(3000);
