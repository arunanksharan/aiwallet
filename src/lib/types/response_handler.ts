export type ToolCall = {
    id: string;
    function: {
      name: string;
      arguments: string;
      parsed_arguments: Record<string, unknown>;
    };
    type: 'function';
  };
  
  export type ParsedResponse = {
    choices: {
      message: {
        content: string | null;
        tool_calls?: ToolCall[];
      };
    }[];
  };