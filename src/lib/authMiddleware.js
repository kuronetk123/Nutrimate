// utils/withAuth.ts
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function withAuth(
    req,
    handler
) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new Response('Unauthorized', { status: 401 });
    }

    return handler(session);
}
