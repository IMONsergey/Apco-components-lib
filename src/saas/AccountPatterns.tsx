import { useId, useState } from "react";
import { Icon } from "../components/ui/Icon";
import {
  DemoNotice,
  DemoStateNotice,
  SaasAlert,
  SaasBadge,
  SaasButton,
  SaasDialog,
  SaasField,
  SaasTabs,
  type PatternProps,
} from "./primitives";

export function AuthPattern({ state = "ready" }: PatternProps) {
  const [current, setCurrent] = useState(state),
    [view, setView] = useState("login"),
    [email, setEmail] = useState("alex@example.com"),
    [password, setPassword] = useState(""),
    [code, setCode] = useState(""),
    [showPassword, setShowPassword] = useState(false),
    [error, setError] = useState(
      state === "error"
        ? "Example sign-in failed. Check the details and try again."
        : "",
    ),
    [notice, setNotice] = useState("");
  const passwordId = useId();
  if (current === "unknown")
    return (
      <div className="s-pattern-pad">
        <DemoStateNotice
          state={current}
          onReset={() => {
            setCurrent("ready");
            setNotice(
              "The demonstration status was checked. Continue with the example.",
            );
          }}
        />
        <DemoNotice />
      </div>
    );
  return (
    <div className="s-pattern-pad s-auth-pattern">
      <SaasTabs
        label="Authentication examples"
        value={view}
        onChange={(value) => {
          setView(value);
          setError("");
          setNotice("");
        }}
        items={[
          { id: "login", label: "Sign in" },
          { id: "verify", label: "Verify code" },
          { id: "recovery", label: "Recovery" },
        ]}
      >
        <div className="s-auth-example">
          <span className="s-eyebrow">APCOSYS</span>
          <h3>
            {view === "login"
              ? "Welcome back"
              : view === "verify"
                ? "Verify your email"
                : "Reset password"}
          </h3>
          <p>
            {view === "login"
              ? "Continue to your workspace."
              : view === "verify"
                ? "Enter the code sent to your email."
                : "Request a reset code for your account."}
          </p>
          {error && <SaasAlert tone="error">{error}</SaasAlert>}
          {notice && <SaasAlert tone="success">{notice}</SaasAlert>}
          <form
            className="s-form"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              setNotice("");
              if (view === "verify") {
                if (code.replace(/\s/g, "") !== "123456") {
                  setError(
                    "Use the demo code 123456. You can paste all six digits.",
                  );
                  return;
                }
                setError("");
                setNotice(
                  "Demo verification complete. No account was verified.",
                );
              } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setError(
                  "Enter an email address in the form name@example.com.",
                );
              } else if (view === "login" && !password.trim()) {
                setError(
                  "Enter a demonstration password. Do not use a real password.",
                );
              } else {
                setError("");
                setNotice(
                  view === "login"
                    ? "Demo sign-in flow complete. You are not signed in to an account."
                    : "Demo reset requested. No email was sent.",
                );
              }
            }}
          >
            <SaasField
              label="Email address"
              type="email"
              autoComplete="off"
              value={email}
              disabled={current === "loading"}
              onChange={(event) => setEmail(event.target.value)}
            />
            {view === "login" && (
              <div className="s-field">
                <label htmlFor={passwordId}>Password</label>
                <div className="s-password-control">
                  <input
                    id={passwordId}
                    autoComplete="new-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    disabled={current === "loading"}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button
                    type="button"
                    aria-pressed={showPassword}
                    disabled={current === "loading"}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <small>
                  Use a sample password, never your real credentials.
                </small>
              </div>
            )}
            {view === "verify" && (
              <SaasField
                label="Verification code"
                value={code}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={10}
                onChange={(event) =>
                  setCode(event.target.value.replace(/[^0-9\s]/g, ""))
                }
                hint="Demo code: 123456"
                disabled={current === "loading"}
              />
            )}
            {view === "login" && (
              <button
                type="button"
                className="s-inline-action"
                onClick={() => {
                  setView("recovery");
                  setError("");
                  setNotice("");
                }}
              >
                Forgot password?
              </button>
            )}
            <SaasButton type="submit" busy={current === "loading"}>
              {view === "login"
                ? "Continue in demo"
                : view === "verify"
                  ? "Verify demo code"
                  : "Request demo reset"}
              <Icon name="arrow" />
            </SaasButton>
          </form>
        </div>
      </SaasTabs>
      <DemoNotice>
        Local form example · no sign-in, verification or email delivery
      </DemoNotice>
    </div>
  );
}

