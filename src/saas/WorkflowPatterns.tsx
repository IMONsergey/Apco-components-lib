import { useId, useLayoutEffect, useRef, useState } from "react";
import { Icon, type IconName } from "../components/ui/Icon";
import {
  DemoNotice,
  DemoStateNotice,
  SaasAlert,
  SaasBadge,
  SaasButton,
  SaasDialog,
  SaasEmpty,
  SaasField,
  SaasSelect,
  type PatternProps,
} from "./primitives";

const navItems: { label: string; icon: IconName }[] = [
  { label: "Search", icon: "search" },
  { label: "Search history", icon: "bookmark" },
  { label: "Private Scanner", icon: "scanner" },
  { label: "Files", icon: "database" },
  { label: "API", icon: "cube" },
  { label: "Billing", icon: "book" },
];
export function WorkspacePattern() {
  const [collapsed, setCollapsed] = useState(false),
    [active, setActive] = useState("Search"),
    [account, setAccount] = useState(false),
    [mobile, setMobile] = useState(false),
    [mobileOpen, setMobileOpen] = useState(false);
  const workspace = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = workspace.current;
    if (!element) return;
    const sync = () => setMobile(element.clientWidth <= 500);
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const navigation = (closeOnSelect = false) => (
    <nav aria-label="Example workspace navigation">
      {navItems.map((item) => (
        <button
          type="button"
          key={item.label}
          className={active === item.label ? "is-active" : ""}
          aria-current={active === item.label ? "page" : undefined}
          title={collapsed && !mobile ? item.label : undefined}
          onClick={() => {
            setActive(item.label);
            if (closeOnSelect) setMobileOpen(false);
          }}
        >
          <Icon name={item.icon} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
  return (
    <div
      ref={workspace}
      data-mobile={mobile}
      className={`s-workspace ${collapsed && !mobile ? "is-collapsed" : ""}`}
    >
      <aside className="s-workspace-nav">
        <div className="s-workspace-brand">
          <strong>APCOSYS</strong>
          <SaasButton
            variant="ghost"
            className="s-icon-button"
            aria-label={
              mobile
                ? "Open workspace navigation"
                : collapsed
                  ? "Expand navigation"
                  : "Collapse navigation"
            }
            aria-expanded={mobile ? mobileOpen : !collapsed}
            onClick={() =>
              mobile ? setMobileOpen(true) : setCollapsed(!collapsed)
            }
          >
            <Icon name="menu" />
          </SaasButton>
        </div>
        {!mobile && (
          <>
            {navigation()}
            <div className="s-workspace-account">
              <button
                type="button"
                aria-label="Example account menu"
                aria-expanded={account}
                onClick={() => setAccount(!account)}
              >
                <span className="s-avatar">AL</span>
                <span>
                  <strong>Alex Lee</strong>
                  <small>Expert plan</small>
                </span>
                <Icon name="chevron" />
              </button>
              {account && (
                <div className="s-account-menu">
                  <a href="#saas/account">
                    Account settings
                    <Icon name="arrow" />
                  </a>
                  <a href="#saas/usage">
                    Balance & limits
                    <Icon name="arrow" />
                  </a>
                </div>
              )}
            </div>
          </>
        )}
      </aside>
      <section className="s-workspace-main">
        <div className="s-page-heading">
          <div>
            <span className="s-eyebrow">WORKSPACE</span>
            <h3>{active}</h3>
            <p>
              {active === "Search"
                ? "Explore internet-facing infrastructure."
                : `Your ${active.toLowerCase()} workspace.`}
            </p>
          </div>
          <SaasBadge>Demo</SaasBadge>
        </div>
        <div className="s-workspace-placeholder">
          <Icon
            name={
              navItems.find((item) => item.label === active)?.icon || "search"
            }
            width={26}
            height={26}
          />
          <h4>{active === "Search" ? "Start with a query" : active}</h4>
          <p>Navigation stays in place while the workspace changes.</p>
          <a
            className="s-text-link"
            href={`#saas/${active === "Search" ? "search" : active === "Search history" ? "history" : active === "Private Scanner" ? "scanner" : active === "Billing" ? "billing" : active === "API" ? "account" : "results"}`}
          >
            Open this pattern
            <Icon name="arrow" />
          </a>
        </div>
        <DemoNotice />
      </section>
      <SaasDialog
        open={mobile && mobileOpen}
        onClose={() => setMobileOpen(false)}
        title="Workspace navigation"
        className="s-nav-dialog"
      >
        <div className="s-workspace-nav">
          {navigation(true)}
          <a
            href="#saas/account"
            className="s-text-link"
            onClick={() => setMobileOpen(false)}
          >
            <span className="s-avatar">AL</span>Alex Lee · Account
            <Icon name="arrow" />
          </a>
        </div>
      </SaasDialog>
    </div>
  );
}

export function ControlsPattern({ state = "ready" }: PatternProps) {
  const [name, setName] = useState(""),
    [project, setProject] = useState("research"),
    [enabled, setEnabled] = useState(true),
    [submitted, setSubmitted] = useState(state === "error"),
    [saved, setSaved] = useState(false),
    [copyNotice, setCopyNotice] = useState("");
  const busy = state === "loading";
  const checkbox = useId();
  async function copyExample() {
    try {
      await navigator.clipboard.writeText("protocol: HTTPS");
      setCopyNotice("Sample query copied: protocol: HTTPS");
    } catch {
      setCopyNotice(
        "Clipboard unavailable. Copy this sample manually: protocol: HTTPS",
      );
    }
  }
  return (
    <div className="s-pattern-pad">
      <div className="s-page-heading">
        <div>
          <h3>Save this query</h3>
          <p>Keep a useful search for your next investigation.</p>
        </div>
        <SaasBadge>Form pattern</SaasBadge>
      </div>
      <form
        className="s-form"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
          if (name.trim()) setSaved(true);
        }}
        noValidate
      >
        <div className="s-form-grid">
          <SaasField
            label="Query name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setSaved(false);
            }}
            placeholder="Public web servers"
            disabled={busy}
            error={
              submitted && !name.trim()
                ? "Enter a name for this query."
                : undefined
            }
            hint="Use a name your team can recognize."
          />
          <SaasSelect
            label="Collection"
            value={project}
            onChange={setProject}
            disabled={busy}
            options={[
              { value: "research", label: "Research" },
              { value: "infrastructure", label: "Infrastructure" },
              {
                value: "archive",
                label: "Archived collection",
                disabled: true,
              },
            ]}
          />
        </div>
        <label className="s-checkbox" htmlFor={checkbox}>
          <input
            id={checkbox}
            type="checkbox"
            checked={enabled}
            disabled={busy}
            onChange={(event) => setEnabled(event.target.checked)}
          />
          <span>
            Include the current filters
            <small>Restore the same conditions when reopening.</small>
          </span>
        </label>
        <div className="s-action-row">
          <SaasButton type="submit" busy={busy}>
            Save query
          </SaasButton>
          <SaasButton
            variant="secondary"
            disabled={busy}
            onClick={() => {
              setName("");
              setSubmitted(false);
              setSaved(false);
            }}
          >
            Reset
          </SaasButton>
        </div>
        {saved && (
          <SaasAlert tone="success">
            Demo query “{name.trim()}” saved in this example. No account data
            was changed.
          </SaasAlert>
        )}
      </form>
      <div className="s-component-strip">
        <div>
          <small>Secondary</small>
          <SaasButton variant="secondary" onClick={() => void copyExample()}>
            <Icon name="copy" />
            Copy
          </SaasButton>
        </div>
        <div>
          <small>Disabled</small>
          <SaasButton disabled>Unavailable</SaasButton>
        </div>
        <div>
          <small>Loading</small>
          <SaasButton busy>Saving</SaasButton>
        </div>
        <div>
          <small>Destructive</small>
          <SaasButton
            variant="danger"
            onClick={() => {
              setName("");
              setSubmitted(false);
              setSaved(false);
            }}
          >
            Clear example
          </SaasButton>
        </div>
      </div>
      {copyNotice && (
        <p className="s-inline-note" role="status">
          {copyNotice}
        </p>
      )}
      <DemoNotice />
    </div>
  );
}

