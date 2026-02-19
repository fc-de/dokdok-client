import { useQuery } from '@tanstack/react-query'

import { getMyMeetingTabCounts } from '../meetings.api'
import { myMeetingQueryKeys } from './myMeetingQueryKeys'

export function useMyMeetingTabCounts() {
  return useQuery({
    queryKey: myMeetingQueryKeys.tabCounts(),
    queryFn: getMyMeetingTabCounts,
  })
}
