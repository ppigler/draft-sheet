"use client";

import { HeroUIProvider } from "@heroui/react";
import { useRouter } from "next/navigation";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { getSleeperPicks } from "./actions";
import PlayerADP from "@/data/playeradp.json";

export const DraftContext = createContext<{
  picks: number[];
  isDraftMode: boolean;
  playerMarkers: Record<number, "value" | "avoid">;
  setPicks: Dispatch<SetStateAction<number[]>>;
  resetPicks: () => void;
  setIsDraftMode: Dispatch<SetStateAction<boolean>>;
  togglePlayerMarker: (id: number, value: "value" | "avoid") => void;
  positionFilter: "" | "QB" | "WR" | "RB" | "TE" | "DST";
  handleSetPositionFilter: (
    position: "" | "QB" | "WR" | "RB" | "TE" | "DST"
  ) => void;
  draftId?: string;
  setDraftId: Dispatch<SetStateAction<string>>;
  syncPicks: () => void;
}>({
  picks: [],
  isDraftMode: true,
  playerMarkers: {},
  setPicks: () => {},
  resetPicks: () => void 0,
  setIsDraftMode: () => {},
  togglePlayerMarker: () => {},
  positionFilter: "",
  handleSetPositionFilter: () => {},
  draftId: "",
  setDraftId: () => {},
  syncPicks: () => {},
});

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [positionFilter, setPositionFilter] = useState<
    "" | "QB" | "WR" | "RB" | "TE" | "DST"
  >("");
  const [picks, setPicks] = useState<number[]>([]);
  const [isDraftMode, setIsDraftMode] = useState(false);
  const resetPicks = () => setPicks([]);
  const [playerMarkers, setPlayerMarkers] = useState<
    Record<number, "value" | "avoid">
  >({});
  const [draftId, setDraftId] = useState<string>("");

  useEffect(() => {
    if (localStorage.getItem("picks"))
      setPicks(JSON.parse(localStorage.getItem("picks")!) as number[]);
    if (localStorage.getItem("playerMarkers"))
      setPlayerMarkers(
        JSON.parse(localStorage.getItem("playerMarkers")!) as Record<
          number,
          "value" | "avoid"
        >
      );
  }, []);

  const togglePlayerMarker = (id: number, value: "value" | "avoid") => {
    setPlayerMarkers((prev) => {
      const { [id]: current, ...rest } = prev;
      if (current === value) {
        localStorage.setItem("playerMarkers", JSON.stringify(rest));
        return rest;
      }
      localStorage.setItem(
        "playerMarkers",
        JSON.stringify({ ...rest, [id]: value })
      );
      return { ...rest, [id]: value };
    });
  };

  const handleSetPositionFilter = (
    position: "" | "QB" | "WR" | "RB" | "TE" | "DST"
  ) => {
    setPositionFilter((activePostion) =>
      activePostion === position ? "" : position
    );
  };

  const syncPicks = async () => {
    const picks = await getSleeperPicks(draftId);
    const matchedPicks = PlayerADP.filter((player) =>
      picks?.some(
        (pick) =>
          `${pick.metadata.first_name} ${pick.metadata.last_name}` ===
          player.playerName
      )
    ).map((player) => player.id);
    localStorage.setItem("picks", JSON.stringify(matchedPicks));
    setPicks(matchedPicks);
  };

  return (
    <DraftContext
      value={{
        picks,
        setPicks,
        resetPicks,
        isDraftMode,
        setIsDraftMode,
        playerMarkers,
        togglePlayerMarker,
        positionFilter,
        handleSetPositionFilter,
        draftId,
        setDraftId,
        syncPicks,
      }}
    >
      <HeroUIProvider navigate={router.push}>{children}</HeroUIProvider>
    </DraftContext>
  );
};
