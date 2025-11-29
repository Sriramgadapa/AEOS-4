import { Globe, Building2, Banknote, HeartHandshake, ShieldCheck, Activity, X, Terminal } from "lucide-react";
import { useState } from "react";
import { useAIAgent, AIResponse } from "@/hooks/useAIAgent";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Division {
  id: string;
  name: string;
  status: "active" | "idle" | "processing";
  icon: React.ReactNode;
  description: string;
  capabilities: string[];
}

export const AgentStatus = () => {
  const { processCommand, isProcessing } = useAIAgent();
  const { toast } = useToast();
  const [activeDivision, setActiveDivision] = useState<string | null>(null);
  const [selectedDivision, setSelectedDivision] = useState<Division | null>(null);
  const [modalLogs, setModalLogs] = useState<any[]>([]);

  const divisions: Division[] = [
    {
      id: "eid",
      name: "EID: Earth Intelligence",
      status: "active",
      icon: <Globe className="h-6 w-6" />,
      description: "Planetary monitoring, weather analysis, IoT grid, disaster prediction.",
      capabilities: ["Planetary Monitoring", "Weather Analysis", "Satellite Uplink", "Disaster Forecast"]
    },
    {
      id: "enid",
      name: "ENID: Enterprise Intelligence",
      status: "active",
      icon: <Building2 className="h-6 w-6" />,
      description: "Business automation, marketing, compliance, data insights.",
      capabilities: ["Workflow Automation", "Marketing GenAI", "Compliance & KYC", "Smart Audit"]
    },
    {
      id: "dtad",
      name: "DTAD: DeFi & Transactions",
      status: "processing",
      icon: <Banknote className="h-6 w-6" />,
      description: "Financial brain, yield optimization, insurance, payments.",
      capabilities: ["Yield Optimization", "Smart Treasury", "Risk Scoring", "Global Payments"]
    },
    {
      id: "hid",
      name: "HID: Human Interaction",
      status: "active",
      icon: <HeartHandshake className="h-6 w-6" />,
      description: "Support, personalization, user journey, recommendations.",
      capabilities: ["24/7 Support", "Personalization", "Ticket Resolution", "Voice Interface"]
    },
  ];

  const handleDivisionClick = (div: Division) => {
    setSelectedDivision(div);
    setModalLogs([]); // Clear logs when opening new division
  };

  const handleCapabilityClick = async (cap: string) => {
    if (!selectedDivision) return;
    
    // Add pending log
    const newLogId = Date.now();
    setModalLogs(prev => [...prev, { id: newLogId, text: `Initiating ${cap}...`, type: 'pending' }]);

    const response = await processCommand(
      `Execute ${cap} for ${selectedDivision.name}`,
      selectedDivision.id, // Direct routing
      `User triggered specific capability: ${cap}`
    );

    if (response) {
      setModalLogs(prev => prev.map(log =>
        log.id === newLogId ? { id: log.id, text: `> ${cap} EXECUTION COMPLETE`, type: 'success' } : log
      ));

      // Add the full response as a detailed block
      setModalLogs(prev => [...prev, {
        id: Date.now() + 1,
        text: response.response,
        type: 'response',
        details: response.tool_usage
      }]);
    } else {
       setModalLogs(prev => prev.map(log =>
        log.id === newLogId ? { id: log.id, text: `> ${cap} FAILED`, type: 'error' } : log
      ));
    }
  };

  const getStatusColor = (status: Division["status"]) => {
    switch (status) {
      case "active":
        return "text-cyan-400";
      case "processing":
        return "text-yellow-400 animate-pulse";
      case "idle":
        return "text-gray-500";
    }
  };

  const getStatusBg = (status: Division["status"]) => {
    switch (status) {
      case "active":
        return "bg-cyan-500/10 border-cyan-500/30";
      case "processing":
        return "bg-yellow-500/10 border-yellow-500/30";
      case "idle":
        return "bg-gray-500/10 border-gray-500/30";
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
        {divisions.map((div) => (
          <button
            key={div.id}
            onClick={() => handleDivisionClick(div)}
            className={`relative group p-4 rounded-xl border ${getStatusBg(div.status)} transition-all duration-300 hover:scale-[1.02] hover:bg-white/5 cursor-pointer text-left`}
          >
            {/* Status Indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${div.status === "active" ? "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" : "bg-yellow-400"} animate-pulse`} />
              <span className={`text-[10px] font-mono tracking-widest ${getStatusColor(div.status)} uppercase`}>
                {div.status}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-3">
              <div className={`p-3 rounded-lg bg-black/40 border border-white/10 ${getStatusColor(div.status)} group-hover:scale-110 transition-transform`}>
                {div.icon}
              </div>
              <div>
                <h3 className="font-bold text-white text-lg tracking-tight">{div.name}</h3>
                <p className="text-xs text-gray-400 font-mono">ID: {div.id.toUpperCase()}-001</p>
              </div>
            </div>

            <p className="text-sm text-gray-300 mb-4 line-clamp-2">{div.description}</p>

            <div className="flex flex-wrap gap-2">
              {div.capabilities.slice(0, 3).map((cap) => (
                <span key={cap} className="px-2 py-1 text-[10px] rounded bg-white/5 border border-white/10 text-gray-400 font-mono">
                  {cap}
                </span>
              ))}
              {div.capabilities.length > 3 && (
                 <span className="px-2 py-1 text-[10px] rounded bg-white/5 border border-white/10 text-gray-400 font-mono">+{div.capabilities.length - 3}</span>
              )}
            </div>
          </button>
        ))}
      </div>

      <Dialog open={!!selectedDivision} onOpenChange={() => setSelectedDivision(null)}>
        <DialogContent className="bg-black/95 border-primary/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl font-bold font-mono">
               {selectedDivision?.icon}
               {selectedDivision?.name}
               <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">ONLINE</span>
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
             {/* Left: Capabilities Menu */}
             <div className="space-y-2">
                <h4 className="text-xs font-mono text-gray-500 uppercase mb-2">Operational Controls</h4>
                {selectedDivision?.capabilities.map(cap => (
                  <button
                    key={cap}
                    onClick={() => handleCapabilityClick(cap)}
                    disabled={isProcessing}
                    className="w-full text-left px-3 py-2 rounded text-sm font-mono text-cyan-100 hover:bg-cyan-500/20 hover:text-cyan-400 transition-colors border border-transparent hover:border-cyan-500/30 flex items-center justify-between group"
                  >
                    {cap}
                    <Activity className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
             </div>

             {/* Right: Terminal Output */}
             <div className="md:col-span-2 bg-black rounded-lg border border-white/10 p-4 font-mono text-xs h-[300px] overflow-y-auto relative">
                <div className="absolute top-2 right-2 text-gray-600">
                   <Terminal className="w-4 h-4" />
                </div>

                {modalLogs.length === 0 && (
                   <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-2">
                      <Activity className="w-8 h-8 opacity-20" />
                      <p>Select a capability to initiate neural link...</p>
                   </div>
                )}

                <div className="space-y-3">
                   {modalLogs.map((log) => (
                      <div key={log.id} className="animate-fade-in">
                         {log.type === 'pending' && <span className="text-yellow-500">{log.text}</span>}
                         {log.type === 'success' && <span className="text-green-400">{log.text}</span>}
                         {log.type === 'error' && <span className="text-red-500">{log.text}</span>}
                         {log.type === 'response' && (
                            <div className="mt-1 p-2 bg-white/5 rounded border-l-2 border-cyan-500 text-gray-300 whitespace-pre-wrap">
                               {log.text}
                            </div>
                         )}
                      </div>
                   ))}
                   {isProcessing && (
                      <div className="text-cyan-500 animate-pulse">Processing request...</div>
                   )}
                </div>
             </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
