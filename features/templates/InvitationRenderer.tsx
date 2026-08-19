import { getTemplateOrDefault } from "./registry";
import type { InvitationConfig } from "@/lib/invitation-config";

interface Props {
  templateKey: string;
  config: InvitationConfig;
}

export default function InvitationRenderer({ templateKey, config }: Props) {
  const entry = getTemplateOrDefault(templateKey);
  const Component = entry.component;
  return <Component config={config} />;
}
