"use client";

import { useSortable } from "@dnd-kit/sortable";
import PlayerADP from "@/data/playeradp.json";
import { CSS } from "@dnd-kit/utilities";
import { Button, Card, CardBody, Checkbox, Chip } from "@heroui/react";
import { useContext } from "react";
import { DraftContext } from "@/app/providers";
import { FaBomb, FaRocket } from "react-icons/fa";

export const positions: Record<string, string> = {
  QB: "rgba(239, 116, 161, 0.8)",
  RB: "#8ff2cacc",
  WR: "#56c9f8cc",
  TE: "#feae58cc",
  DST: "#bf755dcc",
};

export const Player = ({
  id,
  playerName,
  pos,
  team,
  byeWeek,
  tier,
  picked,
  handlePicked,
  handleAddTierBreak,
}: PlayerProps) => {
  const { isDraftMode, playerMarkers, togglePlayerMarker } =
    useContext(DraftContext);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const position = pos.replace(/\d+/g, "");
  const positionADP = pos.replace(position, "");
  const markers = playerMarkers[id] || [];
  return (
    <>
      <Card
        ref={setNodeRef}
        className={["my-1", picked ? "bg-[lightgrey]" : ""].join(" ")}
        {...(!isDraftMode
          ? {
              ...attributes,
              ...listeners,
              style: {
                transform: CSS.Transform.toString(transform),
                transition,
              },
            }
          : {})}
      >
        <CardBody className="flex flex-row justify-between">
          <div
            className={[
              "flex flex-row gap-2 pt-0 items-center",
              picked ? "line-through" : "",
            ].join(" ")}
          >
            <Checkbox isSelected={picked} onValueChange={handlePicked} />
            <Chip style={{ backgroundColor: positions[position] }}>
              {position}
            </Chip>
            <div className="flex flex-col gap-1">
              <p>{playerName}</p>
              <p className="text-xs text-gray-500">
                {team} ({byeWeek}){positionADP && <> - PADP: {positionADP}</>}
              </p>
            </div>
          </div>

          <div className="flex flex-row gap-4 text-xs items-center">
            <div className="flex flex-row gap-1">
              {(!isDraftMode || markers.includes("value")) && (
                <Button
                  disabled={isDraftMode}
                  variant={isDraftMode ? "flat" : "ghost"}
                  onPress={() => togglePlayerMarker(id, "value")}
                  size="sm"
                  isIconOnly
                  color={markers === "value" ? "success" : undefined}
                >
                  <FaRocket />
                </Button>
              )}
              {(!isDraftMode || markers.includes("avoid")) && (
                <Button
                  variant={isDraftMode ? "flat" : "ghost"}
                  disabled={isDraftMode}
                  onPress={() => togglePlayerMarker(id, "avoid")}
                  size="sm"
                  isIconOnly
                  color={markers === "avoid" ? "danger" : undefined}
                >
                  <FaBomb />
                </Button>
              )}
            </div>
            <Button size="sm" onPress={handleAddTierBreak}>
              Tier break
            </Button>
          </div>
        </CardBody>
      </Card>
      {tier ? (
        <div className="text-center text-xs h-4 w-full bg-blue-100 rounded-md">
          Tier {tier + 1}
        </div>
      ) : null}
    </>
  );
};

type PlayerProps = (typeof PlayerADP)[number] & {
  tier: number;
  picked: boolean;
  handlePicked: () => void;
  handleAddTierBreak: () => void;
};
