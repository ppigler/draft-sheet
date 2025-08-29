"use client";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useContext, useEffect, useState } from "react";
import PlayerADP from "@/data/playeradp.json";
import { Player } from "../Player/Player";
import { DraftContext } from "@/app/providers";

const Container = () => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const { picks, setPicks, isDraftMode } = useContext(DraftContext);
  const [players, setPlayers] = useState(
    PlayerADP.map((player, idx) => ({
      ...player,
      adp: idx + 1,
    }))
  );
  const [tierBreaks, setTierBreaks] = useState<number[]>([]);
  useEffect(() => {
    if (localStorage.getItem("players"))
      setPlayers(
        JSON.parse(
          localStorage.getItem("players")!
        ) as ((typeof PlayerADP)[number] & {
          tierBreak: boolean;
          adp: number;
        })[]
      );
    if (localStorage.getItem("tierBreaks")) {
      const tiers = JSON.parse(localStorage.getItem("tierBreaks")!) as number[];
      setTierBreaks(tiers.sort((a, b) => a - b));
    }
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = players.findIndex((player) => player.id === active.id);
      const newIndex = players.findIndex((player) => player.id === over.id);
      const newPlayers = [...players];
      newPlayers.splice(oldIndex, 1);
      newPlayers.splice(newIndex, 0, players[oldIndex]);
      localStorage.setItem("players", JSON.stringify(newPlayers));
      setPlayers(newPlayers);
    }
  };

  const handlePicked = (id: number) => {
    setPicks((prevPicks) => [...prevPicks, id]);
  };

  const handleAddTierBreak = (idx: number) => {
    setTierBreaks((prevTierBreaks) => {
      if (prevTierBreaks.includes(idx)) {
        return prevTierBreaks.filter((i) => i !== idx);
      }
      const updatedTierBreaks = [...prevTierBreaks, idx].sort();
      localStorage.setItem("tierBreaks", JSON.stringify(updatedTierBreaks));
      return updatedTierBreaks;
    });
  };

  return (
    <>
      <div className="text-center text-xs h-4 w-full bg-blue-100 rounded-md">
        Tier 1
      </div>
      {isDraftMode ? (
        <div>
          {players.map((player, idx) => (
            <Player
              {...player}
              picked={picks.includes(player.id)}
              key={player.id}
              handlePicked={() => handlePicked(player.id)}
              handleAddTierBreak={() => handleAddTierBreak(idx)}
              tier={tierBreaks.findIndex((tier) => tier === idx) + 1}
            />
          ))}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={players}
            strategy={verticalListSortingStrategy}
          >
            {players.map((player, idx) => (
              <Player
                {...player}
                picked={picks.includes(player.id)}
                key={player.id}
                handlePicked={() => handlePicked(player.id)}
                handleAddTierBreak={() => handleAddTierBreak(idx)}
                tier={tierBreaks.findIndex((tier) => tier === idx) + 1}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}
    </>
  );
};

export default Container;
