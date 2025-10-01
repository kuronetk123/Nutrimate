"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/lib/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Plus, Trash2, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditRecipePage({ params }) {
    const router = useRouter()
    const { id } = params
    const { toast } = useToast()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [recipe, setRecipe] = useState({
        name: "",
        description: "",
        image: "",
        videoUrl: "",
        prepTime: "",
        cookTime: "",
        totalTime: "",
        servings: 1,
        calories: 0,
        difficulty: "Dễ",
        tags: [],
        ingredients: [],
        steps: [],
        nutrition: {
            calories: 0,
            protein: "",
            carbs: "",
            fat: "",
            fiber: "",
            sugar: "",
        },
        tips: [],
        relatedRecipes: [],
        isPublished: false,
    })

    const [newTag, setNewTag] = useState("")
    const [newTip, setNewTip] = useState("")

    // Fetch recipe data
    useEffect(() => {
        async function fetchRecipe() {
            try {
                const response = await fetch(`/api/recipes/${id}`)
                if (!response.ok) {
                    throw new Error("Không thể tải thông tin công thức")
                }
                const data = await response.json()
                setRecipe(data)
            } catch (error) {
                console.error("Error fetching recipe:", error)
                toast({
                    variant: "destructive",
                    title: "Lỗi",
                    description: "Không thể tải thông tin công thức",
                })
            } finally {
                setLoading(false)
            }
        }

        fetchRecipe()
    }, [id])

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)

        try {
            const response = await fetch(`/api/recipes/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(recipe),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || "Không thể cập nhật công thức")
            }

            toast({
                variant: "success",
                title: "Thành công",
                description: "Đã cập nhật công thức thành công",
            })

            // Navigate back to recipes list
            router.push("/admin/recipes")
        } catch (error) {
            console.error("Error updating recipe:", error)
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: error.message || "Không thể cập nhật công thức",
            })
        } finally {
            setSaving(false)
        }
    }

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target
        setRecipe((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // Handle nutrition changes
    const handleNutritionChange = (e) => {
        const { name, value } = e.target
        setRecipe((prev) => ({
            ...prev,
            nutrition: {
                ...prev.nutrition,
                [name]: value,
            },
        }))
    }

    // Handle tags
    const addTag = () => {
        if (newTag.trim() !== "") {
            setRecipe((prev) => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()],
            }))
            setNewTag("")
        }
    }

    const removeTag = (index) => {
        setRecipe((prev) => ({
            ...prev,
            tags: prev.tags.filter((_, i) => i !== index),
        }))
    }

    // Handle tips
    const addTip = () => {
        if (newTip.trim() !== "") {
            setRecipe((prev) => ({
                ...prev,
                tips: [...prev.tips, newTip.trim()],
            }))
            setNewTip("")
        }
    }

    const removeTip = (index) => {
        setRecipe((prev) => ({
            ...prev,
            tips: prev.tips.filter((_, i) => i !== index),
        }))
    }

    // Handle ingredients
    const addIngredient = () => {
        setRecipe((prev) => ({
            ...prev,
            ingredients: [...prev.ingredients, { name: "", amount: "" }],
        }))
    }

    const updateIngredient = (index, field, value) => {
        setRecipe((prev) => {
            const updatedIngredients = [...prev.ingredients]
            updatedIngredients[index] = {
                ...updatedIngredients[index],
                [field]: value,
            }
            return {
                ...prev,
                ingredients: updatedIngredients,
            }
        })
    }

    const removeIngredient = (index) => {
        setRecipe((prev) => ({
            ...prev,
            ingredients: prev.ingredients.filter((_, i) => i !== index),
        }))
    }

    // Handle steps
    const addStep = () => {
        setRecipe((prev) => ({
            ...prev,
            steps: [...prev.steps, { title: "", description: "" }],
        }))
    }

    const updateStep = (index, field, value) => {
        setRecipe((prev) => {
            const updatedSteps = [...prev.steps]
            updatedSteps[index] = {
                ...updatedSteps[index],
                [field]: value,
            }
            return {
                ...prev,
                steps: updatedSteps,
            }
        })
    }

    const removeStep = (index) => {
        setRecipe((prev) => ({
            ...prev,
            steps: prev.steps.filter((_, i) => i !== index),
        }))
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Đang tải...</span>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Link href="/admin/recipes">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Chỉnh sửa công thức</h1>
                </div>
                <Button onClick={handleSubmit} disabled={saving} className="flex items-center space-x-2">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    <span>Lưu công thức</span>
                </Button>
            </div>

            <form onSubmit={handleSubmit}>
                <Tabs defaultValue="basic">
                    <TabsList className="grid grid-cols-5 mb-6">
                        <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
                        <TabsTrigger value="ingredients">Nguyên liệu</TabsTrigger>
                        <TabsTrigger value="steps">Các bước</TabsTrigger>
                        <TabsTrigger value="nutrition">Dinh dưỡng</TabsTrigger>
                        <TabsTrigger value="additional">Thông tin thêm</TabsTrigger>
                    </TabsList>

                    {/* Basic Information */}
                    <TabsContent value="basic">
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin cơ bản</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium">
                                            Tên công thức
                                        </label>
                                        <Input id="name" name="name" value={recipe.name} onChange={handleChange} required />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="description" className="text-sm font-medium">
                                            Mô tả
                                        </label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            value={recipe.description}
                                            onChange={handleChange}
                                            rows={4}
                                        />
                                    </div>

                                    <div className="space-y-2">

                                        <label htmlFor="image" className="text-sm font-medium">
                                            URL hình ảnh
                                        </label>
                                        <img className="w-1/3 h-auto object-cover rounded-md" alt="Recipe"
                                            src={recipe.image ? recipe.image : "https://cdn-icons-png.flaticon.com/512/4080/4080032.png"} />
                                        <Input id="image" name="image" value={recipe.image} onChange={handleChange} />
                                    </div>

                                    <div className="space-y-2">

                                        <label htmlFor="image" className="text-sm font-medium">
                                            Video hướng dẫn (URL)
                                        </label>
                                        <Input
                                            id="videoUrl"
                                            name="videoUrl"
                                            value={recipe.videoUrl}
                                            onChange={handleChange}
                                            placeholder="VD: https://www.youtube.com/watch?v=example"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="prepTime" className="text-sm font-medium">
                                            Thời gian chuẩn bị
                                        </label>
                                        <Input
                                            id="prepTime"
                                            name="prepTime"
                                            value={recipe.prepTime}
                                            onChange={handleChange}
                                            placeholder="VD: 15 phút"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="cookTime" className="text-sm font-medium">
                                            Thời gian nấu
                                        </label>
                                        <Input
                                            id="cookTime"
                                            name="cookTime"
                                            value={recipe.cookTime}
                                            onChange={handleChange}
                                            placeholder="VD: 30 phút"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="servings" className="text-sm font-medium">
                                            Khẩu phần
                                        </label>
                                        <Input
                                            id="servings"
                                            name="servings"
                                            type="number"
                                            min="1"
                                            value={recipe.servings}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="calories" className="text-sm font-medium">
                                            Calories
                                        </label>
                                        <Input
                                            id="calories"
                                            name="calories"
                                            type="number"
                                            min="0"
                                            value={recipe.calories}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="difficulty" className="text-sm font-medium">
                                            Độ khó
                                        </label>
                                        <Select
                                            value={recipe.difficulty}
                                            onValueChange={(value) => setRecipe((prev) => ({ ...prev, difficulty: value }))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn độ khó" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Dễ">Dễ</SelectItem>
                                                <SelectItem value="Trung bình">Trung bình</SelectItem>
                                                <SelectItem value="Khó">Khó</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium">Tags</label>
                                        <div className="flex space-x-2">
                                            <Input
                                                value={newTag}
                                                onChange={(e) => setNewTag(e.target.value)}
                                                placeholder="Thêm tag mới"
                                                className="w-48"
                                            />
                                            <Button type="button" onClick={addTag} size="sm">
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {recipe.tags.map((tag, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(index)}
                                                    className="ml-2 text-secondary-foreground/70 hover:text-secondary-foreground"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="isPublished"
                                        checked={recipe.isPublished}
                                        onChange={(e) => setRecipe((prev) => ({ ...prev, isPublished: e.target.checked }))}
                                        className="rounded border-gray-300"
                                    />
                                    <label htmlFor="isPublished" className="text-sm font-medium">
                                        Công khai công thức
                                    </label>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Ingredients */}
                    <TabsContent value="ingredients">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Nguyên liệu</CardTitle>
                                <Button type="button" onClick={addIngredient} size="sm">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Thêm nguyên liệu
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {recipe.ingredients.length === 0 ? (
                                    <div className="text-center py-4 text-muted-foreground">
                                        Chưa có nguyên liệu nào. Nhấn nút "Thêm nguyên liệu" để bắt đầu.
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {recipe.ingredients.map((ingredient, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <div className="grid grid-cols-2 gap-2 flex-1">
                                                    <Input
                                                        value={ingredient.name}
                                                        onChange={(e) => updateIngredient(index, "name", e.target.value)}
                                                        placeholder="Tên nguyên liệu"
                                                    />
                                                    <Input
                                                        value={ingredient.amount}
                                                        onChange={(e) => updateIngredient(index, "amount", e.target.value)}
                                                        placeholder="Số lượng"
                                                    />
                                                </div>
                                                <Button type="button" variant="destructive" size="icon" onClick={() => removeIngredient(index)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Steps */}
                    <TabsContent value="steps">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Các bước thực hiện</CardTitle>
                                <Button type="button" onClick={addStep} size="sm">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Thêm bước
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {recipe.steps.length === 0 ? (
                                    <div className="text-center py-4 text-muted-foreground">
                                        Chưa có bước nào. Nhấn nút "Thêm bước" để bắt đầu.
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {recipe.steps.map((step, index) => (
                                            <div key={index} className="space-y-2 border-b pb-4 last:border-0">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-medium">Bước {index + 1}</h3>
                                                    <Button type="button" variant="destructive" size="icon" onClick={() => removeStep(index)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="space-y-2">
                                                    <Input
                                                        value={step.title}
                                                        onChange={(e) => updateStep(index, "title", e.target.value)}
                                                        placeholder="Tiêu đề bước"
                                                    />
                                                    <Textarea
                                                        value={step.description}
                                                        onChange={(e) => updateStep(index, "description", e.target.value)}
                                                        placeholder="Mô tả chi tiết"
                                                        rows={3}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Nutrition */}
                    <TabsContent value="nutrition">
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin dinh dưỡng</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="nutrition.calories" className="text-sm font-medium">
                                            Calories
                                        </label>
                                        <Input
                                            id="nutrition.calories"
                                            name="calories"
                                            type="number"
                                            min="0"
                                            value={recipe.nutrition.calories}
                                            onChange={handleNutritionChange}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="nutrition.protein" className="text-sm font-medium">
                                            Protein
                                        </label>
                                        <Input
                                            id="nutrition.protein"
                                            name="protein"
                                            value={recipe.nutrition.protein}
                                            onChange={handleNutritionChange}
                                            placeholder="VD: 10g"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="nutrition.carbs" className="text-sm font-medium">
                                            Carbs
                                        </label>
                                        <Input
                                            id="nutrition.carbs"
                                            name="carbs"
                                            value={recipe.nutrition.carbs}
                                            onChange={handleNutritionChange}
                                            placeholder="VD: 30g"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="nutrition.fat" className="text-sm font-medium">
                                            Chất béo
                                        </label>
                                        <Input
                                            id="nutrition.fat"
                                            name="fat"
                                            value={recipe.nutrition.fat}
                                            onChange={handleNutritionChange}
                                            placeholder="VD: 5g"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="nutrition.fiber" className="text-sm font-medium">
                                            Chất xơ
                                        </label>
                                        <Input
                                            id="nutrition.fiber"
                                            name="fiber"
                                            value={recipe.nutrition.fiber}
                                            onChange={handleNutritionChange}
                                            placeholder="VD: 3g"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="nutrition.sugar" className="text-sm font-medium">
                                            Đường
                                        </label>
                                        <Input
                                            id="nutrition.sugar"
                                            name="sugar"
                                            value={recipe.nutrition.sugar}
                                            onChange={handleNutritionChange}
                                            placeholder="VD: 2g"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Additional Information */}
                    <TabsContent value="additional">
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin bổ sung</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Tips */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium">Mẹo và lưu ý</label>
                                        <div className="flex space-x-2">
                                            <Input
                                                value={newTip}
                                                onChange={(e) => setNewTip(e.target.value)}
                                                placeholder="Thêm mẹo mới"
                                                className="w-64"
                                            />
                                            <Button type="button" onClick={addTip} size="sm">
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mt-2">
                                        {recipe.tips.length === 0 ? (
                                            <div className="text-muted-foreground text-sm">Chưa có mẹo nào.</div>
                                        ) : (
                                            recipe.tips.map((tip, index) => (
                                                <div key={index} className="flex items-center justify-between bg-secondary/50 p-2 rounded-md">
                                                    <span>{tip}</span>
                                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeTip(index)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </form>
        </div>
    )
}
