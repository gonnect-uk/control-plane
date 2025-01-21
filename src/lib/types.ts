// Navigation Types
export interface NavItem {
    id: string;
    label: string;
    icon: React.FC<{ className?: string }>;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    model?: string;
    timestamp: Date;
}

export interface ModelConfig {
    name: string;
    type: 'litellm';
    model_name: string;
    api_key: string;
    max_tokens: number;
    temperature: number;
}

export interface FileAttachment {
    id: string;
    name: string;
    size: number;
    type: string;
    content?: string;
}

export interface ControlPlaneConfig {
    base_url: string;
    max_retries: number;
    initial_retry_delay: number;
    models: ModelConfig[];
}

// Form Types
export interface RegistrationFormData {
    projectName: string;
    modelProvider: string;
}

export interface FormStep {
    id: string;
    label: string;
}

// Project Types
export interface Project {
    id: string;
    name: string;
    status: "healthy" | "error" | "warning";
    region: string;
    services: Array<{
        name: string;
        status: "healthy" | "error" | "warning";
    }>;
    models: Array<{
        name: string;
        provider: string;
        status: "active" | "inactive";
    }>;
    metrics: {
        requests: string;
        latency: string;
        cost: string;
    };
}

// AD Group Types
export interface ADGroup {
    id: string;
    name: string;
    description: string;
    members: number;
}

// API Key Types
export interface APIKey {
    id: string;
    name: string;
    prefix: string;
    createdBy: string;
    createdAt: string;
    expiresAt: string;
    lastUsed: string;
    status: 'active' | 'expired' | 'revoked';
    environment: 'production' | 'staging' | 'development';
    adGroup: {
        id: string;
        name: string;
        description: string;
    };
    permissions: string[];
}

export interface FileContent {
    text: string;
    type: string;
    name: string;
}

export interface FileAttachment {
    id: string;
    name: string;
    size: number;
    type: string;
    content?: FileContent;
}

export interface FileState extends FileAttachment {
    content?: FileContent & {
        metadata?: {
            chunks: number;
            totalPages: number;
        };
    };
    processed?: boolean;
}
