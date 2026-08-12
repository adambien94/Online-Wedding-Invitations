import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const InviteSchema = z.object({
  name: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  rsvp: z.enum(["yes", "no", "maybe"]).optional(),
});

type InviteFormValues = z.infer<typeof InviteSchema>;

export default function InviteForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InviteFormValues>({
    resolver: zodResolver(InviteSchema),
    defaultValues: { rsvp: "yes" as const },
  });

  const onSubmit = async (data: InviteFormValues) => {
    console.log("Submitted:", data);
    alert("Submitted — check console");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-6 rounded-3xl border border-border bg-white/90 p-6 shadow-sm"
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input id="name" placeholder="Your full name" {...register("name")} />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="rsvp">Minimum Payout</FieldLabel>
          <Select id="rsvp" {...register("rsvp")}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="maybe">Maybe</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        <Field orientation="horizontal">
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Sending..." : "Send Invitation"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
