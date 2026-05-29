import { User } from 'generated/prisma/client';

export type SafeUserData = Omit<User, 'password'>;
