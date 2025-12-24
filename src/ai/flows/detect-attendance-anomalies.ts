'use server';

/**
 * @fileOverview Detects anomalies in attendance data using AI.
 *
 * - detectAttendanceAnomalies - A function that detects anomalies in attendance data.
 * - DetectAttendanceAnomaliesInput - The input type for the detectAttendanceAnomalies function.
 * - DetectAttendanceAnomaliesOutput - The return type for the detectAttendanceAnomalies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectAttendanceAnomaliesInputSchema = z.object({
  attendanceData: z
    .string()
    .describe(
      'A string containing the attendance records in JSON format. Include date, student ID, and attendance status (present/absent).'
    ),
  threshold: z
    .number()
    .default(3)
    .describe(
      'The threshold (number of days) above which an anomaly is flagged.'
    ),
});
export type DetectAttendanceAnomaliesInput = z.infer<
  typeof DetectAttendanceAnomaliesInputSchema
>;

const DetectAttendanceAnomaliesOutputSchema = z.object({
  anomalies: z
    .array(z.string())
    .describe('A list of detected anomalies in attendance data.'),
});
export type DetectAttendanceAnomaliesOutput = z.infer<
  typeof DetectAttendanceAnomaliesOutputSchema
>;

export async function detectAttendanceAnomalies(
  input: DetectAttendanceAnomaliesInput
): Promise<DetectAttendanceAnomaliesOutput> {
  return detectAttendanceAnomaliesFlow(input);
}

const detectAttendanceAnomaliesPrompt = ai.definePrompt({
  name: 'detectAttendanceAnomaliesPrompt',
  input: {schema: DetectAttendanceAnomaliesInputSchema},
  output: {schema: DetectAttendanceAnomaliesOutputSchema},
  prompt: `You are an AI assistant specialized in detecting anomalies in school attendance data.

  Analyze the provided attendance records to identify any unusual patterns or anomalies.
  Anomalies can include sudden drops in attendance, unusually high absenteeism rates for specific students, or any other deviations from expected attendance trends.
  Consider providing recommendations for addressing the identified anomalies.

  Return a list of strings, where each string describes an anomaly found in the data. Be concise and specific.

  Here is the attendance data in JSON format:
  {{attendanceData}}

  Use the provided threshold ({{threshold}} days) to determine the significance of absenteeism when identifying anomalies.
  `,
});

const detectAttendanceAnomaliesFlow = ai.defineFlow(
  {
    name: 'detectAttendanceAnomaliesFlow',
    inputSchema: DetectAttendanceAnomaliesInputSchema,
    outputSchema: DetectAttendanceAnomaliesOutputSchema,
  },
  async input => {
    const {output} = await detectAttendanceAnomaliesPrompt(input);
    return output!;
  }
);
