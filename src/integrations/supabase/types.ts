export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string
          id: string
          notes: string | null
          provider_id: string | null
          provider_type: string
          service_type: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string
          id?: string
          notes?: string | null
          provider_id?: string | null
          provider_type: string
          service_type: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string
          id?: string
          notes?: string | null
          provider_id?: string | null
          provider_type?: string
          service_type?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      assemblies: {
        Row: {
          branch_id: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          selling_price: number
          unit_cost: number
          updated_at: string
          user_id: string
        }
        Insert: {
          branch_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          selling_price?: number
          unit_cost?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          branch_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          selling_price?: number
          unit_cost?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assemblies_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      assembly_components: {
        Row: {
          assembly_id: string
          created_at: string
          id: string
          product_id: string
          quantity: number
        }
        Insert: {
          assembly_id: string
          created_at?: string
          id?: string
          product_id: string
          quantity: number
        }
        Update: {
          assembly_id?: string
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "assembly_components_assembly_id_fkey"
            columns: ["assembly_id"]
            isOneToOne: false
            referencedRelation: "assemblies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assembly_components_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          branch_id: string
          category: string
          condition: string | null
          created_at: string
          current_value: number | null
          depreciation_rate: number | null
          disposal_date: string | null
          disposal_reason: string | null
          id: string
          last_maintenance_date: string | null
          maintenance_schedule: string | null
          name: string
          next_maintenance_date: string | null
          purchase_cost: number | null
          purchase_date: string | null
          serial_number: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          branch_id: string
          category: string
          condition?: string | null
          created_at?: string
          current_value?: number | null
          depreciation_rate?: number | null
          disposal_date?: string | null
          disposal_reason?: string | null
          id?: string
          last_maintenance_date?: string | null
          maintenance_schedule?: string | null
          name: string
          next_maintenance_date?: string | null
          purchase_cost?: number | null
          purchase_date?: string | null
          serial_number?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          branch_id?: string
          category?: string
          condition?: string | null
          created_at?: string
          current_value?: number | null
          depreciation_rate?: number | null
          disposal_date?: string | null
          disposal_reason?: string | null
          id?: string
          last_maintenance_date?: string | null
          maintenance_schedule?: string | null
          name?: string
          next_maintenance_date?: string | null
          purchase_cost?: number | null
          purchase_date?: string | null
          serial_number?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assets_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          category: string | null
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          new_values: Json | null
          old_values: Json | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          category?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          category?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      backup_jobs: {
        Row: {
          backup_type: string
          completed_at: string | null
          created_at: string
          error_message: string | null
          file_path: string | null
          file_size: number | null
          id: string
          status: string
          user_id: string
        }
        Insert: {
          backup_type: string
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          backup_type?: string
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      backup_schedules: {
        Row: {
          backup_type: string
          created_at: string
          frequency: string
          id: string
          is_active: boolean
          time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          backup_type: string
          created_at?: string
          frequency: string
          id?: string
          is_active?: boolean
          time: string
          updated_at?: string
          user_id: string
        }
        Update: {
          backup_type?: string
          created_at?: string
          frequency?: string
          id?: string
          is_active?: boolean
          time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      bank_accounts: {
        Row: {
          account_name: string
          account_number: string
          account_type: string
          balance: number
          bank_name: string
          branch_id: string
          created_at: string
          currency: string
          id: string
          is_active: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          account_name: string
          account_number: string
          account_type: string
          balance?: number
          bank_name: string
          branch_id: string
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          account_name?: string
          account_number?: string
          account_type?: string
          balance?: number
          bank_name?: string
          branch_id?: string
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_accounts_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_transactions: {
        Row: {
          amount: number
          balance_after: number
          bank_account_id: string
          created_at: string
          description: string | null
          id: string
          reconciled: boolean
          reference_number: string | null
          transaction_date: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          bank_account_id: string
          created_at?: string
          description?: string | null
          id?: string
          reconciled?: boolean
          reference_number?: string | null
          transaction_date: string
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          bank_account_id?: string
          created_at?: string
          description?: string | null
          id?: string
          reconciled?: boolean
          reference_number?: string | null
          transaction_date?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_transactions_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      bill_items: {
        Row: {
          batch_number: string | null
          bill_id: string
          created_at: string
          expiry_date: string | null
          id: string
          product_id: string | null
          product_name: string
          quantity: number
          received_quantity: number | null
          total_cost: number
          unit_cost: number
        }
        Insert: {
          batch_number?: string | null
          bill_id: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          product_id?: string | null
          product_name: string
          quantity: number
          received_quantity?: number | null
          total_cost: number
          unit_cost: number
        }
        Update: {
          batch_number?: string | null
          bill_id?: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          received_quantity?: number | null
          total_cost?: number
          unit_cost?: number
        }
        Relationships: [
          {
            foreignKeyName: "bill_items_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bill_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      bills: {
        Row: {
          bill_date: string
          bill_number: string
          branch_id: string
          created_at: string
          due_date: string | null
          id: string
          notes: string | null
          paid_amount: number
          purchase_order_id: string | null
          status: string
          subtotal: number
          supplier_id: string | null
          total_amount: number
          updated_at: string
          user_id: string
          vat_amount: number
          wht_amount: number
        }
        Insert: {
          bill_date: string
          bill_number: string
          branch_id: string
          created_at?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          paid_amount?: number
          purchase_order_id?: string | null
          status?: string
          subtotal?: number
          supplier_id?: string | null
          total_amount?: number
          updated_at?: string
          user_id: string
          vat_amount?: number
          wht_amount?: number
        }
        Update: {
          bill_date?: string
          bill_number?: string
          branch_id?: string
          created_at?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          paid_amount?: number
          purchase_order_id?: string | null
          status?: string
          subtotal?: number
          supplier_id?: string | null
          total_amount?: number
          updated_at?: string
          user_id?: string
          vat_amount?: number
          wht_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "bills_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bills_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bills_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      branches: {
        Row: {
          address: string | null
          code: string
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          manager_name: string | null
          name: string
          phone: string | null
          updated_at: string
          user_id: string
          vat_rate: number | null
          wht_rate: number | null
        }
        Insert: {
          address?: string | null
          code: string
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          manager_name?: string | null
          name: string
          phone?: string | null
          updated_at?: string
          user_id: string
          vat_rate?: number | null
          wht_rate?: number | null
        }
        Update: {
          address?: string | null
          code?: string
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          manager_name?: string | null
          name?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
          vat_rate?: number | null
          wht_rate?: number | null
        }
        Relationships: []
      }
      credit_accounts: {
        Row: {
          available_credit: number
          created_at: string
          credit_limit: number
          current_balance: number
          id: string
          interest_rate: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          available_credit?: number
          created_at?: string
          credit_limit?: number
          current_balance?: number
          id?: string
          interest_rate?: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          available_credit?: number
          created_at?: string
          credit_limit?: number
          current_balance?: number
          id?: string
          interest_rate?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      credit_requests: {
        Row: {
          business_name: string
          business_type: string
          created_at: string
          credit_purpose: string
          documents: string[] | null
          id: string
          monthly_revenue: number
          requested_amount: number
          review_notes: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
          user_id: string
          years_in_business: number
        }
        Insert: {
          business_name: string
          business_type: string
          created_at?: string
          credit_purpose: string
          documents?: string[] | null
          id?: string
          monthly_revenue: number
          requested_amount: number
          review_notes?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id: string
          years_in_business: number
        }
        Update: {
          business_name?: string
          business_type?: string
          created_at?: string
          credit_purpose?: string
          documents?: string[] | null
          id?: string
          monthly_revenue?: number
          requested_amount?: number
          review_notes?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          years_in_business?: number
        }
        Relationships: []
      }
      customer_analytics: {
        Row: {
          average_order_value: number
          created_at: string
          customer_id: string
          customer_lifetime_value: number
          favorite_category: string | null
          first_order_date: string | null
          id: string
          last_activity_date: string | null
          last_order_date: string | null
          total_orders: number
          total_spent: number
          updated_at: string
          user_id: string
        }
        Insert: {
          average_order_value?: number
          created_at?: string
          customer_id: string
          customer_lifetime_value?: number
          favorite_category?: string | null
          first_order_date?: string | null
          id?: string
          last_activity_date?: string | null
          last_order_date?: string | null
          total_orders?: number
          total_spent?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          average_order_value?: number
          created_at?: string
          customer_id?: string
          customer_lifetime_value?: number
          favorite_category?: string | null
          first_order_date?: string | null
          id?: string
          last_activity_date?: string | null
          last_order_date?: string | null
          total_orders?: number
          total_spent?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      generated_reports: {
        Row: {
          created_at: string
          file_format: string
          file_path: string
          id: string
          parameters: Json | null
          status: string
          template_id: string
        }
        Insert: {
          created_at?: string
          file_format: string
          file_path: string
          id?: string
          parameters?: Json | null
          status: string
          template_id: string
        }
        Update: {
          created_at?: string
          file_format?: string
          file_path?: string
          id?: string
          parameters?: Json | null
          status?: string
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_reports_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "report_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      health_records: {
        Row: {
          attachments: Json | null
          created_at: string
          date_recorded: string
          description: string | null
          id: string
          metadata: Json | null
          provider_name: string | null
          record_type: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          created_at?: string
          date_recorded: string
          description?: string | null
          id?: string
          metadata?: Json | null
          provider_name?: string | null
          record_type: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attachments?: Json | null
          created_at?: string
          date_recorded?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          provider_name?: string | null
          record_type?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      inventory_adjustments: {
        Row: {
          adjustment_type: string
          created_at: string
          id: string
          product_id: string
          quantity: number
          reason: string | null
          user_id: string
        }
        Insert: {
          adjustment_type: string
          created_at?: string
          id?: string
          product_id: string
          quantity: number
          reason?: string | null
          user_id: string
        }
        Update: {
          adjustment_type?: string
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          reason?: string | null
          user_id?: string
        }
        Relationships: []
      }
      inventory_forecasts: {
        Row: {
          actual: number | null
          created_at: string
          forecast_date: string
          forecasted_demand: number
          id: string
          product_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          actual?: number | null
          created_at?: string
          forecast_date: string
          forecasted_demand: number
          id?: string
          product_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          actual?: number | null
          created_at?: string
          forecast_date?: string
          forecasted_demand?: number
          id?: string
          product_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      inventory_movements: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          movement_type: string
          product_id: string
          quantity: number
          reason: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          movement_type: string
          product_id: string
          quantity: number
          reason?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          movement_type?: string
          product_id?: string
          quantity?: number
          reason?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          created_at: string
          id: string
          invoice_id: string
          product_id: string | null
          product_name: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          invoice_id: string
          product_id?: string | null
          product_name: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          invoice_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          branch_id: string
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          discount_amount: number
          due_date: string | null
          id: string
          invoice_date: string
          invoice_number: string
          is_recurring: boolean
          next_invoice_date: string | null
          notes: string | null
          paid_amount: number
          recurring_frequency: string | null
          status: string
          subtotal: number
          total_amount: number
          updated_at: string
          user_id: string
          vat_amount: number
        }
        Insert: {
          branch_id: string
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          discount_amount?: number
          due_date?: string | null
          id?: string
          invoice_date: string
          invoice_number: string
          is_recurring?: boolean
          next_invoice_date?: string | null
          notes?: string | null
          paid_amount?: number
          recurring_frequency?: string | null
          status?: string
          subtotal?: number
          total_amount?: number
          updated_at?: string
          user_id: string
          vat_amount?: number
        }
        Update: {
          branch_id?: string
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          discount_amount?: number
          due_date?: string | null
          id?: string
          invoice_date?: string
          invoice_number?: string
          is_recurring?: boolean
          next_invoice_date?: string | null
          notes?: string | null
          paid_amount?: number
          recurring_frequency?: string | null
          status?: string
          subtotal?: number
          total_amount?: number
          updated_at?: string
          user_id?: string
          vat_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      item_types: {
        Row: {
          created_at: string
          has_cost: boolean
          id: string
          is_service: boolean
          name: string
        }
        Insert: {
          created_at?: string
          has_cost?: boolean
          id?: string
          is_service?: boolean
          name: string
        }
        Update: {
          created_at?: string
          has_cost?: boolean
          id?: string
          is_service?: boolean
          name?: string
        }
        Relationships: []
      }
      lab_order_items: {
        Row: {
          created_at: string
          id: string
          lab_order_id: string
          lab_test_id: string
          result: string | null
          result_date: string | null
          status: string
          test_name: string
          test_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          lab_order_id: string
          lab_test_id: string
          result?: string | null
          result_date?: string | null
          status?: string
          test_name: string
          test_price: number
        }
        Update: {
          created_at?: string
          id?: string
          lab_order_id?: string
          lab_test_id?: string
          result?: string | null
          result_date?: string | null
          status?: string
          test_name?: string
          test_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "lab_order_items_lab_order_id_fkey"
            columns: ["lab_order_id"]
            isOneToOne: false
            referencedRelation: "lab_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_order_items_lab_test_id_fkey"
            columns: ["lab_test_id"]
            isOneToOne: false
            referencedRelation: "lab_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_orders: {
        Row: {
          created_at: string
          doctor_name: string
          doctor_phone: string | null
          id: string
          lab_id: string | null
          order_date: string
          patient_age: number | null
          patient_gender: string | null
          patient_name: string
          patient_phone: string | null
          payment_status: string
          pharmacy_id: string | null
          sample_collection_date: string | null
          sample_collection_time: string | null
          special_instructions: string | null
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          doctor_name: string
          doctor_phone?: string | null
          id?: string
          lab_id?: string | null
          order_date?: string
          patient_age?: number | null
          patient_gender?: string | null
          patient_name: string
          patient_phone?: string | null
          payment_status?: string
          pharmacy_id?: string | null
          sample_collection_date?: string | null
          sample_collection_time?: string | null
          special_instructions?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          doctor_name?: string
          doctor_phone?: string | null
          id?: string
          lab_id?: string | null
          order_date?: string
          patient_age?: number | null
          patient_gender?: string | null
          patient_name?: string
          patient_phone?: string | null
          payment_status?: string
          pharmacy_id?: string | null
          sample_collection_date?: string | null
          sample_collection_time?: string | null
          special_instructions?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      lab_tests: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          lab_id: string | null
          normal_range: string | null
          preparation_instructions: string | null
          price: number
          sample_type: string
          test_code: string
          test_name: string
          turnaround_time_hours: number
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          lab_id?: string | null
          normal_range?: string | null
          preparation_instructions?: string | null
          price: number
          sample_type: string
          test_code: string
          test_name: string
          turnaround_time_hours?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          lab_id?: string | null
          normal_range?: string | null
          preparation_instructions?: string | null
          price?: number
          sample_type?: string
          test_code?: string
          test_name?: string
          turnaround_time_hours?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_read: boolean
          message: string
          metadata: Json | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean
          message: string
          metadata?: Json | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean
          message?: string
          metadata?: Json | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          changed_at: string
          changed_by: string | null
          id: string
          notes: string | null
          order_id: string
          status: string
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          notes?: string | null
          order_id: string
          status: string
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          notes?: string | null
          order_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          business_id: string | null
          created_at: string
          id: string
          items: Json
          order_number: string
          payment_status: string
          pharmacy_id: string | null
          profile_id: string | null
          shipping_address: Json | null
          status: string
          total_amount: number
          updated_at: string
          user_id: string
          wholesaler_id: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string
          id?: string
          items: Json
          order_number: string
          payment_status?: string
          pharmacy_id?: string | null
          profile_id?: string | null
          shipping_address?: Json | null
          status?: string
          total_amount: number
          updated_at?: string
          user_id: string
          wholesaler_id?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string
          id?: string
          items?: Json
          order_number?: string
          payment_status?: string
          pharmacy_id?: string | null
          profile_id?: string | null
          shipping_address?: Json | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
          wholesaler_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          order_id: string
          payment_date: string | null
          payment_method: string
          profile_id: string | null
          status: string
          transaction_id: string | null
          transaction_reference: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          order_id: string
          payment_date?: string | null
          payment_method: string
          profile_id?: string | null
          status?: string
          transaction_id?: string | null
          transaction_reference?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          order_id?: string
          payment_date?: string | null
          payment_method?: string
          profile_id?: string | null
          status?: string
          transaction_id?: string | null
          transaction_reference?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_sale_items: {
        Row: {
          created_at: string
          id: string
          pos_sale_id: string
          product_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          pos_sale_id: string
          product_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          pos_sale_id?: string
          product_id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "pos_sale_items_pos_sale_id_fkey"
            columns: ["pos_sale_id"]
            isOneToOne: false
            referencedRelation: "pos_sales"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_sales: {
        Row: {
          created_at: string
          customer_name: string | null
          customer_phone: string | null
          id: string
          payment_method: string
          sale_date: string
          total_amount: number
          user_id: string
        }
        Insert: {
          created_at?: string
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          payment_method: string
          sale_date?: string
          total_amount: number
          user_id: string
        }
        Update: {
          created_at?: string
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          payment_method?: string
          sale_date?: string
          total_amount?: number
          user_id?: string
        }
        Relationships: []
      }
      prescription_items: {
        Row: {
          created_at: string
          dispensed_quantity: number | null
          dosage: string
          duration: string
          frequency: string
          id: string
          medication_name: string
          prescription_id: string
          product_id: string | null
          quantity: number
          special_instructions: string | null
          unit: string
        }
        Insert: {
          created_at?: string
          dispensed_quantity?: number | null
          dosage: string
          duration: string
          frequency: string
          id?: string
          medication_name: string
          prescription_id: string
          product_id?: string | null
          quantity: number
          special_instructions?: string | null
          unit?: string
        }
        Update: {
          created_at?: string
          dispensed_quantity?: number | null
          dosage?: string
          duration?: string
          frequency?: string
          id?: string
          medication_name?: string
          prescription_id?: string
          product_id?: string | null
          quantity?: number
          special_instructions?: string | null
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "prescription_items_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          created_at: string
          diagnosis: string | null
          dispensed_at: string | null
          dispensed_by: string | null
          doctor_license: string | null
          doctor_name: string
          id: string
          instructions: string | null
          patient_name: string
          patient_phone: string | null
          pharmacy_id: string | null
          prescription_date: string
          status: string
          updated_at: string
          user_id: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          diagnosis?: string | null
          dispensed_at?: string | null
          dispensed_by?: string | null
          doctor_license?: string | null
          doctor_name: string
          id?: string
          instructions?: string | null
          patient_name: string
          patient_phone?: string | null
          pharmacy_id?: string | null
          prescription_date?: string
          status?: string
          updated_at?: string
          user_id: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          diagnosis?: string | null
          dispensed_at?: string | null
          dispensed_by?: string | null
          doctor_license?: string | null
          doctor_name?: string
          id?: string
          instructions?: string | null
          patient_name?: string
          patient_phone?: string | null
          pharmacy_id?: string | null
          prescription_date?: string
          status?: string
          updated_at?: string
          user_id?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      product_analytics: {
        Row: {
          created_at: string
          date: string
          id: string
          pharmacy_id: string | null
          product_id: string
          profit_margin: number
          quantity_sold: number
          revenue: number
          stock_turnover_rate: number
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          pharmacy_id?: string | null
          product_id: string
          profit_margin?: number
          quantity_sold?: number
          revenue?: number
          stock_turnover_rate?: number
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          pharmacy_id?: string | null
          product_id?: string
          profit_margin?: number
          quantity_sold?: number
          revenue?: number
          stock_turnover_rate?: number
          user_id?: string
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          parent_category_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parent_category_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parent_category_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          batch_number: string | null
          branch_id: string | null
          buy_price: number
          category: string
          created_at: string | null
          description: string | null
          dosage_form: string | null
          expiry_date: string | null
          id: string
          image_url: string | null
          is_public_product: boolean | null
          is_retail_product: boolean | null
          is_wholesale_product: boolean | null
          item_type_id: string | null
          last_ordered: string | null
          manufacturer: string | null
          max_stock: number | null
          min_stock_level: number
          name: string
          pack_size: string | null
          pharmacy_id: string | null
          requires_prescription: boolean | null
          sell_price: number
          sku: string | null
          status: string
          stock: number
          strength: string | null
          supplier: string | null
          updated_at: string | null
          user_id: string | null
          wholesaler_id: string | null
        }
        Insert: {
          batch_number?: string | null
          branch_id?: string | null
          buy_price: number
          category: string
          created_at?: string | null
          description?: string | null
          dosage_form?: string | null
          expiry_date?: string | null
          id?: string
          image_url?: string | null
          is_public_product?: boolean | null
          is_retail_product?: boolean | null
          is_wholesale_product?: boolean | null
          item_type_id?: string | null
          last_ordered?: string | null
          manufacturer?: string | null
          max_stock?: number | null
          min_stock_level?: number
          name: string
          pack_size?: string | null
          pharmacy_id?: string | null
          requires_prescription?: boolean | null
          sell_price: number
          sku?: string | null
          status?: string
          stock?: number
          strength?: string | null
          supplier?: string | null
          updated_at?: string | null
          user_id?: string | null
          wholesaler_id?: string | null
        }
        Update: {
          batch_number?: string | null
          branch_id?: string | null
          buy_price?: number
          category?: string
          created_at?: string | null
          description?: string | null
          dosage_form?: string | null
          expiry_date?: string | null
          id?: string
          image_url?: string | null
          is_public_product?: boolean | null
          is_retail_product?: boolean | null
          is_wholesale_product?: boolean | null
          item_type_id?: string | null
          last_ordered?: string | null
          manufacturer?: string | null
          max_stock?: number | null
          min_stock_level?: number
          name?: string
          pack_size?: string | null
          pharmacy_id?: string | null
          requires_prescription?: boolean | null
          sell_price?: number
          sku?: string | null
          status?: string
          stock?: number
          strength?: string | null
          supplier?: string | null
          updated_at?: string | null
          user_id?: string | null
          wholesaler_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_item_type_id_fkey"
            columns: ["item_type_id"]
            isOneToOne: false
            referencedRelation: "item_types"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          business_license: string | null
          business_name: string | null
          city: string | null
          contact_person: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          emergency_contact: string | null
          id: string
          is_approved: boolean | null
          is_pharmacy: boolean | null
          lab_license: string | null
          lab_name: string | null
          latitude: number | null
          license_number: string | null
          longitude: number | null
          name: string
          operating_hours: string | null
          pharmacist_name: string | null
          pharmacy_name: string | null
          pharmacy_rating: number | null
          phone: string | null
          region: string | null
          role: Database["public"]["Enums"]["user_role"]
          specializations: string[] | null
          tax_id: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          business_license?: string | null
          business_name?: string | null
          city?: string | null
          contact_person?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          emergency_contact?: string | null
          id: string
          is_approved?: boolean | null
          is_pharmacy?: boolean | null
          lab_license?: string | null
          lab_name?: string | null
          latitude?: number | null
          license_number?: string | null
          longitude?: number | null
          name: string
          operating_hours?: string | null
          pharmacist_name?: string | null
          pharmacy_name?: string | null
          pharmacy_rating?: number | null
          phone?: string | null
          region?: string | null
          role: Database["public"]["Enums"]["user_role"]
          specializations?: string[] | null
          tax_id?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          business_license?: string | null
          business_name?: string | null
          city?: string | null
          contact_person?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          emergency_contact?: string | null
          id?: string
          is_approved?: boolean | null
          is_pharmacy?: boolean | null
          lab_license?: string | null
          lab_name?: string | null
          latitude?: number | null
          license_number?: string | null
          longitude?: number | null
          name?: string
          operating_hours?: string | null
          pharmacist_name?: string | null
          pharmacy_name?: string | null
          pharmacy_rating?: number | null
          phone?: string | null
          region?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          specializations?: string[] | null
          tax_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      purchase_order_items: {
        Row: {
          created_at: string
          id: string
          product_id: string | null
          product_name: string
          purchase_order_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          product_id?: string | null
          product_name: string
          purchase_order_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string | null
          product_name?: string
          purchase_order_id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_items_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          branch_id: string | null
          created_at: string
          expected_delivery: string | null
          id: string
          notes: string | null
          order_date: string
          po_number: string
          status: string
          supplier_id: string | null
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          branch_id?: string | null
          created_at?: string
          expected_delivery?: string | null
          id?: string
          notes?: string | null
          order_date: string
          po_number: string
          status?: string
          supplier_id?: string | null
          total_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          branch_id?: string | null
          created_at?: string
          expected_delivery?: string | null
          id?: string
          notes?: string | null
          order_date?: string
          po_number?: string
          status?: string
          supplier_id?: string | null
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      report_templates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          query_config: Json
          report_type: string
          schedule: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          query_config: Json
          report_type: string
          schedule?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          query_config?: Json
          report_type?: string
          schedule?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sales_analytics: {
        Row: {
          average_order_value: number
          created_at: string
          date: string
          id: string
          lab_orders: number
          new_customers: number
          prescription_orders: number
          top_selling_category: string | null
          total_items_sold: number
          total_orders: number
          total_sales: number
          updated_at: string
          user_id: string
        }
        Insert: {
          average_order_value?: number
          created_at?: string
          date: string
          id?: string
          lab_orders?: number
          new_customers?: number
          prescription_orders?: number
          top_selling_category?: string | null
          total_items_sold?: number
          total_orders?: number
          total_sales?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          average_order_value?: number
          created_at?: string
          date?: string
          id?: string
          lab_orders?: number
          new_customers?: number
          prescription_orders?: number
          top_selling_category?: string | null
          total_items_sold?: number
          total_orders?: number
          total_sales?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      stock_adjustments: {
        Row: {
          adjustment_type: string
          approved_at: string | null
          approved_by: string | null
          branch_id: string
          created_at: string
          created_by: string
          id: string
          product_id: string
          quantity: number
          reason: string | null
          reference_number: string | null
          status: string
          transfer_to_branch_id: string | null
          user_id: string
        }
        Insert: {
          adjustment_type: string
          approved_at?: string | null
          approved_by?: string | null
          branch_id: string
          created_at?: string
          created_by: string
          id?: string
          product_id: string
          quantity: number
          reason?: string | null
          reference_number?: string | null
          status?: string
          transfer_to_branch_id?: string | null
          user_id: string
        }
        Update: {
          adjustment_type?: string
          approved_at?: string | null
          approved_by?: string | null
          branch_id?: string
          created_at?: string
          created_by?: string
          id?: string
          product_id?: string
          quantity?: number
          reason?: string | null
          reference_number?: string | null
          status?: string
          transfer_to_branch_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_adjustments_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_adjustments_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_adjustments_transfer_to_branch_id_fkey"
            columns: ["transfer_to_branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          name: string
          payment_terms: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          payment_terms?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          payment_terms?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      system_alerts: {
        Row: {
          category: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          message: string
          severity: string
          target_roles: string[] | null
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          message: string
          severity: string
          target_roles?: string[] | null
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          message?: string
          severity?: string
          target_roles?: string[] | null
          title?: string
        }
        Relationships: []
      }
      system_metrics: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          metric_name: string
          metric_unit: string | null
          metric_value: number
          recorded_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_name: string
          metric_unit?: string | null
          metric_value: number
          recorded_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_name?: string
          metric_unit?: string | null
          metric_value?: number
          recorded_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          business_id: string | null
          created_at: string
          currency: string
          description: string | null
          id: string
          payment_id: string | null
          profile_id: string | null
          reference: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          business_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          payment_id?: string | null
          profile_id?: string | null
          reference?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          business_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          payment_id?: string | null
          profile_id?: string | null
          reference?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          created_at: string
          device_info: Json | null
          id: string
          ip_address: unknown | null
          is_active: boolean
          location: Json | null
          session_end: string | null
          session_start: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device_info?: Json | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean
          location?: Json | null
          session_end?: string | null
          session_start?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          device_info?: Json | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean
          location?: Json | null
          session_end?: string | null
          session_start?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          business_settings: Json | null
          created_at: string
          currency: string
          id: string
          language: string
          notifications: Json
          privacy: Json
          theme: string
          timezone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          business_settings?: Json | null
          created_at?: string
          currency?: string
          id?: string
          language?: string
          notifications?: Json
          privacy?: Json
          theme?: string
          timezone?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          business_settings?: Json | null
          created_at?: string
          currency?: string
          id?: string
          language?: string
          notifications?: Json
          privacy?: Json
          theme?: string
          timezone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wholesale_credit_accounts: {
        Row: {
          created_at: string
          credit_limit: number
          current_balance: number
          id: string
          retailer_id: string
          status: string
          updated_at: string
          wholesaler_user_id: string
        }
        Insert: {
          created_at?: string
          credit_limit?: number
          current_balance?: number
          id?: string
          retailer_id: string
          status?: string
          updated_at?: string
          wholesaler_user_id: string
        }
        Update: {
          created_at?: string
          credit_limit?: number
          current_balance?: number
          id?: string
          retailer_id?: string
          status?: string
          updated_at?: string
          wholesaler_user_id?: string
        }
        Relationships: []
      }
      wholesale_credit_transactions: {
        Row: {
          amount: number
          created_at: string
          credit_account_id: string
          id: string
          reference: string | null
          transaction_date: string
          transaction_type: string
        }
        Insert: {
          amount: number
          created_at?: string
          credit_account_id: string
          id?: string
          reference?: string | null
          transaction_date?: string
          transaction_type: string
        }
        Update: {
          amount?: number
          created_at?: string
          credit_account_id?: string
          id?: string
          reference?: string | null
          transaction_date?: string
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "wholesale_credit_transactions_credit_account_id_fkey"
            columns: ["credit_account_id"]
            isOneToOne: false
            referencedRelation: "wholesale_credit_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_orders_by_retailer: {
        Args: { retailer_uuid: string }
        Returns: {
          business_id: string | null
          created_at: string
          id: string
          items: Json
          order_number: string
          payment_status: string
          pharmacy_id: string | null
          profile_id: string | null
          shipping_address: Json | null
          status: string
          total_amount: number
          updated_at: string
          user_id: string
          wholesaler_id: string | null
        }[]
      }
      get_orders_by_wholesaler: {
        Args: { wholesaler_uuid: string }
        Returns: {
          business_id: string | null
          created_at: string
          id: string
          items: Json
          order_number: string
          payment_status: string
          pharmacy_id: string | null
          profile_id: string | null
          shipping_address: Json | null
          status: string
          total_amount: number
          updated_at: string
          user_id: string
          wholesaler_id: string | null
        }[]
      }
      get_product_analytics_by_pharmacy: {
        Args: { pharmacy_uuid: string }
        Returns: {
          created_at: string
          date: string
          id: string
          pharmacy_id: string | null
          product_id: string
          profit_margin: number
          quantity_sold: number
          revenue: number
          stock_turnover_rate: number
          user_id: string
        }[]
      }
      get_products_by_retailer: {
        Args: { retailer_uuid: string }
        Returns: {
          batch_number: string | null
          branch_id: string | null
          buy_price: number
          category: string
          created_at: string | null
          description: string | null
          dosage_form: string | null
          expiry_date: string | null
          id: string
          image_url: string | null
          is_public_product: boolean | null
          is_retail_product: boolean | null
          is_wholesale_product: boolean | null
          item_type_id: string | null
          last_ordered: string | null
          manufacturer: string | null
          max_stock: number | null
          min_stock_level: number
          name: string
          pack_size: string | null
          pharmacy_id: string | null
          requires_prescription: boolean | null
          sell_price: number
          sku: string | null
          status: string
          stock: number
          strength: string | null
          supplier: string | null
          updated_at: string | null
          user_id: string | null
          wholesaler_id: string | null
        }[]
      }
      get_products_by_wholesaler: {
        Args: { wholesaler_uuid: string }
        Returns: {
          batch_number: string | null
          branch_id: string | null
          buy_price: number
          category: string
          created_at: string | null
          description: string | null
          dosage_form: string | null
          expiry_date: string | null
          id: string
          image_url: string | null
          is_public_product: boolean | null
          is_retail_product: boolean | null
          is_wholesale_product: boolean | null
          item_type_id: string | null
          last_ordered: string | null
          manufacturer: string | null
          max_stock: number | null
          min_stock_level: number
          name: string
          pack_size: string | null
          pharmacy_id: string | null
          requires_prescription: boolean | null
          sell_price: number
          sku: string | null
          status: string
          stock: number
          strength: string | null
          supplier: string | null
          updated_at: string | null
          user_id: string | null
          wholesaler_id: string | null
        }[]
      }
      insert_product_with_user: {
        Args: {
          p_name: string
          p_description: string
          p_price: number
          p_category: string
          p_stock: number
          p_min_stock_level: number
          p_user_id: string
          p_wholesaler_id?: string
          p_pharmacy_id?: string
        }
        Returns: string
      }
    }
    Enums: {
      user_role: "individual" | "retail" | "wholesale" | "lab" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["individual", "retail", "wholesale", "lab", "admin"],
    },
  },
} as const
