import buildSeasonList from "utils/buildSeasonList";
import * as React from "react";
import { useApiConfigContext } from "context/ApiConfig";

import ApiConfig from "types/apiConfig";

import { Select } from "@chakra-ui/react";

type Props = {
  extraSelectOptions?: Array<{ key: string; content: string }>;
  handleSelectChange: (evt: React.FormEvent<HTMLSelectElement>) => void;
  selectedView: string;
};

export default function SplitViewSelect({
  extraSelectOptions,
  handleSelectChange,
  selectedView,
}: Props) {
  const apiConfig: ApiConfig = useApiConfigContext();
  const minSeason = apiConfig != null ? apiConfig.seasons?.minSeason : null;
  const maxSeason = apiConfig != null ? apiConfig.seasons?.maxSeason : null;

  const [dropdownSeasonList, setDropdownSeasonList] = React.useState(null);

  // Populate dropdown with list of all seasons
  React.useEffect(() => {
    if (minSeason !== undefined && maxSeason !== undefined) {
      setDropdownSeasonList(buildSeasonList({ minSeason, maxSeason }));
    }
  }, [minSeason, maxSeason]);

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
