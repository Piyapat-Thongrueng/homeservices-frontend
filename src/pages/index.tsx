import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex justify-center flex-col items-center space-y-5">
      <h1 className="font-bold text-center mt-10 headline-1 text-blue-500">
        Welcome to HomeService Test Deployment
      </h1>
      <button className="btn-primary">Button Primary</button>
      <button className="btn-primary" disabled>
        Button Primary
      </button>
      <button className="btn-primary">
        Processing
        <span className="spinner"></span>
      </button>
      <button className="btn-secondary">Button Secondary</button>
      
      <button className="btn-secondary" disabled>
        Button Secondary
      </button>

      <button className="btn-secondary">
        Processing
        <span className="spinner"></span>
      </button>
    </div>
  );
}
