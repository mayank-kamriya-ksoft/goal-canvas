import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { SEO } from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const profileSchema = z.object({
  display_name: z.string().max(100, "Display name must be less than 100 characters").optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

interface Profile {
  user_id: string;
  display_name: string | null;
  bio: string | null;
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

  const [profile, setProfile] = useState<Profile | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [themePreference, setThemePreference] = useState("system");
  const [emailNotifications, setEmailNotifications] = useState(true);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (authLoading || isLoading) {
    return (
      <DashboardLayout>
        <SEO title="Settings" description="Manage your account settings and preferences." />
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <SEO
        title="Settings"
        description="Manage your account settings, profile, and preferences."
      />

      <section className="section-padding">
        <div className="container-wide max-w-3xl">
          <h1 className="text-3xl font-display font-bold text-foreground mb-8">
            Settings
          </h1>

          <div className="space-y-8">
            {/* Profile Section */}
            <div className="card-elevated p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Profile</h2>
                  <p className="text-sm text-muted-foreground">
                    Your personal information
                  </p>
                </div>
              </div>

              <div className="space-y-4">
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
              </div>
            </div>

            {/* Account Section */}
            <div className="card-elevated p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Account</h2>
                  <p className="text-sm text-muted-foreground">
                    Your account details
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{userInfo?.email}</p>
                  </div>
                </div>

                {/* Member Since */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Member since</p>
                    <p className="font-medium text-foreground">
                      {userInfo?.created_at ? formatDate(userInfo.created_at) : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="card-elevated p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <Palette className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Preferences</h2>
                  <p className="text-sm text-muted-foreground">
                    Customize your experience
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Theme */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Theme
                  </label>
                  <div className="flex gap-2">
                    {["system", "light", "dark"].map((theme) => (
                      <button
                        key={theme}
                        onClick={() => setThemePreference(theme)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
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
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
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
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                variant="hero"
                size="lg"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
