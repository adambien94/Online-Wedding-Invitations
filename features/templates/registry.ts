import type { ComponentType } from "react";
import type { InvitationConfig } from "@/lib/invitation-config";
import { classicMetadata } from "./classic/metadata";
import { modernMetadata } from "./modern/metadata";

export interface TemplateEntry {
  key: string;
  version: number;
  name: string;
  description: string;
  thumbnail: string;
  component: ComponentType<{ config: InvitationConfig }>;
}

// Lazy imports — bundler splits each template into a separate chunk.
// We import dynamically at runtime; for the registry we use static metadata
// and point to the component path so consumers can do their own dynamic import.

import ClassicTemplate from "./classic/Template";
import ModernTemplate from "./modern/Template";

export const templateRegistry: TemplateEntry[] = [
  { ...classicMetadata, component: ClassicTemplate },
  { ...modernMetadata, component: ModernTemplate },
];

export function getTemplate(key: string): TemplateEntry | undefined {
  return templateRegistry.find((t) => t.key === key);
}

export function getTemplateOrDefault(key: string): TemplateEntry {
  return getTemplate(key) ?? templateRegistry[0];
}
