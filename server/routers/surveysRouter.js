import { Router } from "express";
const router = Router();
import db from "../database/createConnection.js";


//################# GET surveys ####################
router.get("/api/surveys", async (req, res) => {
    if (req.session.loggedIn) {
        const userid = req.session.userID;
        const surveys = await db.all(`SELECT * FROM surveys WHERE userid = ?;`, userid);
        return res.send({ data: surveys });
    } 
    res.send({error: "Not logged in"});
});


//################# POST survey ####################
router.post("/api/surveys", async (req, res) => {
    if (req.session.loggedIn) {
        const userid = req.session.userID;
        const { title } = req.body;
        if (title) {
            const { changes } = await db.run(`INSERT INTO surveys (title, userid) VALUES (?, ?);`, [title, userid]);
            return res.send({ rowsAffected: changes })
        }
        return res.send({error: "No Title Provided"});
    }
    res.send({error: "Not logged in"});
});



//################# PATCH survey ####################
router.patch("/api/surveys/:id", async (req, res) => {
    if (req.session.loggedIn) {
        const userid = req.session.userID;
        const surveyid = Number(req.params.id);
        const { title } = req.body;
        const foundSurvey = await db.get(`SELECT * FROM surveys where id = ? and userid = ?;`, surveyid, userid);
            if (foundSurvey) {
                const { changes } = await db.run(`UPDATE surveys SET title = ? WHERE id = ?;`, [title, surveyid]);
            return res.send({ rowsAffected: changes });
            };
        
        return res.send({error: `No survey with id ${surveyid} on your account`})
    }
    res.send({error: "not logged in"})
});



//################# DELETE survey ####################
router.delete("/api/surveys/:id", async (req, res) => {
    if (req.session.loggedIn) {
        const surveyid = Number(req.params.id);
        const userid = req.session.userID;
        const { changes } = await db.run(`DELETE FROM surveys WHERE id = ? and userid = ?`, [surveyid, userid]);
        if (changes !== 0) {
            return res.send({ rowsDeleted: changes })
        }
        return res.send({error: `No survey by id: ${surveyid}`})
    }
});


export default router;