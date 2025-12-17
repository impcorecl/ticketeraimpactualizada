import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

// Interfaces
export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  created_at: string;
}

export interface Ambassador {
  id: string;
  name: string;
  email: string;
  phone?: string;
  commission_rate: number;
  is_active: boolean;
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  created_at: string;
}

export interface SaleRecord {
  ticket_id: string;
  ticket_type_name: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  ambassador_name?: string;
  sale_price: number;
  commission_amount: number;
  payment_method: string;
  ticket_status: string;
  scanned_at?: string;
  created_at: string;
}

export interface CreateSaleRequest {
  ticket_type_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  ambassador_id?: string;
  payment_method?: string;
  notes?: string;
}

// Auth hooks
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('impcore_user');
    console.log('🔍 Checking stored user:', storedUser);
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      console.log('✅ User loaded from storage:', userData);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    console.log('🔍 Intentando login con:', { username, supabaseUrl: supabase.supabaseUrl });
    
    try {
      const { data, error } = await supabase.rpc('authenticate_user', {
        username_input: username,
        password_input: password
      });

      console.log('📝 Respuesta de Supabase:', { data, error });

      if (error) {
        console.error('❌ Error de Supabase:', error);
        throw error;
      }

      if (data && data.success) {
        const userData = {
          id: data.user_id,
          email: data.email,
          username: data.username,
          role: data.role,
          created_at: data.created_at
        };
        setUser(userData);
        localStorage.setItem('impcore_user', JSON.stringify(userData));
        console.log('✅ Login exitoso:', userData);
        return userData;
      } else {
        console.log('❌ Login fallido:', data);
        throw new Error(data?.message || 'Credenciales inválidas');
      }
    } catch (err) {
      console.error('💥 Error completo:', err);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('impcore_user');
  };

  const isAuthenticated = !!user;
  console.log('🔐 Auth status:', { user: !!user, isAuthenticated, isLoading });

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout
  };
}

// Ambassadors hooks
export function useAmbassadors() {
  return useQuery({
    queryKey: ["ambassadors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ambassadors")
        .select("*")
        .order("name", { ascending: true });
      
      if (error) throw error;
      return data as Ambassador[];
    },
  });
}

export function useCreateAmbassador() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ambassador: Omit<Ambassador, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from("ambassadors")
        .insert(ambassador)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ambassadors"] });
    },
  });
}

export function useUpdateAmbassador() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Ambassador> & { id: string }) => {
      const { data, error } = await supabase
        .from("ambassadors")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ambassadors"] });
    },
  });
}

// Customers hooks
export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Customer[];
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Customer> & { id: string }) => {
      const { data, error } = await supabase
        .from("customers")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}

// Sales hooks
export function useCreateCompleteSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (saleData: CreateSaleRequest) => {
      const { data, error } = await supabase.rpc("create_complete_sale", {
        p_ticket_type_id: saleData.ticket_type_id,
        p_customer_name: saleData.customer_name,
        p_customer_email: saleData.customer_email,
        p_customer_phone: saleData.customer_phone || null,
        p_ambassador_id: saleData.ambassador_id || null,
        p_payment_method: saleData.payment_method || 'cash',
        p_notes: saleData.notes || null
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["sales-report"] });
    },
  });
}

export function useSalesReport() {
  return useQuery({
    queryKey: ["sales-report"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_sales_report");
      
      if (error) throw error;
      return data as SaleRecord[];
    },
  });
}

// Commission calculations
export function useCommissionSummary() {
  const { data: salesReport } = useSalesReport();

  const commissionsData = salesReport?.reduce((acc, sale) => {
    if (sale.ambassador_name && sale.commission_amount > 0) {
      if (!acc[sale.ambassador_name]) {
        acc[sale.ambassador_name] = {
          ambassador_name: sale.ambassador_name,
          total_sales: 0,
          total_commission: 0,
          tickets_sold: 0
        };
      }
      acc[sale.ambassador_name].total_sales += sale.sale_price;
      acc[sale.ambassador_name].total_commission += sale.commission_amount;
      acc[sale.ambassador_name].tickets_sold += 1;
    }
    return acc;
  }, {} as Record<string, any>);

  return {
    commissionsData: commissionsData ? Object.values(commissionsData) : [],
    isLoading: !salesReport
  };
}