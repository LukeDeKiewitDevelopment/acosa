import { useRef, useState, type FormEvent } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";

export type ContactFormProps = {
  enquiryEmail: string;
  hcaptchaSiteKey: string;
};

type EnquiryType = "general" | "corporate";
type Status = "idle" | "loading" | "success" | "error";

const PILL_BASE =
  "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors";
const PILL_ACTIVE = "bg-secondary text-secondary-foreground";
const PILL_INACTIVE = "border border-secondary text-secondary";

const ENQUIRY_LABELS: Record<EnquiryType, string> = {
  general: "General Enquiry",
  corporate: "Corporate Enquiry",
};

export const ContactForm = ({
  enquiryEmail,
  hcaptchaSiteKey,
}: ContactFormProps) => {
  const [enquiryType, setEnquiryType] = useState<EnquiryType>("general");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
      setError("Please complete the captcha before sending.");
      return;
    }

    setStatus("loading");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enquiryType,
          name,
          email,
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
      setName("");
      setEmail("");
      setMessage("");
      setEnquiryType("general");
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
          Message sent — we&rsquo;ll be in touch shortly.
        </p>
        <Button variant="outline" size="sm" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <span className="text-sm leading-none font-medium">Enquiry type</span>
        <div className="flex flex-wrap gap-3">
          {(Object.keys(ENQUIRY_LABELS) as EnquiryType[]).map((type) => (
            <button
              key={type}
              type="button"
              aria-pressed={enquiryType === type}
              onClick={() => setEnquiryType(type)}
              className={cn(
                PILL_BASE,
                enquiryType === type ? PILL_ACTIVE : PILL_INACTIVE,
              )}
            >
              {ENQUIRY_LABELS[type]}
            </button>
          ))}
        </div>
      </div>

      <Field>
        <FieldLabel htmlFor="contact-name">Name</FieldLabel>
        <Input
          id="contact-name"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="contact-email">Email</FieldLabel>
        <Input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="contact-message">Message</FieldLabel>
        <Textarea
          id="contact-message"
          name="message"
          rows={5}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
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
        {status === "loading" ? "Sending…" : "Send Message"}
        <ArrowRight aria-hidden="true" />
      </Button>

      <p className="text-muted-foreground text-sm">
        Prefer email? Write to{" "}
        <a href={`mailto:${enquiryEmail}`} className="text-secondary underline">
          {enquiryEmail}
        </a>
      </p>
    </form>
  );
};
