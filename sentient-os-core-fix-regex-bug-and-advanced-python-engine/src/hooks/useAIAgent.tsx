import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { classifyIntent, routeToAgent, extractEntities, analyzeSentiment } from "@/utils/nlpProcessor";

export interface AIResponse {
  response: string;
  division: string;
  tool_usage: any[];
  collaboration_log: string[];
  sentiment: string;
  cost_incurred: number;
  timestamp: string;
}

export const useAIAgent = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processCommand = async (
    command: string,
    division?: string,
    context?: string
  ): Promise<AIResponse | null> => {
    setIsProcessing(true);
    try {
      console.log('Sending command to AEOS Orchestrator:', { command, division, context });

      // Local fallback simulation logic for the demo environment
      // In a real environment, this would hit the Python backend: http://localhost:8000/interact

      await new Promise(r => setTimeout(r, 1500)); // Simulate network latency

      let response: AIResponse | null = null;

      const lowerCmd = command.toLowerCase();

      // Simulate Backend Logic here since we can't easily proxy to localhost:8000 from the preview environment
      if (lowerCmd.includes("flood")) {
         response = {
             response: "CRITICAL WARNING: Flood risk detected in Sector 7. Initiating autonomous response protocols.",
             division: "EID - Earth Intelligence",
             tool_usage: [{tool: "Risk Prediction Model", input: "Regional Sensors", output: "High Alert"}],
             collaboration_log: ["Triggering Drone Swarm for aerial survey."],
             sentiment: "serious",
             cost_incurred: 0.02,
             timestamp: new Date().toISOString()
         };
      } else if (lowerCmd.includes("planetary") || lowerCmd.includes("venus")) {
          response = {
             response: "PLANETARY MONITORING REPORT:\n• VENUS: Atmospheric pressure nominal. Probe V-9 active.\n• MARS: Terraforming sim running. Colony Alpha supports life.\n• JUPITER: Storm tracking on Great Red Spot. Radiation levels high.\n• MOON: Lunar Gateway operational. Helium-3 mining optimized.",
             division: "EID - Earth Intelligence",
             tool_usage: [{tool: "Deep Space Relay", input: "Solar System Scan", output: "Data Received"}],
             collaboration_log: ["Aggregating data from deployed AI probes."],
             sentiment: "neutral",
             cost_incurred: 0.05,
             timestamp: new Date().toISOString()
          };
      } else {
          // General Fallback
           response = {
             response: `AEOS Core processing: "${command}". Routing to ${division || 'appropriate division'}.`,
             division: division || "AEOS Core",
             tool_usage: [],
             collaboration_log: [],
             sentiment: "neutral",
             cost_incurred: 0.00,
             timestamp: new Date().toISOString()
          };
      }

      console.log('AEOS response:', response);
      return response;

      /*
      // REAL BACKEND INTEGRATION CODE (Commented out for static demo reliability)
      const { data, error } = await supabase.functions.invoke('ai-agent', {
        body: { command, agent: division, context }
      });
      if (error) throw error;
      return data as AIResponse;
      */

    } catch (error: any) {
      console.error('Error processing command:', error);
      toast({
        title: "Processing Failed",
        description: error.message || 'Failed to process command',
        variant: "destructive",
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processCommand,
    isProcessing,
  };
};
