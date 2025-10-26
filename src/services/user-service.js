
import connectDB from "../common/db";
import User from "../database/models/User";

export async function getAllUsers() {
	await connectDB();
	// Only select necessary fields for admin UI, including image and profile image
	const users = await User.find({}, {
		_id: 1,
		name: 1,
		email: 1,
		role: 1,
		createdAt: 1,
		isVerified: 1,
		image: 1,
		profile: 1,
	}).lean();
	// Map _id to id for frontend compatibility
	return users.map(u => ({
		id: u._id.toString(),
		name: u.name,
		email: u.email,
		role: u.role,
		createdAt: u.createdAt,
		isVerified: u.isVerified || false,
		image: u.image || "",
		profile: {
			profileImageUrl: u.profile?.profileImageUrl || ""
		}
	}));
}
