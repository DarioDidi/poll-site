import { Vote } from "@/lib/types";
import Link from "next/link";
import { FaClock, FaVoteYea } from "react-icons/fa";

const VoteCard = ({ vote }: { vote: Vote }) => {
  const formattedDate = new Date(vote.createdAt).toLocaleDateString();
  return (
    <div className=" rounded-lg  shadow-purple-200 overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-200 py-2 my-8 border border-purple-200">
      <div className="p-6">
        <Link href={`/polls/${vote.pollId}`}>
          <h2 className="text-xl font-semibold text-blue-500 mb-2">Question: {vote.poll?.question}</h2>
        </Link>
        <div className="flex items-center text-gray-400 mb-4">
          <FaClock className="mr-2" />
          <span className="text-sm">{formattedDate}</span>
        </div>
        <div className="flex items-center text-gray-500">
          <FaVoteYea className="mr-1" />
          <p>Your choice: <span className="text-green-400">{vote.poll?.options[vote.optionIndex]}</span></p>
        </div>
      </div>
    </div>
  );
}

export default VoteCard;
