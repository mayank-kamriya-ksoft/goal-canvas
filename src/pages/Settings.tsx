import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { SEO } from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  User,
  Mail,
  Calendar,
  Save,
  Loader2,
  Bell,
  Palette,
  Shield,
  Key,
  Eye,
  EyeOff,
  Upload,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const profileSchema = z.object({
  display_name: z.string().max(100, "Display name must be less than 100 characters").optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

const passwordSchema = z.object({
  current_password: z.string().min(1, "Current password is required"),
  new_password: z.string().min(8, "New password must be at least 8 characters"),
  confirm_password: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

interface Profile {
  user_id: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  theme_preference: string;
  email_notifications: boolean;
}

interface UserInfo {
  email: string;
  created_at: string;
}

export default function Settings() {
  const { user, session, isLoading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Form state
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [themePreference, setThemePreference] = useState("system");
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.token) return;

      try {
        const { data, error } = await supabase.functions.invoke("user-profile", {
          body: { action: "get", token: session.token },
        });

        if (error) {
          const status = (error as any)?.context?.status;
          if (status === 401) {
            toast.error("Your session expired. Please log in again.");
            await logout();
            navigate("/auth");
            return;
          }
          throw error;
        }

        setProfile(data.profile);
        setUserInfo(data.user);
        setDisplayName(data.profile?.display_name || "");
        setBio(data.profile?.bio || "");
        setAvatarUrl(data.profile?.avatar_url || null);
        setThemePreference(data.profile?.theme_preference || "system");
        setEmailNotifications(data.profile?.email_notifications ?? true);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.token) {
      fetchProfile();
    }
  }, [session, logout, navigate]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    if (!session?.token) {
      toast.error("Please log in to upload an avatar");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      // Use the secure avatar-storage Edge Function
      const formData = new FormData();
      formData.append('token', session.token);
      formData.append('action', 'upload');
      formData.append('file', file);

      const { data, error } = await supabase.functions.invoke("avatar-storage", {
        body: formData,
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        toast.error(data.error);
        return;
      }

      const newAvatarUrl = data.url;
      setAvatarUrl(newAvatarUrl);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase.functions.invoke("user-profile", {
        body: {
          action: "update",
          token: session.token,
          avatar_url: newAvatarUrl,
        },
      });

      if (updateError) {
        throw updateError;
      }

      toast.success("Avatar uploaded successfully");
    } catch (err) {
      console.error("Failed to upload avatar:", err);
      toast.error("Failed to upload avatar");
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveAvatar = async () => {
    if (!avatarUrl || !session?.token) return;

    setIsRemovingAvatar(true);
    try {
      // Extract file path from URL and delete via Edge Function
      const urlParts = avatarUrl.split("/avatars/");
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        
        const formData = new FormData();
        formData.append('token', session.token);
        formData.append('action', 'delete');
        formData.append('path', filePath);

        await supabase.functions.invoke("avatar-storage", {
          body: formData,
        });
      }

      const { error: updateError } = await supabase.functions.invoke("user-profile", {
        body: {
          action: "update",
          token: session.token,
          avatar_url: null,
        },
      });

      if (updateError) {
        throw updateError;
      }

      setAvatarUrl(null);
      toast.success("Avatar removed successfully");
    } catch (err) {
      console.error("Failed to remove avatar:", err);
      toast.error("Failed to remove avatar");
    } finally {
      setIsRemovingAvatar(false);
    }
  };

  const handleSave = async () => {
    try {
      profileSchema.parse({ display_name: displayName, bio });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }

    if (!session?.token) return;

    setIsSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke("user-profile", {
        body: {
          action: "update",
          token: session.token,
          display_name: displayName,
          bio,
          avatar_url: avatarUrl,
          theme_preference: themePreference,
          email_notifications: emailNotifications,
        },
      });

      if (error) {
        const status = (error as any)?.context?.status;
        if (status === 401) {
          toast.error("Your session expired. Please log in again.");
          await logout();
          navigate("/auth");
          return;
        }
        throw error;
      }

      setProfile(data.profile);
      toast.success("Settings saved successfully");
    } catch (err) {
      console.error("Failed to save profile:", err);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      passwordSchema.parse({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }

    if (!session?.token) return;

    setIsChangingPassword(true);
    try {
      const { data, error } = await supabase.functions.invoke("user-profile", {
        body: {
          action: "change-password",
          token: session.token,
          current_password: currentPassword,
          new_password: newPassword,
        },
      });

      if (error) {
        const status = (error as any)?.context?.status;
        if (status === 401) {
          toast.error("Your session expired. Please log in again.");
          await logout();
          navigate("/auth");
          return;
        }
        throw error;
      }

      if (data.error) {
        toast.error(data.error);
        return;
      }

      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("Failed to change password:", err);
      toast.error(err?.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error("Please enter your password to confirm deletion");
      return;
    }

    if (!session?.token) return;

    setIsDeletingAccount(true);
    try {
      const { data, error } = await supabase.functions.invoke("user-profile", {
        body: {
          action: "delete-account",
          token: session.token,
          password: deletePassword,
        },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        toast.error(data.error);
        return;
      }

      localStorage.removeItem("session_token");
      toast.success("Your account has been deleted");
      navigate("/");
    } catch (err: any) {
      console.error("Failed to delete account:", err);
      toast.error(err?.message || "Failed to delete account");
    } finally {
      setIsDeletingAccount(false);
      setDeletePassword("");
      setDeleteDialogOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (authLoading || isLoading) {
    return (
      <DashboardLayout hideFooter>
        <SEO title="Settings" description="Manage your account settings and preferences." />
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout hideFooter>
      <SEO
        title="Settings"
        description="Manage your account settings, profile, and preferences."
      />

      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-foreground">
              Settings
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your account settings and preferences
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:w-auto lg:inline-grid lg:grid-cols-4 gap-1 h-auto p-1">
              <TabsTrigger value="profile" className="gap-2 py-2.5">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="account" className="gap-2 py-2.5">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Account</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="gap-2 py-2.5">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Preferences</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2 py-2.5">
                <Key className="h-4 w-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="card-elevated p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Profile Information</h2>
                
                <div className="space-y-6">
                  {/* Avatar */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Profile Picture
                    </label>
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="h-24 w-24 rounded-full overflow-hidden bg-muted border-2 border-border">
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt="Profile"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-primary/10">
                              <User className="h-10 w-10 text-primary" />
                            </div>
                          )}
                        </div>
                        {isUploadingAvatar && (
                          <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                          id="avatar-upload"
                        />
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploadingAvatar || isRemovingAvatar}
                          >
                            {isUploadingAvatar ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4" />
                                Upload Photo
                              </>
                            )}
                          </Button>
                          {avatarUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleRemoveAvatar}
                              disabled={isUploadingAvatar || isRemovingAvatar}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              {isRemovingAvatar ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          JPG, PNG or GIF. Max 2MB.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Display Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your display name"
                      maxLength={100}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Bio
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us a bit about yourself"
                      maxLength={500}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {bio.length}/500 characters
                    </p>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-border">
                    <Button
                      variant="hero"
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save Profile
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Account Tab */}
            <TabsContent value="account" className="space-y-6">
              <div className="card-elevated p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Account Details</h2>
                
                <div className="space-y-4">
                  {/* Email */}
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email Address</p>
                      <p className="font-medium text-foreground">{userInfo?.email}</p>
                    </div>
                  </div>

                  {/* Member Since */}
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="font-medium text-foreground">
                        {userInfo?.created_at ? formatDate(userInfo.created_at) : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="card-elevated p-6 border-destructive/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Danger Zone</h2>
                    <p className="text-sm text-muted-foreground">
                      Irreversible account actions
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="font-medium text-foreground">Delete Account</p>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all associated data.
                      </p>
                    </div>
                    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                            Delete Account
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action is permanent and cannot be undone. All your data including vision boards, profile information, and settings will be permanently deleted.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="py-4">
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Enter your password to confirm
                          </label>
                          <div className="relative">
                            <input
                              type={showDeletePassword ? "text" : "password"}
                              value={deletePassword}
                              onChange={(e) => setDeletePassword(e.target.value)}
                              placeholder="Enter your password"
                              className="w-full px-4 py-3 pr-12 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => setShowDeletePassword(!showDeletePassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showDeletePassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => {
                            setDeletePassword("");
                            setShowDeletePassword(false);
                          }}>
                            Cancel
                          </AlertDialogCancel>
                          <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            disabled={isDeletingAccount || !deletePassword}
                          >
                            {isDeletingAccount ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              "Delete My Account"
                            )}
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <div className="card-elevated p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Appearance & Notifications</h2>
                
                <div className="space-y-6">
                  {/* Theme */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Theme
                    </label>
                    <div className="flex gap-2">
                      {["system", "light", "dark"].map((theme) => (
                        <button
                          key={theme}
                          onClick={() => setThemePreference(theme)}
                          className={`px-4 py-2.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                            themePreference === theme
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          }`}
                        >
                          {theme}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Email Notifications */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive updates and tips via email
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setEmailNotifications(!emailNotifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        emailNotifications ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          emailNotifications ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-border">
                    <Button
                      variant="hero"
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save Preferences
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <div className="card-elevated p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Change Password</h2>
                
                <div className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter your current password"
                        className="w-full px-4 py-3 pr-12 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter your new password"
                        className="w-full px-4 py-3 pr-12 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum 6 characters
                    </p>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your new password"
                        className="w-full px-4 py-3 pr-12 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      onClick={handlePasswordChange}
                      disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
                    >
                      {isChangingPassword ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Changing Password...
                        </>
                      ) : (
                        <>
                          <Key className="h-4 w-4" />
                          Change Password
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </DashboardLayout>
  );
}