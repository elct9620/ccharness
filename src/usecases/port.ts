export type SharedHookInput = {
  sessionId: string;
  transcriptPath: string;
  cwd: string;
  hookEventName: string;
};

export type StopHookInput = SharedHookInput & {
  stopHookActive: boolean;
};

export type HookInput = StopHookInput;
