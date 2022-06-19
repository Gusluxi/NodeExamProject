import { json, Router } from "express";
const router = Router();
import db from "../database/createConnection.js";

router.get("/api/users", async (req, res) => {
    const users = await db.all("SELECT * FROM users;");
 
    res.send({ data: users });
});


export default router;