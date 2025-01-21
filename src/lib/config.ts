import {ControlPlaneConfig} from './types';

export const controlPlaneConfig: ControlPlaneConfig = {
    base_url: "https://litellm-61787942541.europe-west1.run.app/v1",
    max_retries: 5,
    initial_retry_delay: 1.0,
    models: [
        {
            name: "claude-3-sonnet",
            type: "litellm",
            model_name: "claude-3-5-sonnet-v2@20241022",
            api_key: "sk-1234",
            max_tokens: 4096,
            temperature: 0.7
        },
        {
            name: "gemini-1-5-pro",
            type: "litellm",
            model_name: "vertex-gemini-1.5-pro",
            api_key: "sk-1234",
            max_tokens: 500,
            temperature: 0.7
        },
        {
            name: "gemini-1-5-flash",
            type: "litellm",
            model_name: "vertex-gemini-1.5-flash",
            api_key: "sk-1234",
            max_tokens: 300,
            temperature: 0.5
        },
        {
            name: "gpt-4o-mini",
            type: "litellm",
            model_name: "gpt-4o-mini",
            api_key: "sk-1234",
            max_tokens: 600,
            temperature: 0.8
        }
    ]
};