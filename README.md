# refresh-token-auth-mern

# 🚀 Javascript full-stack 🚀

### React / Next / MongoDB / eCharts / Storybook / GitHub API

https://github.com/coding-to-music/refresh-token-auth-mern

https://refresh-token-auth-mern.herokuapp.com

https://refresh-token-auth-mern.onrender.com

by SoftMaple https://github.com/softmaple

https://insights.softmaple.xyz/dashboard

https://github.com/softmaple/dashboard

```java
const secret = process.env.JWT_SECRET;
mongoose_1.default.connect(`${process.env.MONGODB_URI
```

## GitHub

```java
git init
git add .
git remote remove origin
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:coding-to-music/refresh-token-auth-mern.git
git push -u origin main
```

## Heroku

```java
heroku create refresh-token-auth-mern
```

## Heroku MongoDB Environment Variables

```java
heroku config:set


heroku config:set JWT_SECRET="secret"

heroku config:set PUBLIC_URL="https://refresh-token-auth-mern.herokuapp.com"
```

## Push to Heroku

```java
git push heroku

# or

npm run deploy
```

# JWT Authentication with Access Tokens & Refresh Tokens In Node JS

By CyberWolve
1.2K subscribers

What's up guys welcome to my channel. We all know most important feature in every application is authentication. To make that authentication much more secured and make better user experience we need to use refresh and access token based authentication in your app. You might be thinking what is refresh token?, why should we use?, how should we use ?

First let's take a look at older way of authenticating user which is called token based authentication. When user logged in we send a access token which is valid for certain time. When that token expires we have to ask user again to login, Which is tedious user experience. To solve that problem we have to use refresh token.

A refresh token is nothing but a access token but it has life time about 1 or 2 months. Access token has expire time about 10 to 15 minutes. Whenever this access token expire. we don't ask user to login again to get new access token instead we send refresh token to the server here we verify that token and send new access token to the client. with this method user don't have to login again and again. this makes user experience much more easier to user.

To know how to implement refresh token in node js watch this video.
I hope you learn something new today. If you like my work subscribe to my channel and like this video.

Dev.to article = https://dev.to/cyberwolve/jwt-authentication-with-access-tokens-refresh-tokens-in-node-js-5aa9

Source Code = https://github.com/cyber-wolve/refreshToken_auth_and_roleBased_autherization

What's up guys. We all know most important feature in every application is authentication. To make that authentication much more secured and make better user experience we need to use refresh and access token based authentication in your app. You might be thinking what is refresh token?, why should we use?, how should we use ?. Well don't worry I'm gonna cover everything from scratch.

So let's start coding...

I highly recommend you to watch demo video for better understanding. If you like my work Subscribe to my channel to support.

Demo Video

Project Github Link

Following table shows the overview of Rest APIs that exported

Methods Urls Actions
POST /signUp Signup User
POST /logIn Login User
POST /refreshToken Get new access token
DELETE /refreshToken Logout User

## What is refresh token?

A refresh token is nothing but a access token but it has life time about 1 or 2 months. access token has expire time about 10 to 15 minutes. when ever this access token expire. we don't ask user to login again to get new access token instead we send refresh token to the server here we verify that token and send new access token to the client. with this method user don't have to login again and again. this makes user experience much more easier to user.

```java
create Node.js App
$ mkdir refresh-token-auth-mern
$ cd refresh-token-auth-mern
$ npm init --yes
$ npm install express mongoose jsonwebtoken dotenv bcrypt joi joi-password-complexity
$ npm install --save-dev nodemon
```

Project Structure

## Project Structure

```java
package.json
{
  "name": "refresh-token-auth-mern",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "nodemon server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "bcrypt": "^5.0.1",
    "dotenv": "^16.0.0",
    "express": "^4.17.3",
    "joi": "^17.6.0",
    "joi-password-complexity": "^5.1.0",
    "jsonwebtoken": "^8.5.1",
    "mongoose": "^6.2.8"
  },
  "devDependencies": {
    "nodemon": "^2.0.15"
  }
}
```

## User Model

/models/User.js

```java
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    roles: {
        type: [String],
        enum: ["user", "admin", "super_admin"],
        default: ["user"],
    },
});

const User = mongoose.model("User", userSchema);

export default User;
```

## User Token Model

/models/UserToken.js

```java
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userTokenSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 30 * 86400 }, // 30 days
});

const UserToken = mongoose.model("UserToken", userTokenSchema);

export default UserToken;
```

## Generate Tokens Function

/utils/generateTokens.js

```java
import jwt from "jsonwebtoken";
import UserToken from "../models/UserToken.js";

const generateTokens = async (user) => {
    try {
        const payload = { _id: user._id, roles: user.roles };
        const accessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_PRIVATE_KEY,
            { expiresIn: "14m" }
        );
        const refreshToken = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_PRIVATE_KEY,
            { expiresIn: "30d" }
        );

        const userToken = await UserToken.findOne({ userId: user._id });
        if (userToken) await userToken.remove();

        await new UserToken({ userId: user._id, token: refreshToken }).save();
        return Promise.resolve({ accessToken, refreshToken });
    } catch (err) {
        return Promise.reject(err);
    }
};

export default generateTokens;
```

## Verify Refresh Token Function

/utils/verifyRefreshToken.js

```java
import UserToken from "../models/UserToken.js";
import jwt from "jsonwebtoken";

