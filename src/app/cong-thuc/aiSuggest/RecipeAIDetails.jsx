import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
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
import { Separator } from "@/components/ui/separator"

export default function RecipeAIDetails({ recipe }) {

    // const recipe = recipes[params.id]

    if (!recipe) {
        return (<>No recipe found@</>)
    }

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

                    <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                        <div className="relative aspect-video overflow-hidden rounded-lg">
                            <Image src={recipe.image || "https://png.pngtree.com/png-vector/20230824/ourmid/pngtree-line-art-food-products-icon-design-vector-png-image_6914965.png"} alt={recipe.name} fill className="object-cover" />
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex flex-wrap gap-2">
                                    {recipe.tags.map((tag, index) => (
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
                                {/* <Button className="gap-2 bg-orange-500 hover:bg-orange-600">
                                    <ShoppingBag className="h-4 w-4" />
                                    Thêm vào danh sách mua sắm
                                </Button>
                                <Button variant="outline" className="gap-2">
                                    <Heart className="h-4 w-4" />
                                    Lưu công thức
                                </Button> */}
                                <Button variant="outline" size="icon">
                                    <Share2 className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon">
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
                            {/* <Button className="mt-6 gap-2 bg-orange-500 hover:bg-orange-600">
                                <ShoppingBag className="h-4 w-4" />
                                Thêm tất cả vào danh sách mua sắm
                            </Button> */}
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


                </div>
            </main>


        </div>
    )
}
