import path from "path";

//################# Express ####################
import express from "express";
const app = express();
app.use(express.json());
app.use(express.static(path.resolve("../client/public")));
app.use(express.urlencoded({extended: true}));

//################# Helmet ####################
import helmet from "helmet";
app.use(helmet());

//################# Rate Limiter ####################
import rateLimit from "express-rate-limit";

//Limiter for all requests
const baseLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 300, // Limit each IP to 300 requests per `window`
	standardHeaders: true, 
	legacyHeaders: false, 
});
//Limits for signup attempts
const signupLimiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 10, // Limit each IP to 10 requests per `window`
	standardHeaders: true,
	legacyHeaders: false,
});

//limits for login attempts
const loginLimiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 5, // Limit each IP to 5 requests per `window`
	standardHeaders: true, 
	legacyHeaders: false, 
});

//Limits for validating data
const validationLimiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 30, // Limit each IP to 30 requests per `window`
	standardHeaders: true,
	legacyHeaders: false,
});

app.use(baseLimiter);
app.use("/auth/signup", signupLimiter);
app.use("/auth/login", loginLimiter);
app.use("/valid", validationLimiter);

//################# Sessions ####################
import session from "express-session";
const sessionMiddleware = session({
	secret: 'GusLobf',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
});
app.use(sessionMiddleware);

//################# Cors ####################
import cors from "cors";
app.use(cors());

//################# Sockets ####################
import http from "http";
const server = http.createServer(app);

import {init} from './socketIO.js';
const io = init(server)
io.on("connection", (socket) => {
   	console.log("starting socket connection with id", socket.id)
});

//################# Routers ####################
import usersRouter from "./routers/usersRouter.js";
import surveysRouter from "./routers/surveysRouter.js";
import answersRouter from "./routers/answersRouter.js";
import questionsRouter from "./routers/questionsRouter.js";
app.use(usersRouter, surveysRouter, answersRouter, questionsRouter);
//Redirects to "/" if refreshed.
app.get('*', (req, res) => {
	res.sendFile(path.resolve("../client/public/index.html"));
});

//################# Server ####################
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("Starting server on port:", PORT);
});