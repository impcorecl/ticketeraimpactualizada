import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface TicketType {
  id: string;
  name: string;
  description: string;
  price: number;
  people_per_ticket: number;
  total_stock: number;
  created_at: string;
}

export interface Ticket {
  id: string;
  ticket_type_id: string;
  status: 'valid' | 'used' | 'revoked';
  scanned_at: string | null;
  created_at: string;
}

export interface TicketStats {
  ticketType: TicketType;
  ticketsSold: number;
  ticketsAvailable: number;
  peopleExpected: number;
  ticketsUsed: number;
  peopleEntered: number;
}

export function useTicketTypes() {
  return useQuery({
    queryKey: ["ticket-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ticket_types")
        .select("*")
        .order("price", { ascending: true });
      
      if (error) throw error;
      return data as TicketType[];
    },
  });
}

export function useTickets() {
  return useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Ticket[];
    },
  });
}

export function useTicketStats() {
  const { data: ticketTypes, isLoading: typesLoading } = useTicketTypes();
  const { data: tickets, isLoading: ticketsLoading } = useTickets();

  const stats: TicketStats[] = ticketTypes?.map((type) => {
    const typeTickets = tickets?.filter((t) => t.ticket_type_id === type.id) || [];
    const usedTickets = typeTickets.filter((t) => t.status === 'used');
    
    return {
      ticketType: type,
      ticketsSold: typeTickets.length,
      ticketsAvailable: type.total_stock - typeTickets.length,
      peopleExpected: typeTickets.length * type.people_per_ticket,
      ticketsUsed: usedTickets.length,
      peopleEntered: usedTickets.length * type.people_per_ticket,
    };
  }) || [];

  const totals = stats.reduce(
    (acc, stat) => ({
      totalStock: acc.totalStock + stat.ticketType.total_stock,
      totalSold: acc.totalSold + stat.ticketsSold,
      totalAvailable: acc.totalAvailable + stat.ticketsAvailable,
      totalPeopleExpected: acc.totalPeopleExpected + stat.peopleExpected,
      totalUsed: acc.totalUsed + stat.ticketsUsed,
      totalPeopleEntered: acc.totalPeopleEntered + stat.peopleEntered,
    }),
    { totalStock: 0, totalSold: 0, totalAvailable: 0, totalPeopleExpected: 0, totalUsed: 0, totalPeopleEntered: 0 }
  );

  return {
    stats,
    totals,
    isLoading: typesLoading || ticketsLoading,
  };
}

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ticketTypeId: string) => {
      const { data, error } = await supabase
        .from("tickets")
        .insert({ ticket_type_id: ticketTypeId, status: 'valid' })
        .select()
        .single();
      
      if (error) throw error;
      return data as Ticket;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}

export interface ValidationResult {
  success: boolean;
  message: string;
  people_per_ticket?: number;
  description?: string;
  ticket_type?: string;
  scanned_at?: string;
}

export function useValidateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ticketUuid: string): Promise<ValidationResult> => {
      const { data, error } = await supabase.rpc("validate_ticket_scan", {
        ticket_uuid: ticketUuid,
      });
      
      if (error) throw error;
      return data as unknown as ValidationResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}

export function useRealtimeTickets() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("tickets-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tickets" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["tickets"] });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ticket_types" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["ticket-types"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
