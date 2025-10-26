import { requireAdmin } from '../../../../lib/auth';
import { getAllUsers } from '../../../../services/user-service';

export async function GET(req) {
  const admin = await requireAdmin(req);
  if (admin?.error) {
    return new Response(JSON.stringify({ error: admin.error }), { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const search = searchParams.get('search') || '';
    const pageSize = 10;

    // Fetch all users
    let users = await getAllUsers();

    // Filter by search term (name or email)
    if (search) {
      users = users.filter(u =>
        (u.name && u.name.toLowerCase().includes(search.toLowerCase())) ||
        (u.email && u.email.toLowerCase().includes(search.toLowerCase()))
      );
    }

    const totalUsers = users.length;
    const totalPages = Math.max(1, Math.ceil(totalUsers / pageSize));
    const pagedUsers = users.slice((page - 1) * pageSize, page * pageSize);

    return new Response(JSON.stringify({ users: pagedUsers, totalPages }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch users' }), { status: 500 });
  }
}
