import { Mail, Building2, Upload, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Helmet } from "react-helmet-async"

export default function SettingsPage() {
  return (
    <>
      <Helmet>
        <title>Settings - Probo Console</title>
      </Helmet>
      
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-4xl font-medium tracking-tight">Settings</h1>
          <p className="text-lg text-muted-foreground">Manage your details and personal preferences here.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User & Organisation information</CardTitle>
            <CardDescription>Publish your trust page to the web</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Account email</label>
              <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">This is your email to connect to Probo</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-600">john.doe@example.com</span>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Organization logo</label>
              <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <span className="text-muted-foreground">
                    Upload a logo to be displayed at the top of your trust page
                  </span>
                </div>
                <Button variant="outline">Change image</Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Organization name</label>
              <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Set the name of the organization</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">ACME</span>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </div>

            <Button variant="destructive" className="mt-6">
              Delete Organization
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workspace members</CardTitle>
            <CardDescription>Manage who has privileged access to your workspace and their permissions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Antoine Bouchardy", email: "antoine.bouchardy@hexa.com", role: "Admin" },
                { name: "Bryan Frimin", email: "bryan.frimin@hexa.com", role: "Admin" },
              ].map((member) => (
                <div key={member.email} className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{member.name}</span>
                      <span className="text-sm text-muted-foreground">{member.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{member.role}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Change role</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Remove member</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
} 