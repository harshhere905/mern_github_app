import passport from "passport";
import dotenv from "dotenv";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/user.model.js"
dotenv.config();

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "https://mern-github-app-8pzc.onrender.com/api/auth/github/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            const user = await User.findOne({username: profile.username});
			if (!user) {
				const newUser = new User({
					name: profile.displayName,
					username: profile.username,
					profileUrl: profile.profileUrl,
					avatarUrl: profile.photos[0].value,
					likedProfiles: [],
					likedBy: [],
				});
				await newUser.save();
				done(null, newUser);
			} else {
				done(null, user);
			}
        }
    )
);
