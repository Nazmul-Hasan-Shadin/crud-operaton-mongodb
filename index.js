const express= require('express');
const bodyParser= require('body-parser')
const app = express();

const ObjectId= require('mongodb').ObjectId
const password= 'organicUser';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); 

 
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://organicUser:organicUser@cluster1.wjj4omp.mongodb.net/organicdatabase?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html');
})






async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect()
    const collection= client.db("organicdatabase").collection('product');

   app.get('/products',async (req,res)=>{
    const products= await collection.find({}).toArray();
     res.send(products)

   })

    app.post("/addProduct",(req,res)=>{
    
        const product = req.body;
        collection.insertOne(product)
        .then(result=>{
            console.log("data added succesfully");
            res.send('success')
        })

        
  app.delete('/delete/:id',async (req,res)=>{
     await collection.deleteOne({_id:new ObjectId(req.params.id) })
      .then((result)=>{
        console.log(result);
      })
  })


  app.get('/product/:id',async(req,res)=>{

   const singleUpdateProduct= await collection.find({_id: new ObjectId(req.params.id)}).toArray();
   res.send(singleUpdateProduct[0])
  })



  app.patch('/update/:id',(req,res)=>{

  collection.updateOne({_id:new ObjectId(req.params.id)}, 
     {
      $set: {price: req.body.price, quantity: req.body.quantity}
     }
  )
  .then(res=>{
    console.log(res);
  })


  })

 
       


    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   
  }
}
run().catch(console.dir);


app.listen(5173)
