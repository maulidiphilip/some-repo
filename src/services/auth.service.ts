import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { ApiError } from "../middleware/error.middleware";
import { RegisterInput, LoginInput } from "../schemas/auth.schema";

const SALT_ROUNDS = 10;

function signToken(userId: string, role: string) {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
}

export async function register(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });

  if (existing) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      password: hashedPassword,
      role: input.role,
    },
  });

  const token = signToken(user.id, user.role);

  return { token, user: { id: user.id, email: user.email, role: user.role } };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(input.password, user.password);

  if (!passwordMatches) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signToken(user.id, user.role);

  return { token, user: { id: user.id, email: user.email, role: user.role } };
}