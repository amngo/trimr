import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'trimr API',
        version: '1.0.0',
        description: 'API documentation for trimr URL shortening service',
    },
    servers: [
        {
            url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
            description: 'Development server',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        schemas: {
            Link: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        description: 'Unique identifier for the link',
                    },
                    name: {
                        type: 'string',
                        description: 'Display name for the link',
                    },
                    slug: {
                        type: 'string',
                        description: 'URL slug for the short link',
                    },
                    url: {
                        type: 'string',
                        format: 'uri',
                        description: 'Original URL to redirect to',
                    },
                    enabled: {
                        type: 'boolean',
                        description: 'Whether the link is active',
                    },
                    clickCount: {
                        type: 'integer',
                        description:
                            'Number of times the link has been clicked',
                    },
                    visitorCount: {
                        type: 'integer',
                        description: 'Number of unique visitors',
                    },
                    userId: {
                        type: 'string',
                        description: 'ID of the user who created the link',
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'When the link was created',
                    },
                    expiresAt: {
                        type: 'string',
                        format: 'date-time',
                        nullable: true,
                        description: 'When the link expires (optional)',
                    },
                    startsAt: {
                        type: 'string',
                        format: 'date-time',
                        nullable: true,
                        description: 'When the link becomes active (optional)',
                    },
                },
                required: ['id', 'name', 'slug', 'url', 'enabled', 'userId'],
            },
            AnalyticsOverview: {
                type: 'object',
                properties: {
                    summary: {
                        type: 'object',
                        properties: {
                            totalLinks: {
                                type: 'integer',
                                description: 'Total number of links',
                            },
                            activeLinks: {
                                type: 'integer',
                                description: 'Number of active links',
                            },
                            inactiveLinks: {
                                type: 'integer',
                                description: 'Number of inactive links',
                            },
                            expiredLinks: {
                                type: 'integer',
                                description: 'Number of expired links',
                            },
                            pendingLinks: {
                                type: 'integer',
                                description: 'Number of pending links',
                            },
                            totalClicks: {
                                type: 'integer',
                                description: 'Total number of clicks',
                            },
                            totalVisitors: {
                                type: 'integer',
                                description: 'Total number of unique visitors',
                            },
                            averageClicksPerLink: {
                                type: 'string',
                                description: 'Average clicks per link',
                            },
                        },
                    },
                    topLinks: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                                name: { type: 'string' },
                                slug: { type: 'string' },
                                url: { type: 'string' },
                                clicks: { type: 'integer' },
                                visitors: { type: 'integer' },
                                ctr: { type: 'string' },
                            },
                        },
                    },
                    topCountries: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                country: { type: 'string' },
                                clicks: { type: 'integer' },
                                percentage: { type: 'string' },
                            },
                        },
                    },
                    dailyActivity: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                date: { type: 'string', format: 'date' },
                                clicks: { type: 'integer' },
                            },
                        },
                    },
                    recentActivity: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                                timestamp: {
                                    type: 'string',
                                    format: 'date-time',
                                },
                                country: { type: 'string', nullable: true },
                                linkName: { type: 'string' },
                                linkSlug: { type: 'string' },
                            },
                        },
                    },
                },
            },
            Error: {
                type: 'object',
                properties: {
                    error: {
                        type: 'string',
                        description: 'Error message',
                    },
                    code: {
                        type: 'string',
                        description: 'Error code',
                    },
                },
                required: ['error'],
            },
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
};

const options = {
    definition: swaggerDefinition,
    apis: ['./src/app/api/**/*.ts'], // Path to the API routes
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
