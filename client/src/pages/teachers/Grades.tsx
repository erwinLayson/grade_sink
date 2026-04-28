import { useState, useEffect } from "react";
import axios from "axios";
import useUser from "../../hooks/useUser";
import { useToastHelper } from "../../context/ToastContext";

interface ClassGrade {
  class_id: number;
  class_name: string;
  section: string;
  total_students: number;
  grades_entered: number;
}

export function Grades() {
  const { user } = useUser();
  const toast = useToastHelper();
  const [classGrades, setClassGrades] = useState<ClassGrade[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClassGrades = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        // Fetch teacher's classes and grade statistics
        const response = await axios.get(
          `http://localhost:7000/class-teachers/teacher/${user.id}?limit=1000`,
          { withCredentials: true },
        );

        const classes = response.data?.data || [];
        // For now, mock the grades data
        const classesWithGrades = classes.map((cls: any) => ({
          class_id: cls.id,
          class_name: cls.name,
          section: cls.section,
          total_students: Math.floor(Math.random() * 40) + 20,
          grades_entered: Math.floor(Math.random() * 30) + 10,
        }));

        setClassGrades(classesWithGrades);
      } catch (error) {
        const errorMsg = axios.isAxiosError(error)
          ? error.response?.data?.msg || error.message
          : String(error);
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassGrades();
  }, [user?.id, toast]);

  if (isLoading) {
    return (
      <div className="p-8 bg-slate-50 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <p className="text-lg text-slate-600 font-medium">
            Loading grades...
          </p>
        </div>
      </div>
    );
  }

  return (
    <article className="p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900">My Grades</h1>
        <p className="text-lg text-slate-600 mt-1">
          Track grades across your classes
        </p>
      </div>

      {/* Classes Grid */}
      {classGrades.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classGrades.map((classGrade) => {
            const progress =
              classGrade.total_students > 0
                ? (classGrade.grades_entered / classGrade.total_students) * 100
                : 0;

            return (
              <div
                key={classGrade.class_id}
                className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-slate-900">
                    {classGrade.class_name}
                  </h3>
                  <p className="text-sm text-slate-600">
                    Section: {classGrade.section}
                  </p>
                </div>

                {/* Grade Entry Progress */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-700">
                        Grades Entered
                      </span>
                      <span className="text-sm font-bold text-indigo-600">
                        {classGrade.grades_entered}/{classGrade.total_students}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-600 font-medium">
                        Total Students
                      </p>
                      <p className="text-2xl font-bold text-slate-900 mt-1">
                        {classGrade.total_students}
                      </p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <p className="text-xs text-emerald-700 font-medium">
                        Grades Submitted
                      </p>
                      <p className="text-2xl font-bold text-emerald-600 mt-1">
                        {classGrade.grades_entered}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="pt-2">
                    {progress === 100 ? (
                      <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
                        ✓ Complete
                      </span>
                    ) : progress >= 50 ? (
                      <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                        ⚠ In Progress
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 bg-rose-100 text-rose-800 text-xs font-semibold rounded-full">
                        Not Started
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <a
                  href="/grades-management"
                  className="w-full mt-4 block text-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 active:scale-95"
                >
                  Enter Grades
                </a>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
          <p className="text-lg text-slate-600 font-medium mb-2">
            No classes assigned
          </p>
          <p className="text-slate-500">
            You don't have any classes assigned yet
          </p>
        </div>
      )}
    </article>
  );
}
