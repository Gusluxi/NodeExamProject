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
app.use(session({
    secret: 'GusLobf',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

//################# Cors ####################
import cors from "cors";
app.use(cors());

//################# Routers ####################
import usersRouter from "./routers/usersRouter.js";
import surveysRouter from "./routers/surveysRouter.js";
import answersRouter from "./routers/answersRouter.js";
import questionsRouter from "./routers/questionsRouter.js";
app.use(usersRouter, surveysRouter, answersRouter, questionsRouter);


//################# Server ####################
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Starting server on port:", PORT);
});