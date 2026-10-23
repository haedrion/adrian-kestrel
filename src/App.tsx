import { useCallback, useEffect, useState } from "react";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import Builder from "./pages/Builder";

type Route = "home" | "builder";

function readRoute(): Route {
  return window.location.hash.startsWith("#/builder") ? "builder" : "home";
}

export default function App() {
  const [route, setRoute] = useState<Route>(() => readRoute());

  useEffect(() => {
    const onHash = () => setRoute(readRoute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (route === "builder") window.scrollTo({ top: 0, behavior: "auto" });
  }, [route]);

  const goSection = useCallback(
    (id: string) => {
      const scroll = () => {
        if (id === "top") {
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      };
      if (route !== "home") {
        window.location.hash = "";
        setRoute("home");
        window.setTimeout(scroll, 90);
      } else {
        scroll();
      }
    },
    [route]
  );

  return (
    <>
      <Nav active={route} onGoSection={goSection} />
      {route === "builder" ? <Builder /> : <Home />}
    </>
  );
}
