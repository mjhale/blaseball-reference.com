import Weather from "types/weather";

import { Flex } from "@chakra-ui/react";
import {
  GiPeanut,
  GiBirdClaw,
  GiMicrophone,
  GiBigWave,
  GiVortex,
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
    background: "#db7900",
    color: "#fffec4",
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
    color: "#3c6cba",
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
    color: "#ff1f3c",
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
    color: "#8e5fad",
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
    color: "#61b3ff",
  },
  14: {
    id: 14,
    name: "Black Hole",
    icon: GiVortex,
    background: "#000000",
    color: "#00374a",
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
