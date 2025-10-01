"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Save, Loader } from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"

export default function AdminSettings() {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  // General settings
  const [siteName, setSiteName] = useState("Nutrimate")
  const [siteDescription, setSiteDescription] = useState("Trợ lý nấu ăn bằng AI")
  const [contactEmail, setContactEmail] = useState("support@Nutrimate.vn")
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  // Email settings
  const [smtpHost, setSmtpHost] = useState("")
  const [smtpPort, setSmtpPort] = useState("")
  const [smtpUser, setSmtpUser] = useState("")
  const [smtpPassword, setSmtpPassword] = useState("")
  const [emailFrom, setEmailFrom] = useState("")
  const [emailReplyTo, setEmailReplyTo] = useState("")

  // Recipe settings
  const [defaultRecipeVisibility, setDefaultRecipeVisibility] = useState(true)
  const [moderateUserRecipes, setModerateUserRecipes] = useState(true)
  const [maxRecipesPerUser, setMaxRecipesPerUser] = useState("50")
  const [maxImagesPerRecipe, setMaxImagesPerRecipe] = useState("5")

  const handleSaveSettings = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Cài đặt đã được lưu",
        description: "Các thay đổi của bạn đã được áp dụng thành công.",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi lưu cài đặt. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cài đặt hệ thống</h1>
        <p className="text-muted-foreground">Quản lý cài đặt và cấu hình cho Nutrimate</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Cài đặt chung</TabsTrigger>
          <TabsTrigger value="email">Cài đặt email</TabsTrigger>
          <TabsTrigger value="recipe">Cài đặt công thức</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <form onSubmit={handleSaveSettings}>
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt chung</CardTitle>
                <CardDescription>Quản lý cài đặt chung cho trang web Nutrimate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Tên trang web</Label>
                  <Input id="site-name" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site-description">Mô tả trang web</Label>
                  <Textarea
                    id="site-description"
                    value={siteDescription}
                    onChange={(e) => setSiteDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email liên hệ</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenance-mode">Chế độ bảo trì</Label>
                    <p className="text-sm text-muted-foreground">
                      Khi bật, trang web sẽ hiển thị thông báo bảo trì cho tất cả người dùng
                    </p>
                  </div>
                  <Switch id="maintenance-mode" checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Lưu thay đổi
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>

        <TabsContent value="email">
          <form onSubmit={handleSaveSettings}>
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt email</CardTitle>
                <CardDescription>Cấu hình SMTP và các cài đặt email khác</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-host">SMTP Host</Label>
                    <Input
                      id="smtp-host"
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                      placeholder="smtp.example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-port">SMTP Port</Label>
                    <Input
                      id="smtp-port"
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(e.target.value)}
                      placeholder="587"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-user">SMTP Username</Label>
                    <Input
                      id="smtp-user"
                      value={smtpUser}
                      onChange={(e) => setSmtpUser(e.target.value)}
                      placeholder="user@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-password">SMTP Password</Label>
                    <Input
                      id="smtp-password"
                      type="password"
                      value={smtpPassword}
                      onChange={(e) => setSmtpPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email-from">Email From</Label>
                    <Input
                      id="email-from"
                      value={emailFrom}
                      onChange={(e) => setEmailFrom(e.target.value)}
                      placeholder="noreply@Nutrimate.vn"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-reply-to">Email Reply-To</Label>
                    <Input
                      id="email-reply-to"
                      value={emailReplyTo}
                      onChange={(e) => setEmailReplyTo(e.target.value)}
                      placeholder="support@Nutrimate.vn"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Lưu thay đổi
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>

        <TabsContent value="recipe">
          <form onSubmit={handleSaveSettings}>
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt công thức</CardTitle>
                <CardDescription>Quản lý cài đặt liên quan đến công thức và nội dung người dùng</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="default-recipe-visibility">Hiển thị công thức mặc định</Label>
                    <p className="text-sm text-muted-foreground">
                      Công thức người dùng sẽ được hiển thị công khai theo mặc định
                    </p>
                  </div>
                  <Switch
                    id="default-recipe-visibility"
                    checked={defaultRecipeVisibility}
                    onCheckedChange={setDefaultRecipeVisibility}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="moderate-user-recipes">Kiểm duyệt công thức người dùng</Label>
                    <p className="text-sm text-muted-foreground">
                      Công thức người dùng cần được kiểm duyệt trước khi hiển thị công khai
                    </p>
                  </div>
                  <Switch
                    id="moderate-user-recipes"
                    checked={moderateUserRecipes}
                    onCheckedChange={setModerateUserRecipes}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="max-recipes-per-user">Số công thức tối đa mỗi người dùng</Label>
                    <Input
                      id="max-recipes-per-user"
                      type="number"
                      min="1"
                      value={maxRecipesPerUser}
                      onChange={(e) => setMaxRecipesPerUser(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-images-per-recipe">Số hình ảnh tối đa mỗi công thức</Label>
                    <Input
                      id="max-images-per-recipe"
                      type="number"
                      min="1"
                      value={maxImagesPerRecipe}
                      onChange={(e) => setMaxImagesPerRecipe(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Lưu thay đổi
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}
