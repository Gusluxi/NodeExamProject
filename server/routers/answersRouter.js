import { json, Router } from "express";
const router = Router();
import db from "../database/createConnection.js";


//################# GET answers ####################
router.get("/api/answers", async (req, res) => {
    const answers = await db.all("SELECT * FROM answers;");
 
    res.send({ data: answers });
});


//################# POST answer ####################
router.post("/api/answers", async (req, res) => {
    const { answer, questionid } = req.body;
    const { changes } = await db.run(`INSERT INTO answers (answer, questionid) VALUES (?, ?);`, [answer, questionid]);
    return res.send({ rowsAffected: changes });
});


//################# PATCH answer ####################



//################# DELETE answer ####################
router.delete("/api/answers/:id", async (req, res) => {
        const answerid = Number(req.params.id);
        const { changes } = await db.run(`DELETE FROM answers WHERE id = ?`, answerid);
        if (changes !== 0) {
            return res.send({ rowsDeleted: changes })
        }
        return res.send({error: `No product by id: ${answerid}`})
});


export default router;