import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Crown,
  DoorOpen,
  List,
  MagnifyingGlass,
  SealCheck,
  Sparkle,
  X,
} from "@phosphor-icons/react";
import { useAuth } from "../../context/AuthContext";
import useJourneyProgress from "../../hooks/useJourneyProgress";
import {
  ACTS,
  JOURNEY_MODULES,
  buildProtocolPath,
  canAccessAct,
  getActLockReason,
  getActStatus,
  stateNames,
} from "../../data/journey";

const MOBILE_BP = 900;

const ACT_COLORS = {
  1: { act: "#3DFF88", act2: "#A7FF62", dim: "rgba(61,255,136,0.18)" },
  2: { act: "#38D9FF", act2: "#8FEAFF", dim: "rgba(56,217,255,0.18)" },
  3: { act: "#FF5A34", act2: "#FFB04D", dim: "rgba(255,90,52,0.18)" },
  4: { act: "#F5D061", act2: "#FFF0A3", dim: "rgba(245,208,97,0.18)" },
};

const tierLabels = { free: "Free", license: "License", full: "Full Access" };
const tierClasses = { free: "tier-free", license: "tier-license", full: "tier-full" };

const AppShell = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const {
    activeAct,
    completedActs,
    completedSteps,
    nextAction,
    nextStepIndex,
  } = useJourneyProgress(user);

  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < MOBILE_BP,
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BP);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const colors = ACT_COLORS[activeAct] || ACT_COLORS[1];
    document.documentElement.style.setProperty("--act", colors.act);
    document.documentElement.style.setProperty("--act2", colors.act2);
    document.documentElement.style.setProperty("--act-dim", colors.dim);
  }, [activeAct]);

  useEffect(() => {
    if (!isMobile) setSidebarOpen(false);
  }, [isMobile]);

  const currentLevel = user?.level ?? 0;
  const userName = user?.name || user?.full_name || "Seeker";
  const userEmail = user?.email || "";
  const userTier = user?.tier || "free";
  const stateName = stateNames[Math.min(currentLevel, 3)] || "Observer";
  const isActGateway = location.pathname === "/" || location.pathname === "/acts";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleNavigate = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const handleActClick = (act) => {
    if (!canAccessAct(user, act.num)) {
      handleNavigate(act.num === 4 ? "/act/4" : "/dashboard?showUnlock=true");
      return;
    }

    const targetStep = act.num === activeAct ? nextStepIndex : 0;
    handleNavigate(buildProtocolPath(act.num, targetStep));
  };

  return (
    <div className={`mainframe-shell ${isActGateway ? "is-act-gateway-shell" : ""}`}>
      <header data-testid="topbar" className="mainframe-topbar">
        {isMobile && !isActGateway && (
          <button
            type="button"
            className="icon-frame"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label="Toggle journey navigation"
          >
            {sidebarOpen ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
          </button>
        )}

        <button className="brand-lockup" type="button" onClick={() => handleNavigate("/")}>
          <span className="brand-mark"><Crown size={17} weight="fill" /></span>
          <span>
            <strong>Chroma Key Protocol</strong>
            <em>Guided Protocol</em>
          </span>
        </button>

        {!isActGateway && (
          <>
            <div className="topbar-divider" />

            <label className="search-console">
              <MagnifyingGlass size={15} weight="bold" />
              <input
                data-testid="global-search"
                placeholder="Journey index paused"
                readOnly
                aria-disabled="true"
                title="Search stays offline while the guided journey is the primary navigation."
              />
              <span>Guided Mode</span>
            </label>

            <button
              data-testid="cta-continue"
              className="terminal-cta"
              onClick={() => handleNavigate(nextAction.path)}
              type="button"
            >
              <Sparkle size={15} weight="fill" />
              <span>{nextAction.label}</span>
            </button>
          </>
        )}

        <div className="operator-chip">
          <div className="operator-avatar">
            {user?.picture ? <img src={user.picture} alt="" /> : <SealCheck size={16} weight="fill" />}
          </div>
          <div className="operator-copy">
            <strong>{userName} // Level {String(currentLevel).padStart(2, "0")}</strong>
            <span>{stateName}</span>
          </div>
          <button
            onClick={handleLogout}
            data-testid="logout-btn"
            className="logout-command"
            type="button"
            aria-label="Log out"
          >
            <DoorOpen size={16} weight="bold" />
            <span>Exit</span>
          </button>
        </div>
      </header>

      <div className="mainframe-body">
        {isMobile && !isActGateway && sidebarOpen && (
          <button
            type="button"
            aria-label="Close navigation"
            className="drawer-scrim"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {!isActGateway && (
          <aside
            data-testid="sidebar"
            className={`mainframe-sidebar journey-sidebar ${sidebarOpen ? "is-open" : ""}`}
          >
            <section className="sidebar-operator">
              <div className="operator-card">
                <div className={`operator-sigil ${tierClasses[userTier] || "tier-free"}`}>
                  {user?.picture ? <img src={user.picture} alt="" /> : <Crown size={20} weight="fill" />}
                </div>
                <div className="operator-card-copy">
                  <strong data-testid="profile-name">{userName}</strong>
                  <span data-testid="profile-email">{userEmail}</span>
                </div>
              </div>
              <div className="operator-meta">
                <span data-testid="profile-tier" className={tierClasses[userTier] || "tier-free"}>
                  {tierLabels[userTier] || "Free"}
                </span>
                <span data-testid="profile-level">Level {String(currentLevel).padStart(2, "0")} / {stateName}</span>
              </div>
            </section>

            <section className="sidebar-section journey-next-panel">
              <span className="console-label">Current Operation</span>
              <strong>{nextAction.eyebrow}</strong>
              <p>{nextAction.description}</p>
              <button type="button" className="journey-panel-cta" onClick={() => handleNavigate(nextAction.path)}>
                {nextAction.label}
              </button>
            </section>

            <section className="sidebar-section journey-rail" aria-label="Protocol journey">
              <span className="console-label">Act Timeline</span>
              {ACTS.map((act) => {
                const Icon = act.icon;
                const locked = !canAccessAct(user, act.num);
                const active =
                  location.pathname === `/protocol/${act.num}` ||
                  location.pathname === `/act/${act.num}` ||
                  (act.num === activeAct && (location.pathname === "/" || location.pathname === "/acts"));
                const status = getActStatus(user, act.num, activeAct);
                const stepsDone = act.num === activeAct ? completedSteps.length : completedActs.includes(act.num) ? 5 : 0;

                return (
                  <button
                    key={act.num}
                    type="button"
                    data-testid={`act-rail-${act.num}`}
                    onClick={() => handleActClick(act)}
                    className={`act-nav journey-act ${act.tone} ${active ? "is-active" : ""} ${locked ? "is-locked" : ""}`}
                    style={{ "--act-local": `var(${act.colorVar})` }}
                    title={locked ? getActLockReason(user, act.num) : `Open Act ${act.roman}`}
                  >
                    <span className="act-nav-glyph"><Icon size={17} weight={active ? "fill" : "duotone"} /></span>
                    <span className="act-nav-copy">
                      <strong>Act {act.roman} / {act.shortTitle}</strong>
                      <em>{act.element} / {status}</em>
                      <small>{locked ? getActLockReason(user, act.num) : `${stepsDone} of 5 steps sealed`}</small>
                    </span>
                  </button>
                );
              })}
            </section>

            <nav className="sidebar-section module-grid" aria-label="Journey modules">
              <span className="console-label">Browse Modules</span>
              {JOURNEY_MODULES
                .filter((item) => !item.adminOnly || user?.is_admin)
                .map((item) => {
                  const Icon = item.icon;
                  const active =
                    location.pathname === item.path ||
                    (item.id === "codex" && (location.pathname.startsWith("/act/") || location.pathname === "/codex"));
                  const path = item.id === "codex" ? "/codex" : item.path;
                  return (
                    <button
                      key={item.id}
                      data-testid={`nav-${item.id}`}
                      onClick={() => handleNavigate(path)}
                      className={`nav-command module-command ${active ? "is-active" : ""}`}
                      type="button"
                    >
                      <Icon size={17} weight={active ? "fill" : "duotone"} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
            </nav>

            <section className="sidebar-progress">
              <span className="console-label">Protocol Progress</span>
              <div className="progress-bars" aria-hidden="true">
                {ACTS.map((act) => (
                  <span
                    key={act.num}
                    className={completedActs.includes(act.num) ? "is-complete" : act.num === activeAct ? "is-current" : ""}
                  />
                ))}
              </div>
              <strong>Act {ACTS[activeAct - 1]?.roman || "I"} / {completedActs.length} of 4</strong>
            </section>
          </aside>
        )}

        <main className="mainframe-content">
          <div className="content-scroll">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AppShell;
