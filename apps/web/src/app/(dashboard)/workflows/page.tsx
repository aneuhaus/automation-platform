import { apiClient } from "@/lib/api-client";
import { Workflow } from "@automation-platform/contracts";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Settings, Play, LayoutDashboard } from "lucide-react";

export default async function WorkflowsPage() {
  let workflows: Workflow[] = [];
  let error: string | null = null;

  try {
    workflows = await apiClient.get<Workflow[]>("/workflows");
  } catch (err: any) {
    error = err.message || "Failed to load workflows";
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Workflows</h1>
          <p className="text-slate-500 mt-1">Manage and automate your business processes.</p>
        </div>
        <Button asChild>
          <Link href="/workflows/new" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Workflow
          </Link>
        </Button>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
          <p className="font-medium">Error loading workflows</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      ) : workflows.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl bg-slate-50 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
            <LayoutDashboard className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No workflows found</h3>
          <p className="text-slate-500 mt-1 max-w-xs">
            Get started by creating your first automated workflow.
          </p>
          <Button asChild className="mt-6" variant="outline">
            <Link href="/workflows/new">
              Create Workflow
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              className="group bg-white border rounded-xl p-6 hover:shadow-md hover:border-indigo-200 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Play className="w-5 h-5" />
                </div>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
              <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {workflow.name}
              </h3>
              <p className="text-slate-500 text-sm mt-2 line-clamp-2">
                {workflow.description || "No description provided."}
              </p>
              <div className="mt-6 pt-6 border-t flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Updated recently</span>
                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded">Active</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
