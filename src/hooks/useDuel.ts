import { useState, useEffect, useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, type Challenge } from "../db";
import { initialChallenges } from "../seedData";

export const useDuel = () => {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(
    null,
  );
  const [showClues, setShowClues] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const challenges = useLiveQuery(() => db.challenges.toArray());
  const resolvedCount = challenges?.filter((c) => c.isResolved).length || 0;
  const totalCount = challenges?.length || 0;

  // Sync Database with Seed Data
  useEffect(() => {
    const seed = async () => {
      const count = await db.challenges.count();
      if (count === 0) await db.challenges.bulkAdd(initialChallenges);
    };
    seed();
  }, []);

  // Memoized Filter Logic
  const filteredChallenges = useMemo(() => {
    if (!challenges) return [];
    return challenges.filter((c) => {
      const matchesCat =
        activeCategory === "All" || c.category === activeCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        query === "" ||
        c.title.toLowerCase().includes(query) ||
        c.subTopic.toLowerCase().includes(query) ||
        c.symptom.toLowerCase().includes(query);
      return matchesCat && matchesSearch;
    });
  }, [challenges, activeCategory, searchQuery]);

  // Actions
  const selectChallenge = (challenge: Challenge) => {
    setCurrentChallenge(challenge);
    setShowClues(false);
  };

  const triggerNextUnresolved = () => {
    const unresolved = challenges?.filter((c) => !c.isResolved) || [];
    if (unresolved.length === 0) {
      alert("SYSTEM SECURED: No unresolved incidents.");
      return;
    }
    const random = unresolved[Math.floor(Math.random() * unresolved.length)];
    selectChallenge(random);
  };

  const resolveCurrent = async () => {
    if (currentChallenge?.id) {
      await db.challenges.update(currentChallenge.id, { isResolved: true });
      setCurrentChallenge(null);
    }
  };

  const resetSystem = async () => {
    if (confirm("Reset mastery progress and logs?")) {
      await db.challenges.clear();
      window.location.reload();
    }
  };

  return {
    challenges,
    currentChallenge,
    setCurrentChallenge,
    showClues,
    setShowClues,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    resolvedCount,
    totalCount,
    filteredChallenges,
    selectChallenge,
    triggerNextUnresolved,
    resolveCurrent,
    resetSystem,
  };
};
