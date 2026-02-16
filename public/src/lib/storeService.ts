import { API_BASE_URL } from "./api";

export interface Store {
  id: number;
  name: string;
  description?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  owner_id: number;
  owner_first_name?: string;
  owner_last_name?: string;
  owner_phone?: string;
  product_count?: number;
  total_orders?: number;
  created_at: string;
  approved_at?: string;
  rejection_reason?: string;
}

export interface StoreStats {
  total_stores: number;
  approved_stores: number;
  pending_stores: number;
  rejected_stores: number;
  suspended_stores: number;
  total_products: number;
  active_products: number;
  total_paid_orders: number;
}

class StoreService {
  private getAuthToken(): string | null {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  }

  private getHeaders(): HeadersInit {
    const token = this.getAuthToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  // Get all stores with pagination
  async getStores(
    page = 1,
    limit = 10,
  ): Promise<{ data: Store[]; pagination: any }> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/stores?page=${page}&limit=${limit}`,
        { headers: this.getHeaders() },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching stores:", error);
      throw error;
    }
  }

  // Get stores by status
  async getStoresByStatus(
    status: string,
    page = 1,
    limit = 10,
  ): Promise<{ data: Store[]; pagination: any }> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/stores/status/${status}?page=${page}&limit=${limit}`,
        { headers: this.getHeaders() },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching stores by status ${status}:`, error);
      throw error;
    }
  }

  // Search stores
  async searchStores(
    query: string,
    page = 1,
    limit = 10,
  ): Promise<{ data: Store[]; pagination: any }> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/stores/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
        { headers: this.getHeaders() },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error searching stores:", error);
      throw error;
    }
  }

  // Get store by ID
  async getStoreById(id: string | number): Promise<{ data: Store }> {
    try {
      const response = await fetch(`${API_BASE_URL}/stores/${id}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching store ${id}:`, error);
      throw error;
    }
  }

  // Get store statistics
  async getStoreStats(): Promise<{
    data: { summary: StoreStats; recent_stores: Store[]; top_stores: Store[] };
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/stores/stats`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching store stats:", error);
      throw error;
    }
  }

  // Get pending stores
  async getPendingStores(
    page = 1,
    limit = 10,
  ): Promise<{ data: Store[]; pagination: any }> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/stores/pending?page=${page}&limit=${limit}`,
        { headers: this.getHeaders() },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching pending stores:", error);
      throw error;
    }
  }

  // Update store status (Approve/Reject/Suspend)
  async updateStoreStatus(
    storeId: string | number,
    status: "APPROVED" | "REJECTED" | "SUSPENDED",
    rejectionReason?: string,
  ): Promise<any> {
    try {
      const body: any = { status };
      if (status === "REJECTED" && rejectionReason) {
        body.rejection_reason = rejectionReason;
      }

      const response = await fetch(
        `${API_BASE_URL}/admin/stores/${storeId}/status`,
        {
          method: "PUT",
          headers: this.getHeaders(),
          body: JSON.stringify(body),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error updating store status ${storeId}:`, error);
      throw error;
    }
  }

  // Create store
  async createStore(storeData: {
    name: string;
    description?: string;
  }): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/stores`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(storeData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating store:", error);
      throw error;
    }
  }

  // Update store
  async updateStore(
    storeId: string | number,
    storeData: { name?: string; description?: string },
  ): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/stores/${storeId}`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(storeData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error updating store ${storeId}:`, error);
      throw error;
    }
  }

  // Delete store
  async deleteStore(storeId: string | number): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/stores/${storeId}`, {
        method: "DELETE",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error deleting store ${storeId}:`, error);
      throw error;
    }
  }

  // Get stores by owner ID
  async getStoresByOwner(
    ownerId: string | number,
  ): Promise<{ data: Store[] }> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/stores/owner/${ownerId}`,
        { headers: this.getHeaders() },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching stores for owner ${ownerId}:`, error);
      throw error;
    }
  }
}

export const storeService = new StoreService();
