"use client";

import { useState, useSyncExternalStore, useEffect } from "react";
import { Video } from "@/data/videos";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  LogIn,
  ExternalLink,
  Settings,
  Film,
  Eye,
  LayoutDashboard,
  Link2,
  ChevronRight,
  Save,
  Check,
  Lock,
  Video as Youtube,
  Loader2,
  MessageSquare,
  Trash,
  Send,
  X,
} from "lucide-react";
import { portfolioStore, SiteSettings } from "@/lib/portfolioStore";
import { fetchChannelVideos } from "@/app/actions/youtube";
import { verifyAdminPassword } from "@/app/actions/auth";

/*  Small Design Tokens  */
const INPUT_CLS = "admin-input";
const LABEL_CLS = "admin-label";

/*  Sidebar NavItem  */
function NavItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "1rem 1.25rem",
        borderRadius: "1rem",
        fontSize: "0.85rem",
        fontWeight: 700,
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        background: active ? "white" : "transparent",
        color: active ? "black" : "rgba(255,255,255,0.4)",
        border: "none",
        cursor: "pointer",
        textAlign: "left",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.color = "white";
          e.currentTarget.style.background = "rgba(255,255,255,0.05)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.color = "rgba(255,255,255,0.4)";
          e.currentTarget.style.background = "transparent";
        }
      }}
    >
      <Icon size={18} />
      <span>{label}</span>
      {active && <ChevronRight size={16} style={{ marginLeft: "auto" }} />}
    </button>
  );
}

/*  Stat Card  */
function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "1.5rem",
        padding: "1.5rem 2rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
        <Icon size={16} style={{ color: "var(--accent)" }} />
      </div>
      <span
        style={{
          fontSize: "2.5rem",
          fontWeight: 900,
          lineHeight: 1,
          fontFamily: "Syne, sans-serif",
        }}
      >
        {value}
      </span>
    </div>
  );
}

