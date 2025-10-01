'use client';
import { useState, useEffect } from 'react';
import { useSession, update } from 'next-auth/react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { dietMap, mealsMap } from '@/common/EUserSpec';

export default function PrimaryDiet() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    diet: 'none',
    meals: [],
    allergies: [],
  });

  useEffect(() => {
    if (session?.user?.profile) {
      setFormData({
        diet: session.user.profile.diet || 'none',
        allergies: session.user.profile.allergies || [],
        meals: session.user.profile.meals || [],
      });
    }
  }, [session]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        meals: checked
          ? [...prev.meals, name]
          : prev.meals.filter((meal) => meal !== name),
      }));
    } else if (name === 'allergies') {
      const allergies = value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
      setFormData((prev) => ({ ...prev, allergies }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/user/update-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success('Profile updated!');
        await update({
          profile: {
            ...session.user.profile,
            ...formData,
          }
        });
      } else {
        toast.error('Failed to update profile.');
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong!');
      console.error('Error updating profile:', error);
    }
  };

  if (!session) return <div>Please sign in</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-6 bg-gradient-to-br from-cyan-50 to-cyan-100 flex flex-col items-center"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-xl space-y-6"
      >
        <h1 className="text-3xl font-bold text-center text-cyan-700">  Cập nhật Chế độ Ăn uống</h1>

        {/* Diet Selection */}
        <div>
          <label className="block mb-2 text-gray-700 font-medium">Chế độ ăn</label>
          <select
            name="diet"
            value={formData.diet}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400"
          >
            {Object.entries(dietMap).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Meal Settings */}
        <div>
          <label className="block mb-2 text-gray-700 font-medium">
            Bữa ăn hàng ngày <span className="text-sm text-gray-500">(chọn ít nhất một bữa)</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(mealsMap).map(([key, label]) => (
              <label key={key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={key}
                  checked={formData.meals.includes(key)}
                  onChange={handleChange}
                  className="accent-cyan-500"
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Allergies */}
        <div>
          <label className="block mb-2 text-gray-700 font-medium">Thực phẩm dị ứng / không dùng được</label>
          <input
            type="text"
            name="allergies"
            value={formData.allergies.join(', ')}
            onChange={handleChange}
            placeholder="Ví dụ: hạt, sữa"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={formData.meals.length === 0}
          className={`w-full py-3 rounded-lg text-white text-lg font-semibold transition ${formData.meals.length === 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-cyan-600 hover:bg-cyan-700'
            }`}
        >
          Lưu thay đổi
        </button>
      </form>
    </motion.div>
  );
}
