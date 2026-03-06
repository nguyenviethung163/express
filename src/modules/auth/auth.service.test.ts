import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthService } from "./auth.service";
import { db } from "../../db/db";
import { usersTable } from "../../drizzle/schemas/user.schema";

// Mock the DB
const mockRes = vi.fn();
vi.mock("../../db/db", () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockImplementation(() => ({
      then: (onFullfilled: any) => Promise.resolve(mockRes()).then(onFullfilled)
    })),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockImplementation(() => ({
      then: (onFullfilled: any) => Promise.resolve(mockRes()).then(onFullfilled)
    }))
  }
}));

describe("AuthService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("findUserByEmail", () => {
    it("should return a user if found", async () => {
      const mockUser = { id: 1, email: "test@example.com", name: "Test User" };
      mockRes.mockResolvedValue([mockUser]);

      const user = await AuthService.findUserByEmail("test@example.com");

      expect(user).toEqual(mockUser);
      expect(db.select).toHaveBeenCalled();
    });

    it("should return undefined if user not found", async () => {
      mockRes.mockResolvedValue([]);

      const user = await AuthService.findUserByEmail("unknown@example.com");

      expect(user).toBeUndefined();
    });
  });

  describe("registerUser", () => {
    it("should create and return a new user", async () => {
      const registerData = {
        name: "New User",
        email: "new@example.com",
        password: "hashedpassword",
        age: 25
      };
      const mockUser = {
        id: 2,
        name: "New User",
        email: "new@example.com",
        age: 25,
        role: "user"
      };

      mockRes.mockResolvedValue([mockUser]);

      const user = await AuthService.registerUser(registerData);

      expect(user).toEqual(mockUser);
      expect(db.insert).toHaveBeenCalledWith(usersTable);
    });
  });
});