const demoHosts = [
  {
    ip: "192.0.2.12",
    domain: "web.example.com",
    protocol: "HTTPS",
    country: "Netherlands",
    ports: "80, 443",
  },
  {
    ip: "192.0.2.42",
    domain: "api.example.com",
    protocol: "HTTPS",
    country: "Germany",
    ports: "443",
  },
  {
    ip: "198.51.100.8",
    domain: "mail.example.net",
    protocol: "SMTP",
    country: "Netherlands",
    ports: "25, 587",
  },
];
export function SearchPattern({ state = "ready" }: PatternProps) {
  const [current, setCurrent] = useState(state),
    [query, setQuery] = useState(""),
    [submitted, setSubmitted] = useState("");
  const [type, setType] = useState("all"),
    [filtersOpen, setFiltersOpen] = useState(false),
    [protocol, setProtocol] = useState("all"),
    [country, setCountry] = useState("all");
  const [draftProtocol, setDraftProtocol] = useState("all"),
    [draftCountry, setDraftCountry] = useState("all");
  const filtered = demoHosts.filter(
    (host) =>
      (!submitted ||
        `${host.ip} ${host.domain}`.includes(submitted.toLowerCase())) &&
      (protocol === "all" || host.protocol === protocol) &&
      (country === "all" || host.country === country),
  );
  const count = Number(protocol !== "all") + Number(country !== "all");
  const open = () => {
    setDraftProtocol(protocol);
    setDraftCountry(country);
    setFiltersOpen(true);
  };
  return (
    <div className="s-pattern-pad">
      <div className="s-search-top">
        <h3>Search</h3>
        <a href="#saas/history" className="s-history-shortcut">
          <Icon name="bookmark" />
          History
        </a>
      </div>
      <form
        className="s-search-bar"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(query.trim());
          setCurrent("ready");
        }}
      >
        <Icon name="search" width={22} height={22} />
        <input
          aria-label="Example search query"
          placeholder="IP, domain or search query"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <SaasButton type="submit" aria-label="Run example search">
          <Icon name="arrow" />
        </SaasButton>
      </form>
      <div className="s-search-controls">
        <SaasSelect
          label="Result type"
          value={type}
          onChange={setType}
          options={[
            { value: "all", label: "All types" },
            { value: "ipv4", label: "IPv4" },
            { value: "ipv6", label: "IPv6" },
            { value: "domain", label: "Domain" },
          ]}
        />
        <SaasButton
          variant="secondary"
          aria-expanded={filtersOpen}
          onClick={open}
        >
          <Icon name="plus" />
          Filters{count > 0 && <span className="s-count">{count}</span>}
        </SaasButton>
      </div>
      <div className="s-query-workspace">
        {filtersOpen && (
          <aside className="s-filter-panel" aria-label="Search conditions">
            <header>
              <h4>Filters</h4>
              <SaasButton
                className="s-icon-button"
                variant="ghost"
                aria-label="Close filters"
                onClick={() => setFiltersOpen(false)}
              >
                <Icon name="close" />
              </SaasButton>
            </header>
            <SaasSelect
              label="Protocol"
              value={draftProtocol}
              onChange={setDraftProtocol}
              options={[
                { value: "all", label: "Any protocol" },
                { value: "HTTPS", label: "HTTPS" },
                { value: "SMTP", label: "SMTP" },
              ]}
            />
            <SaasSelect
              label="Country"
              value={draftCountry}
              onChange={setDraftCountry}
              options={[
                { value: "all", label: "Any country" },
                { value: "Netherlands", label: "Netherlands" },
                { value: "Germany", label: "Germany" },
              ]}
            />
            <p>Changes apply when you confirm.</p>
            <div className="s-action-row">
              <SaasButton
                onClick={() => {
                  setProtocol(draftProtocol);
                  setCountry(draftCountry);
                  setCurrent("ready");
                  setFiltersOpen(false);
                }}
              >
                Apply
              </SaasButton>
              <SaasButton
                variant="secondary"
                onClick={() => setFiltersOpen(false)}
              >
                Cancel
              </SaasButton>
            </div>
          </aside>
        )}
        <div className="s-query-results">
          {count > 0 && (
            <div className="s-chips">
              {protocol !== "all" && (
                <button
                  type="button"
                  onClick={() => setProtocol("all")}
                  aria-label={`Remove ${protocol} filter`}
                >
                  Protocol: {protocol}
                  <Icon name="close" />
                </button>
              )}
              {country !== "all" && (
                <button
                  type="button"
                  onClick={() => setCountry("all")}
                  aria-label={`Remove ${country} filter`}
                >
                  Country: {country}
                  <Icon name="close" />
                </button>
              )}
            </div>
          )}
          {!["ready", "empty"].includes(current) ? (
            <DemoStateNotice
              state={current}
              onReset={() => setCurrent("ready")}
            />
          ) : current === "empty" || !filtered.length || type === "ipv6" ? (
            <SaasEmpty
              title="No matching hosts"
              action={
                <SaasButton
                  variant="secondary"
                  onClick={() => {
                    setQuery("");
                    setSubmitted("");
                    setProtocol("all");
                    setCountry("all");
                    setType("all");
                    setCurrent("ready");
                  }}
                >
                  Clear example filters
                </SaasButton>
              }
            >
              Try a different query or remove a filter.
            </SaasEmpty>
          ) : (
            <>
              <div className="s-result-caption">
                <strong>{filtered.length} example records</strong>
                <SaasBadge>Sample dataset</SaasBadge>
              </div>
              {filtered.map((host) => (
                <article className="s-host-row" key={host.ip}>
                  <div>
                    <a href="#saas/object" className="s-mono s-text-link">
                      {type === "domain" ? host.domain : host.ip}
                      <Icon name="external" />
                    </a>
                    <p>{host.domain}</p>
                  </div>
                  <span>{host.country}</span>
                  <div className="s-row-badges">
                    <SaasBadge>{host.protocol}</SaasBadge>
                    <span className="s-mono">{host.ports}</span>
                  </div>
                </article>
              ))}
            </>
          )}
        </div>
      </div>
      <DemoNotice>
        Interactive example · RFC documentation addresses · no live search
      </DemoNotice>
    </div>
  );
}

