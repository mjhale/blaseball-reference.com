import Weather from "types/weather";

import { Flex } from "@chakra-ui/react";
import {
  GiPeanut,
  GiBirdClaw,
  GiMicrophone,
  GiBigWave,
  GiVortex,
  GiCoffeeCup,
  GiFlood,
  GiHelp,
  GiSalmon,
} from "react-icons/gi";
import {
  WiMoonFull,
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiSandstorm,
  WiSnow,
  WiFog,
  WiSolarEclipse,
  WiStars,
} from "react-icons/wi";

const WEATHERS: { [weatherId: number]: Weather } = {
  0: {
    id: 0,
    name: "Void",
    icon: WiMoonFull,
    background: "#67678a",
    color: "#000000",
  },
  1: {
    id: 1,
    name: "Sun 2",
    icon: WiDaySunny,
    background: "#fdff9c",
    color: "#ffffff",
  },
  2: {
    id: 2,
    name: "Overcast",
    icon: WiCloudy,
    background: "#cfcfcf",
    color: "#737373",
  },
  3: {
    id: 3,
    name: "Rainy",
    icon: WiRain,
    background: "#348e9e",
    color: "#0727a8",
  },
  4: {
    id: 4,
    name: "Sandstorm",
    icon: WiSandstorm,
    background: "#877652",
    color: "#e0dac3",
  },
  5: {
    id: 5,
    name: "Snowy",
    icon: WiSnow,
    background: "#68969e",
    color: "#ffffff",
  },
  6: {
    id: 6,
    name: "Acidic",
    icon: WiFog,
    background: "#92ad58",
    color: "#235917",
  },
  7: {
    id: 7,
    name: "Solar Eclipse",
    icon: WiSolarEclipse,
    background: "#002f3b",
    color: "#ffffff",
  },
  8: {
    id: 8,
    name: "Glitter",
    icon: WiStars,
    background: "#ff94ff",
    color: "#fff98a",
  },
  9: {
    id: 9,
    name: "Blooddrain",
    icon: WiRain,
    background: "#52050f",
    color: "#ffffff",
  },
  10: {
    id: 10,
    name: "Peanuts",
    icon: GiPeanut,
    background: "#c4aa70",
    color: "#423822",
  },
  11: {
    id: 11,
    name: "Birds",
    icon: GiBirdClaw,
    background: "#45235e",
    color: "#ffffff",
  },
  12: {
    id: 12,
    name: "Feedback",
    icon: GiMicrophone,
    background: "#383838",
    color: "#ff007b",
  },
  13: {
    id: 13,
    name: "Reverb",
    icon: GiBigWave,
    background: "#443561",
    color: "#ffffff",
  },
  14: {
    id: 14,
    name: "Black Hole",
    icon: GiVortex,
    background: "#000000",
    color: "#ffffff",
  },
  15: {
    id: 15,
    name: "Coffee",
    icon: GiCoffeeCup,
    background: "#9a7b4f",
    color: "#ffffff",
  },
  16: {
    id: 16,
    name: "Coffee 2",
    icon: GiCoffeeCup,
    background: "#0c4022",
    color: "#ffffff",
  },
  17: {
    id: 17,
    name: "Coffee 3s",
    icon: GiCoffeeCup,
    background: "#5fa9f1",
    color: "#ffffff",
  },
  18: {
    id: 18,
    name: "Flooding",
    icon: GiFlood,
    background: "#465f63",
    color: "#ffffff",
  },
  19: {
    id: 19,
    name: "Salmon",
    icon: GiSalmon,
    background: "#ba7b97",
    color: "#f2c7e3",
  },
  20: {
    id: 20,
    name: "???",
    icon: GiHelp,
    background: "#92b3b0",
    color: "#d3e3e2",
  },
  21: {
    id: 21,
    name: "???",
    icon: GiHelp,
    background: "#d3e3e2",
    color: "#ff6be6",
  },
  22: {
    id: 22,
    name: "???",
    icon: GiHelp,
    background: "#0e4e8a",
    color: "#ffc400",
  },
};

// Weather type defaults to 'Sunny (ID 1)'
export function WeatherIcon({ for: weather = 1 }: { for: number }) {
  const { icon: Icon, background, color } = WEATHERS[weather];

  return (
    <Flex
      color={color}
      bg={background}
      align="center"
      justify="center"
      fontSize="1em"
      height="1.5em"
      width="1.5em"
      rounded="0.2em"
      display="inline-flex"
      verticalAlign="text-bottom"
      role="img"
    >
      <Icon />
    </Flex>
  );
}

// Weather type defaults to 'Sunny (ID 1)'
export function WeatherName({ for: weather = 1 }: { for: number }) {
  return <>{WEATHERS[weather].name}</>;
}
