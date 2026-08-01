import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

import { authConfig } from '../src/config/auth.js';

const prisma = new PrismaClient();
const mobile = '01799999998';

let user = await prisma.user.findUnique({ where: { mobile } });
if (!user) {
  user = await prisma.user.create({
    data: { mobile, password: 'not-used-for-smoke-test', name: 'Phase 4 Smoke Test' },
  });
}

const token = jwt.sign({ userId: user.id, role: user.role }, authConfig.jwtSecret, {
  expiresIn: authConfig.jwtExpiresIn as string & jwt.SignOptions['expiresIn'],
});

console.log(token);
await prisma.$disconnect();
