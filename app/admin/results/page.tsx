import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { db } from "@/lib/db";
import { results, exams, users } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminResults() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/login");

  const allResults = await db.select({
    id: results.id,
    score: results.score,
    totalMarks: results.totalMarks,
    passed: results.passed,
    examTitle: exams.title,
    studentName: users.name,
    date: results.createdAt
  })
  .from(results)
  .innerJoin(exams, eq(results.examId, exams.id))
  .innerJoin(users, eq(results.studentId, users.id))
  .orderBy(desc(results.createdAt));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar role="admin" />
        <main className="flex-grow p-8 max-w-6xl mx-auto w-full">
          <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">All Student Results</h1>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Student</th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Exam</th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Score</th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Date</th>
                </tr>
              </thead>
              <tbody>
                {allResults.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">No results found.</td>
                  </tr>
                ) : (
                  allResults.map(r => (
                    <tr key={r.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                      <td className="p-4">{r.studentName}</td>
                      <td className="p-4">{r.examTitle}</td>
                      <td className="p-4 font-semibold">{r.score} / {r.totalMarks}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${r.passed ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {r.passed ? "PASSED" : "FAILED"}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500">{new Date(r.date).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
