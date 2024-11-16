import { useEffect } from 'react'
import { supabaseClient } from '@/lib/supabase-client'
import { useQueryClient } from '@tanstack/react-query'

type SupabaseSubscriptionProps = {
  roomId: string
  table: 'rooms' | 'pairs' | 'players'
  event?: 'INSERT' | 'UPDATE' | 'DELETE'
}

export function useSupabaseSubscription({ roomId, table, event = 'UPDATE' }: SupabaseSubscriptionProps) {
  const queryClient = useQueryClient()


  useEffect(() => {
    const channel = supabaseClient
      .channel(`${table}_changes_${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table,
          filter: table === 'rooms' 
            ? `id=eq.${roomId}`
            : `room_id=eq.${roomId}`,
        },
        async (payload) => {
          console.log(`${table} changed:`, payload)
          
          await queryClient.invalidateQueries({
            queryKey: ['room', roomId],
          })
        }
      )
      .subscribe()

    return () => {
      supabaseClient.removeChannel(channel)
    }
  }, [roomId, table, event, queryClient])
}
