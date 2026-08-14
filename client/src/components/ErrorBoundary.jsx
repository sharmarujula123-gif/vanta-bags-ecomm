import { tw } from "../utils/twStyles.js";
import React from "react";

export default class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (!this.state.hasError) return this.props.children;
    return <main className="mx-auto max-w-3xl px-5 py-24 text-center"><p className={tw("vanta-eyebrow")}>VANTA BAGS</p><h1 className={tw("vanta-serif mt-5 text-5xl")}>Something went wrong.</h1><p className="mt-4 text-stone-500">The page hit an unexpected snag. Refresh and try again.</p><button onClick={()=>window.location.reload()} className="mt-8 bg-stone-950 px-6 py-3 text-sm font-semibold text-white">Refresh</button></main>;
  }
}
