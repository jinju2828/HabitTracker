import React, { useEffect, useMemo, useState } from "react";
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
import { useAllHabitLogs } from "@/hooks/useAllHabitLogs";

const getTodayString = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const HabitManager: React.FC = () => {
  const { habits, fetchHabits } = useHabits();
  const { allLogs, refetch } = useAllHabitLogs();

  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const [togglingId, setTogglingId] = useState<number | null>(null);

  const todayStr = getTodayString();

  // 🔥 오늘 로그 map 생성
  const todayMap = useMemo(() => {
  const map: Record<number, { id: number; completed: boolean }> = {};

  allLogs.forEach((log) => {
    const logDate = new Date(log.log_date);
    const yyyy = logDate.getFullYear();
    const mm = String(logDate.getMonth() + 1).padStart(2, "0");
    const dd = String(logDate.getDate()).padStart(2, "0");
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
    fetchHabits();
  };

  // 💾 Update
  const handleUpdate = async (id: number) => {
    if (!editingName.trim()) return;

    await updateHabit(id, editingName);
    setEditingId(null);
    fetchHabits();
  };

  // 🗑 Delete
  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this habit?")) return;

    await deleteHabit(id);
    fetchHabits();
  };

  // ✅ Toggle (Optimistic + 중복 방지)
  const handleToggle = async (habitId: number, checked: boolean) => {
    if (togglingId === habitId) return;

    setTogglingId(habitId);

    try {
      const todayLog = todayMap[habitId];

      if (todayLog?.id) {
        await updateHabitLog(todayLog.id, checked);
      } else {
        await createHabitLog(habitId, todayStr, checked);
      }

      await refetch();
    } catch (err) {
      console.error("Toggle error", err);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div>
      {/* ➕ Add */}
      <form onSubmit={handleAdd} style={{ display: "flex", gap: 8 }}>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Add new habit"
          style={{ flex: 1 }}
        />
        <button type="submit">Add</button>
      </form>

      {/* 📋 List */}
      {habits.map((habit) => {
        const isCompleted = todayMap[habit.id]?.completed ?? false;

        return (
          <div
            key={habit.id}
            style={{
              border: "1px solid #ddd",
              padding: 12,
              marginTop: 12,
              borderRadius: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* 왼쪽 */}
            <div style={{ flex: 1 }}>
              {editingId === habit.id ? (
                <>
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                  />
                  <button onClick={() => handleUpdate(habit.id)}>Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <span
                    style={{
                      textDecoration: isCompleted ? "line-through" : "none",
                    }}
                  >
                    {habit.name}
                  </span>
                  <button
                    style={{ marginLeft: 8 }}
                    onClick={() => {
                      setEditingId(habit.id);
                      setEditingName(habit.name);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    style={{ marginLeft: 4 }}
                    onClick={() => handleDelete(habit.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>

            {/* 오른쪽 체크 */}
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
