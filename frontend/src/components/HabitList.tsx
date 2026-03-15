import React, { useState, useMemo } from "react";
import { createHabit, updateHabit, deleteHabit } from "@/api/habitApi";
import { createHabitLog, updateHabitLog } from "@/api/habitLogsApi";
import { useHabits } from "@/hooks/useHabits";
import { useAllHabitLogs } from "@/hooks/useAllHabitLogs";
import { HabitCard } from "./HabitCard";
import "../styles/HabitList.css";

export const HabitList: React.FC = () => {
  const { habits, fetchHabits } = useHabits();
  const { allLogs, refetch } = useAllHabitLogs();

  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const todayStr = new Date().toLocaleDateString("en-CA");

  // 🔥 오늘 로그 map 만들기
  const todayLogMap = useMemo(() => {
    const map: Record<number, { id: number; completed: boolean }> = {};

    allLogs
      .filter((log) => log.log_date === todayStr)
      .forEach((log) => {
        map[log.habit_id] = { id: log.id, completed: log.completed };
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

  // ✅ Toggle
  const handleToggle = async (habitId: number, checked: boolean) => {
    const todayLog = todayLogMap[habitId];
    if (todayLog) {
      await updateHabitLog(todayLog.id, checked);
    } else {
      await createHabitLog(habitId, todayStr, checked);
    }
    refetch();
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
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

      {/* 📋 Habit Cards */}
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={{
            ...habit,
            isCompleted: todayLogMap[habit.id]?.completed ?? false,
          }}
          isEditing={editingId === habit.id}
          editingName={editingName}
          onEditStart={() => {
            setEditingId(habit.id);
            setEditingName(habit.name);
          }}
          onEditChange={setEditingName}
          onEditSave={() => handleUpdate(habit.id)}
          onEditCancel={() => setEditingId(null)}
          onDelete={() => handleDelete(habit.id)}
          onToggle={(checked) => handleToggle(habit.id, checked)}
        />
      ))}
    </div>
  );
};
