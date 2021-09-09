import { Navigation } from "../components/Navigation"

export default function Mint() {
    return (
      <div>
        <Navigation items={['Market', 'Mint','Account']} />
        <h2>Mint</h2>
      </div>
    )
}