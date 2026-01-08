import React, { useState, useEffect, useRef, useMemo } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import myphoto from "./assets/1.jpg";
import "./App.css";

function App() {
  // ---------------------------------
  // Storage helpers + month key
  // ---------------------------------
  const STORAGE = {
    planner: "plannerTasks",
    bodyTasks: "bodyTasks",
    weight: "weightInput",
    skinTasks: "skinTasks",
    skinSessions: "skinSessions",
    skinDayKey: "skinDayKey", // ✅ daily reset key
    mindSubjects: "mindSubjects",
    reminderSettings: "reminderSettings",
    monthKey: "appMonthKey",
    muscleProgress: "muscleProgress",
    progressMonth: "progressMonth",
    skinLastReminderDay: "skinLastReminderDay",
  };

  const loadJSON = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };

  const saveJSON = (key, val) => {
    localStorage.setItem(key, JSON.stringify(val));
  };

  const getMonthKey = () => {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()}`; // ex: 2026-0
  };

  const getTodayKey = () => {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  };

  // ---------------------------------
  // View state
  // ---------------------------------
  const [activeView, setActiveView] = useState("none");

  // ---------------------------------
  // BODY: weight + percentage
  // ---------------------------------
  const [inputValue, setInputValue] = useState("");
  const [percentage, setPercentage] = useState(0);

  // ---------------------------------
  // Planner / Tasks view
  // ---------------------------------
  const [plannerTasks, setPlannerTasks] = useState(() => loadJSON(STORAGE.planner, []));
  const [newTaskLabel, setNewTaskLabel] = useState("");
  const [newTaskDueAt, setNewTaskDueAt] = useState(""); // datetime-local string
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [newTaskRemindMins, setNewTaskRemindMins] = useState(30);

  // ---------------------------------
  // BODY tasks checklist (persist)
  // ---------------------------------
  const defaultBodyTasks = useMemo(
    () => [
      { id: 1, label: "Push ups", completed: false },
      { id: 2, label: "Pull ups", completed: false },
      { id: 3, label: "Crunches", completed: false },
      { id: 4, label: "Crucifix", completed: false },
      { id: 5, label: "Russian Twists", completed: false },
      { id: 6, label: "Biceps", completed: false },
      { id: 7, label: "Shoulders", completed: false },
      { id: 8, label: "Triceps", completed: false },
      { id: 9, label: "Forearms", completed: false },
      { id: 10, label: "Calisthenics", completed: false },
    ],
    []
  );

  const [tasks, setTasks] = useState(() => loadJSON(STORAGE.bodyTasks, defaultBodyTasks));

  // ---------------------------------
  // Progress counters (0–31) + monthly reset
  // ---------------------------------
  const MAX_SESSIONS = 31;
  const MAX_SKIN_SESSIONS = 31;

  const [progress, setProgress] = useState({
    biceps: 0,
    shoulders: 0,
    triceps: 0,
    abs: 0,
    forearms: 0,
  });

  // ---------------------------------
  // SKIN
  // ---------------------------------
  const defaultSkinTasks = useMemo(
    () => [
      { id: 1, label: "Body Wash", completed: false },
      { id: 2, label: "Face Wash", completed: false },
      { id: 3, label: "Clean", completed: false },
      { id: 4, label: "Face Serum", completed: false },
      { id: 5, label: "Eye Blow Cleaning", completed: false },
    ],
    []
  );

  const [skinTasks, setSkinTasks] = useState(() => loadJSON(STORAGE.skinTasks, defaultSkinTasks));

  const [skinSessions, setSkinSessions] = useState(() => {
    const saved = localStorage.getItem(STORAGE.skinSessions);
    return saved ? Number(saved) : 0;
  });

  // ---------------------------------
  // MIND: subjects + units + links + tabs
  // ---------------------------------
  const defaultMindSubjects = useMemo(
    () => [
      {
        id: "dsa",
        label: "DSA",
        units: [
          { id: "dsa-u1", label: "U1", completed: false },
          { id: "dsa-u2", label: "U2", completed: false },
          { id: "dsa-u3", label: "U3", completed: false },
          { id: "dsa-u4", label: "U4", completed: false },
        ],
        links: [],
      },
      {
        id: "wt",
        label: "WT",
        units: [
          { id: "wt-u1", label: "U1", completed: false },
          { id: "wt-u2", label: "U2", completed: false },
          { id: "wt-u3", label: "U3", completed: false },
          { id: "wt-u4", label: "U4", completed: false },
        ],
        links: [],
      },
      {
        id: "ddco",
        label: "DDCO",
        units: [
          { id: "ddco-u1", label: "U1", completed: false },
          { id: "ddco-u2", label: "U2", completed: false },
          { id: "ddco-u3", label: "U3", completed: false },
          { id: "ddco-u4", label: "U4", completed: false },
        ],
        links: [],
      },
      {
        id: "mcse",
        label: "MCSE",
        units: [
          { id: "mcse-u1", label: "U1", completed: false },
          { id: "mcse-u2", label: "U2", completed: false },
          { id: "mcse-u3", label: "U3", completed: false },
          { id: "mcse-u4", label: "U4", completed: false },
        ],
        links: [],
      },
      {
        id: "afll",
        label: "AFLL",
        units: [
          { id: "afll-u1", label: "U1", completed: false },
          { id: "afll-u2", label: "U2", completed: false },
          { id: "afll-u3", label: "U3", completed: false },
          { id: "afll-u4", label: "U4", completed: false },
        ],
        links: [],
      },
    ],
    []
  );

  const [mindSubjects, setMindSubjects] = useState(() =>
    loadJSON(STORAGE.mindSubjects, defaultMindSubjects)
  );

  const [mindTab, setMindTab] = useState("tasks"); // "tasks" | "links"
  const [newSubjectName, setNewSubjectName] = useState("");

  const [linkSubjectId, setLinkSubjectId] = useState(() => {
    const first = (loadJSON(STORAGE.mindSubjects, defaultMindSubjects) || [])[0];
    return first?.id || "dsa";
  });
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

  // ---------------------------------
  // Notifications: settings + engine
  // ---------------------------------
  const [notifEnabled, setNotifEnabled] = useState(() => {
    const s = loadJSON(STORAGE.reminderSettings, { enabled: false });
    return !!s.enabled;
  });

  const requestNotifications = async () => {
    if (!("Notification" in window)) return false;
    if (Notification.permission === "granted") return true;
    const perm = await Notification.requestPermission();
    return perm === "granted";
  };

  const fireNotify = (title, body) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body });
      return;
    }
    // fallback
    // eslint-disable-next-line no-alert
    alert(`${title}\n\n${body}`);
  };

  // ✅ enable reminders even if permission denied (fallback still works)
  const enableNotifications = async () => {
    setNotifEnabled(true);
    if ("Notification" in window) {
      try {
        if (Notification.permission !== "granted") {
          await Notification.requestPermission();
        }
      } catch {
        // ignore
      }
    }
  };

  // store reminder settings
  useEffect(() => {
    saveJSON(STORAGE.reminderSettings, { enabled: notifEnabled });
  }, [notifEnabled]);

  // ---------------------------------
  // Monthly reset: Body progress bars + checklists + Skin sessions (monthly)
  // Mind is NOT reset monthly by default
  // ---------------------------------
  useEffect(() => {
    const savedMonth = localStorage.getItem(STORAGE.monthKey);
    const nowMonth = getMonthKey();

    if (savedMonth !== nowMonth) {
      // Body monthly reset
      localStorage.removeItem(STORAGE.muscleProgress);
      localStorage.removeItem(STORAGE.bodyTasks);

      // Skin monthly reset (sessions + tasks)
      localStorage.removeItem(STORAGE.skinSessions);
      localStorage.removeItem(STORAGE.skinTasks);

      localStorage.setItem(STORAGE.monthKey, nowMonth);
    }
  }, []);

  // ---------------------------------
  // util
  // ---------------------------------
  function hexToRgba(color, alpha) {
    if (color.startsWith("rgb")) {
      const nums = color
        .replace(/rgba?\(/, "")
        .replace(")", "")
        .split(",")
        .map((n) => parseFloat(n.trim()));
      const [r, g, b] = nums;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    let c = color.replace("#", "");
    if (c.length === 3) {
      c = c
        .split("")
        .map((ch) => ch + ch)
        .join("");
    }
    const r = parseInt(c.slice(0, 2), 16);
    const g = parseInt(c.slice(2, 4), 16);
    const b = parseInt(c.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  const getRingColor = (val) => {
    const v = Number(val) || 0;
    let ringColor = "#ff4d4d";
    if (v > 80) ringColor = "#00eaff";
    else if (v > 50) ringColor = "#00ff66";
    else if (v > 20) ringColor = "#ffd700";
    return ringColor;
  };

  const GlowCircle = ({ value, ringColor, textColor = "#bffcff", barSize = 200 }) => {
    const wrapperStyle = {
      width: `${barSize}px`,
      height: `${barSize}px`,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: `radial-gradient(
        circle at 50% 50%,
        ${hexToRgba(ringColor, 0.18)} 0%,
        rgba(0,0,0,0) 70%
      )`,
      boxShadow: `
        0 0 20px  ${hexToRgba(ringColor, 1)},
        0 0 60px  ${hexToRgba(ringColor, 0.8)},
        0 0 120px ${hexToRgba(ringColor, 0.5)},
        0 0 200px ${hexToRgba(ringColor, 0.25)}
      `,
    };

    return (
      <div style={wrapperStyle} className="glow-circle">
        <div style={{ width: `${barSize}px`, height: `${barSize}px` }}>
          <CircularProgressbar
            value={value}
            text={`${Math.round(value)}%`}
            styles={buildStyles({
              textColor,
              pathColor: ringColor,
              trailColor: "rgba(0,0,0,0.4)",
              textSize: "18px",
              pathTransitionDuration: 0.6,
            })}
          />
        </div>
      </div>
    );
  };

  // ---------------------------------
  // BODY: load weight on mount and recompute percentage
  // ---------------------------------
  useEffect(() => {
    const savedWeight = localStorage.getItem(STORAGE.weight);
    if (savedWeight !== null) {
      setInputValue(savedWeight);
      const x = parseFloat(savedWeight);
      if (!isNaN(x)) {
        let y = -2.5 * (x - 100);
        y = Math.max(0, Math.min(100, y));
        setPercentage(y);
      }
    }
  }, []);

  // save weight
  useEffect(() => {
    localStorage.setItem(STORAGE.weight, inputValue);
  }, [inputValue]);

  // ---------------------------------
  // Persist planner tasks
  // ---------------------------------
  useEffect(() => {
    saveJSON(STORAGE.planner, plannerTasks);
  }, [plannerTasks]);

  // Persist body tasks checklist
  useEffect(() => {
    saveJSON(STORAGE.bodyTasks, tasks);
  }, [tasks]);

  // Persist skin tasks
  useEffect(() => {
    saveJSON(STORAGE.skinTasks, skinTasks);
  }, [skinTasks]);

  // Persist mind subjects
  useEffect(() => {
    saveJSON(STORAGE.mindSubjects, mindSubjects);
  }, [mindSubjects]);

  // Persist skin sessions
  useEffect(() => {
    localStorage.setItem(STORAGE.skinSessions, String(skinSessions));
  }, [skinSessions]);

  // ---------------------------------
  // BODY: monthly reset logic for muscle progress
  // ---------------------------------
  useEffect(() => {
    const saved = loadJSON(STORAGE.muscleProgress, null);
    const savedMonth = localStorage.getItem(STORAGE.progressMonth);
    const currentMonth = new Date().getMonth();

    if (saved && parseInt(savedMonth, 10) === currentMonth) {
      setProgress(saved);
    } else {
      localStorage.removeItem(STORAGE.muscleProgress);
      localStorage.setItem(STORAGE.progressMonth, String(currentMonth));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE.muscleProgress, JSON.stringify(progress));
  }, [progress]);

  // ---------------------------------
  // Notification engine:
  // 1) planner task reminders (remindAt)
  // 2) skin daily reminder at chosen time (once per day)
  // ---------------------------------
  const [skinReminderTime, setSkinReminderTime] = useState(() => {
    const s = loadJSON(STORAGE.reminderSettings, { enabled: false, skinTime: "21:00" });
    return s.skinTime || "21:00";
  });

  useEffect(() => {
    // store skinTime along with enabled
    saveJSON(STORAGE.reminderSettings, { enabled: notifEnabled, skinTime: skinReminderTime });
  }, [notifEnabled, skinReminderTime]);

  useEffect(() => {
    if (!notifEnabled) return;

    const tick = () => {
      const now = Date.now();

      // --- Planner reminders ---
      setPlannerTasks((prev) => {
        let changed = false;
        const next = prev.map((t) => {
          if (t.completed || t.notified || !t.remindAt) return t;
          const remindTime = new Date(t.remindAt).getTime();
          if (remindTime <= now) {
            fireNotify(
              `⏰ Task Reminder (${t.priority})`,
              `${t.label}${t.dueAt ? ` (Due: ${new Date(t.dueAt).toLocaleString()})` : ""}`
            );
            changed = true;
            return { ...t, notified: true };
          }
          return t;
        });
        return changed ? next : prev;
      });

      // --- Skin daily reminder (once/day at set time) ---
      const [hh, mm] = String(skinReminderTime || "21:00")
        .split(":")
        .map((x) => parseInt(x, 10));
      if (!Number.isFinite(hh) || !Number.isFinite(mm)) return;

      const d = new Date();
      const nowMinutes = d.getHours() * 60 + d.getMinutes();
      const targetMinutes = hh * 60 + mm;

      const todayKey = getTodayKey();
      const lastDay = localStorage.getItem(STORAGE.skinLastReminderDay);

      const incomplete = skinTasks.some((t) => !t.completed);

      if (incomplete && nowMinutes >= targetMinutes && nowMinutes <= targetMinutes + 2) {
        if (lastDay !== todayKey) {
          fireNotify("🧴 Skin Routine Reminder", "Finish your skin tasks to complete today’s session.");
          localStorage.setItem(STORAGE.skinLastReminderDay, todayKey);
        }
      }
    };

    const timer = setInterval(tick, 30_000);
    return () => clearInterval(timer);
  }, [notifEnabled, skinReminderTime, skinTasks]);

  // ---------------------------------
  // BODY: weight → percentage
  // ---------------------------------
  const handleChange = (e) => {
    const x = parseFloat(e.target.value);
    setInputValue(e.target.value);

    if (!isNaN(x)) {
      let y = -2.5 * (x - 100);
      y = Math.max(0, Math.min(100, y));
      setPercentage(y);
    } else {
      setPercentage(0);
    }
  };

  // ---------------------------------
  // BODY toggleTask – each check adds +1 for the relevant muscles (0–31)
  // ---------------------------------
  const toggleTask = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const nowCompleted = !task.completed;
    const label = task.label.toLowerCase();
    const absExercises = ["crunches", "crucifix", "russian twists"];

    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: nowCompleted } : t)));

    if (nowCompleted) {
      setProgress((prev) => {
        const next = { ...prev };

        if (label.includes("bicep")) next.biceps = Math.min(next.biceps + 1, MAX_SESSIONS);
        else if (label.includes("shoulder")) next.shoulders = Math.min(next.shoulders + 1, MAX_SESSIONS);
        else if (label.includes("forearms")) next.forearms = Math.min(next.forearms + 1, MAX_SESSIONS);
        else if (label.includes("tricep")) next.triceps = Math.min(next.triceps + 1, MAX_SESSIONS);

        if (absExercises.includes(label)) next.abs = Math.min(next.abs + 1, MAX_SESSIONS);

        return next;
      });
    }
  };

  // ---------------------------------
  // Linear progress bar
  // ---------------------------------
  const LinearBar = ({ label, value, max }) => {
    const percent = max ? (value / max) * 100 : value;

    let color = "#ff4d4d";
    if (percent > 80) color = "#00eaff";
    else if (percent > 50) color = "#00ff66";
    else if (percent > 20) color = "#ffd700";

    const isFull = percent >= 100;

    return (
      <div style={{ margin: "10px 0" }}>
        <span style={{ color: "#bffcff", fontSize: "16px" }}>
          {max ? `${label} (${value}/${max})` : label}
        </span>
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            height: "10px",
            borderRadius: "10px",
            overflow: "hidden",
            marginTop: "5px",
            boxShadow: "0 0 6px rgba(0, 255, 255, 0.3)",
          }}
        >
          <div
            className={isFull ? "pulse-bar" : ""}
            style={{
              width: `${percent}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${color}, cyan)`,
              transition: "width 0.5s ease, background 0.5s ease",
              boxShadow: `0 0 8px ${color}`,
            }}
          />
        </div>
      </div>
    );
  };

  // ---------------------------------
  // SKIN toggle
  // ---------------------------------
  const toggleSkinTask = (id) => {
    setSkinTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  const prevAllCompletedRef = useRef(false);

  // ✅ DAILY RESET (runs once on mount)
  useEffect(() => {
    const todayKey = getTodayKey();
    const savedDay = localStorage.getItem(STORAGE.skinDayKey);

    if (savedDay !== todayKey) {
      // reset tasks for the new day
      setSkinTasks((prev) => prev.map((t) => ({ ...t, completed: false })));

      // allow session increment today
      prevAllCompletedRef.current = false;

      // mark today + allow reminder today
      localStorage.setItem(STORAGE.skinDayKey, todayKey);
      localStorage.removeItem(STORAGE.skinLastReminderDay);
    }
  }, []);

  // ✅ session increment + completion notification
  useEffect(() => {
    const allCompleted = skinTasks.every((t) => t.completed);

    if (allCompleted && !prevAllCompletedRef.current) {
      setSkinSessions((s) => Math.min(s + 1, MAX_SKIN_SESSIONS));

      if (notifEnabled) {
        fireNotify("✅ Skin Session Completed", "Nice! Your skin routine session has been recorded.");
      }
    }

    prevAllCompletedRef.current = allCompleted;
  }, [skinTasks, notifEnabled]);

  // ---------------------------------
  // Planner helpers: toggle + add
  // ---------------------------------
  const togglePlannerTask = (id) => {
    setPlannerTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  const addPlannerTask = () => {
    const label = newTaskLabel.trim();
    if (!label) return;

    const dueAt = newTaskDueAt ? new Date(newTaskDueAt).toISOString() : null;
    const remindAt =
      dueAt && newTaskRemindMins != null
        ? new Date(new Date(dueAt).getTime() - Number(newTaskRemindMins) * 60000).toISOString()
        : null;

    const task = {
      id: Date.now(),
      label,
      completed: false,
      dueAt,
      priority: newTaskPriority,
      remindAt,
      notified: false,
      createdAt: new Date().toISOString(),
    };

    setPlannerTasks((prev) => [task, ...prev]);

    setNewTaskLabel("");
    setNewTaskDueAt("");
    setNewTaskPriority("medium");
    setNewTaskRemindMins(30);
  };

  // ---------------------------------
  // MIND: toggle unit
  // ---------------------------------
  const toggleMindUnit = (subjectId, unitId) => {
    setMindSubjects((prev) =>
      prev.map((subj) =>
        subj.id !== subjectId
          ? subj
          : {
              ...subj,
              units: subj.units.map((unit) =>
                unit.id === unitId ? { ...unit, completed: !unit.completed } : unit
              ),
            }
      )
    );
  };

  const getSubjectPercent = (subjectId) => {
    const subj = mindSubjects.find((s) => s.id === subjectId);
    if (!subj) return 0;
    const completed = subj.units.filter((u) => u.completed).length;
    return (completed / subj.units.length) * 100;
  };

  const mindTotals = useMemo(() => {
    const totalUnits = mindSubjects.reduce((sum, s) => sum + (s.units?.length || 0), 0);
    const completedUnits = mindSubjects.reduce(
      (sum, s) => sum + (s.units?.filter((u) => u.completed).length || 0),
      0
    );
    return {
      totalUnits,
      completedUnits,
      percent: totalUnits === 0 ? 0 : (completedUnits / totalUnits) * 100,
    };
  }, [mindSubjects]);

  // MIND: add subject
  const addMindSubject = () => {
    const name = newSubjectName.trim();
    if (!name) return;

    const id = `sub-${Date.now()}`;
    setMindSubjects((prev) => [
      ...prev,
      {
        id,
        label: name,
        units: [
          { id: `${id}-u1`, label: "U1", completed: false },
          { id: `${id}-u2`, label: "U2", completed: false },
          { id: `${id}-u3`, label: "U3", completed: false },
          { id: `${id}-u4`, label: "U4", completed: false },
        ],
        links: [],
      },
    ]);

    setNewSubjectName("");
    setLinkSubjectId(id);
  };

  // MIND: add link to subject
  const addSubjectLink = () => {
    const title = newLinkTitle.trim();
    const url = newLinkUrl.trim();
    if (!title || !url) return;

    setMindSubjects((prev) =>
      prev.map((s) =>
        s.id !== linkSubjectId
          ? s
          : { ...s, links: [...(s.links || []), { id: Date.now(), title, url }] }
      )
    );

    setNewLinkTitle("");
    setNewLinkUrl("");
  };

  const removeSubjectLink = (subjectId, linkId) => {
    setMindSubjects((prev) =>
      prev.map((s) =>
        s.id !== subjectId ? s : { ...s, links: (s.links || []).filter((l) => l.id !== linkId) }
      )
    );
  };

  // ---------------------------------
  // Derived percentages
  // ---------------------------------
  const completedCount = tasks.filter((t) => t.completed).length;
  const secondPercentage = (completedCount / tasks.length) * 100;

  const skinPercent = useMemo(() => {
    const done = skinTasks.filter((t) => t.completed).length;
    return skinTasks.length === 0 ? 0 : (done / skinTasks.length) * 100;
  }, [skinTasks]);

  // ---------------------------------
  // Styles
  // ---------------------------------
  const containerStyle = {
    width: "100vw",
    height: "100vh",
    margin: 0,
    padding: 0,
    position: "relative",
    backgroundColor: "#00093eff",
    backgroundImage: `url(${myphoto})`,
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    overflow: "hidden",
  };

  const buttonStyle = {
    position: "absolute",
    width: "20px",
    height: "20px",
    minWidth: "0",
    minHeight: "0",
    padding: "0",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "50%",
    fontSize: "16px",
    lineHeight: "1",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
  };

  // ---------------------------------
  // Render
  // ---------------------------------
  return (
    <div style={containerStyle}>
      {/* --- BUTTONS --- */}
      <button
        className="glow-btn"
        style={{ ...buttonStyle, top: "20%", left: "49.3%" }}
        onClick={() => setActiveView("Mind")}
      />
      <button
        className="glow-btn"
        style={{ ...buttonStyle, top: "35%", left: "49.3%" }}
        onClick={() => setActiveView("Skin")}
      />
      <button
        className="glow-btn"
        style={{ ...buttonStyle, top: "45%", left: "49.3%" }}
        onClick={() => setActiveView("Body")}
      />
      <button
        className="glow-btn"
        style={{ ...buttonStyle, bottom: "6%", right: "49.3%" }}
        onClick={() => setActiveView("Tasks")}
      />

      {/* --- BODY VIEW --- */}
      {activeView === "Body" && (
        <>
          <div className="task-card left-card" style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: "60px", left: "10px" }}>
              <GlowCircle value={percentage} ringColor="rgb(0,255,255)" textColor="#bffcff" />
            </div>

            <div style={{ position: "absolute", top: "60px", left: "230px" }}>
              <GlowCircle value={secondPercentage} ringColor="#fff2a8" textColor="#fff2cc" />
            </div>

            <div style={{ position: "absolute", top: "300px", left: "30px", width: "90%" }}>
              <h3 style={{ color: "#bffcff", textAlign: "center" }}>Muscle Progress</h3>
              <LinearBar label="💪 Biceps" value={progress.biceps} max={MAX_SESSIONS} />
              <LinearBar label="🏋️ Shoulders" value={progress.shoulders} max={MAX_SESSIONS} />
              <LinearBar label="🤜 Triceps" value={progress.triceps} max={MAX_SESSIONS} />
              <LinearBar label="🧘 Abs" value={progress.abs} max={MAX_SESSIONS} />
              <LinearBar label="✋ Forearms" value={progress.forearms} max={MAX_SESSIONS} />
            </div>
          </div>

          <div className="task-card right-card">
            <div style={{ marginTop: "30px", textAlign: "center" }}>
              <label
                htmlFor="xValue"
                style={{ color: "#bffcff", fontSize: "20px", fontWeight: "400" }}
              >
                Weight:
              </label>
              <input id="xValue" type="number" value={inputValue} onChange={handleChange} className="input-glow" />

              <div style={{ marginTop: "30px", textAlign: "left" }}>
                <h2 style={{ color: "#bffcff", textAlign: "center" }}>Daily Tasks</h2>

                {tasks.map((task) => (
                  <label
                    key={task.id}
                    style={{
                      display: "block",
                      margin: "8px 0",
                      color: task.completed ? "#00ffcc" : "#bffcff",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      style={{ marginRight: "10px", transform: "scale(1.2)", cursor: "pointer" }}
                    />
                    {task.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* --- MIND VIEW --- */}
      {activeView === "Mind" && (
        <>
          <div className="task-card left-card" style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: "50px", left: "110px" }}>
              <GlowCircle
                value={mindTotals.percent}
                ringColor={getRingColor(mindTotals.percent)}
                textColor="#bffcff"
                barSize={200}
              />
            </div>

            <div
              style={{
                position: "absolute",
                top: "290px",
                left: "25px",
                width: "92%",
                display: "flex",
                flexWrap: "wrap",
                gap: "18px",
                justifyContent: "center",
              }}
            >
              {mindSubjects.map((s) => {
                const val = getSubjectPercent(s.id);
                const ring = getRingColor(val);
                return (
                  <div key={s.id} style={{ textAlign: "center" }}>
                    <GlowCircle value={val} ringColor={ring} textColor="#bffcff" barSize={120} />
                    <div style={{ marginTop: "10px", color: "#bffcff", fontSize: "14px" }}>
                      {s.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="task-card right-card">
            <div style={{ marginTop: "22px", padding: "0 18px", width: "100%" }}>
              <h2 style={{ color: "#bffcff", textAlign: "center", marginBottom: "10px" }}>Mind</h2>

              <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 12 }}>
                <input
                  type="text"
                  className="input-glow"
                  placeholder="New subject name..."
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  style={{ width: "60%", maxWidth: 240 }}
                />
                <button
                  onClick={addMindSubject}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "999px",
                    border: "none",
                    cursor: "pointer",
                    background: "linear-gradient(90deg, rgba(0,255,255,0.9), rgba(0,180,255,0.9))",
                    color: "#001327",
                    boxShadow: "0 0 18px rgba(0,255,255,0.8)",
                  }}
                >
                  Add
                </button>
              </div>

              <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 12 }}>
                <button
                  onClick={() => setMindTab("tasks")}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "999px",
                    border: "none",
                    cursor: "pointer",
                    background:
                      mindTab === "tasks"
                        ? "linear-gradient(90deg, rgba(0,255,255,0.9), rgba(0,180,255,0.9))"
                        : "rgba(0, 30, 60, 0.35)",
                    color: mindTab === "tasks" ? "#001327" : "#bffcff",
                    boxShadow: mindTab === "tasks" ? "0 0 14px rgba(0,255,255,0.7)" : "none",
                  }}
                >
                  Tasks
                </button>
                <button
                  onClick={() => setMindTab("links")}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "999px",
                    border: "none",
                    cursor: "pointer",
                    background:
                      mindTab === "links"
                        ? "linear-gradient(90deg, rgba(0,255,255,0.9), rgba(0,180,255,0.9))"
                        : "rgba(0, 30, 60, 0.35)",
                    color: mindTab === "links" ? "#001327" : "#bffcff",
                    boxShadow: mindTab === "links" ? "0 0 14px rgba(0,255,255,0.7)" : "none",
                  }}
                >
                  Links
                </button>
              </div>

              {mindTab === "tasks" && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "flex-start",
                    gap: 16,
                    maxHeight: 520,
                    overflow: "auto",
                    paddingRight: 6,
                  }}
                >
                  {mindSubjects.map((subject) => (
                    <div key={subject.id} style={{ minWidth: "110px" }}>
                      <h3 style={{ color: "#bffcff", marginBottom: "6px" }}>{subject.label}</h3>

                      {subject.units.map((unit) => (
                        <label
                          key={unit.id}
                          style={{
                            display: "block",
                            margin: "4px 0",
                            color: unit.completed ? "#00ffcc" : "#bffcff",
                            cursor: "pointer",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={unit.completed}
                            onChange={() => toggleMindUnit(subject.id, unit.id)}
                            style={{ marginRight: "10px", transform: "scale(1.1)", cursor: "pointer" }}
                          />
                          {unit.label}
                        </label>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {mindTab === "links" && (
                <div style={{ maxHeight: 520, overflow: "auto", paddingRight: 6 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ color: "#bffcff" }}>Subject:</span>
                    <select
                      value={linkSubjectId}
                      onChange={(e) => setLinkSubjectId(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "10px 12px",
                        borderRadius: 10,
                        border: "1.5px solid rgba(0, 191, 255, 0.7)",
                        background: "rgba(0, 30, 60, 0.3)",
                        color: "#bffcff",
                        outline: "none",
                      }}
                    >
                      {mindSubjects.map((s) => (
                        <option key={s.id} value={s.id} style={{ background: "#001327" }}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                    <input
                      type="text"
                      className="input-glow"
                      placeholder="Link title..."
                      value={newLinkTitle}
                      onChange={(e) => setNewLinkTitle(e.target.value)}
                      style={{ width: "100%", maxWidth: "100%" }}
                    />
                    <input
                      type="url"
                      className="input-glow"
                      placeholder="https://..."
                      value={newLinkUrl}
                      onChange={(e) => setNewLinkUrl(e.target.value)}
                      style={{ width: "100%", maxWidth: "100%" }}
                    />
                    <button
                      onClick={addSubjectLink}
                      style={{
                        marginTop: 4,
                        padding: "10px 26px",
                        borderRadius: "999px",
                        border: "none",
                        fontSize: "16px",
                        cursor: "pointer",
                        background:
                          "linear-gradient(90deg, rgba(0,255,255,0.9), rgba(0,180,255,0.9))",
                        color: "#001327",
                        boxShadow: "0 0 18px rgba(0,255,255,0.8)",
                        alignSelf: "center",
                      }}
                    >
                      Add Link
                    </button>
                  </div>

                  <div style={{ marginTop: 16 }}>
                    <h3 style={{ color: "#bffcff", marginBottom: 10 }}>Saved Links</h3>

                    {(() => {
                      const subj = mindSubjects.find((s) => s.id === linkSubjectId);
                      const links = subj?.links || [];
                      if (links.length === 0) {
                        return <p style={{ color: "#bffcff" }}>No links yet. Add one above.</p>;
                      }

                      return links.map((l) => (
                        <div
                          key={l.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 10,
                            padding: "10px 12px",
                            marginBottom: 10,
                            borderRadius: 12,
                            border: "1px solid rgba(0,255,255,0.35)",
                            background: "rgba(0, 20, 50, 0.25)",
                            boxShadow: "0 0 10px rgba(0, 191, 255, 0.2)",
                          }}
                        >
                          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            <span style={{ color: "#bffcff", fontWeight: 600 }}>{l.title}</span>
                            <a href={l.url} target="_blank" rel="noreferrer" style={{ color: "#00f0ff", fontSize: 13 }}>
                              {l.url}
                            </a>
                          </div>

                          <button
                            onClick={() => removeSubjectLink(linkSubjectId, l.id)}
                            style={{
                              padding: "8px 12px",
                              borderRadius: 999,
                              border: "none",
                              cursor: "pointer",
                              background: "rgba(255, 77, 77, 0.9)",
                              color: "#001327",
                              boxShadow: "0 0 12px rgba(255, 77, 77, 0.6)",
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* --- SKIN VIEW --- */}
      {activeView === "Skin" && (
        <>
          <div className="task-card left-card" style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: "300px", left: "30px", width: "90%" }}>
              <h3 style={{ color: "#bffcff", textAlign: "center" }}>Skin Routine Progress</h3>
              <LinearBar label="🧴 Skin Sessions" value={skinSessions} max={MAX_SKIN_SESSIONS} />

              <div style={{ marginTop: 18, textAlign: "center" }}>
                <div style={{ color: "#bffcff", marginBottom: 8 }}>Daily reminder time</div>
                <input
                  type="time"
                  value={skinReminderTime}
                  onChange={(e) => setSkinReminderTime(e.target.value)}
                  className="input-glow"
                  style={{ width: 160 }}
                />
              </div>

              <div style={{ marginTop: 16, textAlign: "center" }}>
                {!notifEnabled ? (
                  <button
                    onClick={enableNotifications}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "999px",
                      border: "none",
                      cursor: "pointer",
                      background: "linear-gradient(90deg, rgba(0,255,255,0.9), rgba(0,180,255,0.9))",
                      color: "#001327",
                      boxShadow: "0 0 18px rgba(0,255,255,0.8)",
                    }}
                  >
                    Enable Notifications
                  </button>
                ) : (
                  <div style={{ color: "#00ffcc" }}>Notifications Enabled ✅</div>
                )}
              </div>
            </div>

            <div style={{ position: "absolute", top: "60px", left: "110px" }}>
              <GlowCircle value={skinPercent} ringColor="rgb(0,255,255)" textColor="#bffcff" />
            </div>
          </div>

          <div className="task-card right-card">
            <div style={{ marginTop: "30px", textAlign: "center" }}>
              <h2 style={{ color: "#bffcff", textAlign: "center" }}>Tasks:</h2>

              {skinTasks.map((task) => (
                <label
                  key={task.id}
                  style={{
                    display: "block",
                    margin: "8px 0",
                    color: task.completed ? "#00ffcc" : "#bffcff",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleSkinTask(task.id)}
                    style={{ marginRight: "10px", transform: "scale(1.2)", cursor: "pointer" }}
                  />
                  {task.label}
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      {/* --- TASKS VIEW --- */}
      {activeView === "Tasks" && (
        <>
          <div className="task-card left-card" style={{ position: "relative" }}>
            <div style={{ marginTop: "30px", padding: "20px", width: "100%" }}>
              <h2 style={{ color: "#bffcff", textAlign: "center", marginBottom: "14px" }}>
                Your Tasks
              </h2>

              <div style={{ textAlign: "center", marginBottom: 14 }}>
                {!notifEnabled ? (
                  <button
                    onClick={enableNotifications}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "999px",
                      border: "none",
                      cursor: "pointer",
                      background: "linear-gradient(90deg, rgba(0,255,255,0.9), rgba(0,180,255,0.9))",
                      color: "#001327",
                      boxShadow: "0 0 18px rgba(0,255,255,0.8)",
                    }}
                  >
                    Enable Notifications
                  </button>
                ) : (
                  <div style={{ color: "#00ffcc" }}>Notifications Enabled ✅</div>
                )}
              </div>

              {plannerTasks.length === 0 ? (
                <p style={{ color: "#bffcff", textAlign: "center" }}>
                  No tasks yet. Add one on the right.
                </p>
              ) : (
                plannerTasks.map((task) => {
                  const dueText = task.dueAt ? new Date(task.dueAt).toLocaleString() : "No due date";
                  return (
                    <div
                      key={task.id}
                      style={{
                        borderRadius: 14,
                        border: "1px solid rgba(0,255,255,0.25)",
                        background: "rgba(0, 20, 50, 0.18)",
                        padding: "10px 12px",
                        marginBottom: 10,
                        boxShadow: "0 0 10px rgba(0, 191, 255, 0.15)",
                      }}
                    >
                      <label
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "flex-start",
                          color: task.completed ? "#00ffcc" : "#bffcff",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => togglePlannerTask(task.id)}
                          style={{ marginTop: 4, transform: "scale(1.2)", cursor: "pointer" }}
                        />
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          <div style={{ fontWeight: 700 }}>{task.label}</div>
                          <div style={{ fontSize: 12, opacity: 0.9 }}>
                            Due: <span style={{ color: "#00f0ff" }}>{dueText}</span>
                          </div>
                          <div style={{ fontSize: 12, opacity: 0.9 }}>
                            Priority:{" "}
                            <span style={{ color: "#00f0ff", fontWeight: 700 }}>
                              {String(task.priority || "medium").toUpperCase()}
                            </span>
                            {task.remindAt && (
                              <>
                                {" "}
                                • Remind:{" "}
                                <span style={{ color: "#00f0ff" }}>
                                  {new Date(task.remindAt).toLocaleString()}
                                </span>
                              </>
                            )}
                            {task.notified && (
                              <span style={{ marginLeft: 8, color: "#ffd700" }}>🔔 sent</span>
                            )}
                          </div>
                        </div>
                      </label>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="task-card right-card">
            <div style={{ marginTop: "40px", textAlign: "center", width: "100%" }}>
              <h2 style={{ color: "#bffcff", marginBottom: "16px" }}>Add Task</h2>

              <input
                type="text"
                className="input-glow"
                placeholder="New task..."
                value={newTaskLabel}
                onChange={(e) => setNewTaskLabel(e.target.value)}
                style={{ width: "80%", maxWidth: "320px" }}
              />

              <div style={{ marginTop: 14 }}>
                <div style={{ color: "#bffcff", marginBottom: 8 }}>Due date & time</div>
                <input
                  type="datetime-local"
                  value={newTaskDueAt}
                  onChange={(e) => setNewTaskDueAt(e.target.value)}
                  className="input-glow"
                  style={{ width: "80%", maxWidth: "320px" }}
                />
              </div>

              <div style={{ marginTop: 14 }}>
                <div style={{ color: "#bffcff", marginBottom: 8 }}>Priority</div>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value)}
                  style={{
                    width: "80%",
                    maxWidth: 320,
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1.5px solid rgba(0, 191, 255, 0.7)",
                    background: "rgba(0, 30, 60, 0.3)",
                    color: "#bffcff",
                    outline: "none",
                  }}
                >
                  <option value="low" style={{ background: "#001327" }}>
                    Low
                  </option>
                  <option value="medium" style={{ background: "#001327" }}>
                    Medium
                  </option>
                  <option value="high" style={{ background: "#001327" }}>
                    High
                  </option>
                </select>
              </div>

              <div style={{ marginTop: 14 }}>
                <div style={{ color: "#bffcff", marginBottom: 8 }}>Remind before (minutes)</div>
                <input
                  type="number"
                  min="0"
                  value={newTaskRemindMins}
                  onChange={(e) => setNewTaskRemindMins(e.target.value)}
                  className="input-glow"
                  style={{ width: "120px" }}
                />
              </div>

              <button
                onClick={addPlannerTask}
                style={{
                  marginTop: "18px",
                  padding: "10px 26px",
                  borderRadius: "999px",
                  border: "none",
                  fontSize: "16px",
                  cursor: "pointer",
                  background: "linear-gradient(90deg, rgba(0,255,255,0.9), rgba(0,180,255,0.9))",
                  color: "#001327",
                  boxShadow: "0 0 18px rgba(0,255,255,0.8)",
                }}
              >
                Add
              </button>

              <div style={{ marginTop: 12, color: "#bffcff", fontSize: 12, opacity: 0.9 }}>
                Tip: enable notifications on the left to receive reminders.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
