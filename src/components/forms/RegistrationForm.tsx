import React, {useState, useEffect} from 'react';

interface FormStep {
    id: string;
    label: string;
}

interface ModelOption {
    id: string;
    name: string;
    description: string;
}

interface BasicInfo {
    businessImpact: string;
    dataHandling: string;
    userAccess: string;
    expectedUsage: string;
    integrations: string[];
}

interface ModelConfig {
    projectSetup: string;
    modelAccessUrl: string;
    modelName: string;
    apiKey: string;
    monitoringUrl: string;
}

interface SecurityConfig {
    dataRetention: string;
    accessControls: string[];
    encryptionLevel: string;
    backupFrequency: string;
}

interface FormData {
    projectDescription: string;
    referenceName: string;
    aiProvider: string;
    businessFunction: string;
    valueStream: string;
    developmentStatus: 'exploration' | 'preparing' | 'pilot' | 'operation' | 'other';
    regions: string[];
    countries: string;
    complianceChecks: string[];
    documentation: string;
    contexts: string[];
    features: string[];
    basicInfo: BasicInfo;
    modelConfig: ModelConfig;
    securityConfig: SecurityConfig;
}

const AVAILABLE_MODELS: ModelOption[] = [
    {
        id: 'gpt-4',
        name: 'GPT-4',
        description: 'Advanced language model for complex tasks'
    },
    {
        id: 'gpt-3.5',
        name: 'GPT-3.5',
        description: 'Balanced model for general use'
    },
    {
        id: 'claude-3',
        name: 'Claude 3 Sonnet',
        description: 'Specialized model for analysis and reasoning'
    }
];

const steps: FormStep[] = [
    {id: 'assessment', label: 'Assessment'},
    {id: 'basic', label: 'Basic Info'},
    {id: 'model', label: 'Model Config'},
    {id: 'security', label: 'Security'},
    {id: 'review', label: 'Review'}
];

const generateApiKey = (): string => {
    return 'sk_' + Math.random().toString(36).substr(2, 32);
};

