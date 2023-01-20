/**
 * Global session store settings
 *
 * @type {SessionStoreSettings}
 */
export const sessionStoreSettings = {
  accessTokenMaxAgeInSeconds: 5 * 60, // 5 minutes
  refreshTokenMaxAgeInSeconds: 24 * 60 * 60, // 24 hours
  signingKey: "secure key loaded from secure place",
};

/**
 * Accept header based authorization tokens. This is default behavior, so we only need to
 * set the session store settings.
 *
 * @type {SessionTransportSettings}
 */
export const sessionTransportSettings = {
  sessionStoreSettings,
};
