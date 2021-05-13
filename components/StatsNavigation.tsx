import * as React from "react";

import { Flex, Heading, Link } from "@chakra-ui/react";
import NextLink from "next/link";

type Props = {
  group: "player" | "team";
  statType: "hitting" | "pitching";
};

export default function StatsNavigation(props: Props) {
  return (
    <>
      <Flex mb={4}>
        <StatsNavigationLink href="/stats" isActive={props.group === "player"}>
          <Heading as="h2" size="lg" mr={4}>
            Player
          </Heading>
        </StatsNavigationLink>

        <StatsNavigationLink
          href="/stats/team"
          isActive={props.group === "team"}
        >
          <Heading as="h2" size="lg">
            Team
          </Heading>
        </StatsNavigationLink>
      </Flex>

      <Flex mb={4}>
        <StatsNavigationLink
          href={props.group === "player" ? "/stats" : "/stats/team"}
          isActive={props.statType === "hitting"}
        >
          <Heading as="h3" size="md" mr={4}>
            Hitting
          </Heading>
        </StatsNavigationLink>
        <StatsNavigationLink
          href={
            props.group === "player"
              ? "/stats/pitching"
              : "/stats/team/pitching"
          }
          isActive={props.statType === "pitching"}
        >
          <Heading as="h3" size="md">
            Pitching
          </Heading>
        </StatsNavigationLink>
      </Flex>
    </>
  );
}

type StatsNavigationLinkProps = {
  href: string;
  isActive: boolean;
};

function StatsNavigationLink({
  children,
  href,
  isActive,
}: React.PropsWithChildren<StatsNavigationLinkProps>) {
  return (
    <NextLink href={href} passHref>
      <Link
        color={isActive ? null : "gray.500"}
        textDecoration={isActive ? "underline" : null}
      >
        {children}
      </Link>
    </NextLink>
  );
}
