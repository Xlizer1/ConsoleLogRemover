"use client";
import React, { ChangeEvent, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ConsoleLogRemover = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [stats, setStats] = useState({ removed: 0, linesProcessed: 0 });

  const removeConsoleLogs = (code: string) => {
    const lines = code.split("\n");
    let removedCount = 0;

    const processedLines = lines.filter((line) => {
      const trimmedLine = line.trim();
      // Check for both commented and uncommented console.log statements
      if (
        trimmedLine.match(/^\/\/.*console\.log\s*\(/) || // Single-line comment
        trimmedLine.match(/^\/\*.*console\.log\s*\(.*\*\/$/) || // Multi-line comment on single line
        trimmedLine.startsWith("console.log(") ||
        trimmedLine.match(/^console\.log\s*\(/)
      ) {
        removedCount++;
        return false;
      }
      return true;
    });

    setStats({
      removed: removedCount,
      linesProcessed: lines.length,
    });

    return processedLines.join("\n");
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newInput = e.target.value;
    setInput(newInput);
    setOutput(removeConsoleLogs(newInput));
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(output);
  };

  const handlePasteClick = async () => {
    const text: string = await navigator.clipboard.readText();
    setInput(text);
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Console.log Remover</CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <div className="grid h-full gap-4">
          <div className="flex gap-2">
            <div className="w-full flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="output" className="text-sm font-medium">
                  Input
                </label>
                <button
                  onClick={handlePasteClick}
                  className="rounded bg-gray-500 px-3 py-1 text-sm text-white hover:bg-gray-600"
                >
                  Paste from Clipboard
                </button>
              </div>
              <textarea
                id="input"
                className="w-full h-full rounded border p-2 font-mono resize-none"
                value={input}
                onChange={handleInputChange}
                placeholder="Paste your code here..."
              />
            </div>

            <div className="w-full flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="output" className="text-sm font-medium">
                  Output Code
                </label>
                <button
                  onClick={handleCopyClick}
                  className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                >
                  Copy to Clipboard
                </button>
              </div>
              <textarea
                id="output"
                className="w-full h-full rounded border p-2 font-mono resize-none"
                value={output}
                readOnly
              />
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Processed {stats.linesProcessed} lines and removed {stats.removed}{" "}
            console.log statements
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsoleLogRemover;
