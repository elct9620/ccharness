export type SharedHookInput = {
  sessionId: string;
  transcriptPath: string;
  cwd: string;
  hookEventName: string;
};

export type StopHookInput = SharedHookInput & {
  stopHookActive: boolean;
};

export type PreToolUseHookInput = SharedHookInput & {
  toolName: string;
  toolInput: Record<string, any>;
};

export type PostToolUseHookInput = PreToolUseHookInput & {
  toolResponse: Record<string, any>;
};

export type HookInput =
  | StopHookInput
  | PreToolUseHookInput
  | PostToolUseHookInput;