/*  Video Row  */
function VideoRow({
  video,
  onDelete,
  onToggleType,
}: {
  video: Video;
  onDelete: () => void;
  onToggleType: () => void;
}) {
  const [confirm, setConfirm] = useState(false);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1.25rem",
        padding: "1.25rem",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "1.5rem",
        transition: "border-color 0.3s",
      }}
    >
      <div
        style={{
          width: "80px",
          aspectRatio: "16/9",
          flexShrink: 0,
          borderRadius: "0.75rem",
          overflow: "hidden",
          background: "#111",
        }}
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div style={{ flexGrow: 1, minWidth: 0 }}>
        <p
          style={{
            fontWeight: 700,
            fontSize: "0.9rem",
            marginBottom: "0.3rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {video.title}
        </p>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <span
            style={{
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "0.25rem 0.75rem",
              background: "rgba(59,130,246,0.15)",
              color: "var(--accent)",
              borderRadius: "100px",
            }}
          >
            {video.category}
          </span>
          <span
            style={{
              fontSize: "0.7rem",
              color: "rgba(255,255,255,0.3)",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            <Link2 size={10} /> {video.youtubeId}
          </span>
        </div>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
        <a
          href={`https://youtube.com/watch?v=${video.youtubeId}`}
          target="_blank"
          rel="noreferrer"
          style={{
            padding: "0.6rem",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "0.75rem",
            color: "rgba(255,255,255,0.4)",
            display: "flex",
          }}
        >
          <ExternalLink size={14} />
        </a>
        {confirm ? (
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button
              onClick={onDelete}
              style={{
                padding: "0.6rem",
                background: "rgba(239,68,68,0.9)",
                borderRadius: "0.75rem",
                color: "white",
                display: "flex",
              }}
            >
              <Check size={14} />
            </button>
            <button
              onClick={() => setConfirm(false)}
              style={{
                padding: "0.6rem",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "0.75rem",
                color: "rgba(255,255,255,0.4)",
                display: "flex",
              }}
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirm(true)}
            style={{
              padding: "0.6rem",
              background: "rgba(239,68,68,0.1)",
              borderRadius: "0.75rem",
              color: "rgba(239,68,68,0.7)",
              display: "flex",
            }}
          >
            <Trash2 size={14} />
          </button>
        )}
        <button
          onClick={onToggleType}
          style={{
            padding: "0.6rem 1rem",
            background:
              video.type === "short"
                ? "rgba(168,85,247,0.15)"
                : "rgba(255,255,255,0.05)",
            borderRadius: "0.75rem",
            color: video.type === "short" ? "#d8b4fe" : "rgba(255,255,255,0.4)",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.65rem",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          {video.type === "short" ? "Vertical Short" : "Main Video"}
        </button>
      </div>
    </motion.div>
  );
}

/*  Main Component  */
export default function AdminPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (sessionStorage.getItem("admin-auth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const [activeTab, setActiveTab] = useState<
    "overview" | "videos" | "settings" | "messages"
  >("overview");
  const [password, setPassword] = useState("");
  const [saved, setSaved] = useState(false);

  const { videos, settings, conversations } = useSyncExternalStore(
    portfolioStore.subscribe,
    portfolioStore.getSnapshot,
    portfolioStore.getServerSnapshot,
  );

  const [newVideo, setNewVideo] = useState<Partial<Video>>({
    title: "",
    category: "Commercial",
    youtubeId: "",
    thumbnail: "",
    type: "video",
  });
  const [editSettings, setEditSettings] = useState<SiteSettings>(settings);
  const [channelId, setChannelId] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [importMessage, setImportMessage] = useState("");
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (base64: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (max 2MB for Base64 efficiency)
    if (file.size > 2 * 1024 * 1024) {
      alert("Image too large. Please upload an image under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const result = await verifyAdminPassword(password);
      if (result.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem("admin-auth", "true");
      } else {
        alert(result.error);
      }
    } catch {
      alert("Verification failed. Please check your connection.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin-auth");
  };

  const addVideo = () => {
    if (!newVideo.title || !newVideo.youtubeId) return;
    const video: Video = {
      id: Date.now().toString(),
      title: newVideo.title,
      category: newVideo.category || "Commercial",
      youtubeId: newVideo.youtubeId,
      thumbnail:
        newVideo.thumbnail ||
        `https://img.youtube.com/vi/${newVideo.youtubeId}/maxresdefault.jpg`,
      type: newVideo.type || "video",
    };
    portfolioStore.updateVideos([...videos, video]);
    setNewVideo({
      title: "",
      category: "Commercial",
      youtubeId: "",
      thumbnail: "",
      type: "video",
    });
  };

  const handleChannelImport = async () => {
    if (!channelId) return;
    setIsImporting(true);
    setImportMessage("");

    try {
      const result = await fetchChannelVideos(channelId.trim());
      if (result.success && result.videos && result.videos.length > 0) {
        // filter out videos already in store by youtubeId to avoid duplicates
        const existingIds = videos.map((v) => v.youtubeId);
        const newVids = result.videos.filter(
          (v: { youtubeId: string }) => !existingIds.includes(v.youtubeId),
        );

        if (newVids.length > 0) {
          portfolioStore.updateVideos([...videos, ...newVids]);
          setImportMessage(`Success! Imported ${newVids.length} videos.`);
          setChannelId("");
        } else {
          setImportMessage("No new videos found (or already imported).");
        }
      } else {
        setImportMessage(result.error || "Failed to parse any videos.");
      }
    } catch (e: unknown) {
      setImportMessage((e as Error).message || "An error occurred.");
    } finally {
      setIsImporting(false);
      setTimeout(() => setImportMessage(""), 5000);
    }
  };

  const handleDeleteAll = () => {
    portfolioStore.updateVideos([]);
    setConfirmDeleteAll(false);
  };

  const handleSaveSettings = () => {
    portfolioStore.updateSettings(editSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!isMounted) return null;

  /*  Login Screen  */
  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000",
          padding: "2rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: "100%", maxWidth: "420px" }}
        >
          {/* Branding */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "1.25rem",
                background: "rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
                color: "var(--accent)",
              }}
            >
              <Lock size={28} />
            </div>
            <h1
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "1.75rem",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                marginBottom: "0.5rem",
              }}
            >
              Admin Panel
            </h1>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.85rem" }}>
              Enter your password to access the dashboard
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleLogin}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <input
              type="password"
              placeholder="••••••••••••"
              className={INPUT_CLS}
              style={{
                fontSize: "1.2rem",
                letterSpacing: "0.3em",
                textAlign: "center",
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              style={{
                background: "white",
                color: "black",
                padding: "1.1rem",
                borderRadius: "1rem",
                fontWeight: 900,
                fontSize: "0.8rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                cursor: "pointer",
                border: "none",
                fontFamily: "Syne, sans-serif",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.6rem",
                }}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Verifying...
                  </>
                ) : (
                  <>
                    <LogIn size={16} /> Unlock Dashboard
                  </>
                )}
              </span>
            </motion.button>
          </form>
          <p
            style={{
              textAlign: "center",
              marginTop: "2rem",
              fontSize: "0.7rem",
              color: "rgba(255,255,255,0.1)",
            }}
          >
            Please enter your administrator credentials
          </p>
        </motion.div>
      </div>
    );
  }

  /*  Dashboard  */
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#050505" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "280px",
          flexShrink: 0,
          padding: "2.5rem 1.5rem",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <div style={{ marginBottom: "3rem", paddingLeft: "1rem" }}>
          <p
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 900,
              fontSize: "1.2rem",
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
            }}
          >
            {settings.siteName}
            <span style={{ color: "var(--accent)" }}>.</span>
          </p>
          <p
            style={{
              fontSize: "0.65rem",
              color: "rgba(255,255,255,0.25)",
              marginTop: "0.25rem",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
            }}
          >
            Admin Portal
          </p>
        </div>

        <NavItem
          icon={LayoutDashboard}
          label="Overview"
          active={activeTab === "overview"}
          onClick={() => setActiveTab("overview")}
        />
        <NavItem
          icon={MessageSquare}
          label="Inbox"
          active={activeTab === "messages"}
          onClick={() => setActiveTab("messages")}
        />
        <NavItem
          icon={Film}
          label="Videos"
          active={activeTab === "videos"}
          onClick={() => setActiveTab("videos")}
        />
        <NavItem
          icon={Settings}
          label="Site Settings"
          active={activeTab === "settings"}
          onClick={() => setActiveTab("settings")}
        />

        <div style={{ marginTop: "auto" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              textAlign: "left",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "rgba(255,255,255,0.2)",
              background: "none",
              border: "none",
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "rgba(239,68,68,0.7)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(255,255,255,0.2)")
            }
          >
            Logout →
          </button>

          <div
            style={{
              marginTop: "1rem",
              padding: "0 1rem",
              fontSize: "10px",
              color: "rgba(255,255,255,0.15)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              lineHeight: "1.4",
            }}
          >
            © {new Date().getFullYear()} All rights reserved.
            <br />
            Made by Sulabh (aka Swikrit)
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: "auto", padding: "3rem" }}>
        <AnimatePresence mode="wait">
          {/*  OVERVIEW TAB  */}
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <h1
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: "2.5rem",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  marginBottom: "0.5rem",
                }}
              >
                Good evening 👋
              </h1>
              <p
                style={{ color: "rgba(255,255,255,0.3)", marginBottom: "3rem" }}
              >
                Here&apos;s what&apos;s happening with your portfolio.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "1.25rem",
                  marginBottom: "3rem",
                }}
              >
                <StatCard
                  label="Total Videos"
                  value={videos.length}
                  icon={Film}
                />
                <StatCard
                  label="Showreel ID"
                  value={settings.showreelId || "—"}
                  icon={Link2}
                />
                <StatCard
                  label="Unread Messages"
                  value={conversations.filter(c => c.status === 'new').length}
                  icon={MessageSquare}
                />
                <StatCard
                  label="Contact"
                  value={settings.contactEmail || "—"}
                  icon={Eye}
                />
              </div>

              {/* Quick Actions */}
              <h2
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  color: "rgba(255,255,255,0.3)",
                  textTransform: "uppercase",
                  marginBottom: "1.25rem",
                }}
              >
                Quick Actions
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                {[
                  {
                    label: "Manage Videos",
                    desc: "Add or remove portfolio work",
                    tab: "videos" as const,
                    icon: Film,
                  },
                  {
                    label: "Edit Site Copy",
                    desc: "Update hero text & contact info",
                    tab: "settings" as const,
                    icon: Settings,
                  },
                ].map(({ label, desc, tab, icon: Icon }) => (
                  <motion.button
                    key={tab}
                    whileHover={{
                      scale: 1.02,
                      borderColor: "rgba(255,255,255,0.2)",
                    }}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      textAlign: "left",
                      padding: "1.5rem",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "1.5rem",
                      cursor: "pointer",
                      color: "white",
                      transition: "all 0.3s",
                    }}
                  >
                    <Icon
                      size={20}
                      style={{
                        color: "var(--accent)",
                        marginBottom: "0.75rem",
                      }}
                    />
                    <p
                      style={{
                        fontWeight: 800,
                        fontSize: "0.9rem",
                        marginBottom: "0.3rem",
                      }}
                    >
                      {label}
                    </p>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "rgba(255,255,255,0.3)",
                      }}
                    >
                      {desc}
                    </p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/*  VIDEOS TAB  */}
          {activeTab === "videos" && (
            <motion.div
              key="videos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "2.5rem",
                }}
              >
                <div>
                  <h1
                    style={{
                      fontFamily: "Syne, sans-serif",
                      fontSize: "1.75rem",
                      fontWeight: 900,
                      letterSpacing: "-0.02em",
                      marginBottom: "0.3rem",
                    }}
                  >
                    Video Library
                  </h1>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.4)",
                      fontSize: "0.9rem",
                    }}
                  >
                    {videos.length} projects in your portfolio
                  </p>
                </div>
                {videos.length > 0 &&
                  (confirmDeleteAll ? (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={handleDeleteAll}
                        style={{
                          padding: "0.6rem 1.25rem",
                          background: "rgba(239,68,68,0.9)",
                          color: "white",
                          borderRadius: "100px",
                          fontWeight: 800,
                          fontSize: "0.7rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          cursor: "pointer",
                          border: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <Check size={14} /> YES, WIPE GALLERY
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setConfirmDeleteAll(false)}
                        style={{
                          padding: "0.6rem 1.25rem",
                          background: "rgba(255,255,255,0.05)",
                          color: "rgba(255,255,255,0.6)",
                          borderRadius: "100px",
                          fontWeight: 800,
                          fontSize: "0.7rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          cursor: "pointer",
                          border: "1px solid rgba(255,255,255,0.1)",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <X size={14} /> CANCEL
                      </motion.button>
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setConfirmDeleteAll(true)}
                      style={{
                        padding: "0.6rem 1.25rem",
                        background: "rgba(239,68,68,0.1)",
                        color: "rgba(239,68,68,1)",
                        borderRadius: "100px",
                        fontWeight: 800,
                        fontSize: "0.7rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        border: "1px solid rgba(239,68,68,0.3)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <Trash2 size={14} /> DELETE ALL
                    </motion.button>
                  ))}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) 380px",
                  gap: "2.5rem",
                  alignItems: "start",
                }}
              >
                {/* Video List */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    maxHeight: "calc(100vh - 150px)",
                    overflowY: "auto",
                    paddingRight: "1rem",
                  }}
                  className="admin-scroll"
                  data-lenis-prevent
                >
                  <AnimatePresence>
                    {videos.map((video) => (
                      <VideoRow
                        key={video.id}
                        video={video}
                        onDelete={() =>
                          portfolioStore.updateVideos(
                            videos.filter((v) => v.id !== video.id),
                          )
                        }
                        onToggleType={() => {
                          const updated = videos.map((v) =>
                            v.id === video.id
                              ? {
                                  ...v,
                                  type:
                                    v.type === "short"
                                      ? "video"
                                      : ("short" as any),
                                }
                              : v,
                          );
                          portfolioStore.updateVideos(updated);
                        }}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Add Panel */}
                <div
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "2rem",
                    padding: "2rem",
                    position: "sticky",
                    top: "2rem",
                  }}
                >
                  <h2
                    style={{
                      fontWeight: 800,
                      fontSize: "1rem",
                      marginBottom: "1.5rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Plus size={16} style={{ color: "var(--accent)" }} /> Add
                    New Project
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <label className={LABEL_CLS}>Project Title</label>
                      <input
                        className={INPUT_CLS}
                        placeholder="My Cinematic Reel"
                        value={newVideo.title}
                        onChange={(e) =>
                          setNewVideo({ ...newVideo, title: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className={LABEL_CLS}>Category</label>
                      <select
                        className={INPUT_CLS}
                        value={newVideo.category}
                        onChange={(e) =>
                          setNewVideo({ ...newVideo, category: e.target.value })
                        }
                        style={{ appearance: "none" }}
                      >
                        <option value="Commercial">Commercial</option>
                        <option value="Narrative">Narrative</option>
                        <option value="Music Video">Music Video</option>
                        <option value="Sport">Sport</option>
                        <option value="Documentary">Documentary</option>
                      </select>
                    </div>
                    <div>
                      <label className={LABEL_CLS}>Video Format Type</label>
                      <select
                        className={INPUT_CLS}
                        value={newVideo.type || "video"}
                        onChange={(e) =>
                          setNewVideo({
                            ...newVideo,
                            type: e.target.value as "video" | "short",
                          })
                        }
                        style={{ appearance: "none" }}
                      >
                        <option value="video">Main Cinematic (16:9)</option>
                        <option value="short">
                          Vertical Reel / Short (9:16)
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className={LABEL_CLS}>YouTube Video ID</label>
                      <input
                        className={INPUT_CLS}
                        placeholder="dQw4w9WgXcQ"
                        value={newVideo.youtubeId}
                        onChange={(e) =>
                          setNewVideo({
                            ...newVideo,
                            youtubeId: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className={LABEL_CLS}>Thumbnail (Upload Image or URL)</label>
                      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                         <input
                           type="file"
                           accept="image/*"
                           onChange={(e) => handleImageUpload(e, (b) => setNewVideo({ ...newVideo, thumbnail: b }))}
                           style={{ display: "none" }}
                           id="upload-thumb"
                         />
                         <label 
                           htmlFor="upload-thumb" 
                           className="btn-luxury" 
                           style={{ 
                             padding: "0.6rem 1.5rem", 
                             fontSize: "0.75rem", 
                             background: "white", 
                             color: "black",
                             cursor: "pointer",
                             borderRadius: "100px",
                             fontWeight: 800
                           }}
                         >
                           CHOOSE THUMBNAIL
                         </label>
                         {newVideo.thumbnail && (
                           <div style={{ width: "60px", height: "34px", borderRadius: "4px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                             <img src={newVideo.thumbnail} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                           </div>
                         )}
                      </div>
                      {newVideo.thumbnail && (
                        <div style={{ marginTop: "1rem", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", aspectRatio: "16/9" }}>
                           <img src={newVideo.thumbnail} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={addVideo}
                      disabled={!newVideo.title || !newVideo.youtubeId}
                      style={{
                        width: "100%",
                        padding: "1rem",
                        background: "white",
                        color: "black",
                        borderRadius: "1rem",
                        fontWeight: 900,
                        fontSize: "0.75rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        border: "none",
                        opacity:
                          !newVideo.title || !newVideo.youtubeId ? 0.3 : 1,
                        transition: "opacity 0.2s",
                      }}
                    >
                      Add to Portfolio
                    </motion.button>
                  </div>

                  {/* Channel Import Segment */}
                  <div
                    style={{
                      marginTop: "3rem",
                      paddingTop: "2rem",
                      borderTop: "1px dashed rgba(255,255,255,0.08)",
                    }}
                  >
                    <h2
                      style={{
                        fontWeight: 800,
                        fontSize: "0.85rem",
                        marginBottom: "1.5rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <Youtube size={16} style={{ color: "var(--accent)" }} />{" "}
                      Auto-Import Channel
                    </h2>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                      }}
                    >
                      <div>
                        <label className={LABEL_CLS}>YouTube Channel ID</label>
                        <input
                          className={INPUT_CLS}
                          placeholder="UCF..."
                          value={channelId}
                          onChange={(e) => setChannelId(e.target.value)}
                        />
                        <p
                          style={{
                            fontSize: "0.6rem",
                            color: "rgba(255,255,255,0.3)",
                            marginTop: "0.5rem",
                          }}
                        >
                          Imports the latest 15 videos automatically directly
                          from YouTube RSS.
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleChannelImport}
                        disabled={!channelId || isImporting}
                        style={{
                          width: "100%",
                          padding: "0.8rem",
                          background: "transparent",
                          color: "var(--accent)",
                          borderRadius: "1rem",
                          fontWeight: 800,
                          fontSize: "0.7rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          cursor: "pointer",
                          border: "1px solid var(--accent)",
                          opacity: !channelId || isImporting ? 0.3 : 1,
                          transition: "opacity 0.2s",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        {isImporting ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />{" "}
                            Fetching...
                          </>
                        ) : (
                          "Import Latest Videos"
                        )}
                      </motion.button>

                      {importMessage && (
                        <p
                          style={{
                            fontSize: "0.65rem",
                            color: importMessage.includes("Success")
                              ? "#4ade80"
                              : "#f87171",
                            textAlign: "center",
                            marginTop: "0.5rem",
                          }}
                        >
                          {importMessage}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/*  SETTINGS TAB  */}
          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <h1
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: "2rem",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  marginBottom: "0.3rem",
                }}
              >
                Site Settings
              </h1>
              <p
                style={{
                  color: "rgba(255,255,255,0.3)",
                  fontSize: "0.85rem",
                  marginBottom: "3rem",
                }}
              >
                All changes reflect live on the portfolio page.
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "3rem",
                  maxWidth: "800px",
                }}
              >
                {/* Hero Copy */}
                <section
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    padding: "2rem",
                    borderRadius: "1.5rem",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: "0.2em",
                      color: "rgba(255,255,255,0.3)",
                      textTransform: "uppercase",
                      marginBottom: "1.5rem",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      paddingBottom: "1rem",
                    }}
                  >
                    Site & Hero Meta
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1.25rem",
                    }}
                  >
                    {[
                      { key: "siteName", label: "Global Brand Name" },
                      { key: "heroTagline", label: "Top Tagline" },
                      { key: "heroLine1", label: "Heading Line 1 (Gradient)" },
                      { key: "heroLine2", label: "Heading Line 2" },
                      { key: "heroLine3", label: "Heading Line 3" },
                    ].map(({ key, label }) => (
                      <div key={key}>
                        <label className={LABEL_CLS}>{label}</label>
                        <input
                          className={INPUT_CLS}
                          value={editSettings[key as keyof SiteSettings]}
                          onChange={(e) =>
                            setEditSettings({
                              ...editSettings,
                              [key]: e.target.value,
                            })
                          }
                        />
                      </div>
                    ))}
                    <div>
                      <label className={LABEL_CLS}>
                        Hero &quot;Watch Showreel&quot; YouTube IDs (Comma-separated for
                        multiple!)
                      </label>
                      <input
                        className={INPUT_CLS}
                        placeholder="dQw4w9WgXcQ, vdQxw82..."
                        value={editSettings.showreelId}
                        onChange={(e) =>
                          setEditSettings({
                            ...editSettings,
                            showreelId: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className={LABEL_CLS}>Description</label>
                      <textarea
                        rows={4}
                        className={INPUT_CLS}
                        style={{ resize: "none" }}
                        value={editSettings.heroDescription}
                        onChange={(e) =>
                          setEditSettings({
                            ...editSettings,
                            heroDescription: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </section>

                {/* Contact & Showreel */}
                <section
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    padding: "2rem",
                    borderRadius: "1.5rem",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: "0.2em",
                      color: "rgba(255,255,255,0.3)",
                      textTransform: "uppercase",
                      marginBottom: "1.5rem",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      paddingBottom: "1rem",
                    }}
                  >
                    Contact & Media
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1.25rem",
                    }}
                  >
                    <div>
                      <label className={LABEL_CLS}>Contact Email</label>
                      <input
                        className={INPUT_CLS}
                        value={editSettings.contactEmail}
                        onChange={(e) =>
                          setEditSettings({
                            ...editSettings,
                            contactEmail: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className={LABEL_CLS}>About Text</label>
                      <textarea
                        rows={5}
                        className={INPUT_CLS}
                        style={{ resize: "vertical", minHeight: "120px" }}
                        value={editSettings.aboutText}
                        onChange={(e) =>
                          setEditSettings({
                            ...editSettings,
                            aboutText: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className={LABEL_CLS}>Professional Profile Picture (Avatar)</label>
                      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                         <input
                           type="file"
                           accept="image/*"
                           onChange={(e) => handleImageUpload(e, (b) => setEditSettings({ ...editSettings, avatarUrl: b }))}
                           style={{ display: "none" }}
                           id="upload-avatar"
                         />
                         <label htmlFor="upload-avatar" className="btn-luxury" style={{ padding: "0.6rem 1rem", fontSize: "0.7rem", background: "rgba(255,255,255,0.05)", cursor: "pointer", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.1)" }}>UPLOAD PHOTO</label>
                         {editSettings.avatarUrl && (
                           <div style={{ width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                             <img src={editSettings.avatarUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                           </div>
                         )}
                      </div>
                    </div>

                    <div>
                      <label className={LABEL_CLS}>About Background Image</label>
                      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                         <input
                           type="file"
                           accept="image/*"
                           onChange={(e) => handleImageUpload(e, (b) => setEditSettings({ ...editSettings, aboutBgImage: b }))}
                           style={{ display: "none" }}
                           id="upload-about-bg"
                         />
                         <label htmlFor="upload-about-bg" className="btn-luxury" style={{ padding: "0.6rem 1rem", fontSize: "0.7rem", background: "rgba(255,255,255,0.05)", cursor: "pointer", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.1)" }}>UPLOAD BACKGROUND</label>
                         {editSettings.aboutBgImage && (
                           <div style={{ width: "60px", height: "34px", borderRadius: "4px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                             <img src={editSettings.aboutBgImage} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                           </div>
                         )}
                      </div>
                    </div>

                    <div>
                      <label className={LABEL_CLS}>Site Favicon (Tab Icon)</label>
                      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                         <input
                           type="file"
                           accept="image/*"
                           onChange={(e) => handleImageUpload(e, (b) => setEditSettings({ ...editSettings, faviconUrl: b }))}
                           style={{ display: "none" }}
                           id="upload-favicon"
                         />
                         <label htmlFor="upload-favicon" className="btn-luxury" style={{ padding: "0.6rem 1rem", fontSize: "0.7rem", background: "rgba(255,255,255,0.05)", cursor: "pointer", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.1)" }}>UPLOAD ICON</label>
                         {editSettings.faviconUrl && (
                           <div style={{ width: "32px", height: "32px", borderRadius: "4px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                             <img src={editSettings.faviconUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                           </div>
                         )}
                      </div>
                    </div>

                    {/* Social Media */}
                    <div style={{ marginTop: "1rem" }}>
                      <h3
                        style={{
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          letterSpacing: "0.15em",
                          color: "rgba(255,255,255,0.4)",
                          textTransform: "uppercase",
                          marginBottom: "1rem",
                        }}
                      >
                        Social Links
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "1rem",
                        }}
                      >
                        <div>
                          <label className={LABEL_CLS}>Instagram URL</label>
                          <input
                            className={INPUT_CLS}
                            placeholder="https://instagram.com/..."
                            value={editSettings.instagram || ""}
                            onChange={(e) =>
                              setEditSettings({
                                ...editSettings,
                                instagram: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className={LABEL_CLS}>LinkedIn URL</label>
                          <input
                            className={INPUT_CLS}
                            placeholder="https://linkedin.com/in/..."
                            value={editSettings.linkedin || ""}
                            onChange={(e) =>
                              setEditSettings({
                                ...editSettings,
                                linkedin: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className={LABEL_CLS}>YouTube URL</label>
                          <input
                            className={INPUT_CLS}
                            placeholder="https://youtube.com/..."
                            value={editSettings.youtube || ""}
                            onChange={(e) =>
                              setEditSettings({
                                ...editSettings,
                                youtube: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Preloader Settings */}
                    <div style={{ marginTop: "1rem" }}>
                      <h3
                        style={{
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          letterSpacing: "0.15em",
                          color: "rgba(255,255,255,0.4)",
                          textTransform: "uppercase",
                          marginBottom: "1rem",
                        }}
                      >
                        Preloader Settings
                      </h3>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "1.5rem",
                        }}
                      >
                        <div>
                          <label className={LABEL_CLS}>Brand Name (Characters animated)</label>
                          <input
                            className={INPUT_CLS}
                            placeholder="BINAYA CINEMATICS"
                            value={editSettings.preloaderText || ""}
                            onChange={(e) =>
                              setEditSettings({
                                ...editSettings,
                                preloaderText: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className={LABEL_CLS}>Subtext (Initialization label)</label>
                          <input
                            className={INPUT_CLS}
                            placeholder="ESTABLISHING SHOT"
                            value={editSettings.preloaderSubtext || ""}
                            onChange={(e) =>
                              setEditSettings({
                                ...editSettings,
                                preloaderSubtext: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Footer Copy */}
                    <div style={{ marginTop: "1rem" }}>
                      <h3
                        style={{
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          letterSpacing: "0.15em",
                          color: "rgba(255,255,255,0.4)",
                          textTransform: "uppercase",
                          marginBottom: "1rem",
                        }}
                      >
                        Footer Strings
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "1rem",
                        }}
                      >
                        <div>
                          <label className={LABEL_CLS}>Footer Headline 1</label>
                          <input
                            className={INPUT_CLS}
                            value={editSettings.footerLine1 || ""}
                            onChange={(e) =>
                              setEditSettings({
                                ...editSettings,
                                footerLine1: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className={LABEL_CLS}>
                            Footer Headline 2 (Accent)
                          </label>
                          <input
                            className={INPUT_CLS}
                            value={editSettings.footerLine2 || ""}
                            onChange={(e) =>
                              setEditSettings({
                                ...editSettings,
                                footerLine2: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className={LABEL_CLS}>
                            Copyright Bottom Text
                          </label>
                          <input
                            className={INPUT_CLS}
                            value={editSettings.copyrightText || ""}
                            onChange={(e) =>
                              setEditSettings({
                                ...editSettings,
                                copyrightText: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSaveSettings}
                    style={{
                      marginTop: "2rem",
                      padding: "1rem 2rem",
                      background: saved
                        ? "rgba(34,197,94,0.15)"
                        : "rgba(59,130,246,0.9)",
                      border: saved ? "1px solid rgba(34,197,94,0.4)" : "none",
                      color: saved ? "rgb(134,239,172)" : "white",
                      borderRadius: "1rem",
                      fontWeight: 900,
                      fontSize: "0.75rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      transition: "all 0.4s",
                    }}
                  >
                    {saved ? (
                      <>
                        <Check size={16} /> Saved!
                      </>
                    ) : (
                      <>
                        <Save size={16} /> Save Changes
                      </>
                    )}
                  </motion.button>
                </section>
              </div>
            </motion.div>
          )}

          {/* MESSAGES TAB */}
          {activeTab === "messages" && (
            <motion.div
              key="messages"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              style={{
                display: "flex",
                gap: "2rem",
                height: "calc(100vh - 120px)",
              }}
            >
              {/* Left Pane - List */}
              <div
                style={{
                  width: "350px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  borderRight: "1px solid rgba(255,255,255,0.05)",
                  paddingRight: "1.5rem",
                }}
              >
                <h1
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontSize: "1.75rem",
                    fontWeight: 900,
                    letterSpacing: "-0.02em",
                    marginBottom: "1rem",
                  }}
                >
                  Inbox
                </h1>
                <div
                  style={{ flex: 1, overflowY: "auto" }}
                  className="admin-scroll"
                >
                  {conversations.length === 0 ? (
                    <p
                      style={{
                        color: "rgba(255,255,255,0.3)",
                        fontSize: "0.85rem",
                        marginTop: "2rem",
                        textAlign: "center",
                      }}
                    >
                      No conversations yet.
                    </p>
                  ) : (
                    conversations.map((conv) => (
                      <div
                        key={conv.id}
                        onClick={() => setSelectedConvId(conv.id)}
                        style={{
                          padding: "1rem",
                          background:
                            selectedConvId === conv.id
                              ? "rgba(59,130,246,0.1)"
                              : "rgba(255,255,255,0.02)",
                          border: `1px solid ${selectedConvId === conv.id ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.05)"}`,
                          borderRadius: "1rem",
                          marginBottom: "0.75rem",
                          cursor: "pointer",
                          transition: "0.2s",
                        }}
                      >
                        <h4
                          style={{
                            fontWeight: 800,
                            fontSize: "0.9rem",
                            marginBottom: "0.2rem",
                            color: "white",
                          }}
                        >
                          {conv.visitorName}
                        </h4>
                        <p
                          style={{
                            fontSize: "0.7rem",
                            color: "rgba(255,255,255,0.4)",
                            marginBottom: "0.5rem",
                          }}
                        >
                          {conv.visitorEmail}
                        </p>
                        <p
                          style={{
                            fontSize: "0.75rem",
                            color: "rgba(255,255,255,0.6)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {conv.messages[conv.messages.length - 1]?.text}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Pane - Chat View */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  background: "rgba(255,255,255,0.01)",
                  borderRadius: "1.5rem",
                  border: "1px solid rgba(255,255,255,0.04)",
                  overflow: "hidden",
                }}
              >
                {(() => {
                  const activeConv = conversations.find(
                    (c) => c.id === selectedConvId,
                  );
                  if (!activeConv) {
                    return (
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "rgba(255,255,255,0.2)",
                          fontSize: "0.9rem",
                        }}
                      >
                        Select a conversation to view
                      </div>
                    );
                  }

                  return (
                    <>
                      <div
                        style={{
                          padding: "1.5rem",
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <h2
                            style={{
                              fontWeight: 800,
                              fontSize: "1.2rem",
                              marginBottom: "0.2rem",
                            }}
                          >
                            {activeConv.visitorName}
                          </h2>
                          <a
                            href={`mailto:${activeConv.visitorEmail}`}
                            style={{
                              color: "var(--accent)",
                              fontSize: "0.8rem",
                            }}
                          >
                            {activeConv.visitorEmail}
                          </a>
                        </div>
                        <button
                          onClick={() => {
                            portfolioStore.updateConversations(
                              conversations.filter(
                                (c) => c.id !== activeConv.id,
                              ),
                            );
                            setSelectedConvId(null);
                          }}
                          style={{
                            padding: "0.6rem 1rem",
                            background: "rgba(239,68,68,0.1)",
                            color: "rgba(239,68,68,0.8)",
                            border: "none",
                            borderRadius: "0.5rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            fontSize: "0.75rem",
                            fontWeight: 800,
                          }}
                        >
                          <Trash size={14} /> Delete Chat
                        </button>
                      </div>
                      <div
                        style={{
                          flex: 1,
                          overflowY: "auto",
                          padding: "2rem",
                          display: "flex",
                          flexDirection: "column",
                          gap: "1.5rem",
                        }}
                        className="admin-scroll"
                      >
                        {activeConv.messages.map((msg) => (
                          <div
                            key={msg.id}
                            style={{
                              alignSelf:
                                msg.sender === "visitor"
                                  ? "flex-start"
                                  : "flex-end",
                              maxWidth: "70%",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "0.65rem",
                                color: "rgba(255,255,255,0.3)",
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                marginBottom: "0.4rem",
                                display: "block",
                                textAlign:
                                  msg.sender === "visitor" ? "left" : "right",
                              }}
                            >
                              {msg.sender === "visitor"
                                ? activeConv.visitorName
                                : "Automated Bot"}
                            </span>
                            <div
                              style={{
                                background:
                                  msg.sender === "visitor"
                                    ? "rgba(255,255,255,0.05)"
                                    : "rgba(59,130,246,0.15)",
                                border: `1px solid ${msg.sender === "visitor" ? "rgba(255,255,255,0.1)" : "rgba(59,130,246,0.2)"}`,
                                color:
                                  msg.sender === "visitor"
                                    ? "white"
                                    : "#93c5fd",
                                padding: "1rem",
                                borderRadius: "1rem",
                                lineHeight: 1.5,
                                fontSize: "0.9rem",
                              }}
                            >
                              {msg.text}
                            </div>
                            <span
                              style={{
                                fontSize: "0.6rem",
                                color: "rgba(255,255,255,0.2)",
                                marginTop: "0.4rem",
                                display: "block",
                                textAlign:
                                  msg.sender === "visitor" ? "left" : "right",
                              }}
                            >
                              {new Date(msg.timestamp).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!replyText.trim()) return;

                          const newMsg = {
                            id: `msg-${Math.floor(Math.random() * 1000000)}`,
                            sender: "bot" as const,
                            text: replyText.trim(),
                            timestamp: new Date().toISOString(),
                          };

                          const updatedConv = {
                            ...activeConv,
                            messages: [...activeConv.messages, newMsg],
                            lastUpdate: new Date().toISOString(),
                            status: "replied" as const,
                          };

                          portfolioStore.updateConversations(
                            conversations.map((c) =>
                              c.id === activeConv.id ? updatedConv : c,
                            ),
                          );
                          setReplyText("");
                        }}
                        style={{
                          padding: "1.5rem",
                          borderTop: "1px solid rgba(255,255,255,0.05)",
                          background: "rgba(0,0,0,0.2)",
                          display: "flex",
                          gap: "0.75rem",
                        }}
                      >
                        <input
                          placeholder="Type your reply to the visitor..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="admin-input"
                          style={{
                            flex: 1,
                            padding: "0.8rem 1.25rem",
                            borderRadius: "100px",
                            background: "rgba(255,255,255,0.03)",
                          }}
                        />
                        <button
                          type="submit"
                          disabled={!replyText.trim()}
                          style={{
                            background: replyText.trim()
                              ? "var(--accent)"
                              : "rgba(255,255,255,0.1)",
                            border: "none",
                            color: "white",
                            padding: "0 1.5rem",
                            borderRadius: "100px",
                            fontWeight: 800,
                            fontSize: "0.8rem",
                            cursor: replyText.trim()
                              ? "pointer"
                              : "not-allowed",
                            transition: "0.3s",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <Send size={14} /> Send
                        </button>
                      </form>
                    </>
                  );
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
