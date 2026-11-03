import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center p-4">
          <div className="bg-white border border-[#a1c0d1]/40 rounded-3xl shadow-card p-8 max-w-lg w-full text-center">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-rose-100">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <h1 className="text-2xl font-bold text-[#00203d] mb-2">
              Đã xảy ra lỗi không mong muốn
            </h1>
            
            <p className="text-[#1f4f5a] text-sm mb-6 leading-relaxed">
              Hệ thống đã tự động ghi nhận sự cố để bảo vệ dữ liệu của bạn. Bạn có thể tải lại trang hoặc quay về trạng thái ban đầu.
            </p>

            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <div className="mb-6 p-3 bg-[#f0f4f8] border border-[#a1c0d1]/40 rounded-xl text-left text-xs font-mono text-[#1f4f5a] overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#00203d] text-white font-medium hover:bg-[#0f383f] transition-colors shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Tải lại trang
              </button>
              <button
                onClick={this.handleReset}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[#a1c0d1]/60 text-[#1f4f5a] font-medium hover:bg-[#f0f4f8] transition-colors"
              >
                <Home className="w-4 h-4" />
                Về trạng thái ban đầu
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
