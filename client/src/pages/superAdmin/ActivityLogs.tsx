import { useEffect, useState } from "react";
import axios from "axios";
import { useToastHelper } from "../../context/ToastContext";

function formatDetails(details?: string) {
  if (!details) return "—";

  try {
    return JSON.stringify(JSON.parse(details), null, 2);
  } catch {
    return details;
  }
}

interface LogRow {
  id: number;
  user_id: number;
  role: string;
  action: string;
  resource: string;
  details?: string;
  ip?: string;
  user_agent?: string;
  created_at: string;
}

export default function ActivityLogs() {
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [refreshTick, setRefreshTick] = useState(0);
  const [total, setTotal] = useState(0);
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");
  const [action, setAction] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const toast = useToastHelper();

  useEffect(() => {
    fetchLogs();
  }, [page, limit, refreshTick]);

  async function fetchLogs() {
    try {
      setLoading(true);
      const params: any = { page, limit };
      if (role) params.role = role;
      if (userId) params.user_id = userId;
      if (action) params.action = action;
      if (start) params.start = start;
      if (end) params.end = end;

      const resp = await axios.get(
        "http://localhost:7000/super-admin/activity-logs",
        {
          params,
          withCredentials: true,
        },
      );

      setLogs(resp.data?.data || []);
      setTotal(resp.data?.total || 0);
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.msg || err.message
        : String(err);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  function exportCsv() {
    if (!logs || logs.length === 0) {
      toast.warning("No logs to export");
      return;
    }
    const headers = [
      "id",
      "user_id",
      "role",
      "action",
      "resource",
      "details",
      "ip",
      "user_agent",
      "created_at",
    ];
    const rows = logs.map((l) =>
      headers
        .map((h) => (l as any)[h] ?? "")
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-logs-page-${page}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <article className="min-h-screen bg-neutral-100 px-4 py-6 text-neutral-900 md:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6">
        <header className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_18px_60px_-45px_rgba(0,0,0,0.45)] md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-500">
                Super Admin
              </p>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Activity Logs
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-neutral-600 md:text-base">
                Monitor admin and teacher actions in a compact audit view. The
                device IP column shows the client IP captured from forwarded
                headers when available.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                  Total
                </p>
                <p className="mt-1 text-xl font-semibold">{total}</p>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                  Page
                </p>
                <p className="mt-1 text-xl font-semibold">{page}</p>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                  Page Size
                </p>
                <p className="mt-1 text-xl font-semibold">{limit}</p>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                  Rows
                </p>
                <p className="mt-1 text-xl font-semibold">{logs.length}</p>
              </div>
            </div>
          </div>
        </header>

        <section className="rounded-[28px] border border-neutral-200 bg-white p-4 shadow-[0_18px_60px_-45px_rgba(0,0,0,0.45)] md:p-6">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.9fr] xl:grid-cols-[1.2fr_0.9fr_0.9fr_0.9fr]">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="h-12 rounded-xl border border-neutral-300 bg-white px-4 text-sm outline-none transition focus:border-neutral-900"
            >
              <option value="">All roles</option>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="super_admin">Super Admin</option>
            </select>

            <input
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="h-12 rounded-xl border border-neutral-300 bg-white px-4 text-sm outline-none transition focus:border-neutral-900"
            />

            <input
              placeholder="Action"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="h-12 rounded-xl border border-neutral-300 bg-white px-4 text-sm outline-none transition focus:border-neutral-900"
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="h-12 rounded-xl border border-neutral-300 bg-white px-4 text-sm outline-none transition focus:border-neutral-900"
              />
              <input
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="h-12 rounded-xl border border-neutral-300 bg-white px-4 text-sm outline-none transition focus:border-neutral-900"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-end gap-3">
            <button
              className="rounded-xl border border-neutral-300 bg-neutral-100 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-200"
              onClick={() => {
                setPage(1);
                setRefreshTick((value) => value + 1);
              }}
              type="button"
            >
              Apply Filters
            </button>
            <button
              className="rounded-xl border border-neutral-900 bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
              onClick={() => {
                exportCsv();
              }}
              type="button"
            >
              Export CSV
            </button>
          </div>
        </section>

        <section className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-[0_18px_60px_-45px_rgba(0,0,0,0.45)]">
          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full border-collapse text-left">
              <thead className="sticky top-0 z-10 bg-neutral-50 text-xs uppercase tracking-[0.22em] text-neutral-500">
                <tr>
                  <th className="border-b border-neutral-200 px-5 py-4">
                    Time
                  </th>
                  <th className="border-b border-neutral-200 px-5 py-4">
                    User
                  </th>
                  <th className="border-b border-neutral-200 px-5 py-4">
                    Role
                  </th>
                  <th className="border-b border-neutral-200 px-5 py-4">
                    Action
                  </th>
                  <th className="border-b border-neutral-200 px-5 py-4">
                    Resource
                  </th>
                  <th className="border-b border-neutral-200 px-5 py-4">
                    Details
                  </th>
                  <th className="border-b border-neutral-200 px-5 py-4">
                    Device IP
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-10 text-center text-sm text-neutral-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-10 text-center text-sm text-neutral-500"
                    >
                      No logs found
                    </td>
                  </tr>
                ) : (
                  logs.slice(0, limit).map((l) => (
                    <tr
                      key={l.id}
                      className="transition hover:bg-neutral-50/80"
                    >
                      <td className="px-5 py-4 text-sm text-neutral-700">
                        {new Date(l.created_at).toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-neutral-900">
                        {l.user_id}
                      </td>
                      <td className="px-5 py-4 text-sm">
                        <span className="inline-flex rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 font-medium text-neutral-700">
                          {l.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm">
                        <span className="inline-flex rounded-full border border-neutral-200 bg-white px-3 py-1 font-medium text-neutral-700 capitalize">
                          {l.action}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-neutral-700">
                        {l.resource}
                      </td>
                      <td className="px-5 py-4 text-sm">
                        <pre className="max-w-[420px] overflow-hidden text-ellipsis whitespace-pre-wrap break-words rounded-xl border border-neutral-200 bg-neutral-50 p-3 font-mono text-[11px] leading-5 text-neutral-700">
                          {formatDetails(l.details)}
                        </pre>
                      </td>
                      <td className="px-5 py-4 text-sm font-mono text-neutral-700">
                        {l.ip || "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-neutral-200 px-5 py-4 text-sm text-neutral-600 md:flex-row md:items-center md:justify-between">
            <div>
              {total === 0
                ? "No rows to display"
                : `Showing ${(page - 1) * limit + 1} - ${Math.min(page * limit, total)} of ${total}`}
            </div>
            <div className="flex gap-2">
              <button
                className="rounded-xl border border-neutral-300 bg-white px-4 py-2.5 font-medium text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => setPage(Math.max(1, page - 1))}
                type="button"
                disabled={page === 1}
              >
                Prev
              </button>
              <button
                className="rounded-xl border border-neutral-300 bg-white px-4 py-2.5 font-medium text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-100"
                onClick={() => {
                  if (page * limit < total) {
                    setPage(page + 1);
                  }
                }}
                type="button"
                disabled={page * limit >= total}
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}
