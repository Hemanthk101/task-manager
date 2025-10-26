import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import myphoto from "./assets/1.jpg";
import "./App.css";

function App() {
  const [activeView, setActiveView] = useState("none");
  const [inputValue, setInputValue] = useState("");
  const [percentage, setPercentage] = useState(0);

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
  ]);

  // ✅ Linear progress state
  const [progress, setProgress] = useState({
    biceps: 0,
    shoulders: 0,
    triceps: 0,
    abs: 0,
  });

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

      // --- Biceps / Shoulders / Triceps logic ---
      if (nowCompleted) {
        if (toggledTask.label.toLowerCase().includes("bicep")) {
          setProgress((p) => ({
            ...p,
            biceps: Math.min(p.biceps + 10, 100),
          }));
        } else if (toggledTask.label.toLowerCase().includes("shoulder")) {
          setProgress((p) => ({
            ...p,
            shoulders: Math.min(p.shoulders + 10, 100),
          }));
        } else if (toggledTask.label.toLowerCase().includes("tricep")) {
          setProgress((p) => ({
            ...p,
            triceps: Math.min(p.triceps + 10, 100),
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

        // When all done, +1; else fractional add
        if (absCount > 0) {
          newAbs = Math.min(p.abs + absIncrement, 100);
        } else if (absCount === 0) {
          newAbs = p.abs; // stays same if none checked
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

  const LinearBar = ({ label, value, color }) => (
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
          style={{
            width: `${value}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${color}, cyan)`,
            transition: "width 0.4s ease",
            boxShadow: `0 0 8px ${color}`,
          }}
        ></div>
      </div>
    </div>
  );

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
                width: 200,
                position: "absolute",
                top: "60px",
                left: "10px",
              }}
            >
              <CircularProgressbar
                value={percentage}
                text={`${percentage.toFixed(1)}%`}
                styles={buildStyles({
                  textColor: "#bffcff",
                  pathColor: "rgba(0, 255, 255, 0.9)",
                  trailColor: "rgba(0, 80, 120, 0.4)",
                  textSize: "18px",
                })}
              />
            </div>

            <div
              style={{
                width: 200,
                position: "absolute",
                top: "60px",
                left: "230px",
              }}
            >
              <CircularProgressbar
                value={secondPercentage}
                text={`${Math.round(secondPercentage)}%`}
                styles={buildStyles({
                  textColor: "#fff2cc",
                  pathColor: "rgba(255, 255, 180, 0.9)",
                  trailColor: "rgba(255, 255, 255, 0.2)",
                  textSize: "18px",
                })}
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
              <LinearBar label="💪 Biceps" value={progress.biceps} color="#00eaff" />
              <LinearBar label="🏋️ Shoulders" value={progress.shoulders} color="#ffd700" />
              <LinearBar label="🤜 Triceps" value={progress.triceps} color="#ff6bff" />
              <LinearBar label="🧘 Abs" value={progress.abs} color="#00ff99" />
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
          <div className="task-card left-card"></div>
          <div className="task-card right-card"></div>
        </>
      )}

      {/* --- SKIN VIEW --- */}
      {activeView === "Skin" && (
        <>
          <div className="task-card left-card"></div>
          <div className="task-card right-card"></div>
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
