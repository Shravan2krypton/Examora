import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { resultAPI, examAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  HiTrophy, 
  HiUser, 
  HiChartBar,
  HiAcademicCap,
  HiCalendar,
  HiClock,
  HiStar,
  HiTarget,
  HiTrendingUp
} from 'react-icons/hi';

export default function StudentLeaderboard() {
  const [leaderboards, setLeaderboards] = useState([]);
  const [selectedExam, setSelectedExam] = useState('all');
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    totalExams: 0,
    avgScore: 0,
    bestRank: null,
    recentExams: []
  });
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [examsRes, resultsRes] = await Promise.all([
        examAPI.getAll(),
        resultAPI.getByStudent(user?.id || '')
      ]);

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
            studentName: `Student ${result.student_id}`, // Will be updated with actual names
            isCurrentUser: result.student_id === user?.id
          }));

        return {
          examId: parseInt(examId),
          examTitle: exam?.title || 'Unknown Exam',
          results,
          totalSubmissions: results.length,
          avgScore: results.reduce((sum, r) => sum + r.percentage, 0) / results.length,
          userRank: results.find(r => r.isCurrentUser)?.rank || null
        };
      });

      setLeaderboards(processedLeaderboards);

      // Calculate user stats
      const userResults = resultsRes.data.filter(r => r.student_id === user?.id);
      const userRanks = processedLeaderboards
        .filter(l => l.userRank)
        .map(l => l.userRank);

      setUserStats({
        totalExams: userResults.length,
        avgScore: userResults.reduce((sum, r) => sum + r.percentage, 0) / userResults.length || 0,
        bestRank: userRanks.length > 0 ? Math.min(...userRanks) : null,
        recentExams: userResults.slice(-3).reverse()
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
            Your Performance Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your exam performance and see how you rank among your peers
          </p>
        </motion.div>

        {/* User Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: HiAcademicCap, label: 'Exams Taken', value: userStats.totalExams, color: 'from-blue-500 to-blue-600' },
            { icon: HiChartBar, label: 'Average Score', value: `${userStats.avgScore.toFixed(1)}%`, color: 'from-purple-500 to-purple-600' },
            { icon: HiTrophy, label: 'Best Rank', value: userStats.bestRank ? `#${userStats.bestRank}` : 'N/A', color: 'from-emerald-500 to-emerald-600' },
            { icon: HiTarget, label: 'Performance', value: userStats.avgScore >= 70 ? 'Excellent' : userStats.avgScore >= 50 ? 'Good' : 'Needs Work', color: userStats.avgScore >= 70 ? 'from-emerald-500 to-emerald-600' : userStats.avgScore >= 50 ? 'from-amber-500 to-amber-600' : 'from-red-500 to-red-600' }
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

        {/* Recent Performance */}
        {userStats.recentExams.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl p-6 shadow-lg mb-8"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <HiTrendingUp className="w-6 h-6 text-purple-600" />
              Recent Performance
            </h2>
            <div className="space-y-3">
              {userStats.recentExams.map((exam, index) => (
                <div key={exam.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Exam #{exam.exam_id}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(exam.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(exam.percentage)}`}>
                    {exam.score}/{exam.total_questions} ({exam.percentage.toFixed(1)}%)
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

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
              {leaderboards.map(leaderboard => (
                <option key={leaderboard.examId} value={leaderboard.examId}>{leaderboard.examTitle}</option>
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
                        {leaderboard.totalSubmissions} participants
                      </span>
                      <span className="flex items-center gap-1">
                        <HiChartBar className="w-4 h-4" />
                        Class avg: {leaderboard.avgScore.toFixed(1)}%
                      </span>
                      {leaderboard.userRank && (
                        <span className="flex items-center gap-1 text-purple-600 font-medium">
                          <HiStar className="w-4 h-4" />
                          Your rank: #{leaderboard.userRank}
                        </span>
                      )}
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
                      className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
                        result.isCurrentUser
                          ? 'bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-300 dark:border-purple-700'
                          : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 flex items-center justify-center">
                          {getRankIcon(result.rank)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            {result.studentName}
                            {result.isCurrentUser && (
                              <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full font-medium">
                                YOU
                              </span>
                            )}
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
