"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function signup(email: string, password: string) {
  if (!email || !password) {
    return { error: "電子郵件與密碼為必填項。" };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "此電子郵件已在 MuchCloud 註冊。" };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return { success: true };
  } catch (err: any) {
    console.error("Signup error:", err);
    return { error: "註冊過程中發生錯誤，請稍後再試。" };
  }
}
