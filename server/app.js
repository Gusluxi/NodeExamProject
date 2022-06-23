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
//overvej hvor mange comments er nødvendige her i forhold til product ready code
import rateLimit from "express-rate-limit";

const baseLimiter = rateLimit({
    //the line below limits the window auth times, after 15 minutes the limit will be reset
	windowMs: 15 * 60 * 1000, // 15 minutes
    //The client is allowed to access 5 times
	max: 100, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const signupLimiter = rateLimit({
    //the line below limits the window auth times, after 15 minutes the limit will be reset
	windowMs: 5 * 60 * 1000, // 5 minutes
    //The client is allowed to access 5 times
	max: 10, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const loginLimiter = rateLimit({
    //the line below limits the window auth times, after 15 minutes the limit will be reset
	windowMs: 5 * 60 * 1000, // 5 minutes
    //The client is allowed to access 5 times
	max: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const validationLimiter = rateLimit({
    //the line below limits the window auth times, after 15 minutes the limit will be reset
	windowMs: 5 * 60 * 1000, // 5 minutes
    //The client is allowed to access 5 times
	max: 30, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
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


import http from "http";
const server = http.createServer(app);
/*  tester noget socket, skal måske bruges who knows
import { Server } from 'socket.io';

const io = new Server(server);

const io = new Server(server, {
	cors: {
		origin: "http://localhost:8080"
	}
});

io.on("connection", (socket) => {
  console.log(socket.id)
});
*/



import { Server } from "socket.io";
const io = new Server(server);

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
io.use(wrap(sessionMiddleware));

io.on("connection", (socket) => {
	console.log(socket.id);
	socket.on("colorChanged", ({ data }) => {
		io.emit("changeTheColor", { data});
	})
  });


//################# Routers ####################
import usersRouter from "./routers/usersRouter.js";
import surveysRouter from "./routers/surveysRouter.js";
import answersRouter from "./routers/answersRouter.js";
import questionsRouter from "./routers/questionsRouter.js";
app.use(usersRouter, surveysRouter, answersRouter, questionsRouter);
//Redirects to "/" if refreshed. Developer useful. Delete for ready code.
app.get('*', (req, res) => {
	res.sendFile(path.resolve("../client/public/index.html"));
});



//################# Server ####################
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Starting server on port:", PORT);
});