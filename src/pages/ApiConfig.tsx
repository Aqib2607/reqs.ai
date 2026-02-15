import { useState } from "react";
import { Plus, Trash2, Eye, EyeOff, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

export default function ApiConfig() {
  const { apiKeys, toggleApiKey, removeApiKey, addApiKey } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [newKey, setNewKey] = useState({ name: "", provider: "", key: "" });
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">API Configuration</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your AI provider API keys</p>
        </div>
        <Button className="gradient-primary text-primary-foreground border-0" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add API Key
        </Button>
      </div>

      <div className="glass-card overflow-hidden">
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
                      key.active ? "bg-emerald-400/10 text-emerald-400" : "bg-muted text-muted-foreground"
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
                    <button
                      onClick={() => removeApiKey(key.id)}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button className="gradient-primary text-primary-foreground border-0" onClick={handleAdd}>Add Key</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
