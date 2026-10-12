import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RemoteBoard — Live Remote Jobs",
    short_name: "RemoteBoard",
    description: "Stateless remote job board with real Apply links.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#0070F3",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
  };
}
