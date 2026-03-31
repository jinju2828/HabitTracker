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

const HabitManager: React.FC<Props> = ({ allLogs, refetchLogs }) => {
  const { habits, fetchHabits } = useHabits();

  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // 🔹 Optimistic UI용 local state
  const [localCompleted, setLocalCompleted] = useState<Record<number, boolean>>({});

  const todayStr = getTodayString();

  // 🔥 오늘 로그 map
  const todayMap = useMemo(() => {
    const map: Record<number, { id: number; completed: boolean }> = {};
    allLogs.forEach((log) => {
      // const date = new Date(log.log_date);
      // const yyyy = date.getFullYear();
      // const mm = String(date.getMonth() + 1).padStart(2, "0");
      // const dd = String(date.getDate()).padStart(2, "0");
      // const logStr = `${yyyy}-${mm}-${dd}`;
      const logStr = log.log_date.slice(0, 10);
      if (logStr === todayStr) {
        map[log.habit_id] = { id: log.id, completed: log.completed };
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
    await refetchLogs();
    // 삭제된 habit 체크박스도 삭제
    setLocalCompleted((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  // ✅ Toggle (Optimistic UI)
  const handleToggle = async (habitId: number, checked: boolean) => {
    if (togglingId === habitId) return;

    setTogglingId(habitId);
    // 즉시 UI 반영
    setLocalCompleted((prev) => ({ ...prev, [habitId]: checked }));

    try {
      const todayLog = todayMap[habitId];
      if (todayLog?.id) {
        await updateHabitLog(todayLog.id, checked);
      } else {
        await createHabitLog(habitId, todayStr, checked);
      }
      await refetchLogs();
    } catch (err) {
      console.error("Toggle error:", err);
      // 오류 시 롤백
      setLocalCompleted((prev) => ({ ...prev, [habitId]: !checked }));
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="habit-manager">
      {/* Add */}
      <form onSubmit={handleAdd} style={{ display: "flex", gap: 8 }}>
        <input
          className="add-habit"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Add New Habit"
          style={{ flex: 1 }}
        />
        <button className="btn-habit-add" type="submit">Add</button>
      </form>

      {/* List */}
      {habits.map((habit) => {
        // 🔹 Optimistic UI 적용
        const isCompleted =
          localCompleted[habit.id] ?? todayMap[habit.id]?.completed ?? false;

        return (
          <div key={habit.id} className="form-container">
            {/* Left */}
            <div style={{ flex: 1 }}>
              {editingId === habit.id ? (
                <div className="input-container">
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                  />
                  <div className="button-container">
                    <button
                      className="save-button"
                      onClick={() => handleUpdate(habit.id)}
                    >
                      💾
                    </button>
                    <button
                      className="cancel-button"
                      onClick={() => setEditingId(null)}
                    >
                      ❌
                    </button>
                  </div>
                </div>
              ) : (
                <div className="input-container">
                  <span
                    className={isCompleted ? "completed" : "not-completed"}
                  >
                    {habit.name}
                  </span>
                  <div className="button-container">
                    <button
                      className="edit-button"
                      onClick={() => {
                        setEditingId(habit.id);
                        setEditingName(habit.name);
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      className="delete-button"
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
              className="checkbox"
              type="checkbox"
              checked={isCompleted}
              disabled={togglingId === habit.id}
              onChange={(e) => handleToggle(habit.id, e.target.checked)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default HabitManager;