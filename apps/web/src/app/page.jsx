"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SpotifyExplorer } from "@/components/SpotifyExplorer/SpotifyExplorer";

const queryClient = new QueryClient();

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <SpotifyExplorer />
    </QueryClientProvider>
  );
}
