import InteractiveAIEventGlobe from '@/components/InteractiveAIEventGlobe';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function GlobePage() {
  return (
    <div className="relative">
      {/* Back to home button */}
      <div className="absolute top-4 left-4 z-10">
        <Link href="/">
          <Button 
            variant="outline" 
            className="bg-slate-800/50 border-blue-500/50 text-white hover:bg-slate-700/50"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
        </Link>
      </div>
      
      <InteractiveAIEventGlobe />
    </div>
  );
}