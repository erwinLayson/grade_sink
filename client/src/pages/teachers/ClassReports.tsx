import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../../context/userContext";
import { useToastHelper } from "../../context/ToastContext";
import { FaDownload, FaSpinner } from "react-icons/fa";

interface TeacherClass {
  id: number;
  name: string;
  section: string;
  school_year?: string;
  school_level?: string;
}

export default function ClassReports() {
  const userCtx = useContext(UserContext);
  const user = userCtx?.user ?? null;
  const [loading, setLoading] = useState(true);
  const [advisoryClass, setAdvisoryClass] = useState<TeacherClass | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const toast = useToastHelper();

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        let resolvedTeacherId = user.id;

        if (user.role === "teacher") {
          const teacherResponse = await axios.get(
            `http://localhost:7000/teachers/email/${encodeURIComponent(user.email)}`,
            { withCredentials: true },
          );
          resolvedTeacherId = teacherResponse.data?.data?.id ?? user.id;
        }

        const classResponse = await axios.get(
          `http://localhost:7000/class-teachers/teacher/${resolvedTeacherId}?limit=1000`,
          { withCredentials: true },
        );

        const advisory = classResponse.data?.data?.[0] ?? null;
        setAdvisoryClass(advisory);
      } catch (e) {
        console.error(e);
        toast.error("Failed to load advisory class");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.id, user?.email, user?.role]);

  const handleGenerate = async () => {
    if (!advisoryClass) return;
    setIsGenerating(true);
    toast.info("Generating report...");

    const newTab = window.open("", "_blank");

    try {
      const resp = await axios.get(
        `http://localhost:7000/classes/${advisoryClass.id}/generate-pdfs`,
        { withCredentials: true, responseType: "blob" },
      );

      const blob = new Blob([resp.data], { type: "application/pdf" });
      const blobUrl = window.URL.createObjectURL(blob);

      if (newTab) {
        newTab.location.href = blobUrl;
      } else {
        const a = document.createElement("a");
        a.href = blobUrl;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        document.body.appendChild(a);
        a.click();
        a.remove();
      }

      toast.success("Report generated");
    } catch (err) {
      console.error(err);
      if (newTab) newTab.close();
      const message = axios.isAxiosError(err)
        ? err.response?.data?.msg || err.message
        : String(err);
      toast.error(message || "Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Class Reports</h1>
          <p className="text-sm text-slate-600">
            Generate report for your advisory class.
          </p>
        </div>
        <div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !advisoryClass}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <FaSpinner className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FaDownload />
                Generate Report
              </>
            )}
          </button>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold">Advisory Class</h2>
        {advisoryClass ? (
          <div className="mt-3">
            <p className="font-bold">{advisoryClass.name}</p>
            <p className="text-sm text-slate-600">
              {advisoryClass.section} • {advisoryClass.school_year}
            </p>
          </div>
        ) : (
          <p className="text-sm text-slate-500 mt-3">
            No advisory class found for this account.
          </p>
        )}
      </div>
    </div>
  );
}
