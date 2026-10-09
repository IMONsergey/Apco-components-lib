import { Component, type ReactNode } from 'react';

/** A failed lazy demo must not remove the surrounding navigation and source documentation. */
export default class PreviewBoundary extends Component<{children: ReactNode}, {failed: boolean}> {
 state = {failed: false};
 static getDerivedStateFromError() { return {failed: true}; }
 render() {
  if (this.state.failed) return <div className="ds-preview-error" role="alert">
   <strong>Preview could not be loaded</strong>
   <span>The component documentation is still available.</span>
   <button type="button" onClick={() => window.location.reload()}>Reload preview</button>
  </div>;
  return this.props.children;
 }
}
