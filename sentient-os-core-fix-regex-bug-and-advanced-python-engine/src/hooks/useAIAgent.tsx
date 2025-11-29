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
      await new Promise(r => setTimeout(r, 1000)); // Simulate network latency

      let response: AIResponse | null = null;
      const lowerCmd = command.toLowerCase();

      // --- EID SIMULATION ---
      if (lowerCmd.includes("planetary") || lowerCmd.includes("venus")) {
          response = {
             response: "PLANETARY MONITORING REPORT:\n• VENUS: Atmospheric pressure nominal. Probe V-9 active.\n• MARS: Terraforming sim running. Colony Alpha supports life.\n• JUPITER: Storm tracking on Great Red Spot. Radiation levels high.\n• MOON: Lunar Gateway operational. Helium-3 mining optimized.",
             division: "EID - Earth Intelligence",
             tool_usage: [{tool: "Deep Space Relay", input: "Solar System Scan", output: "Data Received"}],
             collaboration_log: ["Aggregating data from deployed AI probes."],
             sentiment: "neutral", cost_incurred: 0.05, timestamp: new Date().toISOString()
          };
      } else if (lowerCmd.includes("weather")) {
          response = {
             response: "GLOBAL WEATHER MATRIX:\n• NORTH AMERICA: Polar Vortex stabilizing. Temp -5°C.\n• APAC: Monsoon season early warning. Rainfall +20%.\n• EMEA: Heatwave detected in Southern Sector. Grid load 95%.\n• LATAM: Amazon humidity levels optimal for regeneration.",
             division: "EID", tool_usage: [{tool: "Global Atmos Scan", input: "Multi-Region", output: "Map Generated"}],
             collaboration_log: [], sentiment: "neutral", cost_incurred: 0.02, timestamp: new Date().toISOString()
          };
      } else if (lowerCmd.includes("satellite") || lowerCmd.includes("uplink")) {
          response = {
             response: "SATELLITE CONSTELLATION STATUS:\n• SAT-1 (Optics): 100% Uptime. Resolution 50cm.\n• SAT-2 (Radar): Tracking maritime logistics in Pacific.\n• SAT-3 (Comms): Relaying secure Masumi Block data.\n• SAT-4 (Infrared): Wildfire detection active in Sector 4.",
             division: "EID", tool_usage: [{tool: "Orbital Feed", input: "Constellation Link", output: "Connected"}],
             collaboration_log: [], sentiment: "neutral", cost_incurred: 0.04, timestamp: new Date().toISOString()
          };
      } else if (lowerCmd.includes("disaster")) {
          response = {
             response: "DISASTER FORECAST SYSTEM:\n• FLOOD: Critical Risk in Delta Region. Probability 89%.\n• FIRE: High Risk in California Sector. Drone Swarm deployed.\n• QUAKE: Minor tremors detected in Ring of Fire. Mag 2.3.\n• STORM: Category 1 Cyclone forming in Atlantic.",
             division: "EID", tool_usage: [{tool: "Risk Prediction Model", input: "Seismic Sensors", output: "Alert"}],
             collaboration_log: ["Triggering Drone Swarm for aerial survey."], sentiment: "serious", cost_incurred: 0.02, timestamp: new Date().toISOString()
          };

      // --- ENID SIMULATION ---
      } else if (lowerCmd.includes("marketing")) {
          response = {
             response: "MARKETING OPERATIONS CENTER:\n• EMAIL: Open rate 24%. A/B test 'Subject Line B' winning.\n• SOCIAL: Viral trend detected on Twitter. Auto-replying.\n• SEO: Ranking #1 for 'AI OS'. Traffic +15% WoW.\n• ADS: CPA reduced by 12% via autonomous bid optimization.",
             division: "ENID", tool_usage: [{tool: "Campaign Manager", input: "Multi-Channel", output: "Active"}],
             collaboration_log: [], sentiment: "positive", cost_incurred: 0.015, timestamp: new Date().toISOString()
          };
      } else if (lowerCmd.includes("workflow")) {
          response = {
             response: "WORKFLOW AUTOMATION METRICS:\n• HR: Onboarding time reduced from 5 days to 4 hours.\n• PROCUREMENT: Supplier invoices auto-paid via smart contract.\n• IT: 45 support tickets resolved by Level 1 AI Agent.\n• SALES: CRM updated with 200 new leads from web scraper.",
             division: "ENID", tool_usage: [{tool: "Process Miner", input: "Corporate Logs", output: "Optimized"}],
             collaboration_log: [], sentiment: "positive", cost_incurred: 0.01, timestamp: new Date().toISOString()
          };
      } else if (lowerCmd.includes("compliance") || lowerCmd.includes("kyc")) {
          response = {
             response: "COMPLIANCE & IDENTITY SHIELD:\n• KYC: User ID verified against Interpol database.\n• AML: No suspicious transaction patterns detected.\n• GDPR: Data privacy request processed automatically.\n• SANCTIONS: Wallet address clean across 15 jurisdictions.",
             division: "ENID", tool_usage: [{tool: "RegTech Scanner", input: "Global Database", output: "Verified"}],
             collaboration_log: [], sentiment: "secure", cost_incurred: 0.02, timestamp: new Date().toISOString()
          };
      } else if (lowerCmd.includes("audit")) {
          response = {
             response: "SMART AUDIT LOGS:\n• TX-882: Treasury payout confirmed. Block #99281.\n• AUTH: Admin login via DID at 14:02 UTC.\n• DATA: EID accessed sensitive satellite feed. Authorized.\n• CONFIG: Policy update deployed to ENID-Core.",
             division: "ENID", tool_usage: [{tool: "Ledger Verifier", input: "Cardano Chain", output: "Synced"}],
             collaboration_log: [], sentiment: "secure", cost_incurred: 0.01, timestamp: new Date().toISOString()
          };

      // --- DTAD SIMULATION ---
      } else if (lowerCmd.includes("yield")) {
          response = {
             response: "YIELD FARMING OPPORTUNITIES:\n• ADA/MIN: 12.5% APY. Low impermanent loss risk.\n• ADA/AGIX: 8.2% APY. High volume pool.\n• STABLE/ADA: 4.5% APY. Safe haven allocation.\n• LENDING: Supply rate 3.1% on Liqwid Protocol.",
             division: "DTAD", tool_usage: [{tool: "Liquidity Scanner", input: "DEX Aggregator", output: "Found"}],
             collaboration_log: [], sentiment: "positive", cost_incurred: 0.03, timestamp: new Date().toISOString()
          };
      } else if (lowerCmd.includes("treasury")) {
          response = {
             response: "TREASURY ALLOCATION:\n• NATIVE (ADA): 60% - Staked for network security.\n• STABLES: 25% - Dry powder for dips.\n• GOVERNANCE: 10% - Voting power in partner DAOs.\n• RWA: 5% - Tokenized real estate bonds.",
             division: "DTAD", tool_usage: [{tool: "Asset Manager", input: "DAO Vault", output: "Balanced"}],
             collaboration_log: [], sentiment: "neutral", cost_incurred: 0.01, timestamp: new Date().toISOString()
          };
      } else if (lowerCmd.includes("risk")) {
          response = {
             response: "RISK ASSESSMENT PROFILE:\n• CREDIT SCORE: 850 (Excellent). Eligible for under-collateral loans.\n• VOLATILITY: Portfolio Beta 0.85 (Lower than market).\n• LIQUIDATION: Health factor 2.4. Safe from margin calls.\n• DIVERSIFICATION: High. Exposure to 12 asset classes.",
             division: "DTAD", tool_usage: [{tool: "Credit Engine", input: "Wallet Graph", output: "Scored"}],
             collaboration_log: [], sentiment: "positive", cost_incurred: 0.02, timestamp: new Date().toISOString()
          };
      } else if (lowerCmd.includes("pay") || lowerCmd.includes("instant")) {
          response = {
             response: "PAYMENT ACTIVITY LOG:\n• SENT: 50 ADA to User-Alice (Settled < 1s).\n• RECEIVED: 200 DJED from Merchant-Bob.\n• SUBSCRIPTION: Paid 5 ADA for Oracle Feed (Auto-renew).\n• PENDING: Multisig approval needed for 10k ADA transfer.",
             division: "DTAD", tool_usage: [{tool: "Payment Rail", input: "Hydra Head", output: "Settled"}],
             collaboration_log: [], sentiment: "neutral", cost_incurred: 0.01, timestamp: new Date().toISOString()
          };

      // --- HID SIMULATION ---
      } else if (lowerCmd.includes("support")) {
          response = {
             response: "ACTIVE SUPPORT SESSIONS:\n• USER-1: Requesting API key reset. Handling...\n• USER-2: Asking about staking APY. Answered.\n• USER-3: Reporting bug in mobile UI. Logged.\n• SYSTEM: All agents operating at 99.9% uptime.",
             division: "HID", tool_usage: [{tool: "Chat Engine", input: "Queue", output: "Active"}],
             collaboration_log: [], sentiment: "positive", cost_incurred: 0.01, timestamp: new Date().toISOString()
          };
      } else if (lowerCmd.includes("personal")) {
          response = {
             response: "USER PERSONALIZATION PROFILE:\n• PREFERENCE: Dark Mode, High Density Data.\n• INTERESTS: DeFi, Space Tech, Governance.\n• ACTIVITY: High frequency trader (Asia Timezone).\n• SUGGESTION: Enable 'Pro Mode' for advanced charts.",
             division: "HID", tool_usage: [{tool: "User Graph", input: "Behavior", output: "Mapped"}],
             collaboration_log: [], sentiment: "neutral", cost_incurred: 0.01, timestamp: new Date().toISOString()
          };
      } else if (lowerCmd.includes("ticket") || lowerCmd.includes("resolve")) {
          response = {
             response: "TICKET RESOLUTION STATS:\n• OPEN: 3 (Low Priority).\n• RESOLVED: 142 today (Auto-closed by AI).\n• ESCALATED: 0 requiring human intervention.\n• CSAT SCORE: 4.8/5.0 based on recent feedback.",
             division: "HID", tool_usage: [{tool: "Ticket Master", input: "CRM", output: "Updated"}],
             collaboration_log: [], sentiment: "positive", cost_incurred: 0.01, timestamp: new Date().toISOString()
          };
      } else if (lowerCmd.includes("voice")) {
          response = {
             response: "VOICE INTERFACE METRICS:\n• ACCURACY: 98.2% Word Error Rate.\n• LANGUAGE: English (US) detected. Dialect: West Coast.\n• SENTIMENT: Calm/Professional tone analyzed.\n• SECURITY: Voiceprint matches User-Admin-01.",
             division: "HID", tool_usage: [{tool: "Voice Biometrics", input: "Audio Stream", output: "Secure"}],
             collaboration_log: [], sentiment: "secure", cost_incurred: 0.01, timestamp: new Date().toISOString()
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
