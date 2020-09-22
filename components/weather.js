import { Flex } from "@chakra-ui/core";

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

import { GiPeanut, GiBirdClaw, GiMicrophone, GiBigWave } from "react-icons/gi";

const WEATHERS = {
  0: {
    name: "Void",
    icon: WiMoonFull,
    background: "#67678a",
    color: "#000000",
  },
  1: {
    name: "Sunny",
    icon: WiDaySunny,
    background: "#db7900",
    color: "#fffec4",
  },
  2: {
    name: "Overcast",
    icon: WiCloudy,
    background: "#cfcfcf",
    color: "#737373",
  },
  3: {
    name: "Rainy",
    icon: WiRain,
    background: "#348e9e",
    color: "#0727a8",
  },
  4: {
    name: "Sandstorm",
    icon: WiSandstorm,
    background: "#877652",
    color: "#e0dac3",
  },
  5: {
    name: "Snowy",
    icon: WiSnow,
    background: "#68969e",
    color: "#ffffff",
  },
  6: {
    name: "Acidic",
    icon: WiFog,
    background: "#92ad58",
    color: "#235917",
  },
  7: {
    name: "Solar Eclipse",
    icon: WiSolarEclipse,
    background: "#002f3b",
    color: "#3c6cba",
  },
  8: {
    name: "Glitter",
    icon: WiStars,
    background: "#ff94ff",
    color: "#fff98a",
  },
  9: {
    name: "Blooddrain",
    icon: WiRain,
    background: "#52050f",
    color: "#ff1f3c",
  },
  10: {
    name: "Peanuts",
    icon: GiPeanut,
    background: "#c4aa70",
    color: "#423822",
  },
  11: {
    name: "Birds",
    icon: GiBirdClaw,
    background: "#45235e",
    color: "#8e5fad",
  },
  12: {
    name: "Feedback",
    icon: GiMicrophone,
    background: "#383838",
    color: "#ff007b",
  },
  13: {
    name: "Reverb",
    icon: GiBigWave,
    background: "#443561",
    color: "#61b3ff",
  },
};

export function WeatherIcon({ for: weather }) {
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
      role="emoji"
    >
      <Icon />
    </Flex>
  );
}

export function WeatherName({ for: weather }) {
  return WEATHERS[weather].name;
}
