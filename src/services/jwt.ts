import JWT from "jsonwebtoken";
import { User } from "@prisma/client";
import { JWTUser } from "../interface";

const JWT_SECRET = "@secret$"

class JWTService {
    public static generateTokenForUser(user: User) {
        const payload: JWTUser = {
          id: user?.id,
          email: user?.email,
        };
        const token = JWT.sign(payload, JWT_SECRET);
        return token;
      }

    public static decodeToken(token: string) {
        try {
          return JWT.verify(token, JWT_SECRET) as JWTUser;
        } catch (error) {
          return null;
        }
      }
}

    export default JWTService;