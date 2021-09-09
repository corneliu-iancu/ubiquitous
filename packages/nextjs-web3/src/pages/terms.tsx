import { Navigation } from "../components/Navigation"

// Serves terms and conditions page.
export default function TermsAndConditions() {
    return (
      <div>
        <Navigation items={['Market', 'Mint', 'Terms','Account']} />
        <h2>Account received offers</h2>
      </div>
    )
}