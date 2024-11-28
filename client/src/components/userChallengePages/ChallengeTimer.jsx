/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
import { formatTime } from "../../constants/constant";

function ChallengeTimer({
  challengeData,
  isChallengeLoading,
  participantScore,
  onChallengeStatusChange,
}) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    if (isChallengeLoading || !challengeData) return;

    const startTime = new Date(challengeData.startTime).getTime();
    const endTime = new Date(challengeData.endTime).getTime();

    const updateTimer = () => {
      const currentTime = Date.now();

      if (currentTime < startTime) {
        setHasStarted(false);
        setHasEnded(false);
        setTimeLeft(startTime - currentTime);
      } else if (currentTime >= startTime && currentTime <= endTime) {
        setHasStarted(true);
        setHasEnded(false);
        setTimeLeft(endTime - currentTime);
      } else {
        setHasStarted(false);
        setHasEnded(true);
        setTimeLeft(0);
      }
    };

    // Notify the parent component of the current challenge status
    onChallengeStatusChange({ hasStarted, hasEnded });

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [
    isChallengeLoading,
    challengeData,
    hasStarted,
    hasEnded,
    onChallengeStatusChange,
  ]);

  const gradingMessage = (score) => {
    if (score >= 90) return "Outstanding Performance!";
    if (score >= 75) return "Great Job!";
    if (score >= 50) return "Good Effort!";
    return "Keep Practicing!";
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-6 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 shadow-md rounded-lg border border-gray-600 w-full max-w-lg mx-auto mt-10 transition duration-300 transform hover:scale-105 hover:shadow-2xl hover:bg-opacity-90 relative">
      {/* Pattern overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-20 pointer-events-none rounded-lg"></div>

      {/* Content */}
      <div className="relative z-10">
        {hasEnded ? (
          <div className="text-center animate-fade-in">
            <FaTimesCircle className="text-red-500 text-6xl mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold text-red-600">Challenge Ended</h2>
            <p className="text-gray-300 mt-3">Thanks for participating!</p>
            <p className="text-gray-300 mt-3">Your Score: {participantScore}</p>
            <p className="text-gray-300 mt-3">
              {gradingMessage(participantScore)}
            </p>
          </div>
        ) : !hasStarted ? (
          <div className="text-center animate-fade-in">
            <FaClock className="text-yellow-500 text-6xl mb-4 animate-spin-slow" />
            <h2 className="text-2xl font-bold text-yellow-600">
              Challenge Starting Soon
            </h2>
            <p className="text-gray-300 mt-3 text-lg">
              Countdown: {timeLeft ? formatTime(timeLeft) : "Loading..."}
            </p>
          </div>
        ) : (
          <div className="text-center animate-fade-in">
            <FaCheckCircle className="text-green-500 text-6xl mb-4 animate-pulse" />
            <h2 className="text-2xl font-bold text-green-600">
              Challenge Live!
            </h2>
            <p className="text-gray-300 mt-3 text-lg">
              Time Left: {timeLeft ? formatTime(timeLeft) : "Loading..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChallengeTimer;
