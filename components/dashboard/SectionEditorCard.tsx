import type { LucideIcon } from "lucide-react";
import { ChevronDown, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

type SectionEditorCardProps = {
  title: string;
  icon: LucideIcon;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  children?: React.ReactNode;
};

export default function SectionEditorCard({
  title,
  icon: Icon,
  open,
  onOpenChange,
  visible,
  onVisibleChange,
  children,
}: SectionEditorCardProps) {
  const hasToggle = typeof visible === "boolean" && onVisibleChange;

  return (
    <Card className="gap-0 py-0 border-b">
      <div className="flex items-center pr-1 py-4">
        <button
          type="button"
          onClick={() => onOpenChange(!open)}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl border">
            <Icon className="size-5 text-neutral-900" strokeWidth={1.75} />
          </span>
          <span className="min-w-0">
            <span className="block text-sm text-neutral-800">{title}</span>
            {hasToggle && (
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {visible ? "Widoczna" : "Ukryta"}
              </span>
            )}
          </span>
        </button>

        {hasToggle && (
          <Switch
            checked={visible}
            onCheckedChange={onVisibleChange}
            aria-label={`${visible ? "Ukryj" : "Pokaż"} sekcję ${title}`}
            size="sm"
          />
        )}

        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={() => onOpenChange(!open)}
          aria-label={open ? `Zwiń sekcję ${title}` : `Edytuj sekcję ${title}`}
          className="ml-4"
        >
          {open ? <ChevronDown className="rotate-180" /> : <Pencil />}
        </Button>
      </div>

      {open && children != null && <div className="pt-2 pb-5">{children}</div>}
    </Card>
  );
}
