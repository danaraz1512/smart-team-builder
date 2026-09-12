import { createFileRoute } from "@tanstack/react-router";
import App from "@/scheduler/App";

const TITLE = "Smart Team Scheduler | Bean & Bloom";
const DESCRIPTION =
  "Build the right team for every shift: AI-assisted scheduling, skill matching and onboarding-aware shift decisions.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <App />;
}
