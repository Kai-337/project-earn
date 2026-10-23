import React, { useState } from "react";
import { Task, Idea, UserProfile, TaskType } from "../types";
import { 
  Briefcase, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Plus, 
  ShieldCheck, 
  Filter, 
  Upload, 
  ExternalLink,
  Award
} from "lucide-react";
import confetti from "canvas-confetti";

interface TasksViewProps {
  ideas: Idea[];
  currentUser: UserProfile;
  onUpdateTask: (ideaId: string, task: Task) => void;
  onAddTask: (ideaId: string, task: Task) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  ideas,
  currentUser,
  onUpdateTask,
  onAddTask,
}) => {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [activeIdeaForNewTask, setActiveIdeaForNewTask] = useState<string>(ideas[0]?.id || "");
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [submittingTask, setSubmittingTask] = useState<Task | null>(null);
  const [submissionDeliverable, setSubmissionDeliverable] = useState("");

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskType, setNewTaskType] = useState<TaskType>("act_performance");
  const [newTaskReward, setNewTaskReward] = useState<number>(300);

  // Aggregate all tasks across ideas
  const allTasks: { task: Task; idea: Idea }[] = [];
  ideas.forEach((idea) => {
    (idea.tasks || []).forEach((task) => {
      allTasks.push({ task, idea });
    });
  });

  const filtered = allTasks.filter(({ task }) => {
    if (selectedType === "all") return true;
    return task.type === selectedType;
  });

  const handleApply = (task: Task, idea: Idea) => {
    const updated: Task = {
      ...task,
      status: "in_progress",
      assignedToName: currentUser.name,
      applicantCount: task.applicantCount + 1,
    };
    onUpdateTask(idea.id, updated);
  };

  const handleOpenSubmit = (task: Task) => {
    setSubmittingTask(task);
    setSubmissionDeliverable("");
  };

  const handleConfirmSubmit = (idea: Idea) => {
    if (!submittingTask) return;
    const updated: Task = {
      ...submittingTask,
      status: "submitted",
      deliverables: submissionDeliverable || "Submitted video proof of performance and deliverables report.",
    };
    onUpdateTask(idea.id, updated);
    setSubmittingTask(null);
  };

  const handleApproveAndPay = (task: Task, idea: Idea) => {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 },
    });
    const updated: Task = {
      ...task,
      status: "completed",
    };
    onUpdateTask(idea.id, updated);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !activeIdeaForNewTask) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      ideaId: activeIdeaForNewTask,
      title: newTaskTitle,
      description: newTaskDesc || "Complete deliverables as specified by the creator.",
      type: newTaskType,
      reward: Number(newTaskReward) || 200,
      status: "open",
      applicantCount: 0,
      dueDate: "In 7 days",
    };

    onAddTask(activeIdeaForNewTask, newTask);
    setShowNewTaskModal(false);
    setNewTaskTitle("");
    setNewTaskDesc("");
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-neutral-800 bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                Legitimate Money Tasks
              </span>
              <span className="text-xs text-neutral-400">Escrow Backed Bounties</span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight">
              Acts, Performances & Creative Tasks Platform
            </h1>
            <p className="mt-1 text-sm text-neutral-400 max-w-2xl leading-relaxed">
              Earn real cash rewards by performing physical drop-tests, filming demonstration videos, engineering CAD prototypes, or providing creator consultation sprints.
            </p>
          </div>

          <button
            id="btn-create-task-bounty"
            onClick={() => setShowNewTaskModal(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-neutral-950 hover:from-amber-400 hover:to-amber-500 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Post Paid Task Bounty</span>
          </button>
        </div>

        {/* Type Filter Pills */}
        <div className="mt-6 flex flex-wrap items-center gap-2 pt-4 border-t border-neutral-800">
          <button
            onClick={() => setSelectedType("all")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              selectedType === "all"
                ? "bg-amber-500 text-neutral-950 shadow-sm"
                : "bg-neutral-800/80 text-neutral-400 hover:text-neutral-200"
            }`}
          >
            All Tasks ({allTasks.length})
          </button>
          <button
            onClick={() => setSelectedType("act_performance")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              selectedType === "act_performance"
                ? "bg-amber-500 text-neutral-950 shadow-sm"
                : "bg-neutral-800/80 text-neutral-400 hover:text-neutral-200"
            }`}
          >
            🎭 Acts & Performances
          </button>
          <button
            onClick={() => setSelectedType("engineering")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              selectedType === "engineering"
                ? "bg-amber-500 text-neutral-950 shadow-sm"
                : "bg-neutral-800/80 text-neutral-400 hover:text-neutral-200"
            }`}
          >
            🛠️ Engineering & CAD
          </button>
          <button
            onClick={() => setSelectedType("market_validation")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              selectedType === "market_validation"
                ? "bg-amber-500 text-neutral-950 shadow-sm"
                : "bg-neutral-800/80 text-neutral-400 hover:text-neutral-200"
            }`}
          >
            📊 Market Validation Trials
          </button>
        </div>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(({ task, idea }) => {
          const isAssignedToMe = task.assignedToName === currentUser.name;
          const isCreatorOrBuyer = currentUser.name === idea.creator.name || currentUser.role === "builder_buyer";

          return (
            <div
              key={task.id}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 shadow-lg flex flex-col justify-between"
            >
              <div>
                {/* Task Tag + Reward */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="rounded-md bg-neutral-800 px-2.5 py-1 text-[11px] font-semibold text-neutral-300">
                    {task.type === "act_performance"
                      ? "🎭 Physical Act / Performance"
                      : task.type === "engineering"
                      ? "🛠️ Engineering Task"
                      : "📊 Market Validation"}
                  </span>
                  <div className="flex items-center gap-1 text-emerald-400 font-mono font-extrabold text-sm sm:text-base">
                    <DollarSign className="h-4 w-4 -mr-1" />
                    <span>${task.reward} USD</span>
                  </div>
                </div>

                {/* Task Title */}
                <h3 className="font-bold text-neutral-100 text-base leading-snug">
                  {task.title}
                </h3>
                <p className="mt-1.5 text-xs text-neutral-300 leading-relaxed">
                  {task.description}
                </p>

                {/* Associated Idea Card Snippet */}
                <div className="mt-3 rounded-xl bg-neutral-950 p-3 border border-neutral-800/80 text-xs">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-0.5">
                    Associated Commercial Idea
                  </span>
                  <div className="font-semibold text-neutral-200 line-clamp-1">
                    {idea.title}
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    By {idea.creator.name} • 15% Royalty Active
                  </div>
                </div>

                {/* Deliverables snippet if submitted */}
                {task.deliverables && (
                  <div className="mt-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 p-3 text-xs text-emerald-300">
                    <span className="font-bold block mb-1">Submitted Deliverables:</span>
                    <p className="text-[11px] leading-relaxed">{task.deliverables}</p>
                  </div>
                )}
              </div>

              {/* Footer Status & Actions */}
              <div className="mt-4 pt-3.5 border-t border-neutral-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs">
                  {task.status === "completed" ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <CheckCircle2 className="h-4 w-4" /> Paid & Released
                    </span>
                  ) : task.status === "submitted" ? (
                    <span className="flex items-center gap-1 text-blue-400 font-semibold">
                      <Clock className="h-4 w-4" /> Under Verification
                    </span>
                  ) : task.status === "in_progress" ? (
                    <span className="flex items-center gap-1 text-amber-400 font-semibold">
                      <Briefcase className="h-4 w-4" /> In Progress by {task.assignedToName}
                    </span>
                  ) : (
                    <span className="text-neutral-400">
                      {task.applicantCount} applicants • {task.dueDate}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {task.status === "open" && (
                    <button
                      onClick={() => handleApply(task, idea)}
                      className="rounded-xl bg-amber-500 hover:bg-amber-400 px-3 py-1.5 text-xs font-bold text-neutral-950 transition-all active:scale-95"
                    >
                      Claim & Start Task
                    </button>
                  )}

                  {task.status === "in_progress" && (
                    <button
                      onClick={() => handleOpenSubmit(task)}
                      className="rounded-xl bg-blue-500 hover:bg-blue-400 px-3 py-1.5 text-xs font-bold text-white transition-all active:scale-95"
                    >
                      Submit Proof
                    </button>
                  )}

                  {task.status === "submitted" && (
                    <button
                      onClick={() => handleApproveAndPay(task, idea)}
                      className="rounded-xl bg-emerald-500 hover:bg-emerald-400 px-3 py-1.5 text-xs font-bold text-neutral-950 transition-all active:scale-95"
                    >
                      Release ${task.reward} Escrow
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deliverable Proof Submission Modal */}
      {submittingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-lg text-neutral-100">
              Submit Task Deliverables & Proof
            </h3>
            <p className="text-xs text-neutral-400">
              Upload your video link, test logs, CAD repository, or survey notes for:{" "}
              <span className="text-amber-400 font-semibold">{submittingTask.title}</span>
            </p>

            <textarea
              rows={4}
              value={submissionDeliverable}
              onChange={(e) => setSubmissionDeliverable(e.target.value)}
              placeholder="Paste Google Drive/YouTube video link, Dropbox archive, CAD step file link, or detailed findings..."
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-neutral-200 focus:border-amber-500 focus:outline-none"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSubmittingTask(null)}
                className="px-4 py-2 text-xs text-neutral-400 hover:bg-neutral-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const targetIdea = ideas.find((i) => i.id === submittingTask.ideaId) || ideas[0];
                  handleConfirmSubmit(targetIdea);
                }}
                className="rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2 text-xs font-bold text-neutral-950 transition-all"
              >
                Confirm Submission for Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Task Bounty Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-lg text-neutral-100">
              Post Paid Task / Act Bounty
            </h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Target Commercial Idea</label>
                <select
                  value={activeIdeaForNewTask}
                  onChange={(e) => setActiveIdeaForNewTask(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-200"
                >
                  {ideas.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.title} (by {i.creator.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g., Record high-temperature thermal stress test video"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-200 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Task Type</label>
                  <select
                    value={newTaskType}
                    onChange={(e) => setNewTaskType(e.target.value as any)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-200"
                  >
                    <option value="act_performance">🎭 Act / Physical Performance</option>
                    <option value="engineering">🛠️ Engineering & CAD</option>
                    <option value="market_validation">📊 Market Validation</option>
                    <option value="creator_consultation">🧠 Creator Consultation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Reward ($USD in Escrow)</label>
                  <input
                    type="number"
                    min={50}
                    step={25}
                    value={newTaskReward}
                    onChange={(e) => setNewTaskReward(Number(e.target.value))}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs font-mono text-neutral-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">Instructions & Expected Proof</label>
                <textarea
                  rows={3}
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Describe the exact deliverable required to release payment..."
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-200 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-4 py-2 text-xs text-neutral-400 hover:bg-neutral-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2 text-xs font-bold text-neutral-950 transition-all"
                >
                  Lock Escrow & Publish Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
