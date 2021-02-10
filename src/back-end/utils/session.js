const extractSessionId = (session) => session.split("/").pop();

const generateContextSession = ({ session, context }) => {
  return `projects/${process.env.DIALOG_FLOW_PROJECT_ID}/agent/sessions/${session}/contexts/${context}`;
};

module.exports = {
  extractSessionId,
  generateContextSession,
};
