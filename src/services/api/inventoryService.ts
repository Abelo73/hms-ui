import apiClient from './axios';

export type ItemType = 'DRUG' | 'SUPPLY' | 'EQUIPMENT' | 'FURNITURE' | 'LAB_REAGENT' | 'OFFICE_SUPPLY';

export interface Item {
  id: string;
  itemCode: string;
  itemName: string;
  itemType: ItemType;
  category: string;
  description: string;
  manufacturer: string;
  brand: string;
  unitOfMeasure: string;
  packSize: number;
  minimumOrderQuantity: number;
  reorderLevel: number;
  safetyStock: number;
  maximumStock: number;
  leadTimeDays: number;
  shelfLifeDays: number;
  storageConditions: string;
  isControlledSubstance: boolean;
  requiresPrescription: boolean;
  isColdChain: boolean;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateItemRequest {
  itemCode: string;
  itemName: string;
  itemType: ItemType;
  category: string;
  description: string;
  manufacturer: string;
  brand: string;
  unitOfMeasure: string;
  packSize: number;
}

export const inventoryService = {
  async getAllItems(params?: { category?: string; itemType?: ItemType; status?: string; page?: number; size?: number }): Promise<any> {
    const response = await apiClient.get('/inventory/items', { params });
    return response.data.data;
  },

  async getItemById(id: string): Promise<Item> {
    const response = await apiClient.get(`/inventory/items/${id}`);
    return response.data.data;
  },

  async createItem(request: CreateItemRequest): Promise<Item> {
    const response = await apiClient.post('/inventory/items', request);
    return response.data.data;
  },

  async searchItems(query: string, page = 0, size = 10): Promise<any> {
    const response = await apiClient.get('/inventory/items/search', { params: { query, page, size } });
    return response.data.data;
  },

  async getStockLevels(): Promise<any> {
    const response = await apiClient.get('/inventory/stock');
    return response.data.data;
  }
};
