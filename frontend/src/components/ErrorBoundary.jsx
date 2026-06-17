import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("App render error:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="app-state error">
          <p>Something went wrong while rendering the page.</p>
          <p style={{ fontSize: "0.95rem", maxWidth: "42rem" }}>{this.state.error.message}</p>
          <button type="button" className="app-state-retry" onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
