import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import myphoto from "./assets/1.jpg";
import "./App.css";

function App() {
  const [activeView, setActiveView] = useState("none");
  const [inputValue, setInputValue] = useState("");
  const [percentage, setPercentage] = useState(0);

  // ---------------------------------
  // util: convert "#rrggbb" or "rgb(r,g,b)" → rgba(r,g,b,a)
  // ---------------------------------
  function hexToRgba(color, alpha) {
    // already rgb(...) ?
    if (color.startsWith("rgb")) {
      const nums = color
        .replace(/rgba?\(/, "")
        .replace(")", "")
        .split(",")
        .map((n) => parseFloat(n.trim()));
      const [r, g, b] = nums;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // assume hex
    let c = color.replace("#", "");
    if (c.length === 3) {
      // e.g. #fc0 => #ffcc00
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

  // ---------------------------------
  // GlowCircle component
  // - value: number 0-100
  // - ringColor: stroke color of the arc
  // - textColor: % text color
  // ---------------------------------
  const GlowCircle = ({ value, ringColor, textColor = "#bffcff" }) => {
    const wrapperStyle = {
      width: "200px",
      height: "200px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      // inner bloom uses ringColor
      background: `radial-gradient(
        circle at 50% 50%,
        ${hexToRgba(ringColor, 0.18)} 0%,
        rgba(0,0,0,0) 70%
      )`,

      // multi-layer glow based on ringColor
      boxShadow: `
        0 0 20px  ${hexToRgba(ringColor, 1)},
        0 0 60px  ${hexToRgba(ringColor, 0.8)},
        0 0 120px ${hexToRgba(ringColor, 0.5)},
        0 0 200px ${hexToRgba(ringColor, 0.25)}
      `,
    };

    return (
      <div style={wrapperStyle}>
        <div style={{ width: "160px", height: "160px" }}>
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

  // 🧮 input handler → calculate y = -2.5(x - 100)
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

  // ✅ All checkboxes together
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
  ]);

  // ✅ Linear progress state
  const [progress, setProgress] = useState({
    biceps: 0,
    shoulders: 0,
    triceps: 0,
    abs: 0,
    forearms: 0,
  });

  // ✅ Mind task list
  const [mindTasks, setMindTasks] = useState([
    { id: 1, label: "DSA", completed: false },
    { id: 2, label: "WT", completed: false },
    { id: 3, label: "DDCO", completed: false },
    { id: 4, label: "MCSE", completed: false },
    { id: 5, label: "AFLL", completed: false },
  ]);

  // ✅ Mind progress for each subject
  const [mindProgress, setMindProgress] = useState({
    dsa: 0,
    wt: 0,
    ddco: 0,
    mcse: 0,
    afll: 0,
  });

  // ✅ Skin task list
  const [skinTasks, setSkinTasks] = useState([
    { id: 1, label: "Body Wash", completed: false },
    { id: 2, label: "Face Wash", completed: false },
    { id: 3, label: "Clean", completed: false },
    { id: 4, label: "Face Serum", completed: false },
    { id: 5, label: "Eye Blow Cleaning", completed: false },
  ]);

  // ✅ Skin progress for each task
  const [skinProgress, setSkinProgress] = useState({
    "Body Wash": 0,
    "Face Wash": 0,
    "Clean": 0,
    "Face Serum": 0,
    "Eye Blow Cleaning": 0,
  });

  // ✅ Update logic for individual Mind tasks
  const toggleMindTask = (id) => {
    setMindTasks((prev) => {
      const updated = prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );

      const toggled = prev.find((t) => t.id === id);
      const nowCompleted = !toggled.completed;
      const key = toggled.label.toLowerCase();

      setMindProgress((p) => ({
        ...p,
        [key]: Math.min(Math.max(p[key] + (nowCompleted ? 20 : -20), 0), 100),
      }));

      return updated;
    });
  };

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

  // Reset monthly
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("muscleProgress"));
    const savedMonth = localStorage.getItem("progressMonth");
    const currentMonth = new Date().getMonth();

    if (saved && parseInt(savedMonth) === currentMonth) {
      setProgress(saved);
    } else {
      localStorage.removeItem("muscleProgress");
      localStorage.setItem("progressMonth", currentMonth);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("muscleProgress", JSON.stringify(progress));
  }, [progress]);

  // Calculate completion % based on checked boxes
  const completedCount = tasks.filter((t) => t.completed).length;
  const secondPercentage = (completedCount / tasks.length) * 100;

  // ✅ Toggle task and increment bars
  const toggleTask = (id) => {
    setTasks((prev) => {
      const updatedTasks = prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );

      const toggledTask = prev.find((t) => t.id === id);
      const nowCompleted = !toggledTask.completed;

      // --- Biceps / Shoulders / Triceps / Forearms logic ---
      if (nowCompleted) {
        if (toggledTask.label.toLowerCase().includes("bicep")) {
          setProgress((p) => ({
            ...p,
            biceps: Math.min(p.biceps + 1, 30),
          }));
        } else if (toggledTask.label.toLowerCase().includes("shoulder")) {
          setProgress((p) => ({
            ...p,
            shoulders: Math.min(p.shoulders + 1, 30),
          }));
        } else if (toggledTask.label.toLowerCase().includes("forearms")) {
          setProgress((p) => ({
            ...p,
            forearms: Math.min(p.forearms + 1, 30),
          }));
        } else if (toggledTask.label.toLowerCase().includes("tricep")) {
          setProgress((p) => ({
            ...p,
            triceps: Math.min(p.triceps + 1, 30),
          }));
        }
      }

      // ✅ Enhanced ABS logic
      const absExercises = ["crunches", "crucifix", "russian twists"];
      const absCount = updatedTasks.filter(
        (t) => absExercises.includes(t.label.toLowerCase()) && t.completed
      ).length;

      // calculate fractional increment
      const absIncrement = absCount === 3 ? 1 : absCount * (1 / 3);

      setProgress((p) => {
        let newAbs = p.abs;

        if (absCount > 0) {
          newAbs = Math.min(p.abs + absIncrement, 100);
        } else if (absCount === 0) {
          newAbs = p.abs;
        }

        return { ...p, abs: newAbs };
      });

      return updatedTasks;
    });
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

  // 🔙 original button style
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

  // Shared LinearBar (with dynamic color + 100% pulse via CSS class)
  const LinearBar = ({ label, value }) => {
    let color = "#ff4d4d"; // red
    if (value > 80) color = "#00eaff"; // cyan-blue
    else if (value > 50) color = "#00ff66"; // green
    else if (value > 20) color = "#ffd700"; // yellow

    const isFull = value >= 100;

    return (
      <div style={{ margin: "10px 0" }}>
        <span style={{ color: "#bffcff", fontSize: "16px" }}>{label}</span>
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
              width: `${value}%`,
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
            {/* first circle = percentage (weight progress) */}
            <div
              style={{
                position: "absolute",
                top: "60px",
                left: "30px",
                
              }}
            >
              <GlowCircle
                value={percentage}
                ringColor="rgb(0,255,255)" // cyan glow
                textColor="#bffcff"
              />
            </div>

            {/* second circle = tasks % */}
            <div
              style={{
                position: "absolute",
                top: "60px",
                left: "260px",
              }}
            >
              <GlowCircle
                value={secondPercentage}
                ringColor="#fff2a8" // soft yellow / warm glow
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
              <LinearBar label="💪 Biceps" value={progress.biceps} />
              <LinearBar label="🏋️ Shoulders" value={progress.shoulders} />
              <LinearBar label="🤜 Triceps" value={progress.triceps} />
              <LinearBar label="🧘 Abs" value={progress.abs} />
              <LinearBar label="✋ Forearms" value={progress.forearms} />
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
                const total =
                  (mindTasks.filter((t) => t.completed).length /
                    mindTasks.length) *
                  100;

                // pick stroke / glow color based on completion %
                let ringColor = "#ff4d4d"; // red default
                if (total > 80) ringColor = "#00eaff";      // cyan
                else if (total > 50) ringColor = "#00ff66"; // green
                else if (total > 20) ringColor = "#ffd700"; // yellow

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
              <h3 style={{ color: "#bffcff", textAlign: "center" }}>
                Mind Progress
              </h3>
              <LinearBar label="📘 DSA" value={mindProgress.dsa} />
              <LinearBar label="💻 WT" value={mindProgress.wt} />
              <LinearBar label="⚙️ DDCO" value={mindProgress.ddco} />
              <LinearBar label="🧠 MCSE" value={mindProgress.mcse} />
              <LinearBar label="🧩 AFLL" value={mindProgress.afll} />
            </div>
          </div>

          <div className="task-card right-card skin-task-row">
            <div style={{ marginTop: "30px", textAlign: "center" }}>
              <h2 style={{ color: "#bffcff", textAlign: "center" }}>Tasks:</h2>

              {mindTasks.map((task) => (
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
                    onChange={() => toggleMindTask(task.id)}
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
                    ringColor="rgb(0,255,255)" // cyan/teal vibe
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
          <div className="task-card left-card"></div>
          <div className="task-card right-card"></div>
        </>
      )}
    </div>
  );
}

export default App;
