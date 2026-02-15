import React, { useMemo, useState } from "react";
import {
  createHabit,
  updateHabit,
  deleteHabit,
} from "@/api/habitApi";
import {
  createHabitLog,
  updateHabitLog,
} from "@/api/habitLogsApi";
import { useHabits } from "@/hooks/useHabits";
// import type { HabitLog } from "@/api/habitLogsApi";
import type { HabitLog } from "@/utils/types";
import "../styles/HabitManager.css";

type Props = {
  allLogs: HabitLog[];
  refetchLogs: () => void;
};

const getTodayString = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const HabitManager: React.FC<Props> = ({
  allLogs,
  refetchLogs,
}) => {
  const { habits, fetchHabits } = useHabits();

  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const todayStr = getTodayString();

  // 🔥 오늘 로그 map
  const todayMap = useMemo(() => {
    const map: Record<number, { id: number; completed: boolean }> = {};

    allLogs.forEach((log) => {
      const date = new Date(log.log_date);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      const logStr = `${yyyy}-${mm}-${dd}`;

      if (logStr === todayStr) {
        map[log.habit_id] = {
          id: log.id,
          completed: log.completed,
        };
      }
    });

    return map;
  }, [allLogs, todayStr]);

  // ➕ Add
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    await createHabit({ name: newName });
    setNewName("");
    await fetchHabits();
  };

  // 💾 Update
  const handleUpdate = async (id: number) => {
    if (!editingName.trim()) return;

    await updateHabit(id, editingName);
    setEditingId(null);
    await fetchHabits();
  };

  // 🗑 Delete
  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this habit?")) return;

    await deleteHabit(id);
    await fetchHabits();
    await refetchLogs(); // 로그도 갱신
  };

  // ✅ Toggle
  const handleToggle = async (
    habitId: number,
    checked: boolean
  ) => {
    if (togglingId === habitId) return;

    setTogglingId(habitId);

    try {
      const todayLog = todayMap[habitId];

      if (todayLog?.id) {
        await updateHabitLog(todayLog.id, checked);
      } else {
        await createHabitLog(habitId, todayStr, checked);
      }

      await refetchLogs(); // 🔥 차트 즉시 업데이트
    } catch (err) {
      console.error("Toggle error:", err);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div>
      {/* Add */}
      <form onSubmit={handleAdd} style={{ display: "flex", gap: 8 }}>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Add new habit"
          style={{ flex: 1 }}
        />
        <button type="submit">Add</button>
      </form>

      {/* List */}
      {habits.map((habit) => {
        const isCompleted =
          todayMap[habit.id]?.completed ?? false;

        return (
          <div
            key={habit.id}
            className="form-container"
          >
            {/* Left */}
            <div style={{ flex: 1 }}>
              {editingId === habit.id ? (
                <div className="input-container">
                  <input
                    value={editingName}
                    onChange={(e) =>
                      setEditingName(e.target.value)
                    }
                  />
                  <div className="button-container">
                    <button className="save-button" onClick={() => handleUpdate(habit.id)}>
                      💾
                    </button>
                    <button className="cancel-button"
                      onClick={() => setEditingId(null)}
                    >
                      ❌
                    </button>
                  </div>
                </div>
              ) : (
                <div className="input-container">
                  <span
                    style={{
                      textDecoration: isCompleted
                        ? "line-through"
                        : "none",
                    }}
                  >
                    {habit.name}
                  </span>

                  <div className="button-container">
                    <button className="edit-button"
                      onClick={() => {
                        setEditingId(habit.id);
                        setEditingName(habit.name);
                      }}
                    >
                      ✏️
                    </button>
                    <button className="delete-button"
                      onClick={() => handleDelete(habit.id)}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Checkbox */}
            <input
              type="checkbox"
              checked={isCompleted}
              disabled={togglingId === habit.id}
              onChange={(e) =>
                handleToggle(habit.id, e.target.checked)
              }
            />
          </div>
        );
      })}
    </div>
  );
};

export default HabitManager;
