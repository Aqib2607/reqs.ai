import { useState } from "react";
import { Plus, Trash2, Eye, EyeOff, Activity, CheckCircle2, Circle, AlertCircle, Key, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  icon: typeof Key;
  check: (apiKeys: { active: boolean }[]) => boolean;
}

const checklist: ChecklistItem[] = [
  {
    id: "add-key",
    label: "Add an API Key",
    description: "Add at least one AI provider API key",
    icon: Key,
    check: (keys) => keys.length > 0,
  },
  {
    id: "activate-key",
    label: "Activate a Key",
    description: "Enable at least one API key for use",
    icon: Zap,
    check: (keys) => keys.some((k) => k.active),
  },
  {
    id: "multiple-keys",
    label: "Add Backup Provider",
    description: "Add a second API key for fallback",
    icon: Shield,
    check: (keys) => keys.length >= 2,
  },
];

export default function ApiConfig() {
  const { apiKeys, toggleApiKey, removeApiKey, addApiKey } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [newKey, setNewKey] = useState({ name: "", provider: "", key: "" });
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleAdd = () => {
    if (!newKey.name || !newKey.key) return;
    addApiKey({
      id: Date.now().toString(),
      name: newKey.name,
      provider: newKey.provider,
      key: newKey.key.slice(0, 6) + "..." + newKey.key.slice(-4),
      active: true,
      latency: Math.floor(Math.random() * 500) + 800,
    });
    setNewKey({ name: "", provider: "", key: "" });
    setShowModal(false);
  };

  const completedCount = checklist.filter((c) => c.check(apiKeys)).length;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">API Configuration</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your AI provider API keys</p>
        </div>
        <Button className="gradient-primary text-primary-foreground border-0" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add API Key
        </Button>
      </div>

      {/* Setup Checklist */}
      <div className="glass-card p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Setup Checklist</h3>
          <span className="text-xs text-muted-foreground">
            {completedCount}/{checklist.length} complete
          </span>
        </div>
        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden mb-4">
          <div
            className="h-full gradient-primary rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / checklist.length) * 100}%` }}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {checklist.map((item) => {
            const done = item.check(apiKeys);
            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border transition-all",
                  done ? "border-accent/30 bg-accent/5" : "border-border bg-secondary/10"
                )}
              >
                {done ? (
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground/40 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className={cn("text-sm font-medium", done ? "text-accent" : "text-foreground")}>{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Keys Table */}
      <div className="glass-card overflow-hidden">
        {apiKeys.length === 0 ? (
          <div className="p-12 text-center">
            <Key className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-4">No API keys configured yet</p>
            <Button variant="outline" size="sm" onClick={() => setShowModal(true)}>
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Your First Key
            </Button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">Name</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">Provider</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">Key</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">Latency</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((key) => (
                <tr key={key.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{key.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{key.provider}</td>
                  <td className="px-6 py-4 text-sm font-mono text-muted-foreground">
                    {visibleKeys.has(key.id) ? key.key : "•".repeat(16)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Activity className="w-3.5 h-3.5 text-accent" />
                      <span className="text-muted-foreground">{key.latency}ms</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleApiKey(key.id)}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                        key.active ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"
                      )}
                    >
                      {key.active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setVisibleKeys((prev) => {
                          const next = new Set(prev);
                          next.has(key.id) ? next.delete(key.id) : next.add(key.id);
                          return next;
                        })}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      >
                        {visibleKeys.has(key.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      {confirmDelete === key.id ? (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => { removeApiKey(key.id); setConfirmDelete(null); }}
                          >
                            Confirm
                          </Button>
                          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setConfirmDelete(null)}>
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(key.id)}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Key Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="glass-card p-6 w-full max-w-md animate-fade-in">
            <h3 className="text-lg font-bold mb-4">Add API Key</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Name</label>
                <input
                  value={newKey.name}
                  onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
                  placeholder="e.g., OpenAI GPT-4"
                  className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Provider</label>
                <input
                  value={newKey.provider}
                  onChange={(e) => setNewKey({ ...newKey, provider: e.target.value })}
                  placeholder="e.g., OpenAI"
                  className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">API Key</label>
                <input
                  type="password"
                  value={newKey.key}
                  onChange={(e) => setNewKey({ ...newKey, key: e.target.value })}
                  placeholder="sk-..."
                  className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Your key will be masked after entry
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button className="gradient-primary text-primary-foreground border-0" onClick={handleAdd} disabled={!newKey.name || !newKey.key}>
                Add Key
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
