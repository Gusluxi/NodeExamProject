import { json, Router } from "express";
const router = Router();
import db from "../database/createConnection.js";


//################# GET answers ####################
router.get("/api/answers/questions/:id", async (req, res) => {
    if (req.session.loggedIn) {
        const userid = req.session.userID;
        const questionid = Number(req.params.id);
        const surveyUser = await db.get(
            `SELECT * FROM surveys
            INNER JOIN questions ON questions.surveyid = surveys.id
            INNER JOIN answers ON answers.questionid = questions.id WHERE questionid = ? `, questionid);
        if (surveyUser.userid === userid) {
            const answers = await db.all(`SELECT * FROM answers WHERE questionid = ?;`, questionid);
            return res.send({ data: answers });
        }
        return res.send({error: "wrong user"});
    }
    res.send({error: "not logged in"});
});


//################# POST answer ####################
router.post("/api/answers", async (req, res) => {
    const { answer, questionid } = req.body;
    const { changes } = await db.run(`INSERT INTO answers (answer, questionid) VALUES (?, ?);`, [answer, questionid]);
    return res.send({ rowsAffected: changes });
});


//################# PATCH answer not needed ####################



//################# DELETE answer not needed ####################
/*
router.delete("/api/answers/:id", async (req, res) => {
        const answerid = Number(req.params.id);
        const { changes } = await db.run(`DELETE FROM answers WHERE id = ?`, answerid);
        if (changes !== 0) {
            return res.send({ rowsDeleted: changes })
        }
        return res.send({error: `No answer by id: ${answerid}`})
});
*/


export default router;