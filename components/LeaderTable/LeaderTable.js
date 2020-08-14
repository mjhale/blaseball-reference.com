import { Box, Flex, Link, Text } from "@chakra-ui/core";
import NextLink from "next/link";

export default function LeaderTable({ category, leaders }) {
  return (
    <Flex border="1px solid" borderColor="gray.300" flexDirection="column">
      <Box
        bgColor="gray.100"
        borderBottom="1px"
        borderBottomColor="gray.200"
        fontWeight="medium"
        p="1"
        textAlign="center"
      >
        {category.name}
      </Box>
      {leaders &&
        leaders.map((leader, index) => (
          <Flex
            _hover={{ bgColor: "hsl(35, 100%, 95%)" }}
            flexDirection="row"
            fontSize="sm"
            justifyContent="space-between"
            py={1}
            px={2}
          >
            <Box>
              <Text
                as="div"
                display="inline-block"
                minWidth={5}
                mr={1}
                textAlign="right"
              >
                {index === 0 && <>{index + 1}.</>}

                {index !== 0 &&
                  index > 0 &&
                  leaders[index - 1].value !== leaders[index].value && (
                    <>{index + 1}. </>
                  )}
              </Text>
              <NextLink
                href="/players/[playerSlug]"
                as={`/players/${leader.playerSlug}`}
                passHref
              >
                <Link>{leader.playerName}</Link>
              </NextLink>
            </Box>
            <Box>
              {Number.isSafeInteger(leader.value)
                ? leader.value
                : Number.parseFloat(leader.value).toFixed(3)}
            </Box>
          </Flex>
        ))}
    </Flex>
  );
}
