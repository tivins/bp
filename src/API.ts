export class API {
    private static baseUrl = "https://api.example.com";
    private static token: string | null = null;

    static setBaseUrl(url: string) {
        this.baseUrl = url;
    }

    static setToken(token: string) {
        this.token = token;
        localStorage.setItem("token", token);
        return this;
    }

    static getToken(): string | null {
        if (!this.token) {
            this.token = localStorage.getItem("token");
        }
        return this.token;
    }

    private static async request(endpoint: string, method: "GET" | "POST", body?: any) {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };

        const token = this.getToken();
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method, headers, body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        return response.json();
    }

    static async get<T>(endpoint: string): Promise<T> {
        return this.request(endpoint, "GET");
    }

    static async post<T>(endpoint: string, data: any): Promise<T> {
        return this.request(endpoint, "POST", data);
    }
}
