import type {SpawnOptionsWithoutStdio} from 'child_process';
import {spawn} from 'cross-spawn';

export const Spawn = (
  command: string,
  args: (string | string[])[],
  options?: SpawnOptionsWithoutStdio,
) => {
  return new Promise<{status: boolean} & Record<'stdout' | 'stderr' | 'output', string[]>>(
    (resolve) => {
      const process = spawn(command, args.flat(), options);

      const stdout: string[] = [];
      const stderr: string[] = [];
      const output: string[] = [];

      process.stdout.on('data', (chunk) => {
        stdout.push(chunk.toString());
        output.push(chunk.toString());
      });

      process.stderr.on('data', (chunk) => {
        stderr.push(chunk.toString());
        output.push(chunk.toString());
      });

      process.on('close', (code) => resolve({status: code === 0, stdout, stderr, output}));
    },
  );
};
