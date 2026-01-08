"use client";

import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import {
  User,
  Bell,
  Shield,
  Palette,
  Mail,
  Save,
  Loader2,
  CheckCircle2,
  Moon,
  Sun,
  Monitor,
  Key,
} from "lucide-react";

interface NotificationSettings {
  weeklyDigest: boolean;
  newContent: boolean;
  questionsAnswered: boolean;
  kudosReceived: boolean;
  recertifications: boolean;
}

interface AppearanceSettings {
  theme: "dark" | "light" | "system";
  reducedMotion: boolean;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "appearance" | "security">("profile");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Profile state
  const [name, setName] = useState("Demo User");
  const [bio, setBio] = useState("Focused on technical recruiting for the engineering team. Always learning and improving my craft.");
  const [expertise, setExpertise] = useState<string[]>(["Technical Recruiting", "Sourcing", "Interview Coordination"]);
  const [newExpertise, setNewExpertise] = useState("");

  // Notification state
  const [notifications, setNotifications] = useState<NotificationSettings>({
    weeklyDigest: true,
    newContent: true,
    questionsAnswered: true,
    kudosReceived: true,
    recertifications: true,
  });

  // Appearance state
  const [appearance, setAppearance] = useState<AppearanceSettings>({
    theme: "dark",
    reducedMotion: false,
  });

  const user = { name: "Demo User", email: "demo@lumalabs.ai", role: "user" };

  async function handleSave() {
    setSaving(true);

    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setSaving(false);
    }
  }

  function addExpertise() {
    if (newExpertise.trim() && !expertise.includes(newExpertise.trim())) {
      setExpertise([...expertise, newExpertise.trim()]);
      setNewExpertise("");
    }
  }

  function removeExpertise(skill: string) {
    setExpertise(expertise.filter((e) => e !== skill));
  }

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
    { id: "appearance" as const, label: "Appearance", icon: Palette },
    { id: "security" as const, label: "Security", icon: Shield },
  ];

  return (
    <AppLayout user={user}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-playfair)" }}>
            Settings
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Manage your account and preferences
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-48 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="surface rounded-xl p-6">
                  <h2 className="font-semibold text-[var(--text-primary)] mb-4">Profile Information</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value="demo@lumalabs.ai"
                        disabled
                        className="input opacity-60 cursor-not-allowed"
                      />
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        Email is managed through Google OAuth
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Bio
                      </label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        className="input resize-none"
                        placeholder="Tell the team about yourself..."
                      />
                    </div>
                  </div>
                </div>

                <div className="surface rounded-xl p-6">
                  <h2 className="font-semibold text-[var(--text-primary)] mb-4">Expertise Areas</h2>
                  <p className="text-sm text-[var(--text-muted)] mb-4">
                    These help others find you when they need guidance
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {expertise.map((skill) => (
                      <span
                        key={skill}
                        className="badge flex items-center gap-1"
                      >
                        {skill}
                        <button
                          onClick={() => removeExpertise(skill)}
                          className="ml-1 hover:text-[var(--accent-danger)]"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newExpertise}
                      onChange={(e) => setNewExpertise(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addExpertise()}
                      placeholder="Add expertise area..."
                      className="input flex-1"
                    />
                    <button onClick={addExpertise} className="btn-secondary">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="surface rounded-xl p-6 animate-fade-in-up">
                <h2 className="font-semibold text-[var(--text-primary)] mb-4">Email Notifications</h2>

                <div className="space-y-4">
                  {[
                    { key: "weeklyDigest" as const, label: "Weekly Digest", description: "Summary of new content and your progress" },
                    { key: "newContent" as const, label: "New Content", description: "When new training materials are published" },
                    { key: "questionsAnswered" as const, label: "Questions Answered", description: "When someone answers your questions" },
                    { key: "kudosReceived" as const, label: "Kudos Received", description: "When you receive kudos from teammates" },
                    { key: "recertifications" as const, label: "Recertification Reminders", description: "When content you've completed needs review" },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-4 rounded-lg bg-[var(--bg-tertiary)]"
                    >
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">{item.label}</p>
                        <p className="text-sm text-[var(--text-muted)]">{item.description}</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                        className={`w-12 h-6 rounded-full transition-colors relative ${
                          notifications[item.key] ? "bg-[var(--accent-primary)]" : "bg-[var(--bg-elevated)]"
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                            notifications[item.key] ? "left-7" : "left-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === "appearance" && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="surface rounded-xl p-6">
                  <h2 className="font-semibold text-[var(--text-primary)] mb-4">Theme</h2>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "dark" as const, label: "Dark", icon: Moon },
                      { value: "light" as const, label: "Light", icon: Sun },
                      { value: "system" as const, label: "System", icon: Monitor },
                    ].map((theme) => (
                      <button
                        key={theme.value}
                        onClick={() => setAppearance({ ...appearance, theme: theme.value })}
                        className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all ${
                          appearance.theme === theme.value
                            ? "bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 text-[var(--accent-primary)]"
                            : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
                        }`}
                      >
                        <theme.icon className="w-6 h-6" />
                        <span className="font-medium">{theme.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="surface rounded-xl p-6">
                  <h2 className="font-semibold text-[var(--text-primary)] mb-4">Accessibility</h2>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--bg-tertiary)]">
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">Reduced Motion</p>
                      <p className="text-sm text-[var(--text-muted)]">Minimize animations throughout the app</p>
                    </div>
                    <button
                      onClick={() => setAppearance({ ...appearance, reducedMotion: !appearance.reducedMotion })}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        appearance.reducedMotion ? "bg-[var(--accent-primary)]" : "bg-[var(--bg-elevated)]"
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          appearance.reducedMotion ? "left-7" : "left-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="surface rounded-xl p-6">
                  <h2 className="font-semibold text-[var(--text-primary)] mb-4">Authentication</h2>

                  <div className="p-4 rounded-lg bg-[var(--bg-tertiary)] flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center">
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[var(--text-primary)]">Google Account</p>
                      <p className="text-sm text-[var(--text-muted)]">demo@lumalabs.ai</p>
                    </div>
                    <span className="badge-success flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Connected
                    </span>
                  </div>

                  <p className="text-sm text-[var(--text-muted)] mt-4">
                    Your account is secured with Google OAuth. Only @lumalabs.ai accounts can access this platform.
                  </p>
                </div>

                <div className="surface rounded-xl p-6">
                  <h2 className="font-semibold text-[var(--text-primary)] mb-4">Sessions</h2>

                  <div className="p-4 rounded-lg bg-[var(--bg-tertiary)]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Key className="w-5 h-5 text-[var(--accent-primary)]" />
                        <div>
                          <p className="font-medium text-[var(--text-primary)]">Current Session</p>
                          <p className="text-sm text-[var(--text-muted)]">Active now</p>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-[var(--accent-success)]/20 text-[var(--accent-success)]">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary flex items-center gap-2"
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : saved ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {saved ? "Saved!" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
