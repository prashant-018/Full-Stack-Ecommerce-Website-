/**
 * API Debug Panel Component
 * Shows API configuration and connection status
 * Only visible in development or when VITE_DEBUG=true
 */
import React, { useState, useEffect } from 'react';
import { getApiDebugInfo } from '../config/api.config';
import api from '../services/api';

const ApiDebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState({
    loading: false,
    connected: false,
    error: null,
    responseTime: null
  });
  const debugInfo = getApiDebugInfo();

  // Only show in development or when debug mode is enabled
  const showDebug = import.meta.env.DEV || import.meta.env.VITE_DEBUG === 'true';
  
  if (!showDebug) {
    return null;
  }

  const testApiConnection = async () => {
    setApiStatus({ loading: true, connected: false, error: null, responseTime: null });
    const startTime = Date.now();
    
    try {
      const response = await api.get('/health');
      const responseTime = Date.now() - startTime;
      setApiStatus({
        loading: false,
        connected: response.status === 200,
        error: null,
        responseTime
      });
    } catch (error) {
      const responseTime = Date.now() - startTime;
      setApiStatus({
        loading: false,
        connected: false,
        error: error.message || 'Connection failed',
        responseTime
      });
    }
  };

  useEffect(() => {
    // Auto-test on mount
    testApiConnection();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        >
          🔍 API Debug
        </button>
      ) : (
        <div className="bg-white border-2 border-gray-300 rounded-lg shadow-2xl p-4 w-96 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">API Debug Panel</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 text-sm">
            {/* Environment Info */}
            <div className="border-b pb-2">
              <h4 className="font-semibold text-gray-700 mb-1">Environment</h4>
              <div className="space-y-1 text-xs">
                <div><span className="font-medium">Mode:</span> {debugInfo.mode}</div>
                <div><span className="font-medium">Is Dev:</span> {debugInfo.isDev ? 'Yes' : 'No'}</div>
                <div><span className="font-medium">Is Prod:</span> {import.meta.env.PROD ? 'Yes' : 'No'}</div>
              </div>
            </div>

            {/* API URL Info */}
            <div className="border-b pb-2">
              <h4 className="font-semibold text-gray-700 mb-1">API Configuration</h4>
              <div className="space-y-1 text-xs break-all">
                <div>
                  <span className="font-medium">VITE_API_URL:</span>
                  <div className="text-red-600 font-mono bg-gray-100 p-1 rounded mt-1">
                    {debugInfo.viteApiUrl}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Computed Base URL:</span>
                  <div className="text-green-600 font-mono bg-gray-100 p-1 rounded mt-1">
                    {debugInfo.computedBaseUrl}
                  </div>
                </div>
              </div>
            </div>

            {/* Connection Status */}
            <div className="border-b pb-2">
              <h4 className="font-semibold text-gray-700 mb-1">Connection Status</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  {apiStatus.loading ? (
                    <span className="text-yellow-600">Testing...</span>
                  ) : apiStatus.connected ? (
                    <span className="text-green-600">✅ Connected</span>
                  ) : (
                    <span className="text-red-600">❌ Failed</span>
                  )}
                </div>
                {apiStatus.responseTime && (
                  <div>
                    <span className="font-medium">Response Time:</span> {apiStatus.responseTime}ms
                  </div>
                )}
                {apiStatus.error && (
                  <div className="text-red-600 text-xs bg-red-50 p-2 rounded">
                    {apiStatus.error}
                  </div>
                )}
                <button
                  onClick={testApiConnection}
                  disabled={apiStatus.loading}
                  className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 disabled:opacity-50"
                >
                  {apiStatus.loading ? 'Testing...' : 'Test Connection'}
                </button>
              </div>
            </div>

            {/* All Environment Variables */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-1">All Env Vars</h4>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                {JSON.stringify(debugInfo.allEnvVars, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiDebugPanel;

