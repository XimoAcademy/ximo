/**
 * Demo mode.
 *
 * While Ximo is offered as a free demo, access to the app is granted without a
 * real payment. The subscribe screen shows a free "start demo" entry instead of
 * Stripe checkout, and the policies reflect that no one is charged.
 *
 * Demo is ON by default during this phase. To move to the paid launch, set
 * `NEXT_PUBLIC_DEMO_MODE=false` in the environment — billing then takes over
 * with no code changes.
 */
export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE !== "false";
}
