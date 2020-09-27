import { Box } from "@chakra-ui/core";

function getPostseasonStartDate(seasonStartDate: Date): Date {
  let postseasonStartDate = new Date(seasonStartDate);
  postseasonStartDate.setDate(postseasonStartDate.getDate() + 5);
  postseasonStartDate.setUTCHours(13);

  return postseasonStartDate;
}

function getUpcomingStartDates(
  seasonStartDates: Record<string, string>
): { seasonStartDate: Date; postseasonStartDate: Date } {
  const todayDate = new Date();

  let upcomingSeasonStartDate: Date;
  let upcomingPostseasonStartDate: Date;

  for (const season of Object.keys(seasonStartDates).sort(
    (a, b) => Number(a) - Number(b)
  )) {
    const seasonStartDate = new Date(`${seasonStartDates[season]} UTC`);
    let postseasonStartDate = new Date(seasonStartDate);
    postseasonStartDate.setDate(postseasonStartDate.getDate() + 5);
    postseasonStartDate.setUTCHours(13);

    if (!upcomingSeasonStartDate && seasonStartDate > todayDate) {
      upcomingSeasonStartDate = seasonStartDate;
    }

    if (!upcomingPostseasonStartDate && postseasonStartDate > todayDate) {
      upcomingPostseasonStartDate = postseasonStartDate;
    }
  }

  return {
    seasonStartDate: upcomingSeasonStartDate,
    postseasonStartDate: upcomingPostseasonStartDate,
  };
}

export default function UpcomingDates({
  seasonStartDates,
}: {
  seasonStartDates: Record<string, string>;
}) {
  const { seasonStartDate, postseasonStartDate } = getUpcomingStartDates(
    seasonStartDates
  );

  if (!seasonStartDate || !postseasonStartDate) {
    return (
      <>
        <Box>Next Season: TBA</Box>
        <Box>Next Postseason: TBA</Box>
      </>
    );
  }

  const UpcomingSeason = () => (
    <Box>
      Next Season:{" "}
      {seasonStartDate.toLocaleString(undefined, {
        day: "numeric",
        hour: "numeric",
        month: "short",
        year: "numeric",
      })}
    </Box>
  );

  const UpcomingPostSeason = () => (
    <Box>
      Next Postseason:{" "}
      {postseasonStartDate.toLocaleString(undefined, {
        day: "numeric",
        hour: "numeric",
        month: "short",
        year: "numeric",
      })}
    </Box>
  );

  return (
    <>
      {seasonStartDate < postseasonStartDate ? (
        <>
          <UpcomingSeason />
          <UpcomingPostSeason />
        </>
      ) : (
        <>
          <UpcomingPostSeason />
          <UpcomingSeason />
        </>
      )}
    </>
  );
}
