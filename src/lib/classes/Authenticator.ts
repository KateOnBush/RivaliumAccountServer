import User from "../components/user/User";
import {V4 as paseto} from "paseto";
import Logger from "../tools/Logger";
import {PasetoPrivateKey, PasetoPublicKey} from "../../env.var";
import Database from "./Database";

interface TokenData extends Record<PropertyKey, unknown> {
    kind: 'access' | 'auto';
    id: string;
}

export default class Authenticator {

    static secretKey: string;
    static publicKey: string;

    static async regenerateAndLogKeys() {

        let keyPair = await paseto.generateKey("public", {format: 'paserk'});

        let secretEncoded = keyPair.secretKey.toString();
        let publicEncoded = keyPair.publicKey.toString();

        Logger.log("Secret: {}", secretEncoded);
        Logger.log("Public: {}", publicEncoded);

    }

    static async generateAccessToken(user: User) {

        let data: TokenData = {
            kind: 'access',
            id: user.getID()
        };

        return await paseto.sign(data, PasetoPrivateKey, {expiresIn: '1 day'});

    }

    static async generateAutologinToken(user: User) {

        let data: TokenData = {
            kind: 'auto',
            id: user.getID()
        }

        return await paseto.sign(data, PasetoPrivateKey, {expiresIn: '31 days'});

    }

    static async verifyAccessToken(token: string){

        let parsed;
        try {
            parsed = await paseto.verify<TokenData>(token, PasetoPublicKey, {complete: true});
        } catch (e) {
            return null;
        }

        if (parsed.payload.kind != 'access') return null;

        return await Database.fetchUser(parsed.payload.id as string);

    }

    static async verifyAutologinToken(token: string){

        let parsed;
        try {
            parsed = await paseto.verify<TokenData>(token, PasetoPublicKey, {complete: true});
        } catch (e) {
            return null;
        }

        if (parsed.payload.kind != 'auto') return null;

        return await Database.fetchUser(parsed.payload.id as string);

    }

}