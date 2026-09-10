import { Bell, HelpCircle, Search } from "lucide-react";

const items = ["Dashboard", "Job Scheduler", "Time Clock", "Team", "Chat"];

export default function TopNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card">
      <div className="flex h-14 items-center gap-6 px-5">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-ct-blue text-[13px] font-bold text-white">
            C
          </span>
          <span className="text-[15px] font-semibold tracking-tight">connecteam</span>
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {items.map((item) => (
            <span
              key={item}
              className={
                item === "Job Scheduler"
                  ? "rounded-[8px] bg-ct-blue-soft px-3 py-1.5 text-[13px] font-semibold text-ct-blue"
                  : "rounded-[8px] px-3 py-1.5 text-[13px] font-medium text-muted-foreground hover:bg-ct-surface"
              }
            >
              {item}
            </span>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search"
              className="h-9 w-44 rounded-[10px] border border-border bg-ct-surface pl-8 pr-3 text-[13px] outline-none placeholder:text-muted-foreground focus:border-ct-blue focus:bg-card"
            />
          </div>
          <HelpCircle className="h-5 w-5 text-muted-foreground" />
          <div className="relative">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-ct-red" />
          </div>
          <div className="flex items-center gap-2 border-l border-border pl-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ct-peri text-[12px] font-semibold text-white">
              AM
            </span>
            <span className="hidden text-[13px] font-semibold sm:block">Alex Morgan</span>
          </div>
        </div>
      </div>
    </header>
  );
}
