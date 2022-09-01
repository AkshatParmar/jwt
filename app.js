require('dotenv').config()
require('./config/database').connect()
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const morgan = require('morgan');

// App init
const app = express();
app.use(express.json());
app.use(process.env.NODE_ENV == "dev" ? morgan('dev') : morgan('combined') )

// Model imports
const User = require('./model/user');
const auth = require('./middleware/auth');

// hello world
app.post("/welcome", auth, (req,res) => {
    res.status(200).send("What up");
})

// Register
app.post('/register', async(req, res) => {
    try {
        // Grab input
        const { first_name, last_name, email, password } = req.body;

        // Validate
        if(!(first_name && last_name && email && password)) {
            res.status(400).send({"ERROR": "Enter all fields."})
        }
        // Check if user already exists
        const oldUser = await User.findOne({ email: email.toLowerCase() })

        if (oldUser) {
            return res.status(409).send("User already exists. Please login.")
        }
        // Encrypt password
        encryptedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encryptedPassword,
        });

        // Create token
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "24h",
            }
        );

        // Save token to user
        user.token = token;

        // Return new user 
        res.status(201).json(user);
    } catch (error) {
        console.log(error);
    }
})

// Login
app.post('/login', async(req, res) => {
    try {
        // Grab input
        const { email, password } = req.body;

        // Validate
        if(!(email && password)) {
            res.status(400).send({"ERROR": "Enter all fields."})
        }

        // Validate if user exists
        const user = await User.findOne({ email: email.toLowerCase() });

        if (user && (await bcrypt.compare(password, user.password))) {
            // create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "24h",
                }
            );

            // Save token
            user.token = token;

            // return
            res.status(200).json(user);
        } else {
            res.status(400).send("Invalid credentials. try again")
        }
    } catch (error) {
        console.log(error)
    }
})


module.exports = app;