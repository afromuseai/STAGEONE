import { useQuery } from "@tanstack/react-query";

export interface AuthUser {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
}

export interface ArtistProfile {
  id: string;
  userId: string;
  artistName: string | null;
  genre: string | null;
  secondaryGenre: string | null;
  audienceProfile: string | null;
  preferences: Record<string, unknown>;
  onboardingComplete: boolean;
  dna: {
    tone: string | null;
    visualStyle: string | null;
    hookStyle: string | null;
    audienceType: string | null;
    identitySummary: string | null;
  } | null;
}

async function fetchUser(): Promise<AuthUser | null> {
  const res = await fetch("/api/auth/user", { credentials: "include" });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
  return res.json();
}

async function fetchArtist(): Promise<ArtistProfile | null> {
  const res = await fetch("/api/artists/me", { credentials: "include" });
  if (res.status === 401 || res.status === 404) return null;
  if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
  return res.json();
}

export function useAuth() {
  const { data: user, isLoading: userLoading } = useQuery<AuthUser | null>({
    queryKey: ["/api/auth/user"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  return {
    user: user ?? null,
    isLoading: userLoading,
    isAuthenticated: !!user,
  };
}

export function useArtist() {
  const { isAuthenticated } = useAuth();

  const { data: artist, isLoading, refetch } = useQuery<ArtistProfile | null>({
    queryKey: ["/api/artists/me"],
    queryFn: fetchArtist,
    retry: false,
    staleTime: 5 * 60 * 1000,
    enabled: isAuthenticated,
  });

  return {
    artist: artist ?? null,
    isLoading,
    refetch,
    hasOnboarded: artist?.onboardingComplete ?? false,
  };
}
