"use server";

export const getSleeperPicks = async (draftId: string) => {
  const picksResponse = await fetch(
    `https://api.sleeper.app/v1/draft/${draftId}/picks`
  );
  if (picksResponse.ok) {
    const body = (await picksResponse.json()) as Promise<
      {
        player_id: string;
        pick_no: number;
        metadata: {
          first_name: string;
          last_name: string;
          position: string;
          team: string;
        };
      }[]
    >;
    return body;
  }
};