function parsePorts(value: string): number[] | null {
  const ports = value
    .split(/[\s,]+/)
    .filter(Boolean)
    .map(Number);
  return ports.length &&
    ports.every((port) => Number.isInteger(port) && port > 0 && port <= 65535)
    ? [...new Set(ports)]
    : null;
}
export function ScannerPattern({ state = "ready" }: PatternProps) {
  const [current, setCurrent] = useState(state),
    [targets, setTargets] = useState("192.0.2.12\nweb.example.com"),
    [cidrs, setCidrs] = useState(""),
    [ports, setPorts] = useState("80, 443"),
    [error, setError] = useState(""),
    [review, setReview] = useState(false),
    [created, setCreated] = useState(false);
  const targetList = targets.split(/[\s,]+/).filter(Boolean),
    portList = parsePorts(ports);
  const estimate =
    !cidrs.trim() && portList ? targetList.length * portList.length : undefined;
  const targetsId = useId(),
    cidrId = useId();
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
          <h3>New scan</h3>
          <p>Define the scope before creating a task.</p>
        </div>
        <SaasBadge>Private Scanner</SaasBadge>
      </div>
      <form
        className="s-scanner-layout"
        onSubmit={(event) => {
          event.preventDefault();
          if ((!targetList.length && !cidrs.trim()) || !portList) {
            setError(
              "Add a target and valid port numbers between 1 and 65535.",
            );
            return;
          }
          setError("");
          setReview(true);
        }}
      >
        <div className="s-form">
          <label className="s-field" htmlFor={targetsId}>
            <span>Hosts and IP addresses</span>
            <textarea
              id={targetsId}
              value={targets}
              onChange={(event) => setTargets(event.target.value)}
              rows={4}
              spellCheck={false}
            />
            <small>
              One target per line. Use documentation addresses in this example.
            </small>
          </label>
          <label className="s-field" htmlFor={cidrId}>
            <span>
              CIDR blocks <span className="s-muted">optional</span>
            </span>
            <textarea
              id={cidrId}
              value={cidrs}
              onChange={(event) => setCidrs(event.target.value)}
              rows={2}
              placeholder="192.0.2.0/28"
              spellCheck={false}
            />
            <small>
              CIDR estimation belongs to the application’s scan model.
            </small>
          </label>
          <SaasField
            label="Ports"
            value={ports}
            onChange={(event) => setPorts(event.target.value)}
            hint="Separate port numbers with commas. Example: 80, 443."
            error={error || undefined}
          />
          <div className="s-action-row">
            <SaasButton type="submit">
              Review scan
              <Icon name="arrow" />
            </SaasButton>
          </div>
        </div>
        <aside className="s-scan-summary">
          <Icon name="scanner" width={26} height={26} />
          <h4>Scan estimate</h4>
          <dl>
            <div>
              <dt>Individual targets</dt>
              <dd>{targetList.length}</dd>
            </div>
            <div>
              <dt>Ports per target</dt>
              <dd>{portList?.length || "—"}</dd>
            </div>
            <div>
              <dt>Estimated credits</dt>
              <dd>{estimate ?? "—"}</dd>
            </div>
          </dl>
          <p>
            {estimate !== undefined
              ? "Targets × ports. The server determines the final charge."
              : "A full estimate requires the application’s CIDR validation."}
          </p>
          <SaasBadge>Demo · no credits spent</SaasBadge>
        </aside>
      </form>
      {created && (
        <SaasAlert tone="success" title="Demo task added">
          The confirmation flow is complete. No scan was started and no credits
          were spent.
        </SaasAlert>
      )}
      <SaasDialog
        open={review}
        onClose={() => setReview(false)}
        title="Review scan"
        footer={
          <>
            <SaasButton variant="secondary" onClick={() => setReview(false)}>
              Back
            </SaasButton>
            <SaasButton
              onClick={() => {
                setReview(false);
                setCreated(true);
              }}
            >
              Create demo task
            </SaasButton>
          </>
        }
      >
        <p>Check the scope before confirming.</p>
        <dl className="s-definition-list">
          <div>
            <dt>Targets</dt>
            <dd className="s-mono">{targetList.join(", ") || "—"}</dd>
          </div>
          <div>
            <dt>CIDR blocks</dt>
            <dd className="s-mono">{cidrs || "None"}</dd>
          </div>
          <div>
            <dt>Ports</dt>
            <dd className="s-mono">{portList?.join(", ")}</dd>
          </div>
          <div>
            <dt>Estimated scan credits</dt>
            <dd>{estimate ?? "Requires full validation"}</dd>
          </div>
        </dl>
        <SaasAlert>
          This is a local interface example. It does not send a scan request.
        </SaasAlert>
      </SaasDialog>
      <DemoNotice />
    </div>
  );
}

