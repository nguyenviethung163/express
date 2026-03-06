import { db } from "../../db/db";
import { usersTable } from "../../drizzle/schemas/user.schema";
import { refreshTokens } from "../../drizzle/schemas/refresh-token.schema";
import { eq, and } from "drizzle-orm";
import { RegisterInput } from "./auth.validation";
import { hashPassword } from "./auth.helpers";
import { UserEntity, AuthUser, RefreshTokenEntity } from "./auth.types";

/**
 * Service for handling authentication-related database operations.
 * Manages users and refresh tokens.
 */
export class AuthService {
  /**
   * Finds a user by their email address.
   * @param email - The email to search for.
   * @returns The user object if found, otherwise undefined.
   */
  static async findUserByEmail(email: string): Promise<UserEntity | undefined> {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);
    return user as UserEntity | undefined;
  }

  /**
   * Finds a user by their unique ID.
   * @param id - The user ID.
   * @returns The user object if found, otherwise undefined.
   */
  static async findUserById(id: number): Promise<UserEntity | undefined> {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);
    return user as UserEntity | undefined;
  }

  /**
   * Registers a new user in the system.
   * Hashes the password before storing.
   * @param data - The registration input data.
   * @returns The created user object without the password field.
   */
  static async registerUser(data: RegisterInput): Promise<AuthUser> {
    const hashedPassword = await hashPassword(data.password);
    const [user] = await db
      .insert(usersTable)
      .values({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        age: data.age,
        role: "user"
      })
      .returning();

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as AuthUser;
  }

  /**
   * Stores a new refresh token in the database.
   * @param data - Token details including userId, hash, and expiry.
   * @returns The created refresh token record.
   */
  static async createRefreshToken(data: {
    userId: number;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<RefreshTokenEntity> {
    const [refreshToken] = await db
      .insert(refreshTokens)
      .values({
        userId: data.userId,
        tokenHash: data.tokenHash,
        expiresAt: data.expiresAt,
        isRevoked: false
      })
      .returning();
    return refreshToken as RefreshTokenEntity;
  }

  /**
   * Finds an active (non-revoked) refresh token by its hash.
   * @param tokenHash - The token hash to search for.
   * @returns The token record if found and active.
   */
  static async findRefreshToken(
    tokenHash: string
  ): Promise<RefreshTokenEntity | undefined> {
    const [token] = await db
      .select()
      .from(refreshTokens)
      .where(
        and(
          eq(refreshTokens.tokenHash, tokenHash),
          eq(refreshTokens.isRevoked, false)
        )
      )
      .limit(1);
    return token as RefreshTokenEntity | undefined;
  }

  /**
   * Revokes a specific refresh token.
   * @param tokenHash - The hash of the token to revoke.
   */
  static async revokeRefreshToken(tokenHash: string): Promise<void> {
    await db
      .update(refreshTokens)
      .set({ isRevoked: true, revokedAt: new Date() })
      .where(eq(refreshTokens.tokenHash, tokenHash));
  }

  /**
   * Revokes all refresh tokens belonging to a specific user.
   * Useful for global logout or security reset.
   * @param userId - The user ID.
   */
  static async revokeAllUserTokens(userId: number): Promise<void> {
    await db
      .update(refreshTokens)
      .set({ isRevoked: true, revokedAt: new Date() })
      .where(eq(refreshTokens.userId, userId));
  }
}
