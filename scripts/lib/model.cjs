/**
 * Model — Model resolution for agent types based on quality profiles
 */

const { MODEL_PROFILES, resolveModelInternal, output, error } = require('./core.cjs');

function cmdResolveModel(cwd, agentType, raw) {
  if (!agentType) {
    error('agent-type required. Available: ' + Object.keys(MODEL_PROFILES).join(', '));
  }

  const model = resolveModelInternal(cwd, agentType);

  output({
    agent_type: agentType,
    model,
    profiles: MODEL_PROFILES[agentType] || null,
  }, raw, model);
}

module.exports = {
  cmdResolveModel,
};
