import { adminDb } from './index';
import bcrypt from 'bcrypt';
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

export const authController = {
  signin: async (req, res, next) => {
    const { username, password } = req.body;

    try {
      if (await adminDb.exists(username)) {
        res.status(400).json({ message: 'Username taken' });
        return;
      }

      const hash = await bcrypt.hash(password, 10);
      const user = await adminDb.createAdmin({
        username,
        password: hash,
      });

      res.send(user._id);
    } catch (error) {
      next(error);
    }
  },
};

passport.use(
  'signup',
  new localStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username, password, done) => {
      try {
        if (await adminDb.exists(username)) {
          return done(null, false, { message: 'Username taken' });
        }

        const hash = await bcrypt.hash(password, 10);
        const admin = await adminDb.createAdmin({
          username,
          password: hash,
        });

        return done(null, admin);
      } catch (error) {
        done(error);
      }
    },
  ),
);
