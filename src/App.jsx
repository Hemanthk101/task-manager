import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import myphoto from "./assets/1.jpg";
import "./App.css";

function App() {
  const [activeView, setActiveView] = useState("none");
  const [inputValue, setInputValue] = useState("");
  const [percentage, setPercentage] = useState(0);

  // Tasks view state
  const [newTaskLabel, setNewTaskLabel] = useState("");
  const [plannerTasks, setPlannerTasks] = useState([]);

  // 👉 Muscle progress counting: 0–31
  const MAX_SESSIONS = 31;

  // 🔹 LOAD saved weight on mount and recompute the percentage
  useEffect(() => {
    const savedWeight = localStorage.getItem("weightInput");
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

  // 🔹 SAVE weight whenever it changes
  useEffect(() => {
    localStorage.setItem("weightInput", inputValue);
  }, [inputValue]);

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

  const GlowCircle = ({
    value,
    ringColor,
    textColor = "#bffcff",
    barSize = 200,
  }) => {
    const wrapperStyle = {
      width: "200px",
      height: "200px",
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

  // 🧮 weight → percentage
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

  // Body tasks
  const [tasks, setTasks] = useState([
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
  ]);

  // progress is integer 0–31
  const [progress, setProgress] = useState({
    biceps: 0,
    shoulders: 0,
    triceps: 0,
    abs: 0,
    forearms: 0,
  });

  // ---------- MIND VIEW: subjects + U1..U4 ----------
  const [mindSubjects, setMindSubjects] = useState([
    {
      id: "dsa",
      label: "DSA",
      units: [
        { id: "dsa-u1", label: "U1", completed: false },
        { id: "dsa-u2", label: "U2", completed: false },
        { id: "dsa-u3", label: "U3", completed: false },
        { id: "dsa-u4", label: "U4", completed: false },
      ],
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
    },
  ]);

  const toggleMindUnit = (subjectId, unitId) => {
    setMindSubjects((prev) =>
      prev.map((subj) =>
        subj.id !== subjectId
          ? subj
          : {
              ...subj,
              units: subj.units.map((unit) =>
                unit.id === unitId
                  ? { ...unit, completed: !unit.completed }
                  : unit
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

  // total completion for Mind circle
  const mindTotals = (() => {
    const totalUnits = mindSubjects.reduce(
      (sum, s) => sum + s.units.length,
      0
    );
    const completedUnits = mindSubjects.reduce(
      (sum, s) => sum + s.units.filter((u) => u.completed).length,
      0
    );
    return {
      totalUnits,
      completedUnits,
      percent: totalUnits === 0 ? 0 : (completedUnits / totalUnits) * 100,
    };
  })();

  // ---------- SKIN ----------
  const [skinTasks, setSkinTasks] = useState([
    { id: 1, label: "Body Wash", completed: false },
    { id: 2, label: "Face Wash", completed: false },
    { id: 3, label: "Clean", completed: false },
    { id: 4, label: "Face Serum", completed: false },
    { id: 5, label: "Eye Blow Cleaning", completed: false },
  ]);

  const [skinProgress, setSkinProgress] = useState({
    "Body Wash": 0,
    "Face Wash": 0,
    Clean: 0,
    "Face Serum": 0,
    "Eye Blow Cleaning": 0,
  });

  const toggleSkinTask = (id) => {
    setSkinTasks((prev) => {
      const updated = prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );

      const toggled = prev.find((t) => t.id === id);
      const nowCompleted = !toggled.completed;
      const key = toggled.label;

      setSkinProgress((p) => ({
        ...p,
        [key]: Math.min(Math.max(p[key] + (nowCompleted ? 20 : -20), 0), 100),
      }));

      return updated;
    });
  };

  // monthly reset of muscle progress
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("muscleProgress"));
    const savedMonth = localStorage.getItem("progressMonth");
    const currentMonth = new Date().getMonth();

    if (saved && parseInt(savedMonth, 10) === currentMonth) {
      setProgress(saved);
    } else {
      localStorage.removeItem("muscleProgress");
      localStorage.setItem("progressMonth", String(currentMonth));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("muscleProgress", JSON.stringify(progress));
  }, [progress]);

  // for second circle (body tasks completion %)
  const completedCount = tasks.filter((t) => t.completed).length;
  const secondPercentage = (completedCount / tasks.length) * 100;

  // ✅ BODY toggleTask – each check adds EXACTLY +1 (0–31) for the relevant muscles
  const toggleTask = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const nowCompleted = !task.completed;
    const label = task.label.toLowerCase();
    const absExercises = ["crunches", "crucifix", "russian twists"];

    // 1) update checkbox state
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: nowCompleted } : t
      )
    );

    // 2) update muscle counters
    if (nowCompleted) {
      setProgress((prev) => {
        const next = { ...prev };

        if (label.includes("bicep")) {
          next.biceps = Math.min(next.biceps + 1, MAX_SESSIONS);
        } else if (label.includes("shoulder")) {
          next.shoulders = Math.min(next.shoulders + 1, MAX_SESSIONS);
        } else if (label.includes("forearms")) {
          next.forearms = Math.min(next.forearms + 1, MAX_SESSIONS);
        } else if (label.includes("tricep")) {
          next.triceps = Math.min(next.triceps + 1, MAX_SESSIONS);
        }

        if (absExercises.includes(label)) {
          next.abs = Math.min(next.abs + 1, MAX_SESSIONS);
        }

        return next;
      });
    }
  };

  // planner helpers
  const togglePlannerTask = (id) => {
    setPlannerTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const addPlannerTask = () => {
    const label = newTaskLabel.trim();
    if (!label) return;

    setPlannerTasks((prev) => [
      ...prev,
      { id: Date.now(), label, completed: false },
    ]);
    setNewTaskLabel("");
  };

  // --- Styles ---
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
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div style={containerStyle}>
      {/* --- BUTTONS --- */}
      <button
        className="glow-btn"
        style={{ ...buttonStyle, top: "20%", left: "49.3%" }}
        onClick={() => setActiveView("Mind")}
      ></button>

      <button
        className="glow-btn"
        style={{ ...buttonStyle, top: "35%", left: "49.3%" }}
        onClick={() => setActiveView("Skin")}
      ></button>

      <button
        className="glow-btn"
        style={{ ...buttonStyle, top: "45%", left: "49.3%" }}
        onClick={() => setActiveView("Body")}
      ></button>

      <button
        className="glow-btn"
        style={{ ...buttonStyle, bottom: "6%", right: "49.3%" }}
        onClick={() => setActiveView("Tasks")}
      ></button>

      {/* --- BODY VIEW --- */}
      {activeView === "Body" && (
        <>
          <div className="task-card left-card" style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                top: "60px",
                left: "10px",
              }}
            >
              <GlowCircle
                value={percentage}
                ringColor="rgb(0,255,255)"
                textColor="#bffcff"
              />
            </div>

            <div
              style={{
                position: "absolute",
                top: "60px",
                left: "230px",
              }}
            >
              <GlowCircle
                value={secondPercentage}
                ringColor="#fff2a8"
                textColor="#fff2cc"
              />
            </div>

            <div
              style={{
                position: "absolute",
                top: "300px",
                left: "30px",
                width: "90%",
              }}
            >
              <h3 style={{ color: "#bffcff", textAlign: "center" }}>
                Muscle Progress
              </h3>
              <LinearBar
                label="💪 Biceps"
                value={progress.biceps}
                max={MAX_SESSIONS}
              />
              <LinearBar
                label="🏋️ Shoulders"
                value={progress.shoulders}
                max={MAX_SESSIONS}
              />
              <LinearBar
                label="🤜 Triceps"
                value={progress.triceps}
                max={MAX_SESSIONS}
              />
              <LinearBar
                label="🧘 Abs"
                value={progress.abs}
                max={MAX_SESSIONS}
              />
              <LinearBar
                label="✋ Forearms"
                value={progress.forearms}
                max={MAX_SESSIONS}
              />
            </div>
          </div>

          <div className="task-card right-card">
            <div style={{ marginTop: "30px", textAlign: "center" }}>
              <label
                htmlFor="xValue"
                style={{
                  color: "#bffcff",
                  fontSize: "20px",
                  fontWeight: "400",
                }}
              >
                Weight:
              </label>
              <input
                id="xValue"
                type="number"
                value={inputValue}
                onChange={handleChange}
                className="input-glow"
              />

              <div style={{ marginTop: "30px", textAlign: "left" }}>
                <h2 style={{ color: "#bffcff", textAlign: "center" }}>
                  Daily Tasks
                </h2>

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
                      style={{
                        marginRight: "10px",
                        transform: "scale(1.2)",
                        cursor: "pointer",
                      }}
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
            <div
              style={{
                position: "absolute",
                top: "60px",
                left: "110px",
              }}
            >
              {(() => {
                const total = mindTotals.percent;

                let ringColor = "#ff4d4d";
                if (total > 80) ringColor = "#00eaff";
                else if (total > 50) ringColor = "#00ff66";
                else if (total > 20) ringColor = "#ffd700";

                return (
                  <GlowCircle
                    value={total}
                    ringColor={ringColor}
                    textColor="#bffcff"
                  />
                );
              })()}
            </div>

            <div
              style={{
                position: "absolute",
                top: "300px",
                left: "30px",
                width: "90%",
              }}
            >
              <LinearBar label="📘 DSA" value={getSubjectPercent("dsa")} />
              <LinearBar label="💻 WT" value={getSubjectPercent("wt")} />
              <LinearBar label="⚙️ DDCO" value={getSubjectPercent("ddco")} />
              <LinearBar label="🧠 MCSE" value={getSubjectPercent("mcse")} />
              <LinearBar label="🧩 AFLL" value={getSubjectPercent("afll")} />
            </div>
          </div>

          <div className="task-card right-card">
            <div
              style={{
                marginTop: "30px",
                padding: "0 18px",
                width: "100%",
              }}
            >
              <h2
                style={{
                  color: "#bffcff",
                  textAlign: "center",
                  marginBottom: "20px",
                }}
              >
                Mind Tasks
              </h2>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "flex-start",
                  gap: 16, // tighter space between columns
                }}
              >
                {mindSubjects.map((subject) => (
                  <div
                    key={subject.id}
                    style={{
                      minWidth: "110px",
                    }}
                  >
                    <h3
                      style={{
                        color: "#bffcff",
                        marginBottom: "6px",
                      }}
                    >
                      {subject.label}
                    </h3>

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
                          style={{
                            marginRight: "10px",
                            transform: "scale(1.1)",
                            cursor: "pointer",
                          }}
                        />
                        {unit.label}
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* --- SKIN VIEW --- */}
      {activeView === "Skin" && (
        <>
          <div className="task-card left-card" style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                top: "60px",
                left: "110px",
              }}
            >
              {(() => {
                const total =
                  (skinTasks.filter((t) => t.completed).length /
                    skinTasks.length) *
                  100;

                return (
                  <GlowCircle
                    value={total}
                    ringColor="rgb(0,255,255)"
                    textColor="#bffcff"
                  />
                );
              })()}
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
                    style={{
                      marginRight: "10px",
                      transform: "scale(1.2)",
                      cursor: "pointer",
                    }}
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
            <div style={{ marginTop: "40px", padding: "20px", width: "100%" }}>
              <h2
                style={{
                  color: "#bffcff",
                  textAlign: "center",
                  marginBottom: "20px",
                }}
              >
                Your Tasks
              </h2>

              {plannerTasks.length === 0 ? (
                <p style={{ color: "#bffcff", textAlign: "center" }}>
                  No tasks yet. Add one on the right.
                </p>
              ) : (
                plannerTasks.map((task) => (
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
                      onChange={() => togglePlannerTask(task.id)}
                      style={{
                        marginRight: "10px",
                        transform: "scale(1.2)",
                        cursor: "pointer",
                      }}
                    />
                    {task.label}
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="task-card right-card">
            <div
              style={{ marginTop: "60px", textAlign: "center", width: "100%" }}
            >
              <h2 style={{ color: "#bffcff", marginBottom: "20px" }}>
                Add Task
              </h2>

              <input
                type="text"
                className="input-glow"
                placeholder="New task..."
                value={newTaskLabel}
                onChange={(e) => setNewTaskLabel(e.target.value)}
                style={{ width: "70%", maxWidth: "260px" }}
              />

              <button
                onClick={addPlannerTask}
                style={{
                  marginTop: "20px",
                  padding: "10px 26px",
                  borderRadius: "999px",
                  border: "none",
                  fontSize: "16px",
                  cursor: "pointer",
                  background:
                    "linear-gradient(90deg, rgba(0,255,255,0.9), rgba(0,180,255,0.9))",
                  color: "#001327",
                  boxShadow: "0 0 18px rgba(0,255,255,0.8)",
                }}
              >
                Add
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
