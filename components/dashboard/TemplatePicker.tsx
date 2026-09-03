import { Button } from "@/components/ui/button";
import { templateRegistry } from "@/features/templates/registry";
import type { InvitationConfig } from "@/lib/invitation-config";
import { Check } from "lucide-react";

interface TemplatePickerProps {
  config: InvitationConfig;
  savingKey: string | null;
  onChoose: (key: string, version: number) => void;
}

export default function TemplatePicker({
  config,
  savingKey,
  onChoose,
}: TemplatePickerProps) {
  const currentKey = config.template?.key ?? "";

  return (
    <main className="max-w-[1440px] mx-auto px-4 py-8 sm:px-8">
      <div className="pb-12 pt-4">
        <h2 className="text-4xl font-serif leading-tight tracking-tight text-neutral-900 sm:text-4xl text-center">
          Wybierz szablon Twojego zaproszenia
        </h2>
        <p className="mt-2 text-center text-neutral-900">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {templateRegistry.map((tmpl) => {
          const isActive = currentKey === tmpl.key;
          const isSaving = savingKey === tmpl.key;

          return (
            <div
              key={tmpl.key}
              className={`bg-white overflow-hidden flex flex-col transition-all shadow-xl ${
                isActive ? "" : ""
              }`}
            >
              <div className="aspect-4/3 flex items-center justify-center ">
                <TemplateThumbnail tmplKey={tmpl.key} config={config} />
              </div>

              <div className="p-5 flex flex-col gap-2 flex-1 shadow-md">
                <div className="flex items-center justify-between">
                  <h2 className="text-md font-medium text-gray-900">
                    {tmpl.name}
                  </h2>
                </div>
                <p className="text-sm text-neutral-900 flex-1 pb-2">
                  {tmpl.description}
                </p>
                <Button
                  disabled={isActive || isSaving}
                  className={isActive ? "hidden" : ""}
                  variant="outline"
                  onClick={() => !isActive && onChoose(tmpl.key, tmpl.version)}
                >
                  {isSaving ? "Zapisywanie…" : isActive ? "Wybrany" : "Wybierz"}
                </Button>
                {isActive && (
                  <div className="flex justify-center">
                    <span className="inline-flex items-center gap-1 text-xs border border-neutral-300 text-neutral-500 font-medium  px-3 py-1 rounded-full">
                      <Check className="size-3.5" />
                      Aktywny
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

function TemplateThumbnail({
  tmplKey,
  config,
}: {
  tmplKey: string;
  config: InvitationConfig;
}) {
  const entry = templateRegistry.find((t) => t.key === tmplKey);
  if (!entry) return null;
  const Component = entry.component;

  return (
    <div className="w-full h-full  relative overflow-hidden pointer-events-none select-none">
      <div
        className="absolute origin-top-left"
        style={{ transform: "scale(0.5)", width: "200%", height: "200%" }}
      >
        <Component config={config} />
      </div>
    </div>
  );
}
