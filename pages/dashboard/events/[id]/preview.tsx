import { useEffect } from "react";
import { useRouter } from "next/router";
import Spinner from "@/components/ui/Spinner";

/** Legacy route — redirects into the publication tab. */
export default function PreviewRedirect() {
  const router = useRouter();
  const { id } = router.query as { id?: string };

  useEffect(() => {
    if (!id) return;
    router.replace(`/dashboard/events/${id}/edit?tab=publikacja`);
  }, [id, router]);

  return <Spinner />;
}
