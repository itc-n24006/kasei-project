import { AppPageRouteModule } from "next/dist/server/future/route-modules/app-page/module.compiled";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["mars.nasa.gov"],
  },
};

export default nextConfig;
