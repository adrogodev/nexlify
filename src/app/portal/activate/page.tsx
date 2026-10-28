import { Suspense } from "react";
import PortalActivateTemplate from "@/src/features/portal/template/portal-activate.template";

export default function PortalActivatePage() {
  return (
    <Suspense>
      <PortalActivateTemplate />
    </Suspense>
  );
}
