import { useEffect, useState } from "react";
import { Icon } from "../components/ui/Icon";
import {
  DemoNotice,
  DemoStateNotice,
  SaasAlert,
  SaasBadge,
  SaasButton,
  SaasDialog,
  SaasEmpty,
  SaasSelect,
  SaasTabs,
  type PatternProps,
} from "./primitives";

const resultRows = Array.from({ length: 46 }, (_, index) => ({
  ip: `192.0.2.${index + 10}`,
  domain: `host-${String(index + 1).padStart(2, "0")}.example.com`,
  country: ["Netherlands", "Germany", "France"][index % 3] || "Netherlands",
  ports: index % 3 === 0 ? 4 : index % 3 === 1 ? 2 : 1,
  observed: index % 2 === 0 ? "25 Oct, 09:42" : "24 Oct, 18:16",
}));
export function ResultsPattern({ state = "ready" }: PatternProps) {
  const [current, setCurrent] = useState(state),
    [mode, setMode] = useState(state === "limited" ? "limited" : "known"),
    [page, setPage] = useState(1),
    [size, setSize] = useState(10),
    [sort, setSort] = useState<"ip" | "ports">("ip"),
    [ascending, setAscending] = useState(true);
  const maxPage =
    mode === "limited"
      ? Math.min(2, Math.ceil(resultRows.length / size))
      : Math.ceil(resultRows.length / size);
  const sorted = [...resultRows].sort(
    (a, b) =>
      (sort === "ports"
        ? a.ports - b.ports
        : Number(a.ip.split(".").at(-1)) - Number(b.ip.split(".").at(-1))) *
      (ascending ? 1 : -1),
  );
  const shown = sorted.slice((page - 1) * size, page * size);
  function changeSort(field: "ip" | "ports") {
    setAscending(sort === field ? !ascending : true);
    setSort(field);
    setPage(1);
  }
  if (current === "loading" || current === "error")
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
          <h3>Host results</h3>
          <p>Compare records and inspect an object.</p>
        </div>
        <SaasBadge>Sample dataset</SaasBadge>
      </div>
      <div className="s-table-toolbar">
        <SaasSelect
          label="Pagination mode"
          value={mode}
          onChange={(value) => {
            setMode(value);
            setPage(1);
          }}
          options={[
            { value: "known", label: "Known total" },
            { value: "unknown", label: "Unknown total" },
            { value: "limited", label: "Plan limit · 2 pages" },
          ]}
        />
        <SaasSelect
          label="Rows"
          value={String(size)}
          onChange={(value) => {
            setSize(Number(value));
            setPage(1);
          }}
          options={[10, 20, 25, 50].map((value) => ({
            value: String(value),
            label: String(value),
          }))}
        />
      </div>
      {current === "empty" ? (
        <SaasEmpty
          title="No matching hosts"
          action={
            <SaasButton variant="secondary" onClick={() => setCurrent("ready")}>
              Restore example records
            </SaasButton>
          }
        >
          Try another query or remove a filter.
        </SaasEmpty>
      ) : (
        <>
          <div
            className="s-table-scroll"
            role="region"
            aria-label="Example host results"
            tabIndex={0}
          >
            <table className="s-table">
              <thead>
                <tr>
                  <th
                    aria-sort={
                      sort === "ip"
                        ? ascending
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                  >
                    <button type="button" onClick={() => changeSort("ip")}>
                      Address
                      <span aria-hidden="true">
                        {sort === "ip" ? (ascending ? "↑" : "↓") : "↕"}
                      </span>
                    </button>
                  </th>
                  <th>Country</th>
                  <th
                    aria-sort={
                      sort === "ports"
                        ? ascending
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                  >
                    <button type="button" onClick={() => changeSort("ports")}>
                      Ports
                      <span aria-hidden="true">
                        {sort === "ports" ? (ascending ? "↑" : "↓") : "↕"}
                      </span>
                    </button>
                  </th>
                  <th>Observed</th>
                  <th>
                    <span className="sr-only">Details</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {shown.map((row) => (
                  <tr key={row.ip}>
                    <td>
                      <strong className="s-mono">{row.ip}</strong>
                      <small>{row.domain}</small>
                    </td>
                    <td>{row.country}</td>
                    <td className="s-mono">{row.ports}</td>
                    <td>{row.observed}</td>
                    <td>
                      <a
                        className="s-table-open"
                        href="#saas/object"
                        aria-label={`Inspect example ${row.ip}`}
                      >
                        <Icon name="external" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <nav className="s-pagination" aria-label="Example result pages">
            <p aria-live="polite">
              {mode === "known"
                ? `${resultRows.length} results · Page ${page} of ${maxPage}`
                : `Page ${page}${mode === "limited" ? " · demo limit: 2 pages" : " · total not provided"}`}
            </p>
            <div>
              <SaasButton
                variant="secondary"
                aria-label="Previous result page"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <Icon name="previous" />
              </SaasButton>
              {mode === "known" &&
                Array.from({ length: maxPage }, (_, index) => index + 1).map(
                  (number) => (
                    <button
                      className="s-page-number"
                      key={number}
                      type="button"
                      aria-label={`Result page ${number}`}
                      aria-current={page === number ? "page" : undefined}
                      onClick={() => setPage(number)}
                    >
                      {number}
                    </button>
                  ),
                )}
              <SaasButton
                variant="secondary"
                aria-label="Next result page"
                disabled={
                  mode === "unknown" ? shown.length < size : page >= maxPage
                }
                onClick={() => setPage(page + 1)}
              >
                <Icon name="arrow" />
              </SaasButton>
            </div>
          </nav>
          {mode === "limited" && page === maxPage && (
            <SaasAlert tone="warning" title="Plan limit reached">
              This example stops at {maxPage} pages. Keep your query and review
              the access required for more results.
            </SaasAlert>
          )}
          {mode === "unknown" && (
            <p className="s-inline-note">
              No total is provided. The current page size determines whether
              another page may exist.
            </p>
          )}
        </>
      )}
      <DemoNotice />
    </div>
  );
}

export function ObjectPattern({ state = "ready" }: PatternProps) {
  const [tab, setTab] = useState("overview"),
    [current, setCurrent] = useState(state),
    [service, setService] = useState<string | null>(null);
  return (
    <div className="s-pattern-pad">
      <div className="s-object-header">
        <a href="#saas/results" className="s-text-link">
          <Icon name="previous" />
          Results
        </a>
        <div>
          <h3 className="s-mono">192.0.2.12</h3>
          <SaasBadge tone="neutral">IPv4</SaasBadge>
        </div>
        <p>web.example.com · Netherlands · Example Network</p>
      </div>
      <SaasTabs
        label="Example object sections"
        value={tab}
        onChange={setTab}
        items={[
          { id: "overview", label: "Overview" },
          { id: "services", label: "Services" },
          { id: "dns", label: "DNS & domains" },
          { id: "whois", label: "WHOIS" },
        ]}
      >
        {current === "loading" || current === "error" ? (
          <DemoStateNotice
            state={current}
            onReset={() => setCurrent("ready")}
          />
        ) : current === "empty" ? (
          <SaasEmpty
            title="Section not returned"
            action={
              <SaasButton
                variant="secondary"
                onClick={() => setCurrent("ready")}
              >
                Restore example data
              </SaasButton>
            }
          >
            The server may not provide every field for every object.
          </SaasEmpty>
        ) : tab === "overview" ? (
          <div className="s-object-grid">
            <dl className="s-definition-list">
              <div>
                <dt>Address</dt>
                <dd className="s-mono">192.0.2.12</dd>
              </div>
              <div>
                <dt>Domain</dt>
                <dd className="s-mono">web.example.com</dd>
              </div>
              <div>
                <dt>Network</dt>
                <dd className="s-mono">192.0.2.0/24</dd>
              </div>
              <div>
                <dt>Observed</dt>
                <dd>25 October 2026, 09:42</dd>
              </div>
              <div>
                <dt>Organization</dt>
                <dd>Example Network</dd>
              </div>
            </dl>
            <div className="s-object-summary">
              <span className="s-eyebrow">SERVICES</span>
              <strong>2</strong>
              <p>HTTP and HTTPS observed on this example host.</p>
              <SaasButton
                variant="secondary"
                onClick={() => setTab("services")}
              >
                Inspect services
                <Icon name="arrow" />
              </SaasButton>
            </div>
          </div>
        ) : tab === "services" ? (
          <div className="s-services">
            {[
              {
                port: "443",
                name: "HTTPS",
                detail: "TLS · certificate · HTTP response",
              },
              {
                port: "80",
                name: "HTTP",
                detail: "HTTP banner · detected product",
              },
            ].map((item) => (
              <button
                key={item.port}
                type="button"
                onClick={() => setService(item.port)}
              >
                <span className="s-service-port s-mono">{item.port}</span>
                <span>
                  <strong>{item.name}</strong>
                  <small>{item.detail}</small>
                </span>
                <Icon name="arrow" />
              </button>
            ))}
            <SaasAlert tone="info">
              Product and CVE associations help investigation. They do not
              confirm that this host is vulnerable.
            </SaasAlert>
          </div>
        ) : tab === "dns" ? (
          <dl className="s-definition-list">
            <div>
              <dt>A</dt>
              <dd className="s-mono">web.example.com → 192.0.2.12</dd>
            </div>
            <div>
              <dt>AAAA</dt>
              <dd>Not returned</dd>
            </div>
            <div>
              <dt>Nameservers</dt>
              <dd className="s-mono">
                ns1.example.com
                <br />
                ns2.example.com
              </dd>
            </div>
          </dl>
        ) : (
          <dl className="s-definition-list">
            <div>
              <dt>Range</dt>
              <dd className="s-mono">192.0.2.0 — 192.0.2.255</dd>
            </div>
            <div>
              <dt>Purpose</dt>
              <dd>Documentation address block</dd>
            </div>
            <div>
              <dt>Organization</dt>
              <dd>Example Network</dd>
            </div>
            <div>
              <dt>Contact</dt>
              <dd>Not returned</dd>
            </div>
          </dl>
        )}
      </SaasTabs>
      <SaasDialog
        open={service !== null}
        onClose={() => setService(null)}
        title={`Service · ${service === "443" ? "HTTPS" : "HTTP"} / ${service || ""}`}
        footer={
          <SaasButton variant="secondary" onClick={() => setService(null)}>
            Close
          </SaasButton>
        }
      >
        <div className="s-action-row">
          <SaasBadge>TCP</SaasBadge>
          <SaasBadge tone="neutral">Observed service</SaasBadge>
        </div>
        <dl className="s-definition-list">
          <div>
            <dt>Host</dt>
            <dd className="s-mono">192.0.2.12</dd>
          </div>
          <div>
            <dt>Server</dt>
            <dd className="s-mono">nginx</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd className="s-mono">200 OK</dd>
          </div>
        </dl>
        <details className="s-details">
          <summary>Response banner</summary>
          <pre className="s-code">
            {
              "HTTP/1.1 200 OK\nServer: nginx\nContent-Type: text/html\n\nExample response for UI demonstration."
            }
          </pre>
        </details>
      </SaasDialog>
      <DemoNotice>
        Sample host · documentation addresses · technical metadata is
        illustrative
      </DemoNotice>
    </div>
  );
}

export function FeedbackPattern({ state = "ready" }: PatternProps) {
  const [current, setCurrent] = useState(state),
    [toast, setToast] = useState(false),
    [confirm, setConfirm] = useState(false),
    [removed, setRemoved] = useState(false);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(false), 6000);
    return () => window.clearTimeout(timer);
  }, [toast]);
  return (
    <div className="s-pattern-pad s-feedback-example">
      {current === "ready" ? (
        <>
          <div className="s-page-heading">
            <div>
              <h3>Feedback that explains the next step</h3>
              <p>Keep messages close to the action.</p>
            </div>
          </div>
          <SaasAlert
            tone="success"
            title={
              removed ? "Example record removed" : "Ready for your next step"
            }
          >
            {removed
              ? "Only local demonstration state changed."
              : "Use a brief notification for a completed, low-risk action."}
          </SaasAlert>
          <div className="s-action-row">
            <SaasButton variant="secondary" onClick={() => setToast(true)}>
              <Icon name="copy" />
              Show copy notification
            </SaasButton>
            <SaasButton variant="danger" onClick={() => setConfirm(true)}>
              Remove example record
            </SaasButton>
          </div>
          {toast && (
            <div className="s-toast" role="status">
              <span>
                Example copy notification. No clipboard content changed.
              </span>
              <SaasButton
                className="s-icon-button"
                variant="ghost"
                aria-label="Dismiss notification"
                onClick={() => setToast(false)}
              >
                <Icon name="close" />
              </SaasButton>
            </div>
          )}
        </>
      ) : current === "empty" ? (
        <SaasEmpty
          title="No records yet"
          action={
            <SaasButton variant="secondary" onClick={() => setCurrent("ready")}>
              Return to example
            </SaasButton>
          }
        >
          Explain how records appear here and offer the next useful action.
        </SaasEmpty>
      ) : (
        <DemoStateNotice state={current} onReset={() => setCurrent("ready")} />
      )}
      <SaasDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Remove this record?"
        footer={
          <>
            <SaasButton variant="secondary" onClick={() => setConfirm(false)}>
              Cancel
            </SaasButton>
            <SaasButton
              variant="danger"
              onClick={() => {
                setConfirm(false);
                setRemoved(true);
              }}
            >
              Remove demo record
            </SaasButton>
          </>
        }
      >
        <p>
          Describe exactly what will be removed and what happens next. This
          example changes local state only.
        </p>
      </SaasDialog>
      <DemoNotice />
    </div>
  );
}

function UsageMeter({
  label,
  available,
  allocation,
}: {
  label: string;
  available: number | null;
  allocation: number | null;
}) {
  const percent =
    available !== null && allocation !== null && allocation > 0
      ? (available / allocation) * 100
      : null;
  const formatted =
    percent === null
      ? "Percentage unavailable"
      : `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(percent)}% ${percent > 100 ? "of allocation available" : "remaining"}`;
  return (
    <section
      className={`s-usage-card ${percent !== null && percent < 10 ? "is-low" : ""}`}
    >
      <h4>{label}</h4>
      <strong className="s-usage-amount">
        {available === null ? "—" : available.toLocaleString("en-US")}
      </strong>
      <p>{formatted}</p>
      {percent === null ? (
        <div className="s-usage-track is-unknown" aria-hidden="true" />
      ) : (
        <div
          className="s-usage-track"
          role="meter"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={allocation || 100}
          aria-valuenow={Math.min(available || 0, allocation || 100)}
          aria-valuetext={`${available?.toLocaleString("en-US")} available; ${formatted}`}
        >
          <span style={{ width: `${Math.min(100, percent)}%` }} />
        </div>
      )}
      <small>
        {allocation === null
          ? "Included allocation unavailable"
          : `Included allocation: ${allocation.toLocaleString("en-US")}`}
      </small>
      {percent !== null && percent > 100 && (
        <SaasBadge>Includes additional balance</SaasBadge>
      )}
    </section>
  );
}
export function UsagePattern() {
  const [mode, setMode] = useState("regular");
  const available =
    mode === "low"
      ? 450
      : mode === "extra"
        ? 12000
        : mode === "missing"
          ? null
          : 6500;
  return (
    <div className="s-pattern-pad">
      <div className="s-page-heading">
        <div>
          <h3>Usage & limits</h3>
          <p>Understand your available balance.</p>
        </div>
        <SaasBadge>Expert · example</SaasBadge>
      </div>
      <SaasSelect
        label="Balance scenario"
        value={mode}
        onChange={setMode}
        options={[
          { value: "regular", label: "Regular balance" },
          { value: "low", label: "Low balance" },
          { value: "extra", label: "Additional balance" },
          { value: "unknown", label: "Unknown allocation" },
          { value: "missing", label: "Balance not returned" },
        ]}
      />
      <div className="s-usage-grid">
        <UsageMeter
          label="Search credits"
          available={available}
          allocation={mode === "unknown" ? null : 10000}
        />
        <UsageMeter label="Scan credits" available={2800} allocation={4000} />
      </div>
      <SaasAlert>
        Remaining balance is compared with the included allocation. This
        indicator is not a transaction ledger.
      </SaasAlert>
      <DemoNotice>
        Illustrative balances · plan allowances must come from account data
      </DemoNotice>
    </div>
  );
}
