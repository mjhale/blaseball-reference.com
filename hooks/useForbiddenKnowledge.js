import { useCallback } from "react";
import { useCookies } from "react-cookie";

const COOKIE_NAME = "forbidden-knowledge";

export default function useForbiddenKnowledge() {
  const [cookies, setCookie, removeCookie] = useCookies();
  const setShowForbiddenKnowledge = useCallback(
    (value) => {
      setCookie(COOKIE_NAME, value, {
        path: "/",
        maxAge: 1e15,
        secure: true,
      });
    },
    [setCookie]
  );

  return [cookies[COOKIE_NAME] === "true", setShowForbiddenKnowledge];
}
