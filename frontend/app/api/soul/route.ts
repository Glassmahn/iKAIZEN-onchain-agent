export async function GET() {
  return Response.json({
    goal: "build iKAIZEN",
    memory: [],
    strategyVersion: "1.0",
    riskTolerance: 0.5,
    totalTrades: 0,
    totalPnL: 0,
    lastAction: null,
    createdAt: new Date().toISOString(),
  });
}