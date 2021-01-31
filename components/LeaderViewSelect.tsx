import ApiConfig from "types/apiConfig";
import buildSeasonList from "utils/buildSeasonList";
import { translateLeaderViewToSlug } from "utils/slugHelpers";
import { useApiConfigContext } from "context/ApiConfig";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { Select } from "@chakra-ui/react";

export default function LeaderViewSelect({ selectedView, setSelectedView }) {
  const apiConfig: ApiConfig = useApiConfigContext();
  const router = useRouter();

  let minSeason;
  let maxSeason;

  if (apiConfig !== undefined) {
    minSeason = apiConfig.seasons.minSeason;
    maxSeason = apiConfig.seasons.maxSeason;
  }

  const [dropdownSeasonList, setDropdownSeasonList] = useState(null);

  useEffect(() => {
    if (minSeason !== undefined && maxSeason !== undefined) {
      setDropdownSeasonList(buildSeasonList({ minSeason, maxSeason }));
    }
  }, [minSeason, maxSeason]);

  const handleSelectChange = (evt) => {
    setSelectedView(evt.target.value);

    router.push(
      `/leaders/${translateLeaderViewToSlug(evt.target.value)}`,
      undefined,
      { shallow: true }
    );
  };

  if (apiConfig === undefined || dropdownSeasonList === null) {
    return <SelectLoading />;
  }

  return (
    <Select
      fontSize={{ base: "lg", md: "md" }}
      maxWidth="2xs"
      mb={4}
      onChange={handleSelectChange}
      size="md"
      value={selectedView ?? undefined}
    >
      {/* // @TODO: Re-add career stats option once data is included in v2 API
      <option key="allTime" value="allTime">
        {`Career`}
      </option> */}
      {dropdownSeasonList.map((season) => (
        <option key={season} value={season}>
          {`Season ${Number(season) + 1}`}
        </option>
      ))}
    </Select>
  );
}

function SelectLoading() {
  return (
    <Select
      isDisabled={true}
      fontSize={{ base: "lg", md: "md" }}
      maxWidth="2xs"
      mb={4}
      placeholder="Loading..."
      size="md"
    />
  );
}
