"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { PageIntro } from "@/components/PageIntro";
import { FlameIcon, BarChartIcon, TargetIcon } from "lucide-react";
import RecipeAIDetails from "./RecipeAIDetails";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function MealPlannerPage() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const hasShownAuthToast = useRef(false);

  useEffect(() => {
    if (!isAuthenticated && !hasShownAuthToast.current) {
      hasShownAuthToast.current = true;
      toast.error("Vui lòng đăng nhập để sử dụng tính năng này!", {
        id: "auth-error",
      });
      router.push("/dang-nhap");
    }
  }, [isAuthenticated, router]);

  const generateRecipe = async () => {
    setLoading(true);
    setError("");
    setRecipe(null);

    try {
      const response = await fetch("/api/mealplan/aiRecipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
      });

      if (!response.ok) throw new Error("Failed to fetch meal plan");

      const data = await response.json();
      setRecipe(data);
      toast.success("Công thức đã được tạo thành công!", {
        id: "recipe-success",
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
      toast.error(err.message || "Đã xảy ra lỗi khi tạo công thức", {
        id: "recipe-error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster />
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-8">
        <PageIntro eyebrow="Tính năng nổi bật" title="AI gợi ý bữa ăn cho bạn">
          <p>
            Hãy để Nutrimate đồng hành cùng bạn trong hành trình chăm sóc sức khỏe
            – với thực đơn cá nhân hóa phù hợp với chế độ ăn uống, sở thích và
            mục tiêu của riêng bạn.
          </p>
        </PageIntro>

        <textarea
          onChange={(e) => setIngredients(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg mt-4"
          placeholder="Bạn có gì trong bếp? Nhập nguyên liệu hoặc khẩu vị ăn uống của bạn nhé!..."
        ></textarea>

        <p className="text-sm text-gray-500 mt-2 italic">
          Giới hạn: 50 yêu cầu/ giờ với hình thức miễn phí.
        </p>
        <button
          onClick={generateRecipe}
          disabled={loading}
          className="font-medium items-center mt-12 bg-gradient-to-r from-[#04993b] via-[#04993b] to-[#000000] hover:from-[#000000] hover:to-[#04993b] text-white py-2 px-4 rounded-lg shadow-xl transition disabled:opacity-50 flex cursor-pointer"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {loading ? "Generating..." : "Tạo công thức"}
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}
        {recipe && <RecipeAIDetails recipe={recipe} />}
      </div>
    </div>
  );
}
