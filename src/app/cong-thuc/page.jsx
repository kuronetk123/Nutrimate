"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
// import Image from "next/image"
import { Search, Filter, Clock, Users, ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
// import { RecipeService } from "@/services/RecipeService"
import LoadingComponent from "@/components/common/LoadingComponent"
import toast from "react-hot-toast"

export default function RecipesPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [selectedDifficulty, setSelectedDifficulty] = useState("all")
    const [selectedTags, setSelectedTags] = useState([])
    const [timeRange, setTimeRange] = useState([0, 180])
    const [sortBy, setSortBy] = useState("newest")
    const [allRecipes, setAllRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(false) // Retain this if you plan to use it for a loading spinner

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                setIsLoading(true);
                const res = await fetch('/api/recipes');
                if (res.ok) {
                    const data = await res.json();
                    // Only show accepted recipe suggestions
                    setAllRecipes(data.filter(r => r.status === "accepted"));
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

    console.log("allRecipes", allRecipes);


    const itemsPerPage = 9
    // Dynamically extract available filter options from data
    const allCategories = Array.from(
        new Set(allRecipes?.map((recipe) => recipe.category).filter(Boolean))
    );
    const defaultDifficulties = ["Dễ", "Trung bình", "Khó"];
    const allDifficulties = Array.from(
        new Set([
            ...defaultDifficulties,
            ...allRecipes?.map((recipe) => recipe.difficulty).filter(Boolean)
        ])
    );
    const allTags = Array.from(
        new Set(allRecipes?.flatMap((recipe) => Array.isArray(recipe.tags) ? recipe.tags : []))
    );

    // Filter recipes based on search and filters
    const filteredRecipes = allRecipes.filter((recipe) => {
        const lowerSearch = searchTerm.toLowerCase();
        const matchesName = recipe.name?.toLowerCase()?.includes(lowerSearch) || false;
        const matchesDescription = recipe.description?.toLowerCase()?.includes(lowerSearch) || false;
        const matchesIngredient = Array.isArray(recipe.ingredients)
            ? recipe.ingredients.some(ing => ing.name?.toLowerCase()?.includes(lowerSearch))
            : false;
        const matchesSearch = matchesName || matchesDescription || matchesIngredient;

        const matchesCategory = selectedCategory === "all" || recipe.category === selectedCategory;

        const matchesDifficulty = selectedDifficulty === "all" || recipe.difficulty === selectedDifficulty;

        const matchesTags =
            selectedTags.length === 0 ||
            (Array.isArray(recipe.tags) && selectedTags.some((tag) => recipe.tags.includes(tag)));

        const cookTime = Number.parseInt(recipe?.time?.split(" ")[0]) || 0;
        const matchesTime = cookTime >= timeRange[0] && cookTime <= timeRange[1];

        return matchesSearch && matchesCategory && matchesDifficulty && matchesTags && matchesTime;
    });

    // Sort recipes
    const getCookTime = (recipe) =>
        typeof recipe.cookTime === "string" && recipe.cookTime.includes(" ")
            ? Number.parseInt(recipe.cookTime.split(" ")[0])
            : 0;

    const sortedRecipes = [...filteredRecipes].sort((a, b) => {
        if (sortBy === "newest") {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortBy === "oldest") {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        } else if (sortBy === "time-asc") {
            return getCookTime(a) - getCookTime(b);
        } else if (sortBy === "time-desc") {
            return getCookTime(b) - getCookTime(a);
        }
        return 0
    })

    // Pagination
    const totalPages = Math.ceil(sortedRecipes.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedRecipes = sortedRecipes.slice(startIndex, startIndex + itemsPerPage)

    const handlePageChange = (page) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const handleTagToggle = (tag) => {
        setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
    }

    const clearFilters = () => {
        setSelectedCategory("all")
        setSelectedDifficulty("all")
        setSelectedTags([])
        setTimeRange([0, 180])
    }

    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1">
                <section className="w-full py-8 md:py-12 lg:py-16 bg-orange-50">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Khám phá công thức</h1>
                                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                                    Tìm kiếm hàng nghìn công thức nấu ăn ngon từ Nutrimate
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="w-full py-8">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex flex-1 items-center gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Tìm kiếm công thức..."
                                        className="pl-8"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" size="icon" className="shrink-0">
                                            <Filter className="h-4 w-4" />
                                            <span className="sr-only">Lọc</span>
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent className="overflow-y-auto">
                                        <SheetHeader>
                                            <SheetTitle>Lọc công thức</SheetTitle>
                                            <SheetDescription>Tùy chỉnh kết quả tìm kiếm của bạn</SheetDescription>
                                        </SheetHeader>
                                        <div className="py-4">
                                            <div className="space-y-4">
                                                {/* <div>
                                                    <h3 className="mb-2 text-sm font-medium">Loại bữa ăn</h3>
                                                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn loại bữa ăn" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">Tất cả</SelectItem>
                                                            {allCategories.map((cat) => (
                                                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div> */}
                                                <div>
                                                    <h3 className="mb-2 text-sm font-medium">Độ khó</h3>
                                                    <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn độ khó" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">Tất cả</SelectItem>
                                                            {allDifficulties.map((diff) => (
                                                                <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <h3 className="mb-2 text-sm font-medium">Thời gian nấu (phút)</h3>
                                                    <div className="px-2">
                                                        <Slider
                                                            value={timeRange}
                                                            min={0}
                                                            max={180}
                                                            step={5}
                                                            onValueChange={setTimeRange}
                                                            className="my-4"
                                                        />
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm">{timeRange[0]} phút</span>
                                                            <span className="text-sm">{timeRange[1]} phút</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Separator />
                                                <div>
                                                    <h3 className="mb-2 text-sm font-medium">Thẻ</h3>
                                                    <div className="space-y-2">
                                                        {allTags.map((tag) => (
                                                            <div key={tag} className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    id={`tag-${tag}`}
                                                                    checked={selectedTags.includes(tag)}
                                                                    onCheckedChange={() => handleTagToggle(tag)}
                                                                />
                                                                <Label htmlFor={`tag-${tag}`} className="text-sm font-normal">
                                                                    {tag}
                                                                </Label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <SheetFooter className="flex-row justify-between space-x-2">
                                            <Button variant="outline" onClick={clearFilters}>
                                                Xóa bộ lọc
                                            </Button>
                                            <SheetClose asChild>
                                                <Button className="bg-orange-500 hover:bg-orange-600">Áp dụng</Button>
                                            </SheetClose>
                                        </SheetFooter>
                                    </SheetContent>
                                </Sheet>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Sắp xếp theo:</span>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Sắp xếp theo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">Mới nhất</SelectItem>
                                        <SelectItem value="oldest">Cũ nhất</SelectItem>
                                        <SelectItem value="time-asc">Thời gian nấu (tăng dần)</SelectItem>
                                        <SelectItem value="time-desc">Thời gian nấu (giảm dần)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {selectedTags.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {selectedTags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                        {tag}
                                        <button onClick={() => handleTagToggle(tag)}>
                                            <X className="h-3 w-3" />
                                            <span className="sr-only">Xóa {tag}</span>
                                        </button>
                                    </Badge>
                                ))}
                                <Button variant="ghost" size="sm" onClick={() => setSelectedTags([])}>
                                    Xóa tất cả
                                </Button>
                            </div>
                        )}

                        <div className="mt-6">
                            {isLoading ? <LoadingComponent />
                                :
                                <>  {filteredRecipes.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="rounded-full bg-muted p-6">
                                            <Search className="h-10 w-10 text-muted-foreground" />
                                        </div>
                                        <h2 className="mt-4 text-xl font-semibold">Không tìm thấy công thức</h2>
                                        <p className="mt-2 text-muted-foreground">
                                            Không tìm thấy công thức phù hợp với bộ lọc của bạn. Hãy thử với các tiêu chí khác.
                                        </p>
                                        <Button className="mt-4" variant="outline" onClick={clearFilters}>
                                            Xóa bộ lọc
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                            {paginatedRecipes.map((recipe) => (
                                                <Link key={recipe._id} href={`/cong-thuc/${recipe._id}`} className="group">
                                                    <div className="overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md">
                                                        <div className="aspect-video relative overflow-hidden">
                                                            <img
                                                                src={recipe.image || "/placeholder.svg"}
                                                                alt={recipe.name}
                                                                fill=""
                                                                className="object-cover transition-transform group-hover:scale-105"
                                                            />
                                                            <Badge className="absolute top-2 left-2 bg-orange-500">{recipe.category}</Badge>
                                                        </div>
                                                        <div className="p-4">
                                                            <h3 className="font-bold group-hover:text-orange-500 transition-colors line-clamp-1">
                                                                {recipe.name}
                                                            </h3>
                                                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{recipe.description}</p>
                                                            <div className="mt-3 flex items-center justify-between text-sm">
                                                                <div className="flex items-center gap-1">
                                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                                    <span>{recipe.time}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <Users className="h-4 w-4 text-muted-foreground" />
                                                                    <span>{recipe.servings} người</span>
                                                                </div>
                                                                <Badge variant="outline">{recipe.difficulty}</Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>

                                        {totalPages > 1 && (
                                            <div className="mt-8 flex items-center justify-center gap-1">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                                    disabled={currentPage === 1}
                                                >
                                                    <ChevronLeft className="h-4 w-4" />
                                                    <span className="sr-only">Trang trước</span>
                                                </Button>
                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                    <Button
                                                        key={page}
                                                        variant={currentPage === page ? "default" : "outline"}
                                                        size="icon"
                                                        onClick={() => handlePageChange(page)}
                                                        className={currentPage === page ? "bg-orange-500 hover:bg-orange-600" : ""}
                                                    >
                                                        {page}
                                                    </Button>
                                                ))}
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                                    disabled={currentPage === totalPages}
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                    <span className="sr-only">Trang sau</span>
                                                </Button>
                                            </div>
                                        )}

                                        <div className="mt-4 text-center text-sm text-muted-foreground">
                                            Hiển thị {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredRecipes.length)} trong số{" "}
                                            {filteredRecipes.length} công thức
                                        </div>
                                    </>
                                )}</>}


                        </div>
                    </div>
                </section>
            </main>


        </div>
    )
}