const historyEntries = [
  {
    id: 1,
    query: "protocol: HTTPS",
    type: "All types",
    date: "Today, 10:42",
    details: "Protocol equals HTTPS · 20 rows per page",
  },
  {
    id: 2,
    query: "web.example.com",
    type: "Domain",
    date: "Today, 09:15",
    details: "Domain search · newest observation first",
  },
  {
    id: 3,
    query: "192.0.2.0/24",
    type: "IPv4",
    date: "Yesterday, 16:08",
    details: "Network condition · 20 rows per page",
  },
];
export function HistoryPattern({ state = "ready" }: PatternProps) {
  const [entries, setEntries] = useState(
      state === "empty" ? [] : historyEntries,
    ),
    [query, setQuery] = useState(""),
    [selected, setSelected] = useState<(typeof historyEntries)[number] | null>(
      null,
    ),
    [remove, setRemove] = useState<number | null>(null);
  const shown = entries.filter((entry) =>
    entry.query.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="s-pattern-pad">
      <div className="s-page-heading">
        <div>
          <h3>Search history</h3>
          <p>Return to a previous query.</p>
        </div>
        <SaasBadge>Local example</SaasBadge>
      </div>
      <SaasField
        type="search"
        label="Find a query"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search your history"
      />
      {shown.length ? (
        <div className="s-history-list">
          {shown.map((entry) => (
            <article key={entry.id}>
              <button
                type="button"
                className="s-history-query"
                onClick={() => setSelected(entry)}
              >
                <strong className="s-mono">{entry.query}</strong>
                <span>
                  {entry.type} · {entry.date}
                </span>
              </button>
              <SaasButton
                variant="ghost"
                className="s-icon-button"
                aria-label={`Remove ${entry.query} from example history`}
                onClick={() => setRemove(entry.id)}
              >
                <Icon name="close" />
              </SaasButton>
            </article>
          ))}
        </div>
      ) : (
        <SaasEmpty
          title={query ? "No matching queries" : "Your history is empty"}
          action={
            <SaasButton
              variant="secondary"
              onClick={() => {
                setEntries(historyEntries);
                setQuery("");
              }}
            >
              Restore sample history
            </SaasButton>
          }
        >
          {query
            ? "Try another name or remove your search text."
            : "Queries you run will appear here."}
        </SaasEmpty>
      )}
      <SaasDialog
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Query details"
        footer={
          <SaasButton variant="secondary" onClick={() => setSelected(null)}>
            Close
          </SaasButton>
        }
      >
        <code className="s-code-line">{selected?.query}</code>
        <p>{selected?.details}</p>
        <p className="s-muted">
          Opening a query restores its conditions. Fetching fresh results is a
          separate action.
        </p>
        <a href="#saas/search" className="s-text-link">
          Open search pattern
          <Icon name="arrow" />
        </a>
      </SaasDialog>
      <SaasDialog
        open={remove !== null}
        onClose={() => setRemove(null)}
        title="Remove from history?"
        footer={
          <>
            <SaasButton variant="secondary" onClick={() => setRemove(null)}>
              Cancel
            </SaasButton>
            <SaasButton
              variant="danger"
              onClick={() => {
                setEntries(entries.filter((entry) => entry.id !== remove));
                setRemove(null);
              }}
            >
              Remove demo entry
            </SaasButton>
          </>
        }
      >
        <p>
          This removes one entry from the local example. It does not delete any
          host data.
        </p>
      </SaasDialog>
      <DemoNotice />
    </div>
  );
}
