import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { resultAPI, examAPI } from '../../services/api';
import { 
  HiTrophy, 
  HiUser, 
  HiClock, 
  HiChartBar,
  HiAcademicCap,
  HiCalendar,
  HiFilter
} from 'react-icons/hi';

export default function FacultyLeaderboard() {
  const [leaderboards, setLeaderboards] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalExams: 0,
    totalStudents: 0,
    avgScore: 0,
    recentActivity: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [examsRes, resultsRes] = await Promise.all([
        examAPI.getAll(),
        resultAPI.getByStudent('')
      ]);

      setExams(examsRes.data);
      
      // Process results to create leaderboards
      const resultsByExam = {};
      resultsRes.data.forEach(result => {
        if (!resultsByExam[result.exam_id]) {
          resultsByExam[result.exam_id] = [];
        }
        resultsByExam[result.exam_id].push(result);
      });

      // Sort and rank each exam's results
      const processedLeaderboards = Object.keys(resultsByExam).map(examId => {
        const exam = examsRes.data.find(e => e.id === parseInt(examId));
        const results = resultsByExam[examId]
          .sort((a, b) => b.score - a.score)
          .map((result, index) => ({
            ...result,
            rank: index + 1,
            studentName: `Student ${result.student_id}` // Will be updated with actual names
          }));

        return {
          examId: parseInt(examId),
          examTitle: exam?.title || 'Unknown Exam',
          results,
          totalSubmissions: results.length,
          avgScore: results.reduce((sum, r) => sum + r.percentage, 0) / results.length
        };
      });

      setLeaderboards(processedLeaderboards);

      // Calculate overall stats
      const totalResults = resultsRes.data;
      setStats({
        totalExams: examsRes.data.length,
        totalStudents: new Set(totalResults.map(r => r.student_id)).size,
        avgScore: totalResults.reduce((sum, r) => sum + r.percentage, 0) / totalResults.length,
        recentActivity: totalResults.filter(r => 
          new Date(r.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
        ).length
      });
    } catch (error) {
      console.error('Failed to load leaderboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeaderboards = selectedExam === 'all' 
    ? leaderboards 
    : leaderboards.filter(l => l.examId === parseInt(selectedExam));

  const getRankIcon = (rank) => {
    if (rank === 1) return <span className="text-2xl">🥇</span>;
    if (rank === 2) return <span className="text-2xl">🥈</span>;
    if (rank === 3) return <span className="text-2xl">🥉</span>;
    return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30';
    if (percentage >= 60) return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
    if (percentage >= 40) return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30';
    return 'text-red-600 bg-red-100 dark:bg-red-900/30';
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Exam Performance Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor student performance across all exams
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: HiAcademicCap, label: 'Total Exams', value: stats.totalExams, color: 'from-blue-500 to-blue-600' },
            { icon: HiUser, label: 'Total Students', value: stats.totalStudents, color: 'from-purple-500 to-purple-600' },
            { icon: HiChartBar, label: 'Average Score', value: `${stats.avgScore.toFixed(1)}%`, color: 'from-emerald-500 to-emerald-600' },
            { icon: HiClock, label: 'Last 24h Activity', value: stats.recentActivity, color: 'from-amber-500 to-amber-600' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl p-6 shadow-lg"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl p-6 shadow-lg mb-8"
        >
          <div className="flex items-center gap-4">
            <HiFilter className="w-5 h-5 text-gray-500" />
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700"
            >
              <option value="all">All Exams</option>
              {exams.map(exam => (
                <option key={exam.id} value={exam.id}>{exam.title}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Leaderboards */}
        <div className="space-y-8">
          {filteredLeaderboards.map((leaderboard, index) => (
            <motion.div
              key={leaderboard.examId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {leaderboard.examTitle}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <HiUser className="w-4 h-4" />
                        {leaderboard.totalSubmissions} submissions
                      </span>
                      <span className="flex items-center gap-1">
                        <HiChartBar className="w-4 h-4" />
                        Avg: {leaderboard.avgScore.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                    <HiTrophy className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-3">
                  {leaderboard.results.slice(0, 10).map((result, resultIndex) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: resultIndex * 0.05 }}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 flex items-center justify-center">
                          {getRankIcon(result.rank)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {result.studentName}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Submitted {new Date(result.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(result.percentage)}`}>
                          {result.score}/{result.total_questions} ({result.percentage.toFixed(1)}%)
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {leaderboard.results.length > 10 && (
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ... and {leaderboard.results.length - 10} more students
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredLeaderboards.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl p-12 text-center"
          >
            <HiTrophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Results Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {selectedExam === 'all' ? 'No exam results available yet.' : 'No results available for this exam.'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