export function AccountPattern({ state = "ready" }: PatternProps) {
  const [current, setCurrent] = useState(state),
    [tab, setTab] = useState("profile"),
    [name, setName] = useState("Alex Lee"),
    [notice, setNotice] = useState(""),
    [revealed, setRevealed] = useState(false),
    [keyVersion, setKeyVersion] = useState(1),
    [confirm, setConfirm] = useState(false);
  const demoKey = `apco_demo_only_not_a_real_key_00${keyVersion}`;
  async function copyKey() {
    try {
      await navigator.clipboard.writeText(demoKey);
      setNotice(
        "Demonstration key copied. It cannot authenticate any request.",
      );
    } catch {
      setNotice(
        "Clipboard unavailable. Reveal the sample key and copy it manually.",
      );
    }
  }
  return (
    <div className="s-pattern-pad">
      <div className="s-page-heading">
        <div>
          <h3>Account settings</h3>
          <p>Manage your profile and access.</p>
        </div>
        <span className="s-avatar s-avatar--large">AL</span>
      </div>
      <SaasTabs
        label="Account example sections"
        value={tab}
        onChange={(value) => {
          setTab(value);
          setNotice("");
        }}
        items={[
          { id: "profile", label: "Profile" },
          { id: "security", label: "Security" },
          { id: "key", label: "API key" },
        ]}
      >
        {current !== "ready" ? (
          <DemoStateNotice
            state={current}
            onReset={() => setCurrent("ready")}
          />
        ) : tab === "profile" ? (
          <form
            className="s-form"
            onSubmit={(event) => {
              event.preventDefault();
              setNotice(
                name.trim()
                  ? "Profile name updated in this example only."
                  : "Enter a display name.",
              );
            }}
          >
            <div className="s-form-grid">
              <SaasField
                label="Display name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <SaasField
                label="Email"
                type="email"
                value="alex@example.com"
                readOnly
                hint="Email changes require a separate verification flow."
              />
            </div>
            <div className="s-action-row">
              <SaasButton type="submit">Save demo profile</SaasButton>
            </div>
          </form>
        ) : tab === "security" ? (
          <div className="s-security-list">
            <section>
              <div>
                <h4>Two-factor authentication</h4>
                <p>Authenticator app and backup codes.</p>
              </div>
              <SaasBadge tone="success">Enabled · example</SaasBadge>
            </section>
            <section>
              <div>
                <h4>Current session</h4>
                <p>Chrome · Desktop · active now</p>
              </div>
              <SaasBadge>This session</SaasBadge>
            </section>
            <SaasAlert>
              Security changes should explain their consequence before
              confirmation. Demo examples never change real credentials.
            </SaasAlert>
          </div>
        ) : (
          <div className="s-form">
            <div className="s-key-heading">
              <h4>Account API key</h4>
              <SaasBadge>Demo key</SaasBadge>
            </div>
            <SaasField
              label="API key"
              value={demoKey}
              type={revealed ? "text" : "password"}
              readOnly
              autoComplete="off"
            />
            <div className="s-action-row">
              <SaasButton
                variant="secondary"
                onClick={() => setRevealed(!revealed)}
              >
                {revealed ? "Hide key" : "Reveal key"}
              </SaasButton>
              <SaasButton variant="secondary" onClick={() => void copyKey()}>
                <Icon name="copy" />
                Copy demo key
              </SaasButton>
            </div>
            <div className="s-danger-zone">
              <div>
                <h4>Replace API key</h4>
                <p>The real flow invalidates the previous key immediately.</p>
              </div>
              <SaasButton variant="secondary" onClick={() => setConfirm(true)}>
                Replace demo key
              </SaasButton>
            </div>
          </div>
        )}
        {notice && <SaasAlert tone="info">{notice}</SaasAlert>}
      </SaasTabs>
      <SaasDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Replace this demo API key?"
        footer={
          <>
            <SaasButton variant="secondary" onClick={() => setConfirm(false)}>
              Cancel
            </SaasButton>
            <SaasButton
              variant="danger"
              onClick={() => {
                setKeyVersion(keyVersion + 1);
                setRevealed(true);
                setConfirm(false);
                setNotice("Demo key replaced. No real API access changed.");
              }}
            >
              Replace demo key
            </SaasButton>
          </>
        }
      >
        <p>
          In the application, the previous key stops working immediately. Each
          integration must use the new key.
        </p>
        <SaasAlert>
          This example changes only its local demonstration value.
        </SaasAlert>
      </SaasDialog>
      <DemoNotice />
    </div>
  );
}

