const express = require('express')
const MongoClient = require('mongodb').MongoClient

const app = express()
const port = 3000

const mongoUrl = 'mongodb://localhost:3000' // Update with your MongoDB connection URL
const dbName = 'user_registration' // Replace with your database name

app.use(express.json())

// 1.Create a Node.js server that connects to a MongoDB database.

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Connect to MongoDB
MongoClient.connect(
  mongoUrl,
  {useNewUrlParser: true, useUnifiedTopology: true},
  (err, client) => {
    if (err) {
      console.error('Error connecting to MongoDB:', err)
      return
    }

    console.log('Connected to MongoDB')
    const db = client.db('your_database_name') // Replace with your database name

    // Add your routes and other server logic here

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  },
)

// 2.Implement a user registration system that validates the user's IP address.

app.post('/register', (req, res) => {
  const user = req.body.user
  const ipAddress = req.ip

  if (!user) {
    return res.status(400).send('User details are required.')
  }

  // Check if the IP address is valid (you can add more complex validation logic here)
  if (!isValidIPAddress(ipAddress)) {
    return res.status(400).send('Invalid IP address.')
  }

  // Store the user and IP address in the database
  MongoClient.connect(
    mongoUrl,
    {useNewUrlParser: true, useUnifiedTopology: true},
    (err, client) => {
      if (err) {
        console.error('Error connecting to MongoDB:', err)
        return res.status(500).send('Error connecting to the database.')
      }

      const db = client.db(dbName)
      const usersCollection = db.collection('users')

      usersCollection.insertOne({user, ipAddress}, (insertErr, result) => {
        if (insertErr) {
          console.error('Error inserting user into the database:', insertErr)
          client.close()
          return res.status(500).send('Error inserting user into the database.')
        }

        console.log('User registered successfully:', result.ops[0])
        client.close()
        res.status(200).send('User registered successfully.')
      })
    },
  )
})

function isValidIPAddress(ipAddress) {
  // You can implement your own IP address validation logic here
  return true
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

// 3. Send an OTP to the user's phone number.

app.post('/register', (req, res) => {
  const user = req.body.user
  const phoneNumber = req.body.phoneNumber // Assume phone number is passed in the request

  if (!user || !phoneNumber) {
    return res.status(400).send('User details and phone number are required.')
  }

  // Check if the phone number is valid (you can add more complex validation logic here)
  if (!isValidPhoneNumber(phoneNumber)) {
    return res.status(400).send('Invalid phone number.')
  }

  // Generate and send OTP
  const otp = generateOTP() // You need to implement this function
  sendOTP(phoneNumber, otp) // You need to implement this function

  // Store the user, phone number, and OTP in the database
  MongoClient.connect(
    mongoUrl,
    {useNewUrlParser: true, useUnifiedTopology: true},
    (err, client) => {
      if (err) {
        console.error('Error connecting to MongoDB:', err)
        return res.status(500).send('Error connecting to the database.')
      }

      const db = client.db(dbName)
      const usersCollection = db.collection('users')

      usersCollection.insertOne(
        {user, phoneNumber, otp},
        (insertErr, result) => {
          if (insertErr) {
            console.error('Error inserting user into the database:', insertErr)
            client.close()
            return res
              .status(500)
              .send('Error inserting user into the database.')
          }

          console.log('User registered successfully:', result.ops[0])
          client.close()
          res
            .status(200)
            .send('User registered successfully. OTP sent to the phone number.')
        },
      )
    },
  )
})

function isValidPhoneNumber(phoneNumber) {
  // You can implement your own phone number validation logic here
  return true
}

function generateOTP() {
  // Generate a random 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000)
}

function sendOTP(phoneNumber, otp) {
  // In a real-world scenario, this function would send the OTP via SMS using a third-party service
  console.log(`Sending OTP ${otp} to ${phoneNumber}`)
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

// 4. Validate the OTP entered by the user against the OTP sent to their phone number.

app.post('/register', (req, res) => {
  const user = req.body.user
  const phoneNumber = req.body.phoneNumber // Assume phone number is passed in the request
  const enteredOTP = req.body.otp // User-entered OTP

  if (!user || !phoneNumber || !enteredOTP) {
    return res
      .status(400)
      .send('User details, phone number, and OTP are required.')
  }

  // Check if the phone number is valid (you can add more complex validation logic here)
  if (!isValidPhoneNumber(phoneNumber)) {
    return res.status(400).send('Invalid phone number.')
  }

  // Verify the entered OTP
  MongoClient.connect(
    mongoUrl,
    {useNewUrlParser: true, useUnifiedTopology: true},
    (err, client) => {
      if (err) {
        console.error('Error connecting to MongoDB:', err)
        return res.status(500).send('Error connecting to the database.')
      }

      const db = client.db(dbName)
      const usersCollection = db.collection('users')

      usersCollection.findOne(
        {phoneNumber, otp: enteredOTP},
        (findErr, result) => {
          if (findErr) {
            console.error('Error finding user in the database:', findErr)
            client.close()
            return res.status(500).send('Error finding user in the database.')
          }

          if (result) {
            // OTP is valid, registration successful
            console.log('User registered successfully:', result)
            client.close()
            res.status(200).send('User registered successfully.')
          } else {
            // Invalid OTP
            client.close()
            res.status(400).send('Invalid OTP.')
          }
        },
      )
    },
  )
})

function isValidPhoneNumber(phoneNumber) {
  // You can implement your own phone number validation logic here
  return true
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

// 5. Register the user in the database only if the OTP entered is valid.

app.post('/register', (req, res) => {
  const user = req.body.user
  const phoneNumber = req.body.phoneNumber // Assume phone number is passed in the request
  const enteredOTP = req.body.otp // User-entered OTP

  if (!user || !phoneNumber || !enteredOTP) {
    return res
      .status(400)
      .send('User details, phone number, and OTP are required.')
  }

  // Check if the phone number is valid (you can add more complex validation logic here)
  if (!isValidPhoneNumber(phoneNumber)) {
    return res.status(400).send('Invalid phone number.')
  }

  // Verify the entered OTP
  MongoClient.connect(
    mongoUrl,
    {useNewUrlParser: true, useUnifiedTopology: true},
    (err, client) => {
      if (err) {
        console.error('Error connecting to MongoDB:', err)
        return res.status(500).send('Error connecting to the database.')
      }

      const db = client.db(dbName)
      const usersCollection = db.collection('users')

      usersCollection.findOne(
        {phoneNumber, otp: enteredOTP},
        (findErr, result) => {
          if (findErr) {
            console.error('Error finding user in the database:', findErr)
            client.close()
            return res.status(500).send('Error finding user in the database.')
          }

          if (result) {
            // OTP is valid, register the user
            usersCollection.insertOne(
              {user, phoneNumber},
              (insertErr, insertResult) => {
                if (insertErr) {
                  console.error(
                    'Error inserting user into the database:',
                    insertErr,
                  )
                  client.close()
                  return res
                    .status(500)
                    .send('Error inserting user into the database.')
                }

                console.log(
                  'User registered successfully:',
                  insertResult.ops[0],
                )
                client.close()
                res.status(200).send('User registered successfully.')
              },
            )
          } else {
            // Invalid OTP
            client.close()
            res.status(400).send('Invalid OTP.')
          }
        },
      )
    },
  )
})

function isValidPhoneNumber(phoneNumber) {
  // You can implement your own phone number validation logic here
  return true
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
