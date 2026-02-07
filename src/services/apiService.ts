import axios, { AxiosInstance, AxiosError } from "axios";
import { User, CreateUserDto, UpdateUserDto } from "@/types/user";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public originalError?: any,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Mock data for when API is not available
const INITIAL_MOCK_USERS: User[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    phoneNumber: "+1234567890",
    email: "john.doe@example.com",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    phoneNumber: "+1987654321",
    email: "jane.smith@example.com",
  },
  {
    id: "3",
    firstName: "Mike",
    lastName: "Johnson",
    phoneNumber: "+1555123456",
    email: "mike.johnson@example.com",
  },
];

class ApiService {
  private client: AxiosInstance;
  private useMockData: boolean;
  private mockUsers: User[];
  private nextId: number;

  constructor() {
    this.useMockData = USE_MOCK_DATA;
    this.mockUsers = [...INITIAL_MOCK_USERS];
    this.nextId = 4;

    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000, // 10 seconds
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      (error: AxiosError) => {
        // If API fails, switch to mock mode
        if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
          console.warn("API unavailable, switching to mock data mode");
          this.useMockData = true;
        }
        return this.handleError(error);
      },
    );
  }

  private handleError(error: AxiosError): Promise<never> {
    if (error.response) {
      // Server responded with error status
      const statusCode = error.response.status;
      const message = this.getErrorMessage(statusCode);
      throw new ApiError(statusCode, message, error);
    } else if (error.request) {
      // Request made but no response received - use mock data
      if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
        this.useMockData = true;
        throw new ApiError(
          0,
          "API unavailable. Using local data storage.",
          error,
        );
      }
      throw new ApiError(
        0,
        "Unable to connect to the server. Please check your connection.",
        error,
      );
    } else {
      // Error in request configuration
      throw new ApiError(0, "An unexpected error occurred", error);
    }
  }

  private getErrorMessage(statusCode: number): string {
    switch (statusCode) {
      case 400:
        return "Invalid request. Please check your input.";
      case 404:
        return "User not found.";
      case 409:
        return "User with this email already exists.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return "An error occurred. Please try again.";
    }
  }

  // Helper to simulate network delay for mock data
  private async simulateDelay(ms: number = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // CREATE
  async createUser(userData: CreateUserDto): Promise<User> {
    if (this.useMockData) {
      await this.simulateDelay();
      const newUser: User = {
        id: String(this.nextId++),
        ...userData,
      };
      this.mockUsers.push(newUser);
      return newUser;
    }

    try {
      const response = await this.client.post<User>("/users", userData);
      return response.data;
    } catch (error) {
      if (this.useMockData) {
        // Retry with mock data after network error
        const newUser: User = {
          id: String(this.nextId++),
          ...userData,
        };
        this.mockUsers.push(newUser);
        return newUser;
      }
      throw error;
    }
  }

  // READ
  async getAllUsers(): Promise<User[]> {
    if (this.useMockData) {
      await this.simulateDelay();
      return [...this.mockUsers];
    }

    try {
      const response = await this.client.get<User[]>("/users");
      return response.data;
    } catch (error) {
      if (this.useMockData) {
        // Return mock data after network error
        return [...this.mockUsers];
      }
      throw error;
    }
  }

  async getUserById(id: string): Promise<User> {
    if (this.useMockData) {
      await this.simulateDelay();
      const user = this.mockUsers.find(u => u.id === id);
      if (!user) {
        throw new ApiError(404, "User not found");
      }
      return { ...user };
    }

    try {
      const response = await this.client.get<User>(`/users/${id}`);
      return response.data;
    } catch (error) {
      if (this.useMockData) {
        const user = this.mockUsers.find(u => u.id === id);
        if (!user) {
          throw new ApiError(404, "User not found");
        }
        return { ...user };
      }
      throw error;
    }
  }

  // UPDATE
  async updateUser(id: string, userData: UpdateUserDto): Promise<User> {
    if (this.useMockData) {
      await this.simulateDelay();
      const index = this.mockUsers.findIndex(u => u.id === id);
      if (index === -1) {
        throw new ApiError(404, "User not found");
      }
      this.mockUsers[index] = { ...this.mockUsers[index], ...userData };
      return { ...this.mockUsers[index] };
    }

    try {
      const response = await this.client.patch<User>(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      if (this.useMockData) {
        const index = this.mockUsers.findIndex(u => u.id === id);
        if (index === -1) {
          throw new ApiError(404, "User not found");
        }
        this.mockUsers[index] = { ...this.mockUsers[index], ...userData };
        return { ...this.mockUsers[index] };
      }
      throw error;
    }
  }

  // DELETE
  async deleteUser(id: string): Promise<void> {
    if (this.useMockData) {
      await this.simulateDelay();
      const index = this.mockUsers.findIndex(u => u.id === id);
      if (index === -1) {
        throw new ApiError(404, "User not found");
      }
      this.mockUsers.splice(index, 1);
      return;
    }

    try {
      await this.client.delete(`/users/${id}`);
    } catch (error) {
      if (this.useMockData) {
        const index = this.mockUsers.findIndex(u => u.id === id);
        if (index === -1) {
          throw new ApiError(404, "User not found");
        }
        this.mockUsers.splice(index, 1);
        return;
      }
      throw error;
    }
  }

  // Get current mode
  isUsingMockData(): boolean {
    return this.useMockData;
  }

  // Set mock mode (toggle between online/offline)
  setMockMode(useMock: boolean): void {
    this.useMockData = useMock;
  }

  // Reset mock data
  resetMockData(): void {
    this.mockUsers = [...INITIAL_MOCK_USERS];
    this.nextId = 4;
  }
}

export const apiService = new ApiService();
