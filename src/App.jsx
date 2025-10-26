import React, { useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import myphoto from "./assets/1.jpg";
import "./App.css";

function App() {
  const [activeView, setActiveView] = useState("none");
  const [inputValue, setInputValue] = useState(""); // user input (x)
  const [percentage, setPercentage] = useState(0); // computed y value

  // 🧮 input handler → calculate y = -2.5(x - 100)
  const handleChange = (e) => {
    const x = parseFloat(e.target.value);
    setInputValue(e.target.value);

    if (!isNaN(x)) {
      let y = -2.5 * (x - 100);
      // Clamp between 0–100 to avoid overflow in bar
      y = Math.max(0, Math.min(100, y));
      setPercentage(y);
    } else {
      setPercentage(0);
    }
  };

  // ✅ Checkboxes that control the second circular progress bar
  const [tasks, setTasks] = useState([
    //daily routine
    { id: 1, label: "Push ups", completed: false, section: "fitness" },
    { id: 2, label: "Pull ups", completed: false, section: "fitness" },
    { id: 3, label: "Bicep curls", completed: false, section: "fitness" },
    
    //
    { id: 4, label: "Concentration curls", completed: false, section: "fitness" },
    { id: 5, label: "Hammer curls", completed: false, section: "fitness" },
    { id: 6, label: "Meditation", completed: false, section: "wellness" },
    { id: 7, label: "Drink water", completed: false, section: "morning" },
    { id: 7, label: "Drink water", completed: false, section: "morning" },
  ]);

  // Calculate completion % based on checked boxes
  const completedCount = tasks.filter((t) => t.completed).length;
  const secondPercentage = (completedCount / tasks.length) * 100;

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
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
          {/* LEFT BOX → Circular Progress Bars */}
          <div className="task-card left-card" style={{ position: "relative" }}>
            {/* First Circular Bar (Formula-based) */}
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
                  pathTransitionDuration: 0.7,
                })}
              />
            </div>

            {/* Second Circular Bar (Checkbox-based) */}
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
                  pathTransitionDuration: 0.7,
                })}
              />
            </div>
          </div>

          {/* RIGHT BOX → Input & Checkboxes */}
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

              {/* Input for formula */}
              <input
                id="xValue"
                type="number"
                value={inputValue}
                onChange={handleChange}
                className="input-glow"
              />

              {/* Checkboxes grouped into sections */}
              <div style={{ marginTop: "30px", textAlign: "left" }}>
                

                {/* Daily Routine */}
                <div style={{ marginBottom: "15px" }}>
                  <h3 style={{ color: "#00ffff" }}>Daily Routine</h3>
                  {tasks
                    .filter((t) => t.section === "daily routine")
                    .map((task) => (
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

                {/* Biceps */}
                <div style={{ marginBottom: "15px" }}>
                  <h3 style={{ color: "#ffcc00" }}>Bicep</h3>
                  {tasks
                    .filter((t) => t.section === "fitness")
                    .map((task) => (
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

                <div style={{ marginBottom: "15px" }}>
                  <h3 style={{ color: "#00ffff" }}>Triceps</h3>
                  {tasks
                    .filter((t) => t.section === "daily routine")
                    .map((task) => (
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
                
                <div style={{ marginBottom: "15px" }}>
                  <h3 style={{ color: "#00ffff" }}>Abs</h3>
                  {tasks
                    .filter((t) => t.section === "daily routine")
                    .map((task) => (
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

                {/* 🧘Shoulder */}
                <div style={{ marginBottom: "15px" }}>
                  <h3 style={{ color: "#ff88ff" }}>Shoulder</h3>
                  {tasks
                    .filter((t) => t.section === "wellness")
                    .map((task) => (
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
