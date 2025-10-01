import Link from "next/link"
import Image from "next/image"
import { ChefHat, Heart, Utensils, Users, Clock, Award } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
    return (
        <div className="flex min-h-screen flex-col">


            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32 bg-orange-50">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Về Nutrimate</h1>
                                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                                    Chúng tôi đang thay đổi cách mọi người nấu ăn với sức mạnh của trí tuệ nhân tạo
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm text-orange-700">
                                    Câu chuyện của chúng tôi
                                </div>
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Từ ý tưởng đến hiện thực</h2>
                                <p className="text-muted-foreground md:text-lg">
                                    Nutrimate ra đời từ một ý tưởng đơn giản: làm cho việc nấu ăn trở nên dễ dàng và thú vị hơn cho tất cả
                                    mọi người. Chúng tôi nhận thấy rằng nhiều người gặp khó khăn trong việc quyết định nấu gì với những
                                    nguyên liệu có sẵn trong tủ lạnh, hoặc cảm thấy thiếu cảm hứng khi phải nấu ăn hàng ngày.
                                </p>
                                <p className="text-muted-foreground md:text-lg">
                                    Được thành lập vào năm 2023 bởi một nhóm các đầu bếp và kỹ sư phần mềm đam mê, Nutrimate kết hợp kiến
                                    thức ẩm thực với công nghệ AI tiên tiến để tạo ra một trợ lý nấu ăn thông minh, giúp mọi người khám
                                    phá niềm vui trong việc nấu nướng.
                                </p>
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
                                    <Image
                                        src="/placeholder.svg?height=400&width=600"
                                        alt="Câu chuyện của Nutrimate"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="w-full py-12 md:py-24 lg:py-32 bg-orange-50">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <div className="inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm text-orange-700">
                                    Sứ mệnh của chúng tôi
                                </div>
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Tầm nhìn và giá trị</h2>
                                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                                    Chúng tôi tin rằng ai cũng có thể trở thành đầu bếp giỏi với công cụ phù hợp
                                </p>
                            </div>
                        </div>
                        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
                            <div className="flex flex-col items-center space-y-4 rounded-lg border bg-card p-6 shadow-sm">
                                <div className="rounded-full bg-orange-100 p-3">
                                    <Heart className="h-6 w-6 text-orange-700" />
                                </div>
                                <h3 className="text-xl font-bold">Đam mê ẩm thực</h3>
                                <p className="text-center text-muted-foreground">
                                    Chúng tôi yêu thích ẩm thực và tin rằng món ăn ngon có thể mang lại niềm vui và kết nối mọi người.
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-4 rounded-lg border bg-card p-6 shadow-sm">
                                <div className="rounded-full bg-orange-100 p-3">
                                    <Utensils className="h-6 w-6 text-orange-700" />
                                </div>
                                <h3 className="text-xl font-bold">Sáng tạo không giới hạn</h3>
                                <p className="text-center text-muted-foreground">
                                    Chúng tôi khuyến khích sự sáng tạo trong nhà bếp và giúp bạn khám phá những khả năng vô tận.
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-4 rounded-lg border bg-card p-6 shadow-sm">
                                <div className="rounded-full bg-orange-100 p-3">
                                    <Users className="h-6 w-6 text-orange-700" />
                                </div>
                                <h3 className="text-xl font-bold">Cộng đồng</h3>
                                <p className="text-center text-muted-foreground">
                                    Chúng tôi xây dựng một cộng đồng nơi mọi người có thể chia sẻ, học hỏi và phát triển cùng nhau.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <div className="inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm text-orange-700">
                                    Đội ngũ của chúng tôi
                                </div>
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Gặp gỡ những người sáng tạo</h2>
                                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                                    Đội ngũ đa dạng của chúng tôi bao gồm các đầu bếp, kỹ sư và nhà thiết kế đam mê
                                </p>
                            </div>
                        </div>
                        <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
                            {[
                                {
                                    name: "Nguyễn Minh Anh",
                                    role: "Đồng sáng lập & CEO",
                                    bio: "Cựu đầu bếp với 10 năm kinh nghiệm và niềm đam mê với công nghệ AI.",
                                },
                                {
                                    name: "Trần Thanh Hà",
                                    role: "Giám đốc công nghệ",
                                    bio: "Chuyên gia AI với kinh nghiệm phát triển các giải pháp học máy tiên tiến.",
                                },
                                {
                                    name: "Lê Hoàng Nam",
                                    role: "Bếp trưởng",
                                    bio: "Đầu bếp chuyên nghiệp với kinh nghiệm tại các nhà hàng 5 sao trên toàn thế giới.",
                                },
                                {
                                    name: "Phạm Thị Mai",
                                    role: "Giám đốc sản phẩm",
                                    bio: "Chuyên gia về trải nghiệm người dùng với niềm đam mê tạo ra sản phẩm trực quan.",
                                },
                                {
                                    name: "Đỗ Quang Huy",
                                    role: "Kỹ sư AI",
                                    bio: "Chuyên gia về xử lý ngôn ngữ tự nhiên và học máy.",
                                },
                                {
                                    name: "Vũ Thị Lan",
                                    role: "Chuyên gia dinh dưỡng",
                                    bio: "Chuyên gia dinh dưỡng với sứ mệnh tạo ra các công thức lành mạnh và cân bằng.",
                                },
                            ].map((member, i) => (
                                <div key={i} className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                                    <div className="relative h-24 w-24 overflow-hidden rounded-full">
                                        <Image
                                            src={`/placeholder.svg?height=96&width=96&text=${member.name.charAt(0)}`}
                                            alt={member.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="space-y-1 text-center">
                                        <h3 className="font-bold">{member.name}</h3>
                                        <p className="text-sm text-orange-600">{member.role}</p>
                                    </div>
                                    <p className="text-center text-sm text-muted-foreground">{member.bio}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="w-full py-12 md:py-24 lg:py-32 bg-orange-50">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <div className="inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm text-orange-700">
                                    Thành tựu
                                </div>
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Hành trình của chúng tôi</h2>
                                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                                    Những cột mốc quan trọng trong quá trình phát triển của Nutrimate
                                </p>
                            </div>
                        </div>
                        <div className="mx-auto max-w-3xl space-y-8 py-12">
                            {[
                                {
                                    year: "2023",
                                    title: "Thành lập Nutrimate",
                                    description: "Nutrimate được thành lập với sứ mệnh cách mạng hóa trải nghiệm nấu ăn tại nhà.",
                                },
                                {
                                    year: "2023",
                                    title: "Ra mắt phiên bản beta",
                                    description: "Phiên bản beta đầu tiên của Nutrimate được ra mắt với 1,000 người dùng thử nghiệm.",
                                },
                                {
                                    year: "2024",
                                    title: "Đạt 10,000 người dùng",
                                    description: "Nutrimate đạt cột mốc 10,000 người dùng đăng ký chỉ sau 6 tháng ra mắt.",
                                },
                                {
                                    year: "2024",
                                    title: "Giải thưởng Startup Sáng tạo",
                                    description: "Nutrimate được vinh danh với giải thưởng Startup Sáng tạo nhất trong lĩnh vực ẩm thực.",
                                },
                                {
                                    year: "2024",
                                    title: "Mở rộng thị trường",
                                    description: "Nutrimate mở rộng ra thị trường quốc tế với phiên bản đa ngôn ngữ.",
                                },
                            ].map((milestone, i) => (
                                <div key={i} className="flex flex-col gap-4 md:flex-row">
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700 md:h-14 md:w-14">
                                        <Clock className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1 space-y-2 rounded-lg border bg-card p-4 shadow-sm md:p-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold">{milestone.title}</h3>
                                            <span className="rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-700">
                                                {milestone.year}
                                            </span>
                                        </div>
                                        <p className="text-muted-foreground">{milestone.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <div className="inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm text-orange-700">
                                        Tham gia cùng chúng tôi
                                    </div>
                                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                        Hãy trở thành một phần của hành trình
                                    </h2>
                                    <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                                        Tham gia cùng hàng nghìn người dùng đang khám phá niềm vui nấu ăn với Nutrimate.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                                        Đăng ký miễn phí
                                    </Button>
                                    <Button size="lg" variant="outline" asChild>
                                        <Link href="/lien-he">Liên hệ với chúng tôi</Link>
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center justify-center lg:justify-end">
                                <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                                    <div className="rounded-full bg-orange-100 p-3">
                                        <Award className="h-6 w-6 text-orange-700" />
                                    </div>
                                    <div className="space-y-2 text-center">
                                        <h3 className="text-xl font-bold">Chúng tôi đang tuyển dụng!</h3>
                                        <p className="text-muted-foreground">
                                            Bạn đam mê ẩm thực và công nghệ? Chúng tôi luôn tìm kiếm những tài năng để gia nhập đội ngũ.
                                        </p>
                                        <Button variant="outline" asChild>
                                            <Link href="/lien-he">Xem vị trí tuyển dụng</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>


        </div>
    )
}
