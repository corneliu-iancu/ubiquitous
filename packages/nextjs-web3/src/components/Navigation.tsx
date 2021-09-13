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
        /* Black color: #1f1f1f */
        <header className="container-fluid mx-auto flex border-b border-black h-16 items-center">
            <div> {/* LOGO */}
                <Link href="/"><a>{ title }</a></Link>
            </div>
            <nav className="flex flex-1 justify-end">
                <ul className="flex">
                    { defaultItems.map((i , key) => 
                    <li key={key}>
                        <Link href={'/' + i.toLowerCase()}>
                            <a className="px-4">{i}</a>
                        </Link>
                    </li>
                    )}
                </ul>
            </nav>
        </header>
    )
}