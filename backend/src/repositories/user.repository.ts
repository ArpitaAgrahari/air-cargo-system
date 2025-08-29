import { PrismaClient, User, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { email } });
};

export const createUser = async (data: Prisma.UserCreateInput): Promise<User> => {
    return prisma.user.create({ data });
};

export const findUsers = async (page: number, limit: number): Promise<{ users: User[], total: number }> => {
  const skip = (page - 1) * limit;
  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count(),
  ]);
  return { users, total };
};

export const findUserById = async (id: string): Promise<User | null> => {
    return prisma.user.findUnique({ where: { id } });
};

export const updateUser = async (id: string, data: Prisma.UserUpdateInput): Promise<User> => {
    return prisma.user.update({ where: { id }, data });
};