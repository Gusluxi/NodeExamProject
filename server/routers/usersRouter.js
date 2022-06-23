import { Router } from "express";
const router = Router();
import db from "../database/createConnection.js";
import { hashPassword, compareToDatabase } from "../password.js";



//################# Validation email ####################
router.post("/valid/email", async (req, res) => {
    const email = req.body;
    const dbEmail = await db.get(`SELECT email FROM users WHERE email = ?`, [email.email])
    if(dbEmail) {
        req.session.emailExists = true;
    } else {
        req.session.emailExists = false;
    }
    res.send({ emailExists: req.session.emailExists })
});


//################# Validation Username ####################
router.post("/valid/username", async (req, res) => {
    const username = req.body;
    const dbUsername = await db.get(`SELECT username FROM users WHERE username = ?`, [username.username]);
    if (dbUsername) {
        req.session.usernameExists = true;
    } else {
        req.session.usernameExists = false;
    }
    res.send({ usernameExists: req.session.usernameExists })
});


//################# Signup ####################
router.post("/auth/signup", async (req, res) => {
    const newUser = req.body;
    console.log(newUser);
    if (newUser.email && newUser.username && newUser.password) { //If they all exists.
        if(req.session.usernameExists) {
            return res.send({ error: "Username already exists"})

        } else if (req.session.emailExists) {
            return res.send({ error: "Email already exists"})

        } else if (String(newUser.email).length > 320 || String(newUser.email).length < 5) {
            return res.send({ error: "Email has incorrect length"})

        } else if (String(newUser.username).length > 18 || String(newUser.username).length < 2) {
            return res.send({ error: "Username has incorrect length"})

        } else if (String(newUser.password).length > 30 || String(newUser.password).length < 3) {
            return res.send({ error: "Password has incorrect length"})

        }
     
        const hashedPassword = await hashPassword(newUser.password)
        const { changes } = await db.run(`INSERT INTO users (username, email, password) VALUES (?, ?, ?);`, [newUser.username, newUser.email, hashedPassword]);
        //sendEmail(newUser.email, "Welcome to Kea Boutique", "Hi " + newUser.username + ", We hope you enjoy your stay!");
        return res.send({ rowsAffected: changes })
    }
    res.send({ error: "Missing user data"})
});


//################# Login ####################
router.post("/auth/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await db.get(`SELECT * FROM users WHERE username = ?`, [username])

    if (!user) {
        return res.send({ loggedIn: false, attemptsLeft: req.rateLimit.remaining })
    }
    
    if (await compareToDatabase(password, user.password)) {
        user.password = '';
        req.session.loggedIn = true;
        req.session.userID = user.id;
        return res.send({ loggedIn: true, currentUser: user, attemptsLeft: req.rateLimit.remaining })
    };

    res.send({ loggedIn: false, attemptsLeft: req.rateLimit.remaining })
});


//################# Logout ####################
router.get("/logout", (req, res) => {
    if (req.session.loggedIn) {
        req.session.loggedIn = false;
        req.session.userID = undefined;
        return res.send({ loggedIn: false})
    }
    res.send({ error: "You are currently not logged in", loggedIn: false})
})


//################# Session information ####################
router.get("/info/session", (req, res) => {
    console.log(req.session);
    res.send(req.session)
})


export default router;