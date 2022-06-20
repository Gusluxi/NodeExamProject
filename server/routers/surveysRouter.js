import { json, Router } from "express";
const router = Router();
import db from "../database/createConnection.js";


//################# GET surveys ####################
router.get("/api/surveys/users", async (req, res) => {
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
        const { changes } = await db.run(`INSERT INTO surveys (title, userid) VALUES (?, ?);`, [title, userid]);
        return res.send({ rowsAffected: changes });
    }
    res.send({error: "Not logged in"});
});



//################# PATCH survey ####################



//################# DELETE survey ####################
router.delete("/api/surveys/:id", async (req, res) => {
    if (req.session.loggedIn) {
        const surveyid = Number(req.params.id);
        const userid = req.session.userID;
        const { changes } = await db.run(`DELETE FROM surveys WHERE id = ? and userid = ?`, [surveyid, userid]);
        if (changes !== 0) {
            return res.send({ rowsDeleted: changes })
        }
        return res.send({error: `No product by id: ${surveyid}`})
    }
});


export default router;