import { Component, type ErrorInfo, type ReactNode } from 'react';
import './ErrorBoundary.css';

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled storefront error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="error-fallback" role="alert">
          <div className="container error-fallback__inner">
            <p className="eyebrow">Un imprévu</p>
            <h1>Cette page n'a pas pu s'afficher.</h1>
            <p>
              Rechargez la page pour reprendre votre visite. Votre panier et
              vos favoris enregistrés sur cet appareil sont conservés.
            </p>
            <div className="error-fallback__actions">
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => window.location.reload()}
              >
                Recharger la page
              </button>
              <a href="/" className="btn btn--outline">
                Retour à l'accueil
              </a>
            </div>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}