const RegistrationForm: React.FC = () => {
    const [currentStep, setCurrentStep] = useState('assessment');
    const [isComplete, setIsComplete] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        projectDescription: '',
        referenceName: '',
        aiProvider: '',
        businessFunction: '',
        valueStream: '',
        developmentStatus: 'exploration',
        regions: [],
        countries: '',
        complianceChecks: [],
        documentation: '',
        contexts: [],
        features: [],
        basicInfo: {
            businessImpact: '',
            dataHandling: '',
            userAccess: '',
            expectedUsage: '',
            integrations: []
        },
        modelConfig: {
            projectSetup: '',
            modelAccessUrl: 'https://control-plane.hm.com/models',
            modelName: '',
            apiKey: '',
            monitoringUrl: 'https://control-plane.hm.com/monitoring'
        },
        securityConfig: {
            dataRetention: '',
            accessControls: [],
            encryptionLevel: '',
            backupFrequency: ''
        }
    });

    useEffect(() => {
        if (currentStep === 'review') {
            setFormData(prev => ({
                ...prev,
                modelConfig: {
                    ...prev.modelConfig,
                    apiKey: generateApiKey()
                }
            }));
        }
    }, [currentStep]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const {name, value} = e.target;

        if (name.includes('.')) {
            const [section, field] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section as keyof FormData],
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleArrayInputChange = (name: string, value: string, checked: boolean) => {
        const [section, field] = name.includes('.') ? name.split('.') : [null, name];

        if (section) {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section as keyof FormData],
                    [field]: checked
                        ? [...(prev[section as keyof FormData][field as keyof BasicInfo | keyof SecurityConfig] as string[]), value]
                        : (prev[section as keyof FormData][field as keyof BasicInfo | keyof SecurityConfig] as string[]).filter(item => item !== value)
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: checked
                    ? [...prev[name as keyof FormData] as string[], value]
                    : (prev[name as keyof FormData] as string[]).filter(item => item !== value)
            }));
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value, checked} = e.target;
        handleArrayInputChange(name, value, checked);
    };

    const handleNext = () => {
        const currentIndex = steps.findIndex(s => s.id === currentStep);
        if (currentIndex < steps.length - 1) {
            setCurrentStep(steps[currentIndex + 1].id);
            window.scrollTo(0, 0);
        }
    };

    const handleBack = () => {
        const currentIndex = steps.findIndex(s => s.id === currentStep);
        if (currentIndex > 0) {
            setCurrentStep(steps[currentIndex - 1].id);
            window.scrollTo(0, 0);
        }
    };

    const handleSubmit = () => {
        setIsComplete(true);
        console.log('Form submitted:', formData);
    };

    const handleCopyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            alert('Copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const renderAssessmentStep = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                    DESCRIBE the AI solution being explored or used:
                    <span className="text-red-600 ml-1">*</span>
                </label>
                <p className="text-sm text-gray-500 mb-2">
                    (also mention the type of AI being used and for what purpose)
                </p>
                <textarea
                    name="projectDescription"
                    value={formData.projectDescription}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                    REFERENCE NAME of this AI solution/project:
                    <span className="text-red-600 ml-1">*</span>
                </label>
                <p className="text-sm text-gray-500 mb-2">
                    (even if it doesn't have a formal name yet, provide the one your team is using)
                </p>
                <input
                    type="text"
                    name="referenceName"
                    value={formData.referenceName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                    Is this AI solution being used in any of the following CONTEXT:
                    <span className="text-red-600 ml-1">*</span>
                </label>
                <p className="text-sm text-gray-500 mb-3">
                    (note the options provided below might be prohibited, high risk, or limited risk under certain AI
                    regulations or internal policies; select all that apply)
                </p>
                <div className="space-y-3">
                    <div className="space-y-2">
                        {[
                            'Use of biometrics systems (for identification, verification or classifying into categories)',
                            'Facial recognition technologies or building facial recognition databases',
                            'Collecting data related to age, disability, or socio-economic circumstances to influence behaviour',
                            'AI techniques that may be deceptive or impair decision-making',
                            'Filtering, selecting, scoring, evaluating candidates for recruitment',
                            'Performance evaluation & monitoring, promotion, termination based on automated decision making',
                            'Allocating tasks to colleagues based on personality traits or productivity or efficiency',
                            'Inferring emotions or sentiment analysis of customers/colleagues',
                            'Classifying individuals or groups based on behaviour or personal traits',
                            'Use of Generative AI or General Purpose AI models for audio, image, video, text generation',
                            'Spam filters, chatbots, automated translation',
                            'AI used in machinery or lifts or personal protective equipment',
                            'AI used in toy safety or toys',
                            'AI as a safety component of a product'
                        ].map((context, index) => (
                            <div key={index} className="flex items-start">
                                <input
                                    type="checkbox"
                                    id={`context-${index}`}
                                    name="contexts"
                                    value={context}
                                    checked={formData.contexts.includes(context)}
                                    onChange={handleCheckboxChange}
                                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                />
                                <label htmlFor={`context-${index}`} className="ml-2 text-sm text-gray-900">
                                    {context}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                    More specifically, are there any of the following AI FEATURES in-scope of this solution?
                    <span className="text-red-600 ml-1">*</span>
                </label>
                <div className="space-y-2">
                    {[
                        'Knowledge extraction, analysis or summarisation',
                        'Text/image/voice generation',
                        'Text/image/voice recognition or analysis',
                        'Language translation',
                        'Intelligent diagnostics, predictions or recommendations',
                        'Robots or robotic process automation'
                    ].map((feature, index) => (
                        <div key={index} className="flex items-start">
                            <input
                                type="checkbox"
                                id={`feature-${index}`}
                                name="features"
                                value={feature}
                                checked={formData.features.includes(feature)}
                                onChange={handleCheckboxChange}
                                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                            <label htmlFor={`feature-${index}`} className="ml-2 text-sm text-gray-900">
                                {feature}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                    Name of the AI SOLUTION PROVIDER
                    <span className="text-red-600 ml-1">*</span>
                </label>
                <p className="text-sm text-gray-500 mb-2">
                    (mention specific vendor name if solution bought from outside, else name of BT tech center/Business
                    function who is building it internally)
                </p>
                <input
                    type="text"
                    name="aiProvider"
                    value={formData.aiProvider}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                    Business Function(s) this solution is for:
                    <span className="text-red-600 ml-1">*</span>
                </label>
                <input
                    type="text"
                    name="businessFunction"
                    value={formData.businessFunction}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                    Value Stream(s) this solution belongs to:
                    <span className="text-red-600 ml-1">*</span>
                </label>
                <input
                    type="text"
                    name="valueStream"
                    value={formData.valueStream}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                    Development Status of the solution:
                    <span className="text-red-600 ml-1">*</span>
                </label>
                <div className="space-y-2">
                    {[
                        {
                            value: 'exploration',
                            label: 'Exploration/proof-of-value/proof-of-concept on dummy or test data (no use of real data or real production environment)'
                        },
                        {
                            value: 'preparing',
                            label: 'Preparing to deploy/integrate with real production environment (not impacting real systems or markets yet)'
                        },
                        {
                            value: 'pilot',
                            label: 'Pilot/testing on real data or in production environment of one or more markets/functions'
                        },
                        {
                            value: 'operation',
                            label: 'Already in-operation in one or more markets/function'
                        }
                    ].map((status) => (
                        <div key={status.value} className="flex items-start">
                            <input
                                type="radio"
                                id={status.value}
                                name="developmentStatus"
                                value={status.value}
                                checked={formData.developmentStatus === status.value}
                                onChange={handleInputChange}
                                className="mt-1 h-4 w-4 text-blue-600 border-gray-300"
                            />
                            <label htmlFor={status.value} className="ml-2 text-sm text-gray-900">
                                {status.label}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                    Geographic Region(s) where this solution is/will be implemented:
                    <span className="text-red-600 ml-1">*</span>
                </label>
                <div className="space-y-2">
                    {[
                        'Africa',
                        'Asia',
                        'Australia',
                        'Europe',
                        'North America',
                        'South America'
                    ].map((region) => (
                        <div key={region} className="flex items-start">
                            <input
                                type="checkbox"
                                id={region}
                                name="regions"
                                value={region}
                                checked={formData.regions.includes(region)}
                                onChange={handleCheckboxChange}
                                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                            <label htmlFor={region} className="ml-2 text-sm text-gray-900">
                                {region}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                    Also specify the COUNTRIES in-scope:
                    <span className="text-red-600 ml-1">*</span>
                </label>
                <input
                    type="text"
                    name="countries"
                    value={formData.countries}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                    Has the AI solution or usecase been assessed by any of the following compliance functions?
                    <span className="text-red-600 ml-1">*</span>
                </label>
                <div className="space-y-2">
                    {[
                        'Data Privacy Office',
                        'Digital Ethics (part of AI Strategy team in AIAD tech center)',
                        'Cybersecurity'
                    ].map((compliance) => (
                        <div key={compliance} className="flex items-start">
                            <input
                                type="checkbox"
                                id={compliance}
                                name="complianceChecks"
                                value={compliance}
                                checked={formData.complianceChecks.includes(compliance)}
                                onChange={handleCheckboxChange}
                                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                            <label htmlFor={compliance} className="ml-2 text-sm text-gray-900">
                                {compliance}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                    Provide link(s) to documentation about the solution/project:
                </label>
                <input
                    type="text"
                    name="documentation"
                    value={formData.documentation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="Enter documentation links"
                />
            </div>
        </div>
    );

    const renderBasicInfoStep = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                    Business Impact Assessment
                    <span className="text-red-600 ml-1">*</span>
                </label>
                <textarea
                    name="basicInfo.businessImpact"
                    value={formData.basicInfo.businessImpact}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="Describe the expected business impact..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                    Data Handling Procedures
                    <span className="text-red-600 ml-1">*</span>
                </label>
                <textarea
                    name="basicInfo.dataHandling"
                    value={formData.basicInfo.dataHandling}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="Describe how data will be handled..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                    User Access Requirements
                    <span className="text-red-600 ml-1">*</span>
                </label>
                <input
                    type="text"
                    name="basicInfo.userAccess"
                    value={formData.basicInfo.userAccess}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="Specify user access requirements..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                    Expected Usage Pattern
                    <span className="text-red-600 ml-1">*</span>
                </label>
                <input
                    type="text"
                    name="basicInfo.expectedUsage"
                    value={formData.basicInfo.expectedUsage}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="Describe expected usage patterns..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                    System Integrations
                    <span className="text-red-600 ml-1">*</span>
                </label>
                <div className="space-y-2">
                    {[
                        'Internal APIs',
                        'External APIs',
                        'Database Systems',
                        'Legacy Systems',
                        'Cloud Services'
                    ].map((integration) => (
                        <div key={integration} className="flex items-start">
                            <input
                                type="checkbox"
                                id={integration}
                                name="basicInfo.integrations"
                                value={integration}
                                checked={formData.basicInfo.integrations.includes(integration)}
                                onChange={handleCheckboxChange}
                                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                            <label htmlFor={integration} className="ml-2 text-sm text-gray-900">
                                {integration}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderModelConfigStep = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                    Application Project Setup
                    <span className="text-red-600 ml-1">*</span>
                </label>
                <input
                    type="text"
                    name="modelConfig.projectSetup"
                    value={formData.modelConfig.projectSetup}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="Enter project setup details..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                    Select Model
                    <span className="text-red-600 ml-1">*</span>
                </label>
                <select
                    name="modelConfig.modelName"
                    value={formData.modelConfig.modelName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                >
                    <option value="">Select a model</option>
                    {AVAILABLE_MODELS.map(model => (
                        <option key={model.id} value={model.id}>
                            {model.name} - {model.description}
                        </option>
                    ))}
                </select>
            </div>

            <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-md">
                <p>Note: The following will be generated upon submission:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Model Access URL</li>
                    <li>API Key</li>
                    <li>Monitoring URL</li>
                </ul>
            </div>
        </div>
    );

    const renderSecurityStep = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                    Data Retention Period
                    <span className="text-red-600 ml-1">*</span>
                </label>
                <select
                    name="securityConfig.dataRetention"
                    value={formData.securityConfig.dataRetention}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                >
                    <option value="">Select retention period</option>
                    <option value="30days">30 Days</option>
                    <option value="60days">60 Days</option>
                    <option value="90days">90 Days</option>
                    <option value="180days">180 Days</option>
                    <option value="1year">1 Year</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                    Access Control Measures
                    <span className="text-red-600 ml-1">*</span>
                </label>
                <div className="space-y-2">
                    {[
                        'IP Restriction',
                        'Two-Factor Authentication',
                        'Role-Based Access Control',
                        'Single Sign-On',
                        'API Key Rotation'
                    ].map((control) => (
                        <div key={control} className="flex items-start">
                            <input
                                type="checkbox"
                                id={control}
                                name="securityConfig.accessControls"
                                value={control}
                                checked={formData.securityConfig.accessControls.includes(control)}
                                onChange={handleCheckboxChange}
                                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                            <label htmlFor={control} className="ml-2 text-sm text-gray-900">
                                {control}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                    Encryption Level
                    <span className="text-red-600 ml-1">*</span>
                </label>
                <select
                    name="securityConfig.encryptionLevel"
                    value={formData.securityConfig.encryptionLevel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                >
                    <option value="">Select encryption level</option>
                    <option value="standard">Standard (AES-256)</option>
                    <option value="high">High (AES-256 + Field Level)</option>
                    <option value="maximum">Maximum (AES-256 + Field Level + HSM)</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                    Backup Frequency
                    <span className="text-red-600 ml-1">*</span>
                </label>
                <select
                    name="securityConfig.backupFrequency"
                    value={formData.securityConfig.backupFrequency}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                >
                    <option value="">Select backup frequency</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </select>
            </div>
        </div>
    );

    const renderReviewStep = () => {
        const selectedModel = AVAILABLE_MODELS.find(m => m.id === formData.modelConfig.modelName);

        return (
            <div className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-blue-900 mb-4">Model Configuration Summary</h3>

                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium text-blue-900">Selected Model</h4>
                            <p className="text-sm text-blue-800">{selectedModel?.name} - {selectedModel?.description}</p>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-blue-900">Project Setup</h4>
                            <p className="text-sm text-blue-800">{formData.modelConfig.projectSetup}</p>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-blue-900">Model Access URL</h4>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={formData.modelConfig.modelAccessUrl}
                                    readOnly
                                    className="flex-1 px-3 py-2 bg-white border border-blue-300 rounded-md text-sm text-blue-900"
                                />
                                <button
                                    onClick={() => handleCopyToClipboard(formData.modelConfig.modelAccessUrl)}
                                    className="px-3 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-blue-900">API Key</h4>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="password"
                                    value={formData.modelConfig.apiKey}
                                    readOnly
                                    className="flex-1 px-3 py-2 bg-white border border-blue-300 rounded-md text-sm text-blue-900"
                                />
                                <button
                                    onClick={() => handleCopyToClipboard(formData.modelConfig.apiKey)}
                                    className="px-3 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-blue-900">Monitoring URL</h4>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={formData.modelConfig.monitoringUrl}
                                    readOnly
                                    className="flex-1 px-3 py-2 bg-white border border-blue-300 rounded-md text-sm text-blue-900"
                                />
                                <button
                                    onClick={() => handleCopyToClipboard(formData.modelConfig.monitoringUrl)}
                                    className="px-3 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Assessment Summary</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p><span className="font-medium">Project:</span> {formData.referenceName}</p>
                            <p><span className="font-medium">Description:</span> {formData.projectDescription}</p>
                            <p><span className="font-medium">Provider:</span> {formData.aiProvider}</p>
                            <p><span className="font-medium">Business Function:</span> {formData.businessFunction}</p>
                            <p><span className="font-medium">Value Stream:</span> {formData.valueStream}</p>
                            <p><span className="font-medium">Development Status:</span> {formData.developmentStatus}</p>
                            <div>
                                <span className="font-medium">Regions:</span>
                                <ul className="mt-1 list-disc list-inside">
                                    {formData.regions.map(region => (
                                        <li key={region}>{region}</li>
                                    ))}
                                </ul>
                            </div>
                            <p><span className="font-medium">Countries:</span> {formData.countries}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Basic Information</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p><span className="font-medium">Business Impact:</span> {formData.basicInfo.businessImpact}
                            </p>
                            <p><span className="font-medium">Data Handling:</span> {formData.basicInfo.dataHandling}</p>
                            <p><span className="font-medium">User Access:</span> {formData.basicInfo.userAccess}</p>
                            <p><span className="font-medium">Expected Usage:</span> {formData.basicInfo.expectedUsage}
                            </p>
                            <div>
                                <span className="font-medium">Integrations:</span>
                                <ul className="mt-1 list-disc list-inside">
                                    {formData.basicInfo.integrations.map(integration => (
                                        <li key={integration}>{integration}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Security Configuration</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p><span
                                className="font-medium">Data Retention:</span> {formData.securityConfig.dataRetention}
                            </p>
                            <p><span
                                className="font-medium">Encryption Level:</span> {formData.securityConfig.encryptionLevel}
                            </p>
                            <p><span
                                className="font-medium">Backup Frequency:</span> {formData.securityConfig.backupFrequency}
                            </p>
                            <div>
                                <span className="font-medium">Access Controls:</span>
                                <ul className="mt-1 list-disc list-inside">
                                    {formData.securityConfig.accessControls.map(control => (
                                        <li key={control}>{control}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow rounded-lg">
                    {/* Header */}
                    <div className="px-8 pt-6">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Register an AI Solution</h1>
                        <p className="text-sm text-gray-600 mb-8">
                            Please provide details to register an Artificial Intelligence (AI) project/solution.
                            Registration will take only 5-7 minutes of your time.
                        </p>

                        {/* Progress Steps */}
                        <div className="flex justify-between items-center mb-8">
                            {steps.map((step, index) => (
                                <div key={step.id} className="flex items-center">
                                    <div className={`flex flex-col items-center ${
                                        currentStep === step.id ? 'text-blue-600' : 'text-gray-400'
                                    }`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                                           ${currentStep === step.id ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                                            {index + 1}
                                        </div>
                                        <span className="mt-2 text-sm">{step.label}</span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className="w-24 h-px bg-gray-200 mx-2"/>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="px-8 py-6">
                        {currentStep === 'assessment' && renderAssessmentStep()}
                        {currentStep === 'basic' && renderBasicInfoStep()}
                        {currentStep === 'model' && renderModelConfigStep()}
                        {currentStep === 'security' && renderSecurityStep()}
                        {currentStep === 'review' && renderReviewStep()}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8">
                            {currentStep !== steps[0].id && (
                                <button
                                    onClick={handleBack}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                >
                                    Back
                                </button>
                            )}
                            {!isComplete && (
                                <button
                                    onClick={currentStep === steps[steps.length - 1].id ? handleSubmit : handleNext}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    {currentStep === steps[steps.length - 1].id ? 'Submit' : 'Next'}
                                </button>
                            )}
                            {isComplete && (
                                <div className="text-green-600 flex items-center">
                                    <span className="mr-2">✓</span> Submitted Successfully
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationForm;