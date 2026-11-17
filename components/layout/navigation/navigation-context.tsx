import type { ActiveNavigation } from './navigation-system';

// Internal shared state
const navigationContext: {
    activeNavigation: ActiveNavigation | null;
    setActiveNavigation: (nav: ActiveNavigation | null) => void;
} = {
    activeNavigation: null,
    setActiveNavigation: () => {}
};

// Hook for NavigationSystem to update the state
export function setNavigationContext(nav: ActiveNavigation | null) {
    navigationContext.activeNavigation = nav;
}

// API for PageNavigation (and anywhere else) to read it
export function getNavigationContext() {
    return navigationContext;
}
