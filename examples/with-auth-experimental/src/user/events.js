import {
  AppError,
  eventStart,
  eventStop,
  isProduction,
  newEventFromEvent,
  uuid,
} from "@compas/stdlib";
import {
  sessionStoreCreate,
  sessionStoreRefreshTokens,
  sessionTransportLoadFromContext,
} from "@compas/store";
import { compare, hash } from "bcrypt";
import {
  sessionStoreSettings,
  sessionTransportSettings,
} from "../constants.js";
import { queries } from "../generated/application/common/database.js";
import { queryUser } from "../generated/application/database/user.js";
import { sql } from "../services/core.js";

/**
 * See https://www.npmjs.com/package/bcrypt 'A note on rounds' for more information about
 * the amount of rounds to use.
 *
 * @returns {number}
 */
function getBcryptSaltRounds() {
  // We use a low value for rounds in development to speed up testing.
  return isProduction() ? 13 : 2;
}

/**
 * Resolve the session based on the incoming request.
 *
 * @param {InsightEvent} event
 * @param {Context} ctx
 * @returns {Promise<QueryResultDatabaseUser>}
 */
export async function userResolveSession(event, ctx) {
  eventStart(event, "user.resolveSession");

  const { error, value } = await sessionTransportLoadFromContext(
    newEventFromEvent(event),
    sql,
    ctx,
    sessionTransportSettings,
  );

  if (error) {
    // Something is wrong with the error, by throwing it we relay it to the client.
    throw error;
  }

  // Now we can safely use value.session.data;
  const [user] = await queryUser({
    where: {
      id: value.session.data.userId,
    },

    // Here you can join extra tables that you may need
    // for your user, for example, to add role checks.
  }).exec(sql);

  if (!user) {
    // The user can't be found, so it may be deleted by an admin in the meantime.
    throw new AppError(`${event.name}.invalidSession`, 401, {});
  }

  eventStop(event);

  return user;
}

/**
 * Register a user, don't allow multiple users with the same email address.
 * Since the email is the unique identification for that user.
 *
 * Note that this route allows 'user enumeration' attacks, so you need to add an internal
 * / external rate-limiter.
 *
 * TODO: Add internal / external rate limiter, see above.
 *
 * @param {InsightEvent} event
 * @param {Postgres} sql
 * @param {UserRegisterBody} body
 * @returns {Promise<void>}
 */
export async function userRegister(event, sql, body) {
  eventStart(event, "user.register");

  const [existingUser] = await queryUser({
    where: {
      email: body.email,
    },
  }).exec(sql);

  if (existingUser) {
    throw AppError.validationError(`${event.name}.emailAlreadyInUse`);
  }

  const hashedPassword = await hash(body.password, getBcryptSaltRounds());

  await queries.userInsert(sql, {
    email: body.email,
    password: hashedPassword,
  });

  eventStop(event);
}

/**
 * Facilitate a user login and create a session.
 *
 * Note that this route allows 'user enumeration' attacks, so you need to add an internal
 * / external rate-limiter.
 *
 * TODO: Add internal / external rate limiter, see above.
 *
 * @param {InsightEvent} event
 * @param {Postgres} sql
 * @param {UserLoginBody} body
 * @returns {Promise<UserTokenPair>}
 */
export async function userLogin(event, sql, body) {
  eventStart(event, "user.login");

  const [user] = await queryUser({
    where: {
      email: body.email,
    },
  }).exec(sql);

  if (!user) {
    // Compare to a random password, so all calls to login take approximately the same
    // time. This way an attacker can't guess if the email exists or if the password is
    // incorrect.
    await compare(
      uuid(),
      `$2b$${getBcryptSaltRounds()}$R/hhUgEclsHjleite3asjuwR/mKU0kq72ZfE0crgkVMnkISPJAxCC`,
    );

    throw AppError.validationError(`${event.name}.invalidCombination`);
  }

  const passwordCompare = await compare(body.password, user.password);

  if (!passwordCompare) {
    throw AppError.validationError(`${event.name}.invalidCombination`);
  }

  const { error, value } = await sessionStoreCreate(
    newEventFromEvent(event),
    sql,
    sessionStoreSettings,
    {
      // This userId is used again in
      // `userResolveSession`
      userId: user.id,
    },
  );

  if (error) {
    throw error;
  }

  eventStop(event);

  return value;
}

/**
 * Return a new token pair based on the provided refresh token.
 *
 * @param {InsightEvent} event
 * @param {UserRefreshTokensBody} body
 * @returns {Promise<UserTokenPair>}
 */
export async function userRefreshTokens(event, body) {
  eventStart(event, "user.refreshTokens");

  const { error, value } = await sessionStoreRefreshTokens(
    newEventFromEvent(event),
    sql,
    sessionStoreSettings,
    body.refreshToken,
  );

  if (error) {
    throw error;
  }

  eventStop(event);

  return value;
}