const verifyRefreshToken = (refreshToken) => {
    const privateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY;

    return new Promise((resolve, reject) => {
        UserToken.findOne({ token: refreshToken }, (err, doc) => {
            if (!doc)
                return reject({ error: true, message: "Invalid refresh token" });

            jwt.verify(refreshToken, privateKey, (err, tokenDetails) => {
                if (err)
                    return reject({ error: true, message: "Invalid refresh token" });
                resolve({
                    tokenDetails,
                    error: false,
                    message: "Valid refresh token",
                });
            });
        });
    });
};

export default verifyRefreshToken;
```

## Validation Schema Function

/utils/validationSchema.js

```java
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

const signUpBodyValidation = (body) => {
    const schema = Joi.object({
        userName: Joi.string().required().label("User Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
    });
    return schema.validate(body);
};

const logInBodyValidation = (body) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    });
    return schema.validate(body);
};

const refreshTokenBodyValidation = (body) => {
    const schema = Joi.object({
        refreshToken: Joi.string().required().label("Refresh Token"),
    });
    return schema.validate(body);
};

export {
    signUpBodyValidation,
    logInBodyValidation,
    refreshTokenBodyValidation,
};
```

## Auth Routes

/routes/auth.js

```java
import { Router } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import generateTokens from "../utils/generateTokens.js";
import {
    signUpBodyValidation,
    logInBodyValidation,
} from "../utils/validationSchema.js";

const router = Router();

// signup
router.post("/signUp", async (req, res) => {
    try {
        const { error } = signUpBodyValidation(req.body);
        if (error)
            return res
                .status(400)
                .json({ error: true, message: error.details[0].message });

        const user = await User.findOne({ email: req.body.email });
        if (user)
            return res
                .status(400)
                .json({ error: true, message: "User with given email already exist" });

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        await new User({ ...req.body, password: hashPassword }).save();

        res
            .status(201)
            .json({ error: false, message: "Account created sucessfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// login
router.post("/logIn", async (req, res) => {
    try {
        const { error } = logInBodyValidation(req.body);
        if (error)
            return res
                .status(400)
                .json({ error: true, message: error.details[0].message });

        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res
                .status(401)
                .json({ error: true, message: "Invalid email or password" });

        const verifiedPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!verifiedPassword)
            return res
                .status(401)
                .json({ error: true, message: "Invalid email or password" });

        const { accessToken, refreshToken } = await generateTokens(user);

        res.status(200).json({
            error: false,
            accessToken,
            refreshToken,
            message: "Logged in sucessfully",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

export default router;
```

## Refresh Token Routes

/routes/refreshToken.js

```java
import { Router } from "express";
import UserToken from "../models/UserToken.js";
import jwt from "jsonwebtoken";
import { refreshTokenBodyValidation } from "../utils/validationSchema.js";
import verifyRefreshToken from "../utils/verifyRefreshToken.js";

const router = Router();

// get new access token
router.post("/", async (req, res) => {
    const { error } = refreshTokenBodyValidation(req.body);
    if (error)
        return res
            .status(400)
            .json({ error: true, message: error.details[0].message });

    verifyRefreshToken(req.body.refreshToken)
        .then(({ tokenDetails }) => {
            const payload = { _id: tokenDetails._id, roles: tokenDetails.roles };
            const accessToken = jwt.sign(
                payload,
                process.env.ACCESS_TOKEN_PRIVATE_KEY,
                { expiresIn: "14m" }
            );
            res.status(200).json({
                error: false,
                accessToken,
                message: "Access token created successfully",
            });
        })
        .catch((err) => res.status(400).json(err));
});

// logout
router.delete("/", async (req, res) => {
    try {
        const { error } = refreshTokenBodyValidation(req.body);
        if (error)
            return res
                .status(400)
                .json({ error: true, message: error.details[0].message });

        const userToken = await UserToken.findOne({ token: req.body.refreshToken });
        if (!userToken)
            return res
                .status(200)
                .json({ error: false, message: "Logged Out Sucessfully" });

        await userToken.remove();
        res.status(200).json({ error: false, message: "Logged Out Sucessfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

export default router;
```

## .env file

/.env

```java
MONGODB_URI = Your database URL
SALT = 10
ACCESS_TOKEN_PRIVATE_KEY = Add your private key
REFRESH_TOKEN_PRIVATE_KEY = Add your private key
```

## Database Connect

/dbConnect.js

```java
import mongoose from "mongoose";

const dbConnect = () => {
    const connectionParams = { useNewUrlParser: true };
    mongoose.connect(process.env.DB, connectionParams);

    mongoose.connection.on("connected", () => {
        console.log("Connected to database sucessfully");
    });

    mongoose.connection.on("error", (err) => {
        console.log("Error while connecting to database :" + err);
    });

    mongoose.connection.on("disconnected", () => {
        console.log("Mongodb connection disconnected");
    });
};

export default dbConnect;
```

## Sever.js

/server.js

```java
import express from "express";
import { config } from "dotenv";
import dbConnect from "./dbConnect.js";
import authRoutes from "./routes/auth.js";
import refreshTokenRoutes from "./routes/refreshToken.js";

const app = express();

config();
dbConnect();

app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/refreshToken", refreshTokenRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
```

That's it guys we have successfully implemented refresh and access token based authentication in Node JS.

For bonus within this project I have implemented routes which only authenticated users can access and role based authorization. You can find it in Demo Video

Thank You :)
