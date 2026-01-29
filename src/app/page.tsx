"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import "./globals.css";

type Team = {
  id: number;
  name: string;
  logo: string;
};

export default function HomePage() {
  const [queryLeft, setQueryLeft] = useState("");
  const [queryRight, setQueryRight] = useState("");
  const [teamLeft, setTeamLeft] = useState<Team | null>(null);
  const [teamRight, setTeamRight] = useState<Team | null>(null);

  const [scoreLeft, setScoreLeft] = useState(0);
  const [scoreRight, setScoreRight] = useState(0);

  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [editingTimer, setEditingTimer] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchTeam = async (teamName: string, side: "left" | "right") => {
    if (!teamName) return;

    try {
      const res = await fetch(
        `https://v3.football.api-sports.io/teams?search=${teamName}`,
        {
          headers: {
            "X-RapidAPI-Key": process.env.NEXT_PUBLIC_API_FOOTBALL_KEY!,
            "X-RapidAPI-Host": process.env.NEXT_PUBLIC_API_FOOTBALL_HOST!,
          },
        }
      );
      const data = await res.json();
      const teamData = data.response[0]?.team;
      if (teamData) {
        const teamObj = { id: teamData.id, name: teamData.name, logo: teamData.logo };
        side === "left" ? setTeamLeft(teamObj) : setTeamRight(teamObj);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev === 59) {
          setMinutes((m) => m + 1);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const resetTimer = () => {
    stopTimer();
    setMinutes(0);
    setSeconds(0);
    setEditingTimer(true);
  };

  useEffect(() => {
    if (!editingTimer) startTimer();
    else stopTimer();
    return () => stopTimer();
  }, [editingTimer]);

  const handleEdit = (side: "left" | "right" | "timer") => {
    if (side === "left") setTeamLeft(null);
    if (side === "right") setTeamRight(null);
    if (side === "timer") setEditingTimer(true);
  };

  return (
    <div className="container">
      {/* LEFT TEAM */}
      <div className="teamContainer" onDoubleClick={() => handleEdit("left")}>
        {!teamLeft ? (
          <>
            <input
              type="text"
              placeholder="Left team..."
              value={queryLeft}
              onChange={(e) => setQueryLeft(e.target.value)}
            />
            <button onClick={() => fetchTeam(queryLeft, "left")}>Search</button>
          </>
        ) : (
          <>
            <Image src={teamLeft.logo} alt={teamLeft.name} width={150} height={150} />
            <p>{teamLeft.name}</p>
            <label>
              Score:{" "}
              <input
                type="number"
                value={scoreLeft}
                onChange={(e) => setScoreLeft(Number(e.target.value) || 0)}
              />
            </label>
          </>
        )}
      </div>

      {/* TIMER */}
      <div className="timerContainer" onDoubleClick={() => handleEdit("timer")}>
        {editingTimer ? (
          <>
            <input
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value) || 0)}
              placeholder="Min"
            />
            <input
              type="number"
              value={seconds}
              onChange={(e) => setSeconds(Number(e.target.value) || 0)}
              placeholder="Sec"
            />
            <button onClick={() => setEditingTimer(false)}>Start</button>
          </>
        ) : (
          <>
            <h2>{minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}</h2>
            <button onClick={stopTimer}>Pause</button>
            <button onClick={resetTimer}>Reset</button>
          </>
        )}
      </div>

      {/* RIGHT TEAM */}
      <div className="teamContainer" onDoubleClick={() => handleEdit("right")}>
        {!teamRight ? (
          <>
            <input
              type="text"
              placeholder="Right team..."
              value={queryRight}
              onChange={(e) => setQueryRight(e.target.value)}
            />
            <button onClick={() => fetchTeam(queryRight, "right")}>Search</button>
          </>
        ) : (
          <>
            <Image src={teamRight.logo} alt={teamRight.name} width={150} height={150} />
            <p>{teamRight.name}</p>
            <label>
              Score:{" "}
              <input
                type="number"
                value={scoreRight}
                onChange={(e) => setScoreRight(Number(e.target.value) || 0)}
              />
            </label>
          </>
        )}
      </div>
    </div>
  );
}
