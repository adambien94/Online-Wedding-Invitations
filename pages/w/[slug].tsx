import Head from "next/head";
import type { GetStaticPaths, GetStaticProps } from "next";
import { createClient } from "@supabase/supabase-js";
import InvitationRenderer from "@/features/templates/InvitationRenderer";
import type { InvitationConfig } from "@/lib/invitation-config";

type Props = {
  templateKey: string;
  config: InvitationConfig;
};

export default function PublicInvitationPage({ templateKey, config }: Props) {
  const coupleNames =
    config?.couple?.person1 && config?.couple?.person2
      ? `${config.couple.person1} & ${config.couple.person2}`
      : "Zaproszenie";

  return (
    <>
      <Head>
        <title>{coupleNames} — Nasz Dzień</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <InvitationRenderer templateKey={templateKey} config={config} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Render on first request per slug.
  return { paths: [], fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const slugParam = context.params?.slug;
  const slug = typeof slugParam === "string" ? slugParam : "";
  const normalized = slug.toLowerCase();

  if (
    !normalized ||
    !/^[a-z0-9-]+$/.test(normalized) ||
    normalized.length < 3 ||
    normalized.length > 50
  ) {
    return { notFound: true };
  }

  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );

  // Public access: RLS allows reading only published events/publications.
  const {
    data: event,
    error: eventError,
  } = await sb
    .from("events")
    .select("id, slug")
    .eq("slug", normalized)
    .single();

  if (eventError || !event) {
    return { notFound: true };
  }

  const {
    data: publication,
    error: pubError,
  } = await sb
    .from("event_publications")
    .select("config, template_key, template_version, version, published_at")
    .eq("event_id", event.id)
    .order("published_at", { ascending: false })
    .limit(1)
    .single();

  if (pubError || !publication) {
    return { notFound: true };
  }

  return {
    props: {
      templateKey: publication.template_key,
      config: publication.config as InvitationConfig,
    },
    // Cached with ISR; publish triggers on-demand revalidation.
    revalidate: 60,
  };
};

