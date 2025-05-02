import { Types } from 'mongoose';
import passport from 'passport';
// import OpenIDConnectStrategy from 'passport-openidconnect';
import { Strategy as OpenIDConnectStrategy, Profile, VerifyCallback } from 'passport-openidconnect';
import { ExtractJwt, Strategy as JwtStrategy, VerifiedCallback } from 'passport-jwt';
import config from './configuration';
import { Tenant } from '../core/models/tenants/model';

const jwtStrategy = new JwtStrategy(
	{
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey: config.jwtSecret!,
	},
	async (jwt_payload, done) => {
		try {
			done(null, jwt_payload);
		} catch (err) {
			return done(err, false);
		}
	}
);
const getTenantAuthStrategy = async (tenant: Tenant) => {
	const authDetails = tenant.authDetails;
	if (!authDetails) return { strategy: jwtStrategy, supportsOpenID: false };
	const strategy = new OpenIDConnectStrategy(
		{
			issuer: authDetails.issuer,
			authorizationURL: authDetails.authorizationURL,
			tokenURL: authDetails.tokenURL,
			userInfoURL: authDetails.userInfoURL,
			clientID: authDetails.clientID,
			clientSecret: authDetails.clientSecret,
			callbackURL: `http://localhost:3000/auth/callback/${tenant._id}`,
		},
		(issuer: string, profile: Profile, done: VerifyCallback) => {
			// Find or create user logic

			console.log('here');
			return done(null, profile);
		}
	);

	passport.use('_oidc', strategy);
	return { strategy, supportsOpenID: true };
};

passport.use(jwtStrategy);

passport.serializeUser((user, done) => done(null, user));
// @ts-ignore
passport.deserializeUser((user, done) => done(null, user));

export { passport, getTenantAuthStrategy };
