import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home, MessageSquare, PhoneCall } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled React Error in CLASSIC FASHIONS app:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  private handleHardReset = () => {
    try {
      sessionStorage.clear();
      // Keep collection intact if possible, or clear corrupt keys
      window.location.href = window.location.pathname;
    } catch {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#181715] flex items-center justify-center p-4 sm:p-6 font-sans">
          <div className="max-w-xl w-full bg-white rounded-2xl border border-[#E6E0D2] shadow-xl p-6 sm:p-8 space-y-6">
            {/* Header Badge */}
            <div className="flex items-center justify-between border-b border-[#F0ECE1] pb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#82553E]" />
                <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#82553E] uppercase">
                  CLASSIC FASHIONS
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-medium border border-amber-200">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                Display Restored
              </span>
            </div>

            {/* Error Content */}
            <div className="space-y-3">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#181715] tracking-tight">
                Temporary Display Issue
              </h1>
              <p className="text-sm text-[#666055] leading-relaxed">
                The page encountered an unexpected rendering error. Your data and catalogue selections are preserved.
                Click below to restore the display.
              </p>

              {this.state.error && (
                <div className="mt-3 p-3.5 rounded-lg bg-[#F5F2EB] border border-[#E8DFD8] text-xs font-mono text-[#524B42] overflow-x-auto max-h-36">
                  {this.state.error.message || String(this.state.error)}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#82553E] hover:bg-[#6D4430] text-white font-medium text-sm transition-all shadow-sm active:scale-[0.98] cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Website
              </button>

              <button
                onClick={this.handleHardReset}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#F0ECE1] hover:bg-[#E6E0D2] text-[#181715] font-medium text-sm transition-all active:scale-[0.98] cursor-pointer"
              >
                <Home className="w-4 h-4" />
                Reset to Home
              </button>
            </div>

            {/* Direct Contact Footer */}
            <div className="pt-4 border-t border-[#F0ECE1] flex flex-wrap items-center justify-between gap-3 text-xs text-[#8C8275]">
              <span>Direct Wholesale Enquiry Support:</span>
              <div className="flex items-center gap-3">
                <a
                  href="tel:+919842444390"
                  className="inline-flex items-center gap-1.5 text-[#82553E] font-medium hover:underline"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  +91 98424 44390
                </a>
                <span>•</span>
                <a
                  href="https://wa.me/919842444390"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#2E7D32] font-medium hover:underline"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
