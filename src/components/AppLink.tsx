import { forwardRef } from 'react';
import {
  Link as RouterLink,
  NavLink as RouterNavLink,
  type LinkProps,
  type NavLinkProps,
} from 'react-router-dom';

/**
 * Internal navigation defaults to a native View Transition.
 *
 * React Router only starts a transition when a link opts in. Centralising that
 * default keeps page changes cinematic without every page remembering to add
 * the prop, while still allowing callers to opt out (for example, a link that
 * navigates while a modal is still closing).
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { viewTransition = true, ...props },
  ref
) {
  return <RouterLink ref={ref} viewTransition={viewTransition} {...props} />;
});

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  function NavLink({ viewTransition = true, ...props }, ref) {
    return (
      <RouterNavLink ref={ref} viewTransition={viewTransition} {...props} />
    );
  }
);
