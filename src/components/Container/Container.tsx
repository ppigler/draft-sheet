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
import { useHotkeys } from "react-hotkeys-hook";

const Container = () => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const {
    picks,
    setPicks,
    isDraftMode,
    positionFilter,
    handleSetPositionFilter,
  } = useContext(DraftContext);
  const [playerOrder, setPlayerOrder] = useState<number[]>([]);
  const [tierBreaks, setTierBreaks] = useState<number[]>([]);
  useEffect(() => {
    if (localStorage.getItem("players"))
      setPlayerOrder(JSON.parse(localStorage.getItem("players")!) as number[]);
    else {
      setPlayerOrder(PlayerADP.map((p) => p.id));
    }
    if (localStorage.getItem("tierBreaks")) {
      const tiers = JSON.parse(localStorage.getItem("tierBreaks")!) as number[];
      setTierBreaks(tiers.sort((a, b) => a - b));
    }
  }, []);
  useHotkeys("f", () => {
    console.log("f pressed");
  });
  useHotkeys("q", () => {
    handleSetPositionFilter("QB");
  });
  useHotkeys("d", () => {
    handleSetPositionFilter("DST");
  });
  useHotkeys("t", () => {
    handleSetPositionFilter("TE");
  });
  useHotkeys("r", () => {
    handleSetPositionFilter("RB");
  });
  useHotkeys("w", () => {
    handleSetPositionFilter("WR");
  });
  useHotkeys("a", () => {
    handleSetPositionFilter("");
  });
  useHotkeys("enter", () => {
    console.log("enter pressed");
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      setPlayerOrder((player) => {
        console.log({ active, over });
        const oldIndex = player.indexOf(active.id as number);
        const newIndex = player.indexOf(over.id as number);
        const newOrder = [...player];
        newOrder.splice(oldIndex, 1);
        newOrder.splice(newIndex, 0, active.id as number);
        localStorage.setItem("players", JSON.stringify(newOrder));
        return newOrder;
      });
    }
  };

  const handlePicked = (id: number) => {
    setPicks((prevPicks) => {
      const picks = [...prevPicks, id];
      localStorage.setItem("picks", JSON.stringify(picks));
      return picks;
    });
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
          {playerOrder.map((id, playerOrder) => {
            const player = PlayerADP.find((p) => p.id === id);
            if (!player) return null;

            // filter
            const position = player.pos.replace(/\d+/g, "");
            if (positionFilter && position !== positionFilter) return null;
            return (
              <Player
                {...player}
                picked={picks.includes(id)}
                key={id}
                handlePicked={() => handlePicked(id)}
                handleAddTierBreak={() => handleAddTierBreak(playerOrder)}
                tier={tierBreaks.findIndex((tier) => tier === playerOrder) + 1}
              />
            );
          })}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={playerOrder}
            strategy={verticalListSortingStrategy}
          >
            {playerOrder.map((id, playerOrder) => {
              const player = PlayerADP.find((p) => p.id === id);
              if (!player) return null;
              return (
                <Player
                  {...player}
                  picked={picks.includes(id)}
                  key={id}
                  handlePicked={() => handlePicked(id)}
                  handleAddTierBreak={() => handleAddTierBreak(playerOrder)}
                  tier={
                    tierBreaks.findIndex((tier) => tier === playerOrder) + 1
                  }
                />
              );
            })}
          </SortableContext>
        </DndContext>
      )}
    </>
  );
};

export default Container;
