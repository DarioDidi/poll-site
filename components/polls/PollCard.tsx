import React from 'react';
import Link from 'next/link';
import { Poll } from '../../lib/types';
import { FaChartBar, FaVoteYea, FaUser, FaClock } from 'react-icons/fa';
import { calcExpiry } from '@/lib/utils';

interface PollCardProps {
  poll: Poll;
}

const PollCard: React.FC<PollCardProps> = ({ poll }) => {
  const formattedDate = new Date(poll.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const { isExpired, totalDays, remHours, remMinutes } = calcExpiry(poll);
  return (
    <div className=" rounded-lg  shadow-purple-200 overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-200 py-4 my-10 border border-purple-200 ">
      <div className="p-6">
        <h3 className="text-xl font-semibold  mb-2">{poll.question}</h3>

        <div className="flex items-center text-gray-500 mb-4">
          <FaUser className="mr-2" />
          <span className="text-sm">
            {poll.isAnonymous ? 'Anonymous poll' : `By ${poll.creator?.email || poll.creator?.email}`}
          </span>
        </div>

        <div className="flex items-center text-gray-500 mb-4">
          <FaClock className="mr-2" />
          <span className="text-sm">Created {formattedDate}</span>
        </div>
        <div className="flex items-center text-gray-500 mb-4">
          <FaClock className="mr-2" />
          <span className={isExpired ? "text-red-400" : "text-green-400"}>
            {isExpired ? "Voting closed" : "Open for"} {`${totalDays} days ${remHours} hours ${remMinutes} mins`}
            {isExpired ? " ago" : ""}
          </span>

        </div>


        <div className="mb-4">
          {poll.options.slice(0, 3).map((option, index) => (
            <div key={index} className="mb-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{option.text}</span>
                <span className="font-medium">{option.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${option.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
          {poll.options.length > 3 && (
            <div className="text-sm text-gray-500">+{poll.options.length - 3} more options</div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center text-gray-600">
            <FaVoteYea className="mr-1" />
            <span className="text-sm">{poll.totalVotes} votes</span>
          </div>

          <Link href={`/polls/${poll.id}`} passHref>
            <button className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full hover:from-purple-600 hover:to-blue-600 transition-colors duration-300">
              <FaChartBar className="mr-2" />
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PollCard;
