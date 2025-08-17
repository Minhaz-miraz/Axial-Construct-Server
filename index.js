const express = require('express');
const cors = require('cors');
// const admin = require("firebase-admin");

const dotenv = require('dotenv');
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// middleware
app.use(cors());
app.use(express.json());
// const serviceAccount = require("./firebase-admin-key.json");

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.olg8f57.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        const db = client.db('Axial-Construct');
        const usersCollection = db.collection('user');
        const messageCollection = db.collection('message')
        const worksCollection = db.collection('works');
        const paymentCollection = db.collection('payroll')

        //   const verifyFBToken = async (req, res, next) => {
        //     const authHeader = req.headers.authorization;
        //     if (!authHeader) {
        //         return res.status(401).send({ message: 'unauthorized access' })
        //     }
        //     const token = authHeader.split(' ')[1];
        //     if (!token) {
        //         return res.status(401).send({ message: 'unauthorized access' })
        //     }

        //     // verify the token
        //     try {
        //         const decoded = await admin.auth().verifyIdToken(token);
        //         req.decoded = decoded;
        //         next();
        //     }
        //     catch (error) {
        //         return res.status(403).send({ message: 'forbidden access' })
        //     }
        // }

        // const verifyAdmin = async (req, res, next) => {
        //     const email = req.decoded.email;
        //     const query = { email }
        //     const user = await usersCollection.findOne(query);
        //     if (!user || user.role !== 'admin') {
        //         return res.status(403).send({ message: 'forbidden access' })
        //     }
        //     next();
        // }
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");

        app.post('/user', async (req, res) => {
            const userInfo = req.body;
            const result = await usersCollection.insertOne(userInfo)
            res.send(result)
        })
  app.get('/users/:email/role', async (req, res) => {
            try {
                const email = req.params.email;
                

                if (!email) {
                    return res.status(400).send({ message: 'Email is required' });
                }

                const user = await usersCollection.findOne({ email });
console.log(user)
                if (!user) {
                    return res.status(404).send({ message: 'User not found' });
                }

                res.send({ role: user.role || 'user' });
            } catch (error) {
                console.error('Error getting user role:', error);
                res.status(500).send({ message: 'Failed to get role' });
            }
        });

        app.post('/publicMessage', async (req, res) => {
            const publicMessage = req.body;
            
            
            const result = await messageCollection.insertOne(publicMessage)
            res.send(result)
        })
        app.get('/publicMessage', async (req, res) => {
            
            
            const result = await messageCollection.find().toArray()
            res.send(result)
        })
        app.get('/users/employeeList', async (req, res) => {
          try {
        const employees = await usersCollection
            .find({ role: 'employee' })
            .toArray();
        res.send(employees);
    } catch (error) {
        console.error('Error fetching employee list:', error);
        res.status(500).send({ message: 'Failed to fetch employee list' });
    }
        })

