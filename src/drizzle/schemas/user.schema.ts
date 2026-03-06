import { integer, pgEnum, pgTable, varchar } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }),
  role: userRoleEnum("role").default("user").notNull()
});

// Alias for backward-compatibility with other schemas importing `users`
export const users = usersTable;
