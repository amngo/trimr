'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function ApiDocsPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        trimr API Documentation
                    </h1>
                    <p className="text-gray-600">
                        Interactive API documentation for the trimr URL
                        shortening service
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <SwaggerUI url="/api/docs" />
                </div>
            </div>
        </div>
    );
}
