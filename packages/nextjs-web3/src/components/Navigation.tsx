import Link from 'next/link'
import { SITE_PREFERENCES } from "../config/constants"

type NavigationProps = {
    title?: string,
    items: string[]
}

export const Navigation = ({ title = SITE_PREFERENCES.SITE_TITLE, items }: NavigationProps) => {
    const defaultItems : string[] = [
        "Market",
        "Mint",
        "Account",
        "Terms"
    ];

    return (
        <header className="container-fluid mx-auto flex">
            <div> {/* LOGO */}
                <Link href="/"><a>{ title }</a></Link>
            </div>
            <nav className="flex flex-1 justify-end">
                <ul className="flex">
                    { defaultItems.map((i , key) => 
                    <li key={key}>
                        <Link href={'/' + i.toLowerCase()}>
                            {i}
                        </Link>
                    </li>
                    )}
                </ul>
            </nav>
        </header>
    )
}