// update employee to hr
 app.patch('/users/:id/makeHR',async(req,res)=>{
    const {id} = req.params;
     const query = { _id: new ObjectId(id) };
     const {role} = req.body;
     const updateDoc = { $set: { role } }
            console.log(updateDoc)
            
            try {
                const result = await usersCollection.updateOne(
                    query, updateDoc

                );
                res.send(result);
            } catch (err) {
                res.status(500).send({ message: "Failed to update rider status" });
            }
            
        

   
 })
 app.patch('/users/:id/salary',async(req,res)=>{
    const {id} = req.params;
     const query = { _id: new ObjectId(id) };
     const {salary} = req.body;
     const updateDoc = { $set: { salary } }
            console.log(updateDoc)
            
            try {
                const result = await usersCollection.updateOne(
                    query, updateDoc

                );
                res.send(result);
            } catch (err) {
                res.status(500).send({ message: "Failed to update rider status" });
            }
            
        

   
 })
 app.patch('/users/:id/fire',async(req,res)=>{
    const {id} = req.params;
     const query = { _id: new ObjectId(id) };
     const {fired} = req.body;
     const updateDoc = { $set: { fired } }
            console.log(updateDoc)
            
            try {
                const result = await usersCollection.updateOne(
                    query, updateDoc

                );
                console.log(result)
                res.send(result);
            } catch (err) {
                res.status(500).send({ message: "Failed to update rider status" });
            }
            
        

   
 })


       app.get('/users/all-Employee', async (req, res) => {
  try {
    const query = { role: { $in: ['HR', 'employee'] } };
    const employees = await usersCollection.find(query).toArray();
   
    res.send(employees);
  } catch (error) {
    console.error('Failed to fetch employee list:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});
        

        // get user role
        app.get('/users/:email/role', async (req, res) => {
            try {
                const email = req.params.email.trim();
                

                if (!email) {
                    return res.status(400).send({ message: 'Email is required' });
                }

                const user = await usersCollection.findOne({ email: email });
                console.log(user)
                if (!user) {
                    return res.status(404).send({ message: 'User not found' });
                }

                res.send(user); // ✅ Send entire user document
            } catch (error) {
                console.error('Error getting user role:', error);
                res.status(500).send({ message: 'Failed to get role' });
            }
        });

        app.post('/worksheet', async (req, res) => {
            worksInfo = req.body;
            const result = await worksCollection.insertOne(worksInfo);
            res.status(201).send(result)
        })
        app.post('/payroll', async (req, res) => {
            paymentInfo = req.body;
            const result = await paymentCollection.insertOne(paymentInfo);
            res.status(201).send(result)
        })
        

// 1. Fetch all payroll requests
app.get('/payroll', async (req, res) => {
  try {
    const list = await paymentCollection.find().toArray();
    res.send(list);
  } catch (err) {
    console.error('Error fetching payroll list:', err);
    res.status(500).send({ message: 'Failed to fetch payroll data' });
  }
});
app.get('/payroll/employee/:employeeId', async (req, res) => {
  try {
    const payrolls = await paymentCollection
      .find({ employeeId: req.params.employeeId, status: 'paid' })
      .toArray();
    res.send(payrolls);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to fetch payroll data.' });
  }
});
app.get('/payroll/employee', async (req, res) => {
  try {
    const userEmail = req.query.email;
    console.log('Fetching payments for email:', userEmail);
    
    // Check what field name you're using in your payroll documents
    // It might be 'employeeEmail', 'userEmail', or 'email'
    const query = { 
      email: userEmail, // Change this to match your field name
      status: 'paid'
    };
    
    const paymentHistory = await paymentCollection
      .find(query)
      .toArray();
      
    console.log('Payment history found:', paymentHistory);
    res.send(paymentHistory);
  } catch (err) {
    console.error('Error fetching payment history:', err);
    res.status(500).send({ message: 'Failed to fetch payroll data.' });
  }
});

// 2. Mark a payroll as paid
app.patch('/payroll/:id/pay', async (req, res) => {
  try {
    const { id } = req.params;
    const paymentDate = new Date();
    const result = await paymentCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: 'paid', paymentDate } }
    );
    res.send(result);
  } catch (err) {
    console.error('Error updating payroll:', err);
    res.status(500).send({ message: 'Failed to update payroll' });
  }
});


        app.delete('/worksheet/:id', async (req, res) => {
            try {
                const id = req.params.id;

                const result = await worksCollection.deleteOne({ _id: new ObjectId(id) });

                res.send(result);
            } catch (error) {
                console.error('Error deleting parcel:', error);
                res.status(500).send({ message: 'Failed to delete parcel' });
            }
        });
        app.get('/worksheet', async (req, res) => {
            const userEmail = req.query.email;
            const query = userEmail ? { email: userEmail } : {};
            const options = {
                sort: { createdAt: -1 }, // Newest first
            };
            const result = await worksCollection.find(query, options).toArray();
            res.send(result)
        })
        // app.get('/user/:email/isfired', async (req, res) => {
        //     const userEmail = req.params.email;
        //     console.log(userEmail)
        //     const query = userEmail ? { email: userEmail } : {};
           
        //     const result = await usersCollection.findOne(query).toArray();
        //     console.log(result)
        //     res.send(result)
        // })
        app.get('/worksheet/all', async (req, res) => {
            
            
            const result = await worksCollection.find().toArray();
            res.send(result)
        })
        app.patch("/worksheet/:id", async (req, res) => {
            const { id } = req.params; console.log(id)
            const { task, hours, date } = req.body; console.log(task)
            const query = { _id: new ObjectId(id) }
            const updateDoc = { $set: { task, hours, date } }

            try {
                const result = await worksCollection.updateOne(
                    query, updateDoc

                );
                res.send(result);
            } catch (err) {
                res.status(500).send({ message: "Failed to update rider status" });
            }
        });
        app.patch('/users/:id/verify',async(req,res)=>{
            const id = req.params;
            const query = { _id: new ObjectId(id) }
            const {verified} = req.body;
            const updateDoc = { $set: { verified } }
            
            
            try {
                const result = await usersCollection.updateOne(
                    query, updateDoc

                );
                res.send(result);
            } catch (err) {
                res.status(500).send({ message: "Failed to update rider status" });
            }
            
        })
        app.patch('/users/:id/verify',async(req,res)=>{
            const id = req.params;
            const query = { _id: new ObjectId(id) }
            const {verified} = req.body;
            const updateDoc = { $set: { verified } }
            
            
            try {
                const result = await usersCollection.updateOne(
                    query, updateDoc

                );
                res.send(result);
            } catch (err) {
                res.status(500).send({ message: "Failed to update rider status" });
            }
            
        })



    } finally {
        // Ensures that the client will close when you finish/error

    }
}
run().catch(console.dir);


// Sample route
app.get('/', (req, res) => {
    res.send('Parcel Server is running');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});