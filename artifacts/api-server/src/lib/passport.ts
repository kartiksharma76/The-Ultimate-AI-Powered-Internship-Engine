import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { db, studentsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const [user] = await db.select().from(studentsTable).where(eq(studentsTable.id, id));
    done(null, user || null);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:8080/login/oauth2/code/google",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists with this googleId
        let [user] = await db
          .select()
          .from(studentsTable)
          .where(eq(studentsTable.googleId, profile.id));

        if (!user) {
          // If not, check if user exists with this email
          const email = profile.emails?.[0].value;
          if (email) {
            [user] = await db
              .select()
              .from(studentsTable)
              .where(eq(studentsTable.email, email));
          }

          if (user) {
            // Update existing user with googleId
            await db
              .update(studentsTable)
              .set({
                googleId: profile.id,
                avatarUrl: profile.photos?.[0].value,
              })
              .where(eq(studentsTable.id, user.id));
            
            [user] = await db
              .select()
              .from(studentsTable)
              .where(eq(studentsTable.id, user.id));
          } else {
            // Create new user
            const [result] = await db.insert(studentsTable).values({
              name: profile.displayName,
              email: email || "",
              googleId: profile.id,
              avatarUrl: profile.photos?.[0].value,
              location: "Remote", // Default
              skills: [],
              domains: [],
            });

            [user] = await db
              .select()
              .from(studentsTable)
              .where(eq(studentsTable.id, result.insertId));
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);

export default passport;
