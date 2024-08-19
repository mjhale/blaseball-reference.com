import buildSeasonList from "utils/buildSeasonList";
import * as React from "react";

import ApiConfig from "types/apiConfig";

import { Select } from "@chakra-ui/react";

type Props = {
  apiConfig: ApiConfig;
  extraSelectOptions?: Array<{ key: string; content: string }>;
  handleSelectChange: (evt: React.FormEvent<HTMLSelectElement>) => void;
  selectedView: string;
};

export default function SplitViewSelect({
  apiConfig,
  extraSelectOptions,
  handleSelectChange,
  selectedView,
}: Props) {
  const minSeason = apiConfig.seasons.minSeason;
  const maxSeason = apiConfig.seasons.maxSeason;

  const dropdownSeasonList = buildSeasonList({ minSeason, maxSeason });

  return (
    <Select
      fontSize={{ base: "lg", md: "md" }}
      maxWidth="2xs"
      mb={4}
      onChange={handleSelectChange}
      size="md"
      value={selectedView ?? undefined}
    >
      {dropdownSeasonList.map((season) => (
        <option key={season} value={season}>
          {`Season ${Number(season) + 1}`}
        </option>
      ))}
      {Array.isArray(extraSelectOptions) && extraSelectOptions.length > 0
        ? extraSelectOptions.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.content}
            </option>
          ))
        : null}
    </Select>
  );
}
