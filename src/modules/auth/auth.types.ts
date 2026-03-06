/**
 * Represents the full User database record.
 */
export interface UserEntity {
    id: number;
    name: string;
    email: string;
    password?: string | null;
    age?: number | null;
    role: "user" | "admin";
}

/**
 * Represents a User profile for public/authenticated responses.
 * Excludes sensitive fields like password.
 */
export interface AuthUser extends Omit<UserEntity, "password"> { }

/**
 * Represents a Refresh Token database record.
 */
export interface RefreshTokenEntity {
    id: number;
    userId: number;
    tokenHash: string;
    expiresAt: Date;
    isRevoked: boolean;
    revokedAt?: Date | null;
    replacedByTokenHash?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}
