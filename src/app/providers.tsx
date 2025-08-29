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

export const DraftContext = createContext<{
  picks: number[];
  isDraftMode: boolean;
  playerMarkers: Record<number, "value" | "avoid">;
  setPicks: Dispatch<SetStateAction<number[]>>;
  resetPicks: () => void;
  setIsDraftMode: Dispatch<SetStateAction<boolean>>;
  togglePlayerMarker: (id: number, value: "value" | "avoid") => void;
}>({
  picks: [],
  isDraftMode: true,
  playerMarkers: {},
  setPicks: () => {},
  resetPicks: () => void 0,
  setIsDraftMode: () => {},
  togglePlayerMarker: () => {},
});

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [picks, setPicks] = useState<number[]>([]);
  const [isDraftMode, setIsDraftMode] = useState(false);
  const resetPicks = () => setPicks([]);
  const [playerMarkers, setPlayerMarkers] = useState<
    Record<number, "value" | "avoid">
  >({});

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
      }}
    >
      <HeroUIProvider navigate={router.push}>{children}</HeroUIProvider>
    </DraftContext>
  );
};
