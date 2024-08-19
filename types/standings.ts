type SplitTypes =
  | "home"
  | "away"
  | "extraInnings"
  | "winners"
  | "oneRun"
  | "shame";

export interface SeasonStandings {
  [divisionId: string]: Array<TeamStanding>;
}

export interface TeamStanding {
  teamId: string;
  teamName: string;
  teamSlug: string;
  season: number;
  streak: {
    streakType: "wins" | "losses";
    streakNumber: number;
    streakCode: string;
  };
  divisionRank: number;
  leagueRank: number;
  sportRank: number;
  gamesPlayed: number;
  gamesBack: string;
  leagueGamesBack: string;
  sportGamesBack: string;
  divisionGamesBack: string;
  leagueRecord: {
    wins: number;
    losses: number;
    pct: number;
  };
  splitRecords: {
    [splitType in SplitTypes]: {
      wins: number;
      losses: number;
      pct: number;
      type: splitType;
    };
  };
  weatherRecords: {
    [weatherId: number]: {
      wins: number;
      losses: number;
      pct: number;
      type: string;
    };
  };
  leagueRecords: {
    [leagueId: string]: {
      wins: number;
      losses: number;
      pct: number;
      type: string;
      divisionId: string;
      divisionName: string;
    };
  };
  divisionRecords: {
    [divisionId: string]: {
      wins: number;
      losses: number;
      pct: number;
      type: string;
      divisionId: string;
      divisionName: string;
    };
  };
  runsAllowed: number;
  runsScored: number;
  divisionChamp: boolean;
  divisionLeader: boolean;
  leagueLeader: boolean;
  sportLeader: boolean;
  clinched: boolean;
  eliminationNumber: string;
  magicNumber: string;
  wins: number;
  losses: number;
  runDifferential: number;
  winningPercentage: number;
}
