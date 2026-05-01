"use client";

import {
  DashboardFilters,
  JobSource,
  SeniorityLevel,
  WorkMode,
} from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface FilterBarProps {
  filters: DashboardFilters;
  onChange: (next: DashboardFilters) => void;
}

const SOURCES: Array<JobSource | "all"> = [
  "all",
  "Greenhouse demo",
  "Lever demo",
  "Company Careers demo",
  "Search Result demo",
  "Manual Entry demo",
];

const SENIORITY: Array<SeniorityLevel | "all"> = [
  "all",
  "intern",
  "junior",
  "mid",
  "senior",
  "staff",
  "lead",
];

const REMOTE: Array<WorkMode | "all"> = ["all", "remote", "hybrid", "on-site"];

export function FilterBar({ filters, onChange }: FilterBarProps) {
  return (
    <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-5">
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-700">
          Minimum Match Score
        </label>
        <Input
          type="number"
          min={0}
          max={100}
          value={filters.minScore ?? 0}
          onChange={(event) =>
            onChange({
              ...filters,
              minScore: Number(event.target.value),
            })
          }
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-700">
          Remote Type
        </label>
        <Select
          value={filters.remoteType ?? "all"}
          onChange={(event) =>
            onChange({
              ...filters,
              remoteType: event.target.value as WorkMode | "all",
            })
          }
        >
          {REMOTE.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-700">
          Source
        </label>
        <Select
          value={filters.source ?? "all"}
          onChange={(event) =>
            onChange({
              ...filters,
              source: event.target.value as JobSource | "all",
            })
          }
        >
          {SOURCES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-700">
          Seniority
        </label>
        <Select
          value={filters.seniority ?? "all"}
          onChange={(event) =>
            onChange({
              ...filters,
              seniority: event.target.value as SeniorityLevel | "all",
            })
          }
        >
          {SENIORITY.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-700">
          Sort By
        </label>
        <Select
          value={filters.sortBy ?? "best-match"}
          onChange={(event) =>
            onChange({
              ...filters,
              sortBy: event.target.value as DashboardFilters["sortBy"],
            })
          }
        >
          <option value="best-match">best match</option>
          <option value="newest">newest</option>
          <option value="company">company</option>
        </Select>
      </div>
    </div>
  );
}
