import { RepoInfo } from '@/types';
import { Star, GitBranch } from 'lucide-react';

interface Props {
  info: RepoInfo;
}

/**
 * Repository info card.
 */
export default function RepoInfoCard({ info }: Props) {
  return (
    <section className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row items-center justify-between">
      <div className="flex items-center space-x-4 mb-4 md:mb-0">
        <img src={info.ownerAvatarUrl} alt={`${info.owner} avatar`} className="w-12 h-12 rounded-full" />
        <h1 className="text-2xl font-heading">{info.name}</h1>
      </div>
      <div className="flex space-x-6">
        <div className="flex items-center space-x-1">
          <Star className="w-5 h-5 text-primary" />
          <span>{info.stars.toLocaleString()}</span>
        </div>
        <div className="flex items-center space-x-1">
          <GitBranch className="w-5 h-5 text-primary" />
          <span>{info.forks.toLocaleString()}</span>
        </div>
        {info.latestRelease && (
          <span className="bg-primary text-white px-2 py-1 rounded text-sm">v{info.latestRelease}</span>
        )}
      </div>
    </section>
  );
}
