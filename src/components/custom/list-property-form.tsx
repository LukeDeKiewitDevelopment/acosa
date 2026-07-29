import { useRef, useState, type FormEvent } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROVINCE_OPTIONS } from "@/lib/provinces";

export type PropertyTypeOption = { label: string; value: string };

export type ListPropertyFormProps = {
  hcaptchaSiteKey: string;
  propertyTypes: PropertyTypeOption[];
};

type Status = "idle" | "loading" | "success" | "error";

export const ListPropertyForm = ({
  hcaptchaSiteKey,
  propertyTypes,
}: ListPropertyFormProps) => {
  const [propertyName, setPropertyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const captchaRef = useRef<HCaptcha>(null);

  const resetCaptcha = () => {
    setToken(null);
    captchaRef.current?.resetCaptcha();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!token) {
      setStatus("error");
      setError("Please complete the captcha before submitting.");
      return;
    }

    setStatus("loading");
    try {
      const response = await fetch("/api/list-property", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyName,
          contactName,
          email,
          phone,
          province,
          propertyType,
          message,
          hcaptchaToken: token,
        }),
      });

      if (!response.ok) {
        const data: { error?: string } = await response
          .json()
          .catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
      setPropertyName("");
      setContactName("");
      setEmail("");
      setPhone("");
      setProvince("");
      setPropertyType("");
      setMessage("");
      resetCaptcha();
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
      resetCaptcha();
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed p-8 text-center">
        <p className="text-primary font-medium">
          Application received — we&rsquo;ll be in touch shortly.
        </p>
        <Button variant="outline" size="sm" onClick={() => setStatus("idle")}>
          Submit another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="lp-property-name">Property name</FieldLabel>
          <Input
            id="lp-property-name"
            value={propertyName}
            onChange={(event) => setPropertyName(event.target.value)}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="lp-contact-name">Your name</FieldLabel>
          <Input
            id="lp-contact-name"
            autoComplete="name"
            value={contactName}
            onChange={(event) => setContactName(event.target.value)}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="lp-email">Email</FieldLabel>
          <Input
            id="lp-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="lp-phone">
            Phone{" "}
            <span className="text-muted-foreground font-normal">(optional)</span>
          </FieldLabel>
          <Input
            id="lp-phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="lp-province">Province</FieldLabel>
          <Select value={province || undefined} onValueChange={setProvince}>
            <SelectTrigger id="lp-province" className="w-full">
              <SelectValue placeholder="Select province" />
            </SelectTrigger>
            <SelectContent>
              {PROVINCE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor="lp-property-type">Property type</FieldLabel>
          <Select
            value={propertyType || undefined}
            onValueChange={setPropertyType}
          >
            <SelectTrigger id="lp-property-type" className="w-full">
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="lp-message">
          Tell us about your property{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </FieldLabel>
        <Textarea
          id="lp-message"
          rows={5}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </Field>

      <HCaptcha
        ref={captchaRef}
        sitekey={hcaptchaSiteKey}
        onVerify={(verified) => setToken(verified)}
        onExpire={() => setToken(null)}
        onError={() => setToken(null)}
      />

      {status === "error" && error && (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}

      <Button
        type="submit"
        variant="secondary"
        className="w-fit"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Submitting…" : "Submit Application"}
        <ArrowRight aria-hidden="true" />
      </Button>
    </form>
  );
};
