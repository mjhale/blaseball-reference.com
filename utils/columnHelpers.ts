export function getColumnSum(rows: any, stat: string): number {
  return rows.reduce(
    (sum: number, row: any) => row.original.stat[stat] + sum,
    0
  );
}

export function getColumnsQuotient(rows: any, statA: string, statB: string) {
  return getColumnSum(rows, statA) / getColumnSum(rows, statB);
}

export function getAggregateOnBasePercentage(rows) {
  const statSums = {
    at_bats: 0,
    hits: 0,
    hit_by_pitches: 0,
    sacrifice_flies: 0,
    walks: 0,
  };

  rows.reduce((accumulator: any, row: any) => {
    for (const stat in statSums) {
      accumulator[stat] += row.original.stat[stat];
    }

    return accumulator;
  }, statSums);

  return (
    (statSums.hits + statSums.walks + statSums.hit_by_pitches) /
    (statSums.at_bats +
      statSums.walks +
      statSums.hit_by_pitches +
      statSums.sacrifice_flies)
  );
}

export function getAggregateSluggingPercentage(rows) {
  const statSums = {
    at_bats: 0,
    total_bases: 0,
  };

  rows.reduce((accumulator: any, row: any) => {
    for (const stat in statSums) {
      accumulator[stat] += row.original.stat[stat];
    }

    return accumulator;
  }, statSums);

  return statSums.total_bases / statSums.at_bats;
}

export function getAggregateEarnedRunAverage(rows) {
  const statSums = {
    innings: 0,
    runs_allowed: 0,
  };

  rows.reduce((accumulator: any, row: any) => {
    for (const stat in statSums) {
      accumulator[stat] += row.original.stat[stat];
    }

    return accumulator;
  }, statSums);

  return (9 * statSums.runs_allowed) / statSums.innings;
}

export function getAggregateWhip(rows) {
  const statSums = {
    hits_allowed: 0,
    innings: 0,
    walks: 0,
  };

  rows.reduce((accumulator: any, row: any) => {
    for (const stat in statSums) {
      accumulator[stat] += row.original.stat[stat];
    }

    return accumulator;
  }, statSums);

  return (statSums.walks + statSums.hits_allowed) / statSums.innings;
}

export function getAggregateHitsPer9(rows) {
  const statSums = {
    hits_allowed: 0,
    innings: 0,
  };

  rows.reduce((accumulator: any, row: any) => {
    for (const stat in statSums) {
      accumulator[stat] += row.original.stat[stat];
    }

    return accumulator;
  }, statSums);

  return 9 * (statSums.hits_allowed / statSums.innings);
}

export function getAggregateHomeRunsPer9(rows) {
  const statSums = {
    home_runs_allowed: 0,
    innings: 0,
  };

  rows.reduce((accumulator: any, row: any) => {
    for (const stat in statSums) {
      accumulator[stat] += row.original.stat[stat];
    }

    return accumulator;
  }, statSums);

  return 9 * (statSums.home_runs_allowed / statSums.innings);
}

export function getAggregateWalksPer9(rows) {
  const statSums = {
    innings: 0,
    walks: 0,
  };

  rows.reduce((accumulator: any, row: any) => {
    for (const stat in statSums) {
      accumulator[stat] += row.original.stat[stat];
    }

    return accumulator;
  }, statSums);

  return 9 * (statSums.walks / statSums.innings);
}

export function getAggregateStrikeoutsPer9(rows) {
  const statSums = {
    innings: 0,
    strikeouts: 0,
  };

  rows.reduce((accumulator: any, row: any) => {
    for (const stat in statSums) {
      accumulator[stat] += row.original.stat[stat];
    }

    return accumulator;
  }, statSums);

  return 9 * (statSums.strikeouts / statSums.innings);
}

export function getAggregateStrikeoutToWalkRatio(rows) {
  const statSums = {
    strikeouts: 0,
    walks: 0,
  };

  rows.reduce((accumulator: any, row: any) => {
    for (const stat in statSums) {
      accumulator[stat] += row.original.stat[stat];
    }

    return accumulator;
  }, statSums);

  return statSums.strikeouts / statSums.walks;
}

export function getAggregateWinningPercentage(rows) {
  const statSums = {
    losses: 0,
    wins: 0,
  };

  rows.reduce((accumulator: any, row: any) => {
    for (const stat in statSums) {
      accumulator[stat] += row.original.stat[stat];
    }

    return accumulator;
  }, statSums);

  return statSums.wins / (statSums.wins + statSums.losses);
}
