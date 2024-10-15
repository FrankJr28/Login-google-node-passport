require('dotenv').config()

const express = require('express');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/google/callback",
        },    
        (accessToken, refreshToken, profile, done) => {
            return done(null, profile);
        }
    )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.get("/", (req, res) => {
    res.send("<a href='/auth/google'>Login with google</a>")    
});

app.get("/auth/google", passport.authenticate("google", {scope: ["profile", "email"]}));

app.get("/auth/google/callback", 
    passport.authenticate('google', {failureRedirect: "/"}),
    (req, res)=>{
        console.log("At callbnack, redirecting to profile");
        res.redirect("/profile");        
    }
);

app.get("/profile", (req, res) => {
    console.log(req.user);
    console.log(req.user.displayName);
    res.send(`welcome ${req.user.displayName}`);
});

app.get("/myroute", (req, res)=>{
    console.log("user is on my route");
    res.send("my route");
});

/*app.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/");
});*/

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/'); // Redirect to homepage or login page after logout
    });
});

app.listen(3000, () => {
    console.log("server is running at port 3000");
});






