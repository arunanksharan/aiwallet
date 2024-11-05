import { NextResponse } from 'next/server';
import { SYSTEM_PROMPT } from '@/lib/openai/prompts';
import openai from '@/lib/openai/config';
import { callToolFunction } from '@/lib/openai/response_handler';

import * as dotenv from 'dotenv';
import { llm_tools } from '@/lib/openai/llm_tools';

// Load environment variables from .env file
dotenv.config();

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    console.log(messages);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      tools: llm_tools,
    });

    console.log(completion.choices[0].message);

    const assistantMessage = completion.choices[0].message;
    const toolCalls = assistantMessage.tool_calls;
    const content = assistantMessage.content;

    if (toolCalls && toolCalls.length > 0) {
      // Scenario 1: The assistant provided a tool call
      const toolCall = toolCalls[0];
      const functionName = toolCall.function.name;
      const functionArguments = JSON.parse(toolCall.function.arguments);

      console.log('Tool call fnName::fnArguments:')
      console.log(functionName)
      console.log(functionArguments);

      const tool_res = await callToolFunction(functionName, functionArguments);
      console.log('Tool response:40');
      console.log(tool_res);
      console.log(typeof tool_res === 'string' ? tool_res : JSON.stringify(tool_res))

      // Add tool response to messages and get new completion
      const updatedMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
        {
          role: 'user',
          content:
            typeof tool_res === 'string' ? tool_res : JSON.stringify(tool_res),
        },
      ];

      const newCompletion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: updatedMessages,
      });

      // Update the completion with the new response
      const balance_res = newCompletion.choices[0].message.content;
      console.log(balance_res);
      return NextResponse.json({ message: balance_res });
    } else if (content) {
      // Scenario 2: The assistant asked for more information
      // Add the message to chat history and display it to the user
      return NextResponse.json({
        message: content,
      });
    } else {
      console.error(
        'Unexpected response format: No tool call or content available.'
      );
    }

    return NextResponse.json({
      message: completion.choices[0].message,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
