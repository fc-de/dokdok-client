export const retrospectiveQueryKeys = {
  all: ['retrospectives'] as const,

  summaries: () => [...retrospectiveQueryKeys.all, 'summary'] as const,
  summary: (meetingId: number) => [...retrospectiveQueryKeys.summaries(), meetingId] as const,
}
