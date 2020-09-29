import {
  Box,
  Container,
  Flex,
  Heading,
  Image,
  Link,
  ListItem,
  Stack,
  Text,
  UnorderedList,
} from "@chakra-ui/core";
import Head from "next/head";
import Layout from "components/Layout";

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - Blaseball-Reference.com</title>
        <meta
          property="og:title"
          content="Privacy Policy - Blaseball-Reference.com"
          key="og:title"
        />
        <meta
          name="description"
          property="og:description"
          content="The privacy policy that covers Blaseball Reference visitors."
        />
      </Head>
      <Layout>
        <Heading as="h1" size="lg">
          Blaseball Reference Privacy Policy
        </Heading>
        <Heading as="h2" mt={2} size="md">
          Information We Collect
        </Heading>
        <Stack mt={2} spacing={2}>
          <Text>
            We collect the following information to help shape our understanding
            of who uses Blaseball Reference and to guide development priorities:
            <UnorderedList mt={2} spacing={2}>
              <ListItem>
                Log information: We collect information that web browsers,
                mobile devices, and servers typically make available, including
                the browser type, IP address, unique device identifiers,
                language preference, referring site, the date and time of
                access, operating system, and mobile network information.
              </ListItem>
              <ListItem>
                Location information: We may determine the approximate location
                of your device from your IP address. We collect and use this
                information to, for example, calculate how many people visit our
                website from certain geographic regions.
              </ListItem>
              <ListItem>
                Information from cookies: A cookie is a string of information
                that a website stores on a visitor’s computer, and that the
                visitor’s browser provides to the website each time the visitor
                returns. Pixel tags (also called web beacons) are small blocks
                of code placed on websites and emails. Blaseball Reference uses
                cookies and other technologies like pixel tags to help us
                identify and track visitors, usage, and access preferences.
              </ListItem>
            </UnorderedList>
          </Text>
          <Text>
            We use the following services to help power our website and to
            analyze visitor traffic and usage behavior:
            <UnorderedList mt={2} spacing={2}>
              <ListItem>
                Algolia: The search function on our website uses Algolia's
                search technology services. If you use the search function, it
                is necessary to transmit your IP address to Algolia. For more
                information about how Algolia handles user data, see{" "}
                <Link
                  href="https://www.algolia.com/policies/privacy"
                  isExternal
                  textDecoration="underline"
                >
                  Algolia's privacy policy
                </Link>
                .
              </ListItem>
              <ListItem>
                Heap Analytics: Heap Analytics is an analytics service offered
                by Heap, Inc., that tracks and reports website traffic. Heap
                uses the data collected to track and monitor the use of our
                website. For more information on the privacy practices of Heap,
                please visit the{" "}
                <Link
                  href="https://heapanalytics.com/privacy"
                  isExternal
                  textDecoration="underline"
                >
                  Heap Privacy web page
                </Link>
                .
              </ListItem>
              <ListItem>
                Logflare: Blaseball Reference uses Logflare to store logs
                received from the Vercel cloud platform. These logs may contain
                your IP address as well as pages visited. See{" "}
                <Link
                  href="https://logflare.app/privacy"
                  isExternal
                  textDecoration="underline"
                >
                  Logflare's privacy policy
                </Link>{" "}
                for additional information .
              </ListItem>
              <ListItem>
                Vercel: Vercel is a cloud platform that hosts the Blaseball
                Reference website. For information about how Vercel handles
                visitor data, see{" "}
                <Link
                  href="https://vercel.com/legal/privacy-policy"
                  isExternal
                  textDecoration="underline"
                >
                  Vercel's privacy policy
                </Link>
                .
              </ListItem>
            </UnorderedList>
          </Text>
        </Stack>

        <Heading as="h2" mt={2} size="md">
          Sharing Your Information
        </Heading>
        <Stack mt={2} spacing={2}>
          <Text>
            We share your information in limited circumstances:
            <UnorderedList mt={2} spacing={2}>
              <ListItem>
                Third-party vendors: We may share information about you with
                third-party vendors who need the information in order to provide
                their services to us.
              </ListItem>
              <ListItem>
                Legal and regulatory requirements: We may disclose information
                about you in response to a subpoena, court order, or other
                governmental request.
              </ListItem>
              <ListItem>
                Business transfers: In connection with any merger, sale of
                assets, or acquisition of all or a portion of our website and
                services, user information would likely be one of the assets
                that is transferred or acquired by a third party. If any of
                these events were to happen, this Privacy Policy would continue
                to apply to your information and the party receiving your
                information may continue to use your information, but only
                consistent with this Privacy Policy.
              </ListItem>
              <ListItem>
                Aggregated or de-identified information: We may share
                information that has been aggregated or de-identified, so that
                it can no longer reasonably be used to identify you. For
                instance, we may publish aggregate statistics about the use of
                our website.
              </ListItem>
            </UnorderedList>
          </Text>
        </Stack>

        <Heading as="h2" mt={2} size="md">
          Selling Your Information
        </Heading>
        <Stack mt={2} spacing={2}>
          <Text>Blaseball Reference does not sell its users' information.</Text>
        </Stack>
      </Layout>
    </>
  );
}
