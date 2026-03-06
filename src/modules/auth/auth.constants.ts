export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite:
    process.env.NODE_ENV === "production"
      ? ("none" as const)
      : ("lax" as const),
  path: "/"
};

export const TOKEN_EXPIRY = {
  ACCESS: 15 * 60 * 1000, // 15 mins
  REFRESH: 7 * 24 * 60 * 60 * 1000 // 7 days
};