const plans = [
  {
    name: "Free",
    month: 0,
    annual: 0,
    description: "Explore the platform",
    current: true,
  },
  {
    name: "Plus",
    month: 50,
    annual: 480,
    description: "Individual research",
    current: false,
  },
  {
    name: "Expert",
    month: 300,
    annual: 2880,
    description: "Advanced investigation",
    current: false,
  },
  {
    name: "Business",
    month: 900,
    annual: 8640,
    description: "Team workflows",
    current: false,
  },
];
const dollars = (value: number) => `$${value.toLocaleString("en-US")}`;
export function BillingPattern({ state = "ready" }: PatternProps) {
  const [current, setCurrent] = useState(state),
    [annual, setAnnual] = useState(false),
    [selected, setSelected] = useState<(typeof plans)[number] | null>(null);
  if (current !== "ready")
    return (
      <div className="s-pattern-pad">
        <DemoStateNotice state={current} onReset={() => setCurrent("ready")} />
        <DemoNotice />
      </div>
    );
  return (
    <div className="s-pattern-pad">
      <div className="s-page-heading">
        <div>
          <h3>Choose your plan</h3>
          <p>Compare the billing period and total before continuing.</p>
        </div>
      </div>
      <div
        className="s-billing-switch"
        role="group"
        aria-label="Billing period"
      >
        <button
          type="button"
          aria-pressed={!annual}
          onClick={() => setAnnual(false)}
        >
          Monthly
        </button>
        <button
          type="button"
          aria-pressed={annual}
          onClick={() => setAnnual(true)}
        >
          Annually<span>−20%</span>
        </button>
      </div>
      <div className="s-plan-grid">
        {plans.map((plan) => (
          <article className="s-plan" key={plan.name}>
            <div className="s-plan-heading">
              <h4>{plan.name}</h4>
              {plan.current && <SaasBadge>Current</SaasBadge>}
            </div>
            <p>{plan.description}</p>
            <div className="s-plan-price">
              <strong>{dollars(annual ? plan.annual / 12 : plan.month)}</strong>
              <span>/ month</span>
            </div>
            <small>
              {annual
                ? `${dollars(plan.annual)} billed annually`
                : `${dollars(plan.month)} billed monthly`}
            </small>
            <SaasButton
              variant={plan.current ? "secondary" : "primary"}
              disabled={plan.current}
              onClick={() => setSelected(plan)}
            >
              {plan.current ? "Current plan" : `Review ${plan.name}`}
            </SaasButton>
          </article>
        ))}
      </div>
      <p className="s-inline-note">
        This example documents prices and order presentation. Included
        allowances and availability are provided by the application.
      </p>
      <SaasDialog
        open={selected !== null}
        onClose={() => setSelected(null)}
        title="Review order"
        footer={
          <SaasButton variant="secondary" onClick={() => setSelected(null)}>
            Close demo order
          </SaasButton>
        }
      >
        {selected && (
          <>
            <div className="s-order-heading">
              <h4>{selected.name}</h4>
              <SaasBadge>
                {annual ? "Annual subscription" : "Monthly subscription"}
              </SaasBadge>
            </div>
            <dl className="s-definition-list">
              <div>
                <dt>Billing period</dt>
                <dd>{annual ? "12 months" : "1 month"}</dd>
              </div>
              <div>
                <dt>Monthly equivalent</dt>
                <dd>
                  {dollars(annual ? selected.annual / 12 : selected.month)}
                </dd>
              </div>
              <div className="s-order-total">
                <dt>Total for the period</dt>
                <dd>{dollars(annual ? selected.annual : selected.month)}</dd>
              </div>
            </dl>
            <SaasAlert>
              No payment will be created or processed. The real checkout selects
              an available provider and confirms its result separately.
            </SaasAlert>
          </>
        )}
      </SaasDialog>
      <DemoNotice>
        Confirmed plan amounts · local order preview · no payment provider
      </DemoNotice>
    </div>
  );
}
