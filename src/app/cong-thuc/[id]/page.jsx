"use client"
import { useState, useEffect, use } from "react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { useSession } from "next-auth/react"
import {
    ChefHat,
    Clock,
    Users,
    Flame,
    Utensils,
    ShoppingBag,
    Heart,
    Share2,
    Printer,
    ChevronLeft,
    AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import RecipeService from "@/services/RecipeService"
import LoadingComponent from "@/components/common/LoadingComponent"
import { Separator } from "@/components/ui/separator"
import toast from "react-hot-toast"
import { jsPDF } from 'jspdf';
import "@/fonts/ARIAL-normal"
import { getYouTubeEmbedUrl, getYouTubeId } from "@/utils/helper/youTubeEmbed"


export default function RecipeDetailPage({ params }) {
    const { id } = use(params)
    const [recipe, setRecipe] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const { data: session } = useSession()
    const [isFavorited, setIsFavorited] = useState(false)
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`/api/recipes/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setRecipe(data);
                }
            } catch (error) {
                console.error("Error fetching recipes:", error);
                toast.error("Failed to fetch recipes. Please try again later.");
            } finally {
                setIsLoading(false); // Set loading to false after fetching
            }

        }
        fetchRecipes();
    }, []);

    if (!recipe) {
        notFound()
    }

    // Badge for suggestion status
    const renderSuggestionBadge = () => {
        if (!recipe.isSuggestion) return null;
        let color = recipe.status === 'accepted' ? 'bg-green-200 text-green-800' : 'bg-orange-200 text-orange-800';
        let label = recipe.status === 'accepted' ? 'Recipe Suggestion (Accepted)' : 'Recipe Suggestion (Pending)';
        return (
            <span className={`inline-block px-3 py-1 rounded text-xs font-semibold mb-4 ${color}`}>
                {label}
            </span>
        );
    };

    const toggleFavorite = async () => {
        try {
            const res = await fetch('/api/user/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recipeId: recipe?._id || id })
            });
            if (!res.ok) {
                if (res.status === 401) {
                    toast.error('Vui lòng đăng nhập để lưu công thức');
                    return;
                }
                throw new Error('Failed to toggle favorite');
            }
            const favorites = await res.json();
            const isNowFav = favorites?.some?.((rid) => String(rid) === String(recipe?._id || id));
            setIsFavorited(!!isNowFav)
            toast.success(isNowFav ? 'Đã lưu công thức' : 'Đã bỏ lưu công thức');
        } catch (error) {
            console.error(error);
            toast.error('Không thể lưu công thức, thử lại sau');
        }
    };

    const addIngredientsToShoppingList = (ingredients) => {
        try {
            const key = 'shoppingList';
            const existing = JSON.parse(localStorage.getItem(key) || '[]');
            const newItems = ingredients.map((ing) => ({ name: ing.name, amount: ing.amount }));
            const merged = [...existing, ...newItems];
            localStorage.setItem(key, JSON.stringify(merged));
            toast.success('Đã thêm vào danh sách mua sắm');
        } catch (e) {
            console.error(e);
            toast.error('Không thể thêm vào danh sách mua sắm');
        }
    };

    useEffect(() => {
        const initFavorite = async () => {
            try {
                if (!session?.user?.id || !recipe?._id) return;
                const res = await fetch('/api/user/favorites/recipes');
                if (!res.ok) return;
                const favRecipes = await res.json();
                const exists = favRecipes?.some?.((r) => String(r._id) === String(recipe._id));
                setIsFavorited(!!exists);
            } catch (e) {
                // ignore
            }
        };
        initFavorite();
    }, [session, recipe?._id]);

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast('Recipe link copied to clipboard');

    };

    const toDataURL = async (url) => {
        const res = await fetch(url);
        const blob = await res.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    };

    const generatePDF = async () => {
        const doc = new jsPDF();
        doc.addFont("Arial", "arial", "normal");
        doc.setFont("arial");
        let y = 10;
        const lineHeight = 10;

        try {
            // 🖼️ Add image (if exists)
            const imageDataUrl = await toDataURL(recipe.image);
            doc.addImage(imageDataUrl, 'JPEG', 10, y, 60, 45); // x, y, width, height
            y += 50; // Leave space after image
        } catch (err) {
            console.warn("Image failed to load:", err);
        }

        // 🧾 Title
        doc.setFontSize(16);
        doc.text(recipe.name, 10, y);
        y += lineHeight + 2;

        // Description
        doc.setFontSize(12);
        doc.text(recipe.description, 10, y);
        y += lineHeight;

        // Meta info
        doc.setFontSize(11);
        doc.text(`🕒 Chuẩn bị: ${recipe.prepTime} | Nấu: ${recipe.cookTime} | Tổng: ${recipe.totalTime}`, 10, y);
        y += lineHeight;
        doc.text(`🍽️ Khẩu phần: ${recipe.servings} | 🔥 Độ khó: ${recipe.difficulty}`, 10, y);
        y += lineHeight;

        doc.text(
            `🔎 Dinh dưỡng: ${recipe.nutrition.calories} cal | ${recipe.nutrition.protein} đạm | ${recipe.nutrition.carbs} carbs | ${recipe.nutrition.fat} béo`,
            10,
            y
        );
        y += lineHeight * 2;

        // Ingredients
        doc.setFontSize(13);
        doc.text("📋 Nguyên liệu:", 10, y);
        y += lineHeight;
        doc.setFontSize(11);
        recipe.ingredients.forEach((ing) => {
            doc.text(`- ${ing.name}: ${ing.amount}`, 10, y);
            y += lineHeight;
        });

        y += lineHeight / 2;

        // Steps
        doc.setFontSize(13);
        doc.text("👩‍🍳 Các bước thực hiện:", 10, y);
        y += lineHeight;
        doc.setFontSize(11);
        recipe.steps.forEach((step, i) => {
            doc.text(`${i + 1}. ${step.title}`, 10, y);
            y += lineHeight;
            doc.text(`   ${step.description}`, 10, y);
            y += lineHeight * 1.1;
        });

        // Tips
        if (recipe.tips?.length) {
            y += lineHeight / 2;
            doc.setFontSize(13);
            doc.text("💡 Mẹo nhỏ:", 10, y);
            y += lineHeight;
            doc.setFontSize(11);
            recipe.tips.forEach((tip) => {
                doc.text(`- ${tip}`, 10, y);
                y += lineHeight;
            });
        }

        doc.save(`${recipe.name}.pdf`);
        trackShare?.();
        alert("Recipe downloaded as PDF");
    };



    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1">
                <div className="container px-4 py-6 md:py-8 md:px-6">
                    <div className="mb-6">
                        <Link
                            href="/ke-hoach-bua-an"
                            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ChevronLeft className="mr-1 h-4 w-4" />
                            Quay lại kế hoạch bữa ăn
                        </Link>
                    </div>
                    {renderSuggestionBadge()}
                    {isLoading ? <LoadingComponent /> : <>
                        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                            <div className="relative aspect-video overflow-hidden rounded-lg">
                                {getYouTubeId(recipe.videoUrl) ? (
                                    <iframe
                                        src={getYouTubeEmbedUrl(recipe.videoUrl)}
                                        title={recipe.name || "Recipe video"}
                                        className="absolute inset-0 h-full w-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen
                                    />
                                ) : (
                                    <img
                                        src={recipe.image || "/placeholder.svg"}
                                        alt={recipe.name}
                                        fill=""
                                        className="object-cover"
                                    />
                                )}
                            </div>



                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex flex-wrap gap-2">
                                        {recipe?.tags?.map((tag, index) => (
                                            <Badge key={index} variant="secondary">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                    <h1 className="text-3xl font-bold">{recipe.name}</h1>
                                    <p className="text-muted-foreground">{recipe.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                    <div className="flex flex-col items-center rounded-lg border p-3 text-center">
                                        <Clock className="mb-1 h-5 w-5 text-orange-500" />
                                        <span className="text-xs text-muted-foreground">Tổng thời gian</span>
                                        <span className="font-medium">{recipe.totalTime}</span>
                                    </div>
                                    <div className="flex flex-col items-center rounded-lg border p-3 text-center">
                                        <Users className="mb-1 h-5 w-5 text-orange-500" />
                                        <span className="text-xs text-muted-foreground">Khẩu phần</span>
                                        <span className="font-medium">{recipe.servings} người</span>
                                    </div>
                                    <div className="flex flex-col items-center rounded-lg border p-3 text-center">
                                        <Flame className="mb-1 h-5 w-5 text-orange-500" />
                                        <span className="text-xs text-muted-foreground">Calo</span>
                                        <span className="font-medium">{recipe.calories} kcal</span>
                                    </div>
                                    <div className="flex flex-col items-center rounded-lg border p-3 text-center">
                                        <Utensils className="mb-1 h-5 w-5 text-orange-500" />
                                        <span className="text-xs text-muted-foreground">Độ khó</span>
                                        <span className="font-medium">{recipe.difficulty}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <Button onClick={() => addIngredientsToShoppingList(recipe.ingredients)} className="gap-2 bg-orange-500 hover:bg-orange-600">
                                        <ShoppingBag className="h-4 w-4" />
                                        Thêm vào danh sách mua sắm
                                    </Button>
                                    <Button onClick={toggleFavorite} variant="outline" className="gap-2">
                                        <Heart className={`h-4 w-4 ${isFavorited ? 'text-red-500' : ''}`} fill={isFavorited ? 'currentColor' : 'none'} />
                                        Lưu công thức
                                    </Button>
                                    <Button onClick={copyLink} variant="outline" size="icon">
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                    <Button onClick={generatePDF} variant="outline" size="icon">
                                        <Printer className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <Tabs defaultValue="ingredients" className="mt-8">
                            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0">
                                <TabsTrigger
                                    value="ingredients"
                                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:shadow-none"
                                >
                                    Nguyên liệu
                                </TabsTrigger>
                                <TabsTrigger
                                    value="instructions"
                                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:shadow-none"
                                >
                                    Hướng dẫn
                                </TabsTrigger>
                                <TabsTrigger
                                    value="nutrition"
                                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:shadow-none"
                                >
                                    Dinh dưỡng
                                </TabsTrigger>
                                <TabsTrigger
                                    value="tips"
                                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:shadow-none"
                                >
                                    Mẹo
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="ingredients" className="pt-6">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {recipe.ingredients.map((ingredient, index) => (
                                        <div key={index} className="flex items-center justify-between border-b pb-2">
                                            <span>{ingredient.name}</span>
                                            <span className="text-muted-foreground">{ingredient.amount}</span>
                                        </div>
                                    ))}
                                </div>
                                <Button onClick={() => addIngredientsToShoppingList(recipe.ingredients)} className="mt-6 gap-2 bg-orange-500 hover:bg-orange-600">
                                    <ShoppingBag className="h-4 w-4" />
                                    Thêm tất cả vào danh sách mua sắm
                                </Button>
                            </TabsContent>
                            <TabsContent value="instructions" className="pt-6 space-y-6">
                                {recipe.steps.map((step, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                                                {index + 1}
                                            </div>
                                            <h3 className="font-bold">{step.title}</h3>
                                        </div>
                                        <p className="ml-11 text-muted-foreground">{step.description}</p>
                                        {index < recipe.steps.length - 1 && <Separator className="mt-4" />}
                                    </div>
                                ))}
                            </TabsContent>
                            <TabsContent value="nutrition" className="pt-6">
                                <div className="rounded-lg border p-6">
                                    <h3 className="mb-4 font-bold">Thông tin dinh dưỡng (cho mỗi khẩu phần)</h3>
                                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">Calo</p>
                                            <p className="font-medium">{recipe.nutrition.calories} kcal</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">Protein</p>
                                            <p className="font-medium">{recipe.nutrition.protein}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">Carbs</p>
                                            <p className="font-medium">{recipe.nutrition.carbs}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">Chất béo</p>
                                            <p className="font-medium">{recipe.nutrition.fat}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">Chất xơ</p>
                                            <p className="font-medium">{recipe.nutrition.fiber}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">Đường</p>
                                            <p className="font-medium">{recipe.nutrition.sugar}</p>
                                        </div>
                                    </div>
                                    <Alert className="mt-6">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Lưu ý</AlertTitle>
                                        <AlertDescription>
                                            Thông tin dinh dưỡng chỉ mang tính tham khảo và có thể thay đổi tùy thuộc vào kích thước khẩu phần
                                            và nguyên liệu cụ thể được sử dụng.
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            </TabsContent>
                            <TabsContent value="tips" className="pt-6">
                                <div className="rounded-lg border p-6">
                                    <h3 className="mb-4 font-bold">Mẹo nấu ăn</h3>
                                    <ul className="space-y-2">
                                        {recipe.tips.map((tip, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-500" />
                                                <span>{tip}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </TabsContent>
                        </Tabs>

                        <section className="mt-12">
                            <h2 className="mb-6 text-2xl font-bold">Công thức liên quan</h2>
                            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                                {recipe.relatedRecipes.map((related) => (
                                    <Link key={related.id} href={`/cong-thuc/${related.id}`} className="group">
                                        <div className="overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md">
                                            <div className="aspect-video relative overflow-hidden">
                                                {/* <Image
                                                    src={related.image || "/placeholder.svg"}
                                                    alt={related.name}
                                                    fill
                                                    className="object-cover transition-transform group-hover:scale-105"
                                                /> */}
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-bold group-hover:text-orange-500 transition-colors">{related.name}</h3>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </>}

                </div>
            </main>


        </div>
    )
}
